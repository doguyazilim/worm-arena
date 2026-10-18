// Web Audio API Tabanlı Gelişmiş Ses Efekt ve Fon Müziği Motoru
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.volume = 0.5;
    this.musicVolume = 0.28;

    // Fon Müziği Durumu
    this.isMusicPlaying = false;
    this.musicTimer = null;
    this.nextNoteTime = 0;
    this.currentStep = 0;
    this.musicGainNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.ctx && !this.musicGainNode) {
      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(this.enabled ? this.musicVolume : 0, this.ctx.currentTime);
      this.musicGainNode.connect(this.ctx.destination);
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.musicGainNode && this.ctx) {
      const targetGain = (this.enabled && this.bgmEnabled) ? this.musicVolume : 0;
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
    if (this.enabled && this.bgmEnabled && !this.isMusicPlaying) {
      this.startMenuMusic();
    }
    return this.enabled;
  }

  setSfxEnabled(val) {
    this.sfxEnabled = !!val;
  }

  setBgmEnabled(val) {
    this.bgmEnabled = !!val;
    if (!this.bgmEnabled) {
      this.stopMenuMusic();
    } else if (this.enabled && !this.isMusicPlaying) {
      this.startMenuMusic();
    }
  }

  // ==================== CANLI SENTEZ FON MÜZİĞİ (SYNTHWAVE ARCADE) ====================
  startMenuMusic() {
    if (!this.enabled || !this.bgmEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    if (this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(this.enabled ? this.musicVolume : 0, this.ctx.currentTime + 0.8);
    }

    const tempo = 124; // Enerjik retro arcade temposu (BPM)
    const stepDuration = 60 / tempo / 4; // 16'lık nota süresi

    // Akor Dizilimi: Am -> F -> C -> G (Klasik bağımlılık yapan arcade döngüsü)
    // 32 Adımlık (2 Ölçü) Melodi ve Bas Tablosu
    const bassNotes = [
      // 1-8: Am
      110.00, 110.00, 220.00, 110.00, 164.81, 110.00, 220.00, 130.81,
      // 9-16: F
      87.31, 87.31, 174.61, 87.31, 130.81, 87.31, 174.61, 110.00,
      // 17-24: C
      130.81, 130.81, 261.63, 130.81, 196.00, 130.81, 261.63, 164.81,
      // 25-32: G
      98.00, 98.00, 196.00, 98.00, 146.83, 98.00, 196.00, 123.47
    ];

    const leadNotes = [
      // Am
      440.00, 523.25, 659.25, 523.25, 880.00, 659.25, 523.25, 659.25,
      // F
      349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 523.25, 659.25,
      // C
      523.25, 659.25, 783.99, 659.25, 1046.50, 783.99, 659.25, 783.99,
      // G
      392.00, 493.88, 587.33, 783.99, 587.33, 493.88, 587.33, 659.25
    ];

    const scheduleNotes = () => {
      if (!this.isMusicPlaying || !this.ctx) return;

      while (this.nextNoteTime < this.ctx.currentTime + 0.25) {
        const step = this.currentStep % 32;
        const time = this.nextNoteTime;

        // 1. Bas Sintizayzırı (Derin, Tok ve Ritmik)
        if (bassNotes[step]) {
          this.playBgmBass(bassNotes[step], time, stepDuration * 0.85);
        }

        // 2. Melodik Arpej Sentezleyici (Parlak Neon Sesler)
        if (leadNotes[step]) {
          this.playBgmLead(leadNotes[step], time, stepDuration * 0.6);
        }

        // 3. Hafif Ritmik Perküsyon / Hi-hat Fısıltısı
        if (step % 2 === 0) {
          this.playBgmHiHat(time, step % 4 === 2);
        }

        this.currentStep++;
        this.nextNoteTime += stepDuration;
      }

      this.musicTimer = setTimeout(scheduleNotes, 50);
    };

    scheduleNotes();
  }

  stopMenuMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, this.ctx.currentTime);
      this.musicGainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
    }
  }

  playBgmBass(freq, time, dur) {
    if (!this.musicGainNode || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, time);
      filter.frequency.exponentialRampToValueAtTime(140, time + dur);

      gain.gain.setValueAtTime(0.32, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  playBgmLead(freq, time, dur) {
    if (!this.musicGainNode || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  playBgmHiHat(time, isAccent = false) {
    if (!this.musicGainNode || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 3800 : 2600, time);

      const dur = 0.035;
      gain.gain.setValueAtTime(isAccent ? 0.06 : 0.03, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      osc.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  // ==================== OYUN İÇİ SES EFEKTLERİ (SFX) ====================
  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.3, slideTo = null) {
    if (!this.enabled || !this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (slideTo !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playEat() {
    if (!this.enabled || !this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playSpecial() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.12, 0.3);
      }, idx * 50);
    });
  }

  playCoin() {
    if (!this.enabled) return;
    this.playTone(987.77, 'sine', 0.08, 0.3, 1318.51);
  }

  playWheelTick() {
    if (!this.enabled) return;
    this.playTone(600 + Math.random() * 200, 'triangle', 0.03, 0.15);
  }

  playWheelWin() {
    if (!this.enabled) return;
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    fanfare.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.35), i * 80);
    });
  }

  playVictory() {
    if (!this.enabled) return;
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    fanfare.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.45), i * 90);
    });
  }

  playLevelUp() {
    if (!this.enabled) return;
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73];
    arpeggio.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.25, 0.4), i * 70);
    });
  }

  playEmote() {
    if (!this.enabled) return;
    this.playTone(700, 'sine', 0.15, 0.25, 1200);
  }

  playMagnet() {
    if (!this.enabled) return;
    this.playTone(280, 'sawtooth', 0.2, 0.15, 450);
  }

  playGhost() {
    if (!this.enabled) return;
    this.playTone(850, 'sine', 0.3, 0.25, 300);
  }

  playDie() {
    if (!this.enabled || !this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  playTurn() {
    this.playTone(180, 'sine', 0.04, 0.08);
  }

  playClick() {
    this.playTone(650, 'sine', 0.04, 0.18, 900);
  }
}

const sounds = new SoundSystem();
