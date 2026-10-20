/**
 * ========================================================
 * WORM ARENA - 7/24 DEDICATED WEBSOCKET OYUN SUNUCUSU
 * Slither.io / Wormate.io Mimarisi
 * 
 * • 7/24 İnternette çalışabilir (Render.com, VPS vb. 0 TL)
 * • Oyun mantığı (yılanlar, yemler, botlar, çarpışmalar) sunucuda döner
 * • İstemciler sadece yön açısını gönderir
 * • Hile yapılamaz, host kopması yaşanmaz
 * ========================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Port ayarı (Render.com ve bulut platformları process.env.PORT kullanır)
const PORT = process.env.PORT || 3000;
const CLIENT_ROOT = path.join(__dirname, '..');

// ==================== STATİK DOSYA SUNUCUSU ====================
// Tarayıcıdan açıldığında oyunu doğrudan oynamayı sağlar
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
  // CORS başlıkları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Sunucu sağlık kontrolü rotası
  if (req.url === '/health' || req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', players: game.players.size, time: Date.now() }));
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

// ==================== OYUN VERİ TANIMLARI ====================
const WORLD_WIDTH = 6400;
const WORLD_HEIGHT = 6400;
const TARGET_FOOD_COUNT = 1200;
const BOT_COUNT = 12;

const BOT_NAMES = [
  'Timothy', 'Hugo', 'Fox', 'Kowalski', 'Shadow', 'Alice', 'Rex', 'Viper',
  'Speedy', 'Phantom', 'Dragon', 'Blaze', 'Storm', 'Luna', 'Titan'
];

const BOT_SKINS = [
  'white_king', 'candy_pink', 'neon_cyber', 'golden_dragon', 'fire_tiger',
  'shadow_ninja', 'samurai_warlord', 'dark_galaxy', 'frozen_frost'
];

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

// ==================== SUNUCU OYUN MOTORU (SERVER GAME ENGINE) ====================
class ServerWorm {
  constructor(id, name, skinId, hatId, isBot = false, x = null, y = null) {
    this.id = id;
    this.name = name || (isBot ? 'Bot' : 'Oyuncu');
    this.skinId = skinId || 'white_king';
    this.hatId = hatId || 'none';
    this.isBot = isBot;

    this.x = x !== null ? x : Math.round(WORLD_WIDTH / 2 + (Math.random() - 0.5) * 2000);
    this.y = y !== null ? y : Math.round(WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 2000);
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

    // Gövde segmentleri
    this.body = [];
    const initialSegments = 11;
    for (let i = 0; i < initialSegments; i++) {
      this.body.push({
        x: Math.round(this.x - Math.cos(this.angle) * (i * this.spacing)),
        y: Math.round(this.y - Math.sin(this.angle) * (i * this.spacing))
      });
    }

    // Bot yapay zeka değişkenleri
    this.botTimer = Math.floor(Math.random() * 60);
    this.botTargetFood = null;
  }

  update(foods, allWorms) {
    if (this.isDead) return;

    // Hızlanma ve kütle yakımı
    if (this.isBoosting && this.score > 8) {
      this.speed = this.boostSpeed;
      this.score = Math.max(8, this.score - 0.20);
    } else {
      this.speed = this.baseSpeed;
      this.isBoosting = false;
    }

    // Yarıçap ve uzunluk hesabı
    this.radius = Math.min(28, 11 + Math.floor(this.score / 180));
    this.targetLength = Math.max(8, 11 + Math.floor(this.score / 15));
    this.spacing = Math.max(6.5, this.radius * 0.52);

    // Bot yapay zekası
    if (this.isBot) {
      this.updateBotAI(foods, allWorms);
    }

    // Yumuşak dönüş
    let diff = this.targetAngle - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const turnFactor = this.isBoosting ? 0.18 : 0.13;
    const maxTurnSpeed = this.isBoosting ? 0.14 : 0.098;
    const turnStep = Math.max(-maxTurnSpeed, Math.min(maxTurnSpeed, diff * turnFactor * 1.35));
    this.angle += turnStep;

    while (this.angle < -Math.PI) this.angle += Math.PI * 2;
    while (this.angle > Math.PI) this.angle -= Math.PI * 2;

    // Başı ilerlet
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Harita sınırı kontrolü
    const margin = this.radius + 10;
    if (this.x < margin || this.x > WORLD_WIDTH - margin || this.y < margin || this.y > WORLD_HEIGHT - margin) {
      this.isDead = true;
      this.killedBy = 'Arena Duvarı';
      return;
    }

    // Gövde segment takibi
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

    // Uzunluk dengeleme
    while (this.body.length < this.targetLength) {
      const last = this.body[this.body.length - 1];
      this.body.push({ x: last.x, y: last.y });
    }
    while (this.body.length > this.targetLength) {
      this.body.pop();
    }
  }

  updateBotAI(foods, allWorms) {
    this.botTimer++;

    // 1. Sınırlardan kaçınma
    const edgeMargin = 250;
    if (this.x < edgeMargin) { this.targetAngle = 0; return; }
    if (this.x > WORLD_WIDTH - edgeMargin) { this.targetAngle = Math.PI; return; }
    if (this.y < edgeMargin) { this.targetAngle = Math.PI / 2; return; }
    if (this.y > WORLD_HEIGHT - edgeMargin) { this.targetAngle = -Math.PI / 2; return; }

    // 2. Tehlikeli gövdelerden kaçınma
    const lookAheadDist = this.radius * 3.5 + 40;
    const lookX = this.x + Math.cos(this.angle) * lookAheadDist;
    const lookY = this.y + Math.sin(this.angle) * lookAheadDist;

    for (const other of allWorms) {
      if (other === this || other.isDead) continue;
      for (let i = 2; i < other.body.length; i += 2) {
        const seg = other.body[i];
        if (Math.hypot(lookX - seg.x, lookY - seg.y) < other.radius + this.radius + 15) {
          const awayAngle = Math.atan2(this.y - seg.y, this.x - seg.x);
          this.targetAngle = awayAngle;
          this.isBoosting = false;
          return;
        }
      }
    }

    // 3. En yakın yeme yönelme
    if (this.botTimer % 20 === 0 || !this.botTargetFood) {
      let closestDist = 450;
      let closestFood = null;
      for (let i = 0; i < foods.length; i += 4) { // Hızlı örnekleme
        const f = foods[i];
        const dist = Math.hypot(this.x - f.x, this.y - f.y);
        if (dist < closestDist) {
          closestDist = dist;
          closestFood = f;
        }
      }
      this.botTargetFood = closestFood;
    }

    if (this.botTargetFood) {
      this.targetAngle = Math.atan2(this.botTargetFood.y - this.y, this.botTargetFood.x - this.x);
    }
  }

  // Ağ aktarımı için hafifletilmiş veri paketi
  serialize() {
    // Bant genişliği tasarrufu için gövde noktalarını seyrelt (downsample)
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
      isBot: this.isBot,
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

class ServerGame {
  constructor() {
    this.players = new Map(); // ws -> ServerWorm
    this.bots = [];
    this.foods = [];
    this.pendingNewFoods = [];
    this.pendingEatenFoods = [];
    this.foodIdCounter = 1;

    this.initFoods();
    this.initBots();

    // Saniyede 30 tick fizik & ağ güncellemesi (~33.3ms)
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

  initBots() {
    this.bots = [];
    for (let i = 0; i < BOT_COUNT; i++) {
      this.spawnBot(i);
    }
  }

  spawnBot(index = 0) {
    const name = BOT_NAMES[index % BOT_NAMES.length] || `Bot_${index}`;
    const skin = BOT_SKINS[index % BOT_SKINS.length];
    const bot = new ServerWorm(`bot_${Date.now()}_${Math.floor(Math.random() * 1000)}`, name, skin, 'none', true);
    this.bots.push(bot);
    return bot;
  }

  // Ölen yılanın vücudunu lezzetli yıldız ve meyvelere dönüştür (Slither.io ziyafeti)
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

  // Çarpışma kontrolleri (Kafa gövdeye çarparsa kafa ölür!)
  checkCollisions(allWorms) {
    for (const wA of allWorms) {
      if (wA.isDead) continue;

      for (const wB of allWorms) {
        if (wA === wB || wB.isDead) continue;

        // wA'nın kafası wB'nin gövdesine çarptı mı?
        const hitDistance = wA.radius + wB.radius * 0.72;
        const hitDistSq = hitDistance * hitDistance;

        for (let i = 1; i < wB.body.length; i++) {
          const seg = wB.body[i];
          const dx = wA.x - seg.x;
          const dy = wA.y - seg.y;
          if (dx * dx + dy * dy < hitDistSq) {
            // wA öldü!
            wA.isDead = true;
            wA.killedBy = wB.name;
            wB.kills = (wB.kills || 0) + 1;
            wB.score += 25; // Öldürme ödülü
            this.dropFoodFromWorm(wA);
            break;
          }
        }

        if (wA.isDead) break;
      }
    }
  }

  // Yem yeme kontrolleri
  checkFoodEating(allWorms) {
    for (const worm of allWorms) {
      if (worm.isDead) continue;
      const eatDist = worm.radius + 12;
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

    // Yem sayısı düştüyse yeni yemler üret
    if (this.foods.length < TARGET_FOOD_COUNT) {
      const needed = Math.min(8, TARGET_FOOD_COUNT - this.foods.length);
      for (let i = 0; i < needed; i++) {
        this.spawnFood();
      }
    }
  }

  // 30 FPS Ana Döngü
  tick() {
    const playerWorms = Array.from(this.players.values());
    const allWorms = [...playerWorms, ...this.bots];

    // 1. Tüm yılanları ilerlet
    for (const w of allWorms) {
      w.update(this.foods, allWorms);
    }

    // 2. Çarpışmaları hesapla
    this.checkCollisions(allWorms);

    // 3. Yem yemeleri hesapla
    this.checkFoodEating(allWorms);

    // 4. Ölen botları temizle ve yeniden doğur
    for (let i = this.bots.length - 1; i >= 0; i--) {
      const bot = this.bots[i];
      if (bot.isDead) {
        this.bots.splice(i, 1);
        setTimeout(() => {
          if (this.bots.length < BOT_COUNT) {
            this.spawnBot(Math.floor(Math.random() * BOT_NAMES.length));
          }
        }, 3500);
      }
    }

    // 5. Durum paketini derle ve tüm bağlı oyunculara yayınla
    const wormStates = allWorms.map(w => w.serialize());

    const tickPayload = JSON.stringify({
      type: 'GAME_TICK',
      worms: wormStates,
      newFoods: this.pendingNewFoods,
      eatenFoods: this.pendingEatenFoods
    });

    this.pendingNewFoods = [];
    this.pendingEatenFoods = [];

    // Tüm bağlı WebSocket istemcilerine gönder
    for (const [ws, playerWorm] of this.players.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(tickPayload);
      }
    }
  }
}

const game = new ServerGame();

// ==================== WEBSOCKET BAĞLANTI YÖNETİMİ ====================
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const playerId = `p_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  let playerWorm = null;

  console.log(`[+] Yeni oyuncu bağlandı: ${playerId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'PLAYER_HELLO') {
        const playerName = (data.name || 'Oyuncu').substring(0, 14);
        const skinId = data.skinId || 'white_king';
        const hatId = data.hatId || 'none';

        playerWorm = new ServerWorm(playerId, playerName, skinId, hatId, false);
        game.players.set(ws, playerWorm);

        // İstemciye başlangıç paketini gönder
        const activeSpawns = {
          [playerId]: { x: playerWorm.x, y: playerWorm.y, angle: playerWorm.angle }
        };

        const currentPlayersList = Array.from(game.players.values()).map(p => ({
          id: p.id,
          name: p.name,
          skinId: p.skinId,
          hatId: p.hatId
        }));

        ws.send(JSON.stringify({
          type: 'HELLO_ACK'
        }));

        ws.send(JSON.stringify({
          type: 'GAME_START',
          roomCode: 'ONLINE',
          worldWidth: WORLD_WIDTH,
          worldHeight: WORLD_HEIGHT,
          foods: game.foods.map(f => ({ x: f.x, y: f.y, type: f.type })),
          spawns: activeSpawns,
          players: currentPlayersList
        }));

        console.log(`[>] ${playerName} (${playerId}) arenaya girdi! Toplam oyuncu: ${game.players.size}`);
      } else if (data.type === 'PLAYER_INPUT') {
        if (playerWorm && !playerWorm.isDead) {
          if (typeof data.targetAngle === 'number') {
            playerWorm.targetAngle = data.targetAngle;
          }
          playerWorm.isBoosting = !!data.isBoosting;
        }
      } else if (data.type === 'PLAYER_RESPAWN') {
        if (playerWorm) {
          playerWorm.x = Math.round(WORLD_WIDTH / 2 + (Math.random() - 0.5) * 2000);
          playerWorm.y = Math.round(WORLD_HEIGHT / 2 + (Math.random() - 0.5) * 2000);
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
    if (playerWorm) {
      console.log(`[-] Oyuncu ayrıldı: ${playerWorm.name} (${playerId})`);
      game.dropFoodFromWorm(playerWorm);
    }
    game.players.delete(ws);
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
  console.log(`🎮 Yerel Test: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Adresi: ws://localhost:${PORT}`);
  console.log(`====================================================`);
});
