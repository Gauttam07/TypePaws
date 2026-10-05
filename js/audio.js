/**
 * TypePaws - Web Audio Synthesizer
 * Generates crisp mechanical switch clacks, funny cartoon mistake sounds,
 * pleasant streak chimes, and victory fanfares completely in-browser.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.5;
    this.soundTheme = 'mechanical'; // 'mechanical' | 'cartoon' | 'bubble'
    this.initDone = false;
  }

  init() {
    if (this.initDone) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initDone = true;
      }
    } catch (e) {
      console.warn("Web Audio not available:", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(val) {
    this.muted = !!val;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val) || 0.5));
  }

  setTheme(theme) {
    if (['mechanical', 'cartoon', 'bubble', 'off'].includes(theme)) {
      this.soundTheme = theme;
    }
  }

  /**
   * Sound on correct keypress
   */
  playKeyClick(char = '') {
    if (this.muted || this.soundTheme === 'off') return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (this.soundTheme === 'bubble') {
      // Gentle water drop / bubble pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 500 + Math.random() * 250;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      return;
    }

    if (this.soundTheme === 'cartoon') {
      // Cute marimba / soft chime tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const pitches = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
      const freq = pitches[Math.floor(Math.random() * pitches.length)];

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
      return;
    }

    // Default: Crisp mechanical switch clack (Blue / Brown switch aesthetic)
    // Layer 1: High crisp snap (filtered noise or high impulse)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Subtle pitch variance per key
    const freq = 1200 + (char.charCodeAt(0) % 20) * 40;
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(2.5, now);

    // Layer 2: Thump (body bottoming out)
    const thump = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(160, now);
    thump.frequency.exponentialRampToValueAtTime(40, now + 0.035);

    thumpGain.gain.setValueAtTime(this.volume * 0.2, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    gain.gain.setValueAtTime(this.volume * 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    thump.connect(thumpGain);
    thumpGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
    thump.start(now);
    thump.stop(now + 0.04);
  }

  /**
   * Sound on wrong keypress (funny, brief cartoon boop/squeak)
   */
  playError() {
    if (this.muted || this.soundTheme === 'off') return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Funny cartoon "bonk" / spring pitch slide down
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Pitch drops from 340Hz down to 140Hz with a slight spring wobble
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    // Gentle low-pass filter to keep it comical and pleasant (not harsh or grating!)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(this.volume * 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Streak / Combo sound (every 25 clean keystrokes)
   */
  playStreakChime() {
    if (this.muted || this.soundTheme === 'off') return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 880.00]; // D5, A5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(this.volume * 0.25, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.16);
    });
  }

  /**
   * Victory Fanfare on Lesson Completion!
   */
  playVictory() {
    if (this.muted || this.soundTheme === 'off') return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Playful, cheerful 5-note arpeggio: C5 -> E5 -> G5 -> B5 -> C6
    const melody = [
      { f: 523.25, t: 0.0,  d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.12 },
      { f: 987.77, t: 0.36, d: 0.14 },
      { f: 1046.50, t: 0.50, d: 0.45 }
    ];

    melody.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(this.volume * 0.3, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }
}

// Global instance
window.soundEngine = new SoundEngine();
