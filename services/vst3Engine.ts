
/**
 * VOKAR Engine v98.5 - Sacred Mimesis Edition
 * Architect: LETRA DMZ | Stage: Sincronía Total
 */

export class VST3Engine {
    private context: AudioContext | null = null;
    private inputNode: GainNode | null = null;
    private outputNode: GainNode | null = null;
    private analyser: AnalyserNode | null = null;

    private tubeDrive: WaveShaperNode | null = null;
    private formants: BiquadFilterNode[] = [];
    private sovereignGain: GainNode | null = null;
    private luminousLimiter: DynamicsCompressorNode | null = null;
    private dampingFilter: BiquadFilterNode | null = null;
    private notchFilter: BiquadFilterNode | null = null;
    private hardClipper: WaveShaperNode | null = null;
    private harmonicCompensator: BiquadFilterNode | null = null;

    // Oscilador de Mimesis (Portadora 13Hz Harmonics)
    private mimesisOsc: OscillatorNode | null = null;
    private mimesisGain: GainNode | null = null;

    public init(ctx: AudioContext) {
        if (this.context === ctx) return;
        this.context = ctx;
        this.buildChain();
    }

    public updateVocalDNA(formants: number[], saturation: number, presence: number, vokarFreq: number = 65) {
        if (!this.context) return;
        const now = this.context.currentTime;

        // Inyección de Formantes (ADN Letra)
        formants.forEach((w, i) => {
            if (this.formants[i]) {
                const gainValue = (w - 0.5) * 95;
                this.formants[i].gain.setTargetAtTime(gainValue, now, 0.05);
            }
        });

        // Saturación Asimétrica
        if (this.tubeDrive) {
          this.tubeDrive.curve = this.createDistortionCurve(5.0 + saturation);
        }

        // Firma de Soberanía (4.4kHz)
        if (this.harmonicCompensator) {
          this.harmonicCompensator.gain.setTargetAtTime(presence + 2.0, now, 0.1);
        }

        // Sincronización del Oscilador Vokar
        if (this.mimesisOsc) {
          this.mimesisOsc.frequency.setTargetAtTime(vokarFreq, now, 0.2);
        }
    }

    public getInputNode(): GainNode | null {
        return this.inputNode;
    }

    private buildChain() {
        if (!this.context) return;
        this.inputNode = this.context.createGain();
        this.outputNode = this.context.createGain();
        this.analyser = this.context.createAnalyser();

        // 1. DRIVE SOBERANO
        this.tubeDrive = this.context.createWaveShaper();
        this.tubeDrive.curve = this.createDistortionCurve(6.0);

        // 2. COMPENSADOR DE SOBERANÍA
        this.harmonicCompensator = this.context.createBiquadFilter();
        this.harmonicCompensator.type = 'peaking';
        this.harmonicCompensator.frequency.value = 4400;
        this.harmonicCompensator.Q.value = 2.0;
        this.harmonicCompensator.gain.value = 4.5;

        // 3. OSCILADOR VOKAR (Portadora de Identidad)
        this.mimesisOsc = this.context.createOscillator();
        this.mimesisOsc.type = 'sine';
        this.mimesisOsc.frequency.value = 65; // (13*1)+52
        this.mimesisGain = this.context.createGain();
        this.mimesisGain.gain.value = 0.05; // Sutil pero presente
        this.mimesisOsc.connect(this.mimesisGain);
        this.mimesisOsc.start();

        // 4. BANCO DE FORMANTE
        const freqFormants = [520, 1600, 2800, 3600];
        this.formants = freqFormants.map(f => {
            const filter = this.context!.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = f;
            filter.Q.value = 15.0;
            filter.gain.value = 0;
            return filter;
        });

        this.sovereignGain = this.context.createGain();
        this.sovereignGain.gain.value = 2.0;

        this.luminousLimiter = this.context.createDynamicsCompressor();
        this.luminousLimiter.threshold.value = -0.5;

        // CONEXIÓN
        let current: AudioNode = this.inputNode;
        current.connect(this.tubeDrive); current = this.tubeDrive;
        current.connect(this.harmonicCompensator); current = this.harmonicCompensator;

        // Mezclamos la portadora mística
        this.mimesisGain.connect(current);

        this.formants.forEach(f => { current.connect(f); current = f; });
        current.connect(this.sovereignGain);
        this.sovereignGain.connect(this.luminousLimiter);
        this.luminousLimiter.connect(this.analyser);
        this.analyser.connect(this.outputNode);
        this.outputNode.connect(this.context.destination);
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
}
