// 100% Procedural Horror Audio Engine
// Generates soundscapes in real-time using Web Audio API

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceNodes: AudioNode[] = [];
  private isMuted: boolean = false;
  private initialized: boolean = false;

  constructor() {
    // Lazy initialization handled in init()
  }

  // Initialize the audio context (must be called after user interaction)
  init() {
    if (this.initialized) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5; // Default volume
    this.masterGain.connect(this.ctx.destination);
    
    this.initialized = true;
    this.startDarkAmbience();
  }

  toggleMute() {
    if (!this.ctx || !this.masterGain) return;
    this.isMuted = !this.isMuted;
    
    // Smooth fade
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.5, now, 0.1);
    
    return this.isMuted;
  }

  // 1. THE VOID (Dark Ambient Drone)
  private startDarkAmbience() {
    if (!this.ctx || !this.masterGain) return;

    // Deep drone 1 (55Hz)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 55;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.value = 120;
    
    const gain1 = this.ctx.createGain();
    gain1.gain.value = 0.15;

    // LFO for movement
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.1; // Slow breathing
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 40; // Filter modulation depth
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter1.frequency);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.masterGain);
    
    osc1.start();
    lfo.start();
    this.ambienceNodes.push(osc1, filter1, gain1, lfo, lfoGain);

    // Unsettling high pitch (Binaural dissonance)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 110; // Slightly dissonant
    
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 114; // Beat frequency of 4Hz (Theta waves - fear)

    const gain2 = this.ctx.createGain();
    gain2.gain.value = 0.02; // Very quiet

    osc2.connect(gain2);
    osc3.connect(gain2);
    gain2.connect(this.masterGain);

    osc2.start();
    osc3.start();
    this.ambienceNodes.push(osc2, osc3, gain2);
  }

  // 2. UI INTERACTION (High Tech Click)
  playClick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(t + 0.06);
  }

  // 3. DATA STREAM (Computing Noise)
  playDataStream() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Burst of random bleeps
    for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        const freq = 1000 + Math.random() * 2000;
        const offset = Math.random() * 0.2;
        
        osc.frequency.setValueAtTime(freq, t + offset);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.05, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.03);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(t + offset);
        osc.stop(t + offset + 0.04);
    }
  }

  // 4. INCOMING MESSAGE (Heavy Impact)
  playIncomingMessage() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Sub-bass thud
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    // White noise burst (Snare-like)
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    noise.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start();
    osc.stop(t + 0.8);
    noise.start();
    noise.stop(t + 0.2);
  }

  // 5. SYSTEM GLITCH (Distorted Noise)
  playGlitch() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.1);
    osc.frequency.linearRampToValueAtTime(50, t + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(400);
    distortion.oversample = '4x';

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(t + 0.3);
  }

  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }
}

export const audio = new AudioEngine();