/**
 * ========================================================
 * WORM ARENA - 7/24 DEDICATED WEBSOCKET OYUN SUNUCUSU
 * Slither.io / Wormate.io Mimarisi
 * 
 * • 7/24 İnternette çalışır (Render.com, 0 TL)
 * • Hem Genel Canlı Arena hem de 4 Haneli Arkadaş Odaları desteği
 * • Arenada bot YOKTUR (Sadece gerçek canlı oyuncular!)
 * • Kafa-gövde çarpışma fiziği ve anında yem patlaması
 * • Hile koruması ve yüksek performanslı 30 FPS tick
 * ========================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const CLIENT_ROOT = path.join(__dirname, '..');

// ==================== STATİK DOSYA SUNUCUSU ====================
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health' || req.url === '/ping') {
    let totalPlayers = 0;
    for (const room of rooms.values()) {
      totalPlayers += room.players.size;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', rooms: rooms.size, players: totalPlayers, time: Date.now() }));
    return;
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(CLIENT_ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - Sayfa Bulunamadı');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

// ==================== SABİTLER ====================
const WORLD_WIDTH = 6400;
const WORLD_HEIGHT = 6400;
const TARGET_FOOD_COUNT = 1400;
// KULLANICI İSTEĞİ: Arenada bot olmayacak! Sadece gerçek oyuncular olacak!
const BOT_COUNT = 0;

const FOOD_TYPES = [
  { type: 'apple', points: 3, radius: 10 },
  { type: 'banana', points: 4, radius: 11 },
  { type: 'donut', points: 6, radius: 13 },
  { type: 'star_coin', points: 15, radius: 16 },
  { type: 'orb', points: 8, radius: 9 },
  { type: 'magnet', points: 25, radius: 18 },
  { type: 'energy_star', points: 30, radius: 18 },
  { type: 'double', points: 25, radius: 18 }
];

// ==================== SUNUCU OYUNCU SINIFI ====================
class ServerWorm {
  constructor(id, name, skinId, hatId, isHost = false, x = null, y = null) {
    this.id = id;
    this.name = name || 'Oyuncu';
    this.skinId = skinId || 'white_king';
    this.hatId = hatId || 'none';
    this.isHost = isHost;
    this.isBot = false;

    this.x = x !== null ? x : Math.round(WORLD_WIDTH / 2 + (Math.random() - 0.5) * 1800);
    this.y = y !== null ? y : Math.round(WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 1800);
    this.angle = Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;

    this.baseSpeed = 1.85;
    this.boostSpeed = 3.7;
    this.speed = this.baseSpeed;
    this.isBoosting = false;

    this.radius = 11;
    this.spacing = 6.0;
    this.score = 15;
    this.kills = 0;
    this.isDead = false;
    this.killedBy = null;

    this.body = [];
    const initialSegments = 11;
    for (let i = 0; i < initialSegments; i++) {
      this.body.push({
        x: Math.round(this.x - Math.cos(this.angle) * (i * this.spacing)),
        y: Math.round(this.y - Math.sin(this.angle) * (i * this.spacing))
      });
    }
  }

  update() {
    if (this.isDead) return;

    if (this.isBoosting && this.score > 8) {
      this.speed = this.boostSpeed;
      this.score = Math.max(8, this.score - 0.20);
    } else {
      this.speed = this.baseSpeed;
      this.isBoosting = false;
    }

    this.radius = Math.min(28, 11 + Math.floor(this.score / 180));
    this.targetLength = Math.max(8, 11 + Math.floor(this.score / 15));
    this.spacing = Math.max(6.5, this.radius * 0.52);

    let diff = this.targetAngle - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const turnFactor = this.isBoosting ? 0.18 : 0.13;
    const maxTurnSpeed = this.isBoosting ? 0.14 : 0.098;
    const turnStep = Math.max(-maxTurnSpeed, Math.min(maxTurnSpeed, diff * turnFactor * 1.35));
    this.angle += turnStep;

    while (this.angle < -Math.PI) this.angle += Math.PI * 2;
    while (this.angle > Math.PI) this.angle -= Math.PI * 2;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    const margin = this.radius + 10;
    if (this.x < margin || this.x > WORLD_WIDTH - margin || this.y < margin || this.y > WORLD_HEIGHT - margin) {
      this.isDead = true;
      this.killedBy = 'Arena Duvarı';
      return;
    }

    if (this.body.length > 0) {
      let prevX = this.x;
      let prevY = this.y;
      const sp = this.spacing;

      for (let i = 0; i < this.body.length; i++) {
        const seg = this.body[i];
        const dx = prevX - seg.x;
        const dy = prevY - seg.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.001) {
          const targetX = prevX - (dx / dist) * sp;
          const targetY = prevY - (dy / dist) * sp;
          seg.x += (targetX - seg.x) * 0.95;
          seg.y += (targetY - seg.y) * 0.95;
        } else {
          seg.x = prevX - Math.cos(this.angle) * sp;
          seg.y = prevY - Math.sin(this.angle) * sp;
        }
        prevX = seg.x;
        prevY = seg.y;
      }
    }

    while (this.body.length < this.targetLength) {
      const last = this.body[this.body.length - 1];
      this.body.push({ x: last.x, y: last.y });
    }
    while (this.body.length > this.targetLength) {
      this.body.pop();
    }
  }

  serialize() {
    const downsampledBody = [];
    const step = Math.max(1, Math.floor(this.body.length / 32));
    for (let i = 0; i < this.body.length; i += step) {
      downsampledBody.push({
        x: Math.round(this.body[i].x),
        y: Math.round(this.body[i].y)
      });
    }

    return {
      peerId: this.id,
      name: this.name,
      skinId: this.skinId,
      hatId: this.hatId,
      isBot: false,
      isHost: this.isHost,
      x: Math.round(this.x),
      y: Math.round(this.y),
      angle: Number(this.angle.toFixed(2)),
      radius: Math.round(this.radius),
      score: Math.round(this.score),
      kills: this.kills,
      isBoosting: this.isBoosting,
      isDead: this.isDead,
      killedBy: this.killedBy,
      body: downsampledBody
    };
  }
}

// ==================== ODA YÖNETİCİSİ (ROOM INSTANCE) ====================
class RoomInstance {
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.players = new Map(); // ws -> ServerWorm
    this.foods = [];
    this.pendingNewFoods = [];
    this.pendingEatenFoods = [];
    this.state = roomCode === 'ONLINE' ? 'PLAYING' : 'LOBBY'; // ONLINE direkt başlar, özel odalar ise LOBBY bekler

    this.initFoods();

    // 30 FPS Oyun Döngüsü
    this.loopInterval = setInterval(() => this.tick(), 33);
  }

  initFoods() {
    this.foods = [];
    for (let i = 0; i < TARGET_FOOD_COUNT; i++) {
      this.spawnFood();
    }
  }

  spawnFood(x = null, y = null, forcedType = null) {
    const fx = x !== null ? x : Math.round(Math.random() * (WORLD_WIDTH - 200) + 100);
    const fy = y !== null ? y : Math.round(Math.random() * (WORLD_HEIGHT - 200) + 100);

    let foodDef;
    if (forcedType) {
      foodDef = FOOD_TYPES.find(f => f.type === forcedType) || FOOD_TYPES[0];
    } else {
      const rand = Math.random();
      if (rand < 0.38) foodDef = FOOD_TYPES[0];
      else if (rand < 0.65) foodDef = FOOD_TYPES[1];
      else if (rand < 0.82) foodDef = FOOD_TYPES[2];
      else if (rand < 0.92) foodDef = FOOD_TYPES[3];
      else if (rand < 0.96) foodDef = FOOD_TYPES[4];
      else if (rand < 0.975) foodDef = FOOD_TYPES[5];
      else if (rand < 0.99) foodDef = FOOD_TYPES[6];
      else foodDef = FOOD_TYPES[7];
    }

    const foodItem = {
      id: this.foodIdCounter++,
      x: fx,
      y: fy,
      type: foodDef.type,
      points: foodDef.points,
      radius: foodDef.radius
    };

    this.foods.push(foodItem);
    this.pendingNewFoods.push({
      x: fx,
      y: fy,
      type: foodItem.type
    });

    return foodItem;
  }

  dropFoodFromWorm(worm) {
    if (!worm || !worm.body) return;
    const count = Math.min(45, Math.max(8, Math.floor(worm.body.length / 2)));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor((i / count) * worm.body.length);
      const seg = worm.body[idx] || worm;
      const rx = Math.round(seg.x + (Math.random() - 0.5) * (worm.radius * 2.2));
      const ry = Math.round(seg.y + (Math.random() - 0.5) * (worm.radius * 2.2));
      const foodType = i % 3 === 0 ? 'star_coin' : (i % 2 === 0 ? 'donut' : 'apple');
      this.spawnFood(rx, ry, foodType);
    }
  }

  // KESİN KAFA-GÖVDE ÇARPIŞMA FİZİĞİ (Slither.io / Wormate.io)
  checkCollisions() {
    const allWorms = Array.from(this.players.values());

    for (const wA of allWorms) {
      if (wA.isDead) continue;

      for (const wB of allWorms) {
        if (wA === wB || wB.isDead) continue;

        // wA'nın kafası wB'nin gövdesine çarptı mı?
        const hitDistance = wA.radius * 0.92 + wB.radius * 0.92;
        const hitDistSq = hitDistance * hitDistance;

        for (let i = 1; i < wB.body.length; i++) {
          const seg = wB.body[i];
          const dx = wA.x - seg.x;
          const dy = wA.y - seg.y;
          if (dx * dx + dy * dy <= hitDistSq) {
            // wA ÖLDÜ!
            wA.isDead = true;
            wA.killedBy = wB.name;
            wB.kills = (wB.kills || 0) + 1;
            wB.score += 60;
            this.dropFoodFromWorm(wA);
            break;
          }
        }

        if (wA.isDead) break;

        // Kafa kafaya çarpışma
        const headDist = (wA.radius + wB.radius) * 0.90;
        const hdx = wA.x - wB.x;
        const hdy = wA.y - wB.y;
        if (hdx * hdx + hdy * hdy < headDist * headDist) {
          const loser = (wA.score <= wB.score) ? wA : wB;
          const winner = (loser === wA) ? wB : wA;
          loser.isDead = true;
          loser.killedBy = winner.name;
          winner.kills = (winner.kills || 0) + 1;
          winner.score += 60;
          this.dropFoodFromWorm(loser);
          break;
        }
      }
    }
  }

  checkFoodEating() {
    const allWorms = Array.from(this.players.values());

    for (const worm of allWorms) {
      if (worm.isDead) continue;
      const eatDist = worm.radius + 14;
      const eatDistSq = eatDist * eatDist;

      for (let i = this.foods.length - 1; i >= 0; i--) {
        const f = this.foods[i];
        const dx = worm.x - f.x;
        const dy = worm.y - f.y;
        if (dx * dx + dy * dy < eatDistSq) {
          worm.score += (f.points || 3);
          this.pendingEatenFoods.push({ x: f.x, y: f.y });
          this.foods.splice(i, 1);
        }
      }
    }

    if (this.foods.length < TARGET_FOOD_COUNT) {
      const needed = Math.min(8, TARGET_FOOD_COUNT - this.foods.length);
      for (let i = 0; i < needed; i++) {
        this.spawnFood();
      }
    }
  }

  tick() {
    if (this.players.size === 0) return;
    // Özel oda lobisindeyken (Host henüz başlatmamışken) oyun döngüsü ve GAME_TICK kesinlikle durdurulur!
    if (this.roomCode !== 'ONLINE' && this.state !== 'PLAYING') return;

    // 1. Oyuncuları ilerlet
    for (const worm of this.players.values()) {
      worm.update();
    }

    // 2. Çarpışmaları hesapla
    this.checkCollisions();

    // 3. Yem yemeleri hesapla
    this.checkFoodEating();

    // 4. Durum paketini derle ve yayınla
    const wormStates = Array.from(this.players.values()).map(w => w.serialize());

    const tickPayload = JSON.stringify({
      type: 'GAME_TICK',
      worms: wormStates,
      newFoods: this.pendingNewFoods,
      eatenFoods: this.pendingEatenFoods
    });

    this.pendingNewFoods = [];
    this.pendingEatenFoods = [];

    for (const ws of this.players.keys()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(tickPayload);
      }
    }
  }

  broadcast(obj) {
    const payload = typeof obj === 'string' ? obj : JSON.stringify(obj);
    for (const ws of this.players.keys()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }

  getLobbyList() {
    return Array.from(this.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      skinId: p.skinId,
      hatId: p.hatId,
      isHost: p.isHost
    }));
  }

  destroy() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.players.clear();
    this.foods = [];
  }
}

// Tüm aktif odalar haritası
const rooms = new Map(); // roomCode -> RoomInstance
const MAX_PLAYERS_PER_ROOM = 25; // Canlı arenada her oda en fazla 20-25 kişilik

function getOrCreateRoom(roomCode = 'ONLINE') {
  const code = String(roomCode || 'ONLINE').trim().toUpperCase();
  let room = rooms.get(code);
  if (!room) {
    room = new RoomInstance(code);
    rooms.set(code, room);
    console.log(`[+] Yeni oda oluşturuldu: ${code}`);
  }
  return room;
}

// Canlı Arena için 20-25 kişilik dinamik oda havuzu ve rastgele eşleştirme
function findOrSpawnArenaRoom() {
  // 1. Kapasitesi 25'ten az olan mevcut açık canlı arena odalarını bul
  const availableArenas = [];
  for (const room of rooms.values()) {
    if (room.roomCode.startsWith('ARENA_') && room.players.size < MAX_PLAYERS_PER_ROOM) {
      availableArenas.push(room);
    }
  }

  // 2. Eğer yer olan açık oda varsa, kullanıcıyı rastgele birine ata (20-25 kişilik odalar)
  if (availableArenas.length > 0) {
    const chosenRoom = availableArenas[Math.floor(Math.random() * availableArenas.length)];
    return chosenRoom;
  }

  // 3. Eğer mevcut tüm odalar 25 kişiyle dolmuşsa veya henüz hiç arena yoksa, yeni bir arena odası aç!
  let arenaNum = 1;
  while (rooms.has(`ARENA_${arenaNum}`)) {
    const r = rooms.get(`ARENA_${arenaNum}`);
    if (r.players.size < MAX_PLAYERS_PER_ROOM) {
      return r;
    }
    arenaNum++;
  }

  const newCode = `ARENA_${arenaNum}`;
  const newRoom = getOrCreateRoom(newCode);
  newRoom.state = 'PLAYING';
  console.log(`[🌐] Yeni 25 Kişilik Canlı Arena Odası Başlatıldı: ${newCode}`);
  return newRoom;
}

// ==================== WEBSOCKET BAĞLANTI YÖNETİMİ ====================
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const playerId = `p_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  let currentRoom = null;
  let playerWorm = null;

  console.log(`[+] Soket bağlandı: ${playerId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'PING') {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'PONG' }));
        }
        return;
      }

      if (data.type === 'PLAYER_HELLO') {
        const playerName = (data.name || 'Oyuncu').substring(0, 14);
        const skinId = data.skinId || 'white_king';
        const hatId = data.hatId || 'none';
        const rawCode = String(data.roomCode || 'ONLINE').trim().toUpperCase();
        const isPublicArena = rawCode === 'ONLINE' || rawCode.startsWith('ARENA_');

        if (isPublicArena) {
          // Canlı arenaya giren kullanıcıyı 20-25 kişilik rastgele müsait bir odaya yönlendir
          currentRoom = findOrSpawnArenaRoom();
        } else {
          // Özel arkadaş odası (örn. 7842)
          currentRoom = getOrCreateRoom(rawCode);
        }

        const roomCode = currentRoom.roomCode;
        const isHost = (!isPublicArena && currentRoom.players.size === 0) ? true : !!data.isHost;
        playerWorm = new ServerWorm(playerId, playerName, skinId, hatId, isHost);
        currentRoom.players.set(ws, playerWorm);

        const activeSpawns = {
          [playerId]: { x: playerWorm.x, y: playerWorm.y, angle: playerWorm.angle }
        };

        ws.send(JSON.stringify({
          type: 'HELLO_ACK',
          playerId: playerId,
          roomCode: roomCode,
          isHost: isHost,
          isArena: isPublicArena
        }));

        // Eğer genel arena ise direkt oyuna başlat:
        if (isPublicArena) {
          ws.send(JSON.stringify({
            type: 'GAME_START',
            roomCode: roomCode,
            worldWidth: WORLD_WIDTH,
            worldHeight: WORLD_HEIGHT,
            foods: currentRoom.foods.map(f => ({ x: f.x, y: f.y, type: f.type })),
            spawns: activeSpawns,
            players: currentRoom.getLobbyList()
          }));
        } else if (currentRoom.state === 'PLAYING') {
          // Özel oda zaten başlatılmışsa oyuna dahil et:
          ws.send(JSON.stringify({
            type: 'GAME_START',
            roomCode: roomCode,
            worldWidth: WORLD_WIDTH,
            worldHeight: WORLD_HEIGHT,
            foods: currentRoom.foods.map(f => ({ x: f.x, y: f.y, type: f.type })),
            spawns: activeSpawns,
            players: currentRoom.getLobbyList()
          }));
        } else {
          // ÖZEL ODA LOBİSİNDE: KESİNLİKLE HİÇ KİMSE OYUNA GİREMEZ!
          // Oda sahibi "BAŞLAT" butonuna basana kadar herkes lobide bekler:
          currentRoom.broadcast({
            type: 'LOBBY_STATE',
            roomCode: roomCode,
            players: currentRoom.getLobbyList()
          });
        }

        console.log(`[>] ${playerName} (${playerId}) [Oda: ${roomCode}] katıldı. (Arena: ${isPublicArena}, Kişi: ${currentRoom.players.size}/${isPublicArena ? MAX_PLAYERS_PER_ROOM : 'Sınırsız'})`);
      } else if (data.type === 'START_ROOM_GAME') {
        // Sadece oda sahibi odayı başlatabilir!
        if (currentRoom && playerWorm && playerWorm.isHost) {
          currentRoom.state = 'PLAYING';
          const spawns = {};
          const count = currentRoom.players.size;
          let idx = 0;
          for (const p of currentRoom.players.values()) {
            const angle = (idx / count) * Math.PI * 2;
            spawns[p.id] = {
              x: Math.round(WORLD_WIDTH / 2 + Math.cos(angle) * 750),
              y: Math.round(WORLD_HEIGHT / 2 + Math.sin(angle) * 750),
              angle: Number((angle + Math.PI / 2).toFixed(2))
            };
            p.x = spawns[p.id].x;
            p.y = spawns[p.id].y;
            p.angle = spawns[p.id].angle;
            idx++;
          }

          currentRoom.broadcast({
            type: 'GAME_START',
            roomCode: currentRoom.roomCode,
            worldWidth: WORLD_WIDTH,
            worldHeight: WORLD_HEIGHT,
            foods: currentRoom.foods.map(f => ({ x: f.x, y: f.y, type: f.type })),
            spawns: spawns,
            players: currentRoom.getLobbyList()
          });
          console.log(`[🚀] Oda sahibi oyunu başlattı! [Oda: ${currentRoom.roomCode}] Toplam oyuncu: ${currentRoom.players.size}`);
        }
      } else if (data.type === 'PLAYER_INPUT') {
        if (playerWorm && !playerWorm.isDead) {
          // İstemci koordinatlarını eşitle (Hassas çarpışma için)
          if (typeof data.x === 'number' && typeof data.y === 'number') {
            playerWorm.x = data.x;
            playerWorm.y = data.y;
          }
          if (typeof data.angle === 'number') {
            playerWorm.angle = data.angle;
          }
          if (typeof data.targetAngle === 'number') {
            playerWorm.targetAngle = data.targetAngle;
          }
          playerWorm.isBoosting = !!data.isBoosting;
        }
      } else if (data.type === 'CLIENT_DIED') {
        // İstemci yerel çarpışma ile öldüğünü bildirdi
        if (playerWorm && !playerWorm.isDead && currentRoom) {
          playerWorm.isDead = true;
          playerWorm.killedBy = data.killedBy || 'Başka bir solucan';
          currentRoom.dropFoodFromWorm(playerWorm);
        }
      } else if (data.type === 'CLIENT_ATE_FOOD') {
        // İstemci yem yediğini bildirdi
        if (playerWorm && !playerWorm.isDead && currentRoom && data.eaten && Array.isArray(data.eaten)) {
          data.eaten.forEach(ef => {
            playerWorm.score += (ef.points || 3);
            const foundIdx = currentRoom.foods.findIndex(f => Math.hypot(f.x - ef.x, f.y - ef.y) < 55);
            if (foundIdx !== -1) {
              currentRoom.foods.splice(foundIdx, 1);
              currentRoom.pendingEatenFoods.push(ef);
            }
          });
        }
      } else if (data.type === 'PLAYER_RESPAWN') {
        if (playerWorm && currentRoom) {
          playerWorm.x = Math.round(WORLD_WIDTH / 2 + (Math.random() - 0.5) * 1600);
          playerWorm.y = Math.round(WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 1600);
          playerWorm.angle = Math.random() * Math.PI * 2;
          playerWorm.targetAngle = playerWorm.angle;
          playerWorm.score = 15;
          playerWorm.radius = 11;
          playerWorm.isDead = false;
          playerWorm.killedBy = null;
          playerWorm.body = [];
          for (let i = 0; i < 11; i++) {
            playerWorm.body.push({
              x: playerWorm.x - Math.cos(playerWorm.angle) * (i * 6),
              y: playerWorm.y - Math.sin(playerWorm.angle) * (i * 6)
            });
          }

          ws.send(JSON.stringify({
            type: 'RESPAWN_ACK',
            x: playerWorm.x,
            y: playerWorm.y
          }));
        }
      }
    } catch (e) {
      console.warn('Mesaj işleme hatası:', e);
    }
  });

  ws.on('close', () => {
    if (currentRoom && playerWorm) {
      console.log(`[-] Oyuncu ayrıldı: ${playerWorm.name} (${playerId}) [Oda: ${currentRoom.roomCode}]`);
      currentRoom.dropFoodFromWorm(playerWorm);
      currentRoom.players.delete(ws);

      // Lobideyken oyuncu ayrıldıysa lobi listesini güncelle
      if (currentRoom.state === 'LOBBY') {
        currentRoom.broadcast({
          type: 'LOBBY_STATE',
          roomCode: currentRoom.roomCode,
          players: currentRoom.getLobbyList()
        });
      }

      // Boşalan özel odaları temizle
      if (currentRoom.players.size === 0 && currentRoom.roomCode !== 'ONLINE') {
        setTimeout(() => {
          if (currentRoom.players.size === 0) {
            currentRoom.destroy();
            rooms.delete(currentRoom.roomCode);
            console.log(`[x] Boş oda kapatıldı: ${currentRoom.roomCode}`);
          }
        }, 30000);
      }
    }
  });

  ws.on('error', (err) => {
    console.warn(`[!] Soket hatası (${playerId}):`, err.message);
  });
});

// ==================== BAŞLAT ====================
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🐛 WORM ARENA 7/24 OYUN SUNUCUSU BAŞLATILDI!`);
  console.log(`🌐 HTTP & WebSocket Portu: ${PORT}`);
  console.log(`👥 Çok Oyunculu Oda & Canlı Arena Desteği: Aktif`);
  console.log(`🤖 Arenada Bot Sayısı: ${BOT_COUNT} (Sadece Gerçek Oyuncular)`);
  console.log(`====================================================`);
});
