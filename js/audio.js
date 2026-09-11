// Procedural Audio Engine using Web Audio API (Zero external assets, synthesized client-side in browser)

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.boostOsc = null;
    this.boostGain = null;
    this.boostFilter = null;
    this.isBoostPlaying = false;
    
    // Load volume and mute preferences
    this.muted = (localStorage.getItem('slyth_muted') ?? localStorage.getItem('slither_muted')) === 'true';
    this.volume = parseFloat(localStorage.getItem('slyth_volume') ?? localStorage.getItem('slither_volume') ?? '0.4');
    
    // Combo tracker for ascending eat chimes
    this.lastEatTime = 0;
    this.comboCount = 0;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      this.initBoostSound();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  initBoostSound() {
    if (!this.ctx) return;
    
    // Low rumble oscillator with lowpass filter for boost whoosh
    this.boostOsc = this.ctx.createOscillator();
    this.boostOsc.type = 'sawtooth';
    this.boostOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
    
    this.boostFilter = this.ctx.createBiquadFilter();
    this.boostFilter.type = 'lowpass';
    this.boostFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
    this.boostFilter.Q.setValueAtTime(3, this.ctx.currentTime);
    
    this.boostGain = this.ctx.createGain();
    this.boostGain.gain.setValueAtTime(0, this.ctx.currentTime);
    
    this.boostOsc.connect(this.boostFilter);
    this.boostFilter.connect(this.boostGain);
    this.boostGain.connect(this.masterGain);
    
    this.boostOsc.start();
  }

  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem('slyth_muted', this.muted);
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : this.volume, now + 0.05);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('slyth_volume', this.volume);
    if (this.masterGain && this.ctx && !this.muted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
    }
  }

  playEat(massValue = 1) {
    if (!this.ctx || this.muted) return;
    this.init();

    const now = this.ctx.currentTime;
    // Scale pitch based on recent eats combo
    if (now - this.lastEatTime < 0.25) {
      this.comboCount = Math.min(this.comboCount + 1, 16);
    } else {
      this.comboCount = 0;
    }
    this.lastEatTime = now;

    const baseFreq = 480 + (this.comboCount * 32) + Math.min(massValue * 8, 200);
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  startBoost() {
    if (!this.ctx || this.isBoostPlaying || this.muted) return;
    this.init();
    if (!this.boostGain) return;

    this.isBoostPlaying = true;
    const now = this.ctx.currentTime;
    this.boostGain.gain.cancelScheduledValues(now);
    this.boostGain.gain.linearRampToValueAtTime(0.22, now + 0.12);
  }

  stopBoost() {
    if (!this.ctx || !this.isBoostPlaying) return;
    if (!this.boostGain) return;

    this.isBoostPlaying = false;
    const now = this.ctx.currentTime;
    this.boostGain.gain.cancelScheduledValues(now);
    this.boostGain.gain.linearRampToValueAtTime(0, now + 0.15);
  }

  playDeath() {
    if (!this.ctx || this.muted) return;
    this.init();

    const now = this.ctx.currentTime;

    // 1. White noise blast
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.38);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // 2. Sub bass thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    noiseSource.start(now);
    osc.start(now);
    noiseSource.stop(now + 0.4);
    osc.stop(now + 0.4);
  }

  playKill() {
    if (!this.ctx || this.muted) return;
    this.init();

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  playPreyCaught() {
    if (!this.ctx || this.muted) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

}

export const sound = new AudioEngine();
