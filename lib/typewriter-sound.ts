type BurstOptions = {
  freq: number;
  noiseGain: number;
  toneGain: number;
  duration: number;
  filterFreq: number;
  filterQ: number;
};

class TypewriterSound {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = false;

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      const size = Math.floor(ctx.sampleRate * 0.2);
      const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  private burst(ctx: AudioContext, { freq, noiseGain, toneGain, duration, filterFreq, filterQ }: BurstOptions) {
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFreq;
    filter.Q.value = filterQ;
    const noiseEnv = ctx.createGain();
    noiseEnv.gain.setValueAtTime(noiseGain, now);
    noiseEnv.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter).connect(noiseEnv).connect(ctx.destination);
    src.start(now);
    src.stop(now + duration);

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;
    const oscEnv = ctx.createGain();
    oscEnv.gain.setValueAtTime(toneGain, now);
    oscEnv.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);
    osc.connect(oscEnv).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  /** A single key strike. */
  key() {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.burst(ctx, { freq: 190, noiseGain: 0.6, toneGain: 0.12, duration: 0.045, filterFreq: 2600, filterQ: 1.4 });
  }

  /** The space bar - same sound as any other key. */
  space() {
    this.key();
  }

  /** A missed keystroke - a soft, muted thud rather than a harsh buzzer. */
  error() {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.12);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.22, now + 0.008);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(env).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 450;
    const noiseEnv = ctx.createGain();
    noiseEnv.gain.setValueAtTime(0.12, now);
    noiseEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    src.connect(filter).connect(noiseEnv).connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.07);
  }

  /** Carriage-return bell for finishing a lesson. */
  bell() {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    this.burst(ctx, { freq: 70, noiseGain: 0.5, toneGain: 0.1, duration: 0.08, filterFreq: 800, filterQ: 1 });

    [2200, 3300].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const env = ctx.createGain();
      const start = now + 0.09;
      env.gain.setValueAtTime(0, start);
      env.gain.linearRampToValueAtTime(i === 0 ? 0.2 : 0.08, start + 0.01);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
      osc.connect(env).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.6);
    });
  }

  /** A lesson finished with zero errors - a bright ascending four-note chime. */
  success() {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const start = now + i * 0.09;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, start);
      env.gain.linearRampToValueAtTime(0.22, start + 0.015);
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(env).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }
}

export const typewriterSound = new TypewriterSound();
