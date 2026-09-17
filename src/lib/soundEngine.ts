/**
 * High-Fidelity Web Audio Synthesizer Engine
 * Generates tactile mechanical sounds, coin physics, sub-bass drops, and win harmonies
 * with zero external mp3 file dependencies.
 */

class GreedSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMuted(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Tactile UI button click
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  /**
   * High-speed coin spin ratchet in air
   */
  public playSpin(durationSeconds: number = 1.6) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const clicksCount = 18;
    for (let i = 0; i < clicksCount; i++) {
      const t = now + (i / clicksCount) * durationSeconds * 0.9;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      // Metallic micro-pitch jitter
      const baseFreq = 2200 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.02);

      const vol = 0.08 + (i / clicksCount) * 0.08;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.03);
    }
  }

  /**
   * Heavy metallic thud on obsidian pedestal
   */
  public playImpact() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub-bass thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.25);

    // High metal snap
    const metalOsc = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metalOsc.type = "square";
    metalOsc.frequency.setValueAtTime(1800, now);
    metalOsc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

    metalGain.gain.setValueAtTime(0.2, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    metalOsc.connect(metalGain);
    metalGain.connect(ctx.destination);

    metalOsc.start(now);
    metalOsc.stop(now + 0.08);
  }

  /**
   * Ascending harmonic win fanfare tuned to multiplier tier
   */
  public playWin(multiplier: number) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies based on power of 2 tier
    const baseFreqs = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    const tier = Math.min(Math.round(Math.log2(multiplier)), baseFreqs.length - 1);
    const root = baseFreqs[tier] || 523.25;

    const chords = [root, root * 1.25, root * 1.5, root * 2.0];

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.65);
    });
  }

  /**
   * Visceral low pitch drop + flatline on bust
   */
  public playBust() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pitch dive
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // Flatline sub tone
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(55, now + 0.3);
    subGain.gain.setValueAtTime(0.4, now + 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    sub.connect(subGain);
    subGain.connect(ctx.destination);

    sub.start(now + 0.3);
    sub.stop(now + 1.1);
  }

  /**
   * Shimmering casino cash-out cascade
   */
  public playCashOut() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.45);
    });
  }

  /**
   * Resonant bronze tribute gong + coin fanfare
   */
  public playTributeGong() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Deep bronze gong fundamental
    const gongOsc = ctx.createOscillator();
    const gongGain = ctx.createGain();
    gongOsc.type = "sine";
    gongOsc.frequency.setValueAtTime(110, now);
    gongOsc.frequency.exponentialRampToValueAtTime(108, now + 2.0);

    gongGain.gain.setValueAtTime(0.6, now);
    gongGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    gongOsc.connect(gongGain);
    gongGain.connect(ctx.destination);

    gongOsc.start(now);
    gongOsc.stop(now + 2.2);

    // Shimmering overtone
    const overtone = ctx.createOscillator();
    const overGain = ctx.createGain();
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(329.63, now);

    overGain.gain.setValueAtTime(0.3, now);
    overGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    overtone.connect(overGain);
    overGain.connect(ctx.destination);

    overtone.start(now);
    overtone.stop(now + 1.4);
  }
}

export const soundEngine = new GreedSoundEngine();
