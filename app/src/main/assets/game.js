/* ========================================================
   WORM ARENA - 360° ÇOK OYUNCULU SOLUCAN & YILAN SAVAŞI
   Slither.io / Wormate.io tarzı fizik, akıllı botlar, WebRTC çok oyunculu oda,
   şans çarkı, şapka/kostüm mağazası, görevler ve canlı etkinlikler!
   ======================================================== */

// Kostüm Tanımları (Her biri farklı seviyede açılır ve kendine özgü şekil/anatomiye sahiptir)
const SKINS = [
  { id: 'white_king', get name() { return window.I18N ? window.I18N.getSkinName('white_king') : 'Holy White Dragon'; }, unlockLevel: 1, shape: 'dragon', head: '#ffffff', body1: '#f8fafc', body2: '#00f0ff', glow: '#00f0ff', outline: '#090d1a', spine: '#ffd700', belly: '#dbeafe', cost: 0 },
  { id: 'candy_pink', get name() { return window.I18N ? window.I18N.getSkinName('candy_pink') : 'Crystal Candy Cobra'; }, unlockLevel: 2, shape: 'cobra', head: '#ff66b2', body1: '#ff1493', body2: '#ff85c0', glow: '#ff007f', outline: '#3d0020', spine: '#ffffff', belly: '#ffe4ef', cost: 100 },
  { id: 'neon_cyber', get name() { return window.I18N ? window.I18N.getSkinName('neon_cyber') : 'Cyber Mecha Titan'; }, unlockLevel: 4, shape: 'mecha', head: '#00ffff', body1: '#0284c7', body2: '#00e5ff', glow: '#00f0ff', outline: '#001e28', spine: '#00ffcc', belly: '#0f172a', cost: 200 },
  { id: 'golden_dragon', get name() { return window.I18N ? window.I18N.getSkinName('golden_dragon') : 'Imperial Gold Dragon'; }, unlockLevel: 6, shape: 'golden_serpent', head: '#ffe066', body1: '#ffb700', body2: '#ff8800', glow: '#ffb700', outline: '#3b2000', spine: '#ff3300', belly: '#fff3c4', cost: 300 },
  { id: 'fire_tiger', get name() { return window.I18N ? window.I18N.getSkinName('fire_tiger') : 'Magma Fire Serpent'; }, unlockLevel: 8, shape: 'magma', head: '#ff4500', body1: '#b91c1c', body2: '#ea580c', glow: '#ff3300', outline: '#2b0600', spine: '#ffff00', belly: '#ffccaa', cost: 400 },
  { id: 'shadow_ninja', get name() { return window.I18N ? window.I18N.getSkinName('shadow_ninja') : 'Shadow Assassin'; }, unlockLevel: 11, shape: 'ninja', head: '#334155', body1: '#0f172a', body2: '#1e1b4b', glow: '#ef4444', outline: '#020617', spine: '#ef4444', belly: '#1e293b', cost: 550 },
  { id: 'samurai_warlord', get name() { return window.I18N ? window.I18N.getSkinName('samurai_warlord') : 'Ancient Samurai Shogun'; }, unlockLevel: 15, shape: 'samurai', head: '#b91c1c', body1: '#7f1d1d', body2: '#d97706', glow: '#f59e0b', outline: '#450a0a', spine: '#fbbf24', belly: '#fef3c7', cost: 700 },
  { id: 'dark_galaxy', get name() { return window.I18N ? window.I18N.getSkinName('dark_galaxy') : 'Cosmic Void Dragon'; }, unlockLevel: 19, shape: 'cosmic', head: '#c084fc', body1: '#7e22ce', body2: '#3b0764', glow: '#a855f7', outline: '#17032c', spine: '#00f0ff', belly: '#581c87', cost: 850 },
  { id: 'frozen_frost', get name() { return window.I18N ? window.I18N.getSkinName('frozen_frost') : 'Glacial Frost Drake'; }, unlockLevel: 24, shape: 'frost', head: '#38bdf8', body1: '#0284c7', body2: '#bae6fd', glow: '#00f0ff', outline: '#082f49', spine: '#e0f2fe', belly: '#f0f9ff', cost: 1000 }
];

function createMilestone(day, target, rewardIcon, rewardCoins, rewardXp, rewardItem, rewardSkin) {
  return {
    day,
    get tag() {
      const m = window.I18N && window.I18N.getMilestone(day);
      return m ? m.tag : `DAY ${day}`;
    },
    target,
    get goalText() {
      const m = window.I18N && window.I18N.getMilestone(day);
      return m ? m.goalText : `Reach ${target} Score`;
    },
    rewardIcon,
    get rewardText() {
      const m = window.I18N && window.I18N.getMilestone(day);
      return m ? m.rewardText : `+${rewardCoins} Coins`;
    },
    rewardCoins,
    rewardXp,
    rewardItem,
    rewardSkin
  };
}

// 🎁 Günlük Sadakat & Büyük Aşama Ödülleri (1..7, 15, 30, 60, 90, 120, 150, 180, 365. Günler)
const SEVEN_DAY_REWARDS = [
  createMilestone(1, 25, '🪙', 200, 30, null),
  createMilestone(2, 50, '🕶️', 350, 50, 'sunglasses'),
  createMilestone(3, 100, '🪙', 500, 80, null),
  createMilestone(4, 180, '🤠', 750, 100, 'cowboy'),
  createMilestone(5, 300, '🪙', 1000, 150, null),
  createMilestone(6, 450, '🥷', 1500, 200, 'ninja'),
  createMilestone(7, 600, '👑', 2500, 300, 'crown'),
  createMilestone(15, 800, '😈', 3500, 500, 'horns'),
  createMilestone(30, 1000, '🤖', 5000, 1000, 'robot', 'fire_tiger'),
  createMilestone(60, 1300, '🧙', 7500, 1500, 'wizard', 'shadow_ninja'),
  createMilestone(90, 1600, '💀', 10000, 2000, 'skull', 'samurai_warlord'),
  createMilestone(120, 2000, '😇', 15000, 3000, 'halo', 'dark_galaxy'),
  createMilestone(150, 2400, '🐱', 20000, 4000, 'cat_ears'),
  createMilestone(180, 3000, '🏴‍☠️', 30000, 5000, 'pirate', 'frozen_frost'),
  createMilestone(365, 4000, '🔥', 50000, 10000, null)
];
const SEVEN_DAY_MILESTONES = SEVEN_DAY_REWARDS;

// Şapka / Baş Kostümü Tanımları (Seçildiğinde kafanın üstünde havada durmaz, kafanın kendisi olur!)
const HATS = [
  { id: 'none', get name() { return window.I18N ? window.I18N.getHatName('none') : 'Original Snake Head'; }, icon: '🐍', cost: 0, type: 'head' },
  { id: 'horns', get name() { return window.I18N ? window.I18N.getHatName('horns') : 'Demon Lord Head'; }, icon: '😈', cost: 150, type: 'head' },
  { id: 'ninja', get name() { return window.I18N ? window.I18N.getHatName('ninja') : 'Dark Ninja Head'; }, icon: '🥷', cost: 200, type: 'head' },
  { id: 'cat_ears', get name() { return window.I18N ? window.I18N.getHatName('cat_ears') : 'Cyber Cat Head'; }, icon: '🐱', cost: 250, type: 'head' },
  { id: 'cowboy', get name() { return window.I18N ? window.I18N.getHatName('cowboy') : 'Wild Cowboy Head'; }, icon: '🤠', cost: 300, type: 'head' },
  { id: 'pirate', get name() { return window.I18N ? window.I18N.getHatName('pirate') : 'Pirate Captain Head'; }, icon: '🏴‍☠️', cost: 350, type: 'head' },
  { id: 'halo', get name() { return window.I18N ? window.I18N.getHatName('halo') : 'Holy Angel Head'; }, icon: '😇', cost: 350, type: 'head' },
  { id: 'skull', get name() { return window.I18N ? window.I18N.getHatName('skull') : 'Cursed Skull'; }, icon: '💀', cost: 400, type: 'head' },
  { id: 'robot', get name() { return window.I18N ? window.I18N.getHatName('robot') : 'Cyborg Robot Head'; }, icon: '🤖', cost: 450, type: 'head' },
  { id: 'crown', get name() { return window.I18N ? window.I18N.getHatName('crown') : 'Golden Crown King Head'; }, icon: '👑', cost: 250, type: 'head' },
  { id: 'sunglasses', get name() { return window.I18N ? window.I18N.getHatName('sunglasses') : 'Cool Star Head'; }, icon: '😎', cost: 200, type: 'head' },
  { id: 'party_hat', get name() { return window.I18N ? window.I18N.getHatName('party_hat') : 'Crazy Party Head'; }, icon: '🥳', cost: 180, type: 'head' },
  { id: 'wizard', get name() { return window.I18N ? window.I18N.getHatName('wizard') : 'Ancient Wizard Head'; }, icon: '🧙', cost: 350, type: 'head' }
];

const BOT_NAMES = [
  'Timothy', 'Hugo', 'Fox', 'Kowalski', 'Shadow', 'Alice', 'Rex', 'Viper',
  'Speedy', 'Phantom', 'Dragon', 'Blaze', 'Storm', 'Luna', 'Titan'
];

const FOOD_TYPES = [
  { type: 'apple', icon: '🍎', points: 3, radius: 10, color: '#ff3344' },
  { type: 'banana', icon: '🍌', points: 4, radius: 11, color: '#ffd000' },
  { type: 'donut', icon: '🍩', points: 6, radius: 13, color: '#ff66aa' },
  { type: 'star_coin', icon: '⭐', points: 15, radius: 16, color: '#ffbb00' },
  { type: 'orb', icon: '✨', points: 8, radius: 9, color: '#00f0ff' },
  // Güçlendirme Meyveleri
  { type: 'magnet', icon: '🧲', points: 25, radius: 18, color: '#ff0055', isPowerup: true },
  { type: 'energy_star', icon: '⚡', points: 30, radius: 18, color: '#ffee00', isPowerup: true },
  { type: 'double', icon: '2️⃣', points: 25, radius: 18, color: '#00ff88', isPowerup: true }
];

// ==================== 9 FARKLI YILAN ANATOMİSİ VE ŞEKLİ (60 FPS OPTİMİZE) ====================
function drawSpeciesSegment(ctx, skin, r, index, progress, isBoosting, tier) {
  const shape = skin.shape || 'dragon';
  const isEven = index % 2 === 0;
  const col1 = isEven ? skin.body1 : skin.body2;
  const col2 = isEven ? skin.body2 : skin.body1;
  const outline = skin.outline || '#090d1a';
  const glow = skin.glow || '#00f0ff';

  ctx.lineWidth = 1.4;
  ctx.strokeStyle = outline;

  switch (shape) {
    case 'mecha': {
      // 🤖 SİBER MECHA: Keskin Geometrik Altıgen Zırh Şasisi + Sibernetik Güç Çekirdeği
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const hx = Math.cos(ang) * r * 1.05;
        const hy = Math.sin(ang) * r * 1.05;
        if (a === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const hx = Math.cos(ang) * r * 0.9;
        const hy = Math.sin(ang) * r * 0.9;
        if (a === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = col1;
      ctx.fill();

      // Sibernetik Reaktör Çekirdeği
      ctx.fillStyle = isBoosting ? '#ffffff' : glow;
      ctx.fillRect(-r * 0.28, -r * 0.28, r * 0.56, r * 0.56);
      break;
    }

    case 'ninja': {
      // 🥷 GÖLGE SUİKASTÇI: Keskin Kavisli Shuriken / Hilal Bıçak Kanatları
      ctx.beginPath();
      ctx.moveTo(r * 1.1, 0);
      ctx.quadraticCurveTo(r * 0.2, r * 1.35, -r * 0.85, r * 1.25);
      ctx.lineTo(-r * 0.45, r * 0.45);
      ctx.lineTo(-r * 1.2, 0);
      ctx.lineTo(-r * 0.45, -r * 0.45);
      ctx.lineTo(-r * 0.85, -r * 1.25);
      ctx.quadraticCurveTo(r * 0.2, -r * 1.35, r * 1.1, 0);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 0.98, 0);
      ctx.quadraticCurveTo(r * 0.15, r * 1.15, -r * 0.72, r * 1.08);
      ctx.lineTo(-r * 0.38, r * 0.38);
      ctx.lineTo(-r * 1.02, 0);
      ctx.lineTo(-r * 0.38, -r * 0.38);
      ctx.lineTo(-r * 0.72, -r * 1.08);
      ctx.quadraticCurveTo(r * 0.15, -r * 1.15, r * 0.98, 0);
      ctx.closePath();
      ctx.fillStyle = col1;
      ctx.fill();

      ctx.strokeStyle = glow;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, 0);
      ctx.lineTo(r * 0.7, 0);
      ctx.stroke();
      break;
    }

    case 'magma': {
      // 🔥 MAGMA ATEŞ YILANI: Kırık Bazalt Volkanik Kaya Parçaları & Akkor Lav Yarıkları
      ctx.beginPath();
      ctx.moveTo(r * 1.15, -r * 0.2);
      ctx.lineTo(r * 0.8, r * 0.9);
      ctx.lineTo(-r * 0.25, r * 1.15);
      ctx.lineTo(-r * 1.15, r * 0.45);
      ctx.lineTo(-r * 0.95, -r * 0.7);
      ctx.lineTo(r * 0.15, -r * 1.1);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.0, -r * 0.18);
      ctx.lineTo(r * 0.7, r * 0.78);
      ctx.lineTo(-r * 0.2, r * 0.98);
      ctx.lineTo(-r * 0.98, r * 0.38);
      ctx.lineTo(-r * 0.8, -r * 0.58);
      ctx.lineTo(r * 0.1, -r * 0.95);
      ctx.closePath();
      ctx.fillStyle = col1;
      ctx.fill();

      // Lav Yarığı
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = Math.max(1.4, r * 0.15);
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.2);
      ctx.lineTo(-r * 0.1, r * 0.2);
      ctx.lineTo(r * 0.4, -r * 0.1);
      ctx.lineTo(r * 0.8, r * 0.25);
      ctx.stroke();
      break;
    }

    case 'samurai': {
      // ⚔️ SAMURAY ŞOGUNU: Katmanlı Kozane Zırh Plakaları ve Altın Perçinler
      ctx.beginPath();
      ctx.roundRect(-r * 0.95, -r * 0.85, r * 1.9, r * 1.7, [4, 4, 4, 4]);
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(-r * 0.82, -r * 0.72, r * 1.64, r * 1.44, [3, 3, 3, 3]);
      ctx.fillStyle = col1;
      ctx.fill();

      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, 0);
      ctx.lineTo(r * 0.7, 0);
      ctx.stroke();
      break;
    }

    case 'frost': {
      // ❄️ BUZUL KIRAĞI EJDERİ: Keskin Kristal Elmas Buz Parçaları ve Sarkıtlar
      ctx.beginPath();
      ctx.moveTo(r * 1.25, 0);
      ctx.lineTo(r * 0.35, r * 1.05);
      ctx.lineTo(-r * 0.8, r * 1.15);
      ctx.lineTo(-r * 1.2, 0);
      ctx.lineTo(-r * 0.8, -r * 1.15);
      ctx.lineTo(r * 0.35, -r * 1.05);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.1, 0);
      ctx.lineTo(r * 0.3, r * 0.9);
      ctx.lineTo(-r * 0.7, r * 0.98);
      ctx.lineTo(-r * 1.05, 0);
      ctx.lineTo(-r * 0.7, -r * 0.98);
      ctx.lineTo(r * 0.3, -r * 0.9);
      ctx.closePath();
      ctx.fillStyle = col1;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.lineTo(r * 0.6, 0);
      ctx.lineTo(0, r * 0.8);
      ctx.stroke();
      break;
    }

    case 'cosmic': {
      // 🌌 KOZMİK HİÇLİK: Gezegensel Halka ve Karanlık Madde Çekirdeği
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = col1;
      ctx.fill();

      ctx.save();
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.35, r * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'golden_serpent': {
      // 👑 İMPARATORLUK ALTIN EJDERİ: Ağır Altın Zırh Pulları ve Yan Taç Dikenleri
      ctx.beginPath();
      ctx.moveTo(r * 1.18, 0);
      ctx.lineTo(r * 0.5, r * 0.95);
      ctx.lineTo(-r * 0.5, r * 1.18);
      ctx.lineTo(-r * 1.15, 0);
      ctx.lineTo(-r * 0.5, -r * 1.18);
      ctx.lineTo(r * 0.5, -r * 0.95);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.05, 0);
      ctx.lineTo(r * 0.42, r * 0.82);
      ctx.lineTo(-r * 0.42, r * 1.02);
      ctx.lineTo(-r * 1.0, 0);
      ctx.lineTo(-r * 0.42, -r * 1.02);
      ctx.lineTo(r * 0.42, -r * 0.82);
      ctx.closePath();
      ctx.fillStyle = col1;
      ctx.fill();
      break;
    }

    case 'cobra': {
      // 🐍 KRİSTAL ŞEKER KOBRASI: Geniş Kobra Boyun Başlığı Kanatları + Bombeli Pullar
      if (index >= 1 && index <= 5) {
        const hoodW = Math.sin((index / 6) * Math.PI) * Math.min(14, r * 0.65);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.ellipse(-r * 0.1, 0, r * 0.95, r + hoodW, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.98, r * 0.88, 0, 0, Math.PI * 2);
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.86, r * 0.76, 0, 0, Math.PI * 2);
      ctx.fillStyle = col1;
      ctx.fill();
      break;
    }

    default: {
      // 🐉 KUTSAL AK EJDER: Aerodinamik Zarif Ejder Pulları ve Yan Yüzgeç Mahmuzları
      ctx.beginPath();
      ctx.moveTo(r * 1.15, 0);
      ctx.quadraticCurveTo(r * 0.4, r * 1.05, -r * 0.85, r * 0.85);
      ctx.lineTo(-r * 1.25, 0);
      ctx.lineTo(-r * 0.85, -r * 0.85);
      ctx.quadraticCurveTo(r * 0.4, -r * 1.05, r * 1.15, 0);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.02, 0);
      ctx.quadraticCurveTo(r * 0.35, r * 0.92, -r * 0.75, r * 0.72);
      ctx.lineTo(-r * 1.12, 0);
      ctx.lineTo(-r * 0.75, -r * 0.72);
      ctx.quadraticCurveTo(r * 0.35, -r * 0.92, r * 1.02, 0);
      ctx.closePath();
      ctx.fillStyle = col1;
      ctx.fill();

      // 3D Parlama (Sıfır gradient bellek yükü)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.2, r * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // Sırt Ejder Dikeni
      ctx.fillStyle = skin.spine || '#ffd700';
      ctx.beginPath();
      ctx.moveTo(r * 0.65, 0);
      ctx.lineTo(-r * 0.45, -r * 0.32);
      ctx.lineTo(-r * 1.1, 0);
      ctx.lineTo(-r * 0.45, r * 0.32);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}

