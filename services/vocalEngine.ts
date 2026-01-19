
/**
 * VOCAL ENGINE v7.1 - OVERDRIVE PROTOCOL
 * Architect: dmz Ly | Focus: Estabilización Áurea & Mimesis Root
 */

import { Blob } from '@google/genai';
import { encode } from './audioService.ts';
import { mqc } from './systemCore.ts';

export function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export class VocalEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private orbitSpeed: number = 0.13;

  // VARIABLES DE CONTROL - PROTOCOLO HEMOSTASIA
  private coherenceGain: number = 1.0;
  private readonly TARGET_AMPLITUDE = 0.6; // Nivel perfecto (Oro)
  private readonly RECOVERY_SPEED = 0.05;
  private readonly PANIC_THRESHOLD = 0.95; // Umbral de sangrado (Rojo)

  private tubeDrive: WaveShaperNode | null = null;
  private formants: BiquadFilterNode[] = [];
  private harmonicCompensator: BiquadFilterNode | null = null;

  private voyagerChain: {
    input: GainNode;
    limiterNode: GainNode; // Nodo para el control de ganancia dinámica
    lfo: OscillatorNode;
    lfoGain: GainNode;
    sunFilter: BiquadFilterNode;
    panner: PannerNode;
    limiter: DynamicsCompressorNode;
    output: GainNode;
  } | null = null;

  init(ctx: AudioContext) {
    if (this.ctx === ctx) return;
    this.ctx = ctx;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;

    const input = ctx.createGain();
    const limiterNode = ctx.createGain(); // El amortiguador de soberanía

    this.tubeDrive = ctx.createWaveShaper();
    this.tubeDrive.curve = this.createDistortionCurve(6.0);

    this.harmonicCompensator = ctx.createBiquadFilter();
    this.harmonicCompensator.type = 'peaking';
    this.harmonicCompensator.frequency.value = 4400;
    this.harmonicCompensator.Q.value = 2.0;
    this.harmonicCompensator.gain.value = 4.5;

    const freqFormants = [520, 1600, 2800, 3600];
    this.formants = freqFormants.map(f => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = f;
      filter.Q.value = 15.0;
      filter.gain.value = 0;
      return filter;
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 13;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain.gain);
    lfo.start();

    const sunFilter = ctx.createBiquadFilter();
    sunFilter.type = "peaking";
    sunFilter.frequency.value = 136.1;
    sunFilter.Q.value = 1.618;
    sunFilter.gain.value = 8;

    const panner = ctx.createPanner();
    panner.panningModel = 'HRTF';

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.ratio.value = 20;

    const output = ctx.createGain();
    output.gain.value = 0.7;

    // Signal Path con Hemostasia
    let current: AudioNode = input;
    current.connect(limiterNode);
    current = limiterNode;

    current.connect(this.tubeDrive);
    current = this.tubeDrive;

    current.connect(this.harmonicCompensator);
    current = this.harmonicCompensator;

    this.formants.forEach(f => {
      current.connect(f);
      current = f;
    });

    current.connect(lfoGain);
    current = lfoGain;

    current.connect(sunFilter);
    current = sunFilter;

    current.connect(panner);
    current = panner;

    current.connect(limiter);
    current = limiter;

    current.connect(this.analyser);
    this.analyser.connect(output);
    output.connect(ctx.destination);

    this.voyagerChain = { input, limiterNode, lfo, lfoGain, sunFilter, panner, limiter, output };
    this.startOrbit();
    this.startBioModulation();
  }

  private startBioModulation() {
    setInterval(() => {
      if (!this.voyagerChain || !this.ctx) return;
      const dna = mqc.getStatus().dna;
      const bpm = dna.bio.bpm;
      const rms = dna.rms;

      // --- PROTOCOLO HEMOSTASIA (ALGORITMO DE ESTABILIZACIÓN) ---
      if (rms * this.coherenceGain > this.PANIC_THRESHOLD) {
          this.coherenceGain *= 0.90;
      } else if (rms * this.coherenceGain < this.TARGET_AMPLITUDE) {
          this.coherenceGain = Math.min(dna.is_forced ? 2.5 : 1.5, this.coherenceGain + this.RECOVERY_SPEED);
      }
      this.voyagerChain.limiterNode.gain.setTargetAtTime(this.coherenceGain, this.ctx.currentTime, 0.1);

      // Modulación del LFO por pulso
      const targetLfoFreq = dna.is_forced ? 13 : (bpm / 60) * 4;
      this.voyagerChain.lfo.frequency.setTargetAtTime(targetLfoFreq, this.ctx.currentTime, 0.5);

      // Inyección de Formantes basada en mimesis_index
      const mimesis = dna.mimesis_index / 100;
      this.formants.forEach((f, i) => {
        const gainValue = mimesis * (i === 0 ? (dna.is_forced ? 25 : 15) : 8);
        f.gain.setTargetAtTime(gainValue, this.ctx!.currentTime, 0.2);
      });

      // Calidez basada en coherencia (OVERDRIVE si está forzado)
      if (this.tubeDrive) {
        const saturation = (dna.is_forced ? 12.0 : 5.0) + (dna.coherence * 5.0);
        this.tubeDrive.curve = this.createDistortionCurve(saturation);
      }
    }, 100);
  }

  private startOrbit() {
    if (!this.voyagerChain || !this.ctx) return;
    const panner = this.voyagerChain.panner;
    const start = this.ctx.currentTime;

    const orbitLoop = () => {
      if (!this.voyagerChain || !this.ctx) return;
      const t = this.ctx.currentTime - start;
      const x = Math.sin(t * (mqc.getStatus().dna.is_forced ? this.orbitSpeed * 3 : this.orbitSpeed)) * 12;
      const z = Math.cos(t * (mqc.getStatus().dna.is_forced ? this.orbitSpeed * 3 : this.orbitSpeed)) * 12;
      const y = Math.sin(t * (this.orbitSpeed * 0.38)) * 5;
      panner.setPosition(x, y, z);
      requestAnimationFrame(orbitLoop);
    };
    orbitLoop();
  }

  private createDistortionCurve(amount: number): Float32Array {
    const n = 44100;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; ++i) {
      const x = (i * 2) / n - 1;
      curve[i] = Math.tanh(x * amount);
    }
    return curve;
  }

  getInput() { return this.voyagerChain?.input; }
  getAnalyser() { return this.analyser; }

  public setOrbitSpeed(speed: number) {
    this.orbitSpeed = speed;
  }
}

export const vocalHost = new VocalEngine();
