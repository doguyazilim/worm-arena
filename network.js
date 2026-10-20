/* ========================================================
   WORM ARENA - ÇOK OYUNCULU AĞ MOTORU (WebRTC / PeerJS)
   Sunucu kurmaya gerek kalmadan internet veya Wi-Fi üzerinden
   arkadaşların aynı odaya katılarak eş zamanlı oynamasını sağlar.
   ======================================================== */

class NetworkManager {
  constructor(game) {
    this.game = game;
    this.peer = null;
    this.isHost = false;
    this.isMultiplayer = false;
    this.roomCode = null;
    this.connections = new Map(); // peerId -> DataConnection
    this.lobbyPlayers = new Map(); // peerId -> { id, name, skinId, hatId, isHost }
    this.remotePlayers = new Map(); // peerId -> Worm nesnesi
    this.hostConn = null; // Client için: host DataConnection
    this.myPeerId = null;
    this.isServerMode = false; // 7/24 Dedicated WebSocket sunucu modu
    this.ws = null; // WebSocket bağlantı nesnesi

    // Client lobi el sıkışma ve teyit kontrolü
    this.clientHelloInterval = null;
    this.hasReceivedHelloAck = false;
    this.hostLobbyPlayers = null;

    // Input gönderme kısıtlayıcı (bant genişliği tasarrufu)
    this.lastSentAngle = -999;
    this.lastSentBoosting = null;
    this.lastInputTime = 0;

    // Arka plan / Sinyal yenileme
    this.heartbeatInterval = null;
    this.isReconnectingHost = false;

    // Mobil cihazlarda WhatsApp / sekme geçişi sonrası otomatik bağlantı kurtarma
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.handleAppResume();
        }
      });
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => this.handleAppResume());
      window.addEventListener('pageshow', () => this.handleAppResume());
    }

    // Callback fonksiyonları
    this.onPlayerJoined = null;
    this.onPlayerLeft = null;
    this.onRoomReady = null;
    this.onLobbyUpdated = null;
    this.onError = null;
  }

  // Rastgele 4 haneli kolay oda kodu üret (örn: 7842)
  generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // STUN & TURN Sunucu Listesi (Google, Cloudflare ve Küresel TURN Aktarıcıları)
  // NAT / Mobil 4G/5G / CGNAT arkasındaki tüm tarayıcıların birbiriyle kesin bağlantı kurmasını sağlar.
  getIceServers() {
    return [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
          'stun:stun.cloudflare.com:3478'
        ]
      },
      {
        urls: [
          'turn:eu-0.turn.peerjs.com:3478',
          'turn:us-0.turn.peerjs.com:3478'
        ],
        username: 'peerjs',
        credential: 'peerjsp'
      },
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelay',
        credential: 'openrelay'
      }
    ];
  }

  // ==================== 1. ODA KUR (HOST OL) ====================
  createRoom(customCode = null) {
    return new Promise((resolve, reject) => {
      this.disconnect();

      this.isHost = true;
      this.isMultiplayer = true;
      this.roomCode = String(customCode || this.generateRoomCode()).trim().replace(/[^0-9a-zA-Z]/g, '');
      const peerId = `wormarena-${this.roomCode}`;

      if (typeof Peer === 'undefined') {
        if (window.showInGameAlert) {
          const msg = window.I18N ? window.I18N.t('alert_conn_error_msg') : 'Multiplayer network library could not be loaded. Please check your internet connection.';
          const title = window.I18N ? window.I18N.t('alert_conn_error_title') : '⚠️ CONNECTION ERROR';
          window.showInGameAlert(msg, 'warning', title);
        }
        reject(new Error('PeerJS not loaded'));
        return;
      }

      let isFinished = false;
      const timeoutTimer = setTimeout(() => {
        if (!isFinished && (!this.peer || !this.myPeerId)) {
          isFinished = true;
          console.warn('Oda sunucusu 6.5s içinde yanıt vermedi. Yeni oda kodu ile tekrar deneniyor...');
          try { if (this.peer) this.peer.destroy(); } catch (e) {}
          this.peer = null;
          this.createRoom(this.generateRoomCode()).then(resolve).catch(reject);
        }
      }, 6500);

      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: this.getIceServers(),
          sdpSemantics: 'unified-plan'
        }
      });

      this.peer.on('open', (id) => {
        if (isFinished) return;
        isFinished = true;
        clearTimeout(timeoutTimer);
        this.myPeerId = id;
        console.log('Oda kuruldu! Kod:', this.roomCode, 'Peer ID:', id);

        // Host'un kendi lobi kaydını oluştur
        this.lobbyPlayers.clear();
        this.remotePlayers.clear();
        this.connections.clear();

        if (this.onRoomReady) this.onRoomReady(this.roomCode);
        if (this.onLobbyUpdated) this.onLobbyUpdated(this.getLobbyList(), this.roomCode);

        // Arka plan / uyku durumunda sinyali canlı tutan periyodik kontrol
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = setInterval(() => {
          if (!this.isHost || !this.roomCode) return;
          const isPeerDead = !this.peer || this.peer.destroyed || this.peer.disconnected;
          const isSocketDead = this.peer && this.peer.socket && (
            this.peer.socket.disconnected ||
            (this.peer.socket._ws && this.peer.socket._ws.readyState !== 1)
          );

          if (isPeerDead || isSocketDead) {
            console.log('Heartbeat: Host peer bağlantısı kopmuş, baştan kuruluyor...');
            this.recreateHostPeer();
          } else {
            try {
              if (this.peer && this.peer.socket && this.peer.socket._ws && this.peer.socket._ws.readyState === 1) {
                this.peer.socket._ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
              }
            } catch (e) {}
          }

          // Lobideyken periyodik lobi yayını (her saniye tüm bağlı istemcileri senkronize tut)
          if (this.game && this.game.state !== 'PLAYING' && this.connections.size > 0) {
            this.broadcastLobbyState();
          }
        }, 1200);

        resolve(this.roomCode);
      });

      this.peer.on('connection', (conn) => {
        this.handleIncomingConnection(conn);
      });

      this.peer.on('disconnected', () => {
        console.warn('Oda sahibi sinyal sunucusundan ayrıldı (arka plan / sekme geçişi). Yeniden bağlanılıyor...');
        this.handleAppResume();
      });

      this.peer.on('error', (err) => {
        console.warn('Host Peer hata:', err);
        if (!isFinished) {
          isFinished = true;
          clearTimeout(timeoutTimer);
          if (err && err.type === 'unavailable-id') {
            this.createRoom(this.generateRoomCode()).then(resolve).catch(reject);
          } else {
            if (this.onError) this.onError(err);
            reject(err);
          }
        } else {
          // Sonradan gelen kopma hatalarında sessizce yeniden oluştur
          this.handleAppResume();
        }
      });
    });
  }

  // Mobil cihazda WhatsApp / başka uygulama sonrası oyuna dönüldüğünde çağrılır
  handleAppResume() {
    if (!this.isHost || !this.roomCode) return;
    console.log('Uygulama ön plana geldi. Oda bağlantısı denetleniyor:', this.roomCode);

    const isPeerDead = !this.peer || this.peer.destroyed || this.peer.disconnected;
    const isSocketDead = this.peer && this.peer.socket && (
      this.peer.socket.disconnected ||
      (this.peer.socket._ws && this.peer.socket._ws.readyState !== 1)
    );

    if (isPeerDead || isSocketDead) {
      console.log('Host sinyal bağlantısı kopmuş görünüyor. Baştan kuruluyor...');
      this.recreateHostPeer();
      return;
    }

    try {
      if (this.peer && this.peer.socket && this.peer.socket._ws && this.peer.socket._ws.readyState === 1) {
        this.peer.socket._ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
      }
    } catch (e) {
      console.warn('Soket heartbeat hatası, baştan kuruluyor:', e);
      this.recreateHostPeer();
    }
  }

  // Gerekirse aynı oda kodu ile Host Peer'ı sıfırdan ayağa kaldır
  recreateHostPeer() {
    if (!this.isHost || !this.roomCode || this.isReconnectingHost) return;
    this.isReconnectingHost = true;
    const peerId = `wormarena-${this.roomCode}`;

    try {
      if (this.peer) this.peer.destroy();
    } catch (e) {}
    this.peer = null;

    // Sunucu tarafında eski soketin temizlenmesi için kısa bir bekleme
    setTimeout(() => {
      if (!this.isHost || !this.roomCode) {
        this.isReconnectingHost = false;
        return;
      }

      console.log('Host Peer sıfırdan oluşturuluyor:', peerId);
      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: this.getIceServers(),
          sdpSemantics: 'unified-plan'
        }
      });

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        this.isReconnectingHost = false;
        console.log('Host Peer başarıyla yeniden aktif edildi:', id);
        if (this.onLobbyUpdated) this.onLobbyUpdated(this.getLobbyList(), this.roomCode);
        if (this.game && this.game.state !== 'PLAYING') {
          this.broadcastLobbyState();
        }
      });

      this.peer.on('connection', (conn) => {
        this.handleIncomingConnection(conn);
      });

      this.peer.on('disconnected', () => {
        console.warn('Host sinyal koptu, yeniden deneniyor...');
        setTimeout(() => this.handleAppResume(), 1000);
      });

      this.peer.on('error', (err) => {
        console.warn('Host Peer hata:', err);
        this.isReconnectingHost = false;
        if (err && err.type === 'unavailable-id') {
          // Eski soket henüz tamamen kapanmamışsa biraz bekleyip tekrar dene
          setTimeout(() => {
            if (this.isHost && this.roomCode) {
              this.recreateHostPeer();
            }
          }, 600);
        }
      });
    }, 150);
  }

  // Bağlantının açık ve veri aktarmaya hazır olduğunu doğrula
  isConnReady(conn) {
    if (!conn) return false;
    if (conn.open) return true;
    if (conn.dataChannel && conn.dataChannel.readyState === 'open') {
      conn._open = true;
      return true;
    }
    return false;
  }

  // Gelen arkadaş bağlantısını karşıla (Host tarafı)
  handleIncomingConnection(conn) {
    const peerId = conn.peer;

    const markConnected = () => {
      this.connections.set(peerId, conn);
      if (conn.dataChannel && conn.dataChannel.readyState === 'open') {
        conn._open = true;
      }
      console.log('Arkadaş veri kanalı bağlandı:', peerId);

      // Lobideysek hemen geçici kayıt aç veya güncelle, odayı anında senkronize et
      if (this.game.state !== 'PLAYING') {
        if (!this.lobbyPlayers.has(peerId)) {
          this.lobbyPlayers.set(peerId, {
            id: peerId,
            name: 'Misafir_' + String(peerId).slice(-4),
            skinId: 'white_king',
            hatId: 'none',
            isHost: false,
            ready: false
          });
        }
        this.broadcastLobbyState();
      }
    };

    // Bağlantıyı HEMEN kaydet - hazır olmasını bekleme!
    this.connections.set(peerId, conn);

    // Lobideysek anında lobiye ekle ki oda sahibi beklemeden görsün!
    if (this.game.state !== 'PLAYING') {
      if (!this.lobbyPlayers.has(peerId)) {
        this.lobbyPlayers.set(peerId, {
          id: peerId,
          name: 'Misafir_' + String(peerId).slice(-4),
          skinId: 'white_king',
          hatId: 'none',
          isHost: false,
          ready: false
        });
      }
      this.broadcastLobbyState();
    }

    if (this.isConnReady(conn)) {
      markConnected();
    } else {
      conn.on('open', markConnected);
      if (conn.dataChannel) {
        if (conn.dataChannel.readyState === 'open') {
          markConnected();
        } else {
          conn.dataChannel.addEventListener('open', markConnected, { once: true });
        }
      }
    }

    conn.on('data', (data) => {
      // Veri akışı varsa kanal kesinlikle açıktır!
      this.connections.set(peerId, conn);
      if (conn.dataChannel && conn.dataChannel.readyState === 'open') {
        conn._open = true;
      }
      this.handleClientMessage(peerId, data);
    });

    conn.on('close', () => {
      console.log('Arkadaş ayrıldı:', peerId);
      this.connections.delete(peerId);
      this.lobbyPlayers.delete(peerId);
      this.removeRemotePlayer(peerId);

      // Lobi modundaysak güncel oyuncu listesini herkese yay
      if (this.game.state !== 'PLAYING') {
        this.broadcastLobbyState();
      }
      if (this.onPlayerLeft) this.onPlayerLeft(peerId);
    });

    conn.on('error', (err) => {
      console.error('İstemci bağlantı hatası:', peerId, err);
    });
  }

  // Host: Tüm bağlı istemcilere veri gönder
  broadcast(data) {
    this.connections.forEach((conn) => {
      if (this.isConnReady(conn)) {
        try {
          conn.send(data);
        } catch (e) {
          console.warn('Yayın gönderme hatası:', e);
        }
      }
    });
  }

  // Host: Lobideki tüm oyuncuların listesini derle
  getLobbyList() {
    const hostName = (this.game && this.game.getPlayerName) ? this.game.getPlayerName() : 'Oda Sahibi';
    const hostSkin = (this.game && this.game.getSelectedSkinId) ? this.game.getSelectedSkinId() : 'white_king';
    const hostHat = (this.game && this.game.equippedHat) ? this.game.equippedHat : 'none';

    const list = [
      { id: 'host', name: hostName, isHost: true, skinId: hostSkin, hatId: hostHat }
    ];

    const seenIds = new Set(['host']);

    this.lobbyPlayers.forEach((p, pId) => {
      const actualId = p.id || pId;
      if (!seenIds.has(actualId)) {
        seenIds.add(actualId);
        list.push({
          id: actualId,
          name: p.name || 'Misafir',
          isHost: false,
          skinId: p.skinId || 'white_king',
          hatId: p.hatId || 'none'
        });
      }
    });

    // Ayrıca connections içinde olup da henüz lobbyPlayers'a girmemiş olan aktif bağlantıları da listeye dahil et!
    this.connections.forEach((conn, peerId) => {
      if (peerId && !seenIds.has(peerId)) {
        seenIds.add(peerId);
        list.push({
          id: peerId,
          name: 'Misafir_' + String(peerId).slice(-4),
          isHost: false,
          skinId: 'white_king',
          hatId: 'none'
        });
      }
    });

    return list;
  }

  // Host: Lobideki oyuncu listesini hem kendi ekranında güncelle hem istemcilere yay
  broadcastLobbyState() {
    const list = this.getLobbyList();
    if (this.onLobbyUpdated) {
      this.onLobbyUpdated(list, this.roomCode);
    }

    this.broadcast({
      type: 'LOBBY_STATE',
      roomCode: this.roomCode,
      players: list
    });
  }

  // Client'tan Host'a gelen mesajları işle
  handleClientMessage(peerId, data) {
    if (!data || !data.type) return;

    if (data.type === 'PLAYER_HELLO') {
      const pId = data.peerId || peerId;
      const pInfo = {
        id: pId,
        name: (data.name || 'Misafir').substring(0, 14),
        skinId: data.skinId || 'white_king',
        hatId: data.hatId || 'none',
        isHost: false,
        ready: true
      };
      this.lobbyPlayers.set(pId, pInfo);
      if (peerId && pId !== peerId) {
        this.lobbyPlayers.set(peerId, pInfo);
      }

      // Ses çal
      if (typeof sounds !== 'undefined' && sounds.playSpecial) {
        sounds.playSpecial();
      }

      // Client'a anında onay (HELLO_ACK) paketi gönder
      const clientConn = this.connections.get(peerId) || this.connections.get(pId);
      if (clientConn && this.isConnReady(clientConn)) {
        try {
          clientConn.send({
            type: 'HELLO_ACK',
            peerId: pId,
            roomCode: this.roomCode,
            hostName: (this.game && this.game.getPlayerName) ? this.game.getPlayerName() : 'Oda Sahibi'
          });
        } catch (e) {
          console.warn('HELLO_ACK gönderme hatası:', e);
        }
      }

      // Odaya katılan oyuncuyu lobiye ekle ve güncel oyuncu listesini herkese yay
      // EĞER OYUN HALİHAZIRDA OYNANIYORSA, YENİ/TEKRAR GELEN OYUNCUYU DERHAL ARENAYA GÜVENLİ SOK!
      if (this.game.state === 'PLAYING') {
        // Eğer aynı isimde veya eski bağlantıda kalmış eski bir remotePlayer varsa temizle
        for (const [oldId, oldWorm] of this.remotePlayers.entries()) {
          if (oldId !== pId && (oldWorm.name === pInfo.name || oldWorm.isDead)) {
            this.remotePlayers.delete(oldId);
            this.lobbyPlayers.delete(oldId);
            this.connections.delete(oldId);
          }
        }

        const skin = (typeof SKINS !== 'undefined' && SKINS.find(s => s.id === pInfo.skinId)) || SKINS[0];
        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = 850;
        const rx = Math.round(this.game.worldWidth / 2 + Math.cos(angle) * spawnRadius);
        const ry = Math.round(this.game.worldHeight / 2 + Math.sin(angle) * spawnRadius);
        const faceAngle = Number((angle + Math.PI / 2).toFixed(2));
        const worm = new Worm(rx, ry, pInfo.name, skin, false);
        worm.peerId = pId;
        worm.hat = pInfo.hatId || 'none';
        worm.angle = faceAngle;
        worm.targetAngle = faceAngle;
        worm.ghostTimer = 0; // Hayalet modu kaldırıldı: tam görünür ve fiziksel
        this.remotePlayers.set(pId, worm);

        // Yeni katılan oyuncuya hem kendi noktasını hem de tüm canlı oyuncuların anlık konumunu gönder
        const activeSpawns = { [pId]: { x: rx, y: ry, angle: faceAngle } };
        if (this.game.player) {
          activeSpawns['host'] = {
            x: Math.round(this.game.player.x),
            y: Math.round(this.game.player.y),
            angle: Number(this.game.player.angle.toFixed(2))
          };
        }
        this.remotePlayers.forEach((rw, rId) => {
          activeSpawns[rId] = {
            x: Math.round(rw.x),
            y: Math.round(rw.y),
            angle: Number(rw.angle.toFixed(2))
          };
        });

        const sendGameStart = () => {
          const sendConn = this.connections.get(peerId) || this.connections.get(pId);
          if (sendConn && this.isConnReady(sendConn)) {
            try {
              sendConn.send({
                type: 'GAME_START',
                roomCode: this.roomCode,
                worldWidth: this.game.worldWidth,
                worldHeight: this.game.worldHeight,
                foodSeed: Number(this.roomCode) || 12345,
                spawns: activeSpawns,
                players: this.getLobbyList()
              });
            } catch (e) {
              console.warn('Geç katılım GAME_START gönderme hatası:', e);
            }
          }
        };

        sendGameStart();
        setTimeout(sendGameStart, 100);
        setTimeout(sendGameStart, 250);
        setTimeout(sendGameStart, 500);

        // Canlı lider tablosunu güncelle
        if (this.game && this.game.updateLeaderboard) {
          const allWorms = this.game.player
            ? [this.game.player, ...this.game.bots, ...this.remotePlayers.values()]
            : [...this.game.bots, ...this.remotePlayers.values()];
          this.game.updateLeaderboard(allWorms);
        }
      } else {
        this.broadcastLobbyState();
      }
    } else if (data.type === 'PLAYER_INPUT') {
      const worm = this.remotePlayers.get(peerId);
      if (worm && !worm.isDead) {
        if (typeof data.x === 'number' && typeof data.y === 'number') {
          worm.x = data.x;
          worm.y = data.y;
        }
        if (typeof data.angle === 'number') {
          worm.angle = data.angle;
        }
        worm.targetAngle = data.targetAngle;
        worm.isBoosting = !!data.isBoosting;
      }
    } else if (data.type === 'CLIENT_ATE_FOOD') {
      const rw = this.remotePlayers.get(peerId);
      if (data.eaten && Array.isArray(data.eaten)) {
        if (!this.game.pendingEatenFoods) this.game.pendingEatenFoods = [];
        data.eaten.forEach(ef => {
          if (rw && !rw.isDead) {
            rw.score += (ef.points || 5);
          }
          const foundIdx = this.game.foods.findIndex(f => Math.hypot(f.x - ef.x, f.y - ef.y) < 65);
          if (foundIdx !== -1) {
            this.game.foods.splice(foundIdx, 1);
            this.game.pendingEatenFoods.push(ef);
          }
        });
      }
    } else if (data.type === 'CLIENT_DIED') {
      const rw = this.remotePlayers.get(peerId);
      if (rw && !rw.isDead) {
        rw.isDead = true;
        rw.killedBy = data.killedBy || 'Arena Duvarına';
        if (this.game && this.game.dropFoodFromWorm) {
          this.game.dropFoodFromWorm(rw);
        }
        if (this.game && this.game.updateLeaderboard) {
          const allWorms = this.game.player
            ? [this.game.player, ...this.game.bots, ...this.remotePlayers.values()]
            : [...this.game.bots, ...this.remotePlayers.values()];
          this.game.updateLeaderboard(allWorms);
        }
      }
    } else if (data.type === 'PLAYER_RESPAWN') {
      // Ölen istemci tekrar canlanmak istediğinde
      let pInfo = this.lobbyPlayers.get(peerId);
      const existingWorm = this.remotePlayers.get(peerId);
      const playerName = (pInfo && pInfo.name) || (existingWorm && existingWorm.name) || 'Oyuncu';
      const skinId = (pInfo && pInfo.skinId) || (existingWorm && existingWorm.skin && existingWorm.skin.id) || 'white_king';
      const hatId = (pInfo && pInfo.hatId) || (existingWorm && existingWorm.hat) || 'none';
      const skin = (typeof SKINS !== 'undefined' && SKINS.find(s => s.id === skinId)) || SKINS[0];

      const rx = Math.round(this.game.worldWidth / 2 + (Math.random() - 0.5) * 800);
      const ry = Math.round(this.game.worldHeight / 2 + (Math.random() - 0.5) * 800);
      const worm = new Worm(rx, ry, playerName, skin, false);
      worm.peerId = peerId;
      worm.hat = hatId;
      worm.ghostTimer = 0;
      this.remotePlayers.set(peerId, worm);

      if (this.game && this.game.updateLeaderboard) {
        const allWorms = this.game.player
          ? [this.game.player, ...this.game.bots, ...this.remotePlayers.values()]
          : [...this.game.bots, ...this.remotePlayers.values()];
        this.game.updateLeaderboard(allWorms);
      }

      const conn = this.connections.get(peerId);
      if (this.isConnReady(conn)) {
        conn.send({
          type: 'RESPAWN_ACK',
          x: rx,
          y: ry
        });
      }
    }
  }

  // ==================== 2. ODAYI BAŞLAT (HOST TETİKLER) ====================
  // Oda kuran kişi 'ARENAYI BAŞLAT' butonuna bastığında çağrılır.
  // Tüm odadaki oyuncular aynı saniyede oyuna başlar.
  startRoomGame(includeBots = false) {
    if (!this.isHost) return;

    // Bağlı tüm istemcilerin lobbyPlayers içinde var olduğundan %100 emin ol
    this.connections.forEach((conn, peerId) => {
      if (peerId && !this.lobbyPlayers.has(peerId)) {
        this.lobbyPlayers.set(peerId, {
          id: peerId,
          name: 'Misafir_' + String(peerId).slice(-4),
          skinId: 'white_king',
          hatId: 'none',
          isHost: false,
          ready: true
        });
      }
    });

    const list = this.getLobbyList();
    const count = list.length;
    const centerX = this.game.worldWidth / 2;
    const centerY = this.game.worldHeight / 2;

    // Host dünyasında tohum tabanlı yiyecekleri tazele (Ağdan 80KB veri aktarmak yerine tohum kodu kullanılır)
    const foodSeed = Number(this.roomCode) || Math.floor(Math.random() * 90000) + 10000;
    if (this.game.initFoodsWithSeed) {
      this.game.initFoodsWithSeed(foodSeed, 2000);
    } else {
      this.game.initFoods(2000);
    }

    // Tüm oyuncular için merkez etrafında güvenli, geniş ve dairesel başlangıç noktaları oluştur
    const spawns = {};
    const spawnRadius = Math.min(1100, 650 + count * 150);
    list.forEach((p, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const x = Math.round(centerX + Math.cos(angle) * spawnRadius);
      const y = Math.round(centerY + Math.sin(angle) * spawnRadius);
      // Kafa kafaya çarpışmayı önlemek için dairesel/teğet bakış açısı
      const faceAngle = Number((angle + Math.PI / 2).toFixed(2));
      spawns[p.id] = { x, y, angle: faceAngle };
    });

    // Host tarafında uzaktaki arkadaşlar için Worm nesnelerini kur
    this.remotePlayers.clear();
    list.forEach((p) => {
      if (p.isHost) return;
      const peerId = p.id;
      const skin = (typeof SKINS !== 'undefined' && SKINS.find(s => s.id === p.skinId)) || SKINS[0];
      const sp = spawns[peerId] || { x: centerX, y: centerY, angle: 0 };
      const worm = new Worm(sp.x, sp.y, p.name, skin, false);
      worm.peerId = peerId;
      worm.hat = p.hatId || 'none';
      worm.angle = sp.angle || 0;
      worm.targetAngle = sp.angle || 0;
      worm.ghostTimer = 0; // Hayalet modu kaldırıldı
      this.remotePlayers.set(peerId, worm);
    });

    // Host'un kendi solucanını başlat
    const hostSp = spawns['host'] || { x: centerX, y: centerY, angle: 0 };
    this.game.startMultiplayerHostGame(includeBots, hostSp.x, hostSp.y, hostSp.angle);

    // Tüm bağlı istemcilere HAFİF ve KESİNTİSİZ GAME_START paketi yayınla (~300 bayt)
    const payload = {
      type: 'GAME_START',
      roomCode: this.roomCode,
      worldWidth: this.game.worldWidth,
      worldHeight: this.game.worldHeight,
      foodSeed: foodSeed,
      spawns: spawns,
      players: list
    };

    // İlk paket hemen gönderilir
    this.broadcast(payload);

    // WebRTC paket kaybına karşı çoklu teyit paketleri gönderilir (hiçbir istemci lobide takılı kalamaz!)
    setTimeout(() => {
      if (this.isHost && this.game.state === 'PLAYING') {
        this.broadcast(payload);
      }
    }, 80);
    setTimeout(() => {
      if (this.isHost && this.game.state === 'PLAYING') {
        this.broadcast(payload);
      }
    }, 200);
    setTimeout(() => {
      if (this.isHost && this.game.state === 'PLAYING') {
        this.broadcast(payload);
      }
    }, 450);
    setTimeout(() => {
      if (this.isHost && this.game.state === 'PLAYING') {
        this.broadcast(payload);
      }
    }, 800);
    setTimeout(() => {
      if (this.isHost && this.game.state === 'PLAYING') {
        this.broadcast(payload);
      }
    }, 1200);
  }

  // ==================== 2.5 CANLI SLITHER.IO OYUN SUNUCUSUNA BAĞLAN (DEDICATED SERVER) ====================
  // 7/24 internette açık, genel veya yerel Node.js WebSocket sunucusuna bağlanır
  connectToGameServer(customUrl = null) {
    return new Promise((resolve, reject) => {
      this.disconnect();

      this.isServerMode = true;
      this.isHost = false;
      this.isMultiplayer = true;
      this.roomCode = 'ONLINE';

      let serverUrl = customUrl || localStorage.getItem('worm_server_url');
      if (!serverUrl) {
        if (typeof window !== 'undefined' && window.location && window.location.hostname) {
          const host = window.location.hostname;
          if (host === 'localhost' || host === '127.0.0.1') {
            const port = window.location.port ? `:${window.location.port}` : ':3000';
            serverUrl = `ws://${host}${port}`;
          } else if (window.location.protocol.startsWith('http') && host.includes('onrender.com')) {
            serverUrl = `wss://${host}`;
          } else {
            serverUrl = 'wss://worm-arena-6jh7.onrender.com';
          }
        } else {
          serverUrl = 'wss://worm-arena-6jh7.onrender.com';
        }
      }

      console.log('Canlı oyun sunucusuna bağlanılıyor:', serverUrl);
      if (this.onJoinStatus) {
        this.onJoinStatus(window.I18N ? window.I18N.t('net_connecting_server') : 'Canlı oyun sunucusuna bağlanılıyor...');
      }

      let ws;
      try {
        ws = new WebSocket(serverUrl);
      } catch (err) {
        if (window.showInGameAlert) {
          window.showInGameAlert('Oyun sunucusu adresine bağlanılamadı.', 'warning', '⚠️ SUNUCU HATASI');
        }
        reject(err);
        return;
      }

      this.ws = ws;

      const connTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          try { ws.close(); } catch (e) {}
          const errorMsg = window.I18N ? window.I18N.t('server_timeout_msg') : 'Oyun sunucusuna bağlanılamadı. Sunucunun açık olduğundan emin olun.';
          if (window.showInGameAlert) {
            window.showInGameAlert(errorMsg, 'warning', '⚠️ SUNUCU ZAMAN AŞIMI');
          }
          reject(new Error('Server connection timeout'));
        }
      }, 7500);

      // WebRTC kanalı gibi davranan uyumlu adaptör
      this.hostConn = {
        get open() { return ws && ws.readyState === WebSocket.OPEN; },
        _open: true,
        send: (data) => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(typeof data === 'string' ? data : JSON.stringify(data));
            } catch (e) {
              console.warn('Sunucuya veri gönderme hatası:', e);
            }
          }
        }
      };

      ws.onopen = () => {
        clearTimeout(connTimeout);
        console.log('Oyun sunucusuna başarıyla bağlanıldı!');
        const defaultPlayerName = window.I18N ? window.I18N.t('player_default') : 'Player';
        const playerName = (this.game && this.game.getPlayerName) ? this.game.getPlayerName() : defaultPlayerName;
        const skinId = (this.game && this.game.getSelectedSkinId) ? this.game.getSelectedSkinId() : 'white_king';
        const hatId = (this.game && this.game.equippedHat) ? this.game.equippedHat : 'none';

        this.hostConn.send({
          type: 'PLAYER_HELLO',
          name: playerName,
          skinId: skinId,
          hatId: hatId
        });

        resolve(serverUrl);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleHostMessage(data);
        } catch (e) {
          console.warn('Sunucu mesajı ayrıştırma hatası:', e);
        }
      };

      ws.onclose = () => {
        console.warn('Oyun sunucusu bağlantısı kapandı.');
        if (this.game && this.game.state === 'PLAYING') {
          if (window.showInGameAlert) {
            window.showInGameAlert('Oyun sunucusu bağlantısı kesildi. Menüye dönülüyor...', 'warning', '⚠️ BAĞLANTI KESİLDİ');
          }
          setTimeout(() => {
            if (this.game && this.game.state === 'PLAYING') {
              this.game.returnToMenu();
            }
          }, 2500);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket hatası:', err);
      };
    });
  }

  // ==================== 3. ODAYA KATIL (CLIENT OL) ====================
  // WhatsApp'tan oyuna dönen oda sahibine yeterli zaman tanımak için 10 aşamalı sabırlı yeniden deneme yapar
  joinRoom(code, attempt = 1) {
    const MAX_ATTEMPTS = 10;
    const ATTEMPT_TIMEOUT_MS = 10000;
    const RETRY_DELAY_MS = 2000;

    return new Promise((resolve, reject) => {
      this.disconnect();

      // Her deneme için benzersiz oturum: eski denemelerden gelen geç olayları yok say
      const session = (this.joinSession = (this.joinSession || 0) + 1);
      const isStale = () => session !== this.joinSession;
      let settled = false;

      this.isHost = false;
      this.isMultiplayer = true;
      this.roomCode = String(code).trim().replace(/[^0-9a-zA-Z]/g, '');
      const targetHostId = `wormarena-${this.roomCode}`;

      if (typeof Peer === 'undefined') {
        if (window.showInGameAlert) {
          const msg = window.I18N ? window.I18N.t('alert_conn_error_msg') : 'Multiplayer network library could not be loaded. Please check your internet connection.';
          const title = window.I18N ? window.I18N.t('alert_conn_error_title') : '⚠️ CONNECTION ERROR';
          window.showInGameAlert(msg, 'warning', title);
        }
        reject(new Error('PeerJS not loaded'));
        return;
      }

      if (this.onJoinStatus) {
        this.onJoinStatus(attempt === 1
          ? (window.I18N ? window.I18N.t('net_connecting') : 'Connecting to host...')
          : (window.I18N ? window.I18N.t('net_trying_reach', { attempt, max: MAX_ATTEMPTS }) : `Trying to reach host (${attempt}/${MAX_ATTEMPTS})...`));
      }

      // Başarısız denemede: hak varsa yeniden dene, yoksa hata ver
      const failAttempt = (reason, userMsg, title) => {
        if (settled || isStale()) return;
        settled = true;
        clearTimeout(connTimeout);
        console.warn(`Katılma denemesi ${attempt}/${MAX_ATTEMPTS} başarısız:`, reason);

        if (attempt < MAX_ATTEMPTS) {
          if (this.onJoinStatus) {
            this.onJoinStatus(window.I18N ? window.I18N.t('net_waiting_return', { attempt, max: MAX_ATTEMPTS }) : `Waiting for host to return (${attempt}/${MAX_ATTEMPTS})... Please wait`);
          }
          setTimeout(() => {
            if (isStale()) return;
            this.joinRoom(code, attempt + 1).then(resolve).catch(reject);
          }, RETRY_DELAY_MS);
          return;
        }

        if (window.showInGameAlert) {
          window.showInGameAlert(userMsg, 'warning', title);
        }
        this.disconnect();
        if (this.onError) this.onError(reason);
        reject(reason instanceof Error ? reason : new Error(String(reason)));
      };

      this.peer = new Peer({
        debug: 1,
        config: {
          iceServers: this.getIceServers(),
          sdpSemantics: 'unified-plan',
          iceCandidatePoolSize: 2
        }
      });

      const connTimeout = setTimeout(() => {
        if (!this.hostConn || !this.hostConn.open) {
          failAttempt(
            new Error('Connection timeout'),
            window.I18N ? window.I18N.t('net_timeout_msg') : 'Could not reach host. Please verify the host has the game open and room active, then click "Reconnect".',
            window.I18N ? window.I18N.t('net_timeout_title') : '⚠️ CONNECTION TIMEOUT'
          );
        }
      }, ATTEMPT_TIMEOUT_MS);

      this.peer.on('open', (id) => {
        if (isStale()) return;
        this.myPeerId = id;
        console.log('İstemci Peer oluşturuldu:', id, 'Hedef Host:', targetHostId);

        // Güvenilir veri kanalı ile host'a bağlan
        const conn = this.peer.connect(targetHostId, { reliable: true });

        let settled = false;
        this.hasReceivedHelloAck = false;

        const sendPlayerHello = () => {
          if (!this.hostConn) return;
          const defaultPlayerName = window.I18N ? window.I18N.t('player_default') : 'Player';
          const playerName = this.customPlayerName || ((this.game && this.game.getPlayerName) ? this.game.getPlayerName() : defaultPlayerName);
          const skinId = (this.game && this.game.getSelectedSkinId) ? this.game.getSelectedSkinId() : 'white_king';
          const hatId = (this.game && this.game.equippedHat) ? this.game.equippedHat : 'none';

          try {
            this.hostConn.send({
              type: 'PLAYER_HELLO',
              peerId: this.myPeerId,
              name: playerName,
              skinId: skinId,
              hatId: hatId
            });
          } catch (e) {
            console.warn('PLAYER_HELLO gönderme hatası:', e);
          }
        };

        const setupClientConn = () => {
          if (isStale() || settled) return;
          settled = true;
          clearTimeout(connTimeout);
          this.hostConn = conn;
          if (conn.dataChannel && conn.dataChannel.readyState === 'open') {
            conn._open = true;
          }
          console.log('Odaya başarıyla bağlandı! Peer ID:', this.myPeerId);

          // Host'a profil ve kostüm bilgilerini hemen gönder
          sendPlayerHello();

          // Host'tan teyit (HELLO_ACK veya LOBBY_STATE) gelene kadar her 350ms'de bir selam paketini tekrarla (paket kaybı sigortası)
          if (this.clientHelloInterval) clearInterval(this.clientHelloInterval);
          this.clientHelloInterval = setInterval(() => {
            if (this.hasReceivedHelloAck || this.game.state === 'PLAYING' || !this.hostConn) {
              clearInterval(this.clientHelloInterval);
              this.clientHelloInterval = null;
              return;
            }
            if (this.isConnReady(this.hostConn)) {
              sendPlayerHello();
            }
          }, 350);

          resolve(this.roomCode);
        };

        if (this.isConnReady(conn)) {
          setupClientConn();
        } else {
          conn.on('open', setupClientConn);
          if (conn.dataChannel) {
            if (conn.dataChannel.readyState === 'open') {
              setupClientConn();
            } else {
              conn.dataChannel.addEventListener('open', setupClientConn, { once: true });
            }
          }
        }

        conn.on('data', (data) => {
          if (isStale()) return;
          if (conn.dataChannel && conn.dataChannel.readyState === 'open') {
            conn._open = true;
          }
          this.handleHostMessage(data);
        });

        conn.on('close', () => {
          if (isStale() || this.hostConn !== conn) return;
          console.warn('Oda sahibi ile bağlantı kesildi');
          if (window.showInGameAlert) {
            window.showInGameAlert(
              window.I18N ? window.I18N.t('net_lost_msg') : 'Room connection lost. Returning to menu...',
              'warning',
              window.I18N ? window.I18N.t('net_lost_title') : '⚠️ CONNECTION LOST'
            );
          }
          // Hemen oyundan atmak yerine 3 sn bekle
          setTimeout(() => {
            if (this.game && this.game.state === 'PLAYING') {
              this.game.returnToMenu();
            }
          }, 3000);
        });

        conn.on('error', (err) => {
          failAttempt(
            err,
            window.I18N ? window.I18N.t('net_conn_err_retry') : 'Error occurred while connecting to room host. Please try again.',
            window.I18N ? window.I18N.t('alert_conn_error_title') : '⚠️ CONNECTION ERROR'
          );
        });
      });

      this.peer.on('error', (err) => {
        console.error('Odaya bağlanılamadı:', err);
        let msg = window.I18N ? window.I18N.t('net_conn_failed_msg') : 'Could not connect to room. Please check your internet connection.';
        let title = window.I18N ? window.I18N.t('alert_conn_error_title') : '⚠️ CONNECTION ERROR';
        if (err && err.type === 'peer-unavailable') {
          msg = window.I18N ? window.I18N.t('net_peer_unavailable_msg', { code: this.roomCode }) : `Room host for "${this.roomCode}" is not ready yet. Please ensure the host has the game and room open.`;
          title = window.I18N ? window.I18N.t('net_waiting_host_title') : '⚠️ WAITING FOR HOST';
        }
        failAttempt(err, msg, title);
      });
    });
  }

  // Host'tan Client'a gelen mesajları işle
  handleHostMessage(data) {
    if (!data || !data.type) return;

    if (data.type === 'HELLO_ACK') {
      console.log('Host HELLO_ACK aldı! Lobiye kesin olarak eklendik.');
      this.hasReceivedHelloAck = true;
      if (this.clientHelloInterval) {
        clearInterval(this.clientHelloInterval);
        this.clientHelloInterval = null;
      }
      const myLobbyBadge = document.getElementById('myLobbyBadge');
      if (myLobbyBadge) {
        myLobbyBadge.textContent = window.I18N ? window.I18N.t('mp_badge_ready') : 'READY';
        myLobbyBadge.className = 'lobby-ready-badge';
      }
      const waitingStatusText = document.getElementById('waitingStatusText');
      if (waitingStatusText) {
        waitingStatusText.textContent = window.I18N ? window.I18N.t('mp_waiting_status_text') : "Host hasn't started the game yet. Please wait...";
      }
    } else if (data.type === 'LOBBY_STATE') {
      if (data.players && Array.isArray(data.players)) {
        this.hostLobbyPlayers = data.players;
        const inLobby = data.players.some(p => p.id === this.myPeerId);
        if (inLobby) {
          this.hasReceivedHelloAck = true;
          if (this.clientHelloInterval) {
            clearInterval(this.clientHelloInterval);
            this.clientHelloInterval = null;
          }
        }
      }
      // Sadece lobi veya menüdeyken UI'ı güncelle
      if (this.game.state !== 'PLAYING') {
        if (this.onLobbyUpdated) {
          this.onLobbyUpdated(data.players || [], data.roomCode);
        }
      }
    } else if (data.type === 'GAME_START') {
      // Eğer istemci zaten bu oturumda aktif oynuyorsa mükerrer başlatmayı yoksay
      if (this.game.state === 'PLAYING' && this.game.player && this.game.player.peerId === this.myPeerId) {
        return;
      }
      if (this.clientHelloInterval) {
        clearInterval(this.clientHelloInterval);
        this.clientHelloInterval = null;
      }

      console.log('GAME_START paketi alındı! Arenaya giriliyor...');
      this.game.worldWidth = data.worldWidth || 6400;
      this.game.worldHeight = data.worldHeight || 6400;

      // Bekleme odasını ve tüm pencereleri anında kapat
      const multiplayerModal = document.getElementById('multiplayerModal');
      if (multiplayerModal) {
        multiplayerModal.classList.add('hidden');
        multiplayerModal.style.display = 'none';
      }
      const waitingRoomTabContent = document.getElementById('waitingRoomTabContent');
      if (waitingRoomTabContent) {
        waitingRoomTabContent.classList.add('hidden');
        waitingRoomTabContent.style.display = 'none';
      }
      const joinRoomTabContent = document.getElementById('joinRoomTabContent');
      if (joinRoomTabContent) {
        joinRoomTabContent.classList.add('hidden');
        joinRoomTabContent.style.display = 'none';
      }
      const createRoomTabContent = document.getElementById('createRoomTabContent');
      if (createRoomTabContent) {
        createRoomTabContent.classList.add('hidden');
        createRoomTabContent.style.display = 'none';
      }

      if (this.game.startScreen) {
        this.game.startScreen.classList.add('hidden');
        this.game.startScreen.style.display = 'none';
      }
      if (this.game.gameOverScreen) {
        this.game.gameOverScreen.classList.add('hidden');
        this.game.gameOverScreen.style.display = 'none';
      }

      // Tohum tabanlı yiyecekleri başlat
      if (data.foodSeed && this.game.initFoodsWithSeed) {
        this.game.initFoodsWithSeed(data.foodSeed, 2000);
      } else if (data.foods) {
        this.game.foods = data.foods.map(f => {
          const foodDef = (typeof FOOD_TYPES !== 'undefined' && FOOD_TYPES.find(ft => ft.type === f.type)) || FOOD_TYPES[0];
          return { x: f.x, y: f.y, ...foodDef, pulse: Math.random() * Math.PI * 2 };
        });
      } else {
        this.game.initFoods(2000);
      }

      // Kendi başlangıç noktamı bul (akıllı eşleme garantisi)
      let mySp = null;
      if (data.spawns) {
        if (this.myPeerId && data.spawns[this.myPeerId]) {
          mySp = data.spawns[this.myPeerId];
        } else {
          const nonHostKey = Object.keys(data.spawns).find(k => k !== 'host');
          if (nonHostKey) mySp = data.spawns[nonHostKey];
        }
      } else if (data.mySpawn) {
        mySp = data.mySpawn;
      }
      if (!mySp) {
        mySp = {
          x: Math.round(this.game.worldWidth / 2 + (Math.random() - 0.5) * 600),
          y: Math.round(this.game.worldHeight / 2 + (Math.random() - 0.5) * 600),
          angle: Number((Math.random() * Math.PI * 2).toFixed(2))
        };
      }

      // Diğer oyuncuları remotePlayers içine ekle
      this.remotePlayers.clear();
      const playersList = data.players || [];
      playersList.forEach(p => {
        const pId = p.id || p.peerId;
        if (pId !== this.myPeerId && pId !== 'me') {
          const skin = (typeof SKINS !== 'undefined' && SKINS.find(s => s.id === p.skinId)) || SKINS[0];
          const sp = (data.spawns && data.spawns[pId]) || { x: this.game.worldWidth / 2, y: this.game.worldHeight / 2, angle: 0 };
          const worm = new Worm(sp.x, sp.y, p.name, skin, !!p.isBot);
          worm.peerId = pId;
          worm.hat = p.hatId || 'none';
          worm.angle = sp.angle || 0;
          worm.ghostTimer = 0;
          this.remotePlayers.set(pId, worm);
        }
      });

      // İstemci oyununu başlat
      this.game.startMultiplayerClientGame(mySp);
    } else if (data.type === 'RESPAWN_ACK') {
      // Tekrar canlanma onayı
      if (!this.game.player) {
        const skin = (typeof SKINS !== 'undefined' && SKINS[this.game.selectedSkinIndex]) || SKINS[0];
        this.game.player = new Worm(data.x, data.y, this.game.getPlayerName(), skin, false);
        this.game.player.peerId = this.myPeerId;
      } else {
        this.game.player.x = data.x;
        this.game.player.y = data.y;
        this.game.player.isDead = false;
        this.game.player.ghostTimer = 0;
        this.game.player.radius = 11;
        this.game.player.score = 15;
        this.game.player.body = [];
        for (let i = 0; i < 11; i++) {
          this.game.player.body.push({ x: data.x - i * 6.0, y: data.y });
        }
      }
      if (this.game.gameOverScreen) {
        this.game.gameOverScreen.classList.add('hidden');
        this.game.gameOverScreen.style.display = 'none';
      }
      if (this.game.joystickZone) this.game.joystickZone.classList.remove('hidden');
      this.game.state = 'PLAYING';
    } else if (data.type === 'GAME_TICK') {
      // Host'tan gelen anlık fizik karesi
      // EĞER OYUN HENÜZ BAŞLATILMAMIŞSA (istemci lobideyken host oyunu başlattıysa ama GAME_START paketi ağda kaybolduysa):
      if (this.game.state !== 'PLAYING') {
        console.log('GAME_TICK alındı, oyun henüz başlamamıştı - Arenaya senkronize giriliyor!');
        if (this.clientHelloInterval) {
          clearInterval(this.clientHelloInterval);
          this.clientHelloInterval = null;
        }
        let mySp = null;
        if (data.worms) {
          const myWormData = data.worms.find(w => w.peerId === this.myPeerId && !w.isDead);
          if (myWormData) {
            mySp = { x: myWormData.x, y: myWormData.y, angle: myWormData.angle };
          }
        }
        if (!mySp) {
          mySp = {
            x: Math.round(this.game.worldWidth / 2 + (Math.random() - 0.5) * 600),
            y: Math.round(this.game.worldHeight / 2 + (Math.random() - 0.5) * 600),
            angle: 0
          };
        }
        const multiplayerModal = document.getElementById('multiplayerModal');
        if (multiplayerModal) {
          multiplayerModal.classList.add('hidden');
          multiplayerModal.style.display = 'none';
        }
        const waitingRoomTabContent = document.getElementById('waitingRoomTabContent');
        if (waitingRoomTabContent) {
          waitingRoomTabContent.classList.add('hidden');
          waitingRoomTabContent.style.display = 'none';
        }
        this.game.startMultiplayerClientGame(mySp);
      }

      if (!this.game.player) return;

      const activeIds = new Set();
      data.worms.forEach(wData => {
        activeIds.add(wData.peerId);

        if (wData.peerId === this.myPeerId) {
          // KENDİ SOLUCANIMIZ:
          // Ölüm durumunu senkronize et
          if (wData.isDead && this.game.player && !this.game.player.isDead) {
            this.game.handlePlayerDeath(wData.killedBy || 'Başka bir solucan');
          }
          if (this.game.player) {
            // Skor, leş ve kütleyi eşitle (Yerel kontrolümüz asla geriye çekilmez, böylece yılan ASLA mekik dokumaz!)
            if (typeof wData.score === 'number' && wData.score > this.game.player.score) {
              this.game.player.score = wData.score;
            }
            if (typeof wData.kills === 'number') {
              this.game.player.kills = Math.max(this.game.player.kills || 0, wData.kills);
            }
            if (typeof wData.radius === 'number') {
              this.game.player.radius = wData.radius;
            }
          }
        } else {
          // UZAKTAKİ ARKADAŞ VEYA BOT
          let worm = this.remotePlayers.get(wData.peerId);
          if (!worm) {
            const skin = (typeof SKINS !== 'undefined' && SKINS.find(s => s.id === wData.skinId)) || SKINS[0];
            worm = new Worm(wData.x, wData.y, wData.name, skin, !!wData.isBot);
            worm.peerId = wData.peerId;
            worm.hat = wData.hatId || 'none';
            this.remotePlayers.set(wData.peerId, worm);
          }
          worm.targetAngle = wData.angle;
          worm.angle = wData.angle;
          const rdx = wData.x - worm.x;
          const rdy = wData.y - worm.y;
          if (rdx * rdx + rdy * rdy > 250000) {
            worm.x = wData.x;
            worm.y = wData.y;
          } else {
            worm.x += rdx * 0.35;
            worm.y += rdy * 0.35;
          }
          if (wData.body && wData.body.length > 0) {
            // Seyreltilmiş (downsampled) ağ gövde noktalarını pürüzsüz ve kesintisiz yılan gövdesine dönüştür
            const rawPts = wData.body;
            if (rawPts.length === 1) {
              worm.body = [{ x: rawPts[0].x, y: rawPts[0].y }];
            } else {
              const dense = [{ x: rawPts[0].x, y: rawPts[0].y }];
              const targetSpacing = Math.max(6.5, (wData.radius || 11) * 0.52);
              worm.spacing = targetSpacing;
              for (let k = 1; k < rawPts.length; k++) {
                const prev = dense[dense.length - 1];
                const curr = rawPts[k];
                const dx = curr.x - prev.x;
                const dy = curr.y - prev.y;
                const dist = Math.hypot(dx, dy);
                if (dist > targetSpacing * 1.35) {
                  const steps = Math.floor(dist / targetSpacing);
                  for (let s = 1; s <= steps; s++) {
                    const t = s / (steps + 1);
                    dense.push({
                      x: Math.round(prev.x + dx * t),
                      y: Math.round(prev.y + dy * t)
                    });
                  }
                }
                dense.push({ x: curr.x, y: curr.y });
              }
              worm.body = dense;
            }
          }
          worm.radius = wData.radius;
          worm.score = wData.score;
          worm.kills = wData.kills || 0;
          worm.isBoosting = !!wData.isBoosting;
          const wasDead = worm.isDead;
          worm.isDead = !!wData.isDead;
          if (!wasDead && worm.isDead) {
            if (this.game && this.game.createDeathBurst) {
              this.game.createDeathBurst(worm.x, worm.y);
            }
            if (this.game && this.game.updateLeaderboard) {
              const allWorms = [this.game.player, ...this.remotePlayers.values()];
              this.game.updateLeaderboard(allWorms);
            }
          }
          worm.hat = wData.hatId || worm.hat;
        }
      });

      // Artık var olmayan solucanları temizle (Tek karelik paket gecikmesinde yılanın kaybolmaması için 45 karelik tolerans)
      for (const [pId, rw] of this.remotePlayers.entries()) {
        if (!activeIds.has(pId)) {
          rw._missingTicks = (rw._missingTicks || 0) + 1;
          if (rw._missingTicks > 45) {
            this.remotePlayers.delete(pId);
          }
        } else {
          rw._missingTicks = 0;
        }
      }

      // Yenen / Yeni çıkan yiyecekleri senkronize et (Yıldızlar ve tüm yemler)
      if (data.newFoods && data.newFoods.length > 0) {
        data.newFoods.forEach(nf => {
          this.game.spawnFood(nf.x, nf.y, nf.type);
        });
      }
      if (data.eatenFoods && data.eatenFoods.length > 0) {
        data.eatenFoods.forEach(ef => {
          const idx = this.game.foods.findIndex(f => Math.hypot(f.x - ef.x, f.y - ef.y) < 65);
          if (idx !== -1) {
            this.game.foods.splice(idx, 1);
          }
        });
      } else if (data.eatenIndices && data.eatenIndices.length > 0) {
        data.eatenIndices.sort((a, b) => b - a).forEach(idx => {
          if (this.game.foods[idx]) this.game.foods.splice(idx, 1);
        });
      }
    } else if (data.type === 'GAME_VICTORY') {
      const winnerWorm = (this.game && this.game.player && (data.winnerPeerId === this.myPeerId || data.winnerName === this.game.player.name))
        ? this.game.player
        : (this.remotePlayers.get(data.winnerPeerId) || { name: data.winnerName, score: data.score || 20000, kills: data.kills || 0 });
      if (this.game && this.game.handleVictory) {
        this.game.handleVictory(winnerWorm);
      }
    }
  }

  // Host: Zafer durumunu tüm bağlı istemcilere yayınla (20.000 puan kuralı)
  broadcastVictory(winnerName, winnerPeerId, score, kills) {
    if (!this.isHost) return;
    this.broadcast({
      type: 'GAME_VICTORY',
      winnerName: winnerName,
      winnerPeerId: winnerPeerId,
      score: score || 20000,
      kills: kills || 0
    });
  }

  // ==================== 4. ANLIK DURUM YAYINI (HOST) ====================
  // Host: Tüm bağlı istemcilere anlık oyun durumunu yayınlar (Throttled & Downsampled)
  broadcastState(worms, newFoods = [], eatenFoods = []) {
    if (!this.isHost || this.connections.size === 0) return;
    // Oyun henüz başlatılmadıysa (lobideyken) kesinlikle istemcilere tick yayını gönderme!
    if (this.game.state !== 'PLAYING' && this.game.state !== 'DYING' && this.game.state !== 'GAMEOVER') return;

    // Gövde segmentlerini ağ üzerinden aktarırken seyrelt (downsample):
    // Her karede 50 segment yerine ana omurgayı (18-22 segment) aktararak bant genişliğini %70 düşürür
    const payload = {
      type: 'GAME_TICK',
      worms: worms.map((w, idx) => {
        const step = Math.max(1, Math.ceil(w.body.length / 22));
        const downsampledBody = [];
        for (let b = 0; b < w.body.length; b += step) {
          downsampledBody.push({ x: Math.round(w.body[b].x), y: Math.round(w.body[b].y) });
        }
        if (w.body.length > 0 && (w.body.length - 1) % step !== 0) {
          const tail = w.body[w.body.length - 1];
          downsampledBody.push({ x: Math.round(tail.x), y: Math.round(tail.y) });
        }

        const fallbackPeerId = (w === this.game.player) ? 'host' : (w.isBot ? ('bot_' + idx) : ('player_' + idx));
        const wormPeerId = w.peerId || fallbackPeerId;

        return {
          peerId: wormPeerId,
          name: w.name,
          skinId: w.skin ? w.skin.id : 'white_king',
          hatId: w.hat || 'none',
          isBot: !!w.isBot,
          x: Math.round(w.x),
          y: Math.round(w.y),
          angle: Number(w.angle.toFixed(2)),
          radius: Math.round(w.radius),
          score: Math.round(w.score),
          kills: w.kills || 0,
          isBoosting: !!w.isBoosting,
          isDead: !!w.isDead,
          killedBy: w.killedBy || null,
          body: downsampledBody
        };
      }),
      newFoods: newFoods,
      eatenFoods: eatenFoods
    };

    this.connections.forEach(conn => {
      if (this.isConnReady(conn)) {
        // RTCDataChannel Buffer Taşması Kontrolü (Buffer > 64KB ise bu kareyi atla, kanalı çökertme!)
        if (conn.dataChannel && conn.dataChannel.bufferedAmount > 65536) {
          return;
        }
        try {
          conn.send(payload);
        } catch (e) {
          console.warn('Durum yayını hatası:', e);
        }
      }
    });
  }

  // ==================== 5. OYUNCU GİRDİSİ (CLIENT) ====================
  // Client: Host'a kendi yön, turbo ve anlık koordinat durumunu kısıtlamalı (throttled) gönderir
  sendThrottledInput(targetAngle, isBoosting, posX = null, posY = null, currentAngle = null) {
    if (this.isHost || !this.isConnReady(this.hostConn)) return;

    const now = performance.now();
    const angleDiff = Math.abs(targetAngle - this.lastSentAngle);
    const boostChanged = isBoosting !== this.lastSentBoosting;

    // Açı farkı > 0.015 rad veya turbo değiştiyse veya 35ms geçtiyse gönder (~28 input/sn)
    if (boostChanged || angleDiff > 0.015 || (now - this.lastInputTime > 35)) {
      this.lastSentAngle = targetAngle;
      this.lastSentBoosting = isBoosting;
      this.lastInputTime = now;

      const payload = {
        type: 'PLAYER_INPUT',
        targetAngle: Number(targetAngle.toFixed(2)),
        isBoosting: !!isBoosting
      };

      if (posX !== null && posY !== null) {
        payload.x = Math.round(posX);
        payload.y = Math.round(posY);
      }
      if (currentAngle !== null) {
        payload.angle = Number(currentAngle.toFixed(2));
      }

      try {
        this.hostConn.send(payload);
      } catch (e) {
        console.warn('Input gönderme hatası:', e);
      }
    }
  }

  // Client: Host'a yeniden canlanma isteği gönderir
  requestRespawn() {
    if (this.isHost || !this.isConnReady(this.hostConn)) return;
    try {
      this.hostConn.send({ type: 'PLAYER_RESPAWN' });
    } catch (e) {
      console.warn('Respawn isteği hatası:', e);
    }
  }

  removeRemotePlayer(peerId) {
    const worm = this.remotePlayers.get(peerId);
    if (worm) {
      worm.isDead = true;
      this.remotePlayers.delete(peerId);
      if (this.game && this.game.updateLeaderboard) {
        const allWorms = this.isHost
          ? (this.game.player ? [this.game.player, ...this.game.bots, ...this.remotePlayers.values()] : [...this.game.bots, ...this.remotePlayers.values()])
          : [this.game.player, ...this.remotePlayers.values()];
        this.game.updateLeaderboard(allWorms);
      }
    }
  }

  // Odadan ayrıl / bağlantıyı temizle
  disconnect() {
    if (this.isHost && this.connections.size > 0) {
      this.broadcast({ type: 'HOST_CLOSED' });
    }
    if (this.clientHelloInterval) {
      clearInterval(this.clientHelloInterval);
      this.clientHelloInterval = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }
    this.isServerMode = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.hasReceivedHelloAck = false;
    this.hostLobbyPlayers = null;
    this.isReconnectingHost = false;
    this.connections.clear();
    this.lobbyPlayers.clear();
    this.remotePlayers.clear();
    this.hostConn = null;
    this.isMultiplayer = false;
    this.isHost = false;
    this.roomCode = null;
    this.myPeerId = null;
  }
}