function drawSpeciesTail(ctx, skin, r, distFromTail, progress, isBoosting) {
  const shape = skin.shape || 'dragon';
  const outline = skin.outline || '#090d1a';
  const glow = skin.glow || '#00f0ff';

  switch (shape) {
    case 'mecha': {
      // Sibernetik Roket İtici Egzozu ve Plazma Ateşi
      ctx.beginPath();
      ctx.rect(-r * 0.8, -r * 0.6, r * 0.9, r * 1.2);
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.rect(-r * 0.7, -r * 0.48, r * 0.7, r * 0.96);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      ctx.fillStyle = isBoosting ? '#ffffff' : glow;
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.4);
      ctx.lineTo(-r * 1.8, 0);
      ctx.lineTo(-r * 0.8, r * 0.4);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'ninja': {
      // Çelik Kunai Fırlatma Bıçağı
      ctx.beginPath();
      ctx.moveTo(r * 0.5, 0);
      ctx.lineTo(-r * 0.3, -r * 0.4);
      ctx.lineTo(-r * 2.1, 0);
      ctx.lineTo(-r * 0.3, r * 0.4);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      break;
    }

    case 'samurai': {
      // Kavisli Çelik Katana Kılıç Ucu
      ctx.beginPath();
      ctx.moveTo(r * 0.4, -r * 0.2);
      ctx.quadraticCurveTo(-r * 0.8, -r * 0.6, -r * 2.2, -r * 0.2);
      ctx.lineTo(-r * 1.5, r * 0.25);
      ctx.lineTo(r * 0.3, r * 0.25);
      ctx.closePath();
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      break;
    }

    case 'frost': {
      // Elmas Buzul Mızrağı
      ctx.beginPath();
      ctx.moveTo(r * 0.5, 0);
      ctx.lineTo(-r * 0.4, -r * 0.5);
      ctx.lineTo(-r * 2.4, 0);
      ctx.lineTo(-r * 0.4, r * 0.5);
      ctx.closePath();
      ctx.fillStyle = '#e0f2fe';
      ctx.fill();
      ctx.strokeStyle = glow;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      break;
    }

    case 'golden_serpent': {
      // Dikenli Altın Topuz Flail
      ctx.beginPath();
      ctx.arc(-r * 1.1, 0, r * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
      ctx.strokeStyle = '#3b2000';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      break;
    }

    case 'magma': {
      // Yanan Lav Kayası Kümesi
      ctx.beginPath();
      ctx.arc(-r * 0.9, 0, r * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#b91c1c';
      ctx.fill();
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      break;
    }

    case 'cosmic': {
      // Kuyrukluyıldız Yıldız Tozu İzi
      ctx.beginPath();
      ctx.moveTo(r * 0.4, 0);
      ctx.lineTo(-r * 0.6, -r * 0.35);
      ctx.lineTo(-r * 2.0, 0);
      ctx.lineTo(-r * 0.6, r * 0.35);
      ctx.closePath();
      ctx.fillStyle = glow;
      ctx.fill();
      break;
    }

    default: {
      // Çıngırak / Klasik Ejder Kuyruk Ucu
      ctx.beginPath();
      ctx.moveTo(r * 0.5, 0);
      ctx.lineTo(-r * 0.6, -r * 0.4);
      ctx.lineTo(-r * 1.9, 0);
      ctx.lineTo(-r * 0.6, r * 0.4);
      ctx.closePath();
      ctx.fillStyle = skin.glow || '#00f0ff';
      ctx.fill();
      ctx.strokeStyle = outline;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      break;
    }
  }
}

function drawSpeciesHead(ctx, skin, r, hatId, tier) {
  const shape = skin.shape || 'dragon';
  const outline = skin.outline || '#090d1a';
  const glow = skin.glow || '#00f0ff';

  // 1. KULLANICI SEÇTİĞİ BAŞ KOSTÜMÜ (Seçilen avatar doğrudan kafanın kendisi olur!)
  if (hatId && hatId !== 'none') {
    const hatDef = HATS.find(h => h.id === hatId);
    if (hatDef) {
      ctx.save();
      // Boyun ile kusursuz birleşim zırh altlığı
      ctx.beginPath();
      ctx.arc(r * 0.2, 0, r * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(r * 0.2, 0, r * 1.05, 0, Math.PI * 2);
      ctx.fillStyle = skin.head || skin.body1 || '#1e293b';
      ctx.fill();

      ctx.strokeStyle = skin.glow || '#00f0ff';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.font = `${Math.floor(r * 2.6)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hatDef.icon, r * 0.22, 0);
      ctx.restore();
      return; // Baş doğrudan seçilen kostüm avatarı oldu!
    }
  }

  // 2. TÜRÜNE ÖZEL ANATOMİK KAFA ÇİZİMİ
  switch (shape) {
    case 'mecha': {
      ctx.beginPath();
      ctx.moveTo(r * 1.35, 0);
      ctx.lineTo(r * 0.6, r * 1.05);
      ctx.lineTo(-r * 0.8, r * 0.85);
      ctx.lineTo(-r * 0.8, -r * 0.85);
      ctx.lineTo(r * 0.6, -r * 1.05);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.2, 0);
      ctx.lineTo(r * 0.5, r * 0.9);
      ctx.lineTo(-r * 0.65, r * 0.72);
      ctx.lineTo(-r * 0.65, -r * 0.72);
      ctx.lineTo(r * 0.5, -r * 0.9);
      ctx.closePath();
      ctx.fillStyle = skin.head || skin.body1;
      ctx.fill();

      // Sibernetik Vizör
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(r * 0.25, -r * 0.65, r * 0.4, r * 1.3);
      break;
    }

    case 'ninja': {
      ctx.beginPath();
      ctx.moveTo(r * 1.4, 0);
      ctx.lineTo(r * 0.4, r * 0.95);
      ctx.lineTo(-r * 0.9, r * 0.75);
      ctx.lineTo(-r * 0.9, -r * 0.75);
      ctx.lineTo(r * 0.4, -r * 0.95);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.25, 0);
      ctx.lineTo(r * 0.35, r * 0.82);
      ctx.lineTo(-r * 0.75, r * 0.62);
      ctx.lineTo(-r * 0.75, -r * 0.62);
      ctx.lineTo(r * 0.35, -r * 0.82);
      ctx.closePath();
      ctx.fillStyle = skin.head || '#1e293b';
      ctx.fill();

      // Kırmızı Suikastçı Slit Gözleri
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.ellipse(r * 0.35, -r * 0.38, r * 0.32, r * 0.12, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.35, r * 0.38, r * 0.32, r * 0.12, 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'samurai': {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
      ctx.fillStyle = skin.head || '#7f1d1d';
      ctx.fill();

      // Altın Hilal Boynuzu (Maedate)
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(r * 0.2, 0, r * 1.3, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.quadraticCurveTo(r * 0.1, 0, r * 0.2, -r * 1.3);
      ctx.fill();
      break;
    }

    case 'golden_serpent': {
      ctx.beginPath();
      ctx.moveTo(r * 1.45, 0);
      ctx.lineTo(r * 0.5, r * 1.05);
      ctx.lineTo(-r * 0.7, r * 0.85);
      ctx.lineTo(-r * 0.7, -r * 0.85);
      ctx.lineTo(r * 0.5, -r * 1.05);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(r * 0.42, r * 0.9);
      ctx.lineTo(-r * 0.55, r * 0.72);
      ctx.lineTo(-r * 0.55, -r * 0.72);
      ctx.lineTo(r * 0.42, -r * 0.9);
      ctx.closePath();
      ctx.fillStyle = skin.head || '#ffb700';
      ctx.fill();

      // Taç Boynuzları
      ctx.fillStyle = '#ff8800';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.7);
      ctx.lineTo(-r * 1.4, -r * 1.0);
      ctx.lineTo(-r * 0.8, -r * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-r * 0.5, r * 0.7);
      ctx.lineTo(-r * 1.4, r * 1.0);
      ctx.lineTo(-r * 0.8, r * 0.3);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'magma': {
      ctx.beginPath();
      ctx.moveTo(r * 1.35, 0);
      ctx.lineTo(r * 0.6, r * 0.95);
      ctx.lineTo(-r * 0.8, r * 0.85);
      ctx.lineTo(-r * 0.8, -r * 0.85);
      ctx.lineTo(r * 0.6, -r * 0.95);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.2, 0);
      ctx.lineTo(r * 0.5, r * 0.82);
      ctx.lineTo(-r * 0.65, r * 0.7);
      ctx.lineTo(-r * 0.65, -r * 0.7);
      ctx.lineTo(r * 0.5, -r * 0.82);
      ctx.closePath();
      ctx.fillStyle = skin.head || '#b91c1c';
      ctx.fill();

      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(r * 0.4, -r * 0.4, r * 0.22, 0, Math.PI * 2);
      ctx.arc(r * 0.4, r * 0.4, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'frost': {
      ctx.beginPath();
      ctx.moveTo(r * 1.45, 0);
      ctx.lineTo(r * 0.4, r * 0.95);
      ctx.lineTo(-r * 0.9, r * 0.75);
      ctx.lineTo(-r * 0.9, -r * 0.75);
      ctx.lineTo(r * 0.4, -r * 0.95);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(r * 0.32, r * 0.82);
      ctx.lineTo(-r * 0.75, r * 0.62);
      ctx.lineTo(-r * 0.75, -r * 0.62);
      ctx.lineTo(r * 0.32, -r * 0.82);
      ctx.closePath();
      ctx.fillStyle = skin.head || '#0284c7';
      ctx.fill();

      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.moveTo(-r * 0.4, -r * 0.6);
      ctx.lineTo(-r * 1.5, -r * 1.0);
      ctx.lineTo(-r * 0.7, -r * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-r * 0.4, r * 0.6);
      ctx.lineTo(-r * 1.5, r * 1.0);
      ctx.lineTo(-r * 0.7, r * 0.2);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'cobra': {
      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.quadraticCurveTo(r * 0.8, r * 1.1, -r * 0.6, r * 1.0);
      ctx.lineTo(-r * 0.8, 0);
      ctx.lineTo(-r * 0.6, -r * 1.0);
      ctx.quadraticCurveTo(r * 0.8, -r * 1.1, r * 1.3, 0);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.15, 0);
      ctx.quadraticCurveTo(r * 0.7, r * 0.92, -r * 0.48, r * 0.82);
      ctx.lineTo(-r * 0.65, 0);
      ctx.lineTo(-r * 0.48, -r * 0.82);
      ctx.quadraticCurveTo(r * 0.7, -r * 0.92, r * 1.15, 0);
      ctx.closePath();
      ctx.fillStyle = skin.head || '#ff66b2';
      ctx.fill();
      break;
    }

    default: {
      ctx.beginPath();
      ctx.moveTo(r * 1.45, 0);
      ctx.quadraticCurveTo(r * 1.1, r * 0.65, r * 0.5, r * 1.05);
      ctx.quadraticCurveTo(0, r * 1.35, -r * 0.65, r * 1.15);
      ctx.lineTo(-r * 1.25, r * 0.85);
      ctx.quadraticCurveTo(-r * 0.85, r * 0.35, -r * 1.05, 0);
      ctx.quadraticCurveTo(-r * 0.85, -r * 0.35, -r * 1.25, -r * 0.85);
      ctx.lineTo(-r * 0.65, -r * 1.15);
      ctx.quadraticCurveTo(0, -r * 1.35, r * 0.5, -r * 1.05);
      ctx.quadraticCurveTo(r * 1.1, -r * 0.65, r * 1.45, 0);
      ctx.closePath();
      ctx.fillStyle = outline;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.quadraticCurveTo(r * 0.95, r * 0.55, r * 0.42, r * 0.95);
      ctx.quadraticCurveTo(0, r * 1.18, -r * 0.55, r * 1.0);
      ctx.lineTo(-r * 1.1, r * 0.7);
      ctx.quadraticCurveTo(-r * 0.75, r * 0.3, -r * 0.92, 0);
      ctx.quadraticCurveTo(-r * 0.75, -r * 0.3, -r * 1.1, -r * 0.7);
      ctx.lineTo(-r * 0.55, -r * 1.0);
      ctx.quadraticCurveTo(0, -r * 1.18, r * 0.42, -r * 0.95);
      ctx.quadraticCurveTo(r * 0.95, -r * 0.55, r * 1.3, 0);
      ctx.closePath();
      ctx.fillStyle = skin.head || skin.body1;
      ctx.fill();

      // Ejder Boynuzları
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.8);
      ctx.lineTo(-r * 1.5, -r * 1.2);
      ctx.lineTo(-r * 0.8, -r * 0.4);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-r * 0.5, r * 0.8);
      ctx.lineTo(-r * 1.5, r * 1.2);
      ctx.lineTo(-r * 0.8, r * 0.4);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }

  // Gözler (Ninja ve Mecha hariç)
  if (shape !== 'ninja' && shape !== 'mecha') {
    const eyeX = r * 0.42;
    const eR = Math.max(3.2, r * 0.22);
    [-r * 0.55, r * 0.55].forEach(ey => {
      ctx.beginPath();
      ctx.ellipse(eyeX, ey, eR, eR * 0.7, ey > 0 ? 0.2 : -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(eyeX + 1, ey, eR * 0.45, eR * 0.8, ey > 0 ? 0.2 : -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#06080e';
      ctx.fill();
    });
  }

  // 3. AKSESUARLAR (Taç ve Gözlük)
  if (hatId === 'crown') {
    ctx.save();
    ctx.font = `${Math.floor(r * 1.6)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑', r * 0.15, -r * 0.55);
    ctx.restore();
  } else if (hatId === 'sunglasses') {
    ctx.save();
    ctx.font = `${Math.floor(r * 1.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🕶️', r * 0.45, 0);
    ctx.restore();
  }
}

class Worm {
  constructor(x, y, name, skin, isBot = false) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.skin = skin;
    this.isBot = isBot;
    this.hat = 'none';

    this.angle = Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;
    this.turnSpeed = 0.14; // Kıvrak ve rahat manevra kabiliyeti

    // Hız Dengesi & Turbo (Daha da sakin, rahat kontrol edilebilir ve keyifli manevra hızı)
    this.baseSpeed = 1.85; // Sakin, çok rahat ve kontrollü normal hız (2.4'ten düşürüldü)
    this.boostSpeed = 3.7; // Kontrollü 2 kat turbo hızı (4.8'den düşürüldü)
    this.speed = this.baseSpeed;
    this.isBoosting = false;

    this.radius = 11;
    this.spacing = 6.0;
    this.score = 15;
    this.kills = 0;
    this.isDead = false;

    // Aktif Güçler (Powerups)
    this.magnetTimer = 0;
    this.ghostTimer = 0;
    this.doublePointsTimer = 0;

    // Canlı İfade (Emote Bubble)
    this.currentEmote = null;

    // Gövde segmentleri (Başlangıç boyutu eskisine göre yarıya indirildi: 11 segment)
    this.body = [];
    const initialSegments = 11;
    for (let i = 0; i < initialSegments; i++) {
      this.body.push({
        x: this.x - Math.cos(this.angle) * (i * this.spacing),
        y: this.y - Math.sin(this.angle) * (i * this.spacing)
      });
    }

    // Bot yapay zeka değişkenleri
    this.botTimer = 0;
    this.botTargetFood = null;
  }

  // Seviye ve Puana Göre Ejder Gelişim Aşaması (Şatafatlı & Gösterişli Görünüm)
  getEvolutionTier() {
    if (this.score >= 500) return 4; // Kadim İmparator Ejder (En Şatafatlı - 3 Taç Boynuz, Altın Bıyıklar, Ejder Kanatları)
    if (this.score >= 200) return 3; // Kraliyet Zırhlı Ejder (Altın Taç Boynuz & Yan Kanatçıklar)
    if (this.score >= 60) return 2;  // Boynuzlu Wyrm (Sivri Zırh Boynuzları)
    return 1; // Başlangıç Çevik Engereği
  }

  update(worldW, worldH, foods, allWorms) {
    if (this.isDead) return;

    // Güç Sürelerini Azalt
    if (this.magnetTimer > 0) this.magnetTimer--;
    if (this.ghostTimer > 0) this.ghostTimer--;
    if (this.doublePointsTimer > 0) this.doublePointsTimer--;

    // Hızlanma Tuşuna Basınca: Hızlanır ve Küçülür (Slither / Wormate Tarzı Kütle Yakımı)
    if (this.isBoosting && this.score > 8) {
      this.speed = this.boostSpeed;
      // Hızlandıkça kütle yakılır: puan düşer, kalınlık ve uzunluk gözle görülür şekilde küçülür
      this.score = Math.max(8, this.score - 0.20);
    } else {
      this.speed = this.baseSpeed;
      this.isBoosting = false;
    }

    // Hız ve Boyut Hesaplama (Başlangıçta minyon, puan topladıkça devasa ejdere dönüşür)
    this.radius = Math.min(28, 11 + Math.floor(this.score / 180));
    this.targetLength = Math.max(8, 11 + Math.floor(this.score / 15));
    // Yılan büyüdükçe segment aralığını orantılı genişlet (böylece gövde kafanın içinde kaybolmaz!)
    this.spacing = Math.max(6.5, this.radius * 0.52);

    // Bot Yapay Zeka Mantığı
    if (this.isBot) {
      this.updateAI(worldW, worldH, foods, allWorms);
    }

    // Açıyı hedefe doğru ultra akıcı, pürüzsüz ve organik döndür (Slither.io / Wormate.io dinamiği)
    let diff = this.targetAngle - this.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    const turnFactor = this.isBoosting ? 0.18 : 0.13;
    const maxTurnSpeed = this.isBoosting ? 0.14 : 0.098;
    const turnStep = Math.max(-maxTurnSpeed, Math.min(maxTurnSpeed, diff * turnFactor * 1.35));
    this.angle += turnStep;

    // Açıyı [-PI, PI] aralığında normalize et (Açı taşması ve yön kilitlenmesini kesin önler)
    while (this.angle < -Math.PI) this.angle += Math.PI * 2;
    while (this.angle > Math.PI) this.angle -= Math.PI * 2;

    // Başı İlerlet (Her karede kesintisiz ileri hareket)
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Sınır Kontrolü
    const margin = this.radius + 10;
    if (this.x < margin || this.x > worldW - margin || this.y < margin || this.y > worldH - margin) {
      this.isDead = true;
      return;
    }

    // Gövde Hareketi (Segmentler arası ultra akıcı, yaylanan pürüzsüz omurga takibi)
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
          // Ultra akıcı yumuşak takip (dalgalanma ve ipeksi dönüş)
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

    // Uzunluk Dengeleme
    while (this.body.length < this.targetLength) {
      const last = this.body[this.body.length - 1];
      this.body.push({ x: last.x, y: last.y });
    }
    while (this.body.length > this.targetLength) {
      this.body.pop();
    }
  }

  updateAI(worldW, worldH, foods, allWorms) {
    this.botTimer++;

    // 1. Sınırlardan Kaçınma
    const edgeMargin = 250;
    let turnAway = false;
    if (this.x < edgeMargin) { this.targetAngle = 0; turnAway = true; }
    else if (this.x > worldW - edgeMargin) { this.targetAngle = Math.PI; turnAway = true; }
    else if (this.y < edgeMargin) { this.targetAngle = Math.PI / 2; turnAway = true; }
    else if (this.y > worldH - edgeMargin) { this.targetAngle = -Math.PI / 2; turnAway = true; }

    if (turnAway) return;

    // 2. Çarpışma Önleme (Eğer Hayalet Modunda değilse)
    if (this.ghostTimer <= 0) {
      const lookAheadDist = 70;
      const testX = this.x + Math.cos(this.angle) * lookAheadDist;
      const testY = this.y + Math.sin(this.angle) * lookAheadDist;

      for (const other of allWorms) {
        if (other === this || other.isDead) continue;

        for (let i = 0; i < other.body.length; i += 3) {
          const seg = other.body[i];
          const d = Math.hypot(seg.x - testX, seg.y - testY);
          if (d < this.radius + other.radius + 15) {
            const escapeAngle = Math.atan2(this.y - seg.y, this.x - seg.x);
            this.targetAngle = escapeAngle + (Math.random() - 0.5) * 1.2;
            this.isBoosting = Math.random() < 0.4;
            return;
          }
        }
      }
    }

    // 3. Yiyecek Ara
    if (this.botTimer % 20 === 0 || !this.botTargetFood) {
      let closestFood = null;
      let closestDistSq = 450 * 450;

      for (let i = 0; i < foods.length; i += 4) {
        const f = foods[i];
        const dx = f.x - this.x;
        const dy = f.y - this.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < closestDistSq) {
          closestDistSq = dSq;
          closestFood = f;
        }
      }

      this.botTargetFood = closestFood;
      if (closestFood) {
        this.targetAngle = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
        this.isBoosting = closestFood.points > 10 && Math.random() < 0.3;
      } else {
        this.targetAngle += (Math.random() - 0.5) * 0.8;
        this.isBoosting = false;
      }
    }
  }

  draw(ctx, camera) {
    if (this.isDead || this.body.length === 0) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const headX = this.x - camera.x;
    const headY = this.y - camera.y;

    // Viewport Culling: Kamera ölçeğine (zoom) göre dinamik ekran sınırları
    const zoom = (camera && camera.scale) ? camera.scale : 1.0;
    const halfW = (screenW / 2) / zoom;
    const halfH = (screenH / 2) / zoom;
    const minX = screenW / 2 - halfW - 140;
    const maxX = screenW / 2 + halfW + 140;
    const minY = screenH / 2 - halfH - 140;
    const maxY = screenH / 2 + halfH + 140;

    let isVisible = (headX >= minX && headX <= maxX && headY >= minY && headY <= maxY);

    if (!isVisible && this.body && this.body.length > 0) {
      for (let i = 0; i < this.body.length; i += 3) {
        const seg = this.body[i];
        const sx = seg.x - camera.x;
        const sy = seg.y - camera.y;
        if (sx >= minX && sx <= maxX && sy >= minY && sy <= maxY) {
          isVisible = true;
          break;
        }
      }
    }

    if (!isVisible) {
      return;
    }

    ctx.save();
    ctx.globalAlpha = 1.0;

    const bodyLen = this.body.length;

    // GÖVDEYİ ÇİZ (Kuyruktan Başa Doğru - Zırhlı Yılan Pulları & Çıngırak)
    for (let i = bodyLen - 1; i >= 0; i--) {
      const seg = this.body[i];
      const sx = seg.x - camera.x;
      const sy = seg.y - camera.y;

      // Segment Seviyesi Culling: Ekran dışındaki segmentleri atla
      if (sx < minX || sx > maxX || sy < minY || sy > maxY) {
        continue;
      }

      const progress = i / bodyLen;

      // Zarif kuyruk incelmesi
      let segRadius;
      if (progress > 0.6) {
        const tailProg = (progress - 0.6) / 0.4;
        segRadius = Math.max(3.8, this.radius * 0.8 * (1 - tailProg * 0.75));
      } else {
        segRadius = Math.max(5.5, this.radius * (1 - progress * 0.22));
      }

      const prevSeg = i === 0 ? { x: this.x, y: this.y } : this.body[i - 1];
      const segAngle = Math.atan2(prevSeg.y - seg.y, prevSeg.x - seg.x);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(segAngle);

      if (i >= bodyLen - 4) {
        this.drawRattleSegment(ctx, segRadius, bodyLen - 1 - i, progress);
      } else {
        this.drawSerpentSegment(ctx, segRadius, i, progress);
      }

      ctx.restore();
    }

    // YILAN BAŞI (Türünün Özgün Anatomisi ve Baş Kostümü)
    ctx.save();
    ctx.translate(headX, headY);

    const hatDef = (this.hat && this.hat !== 'none') ? HATS.find(h => h.id === this.hat) : null;

    if (hatDef) {
      // Baş Kostümü Seçildiyse: İkonun ters dönmemesi için her zaman dik durur ve dönüşe göre hafifçe yatar (Wormate tarzı)
      const bankAngle = Math.sin(this.angle) * 0.18;
      ctx.rotate(bankAngle);

      // Boyun ile kusursuz bağlantı altlığı
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = this.skin.outline || '#090d1a';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.05, 0, Math.PI * 2);
      ctx.fillStyle = this.skin.head || this.skin.body1 || '#1e293b';
      ctx.fill();

      ctx.strokeStyle = this.skin.glow || '#00f0ff';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Seçilen Kostüm/İkon Yılanın Başı Olarak Çizilir!
      ctx.font = `${Math.floor(this.radius * 2.6)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hatDef.icon, 0, 0);
    } else {
      // Kostüm yoksa: Türün özgün anatomik 360° dönebilen kafası çizilir
      ctx.rotate(this.angle);
      this.drawTongue(ctx);
      drawSpeciesHead(ctx, this.skin, this.radius, null, this.getEvolutionTier());
    }

    ctx.restore(); // Baş transformasyonunu bitir

    // CANLI EMOTE BALONU
    if (this.currentEmote && this.currentEmote.timer > 0) {
      this.currentEmote.timer--;
      const bubbleY = headY - this.radius - 28;

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.arc(headX, bubbleY, 17, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(headX, bubbleY + 14);
      ctx.lineTo(headX - 6, bubbleY + 22);
      ctx.lineTo(headX + 6, bubbleY + 14);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.font = '19px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.currentEmote.icon, headX, bubbleY);
    }

    // İsim Etiketi
    ctx.font = 'bold 12px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillText(this.name, headX, headY - this.radius - 12);

    ctx.restore();
  }

  drawSerpentSegment(ctx, r, index, progress) {
    const tier = this.getEvolutionTier();
    drawSpeciesSegment(ctx, this.skin, r, index, progress, this.isBoosting, tier);
  }

  drawRattleSegment(ctx, r, distFromTail, progress) {
    drawSpeciesTail(ctx, this.skin, r, distFromTail, progress, this.isBoosting);
  }

  drawHeadContour(ctx) {
    const r = this.radius;
    const tier = this.getEvolutionTier();

    // TIER 4 KADİM İMPARATOR HALESİ (En Gösterişli / Şatafatlı Halka)
    if (tier >= 4) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // TIER 2, 3, 4: ŞATAFATLI YAN EJDER BOYNUZLARI (Fildişi & Altın Uçlu)
    if (tier >= 2) {
      const hornLen = tier >= 4 ? 2.1 : (tier === 3 ? 1.7 : 1.35);
      ctx.save();
      ctx.fillStyle = tier >= 3 ? '#ffe082' : '#ffffff';
      ctx.strokeStyle = this.skin.outline || '#090d1a';
      ctx.lineWidth = 1.2;

      // Sağ Boynuz
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, r * 0.95);
      ctx.quadraticCurveTo(-r * 1.1, r * 1.35, -r * hornLen, r * 1.05);
      ctx.lineTo(-r * 0.95, r * 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sol Boynuz
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.95);
      ctx.quadraticCurveTo(-r * 1.1, -r * 1.35, -r * hornLen, -r * 1.05);
      ctx.lineTo(-r * 0.95, -r * 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 1. Kafa Dış Hattı (Genişletilmiş Kobra Başlığı / Engerek Çenesi)
    ctx.beginPath();
    ctx.moveTo(r * 1.45, 0); // Sivri aerodinamik burun ucu
    ctx.quadraticCurveTo(r * 1.1, r * 0.65, r * 0.5, r * 1.05); // Üst çene kavis
    ctx.quadraticCurveTo(0, r * 1.35, -r * 0.65, r * 1.15); // Geniş Kobra yanağı
    ctx.lineTo(-r * 1.25, r * 0.85); // Arkaya uzanan ejder boynuzu/tepe pulu
    ctx.quadraticCurveTo(-r * 0.85, r * 0.35, -r * 1.05, 0); // Boyun bağlantı çentiği
    ctx.quadraticCurveTo(-r * 0.85, -r * 0.35, -r * 1.25, -r * 0.85); // Karşı tepe boynuzu
    ctx.lineTo(-r * 0.65, -r * 1.15); // Karşı yanak
    ctx.quadraticCurveTo(0, -r * 1.35, r * 0.5, -r * 1.05);
    ctx.quadraticCurveTo(r * 1.1, -r * 0.65, r * 1.45, 0);
    ctx.closePath();

    ctx.fillStyle = this.skin.outline || '#090d1a';
    ctx.fill();

    // 2. Kafa 3D İç Dolgusu
    const headGrad = ctx.createRadialGradient(-r * 0.15, -r * 0.35, r * 0.1, 0, 0, r * 1.35);
    headGrad.addColorStop(0, '#ffffff');
    headGrad.addColorStop(0.28, this.skin.head);
    headGrad.addColorStop(0.82, this.skin.body1);
    headGrad.addColorStop(1, this.skin.outline || '#090d1a');

    ctx.beginPath();
    ctx.moveTo(r * 1.32, 0);
    ctx.quadraticCurveTo(r * 1.0, r * 0.55, r * 0.42, r * 0.92);
    ctx.quadraticCurveTo(0, r * 1.2, -r * 0.55, r * 1.02);
    ctx.lineTo(-r * 1.12, r * 0.75);
    ctx.quadraticCurveTo(-r * 0.75, r * 0.3, -r * 0.95, 0);
    ctx.quadraticCurveTo(-r * 0.75, -r * 0.3, -r * 1.12, -r * 0.75);
    ctx.lineTo(-r * 0.55, -r * 1.02);
    ctx.quadraticCurveTo(0, -r * 1.2, r * 0.42, -r * 0.92);
    ctx.quadraticCurveTo(r * 1.0, -r * 0.55, r * 1.32, 0);
    ctx.closePath();

    ctx.fillStyle = headGrad;
    ctx.fill();

    // 3. TIER 3 & 4: KRALİYET ALTIN TAÇ BOYNUZU & BIYIKLAR
    if (tier >= 3) {
      ctx.save();
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#fff9c4';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(r * 0.4, 0);
      ctx.lineTo(-r * 0.4, -r * 0.35);
      ctx.lineTo(-r * (tier >= 4 ? 1.85 : 1.4), 0);
      ctx.lineTo(-r * 0.4, r * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Canlı Ejder Bıyıkları (Dragon Whiskers)
      const whiskerTime = Date.now() * 0.006;
      const wave = Math.sin(whiskerTime) * 3;
      ctx.save();
      ctx.strokeStyle = this.skin.glow || '#ffd700';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(r * 1.2, -r * 0.25);
      ctx.quadraticCurveTo(r * 1.8, -r * 0.7 + wave, r * 2.4, -r * 0.4);
      ctx.moveTo(r * 1.2, r * 0.25);
      ctx.quadraticCurveTo(r * 1.8, r * 0.7 - wave, r * 2.4, r * 0.4);
      ctx.stroke();
      ctx.restore();
    } else {
      // Standart Alın Taç Pulu (Dorsal Crown Scale Plate)
      ctx.fillStyle = this.skin.spine || this.skin.glow || '#ffd700';
      ctx.beginPath();
      ctx.moveTo(r * 0.85, 0);
      ctx.lineTo(r * 0.1, -r * 0.38);
      ctx.lineTo(-r * 0.6, 0);
      ctx.lineTo(r * 0.1, r * 0.38);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawFangs(ctx) {
    const r = this.radius;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#ffffff';

    // Sağ Diş
    ctx.beginPath();
    ctx.moveTo(r * 0.88, r * 0.48);
    ctx.lineTo(r * 0.68, r * 0.55);
    ctx.lineTo(r * 0.76, r * 0.82); // sivri fildişi uç
    ctx.closePath();
    ctx.fill();

    // Sol Diş
    ctx.beginPath();
    ctx.moveTo(r * 0.88, -r * 0.48);
    ctx.lineTo(r * 0.68, -r * 0.55);
    ctx.lineTo(r * 0.76, -r * 0.82);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  drawTongue(ctx) {
    const time = Date.now() * 0.007;
    const cycle = time % 3.0; // Her 3 saniyede bir dil çıkar
    if (cycle < 1.1) {
      const flick = Math.sin(cycle * Math.PI);
      const tongueLen = this.radius * 1.35 * flick;
      const forkLen = tongueLen * 0.48;
      const startX = this.radius * 1.38;
      const wave = Math.sin(time * 22) * (this.radius * 0.18);

      ctx.save();
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = Math.max(2, this.radius * 0.16);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.quadraticCurveTo(startX + tongueLen * 0.5, wave, startX + tongueLen, 0);
      // Çatallı iki uç
      ctx.lineTo(startX + tongueLen + forkLen, -forkLen * 0.75 + wave);
      ctx.moveTo(startX + tongueLen, 0);
      ctx.lineTo(startX + tongueLen + forkLen, forkLen * 0.75 + wave);
      ctx.stroke();

      ctx.restore();
    }
  }

  drawEyes(ctx) {
    const r = this.radius;
    const eyeForward = r * 0.38;
    const eyeSpacing = r * 0.62;
    const eyeR = r * 0.38;
    const pupilW = this.isBoosting ? eyeR * 0.22 : eyeR * 0.42;
    const pupilH = eyeR * 0.92;

    const eye1Y = -eyeSpacing;
    const eye2Y = eyeSpacing;

    // 1. Kaş / Göz Yuvası Zırh Çıkıntısı (Predatory Brow Scale Ridge)
    ctx.strokeStyle = this.skin.outline || '#090d1a';
    ctx.lineWidth = Math.max(2.2, r * 0.14);
    ctx.beginPath();
    ctx.moveTo(eyeForward - eyeR * 1.3, eye1Y - eyeR * 0.4);
    ctx.quadraticCurveTo(eyeForward, eye1Y - eyeR * 1.25, eyeForward + eyeR * 1.3, eye1Y - eyeR * 0.2);
    ctx.moveTo(eyeForward - eyeR * 1.3, eye2Y + eyeR * 0.4);
    ctx.quadraticCurveTo(eyeForward, eye2Y + eyeR * 1.25, eyeForward + eyeR * 1.3, eye2Y + eyeR * 0.2);
    ctx.stroke();

    // 2. Göz Akı / İris (Badem Göz Şekli)
    const drawEyeBall = (ey) => {
      ctx.save();
      ctx.translate(eyeForward, ey);
      ctx.rotate(ey > 0 ? 0.2 : -0.2);

      // Göz Dış Çizgisi
      ctx.beginPath();
      ctx.ellipse(0, 0, eyeR * 1.15, eyeR * 0.85, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#090d1a';
      ctx.fill();

      // İris (Parıldayan Sürüngen Rengi)
      const irisGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, eyeR);
      irisGrad.addColorStop(0, '#ffffff');
      irisGrad.addColorStop(0.35, this.skin.glow || '#ffd000');
      irisGrad.addColorStop(0.85, this.skin.head);
      irisGrad.addColorStop(1, '#000000');

      ctx.beginPath();
      ctx.ellipse(0, 0, eyeR, eyeR * 0.75, 0, 0, Math.PI * 2);
      ctx.fillStyle = irisGrad;
      ctx.fill();

      // Dikey Sürüngen Göz Bebeği (Reptilian Slit Pupil)
      ctx.fillStyle = '#06080e';
      ctx.beginPath();
      ctx.ellipse(0, 0, pupilW, pupilH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hızlanma Sırasında Göz Bebeğinde Yanan Enerji Çekirdeği
      if (this.isBoosting) {
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.ellipse(0, 0, pupilW * 0.5, pupilH * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Çift Anime Parıltısı (Specular Catchlights)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-eyeR * 0.35, -eyeR * 0.28, eyeR * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(eyeR * 0.3, eyeR * 0.2, eyeR * 0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    drawEyeBall(eye1Y);
    drawEyeBall(eye2Y);
  }
}

// ==================== OYUN İÇİ RENKLİ BİLDİRİM & UYARI SİSTEMİ ====================
window.showInGameAlert = function(message, type = 'info', title = null) {
  const toastCard = document.getElementById('gameToastCard');
  const toastIcon = document.getElementById('toastIcon');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');
  if (!toastCard) return;

  if (window.toastTimeout) clearTimeout(window.toastTimeout);

  let icon = '📢';
  let defaultTitle = window.I18N ? window.I18N.t('alert_title_notice') : 'NOTIFICATION';

  if (type === 'level_up') {
    icon = '🎉';
    defaultTitle = window.I18N ? window.I18N.t('toast_congrats') : 'CONGRATULATIONS!';
    if (typeof sounds !== 'undefined') sounds.playLevelUp();
  } else if (type === 'success') {
    icon = '✓';
    defaultTitle = window.I18N ? window.I18N.t('alert_title_success') : 'SUCCESS';
    if (typeof sounds !== 'undefined') sounds.playWheelWin();
  } else if (type === 'warning') {
    icon = '⚠️';
    defaultTitle = window.I18N ? window.I18N.t('alert_title_warning') : 'WARNING';
    if (typeof sounds !== 'undefined') sounds.playDie();
  } else if (type === 'info') {
    icon = 'ℹ️';
    defaultTitle = window.I18N ? window.I18N.t('alert_title_info') : 'INFO';
    if (typeof sounds !== 'undefined') sounds.playSpecial();
  }

  toastCard.className = `game-toast-card toast-${type}`;
  if (toastIcon) toastIcon.textContent = icon;
  if (toastTitle) toastTitle.textContent = title || defaultTitle;
  if (toastMsg) toastMsg.textContent = message;

  toastCard.classList.remove('hidden', 'toast-hiding');

  window.toastTimeout = setTimeout(() => {
    toastCard.classList.add('toast-hiding');
    setTimeout(() => toastCard.classList.add('hidden'), 280);
  }, 4200);
};

// Tarayıcının çirkin dış alert popup penceresini engelle, oyunun şık renkli bildirimine dönüştür!
window.alert = function(msg) {
  let type = 'info';
  let title = window.I18N ? window.I18N.t('alert_title_notice') : 'NOTIFICATION';
  if (typeof msg === 'string') {
    const upper = msg.toUpperCase();
    if (upper.includes('TEBRİKLER') || upper.includes('CONGRAT') || upper.includes('KAZANDIN') || upper.includes('WON')) {
      type = 'level_up';
      title = '🎉 ' + (window.I18N ? window.I18N.t('toast_congrats') : 'CONGRATULATIONS!');
    } else if (upper.includes('YETERSIZ') || upper.includes('ENOUGH') || upper.includes('HATA') || upper.includes('ERROR') || upper.includes('TIMEOUT')) {
      type = 'warning';
      title = '⚠️ ' + (window.I18N ? window.I18N.t('alert_title_warning') : 'WARNING');
    } else if (upper.includes('KOPYALANDI') || upper.includes('COPIED') || upper.includes('BAĞLANDI') || upper.includes('CONNECTED')) {
      type = 'success';
      title = '✓ ' + (window.I18N ? window.I18N.t('alert_title_success') : 'SUCCESS');
    }
  }
  window.showInGameAlert(msg, type, title);
};

function safeGetStorage(key, defaultValue = null) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    }
  } catch (e) {
    console.warn('Storage read warning:', key, e);
  }
  return defaultValue;
}

function safeSetStorage(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn('Storage write warning:', key, e);
  }
}

class WormArenaGame {
  constructor() {
    this.canvas = document.getElementById('arenaCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.minimapCanvas = document.getElementById('minimapCanvas');
    this.minimapCtx = this.minimapCanvas.getContext('2d');

    // Ağ Yöneticisi
    this.network = new NetworkManager(this);

    // Oyuncu Ekonomisi & İlerleme
    this.coins = parseInt(safeGetStorage('worm_coins', '120'), 10) || 120;
    this.xp = parseInt(safeGetStorage('worm_xp', '25'), 10) || 25;
    try {
      this.unlockedHats = JSON.parse(safeGetStorage('worm_unlocked_hats', '["none"]'));
    } catch (e) {
      this.unlockedHats = ['none'];
    }
    try {
      this.unlockedSkins = JSON.parse(safeGetStorage('worm_unlocked_skins', '["white_king"]'));
    } catch (e) {
      this.unlockedSkins = ['white_king'];
    }
    this.equippedHat = safeGetStorage('worm_equipped_hat', 'none') || 'none';

    // Görevler & Seri
    this.initQuestsSystem();

    // Şans Çarkı Değişkenleri
    this.isSpinningWheel = false;
    this.wheelRotation = 0;

    // Dünya Boyutları (2 Kat Büyütülmüş Devasa Arena: 6400x6400)
    this.worldWidth = 6400;
    this.worldHeight = 6400;

    // Kamera
    this.camera = { x: 3200, y: 3200, scale: 1 };

    // Oyun Nesneleri
    this.player = null;
    this.bots = [];
    this.foods = [];
    this.particles = [];

    // Canlı Etkinlik Sayacı (Altın Yağmuru)
    this.eventTimer = 0;
    this.eventDuration = 0;

    this.selectedSkinIndex = 0;
    this.state = 'START';
    this.bestRank = 99;

    this.joystick = { active: false, startX: 0, startY: 0 };

    // Turbo Hızlanma (Tek Dokunuş & Dairesel Loading Barı Zamanlayıcısı)
    this.boostDuration = 3800; // 3.8s hızlanma süresi
    this.boostCooldown = 2500; // 2.5s yeniden dolma süresi
    this.boostState = 'READY'; // 'READY' | 'BOOSTING' | 'COOLDOWN'
    this.boostTimer = 0;
    this.boostCircumference = 257.6; // 2 * PI * 41

    // DOM Elementleri
    this.leaderboardList = document.getElementById('leaderboardList');
    this.playerScoreEl = document.getElementById('playerScore');
    this.playerRankEl = document.getElementById('playerRank');
    this.playerKillsEl = document.getElementById('playerKills');
    this.totalPlayersEl = document.getElementById('totalPlayersCount');
    this.startScreen = document.getElementById('startScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.boostBtn = document.getElementById('boostBtn');
    this.boostGaugeBar = document.getElementById('boostGaugeBar');
    this.joystickBase = document.getElementById('joystickBase');
    this.joystickThumb = document.getElementById('joystickThumb');
    this.joystickZone = document.getElementById('joystickZone');
    this.hudRoomBadge = document.getElementById('hudRoomBadge');
    this.hudRoomCode = document.getElementById('hudRoomCode');
    this.hudPowerupBadge = document.getElementById('hudPowerupBadge');
    this.hudPowerupIcon = document.getElementById('hudPowerupIcon');
    this.hudPowerupText = document.getElementById('hudPowerupText');
    this.eventBanner = document.getElementById('eventBanner');

    const safeExec = (name, fn) => {
      try { fn(); } catch (err) { console.error(`Error in ${name}:`, err); }
    };

    safeExec('initCanvasSize', () => this.initCanvasSize());
    safeExec('initQuestsSystem', () => this.initQuestsSystem());
    safeExec('initSettings', () => this.initSettings());
    safeExec('loadSavedPlayerName', () => this.loadSavedPlayerName());
    safeExec('initEvents', () => this.initEvents());
    safeExec('initMultiplayerEvents', () => this.initMultiplayerEvents());
    safeExec('initShopAndWheelUI', () => this.initShopAndWheelUI());
    safeExec('initFoods', () => this.initFoods(3500));
    safeExec('updateEconomyUI', () => this.updateEconomyUI());
    safeExec('drawSkinPreview', () => this.drawSkinPreview());
    safeExec('drawFortuneWheel', () => this.drawFortuneWheel(0));
    safeExec('checkUrlRoomInvite', () => this.checkUrlRoomInvite());
    safeExec('initSplashScreen', () => this.initSplashScreen());

    // Kullanıcının ekrana ilk dokunuşunda ana menü fon müziğini başlat
    const startAudioOnFirstUserTouch = () => {
      sounds.init();
      if (!this.settings || this.settings.music !== false) {
        sounds.startMenuMusic();
      }
      window.removeEventListener('touchstart', startAudioOnFirstUserTouch);
      window.removeEventListener('pointerdown', startAudioOnFirstUserTouch);
      window.removeEventListener('click', startAudioOnFirstUserTouch);
    };
    window.addEventListener('touchstart', startAudioOnFirstUserTouch, { once: true, passive: true });
    window.addEventListener('pointerdown', startAudioOnFirstUserTouch, { once: true, passive: true });
    window.addEventListener('click', startAudioOnFirstUserTouch, { once: true });
  }

  // ==================== 🌈 ÇOCUK DOSTU AÇILIŞ (SPLASH) EKRANI ====================
  initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    const bar = document.getElementById('splashLoaderBar');
    const statusText = document.getElementById('splashStatusText');
    if (!splash) return;

    const isTr = window.I18N && window.I18N.currentLang === 'tr';
    const messages = isTr ? [
      '🍬 Renkli şekerler toplanıyor...',
      '🐍 Sevimli solucanlar uyanıyor...',
      '⭐ Harita pırıl pırıl parlatılıyor...',
      '🎉 Oynamaya hazır mısın?!'
    ] : [
      '🍬 Collecting colorful candies...',
      '🐍 Cute worms waking up...',
      '⭐ Polishing the arena map...',
      '🎉 Ready to play?!'
    ];

    let progress = 0;
    let msgIndex = 0;

    const dismissSplash = () => {
      clearInterval(interval);
      if (!splash || splash.classList.contains('fade-out')) return;
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 520);
    };

    const interval = setInterval(() => {
      progress += 12;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = `${progress}%`;

      const newMsgIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
      if (newMsgIndex !== msgIndex) {
        msgIndex = newMsgIndex;
        if (statusText) statusText.textContent = messages[msgIndex];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          dismissSplash();
        }, 320);
      }
    }, 150);

    // Dokunarak hızlı geçme seçeneği
    splash.addEventListener('click', () => {
      if (progress >= 35) dismissSplash();
    }, { once: true });
  }

  loadSavedPlayerName() {
    const savedName = safeGetStorage('worm_player_name', '');
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput && savedName) {
      nameInput.value = savedName;
    }
  }

  initSettings() {
    try {
      this.settings = JSON.parse(safeGetStorage('worm_settings', 'null')) || {
        sfx: true,
        music: true,
        vibrate: true,
        controlMode: 'dynamic',
        boostPosition: 'right',
        minimap: true,
        graphics: 'high',
        cameraZoom: 'normal',
        highFps: true
      };
    } catch (e) {
      this.settings = {
        sfx: true,
        music: true,
        vibrate: true,
        controlMode: 'dynamic',
        boostPosition: 'right',
        minimap: true,
        graphics: 'high',
        cameraZoom: 'normal',
        highFps: true
      };
    }

    // Ses motoru durumunu uygula
    sounds.setSfxEnabled(this.settings.sfx !== false);
    sounds.setBgmEnabled(this.settings.music !== false);

    // Görsel ayarları uygula
    this.applyBoostPosition();
    this.applyMinimapVisibility();

    const sfxCheckbox = document.getElementById('settingSfx');
    const musicCheckbox = document.getElementById('settingMusic');
    const vibrateCheckbox = document.getElementById('settingVibrate');
    const highFpsCheckbox = document.getElementById('settingHighFps');
    const controlModeSelect = document.getElementById('settingControlMode');
    const boostPosSelect = document.getElementById('settingBoostPos');
    const minimapCheckbox = document.getElementById('settingMinimap');
    const cameraZoomSelect = document.getElementById('settingCameraZoom');

    if (sfxCheckbox) {
      sfxCheckbox.checked = this.settings.sfx !== false;
      sfxCheckbox.addEventListener('change', (e) => {
        this.settings.sfx = e.target.checked;
        sounds.setSfxEnabled(this.settings.sfx);
        this.saveSettings();
      });
    }

    if (musicCheckbox) {
      musicCheckbox.checked = this.settings.music !== false;
      musicCheckbox.addEventListener('change', (e) => {
        this.settings.music = e.target.checked;
        sounds.setBgmEnabled(this.settings.music);
        this.saveSettings();
      });
    }

    if (vibrateCheckbox) {
      vibrateCheckbox.checked = this.settings.vibrate !== false;
      vibrateCheckbox.addEventListener('change', (e) => {
        this.settings.vibrate = e.target.checked;
        if (this.settings.vibrate) this.triggerVibration([30]);
        this.saveSettings();
      });
    }

    if (controlModeSelect) {
      controlModeSelect.value = this.settings.controlMode || 'dynamic';
      controlModeSelect.addEventListener('change', (e) => {
        this.settings.controlMode = e.target.value;
        this.saveSettings();
      });
    }

    if (boostPosSelect) {
      boostPosSelect.value = this.settings.boostPosition || 'right';
      boostPosSelect.addEventListener('change', (e) => {
        this.settings.boostPosition = e.target.value;
        this.saveSettings();
        this.applyBoostPosition();
      });
    }

    if (minimapCheckbox) {
      minimapCheckbox.checked = this.settings.minimap !== false;
      minimapCheckbox.addEventListener('change', (e) => {
        this.settings.minimap = e.target.checked;
        this.saveSettings();
        this.applyMinimapVisibility();
      });
    }

    if (cameraZoomSelect) {
      cameraZoomSelect.value = this.settings.cameraZoom || 'normal';
      cameraZoomSelect.addEventListener('change', (e) => {
        this.settings.cameraZoom = e.target.value;
        this.saveSettings();
      });
    }

    if (highFpsCheckbox) {
      highFpsCheckbox.checked = this.settings.highFps !== false;
      highFpsCheckbox.addEventListener('change', (e) => {
        this.settings.highFps = e.target.checked;
        this.saveSettings();
      });
    }

    const settingLanguage = document.getElementById('settingLanguage');
    if (settingLanguage) {
      const activeLang = (window.I18N && window.I18N.currentLang) ? window.I18N.currentLang : (localStorage.getItem('worm_language') === 'tr' ? 'tr' : 'en');
      settingLanguage.value = activeLang;
      settingLanguage.addEventListener('change', (e) => {
        const val = e.target.value === 'tr' ? 'tr' : 'en';
        try {
          localStorage.setItem('worm_language', val);
        } catch (err) {}
        if (window.I18N) {
          if (typeof window.I18N.setLang === 'function') {
            window.I18N.setLang(val, false);
          } else if (typeof window.I18N.setLanguage === 'function') {
            window.I18N.setLanguage(val, false);
          }
        }
        // Kullanıcı isteği: Dil seçildiğinde oyun kapanıp açılsın (yenilensin) ve yeni dille başlasın
        setTimeout(() => {
          window.location.reload();
        }, 120);
      });
    }

    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const openSettingsShortcutBtn = document.getElementById('openSettingsShortcutBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const resetProgressBtn = document.getElementById('resetProgressBtn');

    const openSettings = () => {
      sounds.playClick();
      if (settingsModal) settingsModal.classList.remove('hidden');
    };

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
    if (openSettingsShortcutBtn) openSettingsShortcutBtn.addEventListener('click', openSettings);

    if (closeSettingsBtn && settingsModal) {
      closeSettingsBtn.addEventListener('click', () => {
        sounds.playClick();
        settingsModal.classList.add('hidden');
      });
    }

    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.add('hidden');
      });
    }

    if (resetProgressBtn) {
      resetProgressBtn.addEventListener('click', () => {
        const confirmMsg = window.I18N ? window.I18N.t('settings_confirm_reset') : 'All your progress, unlocked badges, and coins will be reset. Are you sure?';
        if (confirm(confirmMsg)) {
          localStorage.clear();
          window.location.reload();
        }
      });
    }
  }

  onLanguageChanged() {
    if (this.renderShopItems) this.renderShopItems();
    if (this.renderQuestsUI) this.renderQuestsUI();
    if (this.updateEconomyUI) this.updateEconomyUI();
    if (this.updateWheelUIStatus) this.updateWheelUIStatus();
    if (this.drawSkinPreview) this.drawSkinPreview();
  }

  saveSettings() {
    safeSetStorage('worm_settings', JSON.stringify(this.settings));
  }

  applyBoostPosition() {
    const boostZone = document.querySelector('.boost-control-container');
    const minimap = document.querySelector('.minimap-container');
    const emotes = document.querySelector('.in-game-emotes');
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isLandscape) {
      // Yatay modda kural: Harita sağda, Hızlanma solda!
      if (boostZone) {
        boostZone.style.setProperty('left', 'max(env(safe-area-inset-left, 0px) + 14px, 18px)', 'important');
        boostZone.style.setProperty('right', 'auto', 'important');
      }
      if (minimap) {
        minimap.style.setProperty('right', 'max(env(safe-area-inset-right, 0px) + 14px, 18px)', 'important');
        minimap.style.setProperty('left', 'auto', 'important');
      }
      if (emotes) {
        emotes.style.setProperty('left', '125px', 'important');
        emotes.style.setProperty('right', 'auto', 'important');
      }
    } else {
      // Dikey modda ayara göre yerleştir
      if (boostZone) {
        if (this.settings.boostPosition === 'left') {
          boostZone.style.setProperty('left', '20px', 'important');
          boostZone.style.setProperty('right', 'auto', 'important');
        } else {
          boostZone.style.setProperty('right', '20px', 'important');
          boostZone.style.setProperty('left', 'auto', 'important');
        }
      }
      if (minimap) {
        minimap.style.setProperty('left', 'max(env(safe-area-inset-left, 0px) + 12px, 16px)', 'important');
        minimap.style.setProperty('right', 'auto', 'important');
      }
      if (emotes) {
        emotes.style.removeProperty('left');
        emotes.style.removeProperty('right');
      }
    }
  }

  applyMinimapVisibility() {
    const minimap = document.querySelector('.minimap-container');
    if (minimap) {
      minimap.style.display = (this.settings.minimap !== false) ? '' : 'none';
    }
  }

  triggerVibration(pattern = [25]) {
    if (this.settings && this.settings.vibrate !== false && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  initCanvasSize() {
    // Mobil performansı için DPR'ı 1.25 ile sınırla (Görsel kalite bozulmaz, GPU yükü 4 kat azalır)
    const rawDpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth < 1024 && (window.innerHeight < 600 || window.innerWidth < 768);
    const maxDpr = isMobile ? 1.25 : 1.35;
    const dpr = Math.min(rawDpr, maxDpr);
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  initFoods(count = 1800) {
    this.foods = [];
    for (let i = 0; i < count; i++) {
      this.spawnFood();
    }
  }

  // Çok oyunculu odada tüm oyuncuların aynı yemleri görmesi için tohum (seed) tabanlı üretim
  initFoodsWithSeed(seedNum, count = 1200) {
    this.foods = [];
    let s = (typeof seedNum === 'string')
      ? seedNum.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffffffff, 12345)
      : (Number(seedNum) || 12345);

    const rng = () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const fx = rng() * (this.worldWidth - 100) + 50;
      const fy = rng() * (this.worldHeight - 100) + 50;
      const rand = rng();
      let foodDef;
      if (rand < 0.38) foodDef = FOOD_TYPES[0]; // Apple
      else if (rand < 0.65) foodDef = FOOD_TYPES[1]; // Banana
      else if (rand < 0.82) foodDef = FOOD_TYPES[2]; // Donut
      else if (rand < 0.92) foodDef = FOOD_TYPES[3]; // Star Coin
      else if (rand < 0.96) foodDef = FOOD_TYPES[4]; // Orb
      else if (rand < 0.975) foodDef = FOOD_TYPES[5]; // Magnet
      else if (rand < 0.99) foodDef = FOOD_TYPES[6]; // Energy Star ⚡
      else foodDef = FOOD_TYPES[7]; // Double points

      this.foods.push({
        x: fx,
        y: fy,
        ...foodDef,
        pulse: rng() * Math.PI * 2
      });
    }
  }

  spawnFood(x = null, y = null, forcedType = null) {
    const fx = x !== null ? x : Math.random() * (this.worldWidth - 100) + 50;
    const fy = y !== null ? y : Math.random() * (this.worldHeight - 100) + 50;

    let foodDef;
    if (forcedType) {
      foodDef = FOOD_TYPES.find(f => f.type === forcedType) || FOOD_TYPES[0];
    } else {
      const rand = Math.random();
      if (rand < 0.38) foodDef = FOOD_TYPES[0]; // Apple
      else if (rand < 0.65) foodDef = FOOD_TYPES[1]; // Banana
      else if (rand < 0.82) foodDef = FOOD_TYPES[2]; // Donut
      else if (rand < 0.92) foodDef = FOOD_TYPES[3]; // Star Coin
      else if (rand < 0.96) foodDef = FOOD_TYPES[4]; // Orb
      else if (rand < 0.975) foodDef = FOOD_TYPES[5]; // Magnet
      else if (rand < 0.99) foodDef = FOOD_TYPES[6]; // Energy Star ⚡
      else foodDef = FOOD_TYPES[7]; // Double points
    }

    const newFood = {
      x: fx,
      y: fy,
      ...foodDef,
      pulse: Math.random() * Math.PI * 2
    };
    this.foods.push(newFood);
    if (this.network && this.network.isMultiplayer && this.network.isHost) {
      if (!this.pendingNewFoods) this.pendingNewFoods = [];
      this.pendingNewFoods.push({
        x: Math.round(fx),
        y: Math.round(fy),
        type: newFood.type
      });
    }
    return newFood;
  }

  validatePlayerName(autoGenerateIfEmpty = false) {
    const nameInput = document.getElementById('playerNameInput');
    let name = nameInput ? nameInput.value.trim() : '';
    if (!name || name.length === 0) {
      if (autoGenerateIfEmpty) {
        const defaultPrefix = window.I18N ? window.I18N.t('player_default') : 'Player';
        name = `${defaultPrefix}_${Math.floor(100 + Math.random() * 900)}`;
        if (nameInput) nameInput.value = name;
      } else {
        if (nameInput) {
          nameInput.focus();
          nameInput.classList.add('input-error-shake');
          setTimeout(() => nameInput.classList.remove('input-error-shake'), 600);
        }
        const alertTitle = window.I18N ? window.I18N.t('alert_name_required_title') : '⚠️ NAME REQUIRED';
        const alertMsg = window.I18N ? window.I18N.t('alert_name_required_msg') : 'Please enter your player name before starting the game!';
        window.showInGameAlert(alertMsg, 'warning', alertTitle);
        return null;
      }
    }
    localStorage.setItem('worm_player_name', name);
    return name.substring(0, 14);
  }

  validateSelectedSkin() {
    const skin = SKINS[this.selectedSkinIndex];
    const playerLevel = this.getLevelFromXp(this.xp);
    if ((skin.unlockLevel || 1) > playerLevel) {
      const alertTitle = window.I18N ? window.I18N.t('alert_locked_skin_title') : '🔒 LOCKED SKIN';
      const alertMsg = window.I18N ? window.I18N.t('alert_locked_skin_msg', { level: skin.unlockLevel }) : `This skin unlocks at Level ${skin.unlockLevel}! Please select an unlocked skin.`;
      window.showInGameAlert(alertMsg, 'warning', alertTitle);
      return false;
    }
    return true;
  }

  getPlayerName() {
    const nameInput = document.getElementById('playerNameInput');
    const stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('worm_player_name') : '';
    const val = (nameInput && nameInput.value.trim()) || (this.customPlayerName && this.customPlayerName.trim()) || (stored && stored.trim()) || '';
    const defaultName = window.I18N ? window.I18N.t('player_default') : 'Player';
    return (val || defaultName).substring(0, 14);
  }

  getSelectedSkinId() {
    const skin = (typeof SKINS !== 'undefined' && SKINS[this.selectedSkinIndex]) ? SKINS[this.selectedSkinIndex] : null;
    return skin ? skin.id : 'white_king';
  }

  startGame(includeBots = true) {
    // Tek kişilik oyun başlatılırken eski ağ bağlantılarını temizle
    this.network.disconnect();

    const playerName = this.validatePlayerName();
    if (!playerName) return;

    if (!this.validateSelectedSkin()) return;

    sounds.init();
    const skin = SKINS[this.selectedSkinIndex];

    this.player = new Worm(
      this.worldWidth / 2 + (Math.random() - 0.5) * 600,
      this.worldHeight / 2 + (Math.random() - 0.5) * 600,
      playerName,
      skin,
      false
    );
    this.player.hat = this.equippedHat;
    this.player.ghostTimer = 0; // Hayalet modu kaldırıldı: tam görünür ve fiziksel

    this.bots = [];
    if (includeBots) {
      const botCount = this.network.isMultiplayer ? 5 : 10;
      for (let i = 0; i < botCount; i++) {
        this.spawnBot(i);
      }
    }

    this.state = 'PLAYING';
    this.bestRank = 99;
    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    if (this.joystickZone) this.joystickZone.classList.remove('hidden');

    if (this.network.isMultiplayer && this.network.roomCode) {
      this.hudRoomBadge.classList.remove('hidden');
      this.hudRoomCode.textContent = this.network.roomCode;
    } else {
      this.hudRoomBadge.classList.add('hidden');
    }

    sounds.playSpecial();
    this.vibrate(30);
  }

  // Host için çok oyunculu odayı başlatma
  startMultiplayerHostGame(includeBots = false, spawnX = null, spawnY = null, spawnAngle = 0) {
    let playerName = this.validatePlayerName(true);
    if (!playerName) {
      playerName = this.getPlayerName() || `Oyuncu_${Math.floor(100 + Math.random() * 900)}`;
    }

    sounds.init();
    const skin = SKINS[this.selectedSkinIndex] || SKINS[0];

    const cx = spawnX !== null ? spawnX : (this.worldWidth / 2 + (Math.random() - 0.5) * 400);
    const cy = spawnY !== null ? spawnY : (this.worldHeight / 2 + (Math.random() - 0.5) * 400);

    this.player = new Worm(cx, cy, playerName, skin, false);
    this.player.peerId = 'host';
    this.player.hat = this.equippedHat;
    this.player.angle = spawnAngle;
    this.player.targetAngle = spawnAngle;
    this.player.ghostTimer = 0; // Hayalet modu kaldırıldı: tam görünür ve fiziksel

    this.bots = [];
    if (includeBots) {
      const botCount = 6;
      for (let i = 0; i < botCount; i++) {
        this.spawnBot(i);
      }
    }

    this.state = 'PLAYING';
    this.bestRank = 99;
    if (this.startScreen) {
      this.startScreen.classList.add('hidden');
      this.startScreen.style.display = 'none';
    }
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.add('hidden');
      this.gameOverScreen.style.display = 'none';
    }
    const victoryScreen = document.getElementById('victoryScreen');
    if (victoryScreen) {
      victoryScreen.classList.add('hidden');
      victoryScreen.style.display = 'none';
    }
    const multiplayerModal = document.getElementById('multiplayerModal');
    if (multiplayerModal) {
      multiplayerModal.classList.add('hidden');
      multiplayerModal.style.display = 'none';
    }
    const waitingRoomContent = document.getElementById('waitingRoomTabContent');
    if (waitingRoomContent) waitingRoomContent.classList.add('hidden');
    const joinRoomContent = document.getElementById('joinRoomTabContent');
    if (joinRoomContent) joinRoomContent.classList.add('hidden');
    const createRoomContent = document.getElementById('createRoomTabContent');
    if (createRoomContent) createRoomContent.classList.add('hidden');

    if (this.joystickZone) this.joystickZone.classList.remove('hidden');

    if (this.hudRoomBadge && this.network.roomCode) {
      this.hudRoomBadge.classList.remove('hidden');
      this.hudRoomCode.textContent = this.network.roomCode;
    }

    sounds.playSpecial();
    this.vibrate(40);
    if (window.showInGameAlert) {
      const alertTitle = window.I18N ? window.I18N.t('alert_game_started_title') : '🎮 GAME STARTED';
      const alertMsg = window.I18N ? window.I18N.t('alert_game_started_msg') : '🚀 Arena Started! Survive & Dominate!';
      window.showInGameAlert(alertMsg, 'success', alertTitle);
    }
  }

  // İstemci için çok oyunculu oyunu başlatma
  startMultiplayerClientGame(mySpawn = null) {
    let playerName = this.validatePlayerName(true);
    if (!playerName) {
      const defaultPrefix = window.I18N ? window.I18N.t('player_default') : 'Player';
      playerName = this.getPlayerName() || `${defaultPrefix}_${Math.floor(100 + Math.random() * 900)}`;
    }

    sounds.init();
    const skin = SKINS[this.selectedSkinIndex] || SKINS[0];

    const sx = mySpawn ? mySpawn.x : (this.worldWidth / 2 + (Math.random() - 0.5) * 400);
    const sy = mySpawn ? mySpawn.y : (this.worldHeight / 2 + (Math.random() - 0.5) * 400);
    const sa = mySpawn ? mySpawn.angle : 0;

    this.player = new Worm(sx, sy, playerName, skin, false);
    this.player.peerId = this.network.myPeerId;
    this.player.hat = this.equippedHat;
    this.player.angle = sa;
    this.player.targetAngle = sa;
    this.player.ghostTimer = 0; // Hayalet modu kaldırıldı: tam görünür ve fiziksel

    // Kamerayı anında oyuncunun üzerine getir
    this.camera.x = this.player.x - window.innerWidth / 2;
    this.camera.y = this.player.y - window.innerHeight / 2;

    this.bots = [];
    this.state = 'PLAYING';
    this.bestRank = 99;

    // Menü ve Bekleme Odası pencerelerini eksiksiz gizle
    if (this.startScreen) {
      this.startScreen.classList.add('hidden');
      this.startScreen.style.display = 'none';
    }
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.add('hidden');
      this.gameOverScreen.style.display = 'none';
    }
    const victoryModal = document.getElementById('victoryScreen');
    if (victoryModal) {
      victoryModal.classList.add('hidden');
      victoryModal.style.display = 'none';
    }
    const mModal = document.getElementById('multiplayerModal');
    if (mModal) {
      mModal.classList.add('hidden');
      mModal.style.display = 'none';
    }
    const waitingRoomContent = document.getElementById('waitingRoomTabContent');
    if (waitingRoomContent) waitingRoomContent.classList.add('hidden');
    const joinRoomContent = document.getElementById('joinRoomTabContent');
    if (joinRoomContent) joinRoomContent.classList.add('hidden');
    const createRoomContent = document.getElementById('createRoomTabContent');
    if (createRoomContent) createRoomContent.classList.add('hidden');

    if (this.joystickZone) this.joystickZone.classList.remove('hidden');

    if (this.hudRoomBadge && this.network.roomCode) {
      this.hudRoomBadge.classList.remove('hidden');
      this.hudRoomCode.textContent = this.network.roomCode;
    }

    sounds.playSpecial();
    this.vibrate(40);
    if (window.showInGameAlert) {
      const alertTitle = window.I18N ? window.I18N.t('alert_game_started_title') : '🎮 GAME STARTED';
      const alertMsg = window.I18N ? window.I18N.t('alert_game_good_luck') : '🚀 Game Started! Good luck!';
      window.showInGameAlert(alertMsg, 'success', alertTitle);
    }
  }

  spawnBot(index) {
    const botName = BOT_NAMES[index % BOT_NAMES.length];
    const botSkin = SKINS[(index + 1) % SKINS.length];
    const bx = Math.random() * (this.worldWidth - 300) + 150;
    const by = Math.random() * (this.worldHeight - 300) + 150;

    const bot = new Worm(bx, by, botName, botSkin, true);
    bot.botId = index;
    bot.peerId = `bot_${index}_${Math.floor(Math.random() * 10000)}`;
    bot.ghostTimer = 0;
    bot.score = Math.floor(Math.random() * 80) + 30;
    // Botlara da rastgele şapka ver
    if (Math.random() < 0.6) {
      const randomHat = HATS[Math.floor(Math.random() * (HATS.length - 1)) + 1];
      bot.hat = randomHat.id;
    }
    this.bots.push(bot);
  }

  vibrate(pattern) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  update() {
    // Lobide veya menüdeyken fizik döngüsünü ve tick yayınını kesinlikle çalıştırma!
    if (this.state !== 'PLAYING' && this.state !== 'DYING' && this.state !== 'GAMEOVER' && this.state !== 'VICTORY') {
      return;
    }
    if (!this.player) return;

    // Ölüm & Yıldızlı Yemeğe Dönüşüm Gösteri Animasyonu (Kamera odaklı kalır, yıldızlar saçılır)
    if (this.state === 'DYING') {
      this.deathTimer--;
      this.updateParticles();
      if (this.player) {
        this.camera.x += (this.player.x - window.innerWidth / 2 - this.camera.x) * 0.08;
        this.camera.y += (this.player.y - window.innerHeight / 2 - this.camera.y) * 0.08;
      }
      if (this.deathTimer <= 0) {
        this.state = 'GAMEOVER';
        if (this.joystickZone) this.joystickZone.classList.add('hidden');
        if (this.gameOverScreen) {
          this.gameOverScreen.classList.remove('hidden');
          this.gameOverScreen.style.display = 'flex';
        }
      }
      // DİKKAT: Host ise oyun döngüsünden çıkma! Host, tüm odadaki oyuncuların sunucusudur.
      if (!this.network.isMultiplayer || !this.network.isHost) {
        return;
      }
    }

    if (this.state === 'GAMEOVER') {
      // DİKKAT: Host ise oyun döngüsünden çıkma! Host, tüm odadaki oyuncuların sunucusudur.
      if (!this.network.isMultiplayer || !this.network.isHost) {
        return;
      }
    }

    if (this.state === 'VICTORY') {
      this.updateParticles();
      // DİKKAT: Host ise istemcileri güncellemeye devam et
      if (!this.network.isMultiplayer || !this.network.isHost) {
        return;
      }
    }

    // Dinamik Akıcı Kamera Zoom Sistemi (Yılan Büyüdükçe Kamera Uzaklaşır)
    let targetZoom = 1.0;
    if (this.player && !this.player.isDead) {
      // Skor büyüdükçe kamera pürüzsüzce geniş açıya geçer: devasa yılanın tüm gövdesi ve çevresi ekranda kalır
      const growth = Math.log10(1 + (this.player.score || 0) / 60);
      targetZoom = Math.max(0.55, 1.02 - growth * 0.185);
      if (this.settings && this.settings.cameraZoom === 'wide') {
        targetZoom *= 0.88;
      }
    }
    if (!this.camera.scale) this.camera.scale = 1.0;
    this.camera.scale += (targetZoom - this.camera.scale) * 0.05;

    // Canlı Etkinlik Kontrolü (Altın Yağmuru Her 80 sn)
    this.eventTimer++;
    if (this.eventTimer > 4800) { // ~80 saniye
      this.triggerGoldenRainEvent();
      this.eventTimer = 0;
    }

    // Mıknatıs Gücü Kontrolü (Yiyecekleri Vakumlama)
    if (this.player && this.player.magnetTimer > 0) {
      const magnetRange = 260;
      for (const food of this.foods) {
        const d = Math.hypot(food.x - this.player.x, food.y - this.player.y);
        if (d < magnetRange) {
          const angle = Math.atan2(this.player.y - food.y, this.player.x - food.x);
          food.x += Math.cos(angle) * 9;
          food.y += Math.sin(angle) * 9;
        }
      }
    }

    // Üst Paneldeki Güçlendirme Rozetini Güncelle
    this.updatePowerupHUD();

    // Dairesel Hızlanma / Turbo Süre & Dolum Çubuğu Mantığı
    const circumference = this.boostCircumference || 257.6;
    const boostText = document.getElementById('boostBtnText');

    if (this.boostState === 'BOOSTING') {
      this.boostTimer += 16.6;
      const progress = Math.min(1, this.boostTimer / this.boostDuration);
      if (this.boostGaugeBar) {
        this.boostGaugeBar.style.strokeDashoffset = (circumference * progress).toString();
      }
      if (boostText) boostText.textContent = `${Math.ceil((this.boostDuration - this.boostTimer) / 1000)}s`;

      if (this.boostTimer >= this.boostDuration) {
        this.stopTurboBoost();
      }
    } else if (this.boostState === 'COOLDOWN') {
      this.boostTimer += 16.6;
      const progress = Math.min(1, this.boostTimer / this.boostCooldown);
      if (this.boostGaugeBar) {
        this.boostGaugeBar.style.strokeDashoffset = (circumference * (1 - progress)).toString();
      }
      if (boostText) boostText.textContent = `${Math.ceil((this.boostCooldown - this.boostTimer) / 1000)}s`;

      if (this.boostTimer >= this.boostCooldown) {
        this.boostState = 'READY';
        this.boostTimer = 0;
        if (this.boostGaugeBar) {
          this.boostGaugeBar.classList.remove('cooldown');
          this.boostGaugeBar.style.strokeDashoffset = '0';
        }
        if (this.boostBtn) this.boostBtn.classList.remove('cooldown-state');
        if (boostText) boostText.textContent = 'HIZLAN';
        sounds.playSpecial();
      }
    }

    // ==================== CLIENT MODU ====================
    // İstemcide akıcı yerel kontrol (Çarpışma kararı sunucu/host tarafından verilir)
    if (this.network.isMultiplayer && !this.network.isHost) {
      this.network.sendThrottledInput(
        this.player.targetAngle,
        this.player.isBoosting,
        this.player.x,
        this.player.y,
        this.player.angle
      );

      const allWorms = [this.player, ...this.network.remotePlayers.values()];
      this.player.update(this.worldWidth, this.worldHeight, this.foods, allWorms);

      // İstemcide diğer oyuncuları ve botları kareler arası akıcı ilerlet (Dead-Reckoning & Smooth 60 FPS)
      for (const rw of this.network.remotePlayers.values()) {
        if (!rw.isDead) {
          let diff = rw.targetAngle - rw.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          rw.angle += diff * 0.12;

          const spd = rw.isBoosting ? rw.boostSpeed : rw.baseSpeed;
          rw.x += Math.cos(rw.angle) * spd * 0.75;
          rw.y += Math.sin(rw.angle) * spd * 0.75;
        }
      }

      // İstemcide yerel yem yeme kontrolü (Yıldızlar ve tüm yemler anında yenir, 0 gecikme!)
      const clientEaten = this.checkFoodEating([this.player]);
      if (clientEaten && clientEaten.length > 0 && this.network && this.network.isConnReady(this.network.hostConn)) {
        try {
          this.network.hostConn.send({
            type: 'CLIENT_ATE_FOOD',
            eaten: clientEaten.map(f => ({ x: f.x, y: f.y, points: f.points, type: f.type }))
          });
        } catch (e) {}
      }

      // Arena duvarına çarpma kontrolü
      if (this.player.isDead) {
        const wallName = window.I18N ? window.I18N.t('arena_wall') : 'Arena Wall';
        this.handlePlayerDeath(wallName);
        if (this.network.isMultiplayer && !this.network.isHost && this.network.hostConn) {
          try {
            this.network.hostConn.send({ type: 'CLIENT_DIED', killedBy: wallName });
          } catch (e) {}
        }
        return;
      }

      // 20.000 Puana Ulaşan Oyuncu Kazanır Kuralı (İstemci Kontrolü)
      const WIN_SCORE = 20000;
      if (this.player && !this.player.isDead && this.player.score >= WIN_SCORE) {
        this.handleVictory(this.player);
        return;
      }
      for (const rw of this.network.remotePlayers.values()) {
        if (rw && !rw.isDead && rw.score >= WIN_SCORE) {
          this.handleVictory(rw);
          return;
        }
      }

      this.camera.x += (this.player.x - window.innerWidth / 2 - this.camera.x) * 0.15;
      this.camera.y += (this.player.y - window.innerHeight / 2 - this.camera.y) * 0.15;

      this.updateParticles();

      this.hudUpdateTimer = (this.hudUpdateTimer || 0) + 1;
      if (this.hudUpdateTimer % 15 === 0) {
        this.updateLeaderboard(allWorms);
        this.updatePowerupHUD();
      }
      return;
    }

    // ==================== HOST VEYA TEK OYUNCU ====================
    const remotePlayersList = Array.from(this.network.remotePlayers.values());
    // Host ölse bile istemcilerin ekranında ve lider tablosunda kalması için allWorms içinde korunur
    const allWorms = this.player
      ? [this.player, ...this.bots, ...remotePlayersList]
      : [...this.bots, ...remotePlayersList];

    // Host oyuncusu canlıysa hareket ettir
    if (this.player && !this.player.isDead) {
      this.player.update(this.worldWidth, this.worldHeight, this.foods, allWorms);

      // Arena duvarına çarpma kontrolü
      if (this.player.isDead) {
        const wallName = window.I18N ? window.I18N.t('arena_wall') : 'Arena Wall';
        this.handlePlayerDeath(wallName);
      }

      this.camera.x += (this.player.x - window.innerWidth / 2 - this.camera.x) * 0.1;
      this.camera.y += (this.player.y - window.innerHeight / 2 - this.camera.y) * 0.1;
    } else if (remotePlayersList.length > 0) {
      // Host öldüyse kamera ilk canlı odayı/oyuncuyu yumuşakça takip etsin
      const alivePlayer = remotePlayersList.find(rw => !rw.isDead) || this.bots[0];
      if (alivePlayer) {
        this.camera.x += (alivePlayer.x - window.innerWidth / 2 - this.camera.x) * 0.05;
        this.camera.y += (alivePlayer.y - window.innerHeight / 2 - this.camera.y) * 0.05;
      }
    }

    // Odaya bağlı tüm uzaktaki oyuncuları sunucu olarak ilerlet
    for (const rw of remotePlayersList) {
      if (!rw.isDead) {
        rw.update(this.worldWidth, this.worldHeight, this.foods, allWorms);
        if (rw.isDead) {
          rw.killedBy = window.I18N ? window.I18N.t('arena_wall') : 'Arena Wall';
          this.dropFoodFromWorm(rw);
        }
      }
    }

    // Botları ilerlet
    for (let i = 0; i < this.bots.length; i++) {
      const bot = this.bots[i];
      bot.update(this.worldWidth, this.worldHeight, this.foods, allWorms);

      if (bot.isDead) {
        this.dropFoodFromWorm(bot);
        this.bots.splice(i, 1);
        i--;
        setTimeout(() => {
          if (this.state === 'PLAYING' || (this.network.isMultiplayer && this.network.isHost)) {
            this.spawnBot(Math.floor(Math.random() * 20));
          }
        }, 3000);
      }
    }

    const newFoods = [];
    const eatenList = this.checkFoodEating(allWorms, newFoods);

    // Solucan Çarpışmaları (Kafa ve Gövde)
    this.checkWormCollisions(allWorms);

    // 20.000 Puana Ulaşan İlk Oyuncu Oyunu Kazanır Kuralı (Win Condition)
    const WIN_SCORE = 20000;
    for (const w of allWorms) {
      if (w && !w.isDead && w.score >= WIN_SCORE) {
        this.handleVictory(w);
        return;
      }
    }

    // Çok oyunculu sunucu tick yayını (Ölen yılanların yıldızlı yemleri ve yeni yemler eksiksiz yayılır!)
    if (this.network.isMultiplayer && this.network.isHost) {
      this.broadcastTickCounter = (this.broadcastTickCounter || 0) + 1;
      if (!this.pendingNewFoods) this.pendingNewFoods = [];
      if (newFoods.length > 0) {
        this.pendingNewFoods.push(...newFoods);
      }
      if (!this.pendingEatenFoods) this.pendingEatenFoods = [];
      if (eatenList.length > 0) {
        this.pendingEatenFoods.push(...eatenList);
      }
      if (this.broadcastTickCounter % 2 === 0) {
        const foodsToSend = this.pendingNewFoods;
        const eatenToSend = this.pendingEatenFoods;
        this.pendingNewFoods = [];
        this.pendingEatenFoods = [];
        this.network.broadcastState(allWorms, foodsToSend, eatenToSend);
      }
    }

    // Arenada yiyecek yoğunluğu: 60 FPS akıcı performans için optimize edilmiş sıkı yem havuzu
    const targetFoodCount = (this.network && this.network.isMultiplayer) ? 1200 : 1800;
    if (this.foods.length < targetFoodCount && (!this.network || !this.network.isMultiplayer || this.network.isHost)) {
      const spawnBatch = Math.min(6, targetFoodCount - this.foods.length);
      for (let k = 0; k < spawnBatch; k++) {
        const nf = this.spawnFood();
        if (newFoods) {
          newFoods.push({ x: Math.round(nf.x), y: Math.round(nf.y), type: nf.type });
        }
      }
    }

    this.updateParticles();

    // DOM güncellemelerini saniyede 4 kez sınırla (Her karede DOM reflow'unu önleyerek kasmayı %100 bitirir)
    this.hudUpdateTimer = (this.hudUpdateTimer || 0) + 1;
    if (this.hudUpdateTimer % 15 === 0) {
      this.updateLeaderboard(allWorms);
      this.updatePowerupHUD();
    }
  }

  updatePowerupHUD() {
    if (this.player.magnetTimer > 0) {
      this.hudPowerupBadge.classList.remove('hidden');
      this.hudPowerupIcon.textContent = '🧲';
      const label = window.I18N ? window.I18N.t('hud_powerup_magnet') : 'MAGNET';
      this.hudPowerupText.textContent = `${label} (${Math.ceil(this.player.magnetTimer / 60)}s)`;
    } else if (this.player.doublePointsTimer > 0) {
      this.hudPowerupBadge.classList.remove('hidden');
      this.hudPowerupIcon.textContent = '2️⃣';
      const label = window.I18N ? window.I18N.t('hud_powerup_double') : '2X POINTS';
      this.hudPowerupText.textContent = `${label} (${Math.ceil(this.player.doublePointsTimer / 60)}s)`;
    } else {
      this.hudPowerupBadge.classList.add('hidden');
    }
  }

  triggerGoldenRainEvent() {
    sounds.playSpecial();
    this.eventBanner.classList.remove('hidden');
    const bannerText = window.I18N ? window.I18N.t('event_gold_rain') : 'A HUGE GOLD RAIN HAS STARTED IN THE CENTER!';
    document.getElementById('eventText').textContent = bannerText;

    const cx = this.worldWidth / 2;
    const cy = this.worldHeight / 2;
    for (let i = 0; i < 80; i++) {
      const rx = cx + (Math.random() - 0.5) * 1000;
      const ry = cy + (Math.random() - 0.5) * 1000;
      this.spawnFood(rx, ry, Math.random() < 0.65 ? 'star_coin' : 'donut');
    }

    setTimeout(() => {
      this.eventBanner.classList.add('hidden');
    }, 6000);
  }

  checkFoodEating(allWorms, newFoods = null) {
    const eatenList = [];

    for (const worm of allWorms) {
      if (worm.isDead) continue;
      // Cömert ve gerçekçi yeme yarıçapı (Yılanın kafası yıldıza veya yeme dokunduğu anda anında yutulur!)
      const baseEatRadius = Math.max(48, worm.radius * 2.0 + 20);
      const eatRadius = worm.magnetTimer > 0 ? Math.max(baseEatRadius, 160) : baseEatRadius;
      const eatRadiusSq = eatRadius * eatRadius;

      // Yılanın burnu/ağzı merkezden 1.1*radius öne uzanır (Kafanın ön ucu)
      const snoutDist = worm.radius * 1.1;
      const snoutX = worm.x + Math.cos(worm.angle) * snoutDist;
      const snoutY = worm.y + Math.sin(worm.angle) * snoutDist;
      const snoutRadiusSq = (baseEatRadius * 0.95) * (baseEatRadius * 0.95);

      // Yılanın bu karedeki hareket çizgisi (Swept circle - Hızlıyken yemlerin üzerinden atlamayı %100 bitirir)
      const prevX = worm.prevX !== undefined ? worm.prevX : worm.x;
      const prevY = worm.prevY !== undefined ? worm.prevY : worm.y;
      const segDx = worm.x - prevX;
      const segDy = worm.y - prevY;
      const segLenSq = segDx * segDx + segDy * segDy;
      const maxReach = worm.magnetTimer > 0 ? 170 : (baseEatRadius + 20);

      for (let i = this.foods.length - 1; i >= 0; i--) {
        const food = this.foods[i];

        // 60 FPS Hızlı Eleme: Yılan kafasından uzaktaki yemleri doğrudan atla (Kasmayı %100 bitirir)
        if (Math.abs(food.x - worm.x) > maxReach || Math.abs(food.y - worm.y) > maxReach) {
          continue;
        }

        // 1. Ağız / Burun ucu mesafesi
        const sdx = food.x - snoutX;
        const sdy = food.y - snoutY;
        let isEaten = (sdx * sdx + sdy * sdy < snoutRadiusSq);

        // 2. Kafa merkezi veya swept çizgi mesafesi
        if (!isEaten) {
          let distSq;
          if (segLenSq > 0) {
            let t = ((food.x - prevX) * segDx + (food.y - prevY) * segDy) / segLenSq;
            t = Math.max(0, Math.min(1, t));
            const closeX = prevX + t * segDx;
            const closeY = prevY + t * segDy;
            const cdx = food.x - closeX;
            const cdy = food.y - closeY;
            distSq = cdx * cdx + cdy * cdy;
          } else {
            const cdx = food.x - worm.x;
            const cdy = food.y - worm.y;
            distSq = cdx * cdx + cdy * cdy;
          }
          if (distSq < eatRadiusSq) {
            isEaten = true;
          }
        }

        if (isEaten) {
          let pts = food.points || 5;
          if (worm.doublePointsTimer > 0) pts *= 2;
          worm.score += pts;

          if (food.type === 'magnet') {
            worm.magnetTimer = 500;
            if (worm === this.player) sounds.playMagnet();
          } else if (food.type === 'energy_star' || food.type === 'ghost') {
            worm.doublePointsTimer = 400;
            if (worm === this.player) sounds.playSpecial();
          } else if (food.type === 'double') {
            worm.doublePointsTimer = 500;
            if (worm === this.player) sounds.playSpecial();
          }

          if (worm === this.player) {
            sounds.playEat();
            this.checkQuestProgress('eat_foods', 1);
            if (food.points > 10 || food.type === 'star_coin') {
              sounds.playCoin();
              this.vibrate(20);
              this.checkQuestProgress('collect_gold', 1);
            }
            if (food.type === 'magnet' || food.type === 'energy_star' || food.type === 'ghost' || food.type === 'double') {
              this.checkQuestProgress('collect_powerup', 1);
            }
            this.checkQuestProgress('reach_score', Math.floor(this.player.score));
            this.checkMilestoneProgress(Math.floor(this.player.score));
          }

          this.createFoodBurst(food.x, food.y, food.color);
          eatenList.push({
            x: Math.round(food.x),
            y: Math.round(food.y),
            points: food.points,
            type: food.type,
            index: i
          });
          this.foods.splice(i, 1);

          const targetFoodCount = (this.network && this.network.isMultiplayer) ? 2000 : 3500;
          if (newFoods && this.foods.length < targetFoodCount) {
            const nf = this.spawnFood();
            newFoods.push({ x: Math.round(nf.x), y: Math.round(nf.y), type: nf.type });
          }
        }
      }
    }
    return eatenList;
  }

  checkWormCollisions(allWorms) {
    if (this.state !== 'PLAYING') return;

    for (let i = 0; i < allWorms.length; i++) {
      const attacker = allWorms[i];
      if (attacker.isDead) continue;

      for (let j = 0; j < allWorms.length; j++) {
        const victim = allWorms[j];
        if (attacker === victim || victim.isDead) continue;

        // 60 FPS Yılan Seviyesi Hızlı Eleme: Birbirinden uzak yılanların gövde segment döngüsünü tamamen atla
        const victimSpan = (victim.body.length * 6.5) + victim.radius + attacker.radius + 60;
        if (Math.abs(attacker.x - victim.x) > victimSpan || Math.abs(attacker.y - victim.y) > victimSpan) {
          continue;
        }

        // 1. Kafa-Gövde Çarpışması: Bir solucanın kafası diğer solucanın herhangi bir yerine (boyun, gövde, kuyruk) temas ettiğinde anında ezilir!
        const vPoints = [{ x: victim.x, y: victim.y }, ...victim.body];
        let bodyCollided = false;

        // Boyundan kuyruğa kadar tüm gövde hattını kesintisiz kapsül (swept segment) olarak kontrol et
        for (let k = 1; k < vPoints.length; k++) {
          const p1 = vPoints[k - 1];
          const p2 = vPoints[k];

          // Kuyruğa doğru zarif incelmeyi hesaba katarak çarpışma yarıçapını belirle
          const progress = k / vPoints.length;
          const segRadius = progress > 0.6 ? Math.max(10, victim.radius * 0.85) : Math.max(12, victim.radius * 0.95);
          const hitThreshold = attacker.radius * 0.95 + segRadius;
          const hitThresholdSq = hitThreshold * hitThreshold;

          // Hızlı AABB (Bounding Box) Elemesi - 60 FPS Optimizasyonu
          const minX = (p1.x < p2.x ? p1.x : p2.x) - hitThreshold;
          const maxX = (p1.x > p2.x ? p1.x : p2.x) + hitThreshold;
          if (attacker.x < minX || attacker.x > maxX) continue;

          const minY = (p1.y < p2.y ? p1.y : p2.y) - hitThreshold;
          const maxY = (p1.y > p2.y ? p1.y : p2.y) + hitThreshold;
          if (attacker.y < minY || attacker.y > maxY) continue;

          // Noktanın doğru parçasına en yakın mesafesi (Continuous Capsule Collision)
          const segDx = p2.x - p1.x;
          const segDy = p2.y - p1.y;
          const segLenSq = segDx * segDx + segDy * segDy;

          let t = 0;
          if (segLenSq > 0) {
            t = ((attacker.x - p1.x) * segDx + (attacker.y - p1.y) * segDy) / segLenSq;
            if (t < 0) t = 0;
            else if (t > 1) t = 1;
          }

          const closeX = p1.x + t * segDx;
          const closeY = p1.y + t * segDy;
          const cdx = attacker.x - closeX;
          const cdy = attacker.y - closeY;

          if (cdx * cdx + cdy * cdy <= hitThresholdSq) {
            // BAŞ DİĞER YILANIN GÖVDESİNE / HERHANGİ BİR YERİNE DEĞDİ -> ANINDA EZİLİR!
            bodyCollided = true;
            attacker.isDead = true;
            attacker.killedBy = victim.name;
            victim.kills++;
            victim.score += 60;

            if (victim === this.player) {
              sounds.playSpecial();
              this.vibrate([40, 20, 60]);
              this.checkQuestProgress('kill_worms');
            }

            // Ezilen oyuncunun ismini anında liderlik tablosundan sil
            this.updateLeaderboard(allWorms);

            if (attacker === this.player) {
              this.handlePlayerDeath(victim.name);
              return;
            } else {
              this.dropFoodFromWorm(attacker);
            }
            break;
          }
        }

        if (bodyCollided) break;

        // 2. Kafa Kafaya Çarpışma (İki yılanın başı doğrudan burun buruna çarpışırsa)
        const headThresh = (attacker.radius + victim.radius) * 0.95;
        const hdx = attacker.x - victim.x;
        const hdy = attacker.y - victim.y;
        if (Math.abs(hdx) < headThresh && Math.abs(hdy) < headThresh && (hdx * hdx + hdy * hdy < headThresh * headThresh)) {
          const loser = (attacker.score <= victim.score) ? attacker : victim;
          const winner = (loser === attacker) ? victim : attacker;

          loser.isDead = true;
          loser.killedBy = winner.name;
          winner.kills++;
          winner.score += 60;

          // Ezilen oyuncunun ismini anında liderlik tablosundan sil
          this.updateLeaderboard(allWorms);

          if (loser === this.player) {
            this.handlePlayerDeath(winner.name);
            return;
          } else {
            this.dropFoodFromWorm(loser);
            if (winner === this.player) {
              sounds.playSpecial();
              this.vibrate([40, 20, 60]);
              this.checkQuestProgress('kill_worms');
            }
          }
          break;
        }
      }
    }
  }

  dropFoodFromWorm(worm) {
    if (!worm) return;
    const bodyLen = (worm.body && Array.isArray(worm.body)) ? worm.body.length : 0;
    // Yılanın boyuna ve puanına göre orantılı yıldızlı yemek miktarı (Bol yem saçılması)
    const count = Math.min(70, Math.max(16, Math.floor(bodyLen * 1.4)));

    for (let i = 0; i < count; i++) {
      let posX = worm.x;
      let posY = worm.y;

      if (bodyLen > 0) {
        const segIdx = Math.min(bodyLen - 1, Math.floor((i / count) * bodyLen));
        const seg = worm.body[segIdx];
        if (seg && typeof seg.x === 'number' && typeof seg.y === 'number') {
          // Segment etrafına doğal organik saçılma (Geniş açı ve aralıklı)
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 32 + 12;
          posX = seg.x + Math.cos(angle) * dist;
          posY = seg.y + Math.sin(angle) * dist;
        } else {
          const angle = (i / count) * Math.PI * 2;
          const dist = 35 + (i % 3) * 25 + Math.random() * 20;
          posX = worm.x + Math.cos(angle) * dist;
          posY = worm.y + Math.sin(angle) * dist;
        }
      } else {
        // Gövde henüz senkronize değilse tek noktaya yığılmasını önlemek için geniş halkalar halinde saç
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 40 + (i % 4) * 35 + Math.random() * 20;
        posX = worm.x + Math.cos(angle) * dist;
        posY = worm.y + Math.sin(angle) * dist;
      }

      this.spawnFood(posX, posY, 'star_coin');

      // Parlak altın rengi yıldız patlama kıvılcımları
      for (let p = 0; p < 2; p++) {
        this.particles.push({
          x: posX,
          y: posY,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color: Math.random() < 0.6 ? '#ffd700' : '#ffea00',
          alpha: 1,
          size: Math.random() * 3 + 2
        });
      }
    }
    sounds.playDie();
  }

  handlePlayerDeath(killedBy) {
    if (this.state === 'GAMEOVER' || this.state === 'DYING') return;
    this.state = 'DYING';
    this.deathTimer = 65; // ~1.1 saniye sonra Game Over penceresi kesin olarak açılır

    try {
      sounds.playDie();
      this.vibrate([120, 60, 200]);

      // Turbo hızlanmayı durdur ve göstergeyi sıfırla
      this.boostState = 'READY';
      this.boostTimer = 0;
      if (this.boostBtn) this.boostBtn.classList.remove('active-boost', 'cooldown-state');
      if (this.boostGaugeBar) {
        this.boostGaugeBar.classList.remove('boosting', 'cooldown');
        this.boostGaugeBar.style.strokeDashoffset = '0';
      }

      if (this.player) {
        this.player.isDead = true;

        // Yiyecekleri SADECE host veya tek oyunculu modda spawn et!
        // İstemcide host zaten yiyecekleri oluşturup ağ üzerinden GAME_TICK içinde aktarır
        if (!this.network.isMultiplayer || this.network.isHost) {
          this.dropFoodFromWorm(this.player);
        } else {
          // İstemci için anında yerel patlama partikülleri
          for (let p = 0; p < 25; p++) {
            this.particles.push({
              x: this.player.x + (Math.random() - 0.5) * 50,
              y: this.player.y + (Math.random() - 0.5) * 50,
              vx: (Math.random() - 0.5) * 9,
              vy: (Math.random() - 0.5) * 9,
              color: Math.random() < 0.6 ? '#ffd700' : '#ffea00',
              alpha: 1,
              size: Math.random() * 4 + 2
            });
          }
        }

        const dropCount = Math.min(40, Math.max(8, Math.floor(((this.player.body && this.player.body.length) || 11) * 0.8)));
        if (window.showInGameAlert) {
          const alertTitle = window.I18N ? window.I18N.t('alert_star_food_transform_title') : '⭐ STAR FOOD CONVERSION';
          const killerName = killedBy || (window.I18N ? window.I18N.t('an_obstacle') : 'an obstacle');
          const alertMsg = window.I18N ? window.I18N.t('alert_star_food_transform_msg', { killer: killerName, count: dropCount }) : `💥 Crashed into ${killerName}! Your worm turned into ${dropCount} Star Foods! ⭐`;
          window.showInGameAlert(alertMsg, 'warning', alertTitle);
        }

        const earnedCoins = Math.max(10, Math.floor(this.player.score / 20) + this.player.kills * 25);
        const earnedXp = Math.floor(this.player.score / 15);
        this.addCoins(earnedCoins);
        this.addXp(earnedXp);

        this.checkQuestProgress('reach_score', Math.floor(this.player.score));

        const killedByEl = document.getElementById('killedByText');
        const earnedCoinsEl = document.getElementById('earnedCoinsVal');
        const finalScoreEl = document.getElementById('finalScoreVal');
        const finalKillsEl = document.getElementById('finalKillsVal');
        const finalRankEl = document.getElementById('finalRankVal');

        if (killedByEl) {
          const killerName = killedBy || (window.I18N ? window.I18N.t('an_obstacle') : 'an obstacle');
          let text = window.I18N ? window.I18N.t('gameover_killed_by', { killer: killerName }) : `You crashed into ${killerName}! 🍭`;
          if (text.includes('{killer}')) {
            text = text.replace(/\{killer\}/g, killerName);
          }
          killedByEl.textContent = text;
        }
        if (earnedCoinsEl) earnedCoinsEl.textContent = earnedCoins;
        if (finalScoreEl) finalScoreEl.textContent = Math.floor(this.player.score);
        if (finalKillsEl) finalKillsEl.textContent = this.player.kills;
        if (finalRankEl) finalRankEl.textContent = `#${this.bestRank || 1}`;
      }
    } catch (err) {
      console.error('handlePlayerDeath error:', err);
    }
  }

  createFoodBurst(x, y, color) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: color,
        alpha: 1,
        size: Math.random() * 3 + 2
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.05;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  updateLeaderboard(allWorms) {
    if (!this.leaderboardList) return;
    // Sadece CANLI olan solucanları tabloda göster (Ezilen / ölen oyuncular anında tablodan silinir)
    const aliveWorms = (allWorms || []).filter(w => w && !w.isDead);
    const sorted = [...aliveWorms].sort((a, b) => b.score - a.score);

    const rank = sorted.findIndex(w => w === this.player) + 1;
    if (rank > 0 && rank < this.bestRank) this.bestRank = rank;

    if (this.playerRankEl) this.playerRankEl.textContent = `#${rank > 0 ? rank : '-'}`;
    if (this.playerScoreEl) this.playerScoreEl.textContent = Math.floor(this.player ? this.player.score : 0);
    if (this.playerKillsEl) this.playerKillsEl.textContent = this.player ? this.player.kills : 0;
    if (this.totalPlayersEl) this.totalPlayersEl.textContent = aliveWorms.length;

    let html = '';
    const topWorms = sorted.slice(0, 8);
    topWorms.forEach((w, idx) => {
      const isMe = w === this.player;
      const rankClass = idx === 0 ? 'top-1' : idx === 1 ? 'top-2' : idx === 2 ? 'top-3' : '';
      const youTag = isMe ? (window.I18N ? ' ' + window.I18N.t('hud_you_tag') : ' (You)') : '';
      html += `
        <li class="leaderboard-item ${isMe ? 'is-me' : ''} ${rankClass}">
          <span class="lb-name">${idx + 1}. ${this.escapeHtml ? this.escapeHtml(w.name) : w.name}${youTag}</span>
          <span class="lb-score">${Math.floor(w.score)}</span>
        </li>
      `;
    });
    this.leaderboardList.innerHTML = html;
  }

  createDeathBurst(x, y) {
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        color: Math.random() < 0.6 ? '#ffd700' : '#ffea00',
        alpha: 1,
        size: Math.random() * 5 + 3
      });
    }
    if (sounds && sounds.playDie) {
      sounds.playDie();
    }
  }

  createVictoryConfetti(x, y) {
    const colors = ['#ffd700', '#ff007f', '#00f0ff', '#00ff88', '#ff7700', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 140,
        y: y + (Math.random() - 0.5) * 140,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        size: Math.random() * 6 + 4
      });
    }
  }

  handleVictory(winner) {
    if (this.state === 'VICTORY') return;
    this.state = 'VICTORY';

    const isLocalWinner = (winner === this.player) || (this.player && winner && (winner.peerId === this.network.myPeerId || winner.name === this.player.name));

    // Zafer Kutlama Sesi & Konfeti Patlaması
    if (sounds && sounds.playVictory) {
      sounds.playVictory();
    } else if (sounds && sounds.playWheelWin) {
      sounds.playWheelWin();
    }
    const px = winner ? winner.x : (this.player ? this.player.x : this.worldWidth / 2);
    const py = winner ? winner.y : (this.player ? this.player.y : this.worldHeight / 2);
    this.createVictoryConfetti(px, py);

    // Host ise: Tüm bağlı istemcilere 20.000 zafer paketini ilet
    if (this.network && this.network.isMultiplayer && this.network.isHost && this.network.broadcastVictory) {
      this.network.broadcastVictory(
        winner ? winner.name : 'Champion',
        winner ? winner.peerId : null,
        winner ? winner.score : 20000,
        winner ? winner.kills : 0
      );
    }

    if (this.joystickZone) this.joystickZone.classList.add('hidden');
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.add('hidden');
      this.gameOverScreen.style.display = 'none';
    }

    const victoryScreen = document.getElementById('victoryScreen');
    const victoryTitle = document.getElementById('victoryTitle');
    const victorySubtitle = document.getElementById('victorySubtitle');
    const victoryWinnerName = document.getElementById('victoryWinnerName');
    const victoryScoreVal = document.getElementById('victoryScoreVal');
    const victoryKillsVal = document.getElementById('victoryKillsVal');
    const victoryBonusBox = document.getElementById('victoryBonusBox');

    const winnerName = (winner && winner.name) ? winner.name : (isLocalWinner ? this.getPlayerName() : (window.I18N ? window.I18N.t('player_default') : 'Champion'));
    const winnerScore = (winner && typeof winner.score === 'number') ? winner.score : 20000;
    const winnerKills = (winner && typeof winner.kills === 'number') ? winner.kills : (this.player ? this.player.kills : 0);

    if (victoryWinnerName) victoryWinnerName.textContent = winnerName;
    if (victoryScoreVal) victoryScoreVal.textContent = winnerScore.toLocaleString();
    if (victoryKillsVal) victoryKillsVal.textContent = winnerKills;

    if (isLocalWinner) {
      if (victoryTitle) victoryTitle.textContent = window.I18N ? window.I18N.t('victory_title') : 'ARENA ŞAMPİYONU!';
      if (victorySubtitle) victorySubtitle.textContent = window.I18N ? window.I18N.t('victory_subtitle') : '20.000 puana ulaşarak arenayı fethettin! Harika bir zafer! 🎉';
      if (victoryBonusBox) victoryBonusBox.style.display = 'flex';
      // +500 Altın Şampiyonluk Ödülü Hesaba Eklenir!
      this.addCoins(500);
      if (window.I18N) {
        this.showToast(window.I18N.t('toast_congrats'), '+500 🪙 ' + window.I18N.t('stat_bonus_label'), '👑');
      }
    } else {
      if (victoryTitle) victoryTitle.textContent = window.I18N ? window.I18N.t('victory_match_finished') : 'MAÇ SONA ERDİ!';
      const subTemplate = window.I18N ? window.I18N.t('victory_winner_other') : '{winner} 20.000 puana ulaşarak maçı kazandı!';
      if (victorySubtitle) victorySubtitle.textContent = subTemplate.replace('{winner}', winnerName);
      if (victoryBonusBox) victoryBonusBox.style.display = 'none';
    }

    if (victoryScreen) {
      victoryScreen.classList.remove('hidden');
      victoryScreen.style.display = 'flex';
    }
  }

  returnToMenu() {
    this.state = 'START';
    if (this.network && this.network.roomCode) {
      this.lastRoomCode = this.network.roomCode;
      try { localStorage.setItem('worm_last_room_code', this.network.roomCode); } catch (e) {}
    }
    if (this.network) {
      try { this.network.disconnect(); } catch (e) {}
    }
    this.player = null;
    this.bots = [];

    // URL'deki oda davet kodunu temizle (menüdeyken tekrar tetiklenmesin)
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {}

    // Tüm oyun içi pencereleri ve modalları kapat
    const exitConfirmModal = document.getElementById('exitConfirmModal');
    if (exitConfirmModal) {
      exitConfirmModal.classList.add('hidden');
      exitConfirmModal.style.display = 'none';
    }

    const multiplayerModal = document.getElementById('multiplayerModal');
    if (multiplayerModal) {
      multiplayerModal.classList.add('hidden');
      multiplayerModal.style.display = 'none';
    }

    if (this.gameOverScreen) {
      this.gameOverScreen.classList.add('hidden');
      this.gameOverScreen.style.display = 'none';
    }

    const victoryScreen = document.getElementById('victoryScreen');
    if (victoryScreen) {
      victoryScreen.classList.add('hidden');
      victoryScreen.style.display = 'none';
    }

    if (this.joystickZone) {
      this.joystickZone.classList.add('hidden');
    }
    if (this.joystickBase) {
      this.joystickBase.classList.add('hidden');
    }
    this.joystick.active = false;

    if (this.hudRoomBadge) {
      this.hudRoomBadge.classList.add('hidden');
    }

    // Ana menü ekranını eksiksiz ve kesin olarak görünür yap
    if (this.startScreen) {
      this.startScreen.classList.remove('hidden');
      this.startScreen.style.display = 'flex';
    }

    this.updateEconomyUI();
    this.drawSkinPreview();
    if (sounds && sounds.startMenuMusic) {
      sounds.startMenuMusic();
    }
  }

  // ==================== EKONOMİ & İLERLEME ====================
  addCoins(amount) {
    this.coins += amount;
    localStorage.setItem('worm_coins', this.coins.toString());
    this.updateEconomyUI();
    sounds.playCoin();
  }

  addDiamonds(amount) {
    // Elmaslar kaldırıldı, sistem altın ve XP ile çalışır
  }

  // ==================== TURBO HIZLANMA & DAİRESEL SAYAÇ SİSTEMİ ====================
  startTurboBoost() {
    if (!this.player || this.player.isDead || this.boostState !== 'READY') return;
    this.checkQuestProgress('use_turbo', 1);
    this.boostState = 'BOOSTING';
    this.boostTimer = 0;
    this.player.isBoosting = true;
    if (this.boostBtn) this.boostBtn.classList.add('active-boost');
    if (this.boostGaugeBar) {
      this.boostGaugeBar.classList.add('boosting');
      this.boostGaugeBar.classList.remove('cooldown');
    }
    this.vibrate([25, 20, 25]);
    sounds.playSpecial();
  }

  stopTurboBoost() {
    if (this.boostState === 'COOLDOWN') return;
    this.boostState = 'COOLDOWN';
    this.boostTimer = 0;
    if (this.player) this.player.isBoosting = false;
    if (this.boostBtn) {
      this.boostBtn.classList.remove('active-boost');
      this.boostBtn.classList.add('cooldown-state');
    }
    if (this.boostGaugeBar) {
      this.boostGaugeBar.classList.remove('boosting');
      this.boostGaugeBar.classList.add('cooldown');
    }
  }

  // Seviye ve XP Hesaplama (Kademeli RPG Eğrisi - Seviyelerin hızlı atlamasını önler)
  getXpForLevel(level) {
    if (level <= 1) return 0;
    let total = 0;
    for (let l = 1; l < level; l++) {
      total += Math.floor(180 * Math.pow(l, 1.35));
    }
    return total;
  }

  getLevelFromXp(xp) {
    let level = 1;
    while (this.getXpForLevel(level + 1) <= xp) {
      level++;
    }
    return level;
  }

  getXpProgressInCurrentLevel(xp) {
    const level = this.getLevelFromXp(xp);
    const startXp = this.getXpForLevel(level);
    const nextXp = this.getXpForLevel(level + 1);
    const current = Math.max(0, xp - startXp);
    const required = Math.max(1, nextXp - startXp);
    const pct = Math.min(100, Math.max(0, Math.floor((current / required) * 100)));
    return { level, current, required, pct };
  }

  addXp(amount) {
    const prevLevel = this.getLevelFromXp(this.xp);
    this.xp += amount;
    localStorage.setItem('worm_xp', this.xp.toString());
    const newLevel = this.getLevelFromXp(this.xp);

    if (newLevel > prevLevel) {
      sounds.playLevelUp();
      const bonusCoins = newLevel * 50;
      this.addCoins(bonusCoins);
      const title = window.I18N ? window.I18N.t('alert_level_up_title') : '🎉 LEVEL UP!';
      const msg = window.I18N ? window.I18N.t('alert_level_up_msg', { level: newLevel, coins: bonusCoins }) : `Reached Level ${newLevel}! +${bonusCoins} Coins added to your account!`;
      window.showInGameAlert(msg, 'level_up', title);
      this.drawSkinPreview();
    }
    this.updateEconomyUI();
  }

  updateEconomyUI() {
    const { level, current, required, pct } = this.getXpProgressInCurrentLevel(this.xp);

    const coinCountEl = document.getElementById('menuCoinCount');
    const levelTextEl = document.getElementById('menuLevelText');
    const xpFillEl = document.getElementById('menuXpFill');
    const shopCoinCountEl = document.getElementById('shopCoinCount');

    if (coinCountEl) coinCountEl.textContent = this.coins;
    if (shopCoinCountEl) shopCoinCountEl.textContent = this.coins;
    if (levelTextEl) levelTextEl.textContent = level;
    if (xpFillEl) {
      xpFillEl.style.width = `${pct}%`;
      xpFillEl.title = `${current} / ${required} XP`;
    }

    const activeHatDef = HATS.find(h => h.id === this.equippedHat);
    const activeHatNameEl = document.getElementById('activeHatName');
    if (activeHatNameEl) {
      const hatName = activeHatDef ? (window.I18N ? window.I18N.getHatName(activeHatDef.id) : activeHatDef.name) : (window.I18N ? window.I18N.t('head_original') : 'Original');
      activeHatNameEl.textContent = window.I18N ? window.I18N.t('head_costume_label', { name: hatName }) : `Head Costume: ${hatName}`;
    }

    this.updateActiveBadgeUI();
    this.updateWheelUIStatus();
  }

  // ==================== MAĞAZA & ŞANS ÇARKI ====================
  initShopAndWheelUI() {
    const openWheelBtn = document.getElementById('openWheelBtn');
    const wheelModal = document.getElementById('wheelModal');
    const closeWheelBtn = document.getElementById('closeWheelBtn');
    const spinWheelBtn = document.getElementById('spinWheelBtn');

    const openShopBtn = document.getElementById('openShopBtn');
    const shopModal = document.getElementById('shopModal');
    const closeShopBtn = document.getElementById('closeShopBtn');
    const tabShopHats = document.getElementById('tabShopHats');
    const tabShopSkins = document.getElementById('tabShopSkins');
    const hatsGrid = document.getElementById('hatsGrid');
    const skinsGrid = document.getElementById('skinsGrid');

    const openQuestsBtn = document.getElementById('openQuestsBtn');
    const questsModal = document.getElementById('questsModal');
    const closeQuestsBtn = document.getElementById('closeQuestsBtn');

    // Şans Çarkı Aç / Kapa
    if (openWheelBtn && wheelModal) {
      openWheelBtn.addEventListener('click', () => {
        wheelModal.classList.remove('hidden');
        document.getElementById('wheelResultMsg').classList.add('hidden');
        this.drawFortuneWheel(this.wheelRotation);
      });
    }
    if (closeWheelBtn && wheelModal) {
      closeWheelBtn.addEventListener('click', () => wheelModal.classList.add('hidden'));
    }
    if (wheelModal) {
      wheelModal.addEventListener('click', (e) => {
        if (e.target === wheelModal) wheelModal.classList.add('hidden');
      });
    }

    // Çarkı Çevir
    if (spinWheelBtn) {
      spinWheelBtn.addEventListener('click', () => {
        if (this.isSpinningWheel) return;
        this.spinFortuneWheel();
      });
    }

    // Mağaza Aç / Kapa
    if (openShopBtn && shopModal) {
      openShopBtn.addEventListener('click', () => {
        shopModal.classList.remove('hidden');
        this.renderShopItems();
      });
    }
    if (closeShopBtn && shopModal) {
      closeShopBtn.addEventListener('click', () => shopModal.classList.add('hidden'));
    }
    if (shopModal) {
      shopModal.addEventListener('click', (e) => {
        if (e.target === shopModal) shopModal.classList.add('hidden');
      });
    }

    if (tabShopHats && tabShopSkins) {
      tabShopHats.addEventListener('click', () => {
        tabShopHats.classList.add('active');
        tabShopSkins.classList.remove('active');
        if (hatsGrid) hatsGrid.classList.remove('hidden');
        if (skinsGrid) skinsGrid.classList.add('hidden');
      });

      tabShopSkins.addEventListener('click', () => {
        tabShopSkins.classList.add('active');
        tabShopHats.classList.remove('active');
        if (skinsGrid) skinsGrid.classList.remove('hidden');
        if (hatsGrid) hatsGrid.classList.add('hidden');
      });
    }

    // Görevler Aç / Kapa
    if (openQuestsBtn && questsModal) {
      openQuestsBtn.addEventListener('click', () => {
        questsModal.classList.remove('hidden');
        this.renderQuestsUI();
      });
    }
    if (closeQuestsBtn && questsModal) {
      closeQuestsBtn.addEventListener('click', () => questsModal.classList.add('hidden'));
    }
    if (questsModal) {
      questsModal.addEventListener('click', (e) => {
        if (e.target === questsModal) questsModal.classList.add('hidden');
      });
    }
  }

  drawFortuneWheel(angle) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const slices = [
      { text: '50 🪙', color: '#ffb700' },
      { text: '100 🪙', color: '#00f0ff' },
      { text: '500 🪙', color: '#ff0055' },
      { text: '50 ⭐', color: '#00ff88' },
      { text: '75 🪙', color: '#9d4edd' },
      { text: '200 🪙', color: '#ff7700' },
      { text: '150 🪙', color: '#3a86ff' },
      { text: '100 ⭐', color: '#ff3388' }
    ];

    const sliceAngle = (Math.PI * 2) / slices.length;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    slices.forEach((s, idx) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, idx * sliceAngle, (idx + 1) * sliceAngle);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dilim Yazısı
      ctx.save();
      ctx.rotate(idx * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#080c16';
      ctx.font = 'bold 15px Fredoka One, sans-serif';
      ctx.fillText(s.text, r - 15, 6);
      ctx.restore();
    });

    // Göbek
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }

  canSpinWheelToday() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('worm_last_wheel_date');
    return lastDate !== today;
  }

  updateWheelUIStatus() {
    const spinBtn = document.getElementById('spinWheelBtn');
    const resultMsg = document.getElementById('wheelResultMsg');
    const wheelBadge = document.querySelector('#openWheelBtn .badge-dot');

    if (!this.canSpinWheelToday()) {
      if (spinBtn) {
        spinBtn.disabled = true;
        const btnText = window.I18N ? window.I18N.t('wheel_limit_btn') : "TODAY'S CHANCE USED";
        spinBtn.innerHTML = `<span>🔒 ${btnText}</span>`;
        spinBtn.style.opacity = '0.6';
        spinBtn.style.cursor = 'not-allowed';
      }
      if (resultMsg) {
        resultMsg.textContent = window.I18N ? window.I18N.t('wheel_limit_msg') : '⏳ You can only spin the wheel once a day. Come back tomorrow!';
        resultMsg.classList.remove('hidden');
      }
      if (wheelBadge) {
        wheelBadge.textContent = window.I18N ? window.I18N.t('wheel_badge_tomorrow') : 'Tomorrow';
        wheelBadge.style.background = '#64748b';
      }
    } else {
      if (spinBtn && !this.isSpinningWheel) {
        spinBtn.disabled = false;
        const btnText = window.I18N ? window.I18N.t('wheel_spin_btn') : 'SPIN FORTUNE WHEEL 🎯';
        spinBtn.innerHTML = `<span>${btnText}</span>`;
        spinBtn.style.opacity = '1';
        spinBtn.style.cursor = 'pointer';
      }
      if (wheelBadge) {
        wheelBadge.textContent = window.I18N ? window.I18N.t('wheel_badge_free') : 'Free';
        wheelBadge.style.background = '#ef4444';
      }
    }
  }

  spinFortuneWheel() {
    if (!this.canSpinWheelToday()) {
      const title = window.I18N ? window.I18N.t('alert_wheel_daily_limit_title') : '⏳ DAILY LIMIT';
      const msg = window.I18N ? window.I18N.t('alert_wheel_daily_limit_msg') : 'You can only spin once a day! Come back tomorrow.';
      window.showInGameAlert(msg, 'warning', title);
      return;
    }

    this.isSpinningWheel = true;
    const spinBtn = document.getElementById('spinWheelBtn');
    const resultMsg = document.getElementById('wheelResultMsg');
    spinBtn.disabled = true;
    resultMsg.classList.add('hidden');

    const isTr = window.I18N && window.I18N.currentLang === 'tr';
    const slices = [
      { text: isTr ? '50 Altın' : '50 Coins', type: 'coin', val: 50 },
      { text: isTr ? '100 Altın' : '100 Coins', type: 'coin', val: 100 },
      { text: isTr ? '500 BÜYÜK ÖDÜL ALTIN!' : '500 GRAND PRIZE COINS!', type: 'coin', val: 500 },
      { text: '50 XP', type: 'xp', val: 50 },
      { text: isTr ? '75 Altın' : '75 Coins', type: 'coin', val: 75 },
      { text: isTr ? '200 Altın' : '200 Coins', type: 'coin', val: 200 },
      { text: isTr ? '150 Altın' : '150 Coins', type: 'coin', val: 150 },
      { text: '100 XP', type: 'xp', val: 100 }
    ];

    const chosenIdx = Math.floor(Math.random() * slices.length);
    const sliceAngle = (Math.PI * 2) / slices.length;
    // İğne tepede (-PI/2) durur
    const targetAngle = Math.PI * 8 + (slices.length - chosenIdx - 0.5) * sliceAngle - Math.PI / 2;

    let start = performance.now();
    const duration = 4000;
    let lastTickAngle = 0;

    const animateWheel = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.wheelRotation = ease * targetAngle;

      this.drawFortuneWheel(this.wheelRotation);

      if (this.wheelRotation - lastTickAngle > sliceAngle * 0.7) {
        sounds.playWheelTick();
        lastTickAngle = this.wheelRotation;
      }

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        this.isSpinningWheel = false;
        localStorage.setItem('worm_last_wheel_date', new Date().toISOString().slice(0, 10));
        this.updateWheelUIStatus();

        const reward = slices[chosenIdx];
        if (reward.type === 'coin') this.addCoins(reward.val);
        else this.addXp(reward.val);

        sounds.playWheelWin();
        resultMsg.textContent = window.I18N ? window.I18N.t('wheel_win_msg', { reward: reward.text }) : `🎉 Congratulations! You won ${reward.text}!`;
        resultMsg.classList.remove('hidden');
      }
    };
    requestAnimationFrame(animateWheel);
  }

  renderShopItems() {
    const hatsGrid = document.getElementById('hatsGrid');
    const skinsGrid = document.getElementById('skinsGrid');
    hatsGrid.innerHTML = '';
    skinsGrid.innerHTML = '';

    const freeText = window.I18N ? window.I18N.t('shop_item_free') : 'Free';
    const equippedHatText = window.I18N ? window.I18N.t('shop_btn_equipped') : '✓ EQUIPPED';
    const equipHatText = window.I18N ? window.I18N.t('shop_btn_equip') : 'EQUIP';
    const buyText = window.I18N ? window.I18N.t('shop_btn_buy') : 'BUY';
    const selectedSkinText = window.I18N ? window.I18N.t('shop_btn_selected') : '✓ SELECTED';
    const lockedSkinText = window.I18N ? window.I18N.t('shop_btn_locked') : '🔒 LOCKED';
    const selectSkinText = window.I18N ? window.I18N.t('shop_btn_select') : 'SELECT';

    // Şapkalar
    HATS.forEach(hat => {
      const isOwned = this.unlockedHats.includes(hat.id);
      const isEquipped = this.equippedHat === hat.id;
      const hatTitle = window.I18N ? window.I18N.getHatName(hat.id) : hat.name;

      const card = document.createElement('div');
      card.className = `shop-item-card ${isEquipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <span class="shop-item-icon">${hat.icon}</span>
        <span class="shop-item-name">${hatTitle}</span>
        <span class="shop-item-cost">${hat.cost > 0 ? `${hat.cost} 🪙` : freeText}</span>
        <button class="shop-action-btn ${isEquipped ? 'equipped-btn' : isOwned ? 'equip-btn' : 'buy-btn'}">
          ${isEquipped ? equippedHatText : isOwned ? equipHatText : buyText}
        </button>
      `;

      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        if (isEquipped) return;
        if (isOwned) {
          this.equippedHat = hat.id;
          localStorage.setItem('worm_equipped_hat', hat.id);
          this.renderShopItems();
          this.updateEconomyUI();
          this.drawSkinPreview();
        } else {
          if (this.coins >= hat.cost) {
            this.addCoins(-hat.cost);
            this.unlockedHats.push(hat.id);
            localStorage.setItem('worm_unlocked_hats', JSON.stringify(this.unlockedHats));
            this.equippedHat = hat.id;
            localStorage.setItem('worm_equipped_hat', hat.id);
            this.renderShopItems();
            this.updateEconomyUI();
            this.drawSkinPreview();
            sounds.playSpecial();
          } else {
            const title = window.I18N ? window.I18N.t('alert_insufficient_coins_title') : '⚠️ NOT ENOUGH COINS';
            const msg = window.I18N ? window.I18N.t('alert_insufficient_coins_msg') : 'Not enough coins! Collect fruits in the arena or spin the wheel to earn coins.';
            window.showInGameAlert(msg, 'warning', title);
          }
        }
      });
      hatsGrid.appendChild(card);
    });

    // Kostümler
    SKINS.forEach((skin, idx) => {
      const isOwned = this.unlockedSkins.includes(skin.id);
      const isEquipped = this.selectedSkinIndex === idx;
      const playerLevel = this.getLevelFromXp(this.xp);
      const isLevelLocked = (skin.unlockLevel || 1) > playerLevel;

      const unlockCostText = isLevelLocked
        ? (window.I18N ? window.I18N.t('shop_unlock_level', { level: skin.unlockLevel }) : `Unlocks at Lv.${skin.unlockLevel}`)
        : (skin.cost > 0 ? `${skin.cost} 🪙` : freeText);

      const actionText = isEquipped
        ? selectedSkinText
        : isLevelLocked
        ? lockedSkinText
        : isOwned
        ? selectSkinText
        : buyText;

      const card = document.createElement('div');
      card.className = `shop-item-card ${isEquipped ? 'equipped' : ''} ${isLevelLocked ? 'level-locked-card' : ''}`;
      card.innerHTML = `
        <div style="width:36px;height:36px;border-radius:50%;background:${skin.head};border:2px solid ${skin.outline};box-shadow:0 0 10px ${skin.glow};margin-bottom:4px;display:flex;align-items:center;justify-content:center;">
          ${isLevelLocked ? '🔒' : ''}
        </div>
        <span class="shop-item-name">${window.I18N ? window.I18N.getSkinName(skin.id) : skin.name}</span>
        <span class="shop-item-cost">${unlockCostText}</span>
        <button class="shop-action-btn ${isEquipped ? 'equipped-btn' : isLevelLocked ? 'disabled-lock-btn' : isOwned ? 'equip-btn' : 'buy-btn'}">
          ${actionText}
        </button>
      `;

      const btn = card.querySelector('button');
      btn.addEventListener('click', () => {
        if (isEquipped) return;
        if (isLevelLocked) {
          const title = window.I18N ? window.I18N.t('alert_level_required_title') : '🔒 LEVEL REQUIRED';
          const msg = window.I18N ? window.I18N.t('alert_level_required_msg', { level: skin.unlockLevel }) : `You must reach Level ${skin.unlockLevel} to unlock this skin!`;
          window.showInGameAlert(msg, 'warning', title);
          return;
        }
        if (isOwned) {
          this.selectedSkinIndex = idx;
          this.renderShopItems();
          this.drawSkinPreview();
        } else {
          if (this.coins >= skin.cost) {
            this.addCoins(-skin.cost);
            this.unlockedSkins.push(skin.id);
            localStorage.setItem('worm_unlocked_skins', JSON.stringify(this.unlockedSkins));
            this.selectedSkinIndex = idx;
            this.renderShopItems();
            this.drawSkinPreview();
            sounds.playSpecial();
          } else {
            const title = window.I18N ? window.I18N.t('alert_insufficient_coins_title') : '⚠️ NOT ENOUGH COINS';
            const msg = window.I18N ? window.I18N.t('alert_skin_insufficient_coins_msg') : 'You do not have enough coins to purchase this skin!';
            window.showInGameAlert(msg, 'warning', title);
          }
        }
      });
      skinsGrid.appendChild(card);
    });
  }

  // ==================== GÖREVLER & 7 GÜNLÜK HEDEF VE ÖDÜL SİSTEMİ ====================
  initQuestsSystem() {
    const defaultQuests = [
      { id: 'eat_foods', get title() { return window.I18N ? window.I18N.getQuestTitle('eat_foods') : 'Eat 40 Foods 🍎'; }, target: 40, current: 0, reward: 120, claimed: false },
      { id: 'kill_worms', get title() { return window.I18N ? window.I18N.getQuestTitle('kill_worms') : 'Trap and Eliminate 2 Worms 💀'; }, target: 2, current: 0, reward: 200, claimed: false },
      { id: 'reach_score', get title() { return window.I18N ? window.I18N.getQuestTitle('reach_score') : 'Reach 200 Score & Grow ⭐'; }, target: 200, current: 0, reward: 180, claimed: false },
      { id: 'use_turbo', get title() { return window.I18N ? window.I18N.getQuestTitle('use_turbo') : 'Use Turbo / Boost 5 Times ⚡'; }, target: 5, current: 0, reward: 100, claimed: false },
      { id: 'collect_gold', get title() { return window.I18N ? window.I18N.getQuestTitle('collect_gold') : 'Collect 8 Golden Stars / Shiny Food ⭐'; }, target: 8, current: 0, reward: 150, claimed: false },
      { id: 'collect_powerup', get title() { return window.I18N ? window.I18N.getQuestTitle('collect_powerup') : 'Grab 2 Powerups (Magnet/Ghost/2X) 🧲'; }, target: 2, current: 0, reward: 160, claimed: false }
    ];

    try {
      const stored = JSON.parse(safeGetStorage('worm_quests', 'null'));
      if (Array.isArray(stored) && stored.length >= defaultQuests.length) {
        this.quests = stored;
      } else {
        // Eksik veya eski görevler varsa mantıklı yeni liste ile senkronize et
        this.quests = defaultQuests.map(def => {
          const old = Array.isArray(stored) ? stored.find(s => s.id === def.id) : null;
          return old ? { ...def, current: old.current || 0, claimed: !!old.claimed } : def;
        });
        localStorage.setItem('worm_quests', JSON.stringify(this.quests));
      }
    } catch (e) {
      this.quests = defaultQuests;
    }

    try {
      this.milestoneData = JSON.parse(safeGetStorage('worm_milestone_data', 'null'));
    } catch (e) {
      this.milestoneData = null;
    }
    if (!this.milestoneData || typeof this.milestoneData !== 'object') {
      this.milestoneData = {
        currentDay: 1,
        currentScore: 0,
        claimedDays: []
      };
    }
    if (!Array.isArray(this.milestoneData.claimedDays)) {
      this.milestoneData.claimedDays = [];
    }
    if (typeof this.milestoneData.currentScore !== 'number') {
      this.milestoneData.currentScore = 0;
    }
    if (typeof this.milestoneData.currentDay !== 'number' || !SEVEN_DAY_REWARDS.some(m => m.day === this.milestoneData.currentDay)) {
      const nextUnclaimed = SEVEN_DAY_REWARDS.find(m => !this.milestoneData.claimedDays.includes(m.day));
      this.milestoneData.currentDay = nextUnclaimed ? nextUnclaimed.day : 1;
    }
    if (!Array.isArray(this.unlockedHats)) this.unlockedHats = ['none'];
    if (!Array.isArray(this.unlockedSkins)) this.unlockedSkins = ['white_king'];

    // Günlük Giriş Takibi (Unique Login Days)
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastLogin = safeGetStorage('worm_last_login_date', '');
    let totalLogins = parseInt(safeGetStorage('worm_total_login_days', '1'), 10) || 1;
    if (lastLogin !== todayStr) {
      if (lastLogin) {
        totalLogins++;
      }
      localStorage.setItem('worm_last_login_date', todayStr);
      localStorage.setItem('worm_total_login_days', totalLogins.toString());
    }
    this.totalLoginDays = totalLogins;

    // Eğer daha önce 7. gün tamamlandıysa ve currentDay 8 kaldıysa, otomatik olarak 15. güne geçir
    const validNextMilestone = SEVEN_DAY_REWARDS.find(m => !this.milestoneData.claimedDays.includes(m.day));
    if (validNextMilestone && (!SEVEN_DAY_REWARDS.some(m => m.day === this.milestoneData.currentDay) || this.milestoneData.currentDay === 8)) {
      this.milestoneData.currentDay = validNextMilestone.day;
      localStorage.setItem('worm_milestone_data', JSON.stringify(this.milestoneData));
    }
  }

  initMilestonesSystem() {
    this.initQuestsSystem();
  }

  checkMilestoneProgress(score) {
    if (!this.milestoneData) this.initQuestsSystem();
    const ms = SEVEN_DAY_REWARDS.find(m => m.day === this.milestoneData.currentDay);
    if (!ms) return;

    if (score > (this.milestoneData.currentScore || 0)) {
      this.milestoneData.currentScore = score;
      localStorage.setItem('worm_milestone_data', JSON.stringify(this.milestoneData));
    }
  }

  checkQuestProgress(questId, value = 1) {
    if (!this.quests) return;
    const q = this.quests.find(item => item.id === questId);
    if (q && !q.claimed) {
      if (questId === 'reach_score') {
        q.current = Math.max(q.current, value);
      } else {
        q.current += value;
      }
      localStorage.setItem('worm_quests', JSON.stringify(this.quests));
    }
  }

  updateActiveBadgeUI() {
    this.updateEconomyUI();
  }

  renderQuestsUI() {
    const questsList = document.getElementById('questsList');
    const streakDaysRow = document.getElementById('streakDaysRow');
    const loginCountBadge = document.getElementById('streakLoginCountBadge');

    if (loginCountBadge) {
      loginCountBadge.textContent = window.I18N ? window.I18N.t('streak_total_login', { day: this.totalLoginDays || 1 }) : `📅 Total Logins: Day ${this.totalLoginDays || 1}`;
    }

    if (questsList) questsList.innerHTML = '';
    if (streakDaysRow) streakDaysRow.innerHTML = '';

    if (!this.milestoneData) this.initQuestsSystem();

    // 🎁 Günlük Sadakat & Büyük Aşama Ödülleri (1..7, 15, 30, 60, 90, 120+ Günler)
    if (streakDaysRow) {
      let activeBoxElement = null;

      SEVEN_DAY_REWARDS.forEach(ms => {
        const isClaimed = this.milestoneData.claimedDays.includes(ms.day);
        const isCurrent = this.milestoneData.currentDay === ms.day;
        const currentVal = isClaimed ? ms.target : (isCurrent ? (this.milestoneData.currentScore || 0) : 0);
        // Hem skora ulaşarak hem de toplam giriş günüyle aşama ödülü açılabilir!
        const reachedTarget = currentVal >= ms.target || (this.totalLoginDays && this.totalLoginDays >= ms.day);
        const canClaim = isCurrent && !isClaimed && reachedTarget;
        const progressPct = Math.min(100, Math.floor((Math.max(currentVal, (this.totalLoginDays && isCurrent ? this.totalLoginDays : 0)) / ms.target) * 100));

        const isMajorMilestone = [7, 15, 30, 60, 90, 120, 150, 180, 365].includes(ms.day);
        const box = document.createElement('div');
        box.className = `streak-day-box ${isMajorMilestone ? 'major-milestone' : ''} ${isClaimed ? 'claimed' : canClaim ? 'claimable-day active-day' : isCurrent ? 'active-day' : ''}`;

        const claimedText = window.I18N ? window.I18N.t('streak_btn_claimed') : '✓ CLAIMED';
        const claimText = window.I18N ? window.I18N.t('streak_btn_claim') : '🎁 CLAIM REWARD';
        const btnText = isClaimed ? claimedText : canClaim ? claimText : `${currentVal}/${ms.target}`;

        const dayPrefix = window.I18N && window.I18N.currentLang === 'tr' ? 'GÜN ' : 'DAY ';
        box.innerHTML = `
          <div class="day-badge-tag">${ms.tag || (dayPrefix + ms.day)}</div>
          <div class="day-reward-icon">${ms.rewardIcon}</div>
          <div class="day-reward-val">${ms.rewardText}</div>
          <div class="day-reward-desc">${ms.goalText}</div>
          <div class="day-progress-mini"><div class="day-progress-mini-fill" style="width:${progressPct}%"></div></div>
          <button type="button" class="day-action-btn">${btnText}</button>
        `;

        if (isCurrent) {
          activeBoxElement = box;
        }

        const actionBtn = box.querySelector('.day-action-btn');

        if (canClaim) {
          box.title = window.I18N ? window.I18N.t('streak_claim_tooltip') : 'Tap to claim your reward!';
          box.style.cursor = 'pointer';
          if (actionBtn) {
            actionBtn.style.cursor = 'pointer';
            actionBtn.removeAttribute('disabled');
          }

          let isClaiming = false;
          const doClaimMilestone = (e) => {
            if (e) {
              try { e.preventDefault(); } catch (_) {}
              try { e.stopPropagation(); } catch (_) {}
            }
            if (isClaiming) return;
            isClaiming = true;

            try {
              if (!this.milestoneData) this.initQuestsSystem();
              if (!Array.isArray(this.milestoneData.claimedDays)) {
                this.milestoneData.claimedDays = [];
              }
              if (!this.milestoneData.claimedDays.includes(ms.day)) {
                this.milestoneData.claimedDays.push(ms.day);
              }

              // Bir sonraki aşamayı belirle (7 -> 15 -> 30 -> 60 -> 90 -> 120 -> 150 -> 180 -> 365)
              const curIdx = SEVEN_DAY_REWARDS.findIndex(m => m.day === ms.day);
              if (curIdx !== -1 && curIdx < SEVEN_DAY_REWARDS.length - 1) {
                this.milestoneData.currentDay = SEVEN_DAY_REWARDS[curIdx + 1].day;
              } else {
                this.milestoneData.currentDay = 999;
              }
              this.milestoneData.currentScore = 0;
              localStorage.setItem('worm_milestone_data', JSON.stringify(this.milestoneData));

              if (ms.rewardCoins) this.addCoins(ms.rewardCoins);
              if (ms.rewardXp) this.addXp(ms.rewardXp);
              if (ms.rewardItem) {
                if (!Array.isArray(this.unlockedHats)) this.unlockedHats = ['none'];
                if (!this.unlockedHats.includes(ms.rewardItem)) {
                  this.unlockedHats.push(ms.rewardItem);
                  localStorage.setItem('worm_unlocked_hats', JSON.stringify(this.unlockedHats));
                }
              }
              if (ms.rewardSkin) {
                if (!Array.isArray(this.unlockedSkins)) this.unlockedSkins = ['white_king'];
                if (!this.unlockedSkins.includes(ms.rewardSkin)) {
                  this.unlockedSkins.push(ms.rewardSkin);
                  localStorage.setItem('worm_unlocked_skins', JSON.stringify(this.unlockedSkins));
                }
              }

              if (typeof sounds !== 'undefined' && sounds.playWheelWin) {
                try { sounds.playWheelWin(); } catch (_) {}
              }
              if (window.showInGameAlert) {
                const title = window.I18N ? window.I18N.t('alert_milestone_claim_title') : '🎁 LEGENDARY MILESTONE REWARD';
                const msg = window.I18N ? window.I18N.t('alert_milestone_claim_msg', { day: ms.day, reward: ms.rewardText }) : `🎉 CONGRATULATIONS! Day ${ms.day} Grand Milestone Reward (${ms.rewardText}) has been added to your account!`;
                window.showInGameAlert(msg, 'level_up', title);
              }
            } catch (err) {
              console.error('Milestone claim error:', err);
            } finally {
              this.renderQuestsUI();
              this.updateEconomyUI();
            }
          };

          if (actionBtn) {
            actionBtn.addEventListener('click', doClaimMilestone);
            actionBtn.addEventListener('touchend', doClaimMilestone, { passive: false });
          }
          box.addEventListener('click', doClaimMilestone);
          box.addEventListener('touchend', doClaimMilestone, { passive: false });
        } else {
          if (actionBtn && !isClaimed) {
            actionBtn.disabled = true;
          }
        }
        streakDaysRow.appendChild(box);
      });

      if (activeBoxElement) {
        setTimeout(() => {
          activeBoxElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 120);
      }
    }

    // 🎯 Mantıklı Günlük Arena Görevleri
    if (questsList) {
      this.quests.forEach(q => {
        const pct = Math.min(100, Math.floor((q.current / q.target) * 100));
        const isDone = q.current >= q.target;

        const qTitle = window.I18N ? window.I18N.getQuestTitle(q.id) : (q.title || '');
        const qRewardText = window.I18N ? window.I18N.t('quest_coins_reward', { coins: q.reward }) : `+${q.reward} 🪙 Coins`;
        const qClaimedText = window.I18N ? window.I18N.t('quest_btn_claimed') : 'CLAIMED';
        const qClaimText = window.I18N ? window.I18N.t('quest_btn_claim') : 'CLAIM REWARD';
        const qBtnText = q.claimed ? qClaimedText : isDone ? qClaimText : `${q.current}/${q.target}`;

        const item = document.createElement('div');
        item.className = 'quest-item';
        item.innerHTML = `
          <div class="quest-info">
            <span class="quest-title">${qTitle}</span>
            <span class="quest-reward">${qRewardText}</span>
            <div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${pct}%"></div></div>
          </div>
          <button type="button" class="quest-claim-btn ${isDone && !q.claimed ? '' : 'disabled'}">
            ${qBtnText}
          </button>
        `;

        const btn = item.querySelector('button');
        if (isDone && !q.claimed) {
          btn.style.cursor = 'pointer';
          let isClaiming = false;
          const doClaimQuest = (e) => {
            if (e) {
              try { e.preventDefault(); } catch (_) {}
              try { e.stopPropagation(); } catch (_) {}
            }
            if (isClaiming) return;
            isClaiming = true;
            try {
              q.claimed = true;
              this.addCoins(q.reward);
              localStorage.setItem('worm_quests', JSON.stringify(this.quests));
              if (typeof sounds !== 'undefined' && sounds.playWheelWin) {
                try { sounds.playWheelWin(); } catch (_) {}
              }
              if (window.showInGameAlert) {
                const title = window.I18N ? window.I18N.t('alert_quest_claim_title') : '🪙 QUEST REWARD';
                const msg = window.I18N ? window.I18N.t('alert_quest_claim_msg', { reward: q.reward }) : `🎉 Quest Completed! +${q.reward} Coins Earned!`;
                window.showInGameAlert(msg, 'success', title);
              }
            } catch (err) {
              console.error('Quest claim error:', err);
            } finally {
              this.renderQuestsUI();
              this.updateEconomyUI();
            }
          };

          btn.addEventListener('click', doClaimQuest);
          btn.addEventListener('touchend', doClaimQuest, { passive: false });
          item.addEventListener('click', doClaimQuest);
        }
        questsList.appendChild(item);
      });
    }
  }

  // ==================== OYUN İÇİ CANLI EMOJİLER ====================
  sendEmote(emoji) {
    if (!this.player || this.state !== 'PLAYING') return;
    this.player.currentEmote = { icon: emoji, timer: 180 }; // ~3 saniye
    sounds.playEmote();
    this.vibrate(15);
  }

  // ==================== ÇİZİM ====================
  draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.ctx.fillStyle = '#101424';
    this.ctx.fillRect(0, 0, w, h);

    if ((this.state !== 'PLAYING' && this.state !== 'DYING' && this.state !== 'GAMEOVER') || !this.player) {
      this.drawArenaPattern(w, h);
      return;
    }

    const zoom = this.camera.scale || 1.0;
    this.ctx.save();
    if (zoom !== 1.0) {
      this.ctx.translate(w / 2, h / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.translate(-w / 2, -h / 2);
    }

    this.drawArenaPattern(w, h);
    this.drawWorldBorders();
    this.drawFoods();
    this.drawParticles();

    const remotePlayersList = Array.from(this.network.remotePlayers.values());
    const allWorms = [...this.bots, ...remotePlayersList, this.player];
    for (const worm of allWorms) {
      worm.draw(this.ctx, this.camera);
    }

    this.ctx.restore();

    if (!this.settings || this.settings.minimap !== false) {
      this.drawMinimap(allWorms);
    }
  }

  // Satranç Koordinatı Hesaplayıcı (8x8 Izgara: A1 - H8)
  getChessCoord(x, y) {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const colSize = this.worldWidth / 8; // 6400 / 8 = 800px
    const rowSize = this.worldHeight / 8; // 6400 / 8 = 800px
    const colIndex = Math.max(0, Math.min(7, Math.floor(x / colSize)));
    const rowIndex = Math.max(0, Math.min(7, Math.floor(y / rowSize)));
    return {
      code: `${cols[colIndex]}${rowIndex + 1}`,
      col: cols[colIndex],
      row: rowIndex + 1,
      colIndex,
      rowIndex
    };
  }

  drawArenaPattern(w, h) {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const sectorSize = this.worldWidth / 8; // 8x8 Satranç karesi: her kare 800x800 piksel
    const zoom = (this.camera && this.camera.scale) ? this.camera.scale : 1.0;
    const extraW = Math.max(0, (w / zoom - w) / 2);
    const extraH = Math.max(0, (h / zoom - h) / 2);

    // 1. İnce Arka Plan Kareleri (90px)
    const tileSize = 90;
    const startX = Math.floor((this.camera.x - extraW) / tileSize) * tileSize;
    const startY = Math.floor((this.camera.y - extraH) / tileSize) * tileSize;
    const endX = this.camera.x + w + extraW + tileSize;
    const endY = this.camera.y + h + extraH + tileSize;

    const lineTop = -extraH - 50;
    const lineBottom = h + extraH + 50;
    const lineLeft = -extraW - 50;
    const lineRight = w + extraW + 50;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = startX; x <= endX; x += tileSize) {
      const sx = x - this.camera.x;
      this.ctx.moveTo(sx, lineTop); this.ctx.lineTo(sx, lineBottom);
    }
    for (let y = startY; y <= endY; y += tileSize) {
      const sy = y - this.camera.y;
      this.ctx.moveTo(lineLeft, sy); this.ctx.lineTo(lineRight, sy);
    }
    this.ctx.stroke();

    // 2. Satranç Tahtası Sektör Çizgileri (Her 800px'te belirgin neon hat)
    const secStartX = Math.floor((this.camera.x - extraW) / sectorSize) * sectorSize;
    const secStartY = Math.floor((this.camera.y - extraH) / sectorSize) * sectorSize;

    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let x = secStartX; x <= endX; x += sectorSize) {
      if (x >= 0 && x <= this.worldWidth) {
        const sx = x - this.camera.x;
        this.ctx.moveTo(sx, lineTop); this.ctx.lineTo(sx, lineBottom);
      }
    }
    for (let y = secStartY; y <= endY; y += sectorSize) {
      if (y >= 0 && y <= this.worldHeight) {
        const sy = y - this.camera.y;
        this.ctx.moveTo(lineLeft, sy); this.ctx.lineTo(lineRight, sy);
      }
    }
    this.ctx.stroke();

    // 3. Ekrana Düşen Satranç Sektörlerinin Zemin Filigranları (A1, B2, D4, E5...)
    this.ctx.font = '900 76px "Outfit", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const minCol = Math.max(0, Math.floor((this.camera.x - extraW - 200) / sectorSize));
    const maxCol = Math.min(7, Math.floor((this.camera.x + w + extraW + 200) / sectorSize));
    const minRow = Math.max(0, Math.floor((this.camera.y - extraH - 200) / sectorSize));
    const maxRow = Math.min(7, Math.floor((this.camera.y + h + extraH + 200) / sectorSize));

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        const cx = c * sectorSize + sectorSize / 2 - this.camera.x;
        const cy = r * sectorSize + sectorSize / 2 - this.camera.y;
        const coordLabel = `${cols[c]}${r + 1}`;

        // Merkez 4 kare (D4, D5, E4, E5) hafif altın sarısı parlar
        const isCenter = (c === 3 || c === 4) && (r === 3 || r === 4);
        this.ctx.fillStyle = isCenter ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)';
        this.ctx.fillText(coordLabel, cx, cy);
      }
    }
  }

  drawWorldBorders() {
    const left = -this.camera.x;
    const top = -this.camera.y;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Duvar ekrana yakın değilse hiç çizme
    if (left > w + 20 || left + this.worldWidth < -20 || top > h + 20 || top + this.worldHeight < -20) {
      return;
    }

    this.ctx.strokeStyle = 'rgba(255, 51, 102, 0.35)';
    this.ctx.lineWidth = 12;
    this.ctx.strokeRect(left, top, this.worldWidth, this.worldHeight);

    this.ctx.strokeStyle = '#ff3366';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(left, top, this.worldWidth, this.worldHeight);

    // Duvar Kenarlarında Satranç Harf ve Sayı Göstergeleri
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const sectorSize = this.worldWidth / 8; // 800px
    this.ctx.font = 'bold 22px Outfit, sans-serif';
    this.ctx.fillStyle = 'rgba(255, 51, 102, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const isTr = window.I18N && window.I18N.currentLang === 'tr';
    const sectorPrefix = isTr ? 'SEKTÖR ' : 'SECTOR ';
    const lanePrefix = isTr ? 'HAT ' : 'LANE ';

    for (let c = 0; c < 8; c++) {
      const x = c * sectorSize + sectorSize / 2 - this.camera.x;
      // Üst Duvar
      if (top > -30 && top < h + 30 && x > -50 && x < w + 50) {
        this.ctx.fillText(`${sectorPrefix}${cols[c]}`, x, top + 22);
      }
      // Alt Duvar
      const bottom = top + this.worldHeight;
      if (bottom > -30 && bottom < h + 30 && x > -50 && x < w + 50) {
        this.ctx.fillText(`${sectorPrefix}${cols[c]}`, x, bottom - 22);
      }
    }
    for (let r = 0; r < 8; r++) {
      const y = r * sectorSize + sectorSize / 2 - this.camera.y;
      // Sol Duvar
      if (left > -30 && left < w + 30 && y > -50 && y < h + 50) {
        this.ctx.fillText(`${lanePrefix}${r + 1}`, left + 30, y);
      }
      // Sağ Duvar
      const right = left + this.worldWidth;
      if (right > -30 && right < w + 30 && y > -50 && y < h + 50) {
        this.ctx.fillText(`${lanePrefix}${r + 1}`, right - 30, y);
      }
    }
  }

  drawFoods() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const camX = this.camera.x;
    const camY = this.camera.y;

    const zoom = (this.camera && this.camera.scale) ? this.camera.scale : 1.0;
    const halfW = (w / 2) / zoom;
    const halfH = (h / 2) / zoom;
    const minX = w / 2 - halfW - 40;
    const maxX = w / 2 + halfW + 40;
    const minY = h / 2 - halfH - 40;
    const maxY = h / 2 + halfH + 40;

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '18px sans-serif';

    const foods = this.foods;
    const foodsLen = foods.length;

    for (let i = 0; i < foodsLen; i++) {
      const f = foods[i];
      const sx = f.x - camX;
      const sy = f.y - camY;

      if (sx < minX || sx > maxX || sy < minY || sy > maxY) continue;

      if (f.type === 'star_coin') {
        this.ctx.font = '22px sans-serif';
        this.ctx.fillText(f.icon, sx, sy);
      } else if (f.isPowerup) {
        this.ctx.font = '24px sans-serif';
        this.ctx.fillText(f.icon, sx, sy);
      } else {
        // Normal yemler: Gölgesiz, doğrudan hızlı çizim (0 kasma)
        this.ctx.fillText(f.icon, sx, sy);
      }
    }
  }

  drawParticles() {
    if (this.particles.length === 0) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const camX = this.camera.x;
    const camY = this.camera.y;

    this.ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const sx = p.x - camX;
      const sy = p.y - camY;
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;

      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  drawMinimap(allWorms) {
    const mw = 128;
    const mh = 128;
    if (this.minimapCanvas.width !== mw || this.minimapCanvas.height !== mh) {
      this.minimapCanvas.width = mw;
      this.minimapCanvas.height = mh;
    }
    this.minimapCtx.clearRect(0, 0, mw, mh);

    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const sqSize = mw / 8; // 16px her satranç karesi

    // 8x8 Satranç Tahtası Izgarası
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        this.minimapCtx.fillStyle = isDark ? 'rgba(8, 12, 24, 0.95)' : 'rgba(16, 24, 46, 0.95)';
        this.minimapCtx.fillRect(c * sqSize, r * sqSize, sqSize, sqSize);
      }
    }

    // Merkez 4 Kare (D4, D5, E4, E5) Altın Vurgusu
    this.minimapCtx.fillStyle = 'rgba(255, 215, 0, 0.12)';
    this.minimapCtx.fillRect(3 * sqSize, 3 * sqSize, 2 * sqSize, 2 * sqSize);

    // Satranç Izgara Çizgileri
    this.minimapCtx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
    this.minimapCtx.lineWidth = 0.8;
    this.minimapCtx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const pos = i * sqSize;
      this.minimapCtx.moveTo(pos, 0); this.minimapCtx.lineTo(pos, mh);
      this.minimapCtx.moveTo(0, pos); this.minimapCtx.lineTo(mw, pos);
    }
    this.minimapCtx.stroke();

    // Satranç Koordinat Harf ve Sayıları (Üstte A-H, Solda 1-8)
    this.minimapCtx.font = 'bold 7px Outfit, sans-serif';
    this.minimapCtx.textAlign = 'center';
    this.minimapCtx.textBaseline = 'middle';
    this.minimapCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';

    for (let c = 0; c < 8; c++) {
      this.minimapCtx.fillText(cols[c], c * sqSize + sqSize / 2, 5);
    }
    for (let r = 0; r < 8; r++) {
      this.minimapCtx.fillText((r + 1).toString(), 5, r * sqSize + sqSize / 2);
    }

    // Oyuncunun bulunduğu kareyi minimap üzerinde fosforlu neon ile vurgula
    if (this.player && !this.player.isDead) {
      const pCoord = this.getChessCoord(this.player.x, this.player.y);
      this.minimapCtx.fillStyle = 'rgba(0, 255, 136, 0.22)';
      this.minimapCtx.fillRect(pCoord.colIndex * sqSize, pCoord.rowIndex * sqSize, sqSize, sqSize);
      this.minimapCtx.strokeStyle = '#00ff88';
      this.minimapCtx.lineWidth = 1.2;
      this.minimapCtx.strokeRect(pCoord.colIndex * sqSize + 0.5, pCoord.rowIndex * sqSize + 0.5, sqSize - 1, sqSize - 1);

      const coordBadge = document.getElementById('minimapCoordBadge');
      if (coordBadge) {
        coordBadge.textContent = `📍 ${pCoord.code}`;
      }
    }

    const scaleX = mw / this.worldWidth;
    const scaleY = mh / this.worldHeight;

    // 1. Önce Bot ve Diğer Oyuncuları Çiz (Haritada Net Görünür)
    for (const worm of allWorms) {
      if (worm.isDead || worm === this.player) continue;
      const mx = Math.max(5, Math.min(mw - 5, worm.x * scaleX));
      const my = Math.max(5, Math.min(mh - 5, worm.y * scaleY));

      if (!worm.isBot) {
        // Arkadaş / Gerçek Oyuncu (Canlı Mavi/Turkuaz)
        this.minimapCtx.fillStyle = '#00f0ff';
        this.minimapCtx.beginPath();
        this.minimapCtx.arc(mx, my, 4.2, 0, Math.PI * 2);
        this.minimapCtx.fill();
        this.minimapCtx.strokeStyle = '#ffffff';
        this.minimapCtx.lineWidth = 1.2;
        this.minimapCtx.stroke();
      } else {
        // Bot Yılanlar (Göz Alıcı Parlak Turuncu / Kırmızı Nokta)
        this.minimapCtx.fillStyle = '#ff7700';
        this.minimapCtx.beginPath();
        this.minimapCtx.arc(mx, my, 3.8, 0, Math.PI * 2);
        this.minimapCtx.fill();
        this.minimapCtx.strokeStyle = '#ffdd00';
        this.minimapCtx.lineWidth = 1;
        this.minimapCtx.stroke();
      }
    }

    // 2. En Üste Kendi Solucanımızı Çiz (Belirgin Neon Yeşil + Görüş Oku)
    if (this.player && !this.player.isDead) {
      const pmx = Math.max(5, Math.min(mw - 5, this.player.x * scaleX));
      const pmy = Math.max(5, Math.min(mh - 5, this.player.y * scaleY));

      // Dış Halka (Radar Nabız)
      this.minimapCtx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
      this.minimapCtx.lineWidth = 1.5;
      this.minimapCtx.beginPath();
      this.minimapCtx.arc(pmx, pmy, 7, 0, Math.PI * 2);
      this.minimapCtx.stroke();

      // Merkez Nokta
      this.minimapCtx.fillStyle = '#00ff88';
      this.minimapCtx.beginPath();
      this.minimapCtx.arc(pmx, pmy, 4.8, 0, Math.PI * 2);
      this.minimapCtx.fill();

      // Görüş / İlerleme Oku
      this.minimapCtx.strokeStyle = '#ffffff';
      this.minimapCtx.lineWidth = 2;
      this.minimapCtx.beginPath();
      this.minimapCtx.moveTo(pmx, pmy);
      this.minimapCtx.lineTo(pmx + Math.cos(this.player.angle) * 11, pmy + Math.sin(this.player.angle) * 11);
      this.minimapCtx.stroke();

      this.minimapCtx.shadowBlur = 0;
    }
  }

  drawSkinPreview() {
    const pCanvas = document.getElementById('skinPreviewCanvas');
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext('2d');
    const skin = SKINS[this.selectedSkinIndex] || SKINS[0];
    const skinNameEl = document.getElementById('skinName');

    const playerLevel = this.getLevelFromXp(this.xp);
    const isLocked = (skin.unlockLevel || 1) > playerLevel;

    const lockOverlay = document.getElementById('skinLockOverlay');
    const lockText = document.getElementById('skinLockText');
    if (lockOverlay && lockText) {
      if (isLocked) {
        lockOverlay.classList.remove('hidden');
        lockText.textContent = window.I18N ? window.I18N.t('skin_unlock_level', { level: skin.unlockLevel }) : `Unlocks at Level ${skin.unlockLevel}`;
      } else {
        lockOverlay.classList.add('hidden');
      }
    }

    if (skinNameEl) {
      const skinTitle = window.I18N ? window.I18N.getSkinName(skin.id) : skin.name;
      skinNameEl.textContent = isLocked ? `🔒 ${skinTitle}` : skinTitle;
    }

    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    const centerY = pCanvas.height / 2;
    const radius = 17;
    const count = 9;

    // Kuyruktan başa doğru çizim (Genişletilmiş S-Kıvrımı)
    for (let i = count - 1; i >= 0; i--) {
      const cx = 35 + (count - 1 - i) * 26;
      const cy = centerY + Math.sin(i * 0.72) * 12;

      const progress = i / count;
      let segR = progress > 0.5 ? Math.max(7, radius * (1 - (progress - 0.5) * 0.7)) : radius;

      pCtx.save();
      pCtx.translate(cx, cy);

      if (i === count - 1) {
        // Türün özgün kuyruğu / silahı / roketi
        drawSpeciesTail(pCtx, skin, segR, 0, progress, false);
      } else if (i === 0) {
        const hatDef = (this.equippedHat && this.equippedHat !== 'none') ? HATS.find(h => h.id === this.equippedHat) : null;
        if (hatDef) {
          // Baş doğrudan seçilen kostüm olur!
          pCtx.beginPath();
          pCtx.arc(segR * 0.2, 0, segR * 1.25, 0, Math.PI * 2);
          pCtx.fillStyle = skin.outline || '#090d1a';
          pCtx.fill();

          pCtx.beginPath();
          pCtx.arc(segR * 0.2, 0, segR * 1.05, 0, Math.PI * 2);
          pCtx.fillStyle = skin.head || skin.body1 || '#1e293b';
          pCtx.fill();

          pCtx.strokeStyle = skin.glow || '#00f0ff';
          pCtx.lineWidth = 2;
          pCtx.stroke();

          pCtx.font = `${Math.floor(segR * 2.7)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
          pCtx.textAlign = 'center';
          pCtx.textBaseline = 'middle';
          pCtx.fillText(hatDef.icon, segR * 0.22, 0);
        } else {
          // Çatallı dil
          pCtx.strokeStyle = '#ff1744';
          pCtx.lineWidth = 2.2;
          pCtx.lineCap = 'round';
          pCtx.beginPath();
          pCtx.moveTo(segR * 1.1, 0);
          pCtx.lineTo(segR * 1.8, 0);
          pCtx.lineTo(segR * 2.3, -4);
          pCtx.moveTo(segR * 1.8, 0);
          pCtx.lineTo(segR * 2.3, 4);
          pCtx.stroke();

          // Türün özgün anatomik başı
          drawSpeciesHead(pCtx, skin, segR, null, 2);
        }
      } else {
        // Türün özgün gövde zırhı (Altıgen Mecha, Kaya Magma, Shuriken Ninja vs.)
        drawSpeciesSegment(pCtx, skin, segR, i, progress, false, 2);
      }

      pCtx.restore();
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  initMultiplayerEvents() {
    const openFriendsRoomBtn = document.getElementById('openFriendsRoomBtn');
    const multiplayerModal = document.getElementById('multiplayerModal');
    const closeMultiplayerBtn = document.getElementById('closeMultiplayerBtn');

    const tabCreateRoom = document.getElementById('tabCreateRoom');
    const tabJoinRoom = document.getElementById('tabJoinRoom');
    const roomTabsBar = document.getElementById('roomTabsBar');
    const createRoomContent = document.getElementById('createRoomTabContent');
    const joinRoomContent = document.getElementById('joinRoomTabContent');
    const waitingRoomContent = document.getElementById('waitingRoomTabContent');

    const myRoomCodeEl = document.getElementById('myRoomCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const copyRoomLinkBtn = document.getElementById('copyRoomLinkBtn');

    const lobbyList = document.getElementById('lobbyList');
    const lobbyCount = document.getElementById('lobbyCount');
    const lobbyStatusBadge = document.getElementById('lobbyStatusBadge');
    const hostPlayerNameLobby = document.getElementById('hostPlayerNameLobby');
    const startRoomGameBtn = document.getElementById('startRoomGameBtn');
    const startRoomGameBtnText = document.getElementById('startRoomGameBtnText');
    const botsInRoomToggle = document.getElementById('botsInRoomToggle');

    const joinRoomCodeInput = document.getElementById('joinRoomCodeInput');
    const joinRoomSubmitBtn = document.getElementById('joinRoomSubmitBtn');
    const joinStatusMsg = document.getElementById('joinStatusMsg');

    const clientLobbyList = document.getElementById('clientLobbyList');
    const clientLobbyCount = document.getElementById('clientLobbyCount');
    const waitingHostName = document.getElementById('waitingHostName');
    const waitingRoomCodeVal = document.getElementById('waitingRoomCodeVal');
    const waitingStatusText = document.getElementById('waitingStatusText');
    const clientLeaveRoomBtn = document.getElementById('clientLeaveRoomBtn');

    // UI Lobi Listesini Render Etme Fonksiyonu
    const renderLobbyPlayers = (players, roomCode) => {
      // YALNIZCA bir başkasının odasına bağlanmış bir misafir (client) ise bekleme odasını göster
      if (!this.network.isHost && this.network.hostConn) {
        // İSTEMCİ (CLIENT) GÖRÜNÜMÜ: Odaya katılan arkadaş bekleme odasında lobiyi izler
        if (this.state === 'PLAYING') return;

        if (multiplayerModal) {
          multiplayerModal.classList.remove('hidden');
          multiplayerModal.style.display = 'flex';
        }
        if (roomTabsBar) {
          roomTabsBar.classList.add('hidden');
          roomTabsBar.style.display = 'none';
        }
        if (createRoomContent) {
          createRoomContent.classList.add('hidden');
          createRoomContent.style.display = 'none';
        }
        if (joinRoomContent) {
          joinRoomContent.classList.add('hidden');
          joinRoomContent.style.display = 'none';
        }
        if (waitingRoomContent) {
          waitingRoomContent.classList.remove('hidden');
          waitingRoomContent.style.display = 'block';
        }

        if (clientLobbyList) {
          clientLobbyList.innerHTML = '';
          players.forEach((p) => {
            const isMe = p.id === this.network.myPeerId;
            const youTag = isMe ? (window.I18N ? ' (' + window.I18N.t('you') + ')' : ' (You)') : '';
            const leaderBadge = window.I18N ? window.I18N.t('mp_badge_leader') : 'LEADER';
            const readyBadge = window.I18N ? window.I18N.t('mp_badge_ready') : 'READY';
            const li = document.createElement('li');
            li.className = p.isHost ? 'lobby-item is-host' : 'lobby-item';
            li.innerHTML = `
              <span class="lobby-player-icon">${p.isHost ? '👑' : '🟢'}</span>
              <span class="lobby-player-name">${this.escapeHtml(p.name)}${youTag}</span>
              <span class="lobby-ready-badge ${p.isHost ? 'leader' : ''}">${p.isHost ? leaderBadge : readyBadge}</span>
            `;
            clientLobbyList.appendChild(li);
          });
        }
        if (clientLobbyCount) clientLobbyCount.textContent = players.length.toString();

        const hostPlayer = players.find(p => p.isHost);
        if (waitingHostName && hostPlayer) {
          waitingHostName.textContent = hostPlayer.name;
        }
        if (waitingRoomCodeVal && (roomCode || this.network.roomCode)) {
          waitingRoomCodeVal.textContent = roomCode || this.network.roomCode;
        }
        const waitingNotice = window.I18N ? window.I18N.t('mp_waiting_status_text') : "Host hasn't started the game yet. Please wait...";
        if (waitingStatusText) {
          waitingStatusText.textContent = waitingNotice;
        }
        const waitingOwnerNotice = document.getElementById('waitingOwnerNotice');
        if (waitingOwnerNotice) {
          waitingOwnerNotice.textContent = waitingNotice;
        }
      } else {
        // HOST / ODA KURUCU GÖRÜNÜMÜ: Sekmeler ve Oda Kurma Alanı Kesinlikle Açık Kalır!
        if (roomTabsBar) {
          roomTabsBar.classList.remove('hidden');
          roomTabsBar.style.display = 'grid';
        }
        if (createRoomContent) {
          createRoomContent.classList.remove('hidden');
          createRoomContent.style.display = 'block';
        }
        if (waitingRoomContent) {
          waitingRoomContent.classList.add('hidden');
          waitingRoomContent.style.display = 'none';
        }

        if (lobbyList) {
          lobbyList.innerHTML = '';
          players.forEach((p) => {
            const youHostTag = p.isHost ? (window.I18N ? ' (' + window.I18N.t('you') + ')' : ' (You)') : '';
            const leaderBadge = window.I18N ? window.I18N.t('mp_badge_leader') : 'LEADER';
            const readyBadge = window.I18N ? window.I18N.t('mp_badge_ready') : 'READY';
            const li = document.createElement('li');
            li.className = p.isHost ? 'lobby-item is-host' : 'lobby-item';
            li.innerHTML = `
              <span class="lobby-player-icon">${p.isHost ? '👑' : '🟢'}</span>
              <span class="lobby-player-name">${this.escapeHtml(p.name)}${youHostTag}</span>
              <span class="lobby-ready-badge ${p.isHost ? 'leader' : ''}">${p.isHost ? leaderBadge : readyBadge}</span>
            `;
            lobbyList.appendChild(li);
          });
        }
        if (lobbyCount) lobbyCount.textContent = players.length.toString();

        if (startRoomGameBtnText) {
          if (players.length > 1) {
            startRoomGameBtnText.textContent = window.I18N ? window.I18N.t('mp_start_btn_count', { count: players.length }) : `START GAME (Start with ${players.length} Players) 🚀`;
          } else {
            startRoomGameBtnText.textContent = window.I18N ? window.I18N.t('mp_start_btn') : 'START GAME 🚀';
          }
        }
        if (lobbyStatusBadge) {
          const playersReadyText = window.I18N ? (window.I18N.currentLang === 'tr' ? `🟢 ${players.length} Oyuncu Hazır` : `🟢 ${players.length} Players Ready`) : `🟢 ${players.length} Players Ready`;
          const lobbyOpenText = window.I18N ? window.I18N.t('mp_lobby_status_open') : '🟢 Lobby Open';
          lobbyStatusBadge.textContent = players.length > 1 ? playersReadyText : lobbyOpenText;
        }
      }
    };

    // NetworkManager Lobi Güncelleme Callback
    this.network.onLobbyUpdated = (players, roomCode) => {
      renderLobbyPlayers(players, roomCode);
    };

    const clientRetryJoinBtn = document.getElementById('clientRetryJoinBtn');
    const WAITING_MSG = window.I18N ? window.I18N.t('mp_waiting_status_text') : "Host hasn't started the game yet. Please wait...";

    // Bağlanma denemesi sırasında durum yazısını canlı güncelle (1/3, 2/3, 3/3)
    this.network.onJoinStatus = (msg) => {
      const statusEl = document.getElementById('waitingStatusText');
      const noticeEl = document.getElementById('waitingOwnerNotice');
      if (statusEl) statusEl.textContent = msg;
      if (noticeEl) noticeEl.textContent = msg;
    };

    // Odaya katılma (hem buton hem davet linki aynı akışı kullanır)
    this.startClientJoin = (code) => {
      this.lastJoinCode = code;
      if (clientRetryJoinBtn) clientRetryJoinBtn.classList.add('hidden');

      return this.network.joinRoom(code).then(() => {
        const statusEl = document.getElementById('waitingStatusText');
        const noticeEl = document.getElementById('waitingOwnerNotice');
        if (statusEl) statusEl.textContent = WAITING_MSG;
        if (noticeEl) noticeEl.textContent = WAITING_MSG;
        sounds.playSpecial();
      }).catch(() => {
        const statusEl = document.getElementById('waitingStatusText');
        const noticeEl = document.getElementById('waitingOwnerNotice');
        if (statusEl) statusEl.textContent = window.I18N ? (window.I18N.currentLang === 'tr' ? '⚠️ Oda sahibine bağlanılamadı.' : '⚠️ Could not connect to host.') : '⚠️ Could not connect to host.';
        if (noticeEl) noticeEl.textContent = window.I18N ? window.I18N.t('net_timeout_msg') : 'Could not reach host. Please verify the host has the game open and room active, then click "Reconnect".';
        if (clientRetryJoinBtn) clientRetryJoinBtn.classList.remove('hidden');
        throw new Error('join failed');
      });
    };

    if (clientRetryJoinBtn) {
      clientRetryJoinBtn.addEventListener('click', () => {
        if (this.lastJoinCode) {
          this.startClientJoin(this.lastJoinCode).catch(() => {});
        }
      });
    }

    // Arkadaşlarla Oyna butonuna basıldığında (HER ZAMAN KESİNLİKLE ODA KUR SEKMESİ İLE AÇILIR)
    if (openFriendsRoomBtn && multiplayerModal) {
      openFriendsRoomBtn.addEventListener('click', () => {
        this.network.isHost = true; // KESİNLİKLE İLK ANDAN İTİBAREN HOST MODUNA AL
        multiplayerModal.classList.remove('hidden');
        multiplayerModal.style.display = 'flex';
        if (roomTabsBar) {
          roomTabsBar.classList.remove('hidden');
          roomTabsBar.style.display = 'grid';
        }

        // Sekmeleri sıfırla: KESİNLİKLE ODA KUR AÇILIR, ODAYA KATIL ASLA İLK AÇILMAZ!
        if (tabCreateRoom) tabCreateRoom.classList.add('active');
        if (tabJoinRoom) tabJoinRoom.classList.remove('active');

        if (createRoomContent) {
          createRoomContent.classList.remove('hidden');
          createRoomContent.style.display = 'block';
        }
        if (joinRoomContent) {
          joinRoomContent.classList.add('hidden');
          joinRoomContent.style.display = 'none';
        }
        if (waitingRoomContent) {
          waitingRoomContent.classList.add('hidden');
          waitingRoomContent.style.display = 'none';
        }

        // Odada botlar düğmesi varsayılan olarak her zaman kapalı olsun
        const botsToggle = document.getElementById('botsInRoomToggle');
        if (botsToggle) botsToggle.checked = false;

        const roomLinkInput = document.getElementById('roomLinkInput');
        const myName = this.getPlayerName();
        if (hostPlayerNameLobby) hostPlayerNameLobby.textContent = `${myName} (Sen - Lider)`;

        // 4 Haneli oda kodunu beklemeden anında üret ve hemen ekranda göster (Asla 'Kod üretiliyor...'da takılı kalmaz!)
        const roomCode = this.network.roomCode || this.network.generateRoomCode();
        this.network.roomCode = roomCode;

        if (myRoomCodeEl) {
          myRoomCodeEl.textContent = roomCode;
        }
        if (roomLinkInput) {
          roomLinkInput.value = this.getInviteLink(roomCode);
        }
        if (lobbyStatusBadge) {
          lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_connecting') : '🟡 Connecting...';
          lobbyStatusBadge.className = 'lobby-live-badge waiting';
        }
        renderLobbyPlayers(this.network.getLobbyList(), roomCode);

        if (!this.network.isHost || !this.network.peer || this.network.peer.destroyed || this.network.peer.disconnected || this.network.roomCode !== roomCode) {
          this.network.createRoom(roomCode).then(code => {
            if (myRoomCodeEl) myRoomCodeEl.textContent = code;
            if (roomLinkInput) roomLinkInput.value = this.getInviteLink(code);
            if (lobbyStatusBadge) {
              lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_open') : '🟢 Lobby Open';
              lobbyStatusBadge.className = 'lobby-live-badge';
            }
            renderLobbyPlayers(this.network.getLobbyList(), code);
          }).catch(() => {
            if (lobbyStatusBadge) {
              lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_retry') : '⚠️ Try Again';
              lobbyStatusBadge.className = 'lobby-live-badge waiting';
            }
          });
        } else {
          if (lobbyStatusBadge) {
            lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_open') : '🟢 Lobby Open';
            lobbyStatusBadge.className = 'lobby-live-badge';
          }
        }
      });
    }

    // Modal Kapatma (Çarpı)
    if (closeMultiplayerBtn && multiplayerModal) {
      closeMultiplayerBtn.addEventListener('click', () => {
        multiplayerModal.classList.add('hidden');
        multiplayerModal.style.display = 'none';
        if (this.network.isMultiplayer && !this.network.isHost && this.state !== 'PLAYING') {
          this.network.disconnect();
        }
      });
    }

    // Dışarıya tıklandığında kapat
    if (multiplayerModal) {
      multiplayerModal.addEventListener('click', (e) => {
        if (e.target === multiplayerModal) {
          multiplayerModal.classList.add('hidden');
          multiplayerModal.style.display = 'none';
          if (this.network.isMultiplayer && !this.network.isHost && this.state !== 'PLAYING') {
            this.network.disconnect();
          }
        }
      });
    }

    // 1. Oda Kodunu Kopyala
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        if (this.network.roomCode) {
          navigator.clipboard.writeText(this.network.roomCode);
          copyCodeBtn.textContent = window.I18N ? window.I18N.t('mp_code_copied') : '✓ Copied!';
          setTimeout(() => { copyCodeBtn.textContent = window.I18N ? window.I18N.t('mp_copy_code_btn') : '📋 Copy Code'; }, 2000);
          const copyMsg = window.I18N ? window.I18N.t('alert_code_copied_msg', { code: this.network.roomCode }) : `Room code copied to clipboard: ${this.network.roomCode}`;
          const copyTitle = window.I18N ? window.I18N.t('alert_code_copied_title') : '📋 CODE COPIED';
          window.showInGameAlert(copyMsg, 'success', copyTitle);
        }
      });
    }

    // 2. Web Katılım Linkini Paylaş (Telefonun Kendi Yerel Sistem Paylaşım Arayüzü / Bottom Sheet)
    if (copyRoomLinkBtn) {
      copyRoomLinkBtn.addEventListener('click', async () => {
        const roomCode = this.network.roomCode;
        if (!roomCode) {
          window.showInGameAlert(
            window.I18N ? window.I18N.t('alert_code_preparing') : 'Room code is being generated, please wait...',
            'warning'
          );
          return;
        }
        const inviteUrl = this.getInviteLink(roomCode);

        // A) Android Uygulama İçi: Doğrudan telefonun yerel sistem paylaşım penceresini aç
        if (window.AndroidApp && typeof window.AndroidApp.shareRoomLink === 'function') {
          try {
            window.AndroidApp.shareRoomLink(roomCode, inviteUrl);
            return;
          } catch (e) {
            console.warn('Android native share failed:', e);
          }
        }

        // B) Tarayıcı / iOS / Sistem Paylaşım API'si
        if (navigator.share) {
          try {
            const isTr = window.I18N && window.I18N.currentLang === 'tr';
            await navigator.share({
              title: isTr ? 'Neon Yılan: Worm Clash - Solucan & Yılan Savaşı' : 'Neon Yılan: Worm Clash - Snake & Worm Battle',
              text: isTr
                ? `🎮 Neon Yılan: Worm Clash odama davetlisin!\nOda Kodu: ${roomCode}\nTek tıkla savaşa katıl 👇\n`
                : `🎮 You're invited to my Neon Yılan: Worm Clash room!\nRoom Code: ${roomCode}\nJoin the battle with one click 👇\n`,
              url: inviteUrl
            });
            return;
          } catch (err) {
            if (err && err.name === 'AbortError') return;
          }
        }

        // C) Masaüstü Tarayıcı Fallback: Panoya Kopyala
        const copyFallback = () => {
          copyRoomLinkBtn.textContent = window.I18N ? window.I18N.t('mp_code_copied') : '✓ Copied!';
          setTimeout(() => { copyRoomLinkBtn.textContent = window.I18N ? window.I18N.t('mp_share_btn') : '📤 Share'; }, 2000);
          window.showInGameAlert(
            window.I18N ? window.I18N.t('alert_link_copied_msg') : 'Room link copied to clipboard!',
            'success',
            window.I18N ? window.I18N.t('alert_link_copied_title') : '🔗 LINK COPIED'
          );
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(inviteUrl).then(copyFallback).catch(() => {
            const roomLinkInput = document.getElementById('roomLinkInput');
            if (roomLinkInput) {
              roomLinkInput.select();
              document.execCommand('copy');
              copyFallback();
            }
          });
        } else {
          copyFallback();
        }
      });
    }

    // Sekme Geçişleri (Oda Kur / Odaya Katıl)
    if (tabCreateRoom && tabJoinRoom && createRoomContent && joinRoomContent) {
      tabCreateRoom.addEventListener('click', () => {
        tabCreateRoom.classList.add('active');
        tabJoinRoom.classList.remove('active');
        createRoomContent.classList.remove('hidden');
        createRoomContent.style.display = 'block';
        joinRoomContent.classList.add('hidden');
        joinRoomContent.style.display = 'none';
        if (waitingRoomContent) {
          waitingRoomContent.classList.add('hidden');
          waitingRoomContent.style.display = 'none';
        }

        const roomCode = this.network.roomCode || this.network.generateRoomCode();
        this.network.roomCode = roomCode;

        if (myRoomCodeEl) myRoomCodeEl.textContent = roomCode;
        const roomLinkInput = document.getElementById('roomLinkInput');
        if (roomLinkInput) roomLinkInput.value = this.getInviteLink(roomCode);

        if (!this.network.isHost || !this.network.peer || this.network.peer.destroyed || this.network.peer.disconnected || this.network.roomCode !== roomCode) {
          if (lobbyStatusBadge) {
            lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_connecting') : '🟡 Connecting...';
            lobbyStatusBadge.className = 'lobby-live-badge waiting';
          }
          this.network.createRoom(roomCode).then(code => {
            if (myRoomCodeEl) myRoomCodeEl.textContent = code;
            if (roomLinkInput) roomLinkInput.value = this.getInviteLink(code);
            if (lobbyStatusBadge) {
              lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_open') : '🟢 Lobby Open';
              lobbyStatusBadge.className = 'lobby-live-badge';
            }
            renderLobbyPlayers(this.network.getLobbyList(), code);
          }).catch(() => {
            if (lobbyStatusBadge) {
              lobbyStatusBadge.textContent = window.I18N ? window.I18N.t('mp_lobby_status_retry') : '⚠️ Try Again';
              lobbyStatusBadge.className = 'lobby-live-badge waiting';
            }
          });
        }
      });

      tabJoinRoom.addEventListener('click', () => {
        tabJoinRoom.classList.add('active');
        tabCreateRoom.classList.remove('active');
        joinRoomContent.classList.remove('hidden');
        joinRoomContent.style.display = 'block';
        createRoomContent.classList.add('hidden');
        createRoomContent.style.display = 'none';
        if (waitingRoomContent) {
          waitingRoomContent.classList.add('hidden');
          waitingRoomContent.style.display = 'none';
        }

        // Önceki oda sahibi oturumunu kapat ki temiz bir istemci olarak odaya katılabilsin
        if (this.network.isHost) {
          this.network.disconnect();
        }

        const joinPlayerNameInput = document.getElementById('joinPlayerNameInput');
        if (joinPlayerNameInput) {
          joinPlayerNameInput.value = this.getPlayerName();
        }
        const savedRoomCode = this.lastRoomCode || localStorage.getItem('worm_last_room_code') || '';
        if (joinRoomCodeInput && !joinRoomCodeInput.value && savedRoomCode) {
          joinRoomCodeInput.value = savedRoomCode;
        }
      });
    }

    // ==================== ODA SAHİBİ: ARENAYI BAŞLAT ====================
    // Oda kuran kişi 'ARENAYI BAŞLAT' dediğinde, odadaki tüm arkadaşları eş zamanlı başlatır
    if (startRoomGameBtn) {
      startRoomGameBtn.addEventListener('click', () => {
        const includeBots = botsInRoomToggle ? botsInRoomToggle.checked : false;
        this.network.startRoomGame(includeBots);
      });
    }

    // ==================== ARKADAŞ: ODAYA KATIL & BEKLEMEYE GEÇ ====================
    if (joinRoomSubmitBtn && joinRoomCodeInput && joinStatusMsg) {
      joinRoomSubmitBtn.addEventListener('click', () => {
        const joinPlayerNameInput = document.getElementById('joinPlayerNameInput');
        let customName = joinPlayerNameInput ? joinPlayerNameInput.value.trim() : '';

        // İsim kontrolü: Kullanıcı adı boşsa varsayılan adı ata, isim kısıtlaması yapma (herkes hızlıca katılabilsin)
        if (!customName || customName.length < 1) {
          customName = this.getPlayerName() || (window.I18N ? window.I18N.t('player_default') : 'Player');
        }
        if (joinPlayerNameInput) joinPlayerNameInput.value = customName;

        // Oyuncu adını kaydet ve ana isim alanıyla senkronize et
        localStorage.setItem('worm_player_name', customName);
        const mainNameInput = document.getElementById('playerNameInput');
        if (mainNameInput) mainNameInput.value = customName;

        const code = joinRoomCodeInput.value.trim();
        if (!code) {
          joinRoomCodeInput.focus();
          joinStatusMsg.textContent = window.I18N ? window.I18N.t('mp_err_code_required') : '⚠️ Please enter the 4-digit room code!';
          return;
        }

        // Son katıldığı odayı hafızaya al (kullanıcı ana menüye çıksa dahi tekrar katılabilsin)
        this.lastRoomCode = code;
        try { localStorage.setItem('worm_last_room_code', code); } catch (e) {}

        // Eğer önceden oda kurduysa onu iptal et, temiz istemci olarak bağlan
        if (this.network.isHost) {
          this.network.disconnect();
        }

        // Doğrudan bekleme odası ekranına geçir
        if (roomTabsBar) roomTabsBar.classList.add('hidden');
        if (createRoomContent) createRoomContent.classList.add('hidden');
        if (joinRoomContent) joinRoomContent.classList.add('hidden');
        if (waitingRoomContent) waitingRoomContent.classList.remove('hidden');

        if (waitingRoomCodeVal) waitingRoomCodeVal.textContent = code;
        const waitingNotice = window.I18N ? window.I18N.t('mp_waiting_notice_text') : 'The host has not started the game yet, but you are in the waiting room.';
        if (waitingStatusText) waitingStatusText.textContent = waitingNotice;
        const waitingOwnerNotice = document.getElementById('waitingOwnerNotice');
        if (waitingOwnerNotice) waitingOwnerNotice.textContent = waitingNotice;

        const hostNameText = window.I18N ? window.I18N.t('mp_waiting_host_name') : 'Room Host';
        const leaderBadge = window.I18N ? window.I18N.t('mp_badge_leader') : 'LEADER';
        const youText = window.I18N ? window.I18N.t('you') : 'You';
        const connectingBadge = window.I18N ? window.I18N.t('mp_badge_connecting') : 'CONNECTING';

        if (clientLobbyList) {
          clientLobbyList.innerHTML = `
            <li class="lobby-item is-host">
              <span class="lobby-player-icon">👑</span>
              <span class="lobby-player-name">${hostNameText}</span>
              <span class="lobby-ready-badge leader">${leaderBadge}</span>
            </li>
            <li class="lobby-item">
              <span class="lobby-player-icon">🟢</span>
              <span class="lobby-player-name">${this.escapeHtml(customName)} (${youText})</span>
              <span class="lobby-ready-badge" id="myLobbyBadge">${connectingBadge}</span>
            </li>
          `;
        }
        if (clientLobbyCount) clientLobbyCount.textContent = '...';

        joinStatusMsg.textContent = '';
        joinRoomSubmitBtn.disabled = true;

        this.startClientJoin(code).then(() => {
          joinRoomSubmitBtn.disabled = false;
        }).catch(() => {
          joinRoomSubmitBtn.disabled = false;
        });
      });
    }

    // İstemci Bekleme Odasından Ayrıl Butonu
    if (clientLeaveRoomBtn) {
      clientLeaveRoomBtn.addEventListener('click', () => {
        this.network.disconnect();
        if (waitingRoomContent) waitingRoomContent.classList.add('hidden');
        if (roomTabsBar) roomTabsBar.classList.remove('hidden');
        if (tabJoinRoom) tabJoinRoom.click();
        if (window.showInGameAlert) {
          const alertMsg = window.I18N ? window.I18N.t('alert_left_room_msg') : 'You left the room.';
          const alertTitle = window.I18N ? window.I18N.t('alert_left_room_title') : '🚪 LEFT ROOM';
          window.showInGameAlert(alertMsg, 'info', alertTitle);
        }
      });
    }

    const exitToMenuBtn = document.getElementById('exitToMenuBtn');
    if (exitToMenuBtn) {
      exitToMenuBtn.addEventListener('click', () => {
        this.returnToMenu();
      });
    }
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.applyBoostPosition();
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.initCanvasSize();
        this.applyBoostPosition();
      }, 150);
    });

    // UI Elemanlarına dokunma / tıklama tespiti (Yılanın UI butonlarına doğru yönlenmesini kesin engeller)
    const isUiTouch = (clientX, clientY) => {
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return false;
      try {
        const el = document.elementFromPoint(clientX, clientY);
        if (el && el.closest('.boost-control-container, .hud-top, .in-game-emotes, .emote-bubble-btn, .minimap-container, button, .modal-backdrop, .modal-dialog, .game-toast-container, .event-banner')) {
          return true;
        }
      } catch (err) {}

      // Ekstra Güvenlik: UI kapsayıcılarının koordinat sınırlarını kontrol et
      const checkRect = (selector, padding = 10) => {
        const elem = document.querySelector(selector);
        if (!elem) return false;
        const rect = elem.getBoundingClientRect();
        return (
          clientX >= rect.left - padding &&
          clientX <= rect.right + padding &&
          clientY >= rect.top - padding &&
          clientY <= rect.bottom + padding
        );
      };

      if (checkRect('#inGameEmotes', 12)) return true;
      if (checkRect('.boost-control-container', 12)) return true;
      if (checkRect('.minimap-container', 8)) return true;
      if (checkRect('.hud-top', 6)) return true;

      return false;
    };

    // Farenin veya ekran noktasının yılanın kafasına göre 360° hedefini belirle (Slither.io / Wormate tarzı)
    const updateSteeringFromScreenPos = (clientX, clientY) => {
      if (!this.player || (this.state !== 'PLAYING' && this.state !== 'DYING')) return;
      // UI elemanlarına (emojiler, butonlar, harita) tıklandığında veya dokunulduğunda yılanın o yöne gitmesini kesinlikle engelle!
      if (isUiTouch(clientX, clientY)) return;

      const playerScreenX = this.player.x - this.camera.x;
      const playerScreenY = this.player.y - this.camera.y;

      const dx = clientX - playerScreenX;
      const dy = clientY - playerScreenY;
      if (dx * dx + dy * dy > 576) { // > 24px fare mesafesi (kafa üstündeyken yön titremesini önler)
        this.player.targetAngle = Math.atan2(dy, dx);
      }
    };

    // Klavye (WASD ve Ok Tuşları) ile Yönlendirme (Tarayıcı / Masaüstü için)
    const activeKeys = new Set();
    const updateKeyboardSteering = () => {
      if (!this.player || (this.state !== 'PLAYING' && this.state !== 'DYING')) return;
      let kx = 0;
      let ky = 0;
      if (activeKeys.has('KeyW') || activeKeys.has('ArrowUp')) ky -= 1;
      if (activeKeys.has('KeyS') || activeKeys.has('ArrowDown')) ky += 1;
      if (activeKeys.has('KeyA') || activeKeys.has('ArrowLeft')) kx -= 1;
      if (activeKeys.has('KeyD') || activeKeys.has('ArrowRight')) kx += 1;

      if (kx !== 0 || ky !== 0) {
        this.player.targetAngle = Math.atan2(ky, kx);
      }
    };

    window.addEventListener('keydown', (e) => {
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        activeKeys.add(e.code);
        updateKeyboardSteering();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        activeKeys.delete(e.code);
        updateKeyboardSteering();
      }
    });

    // ==================== SANAL JOYSTICK (MOBİL VE DOKUNMATİK TAM DESTEK) ====================
    let activeJoystickTouchId = null;

    const startJoystickAt = (clientX, clientY, touchId) => {
      if (isUiTouch(clientX, clientY)) return;
      activeJoystickTouchId = touchId;
      this.joystick.active = true;

      const controlMode = (this.settings && this.settings.controlMode) || 'dynamic';

      if (controlMode === 'fixed') {
        const fixedX = 85;
        const fixedY = window.innerHeight - 95;
        this.joystick.startX = fixedX;
        this.joystick.startY = fixedY;
        this.joystickBase.style.left = `${fixedX}px`;
        this.joystickBase.style.top = `${fixedY}px`;
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        this.joystickBase.classList.remove('hidden');
      } else if (controlMode === 'direct') {
        this.joystick.startX = clientX;
        this.joystick.startY = clientY;
        this.joystickBase.classList.add('hidden');
        updateSteeringFromScreenPos(clientX, clientY);
      } else {
        // dynamic: Dokunulan noktada anında belirir
        this.joystick.startX = clientX;
        this.joystick.startY = clientY;
        this.joystickBase.style.left = `${clientX}px`;
        this.joystickBase.style.top = `${clientY}px`;
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        this.joystickBase.classList.remove('hidden');
      }
    };

    const moveJoystickAt = (clientX, clientY) => {
      if (!this.player) return;

      const controlMode = (this.settings && this.settings.controlMode) || 'dynamic';

      if (controlMode === 'direct' || !this.joystick.active) {
        updateSteeringFromScreenPos(clientX, clientY);
        return;
      }

      const dx = clientX - this.joystick.startX;
      const dy = clientY - this.joystick.startY;
      const dist = Math.hypot(dx, dy);
      const maxR = 48;

      if (dist > 3) {
        const angle = Math.atan2(dy, dx);
        this.player.targetAngle = angle;

        const clampedDist = Math.min(dist, maxR);
        const thumbX = Math.cos(angle) * clampedDist;
        const thumbY = Math.sin(angle) * clampedDist;
        this.joystickThumb.style.transform = `translate(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px))`;

        // Parmağın çok uzağa kayması durumunda joystick merkezini hafifçe takip ettir (Dinamik Konfor)
        if (controlMode === 'dynamic' && dist > maxR * 1.6) {
          const excess = dist - maxR * 1.6;
          this.joystick.startX += Math.cos(angle) * excess;
          this.joystick.startY += Math.sin(angle) * excess;
          this.joystickBase.style.left = `${this.joystick.startX}px`;
          this.joystickBase.style.top = `${this.joystick.startY}px`;
        }
      }
    };

    const stopJoystick = () => {
      activeJoystickTouchId = null;
      this.joystick.active = false;
      const controlMode = (this.settings && this.settings.controlMode) || 'dynamic';
      if (controlMode !== 'fixed') {
        this.joystickBase.classList.add('hidden');
      } else {
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
      }
    };

    // ==================== DOKUNMATİK ETKİNLİKLERİ (TOUCH EVENTS - MOBİL) ====================
    const handleTouchStart = (e) => {
      if (this.state !== 'PLAYING') return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (isUiTouch(t.clientX, t.clientY)) continue;

        if (activeJoystickTouchId === null) {
          e.preventDefault();
          startJoystickAt(t.clientX, t.clientY, t.identifier);
          break;
        }
      }
    };

    const handleTouchMove = (e) => {
      if (this.state !== 'PLAYING' || !this.player || activeJoystickTouchId === null) return;

      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        if (t.identifier === activeJoystickTouchId) {
          e.preventDefault();
          moveJoystickAt(t.clientX, t.clientY);
          break;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (activeJoystickTouchId === null) return;

      let touchEnded = false;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeJoystickTouchId) {
          touchEnded = true;
          break;
        }
      }
      if (touchEnded || e.touches.length === 0) {
        stopJoystick();
      }
    };

    // Dokunmatik dinleyicilerini joystick alanına ve canvasa bağla
    this.joystickZone.addEventListener('touchstart', handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

    // TouchMove ve TouchEnd window üzerinde dinlenir (parmak ekran kenarına kaysa bile kontrol kopmaz!)
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // ==================== FARE KONTROLLERİ (MOUSE EVENTS - TARAYICI & MASAÜSTÜ) ====================
    window.addEventListener('mousemove', (e) => {
      // Eğer mobilde dokunmatik joystick aktifse veya UI elemanına dokunuluyorsa yılanın yönünü bozma
      if (activeJoystickTouchId !== null || this.state !== 'PLAYING' || !this.player) return;
      if (isUiTouch(e.clientX, e.clientY)) return;
      updateSteeringFromScreenPos(e.clientX, e.clientY);
    });

    // Masaüstü fare sol tık ile Turbo Hızlanma (Slither.io klasiği)
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || this.state !== 'PLAYING' || !this.player || activeJoystickTouchId !== null) return;
      if (this.boostState === 'READY') {
        this.startTurboBoost();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button !== 0 || activeJoystickTouchId !== null) return;
      if (this.boostState === 'BOOSTING') {
        this.stopTurboBoost();
      }
    });

    // Turbo Hızlanma (Tek Dokunuşla Başlatma & Dairesel Sayaç)
    const onBoostToggle = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!this.player || this.player.isDead) return;

      if (this.boostState === 'BOOSTING') {
        this.stopTurboBoost();
      } else if (this.boostState === 'COOLDOWN') {
        this.vibrate(15);
      } else {
        this.startTurboBoost();
      }
    };

    this.boostBtn.addEventListener('click', onBoostToggle);
    this.boostBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onBoostToggle(e);
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.key === 'Shift') && !e.repeat) {
        onBoostToggle();
      }
    });

    // Oyun İçi Emoji Tepki Butonları (Dokunulduğunda veya tıklandığında yılan ASLA butonun olduğu yere yönlenmez!)
    const inGameEmotes = document.getElementById('inGameEmotes');
    if (inGameEmotes) {
      const stopAll = (e) => {
        if (e) {
          e.stopPropagation();
        }
      };
      inGameEmotes.addEventListener('touchstart', (e) => { e.stopPropagation(); }, { passive: false });
      inGameEmotes.addEventListener('touchmove', (e) => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
      inGameEmotes.addEventListener('touchend', (e) => { e.stopPropagation(); }, { passive: false });
      inGameEmotes.addEventListener('pointerdown', stopAll);
      inGameEmotes.addEventListener('pointermove', stopAll);
      inGameEmotes.addEventListener('pointerup', stopAll);
      inGameEmotes.addEventListener('mousedown', stopAll);
    }

    document.querySelectorAll('.emote-bubble-btn').forEach(btn => {
      const triggerEmote = (e) => {
        if (e) {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
        }
        const emoji = btn.dataset.emote;
        if (emoji) {
          this.sendEmote(emoji);
        }
      };

      btn.addEventListener('touchstart', (e) => {
        triggerEmote(e);
      }, { passive: false });
      btn.addEventListener('touchmove', (e) => {
        if (e && e.cancelable) e.preventDefault();
        if (e) e.stopPropagation();
      }, { passive: false });
      btn.addEventListener('touchend', (e) => {
        if (e) e.stopPropagation();
      }, { passive: false });
      btn.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
      btn.addEventListener('pointermove', (e) => { e.stopPropagation(); });
      btn.addEventListener('pointerup', (e) => { e.stopPropagation(); });
      btn.addEventListener('mousedown', (e) => { e.stopPropagation(); });
      btn.addEventListener('click', (e) => {
        triggerEmote(e);
      });
    });

    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => this.startGame(true));
    }

    const respawnBtn = document.getElementById('respawnBtn');
    if (respawnBtn) {
      respawnBtn.addEventListener('click', () => {
        if (this.network.isMultiplayer && !this.network.isHost) {
          this.network.requestRespawn();
          const alertMsg = window.I18N ? window.I18N.t('alert_respawn_requested_msg') : 'Respawn request sent...';
          const alertTitle = window.I18N ? window.I18N.t('alert_respawn_requested_title') : '🔄 RESPAWN';
          window.showInGameAlert(alertMsg, 'info', alertTitle);
        } else if (this.network.isMultiplayer && this.network.isHost) {
          const skin = SKINS[this.selectedSkinIndex] || SKINS[0];
          const rx = Math.round(this.worldWidth / 2 + (Math.random() - 0.5) * 600);
          const ry = Math.round(this.worldHeight / 2 + (Math.random() - 0.5) * 600);
          this.player = new Worm(rx, ry, this.getPlayerName(), skin, false);
          this.player.peerId = 'host';
          this.player.ghostTimer = 0;
          this.player.hat = this.equippedHat;
          this.gameOverScreen.classList.add('hidden');
          if (this.joystickZone) this.joystickZone.classList.remove('hidden');
          this.state = 'PLAYING';
        } else {
          this.startGame(true);
        }
      });
    }

    const gameOverReturnMenuBtn = document.getElementById('gameOverReturnMenuBtn');
    if (gameOverReturnMenuBtn) {
      gameOverReturnMenuBtn.addEventListener('click', () => {
        if (this.network && this.network.isMultiplayer) {
          this.network.disconnect();
        }
        this.returnToMenu();
      });
    }

    const gameOverHomeBtn = document.getElementById('gameOverHomeBtn');
    if (gameOverHomeBtn) {
      gameOverHomeBtn.addEventListener('click', () => {
        this.returnToMenu();
      });
    }

    // Game Over Penceresindeki Sağ Üst Çarpı (✕) Butonu (Doğrudan Ana Menüye Döndürür)
    const closeGameOverBtn = document.getElementById('closeGameOverBtn');
    if (closeGameOverBtn) {
      closeGameOverBtn.addEventListener('click', () => {
        if (this.network && this.network.isMultiplayer) {
          this.network.disconnect();
        }
        this.returnToMenu();
      });
    }

    // Zafer Ekranı Butonları (20.000 Puan Şampiyonluk)
    const victoryPlayAgainBtn = document.getElementById('victoryPlayAgainBtn');
    if (victoryPlayAgainBtn) {
      victoryPlayAgainBtn.addEventListener('click', () => {
        const victoryScreen = document.getElementById('victoryScreen');
        if (victoryScreen) {
          victoryScreen.classList.add('hidden');
          victoryScreen.style.display = 'none';
        }
        if (this.network && this.network.isMultiplayer) {
          if (this.network.isHost) {
            this.network.startRoomGame();
          } else {
            if (this.network.hostConn && this.network.isConnReady(this.network.hostConn)) {
              this.network.hostConn.send({ type: 'PLAYER_RESPAWN' });
            } else {
              this.startGame(true);
            }
          }
        } else {
          this.startGame(true);
        }
      });
    }

    const victoryHomeBtn = document.getElementById('victoryHomeBtn');
    if (victoryHomeBtn) {
      victoryHomeBtn.addEventListener('click', () => {
        if (this.network && this.network.isMultiplayer) {
          this.network.disconnect();
        }
        this.returnToMenu();
      });
    }

    const closeVictoryBtn = document.getElementById('closeVictoryBtn');
    if (closeVictoryBtn) {
      closeVictoryBtn.addEventListener('click', () => {
        if (this.network && this.network.isMultiplayer) {
          this.network.disconnect();
        }
        this.returnToMenu();
      });
    }

    // Oyun İçi Renkli Bildirim Kapatma (✕) Butonu
    const toastDismissBtn = document.getElementById('toastDismissBtn');
    if (toastDismissBtn) {
      toastDismissBtn.addEventListener('click', () => {
        const toastCard = document.getElementById('gameToastCard');
        if (toastCard) {
          toastCard.classList.add('toast-hiding');
          setTimeout(() => toastCard.classList.add('hidden'), 250);
        }
      });
    }

    const prevSkinBtn = document.getElementById('prevSkinBtn');
    if (prevSkinBtn) {
      prevSkinBtn.addEventListener('click', () => {
        this.selectedSkinIndex = (this.selectedSkinIndex - 1 + SKINS.length) % SKINS.length;
        this.drawSkinPreview();
        sounds.playTurn();
      });
    }

    const nextSkinBtn = document.getElementById('nextSkinBtn');
    if (nextSkinBtn) {
      nextSkinBtn.addEventListener('click', () => {
        this.selectedSkinIndex = (this.selectedSkinIndex + 1) % SKINS.length;
        this.drawSkinPreview();
        sounds.playTurn();
      });
    }

    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isSound = sounds.toggleSound();
        const soundIconOn = document.getElementById('soundIconOn');
        const soundIconOff = document.getElementById('soundIconOff');
        if (soundIconOn) soundIconOn.classList.toggle('hidden', !isSound);
        if (soundIconOff) soundIconOff.classList.toggle('hidden', isSound);
        const menuSoundBtn = document.getElementById('menuSoundBtn');
        if (menuSoundBtn) menuSoundBtn.textContent = isSound ? '🔊' : '🔇';
      });
    }

    const menuSoundBtn = document.getElementById('menuSoundBtn');
    if (menuSoundBtn) {
      menuSoundBtn.addEventListener('click', () => {
        const isSound = sounds.toggleSound();
        menuSoundBtn.textContent = isSound ? '🔊' : '🔇';
        const soundIconOn = document.getElementById('soundIconOn');
        const soundIconOff = document.getElementById('soundIconOff');
        if (soundIconOn) soundIconOn.classList.toggle('hidden', !isSound);
        if (soundIconOff) soundIconOff.classList.toggle('hidden', isSound);
      });
    }

    // Oyun İçi Çıkış (✕) Butonu ve Onay Penceresi (Kullanıcı İsteği: Onay sorulup evet denirse ana menüye döner)
    const exitGameBtn = document.getElementById('exitGameBtn');
    const exitConfirmModal = document.getElementById('exitConfirmModal');
    const confirmExitBtn = document.getElementById('confirmExitBtn');
    const cancelExitBtn = document.getElementById('cancelExitBtn');

    if (exitGameBtn && exitConfirmModal) {
      const showExitModal = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        exitConfirmModal.classList.remove('hidden');
        exitConfirmModal.style.display = 'flex';
      };
      exitGameBtn.addEventListener('click', showExitModal);
      exitGameBtn.addEventListener('touchend', showExitModal);
    }

    if (confirmExitBtn && exitConfirmModal) {
      const handleConfirmExit = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        exitConfirmModal.classList.add('hidden');
        exitConfirmModal.style.display = 'none';
        this.returnToMenu();
      };
      confirmExitBtn.addEventListener('click', handleConfirmExit);
      confirmExitBtn.addEventListener('touchend', handleConfirmExit);
    }

    if (cancelExitBtn && exitConfirmModal) {
      const handleCancelExit = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        exitConfirmModal.classList.add('hidden');
        exitConfirmModal.style.display = 'none';
      };
      cancelExitBtn.addEventListener('click', handleCancelExit);
      cancelExitBtn.addEventListener('touchend', handleCancelExit);
    }
  }

  // Arkadaşlara gönderilecek doğrudan web katılım linki
  getInviteLink(code) {
    const defaultPublicUrl = 'https://doguyazilim.github.io/worm-arena';

    // Eğer halihazırda canlı bir web sitesi veya GitHub Pages üzerindeyse o anki adresi kullan
    if (window.location.protocol === 'https:' || (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.hostname.startsWith('10.') && !window.location.hostname.startsWith('192.168.'))) {
      const cleanPath = window.location.pathname.replace(/\/index\.html$/, '');
      const basePath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';
      return `${window.location.origin}${basePath}?oda=${code}`;
    }

    // Android APK, yerel dosya veya emülatördeyse GitHub Pages linkini ver
    return `${defaultPublicUrl}/?oda=${code}`;
  }

  // Sayfa açıldığında URL parametresinde (?oda=8532 veya #oda=8532 veya #8532) varsa ÖNCE kullanıcıdan ismini iste, sonra Bekleme Odasına Bağlan
  checkUrlRoomInvite() {
    try {
      let roomCode = null;
      if (typeof window !== 'undefined') {
        if (window.location.search) {
          const params = new URLSearchParams(window.location.search);
          roomCode = params.get('oda') || params.get('room') || params.get('code');
        }
        if (!roomCode && window.location.hash) {
          const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
          if (rawHash) {
            const hashParams = new URLSearchParams(rawHash);
            roomCode = hashParams.get('oda') || hashParams.get('room') || hashParams.get('code');
            if (!roomCode && /^[0-9a-zA-Z]{4,6}$/.test(rawHash)) {
              roomCode = rawHash;
            }
          }
        }
      }

      if (roomCode && String(roomCode).trim().length > 0) {
        const cleanCode = String(roomCode).trim().replace(/[^0-9a-zA-Z]/g, '');
        if (!cleanCode) return;

        const inviteModal = document.getElementById('inviteNameModal');
        const inviteBadge = document.getElementById('inviteModalRoomBadge');
        const inviteInput = document.getElementById('invitePlayerNameInput');
        const inviteError = document.getElementById('inviteNameErrorMsg');
        const inviteSubmitBtn = document.getElementById('inviteJoinSubmitBtn');

        if (inviteBadge) inviteBadge.textContent = `#${cleanCode}`;

        // Kayıtlı geçerli bir isim varsa doldur, ama varsayılan Oyuncu_XXX ise boş bırak ki isim yazmaya zorlasın
        let existingName = (typeof localStorage !== 'undefined' ? localStorage.getItem('worm_player_name') : '') || '';
        if (existingName.startsWith('Oyuncu_') || existingName.startsWith('Player_')) {
          existingName = '';
        }
        if (inviteInput) {
          inviteInput.value = existingName;
        }

        // Davet İsim Modalını Aç (Kullanıcıyı isim yazmaya zorla)
        if (inviteModal) {
          inviteModal.classList.remove('hidden');
          inviteModal.style.display = 'flex';
          setTimeout(() => {
            if (inviteInput) inviteInput.focus();
          }, 350);
        }

        const proceedToRoom = () => {
          const typedName = inviteInput ? inviteInput.value.trim() : '';
          if (!typedName || typedName.length < 2) {
            if (inviteError) inviteError.textContent = window.I18N ? window.I18N.t('mp_err_name_required') : '⚠️ Please enter your name! Cannot join without a name.';
            if (inviteInput) {
              inviteInput.focus();
              inviteInput.classList.add('input-error-shake');
              setTimeout(() => inviteInput.classList.remove('input-error-shake'), 500);
            }
            return;
          }

          // Geçerli isim yazıldı, kaydet
          this.customPlayerName = typedName;
          if (this.network) {
            this.network.customPlayerName = typedName;
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('worm_player_name', typedName);
          }
          const mainNameInput = document.getElementById('playerNameInput');
          if (mainNameInput) mainNameInput.value = typedName;
          const joinPlayerNameInput = document.getElementById('joinPlayerNameInput');
          if (joinPlayerNameInput) joinPlayerNameInput.value = typedName;

          if (inviteModal) {
            inviteModal.classList.add('hidden');
            inviteModal.style.display = 'none';
          }

          // Şimdi odaya katılma ve bekleme odası ekranını göster
          this.connectToInviteRoom(cleanCode, typedName);
        };

        if (inviteSubmitBtn) {
          inviteSubmitBtn.onclick = (e) => {
            e.preventDefault();
            proceedToRoom();
          };
        }

        if (inviteInput) {
          inviteInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              proceedToRoom();
            }
          };
          inviteInput.oninput = () => {
            if (inviteError) inviteError.textContent = '';
          };
        }
      }
    } catch (e) {
      console.warn('URL room invite check failed:', e);
    }
  }

  // İsim girildikten sonra bekleme odasını açıp odaya bağlanma
  connectToInviteRoom(cleanCode, playerName) {
    this.customPlayerName = playerName;
    if (this.network) {
      this.network.customPlayerName = playerName;
    }

    const tryJoin = (attempts = 0) => {
      if (typeof Peer === 'undefined' && attempts < 30) {
        setTimeout(() => tryJoin(attempts + 1), 200);
        return;
      }

      const multiplayerModal = document.getElementById('multiplayerModal');
      const roomTabsBar = document.getElementById('roomTabsBar');
      const createRoomContent = document.getElementById('createRoomTabContent');
      const joinRoomContent = document.getElementById('joinRoomTabContent');
      const waitingRoomContent = document.getElementById('waitingRoomTabContent');
      const waitingRoomCodeVal = document.getElementById('waitingRoomCodeVal');
      const waitingStatusText = document.getElementById('waitingStatusText');
      const waitingOwnerNotice = document.getElementById('waitingOwnerNotice');
      const clientLobbyList = document.getElementById('clientLobbyList');
      const clientLobbyCount = document.getElementById('clientLobbyCount');
      const joinRoomCodeInput = document.getElementById('joinRoomCodeInput');

      if (joinRoomCodeInput) joinRoomCodeInput.value = cleanCode;

      // Bekleme odasını aç
      if (multiplayerModal) {
        multiplayerModal.classList.remove('hidden');
        multiplayerModal.style.display = 'flex';
      }
      if (roomTabsBar) roomTabsBar.classList.add('hidden');
      if (createRoomContent) createRoomContent.classList.add('hidden');
      if (joinRoomContent) joinRoomContent.classList.add('hidden');
      if (waitingRoomContent) waitingRoomContent.classList.remove('hidden');

      if (waitingRoomCodeVal) waitingRoomCodeVal.textContent = cleanCode;
      if (waitingStatusText) waitingStatusText.textContent = window.I18N ? window.I18N.t('mp_connecting_to_host') : 'Connecting to room host...';
      if (waitingOwnerNotice) waitingOwnerNotice.textContent = window.I18N ? window.I18N.t('mp_searching_host') : 'Searching for host, please wait...';

      const hostNameText = window.I18N ? window.I18N.t('mp_waiting_host_name') : 'Room Host';
      const leaderBadge = window.I18N ? window.I18N.t('mp_badge_leader') : 'LEADER';
      const youText = window.I18N ? window.I18N.t('you') : 'You';
      const connectingBadge = window.I18N ? window.I18N.t('mp_badge_connecting') : 'CONNECTING';

      if (clientLobbyList) {
        clientLobbyList.innerHTML = `
          <li class="lobby-item is-host">
            <span class="lobby-player-icon">👑</span>
            <span class="lobby-player-name">${hostNameText}</span>
            <span class="lobby-ready-badge leader">${leaderBadge}</span>
          </li>
          <li class="lobby-item">
            <span class="lobby-player-icon">🟢</span>
            <span class="lobby-player-name">${this.escapeHtml(playerName)} (${youText})</span>
            <span class="lobby-ready-badge" id="myLobbyBadge">${connectingBadge}</span>
          </li>
        `;
      }
      if (clientLobbyCount) clientLobbyCount.textContent = '...';

      if (window.showInGameAlert) {
        const title = window.I18N ? window.I18N.t('alert_connecting_room_title') : '🎮 JOINING ROOM';
        const msg = window.I18N ? window.I18N.t('alert_connecting_room_msg', { code: cleanCode }) : `Connecting to room #${cleanCode}...`;
        window.showInGameAlert(msg, 'info', title);
      }

      if (this.network.isHost) {
        this.network.disconnect();
      }

      this.startClientJoin(cleanCode).catch(() => {});
    };
    tryJoin(0);
  }

  startLoop() {
    let lastTime = performance.now();
    const targetDt = 1000 / 60; // 16.666ms sabit 60 FPS fizik adımı (120Hz/144Hz ekranlarda yılanın 2 kat hızlanmasını %100 engeller)
    let accumulator = 0;

    const loop = (currentTime) => {
      const now = (typeof currentTime === 'number' && currentTime > 0) ? currentTime : performance.now();
      let frameTime = now - lastTime;
      lastTime = now;
      if (frameTime > 100) frameTime = 100; // Sekme arka plana atıldığında biriken süreyi sınırla

      accumulator += frameTime;
      while (accumulator >= targetDt) {
        this.update();
        accumulator -= targetDt;
      }

      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Oyunu Başlat (DOMContentLoaded kaçırılsa dahi garantili başlatan kontrol)
function startWormArenaApp() {
  try {
    if (!window.game) {
      window.game = new WormArenaGame();
      window.game.startLoop();
    }
  } catch (err) {
    console.error('WormArena init error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startWormArenaApp);
} else {
  startWormArenaApp();
}
