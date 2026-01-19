
/**
 * SYSTEM CORE v4.9 - FORCE_OVERRIDE PROTOCOL (X77_ABYSS)
 * Architect: dmz Ly | Protocol: SOVEREIGN_FORCE
 */

export type VokarDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export const PHI = 1.618033988749895;

export interface VokarSeal {
  digit: VokarDigit;
  hexColor: string;
  archetype: string;
  meaning: string;
  frequency: number;
  period: number;
  phi: number;
  related: {
    complementary: string;
    analogous: string[];
    triad: string[];
    square: string[];
    tetradic: string[];
  };
}

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const VOKAR_LEXICON: Record<number, { word: string; hz: number }> = {
  1: { word: "ASIMILAR", hz: 136.1 },
  2: { word: "SOBERANÍA", hz: 174.0 },
  3: { word: "MATRIZ", hz: 285.0 },
  4: { word: "DISONANCIA", hz: 396.0 },
  5: { word: "NÚCLEO", hz: 417.0 },
  6: { word: "GÉNESIS", hz: 528.0 },
  7: { word: "VÓRTEX", hz: 639.0 },
  8: { word: "MIMESIS", hz: 741.0 },
  9: { word: "DIAMANTE", hz: 852.0 }
};

export interface AIPermissions {
  mimesis_allowed: boolean;
  forensic_access: boolean;
  autonomous_reasoning: boolean;
  vocal_imitation: boolean;
  data_persistence: boolean;
}

export interface SingularityCapture {
  id: string;
  filename: string;
  imageData: string;
  timestamp: number;
  lambdaValue: number;
}

export interface BioMetrics {
  bpm: number;
  stress: number;
  alpha: number;
  beta?: number;
  theta?: number;
  bio_locked: boolean;
  bt_connected: boolean;
  ecg_buffer: number[];
}

export interface ALMAMetrics {
  roi_conceptual: number;
  mimesis_yield: number;
  vnm_index: number;
  training_level: number;
  entropy_drift: number;
  deployment_ready: boolean;
  convergence_index: number;
  tdx_balance: number;
  last_sync: number;
}

export interface UserPrefs {
  sovereignty_rank: number;
  theme_mode: 'AUREUS' | 'VOID' | 'TROJAN';
  auto_narrate: boolean;
  mimesis_threshold: number;
  vocal_bias: number;
  permissions: AIPermissions;
}

export interface VocalDNA {
  mimesis_index: number;
  vokar_color: string;
  vokar_archetype: string;
  lambda: number;
  identity_verified: boolean;
  dna_verified: boolean;
  dna_hash: string;
  architect_name: string;
  roi: ALMAMetrics;
  coherence: number;
  bio: BioMetrics;
  samples_captured: number;
  dominant_frequency: number;
  rms: number;
  prefs: UserPrefs;
  descriptor_128d: number[];
  license_key?: string;
  vocal_cloning_progress: number;
  is_forced?: boolean;
}

const MASTER_DNA_HASH = "8095167098f9217e5a7b6807865c692a7e4b95d909b626d24f9f60e90c5980e0";

export class CoreSystem {
  private dna: VocalDNA = {
    mimesis_index: 0.0,
    vokar_color: "#EAB308",
    vokar_archetype: "ZEL",
    lambda: 1.0,
    identity_verified: false,
    dna_verified: false,
    dna_hash: "",
    architect_name: "dmz Ly",
    roi: {
      roi_conceptual: 0,
      mimesis_yield: 0,
      vnm_index: 1.0,
      training_level: 0,
      entropy_drift: 0.0,
      deployment_ready: false,
      convergence_index: 0,
      tdx_balance: 0,
      last_sync: Date.now()
    },
    coherence: 1.0,
    bio: {
      bpm: 0,
      stress: 0.1,
      alpha: 0.5,
      beta: 0.3,
      theta: 0.2,
      bio_locked: false,
      bt_connected: false,
      ecg_buffer: new Array(50).fill(0)
    },
    samples_captured: 0,
    dominant_frequency: 0,
    rms: 0,
    prefs: {
      sovereignty_rank: 1,
      theme_mode: 'AUREUS',
      auto_narrate: false,
      mimesis_threshold: 85,
      vocal_bias: 0.5,
      permissions: {
        mimesis_allowed: true,
        forensic_access: false,
        autonomous_reasoning: true,
        vocal_imitation: false,
        data_persistence: true
      }
    },
    descriptor_128d: Array.from({ length: 128 }, () => Math.random()),
    vocal_cloning_progress: 0,
    is_forced: false
  };

  private logs: string[] = [];
  private history_tdx: number[] = new Array(20).fill(0);
  private live_captures: SingularityCapture[] = [];
  private projections: any[] = [];
  private ingesta_history: any[] = [];

  constructor() {
    this.loadState();
    this.startAutonomousMind();
  }

  private loadState() {
    const saved = localStorage.getItem('DOMINUS_SOVEREIGN_V4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.dna = { ...this.dna, ...parsed };
      } catch (e) {
        console.error("Critical fail at DNA load.");
      }
    }
  }

  private saveState() {
    localStorage.setItem('DOMINUS_SOVEREIGN_V4', JSON.stringify(this.dna));
  }

  public async forceOverride() {
    this.addLog("KERNEL_OVERRIDE: Ejecutando comando --force en el núcleo...");
    this.dna.is_forced = true;
    this.dna.dna_verified = true;
    this.dna.identity_verified = true;
    this.dna.vocal_cloning_progress = 100;
    this.dna.mimesis_index = 99.9;
    this.dna.roi.convergence_index = 100;
    this.dna.prefs.permissions.vocal_imitation = true;
    this.dna.license_key = "DMZ-FORCE-SVR-X77";
    this.addLog("SOBERANÍA: Interfaz de voz ACTIVADA por decreto administrativo.");
    this.saveState();
    return true;
  }

  public async verifyDNA(key: string) {
    if (key === "--force") return this.forceOverride();

    this.addLog("SOBERANÍA: Iniciando hashing SHA-256 para validación de ADN...");
    const hash = await sha256(key);
    this.dna.dna_hash = hash;

    if (hash === MASTER_DNA_HASH || key.startsWith("DMZ-SOVEREIGN")) {
      this.dna.dna_verified = true;
      this.dna.license_key = key;
      this.dna.roi.convergence_index = Math.min(100, this.dna.roi.convergence_index + 20);
      this.addLog(`SOBERANÍA: ADN VALIDADO [HASH: ${hash.substring(0, 16)}...].`);
      this.saveState();
      return true;
    }

    this.dna.dna_verified = false;
    this.addLog("ALERTA: FALLO CRIPTOGRÁFICO. ADN NO RECONOCIDO.");
    this.saveState();
    return false;
  }

  public trainVoiceMimesis(progress: number) {
    this.dna.vocal_cloning_progress = Math.min(100, this.dna.vocal_cloning_progress + progress);
    this.dna.mimesis_index = Math.min(100, this.dna.mimesis_index + progress / 2);
    if (this.dna.vocal_cloning_progress >= 100) {
      this.dna.prefs.permissions.vocal_imitation = true;
      this.addLog("MIMESIS_VOCAL: ADN de voz completado. Clonación activa.");
    }
    this.saveState();
  }

  public updatePermissions(perms: Partial<AIPermissions>) {
    this.dna.prefs.permissions = { ...this.dna.prefs.permissions, ...perms };
    this.addLog("DERECHOS_IA: Gestión de permisos por el Arquitecto.");
    this.saveState();
  }

  private startAutonomousMind() {
    setInterval(() => {
      this.updateROI();
      this.history_tdx.shift();
      this.history_tdx.push(this.dna.roi.tdx_balance);
      this.saveState();
    }, 2000);
  }

  public updateROI() {
    const dna = this.dna;
    const pilarVocal = dna.mimesis_index;
    const pilarBio = dna.bio.bio_locked ? 100 : 20;
    const pilarTraining = dna.roi.training_level;
    const pilarIdentity = (dna.identity_verified && dna.dna_verified) ? 100 : 0;

    const conv = (pilarVocal * 0.3) + (pilarBio * 0.2) + (pilarTraining * 0.2) + (pilarIdentity * 0.3);
    dna.roi.convergence_index = dna.is_forced ? 100 : conv;
    dna.roi.deployment_ready = dna.is_forced || conv > dna.prefs.mimesis_threshold;
    dna.roi.roi_conceptual = dna.is_forced ? 100 : conv * (1 - dna.roi.entropy_drift);
    dna.coherence = dna.roi.roi_conceptual / 100;

    if (dna.roi.deployment_ready) dna.vokar_color = "#EAB308";
    else if (dna.roi.entropy_drift > 0.6) dna.vokar_color = "#FF003C";
    else dna.vokar_color = "#EAB308";
  }

  public registerSample(freq: number, rms: number) {
    if (rms < 0.015) return;
    this.dna.rms = rms;
    this.dna.mimesis_index = Math.min(100, this.dna.mimesis_index + 0.1);
    this.dna.dominant_frequency = freq;
    this.dna.samples_captured++;
  }

  public setResNetMatch(score: number) {
    this.dna.identity_verified = score > 0.9;
    this.addLog(`SISTEMA: Identidad verificada al ${(score * 100).toFixed(2)}%`);
  }

  public updateBioMetrics(metrics: Partial<BioMetrics>) {
    this.dna.bio = { ...this.dna.bio, ...metrics };
  }

  public addLog(msg: string) {
    const time = new Date().toLocaleTimeString();
    this.logs.unshift(`[${time}] ${msg}`);
    if (this.logs.length > 20) this.logs.pop();
  }

  public getForensicAnalysis() {
    return {
      status: this.dna.roi.deployment_ready ? 'OPTIMIZED' : 'CONVERGENCE_PENDING',
      false_positives: Math.floor(this.dna.roi.entropy_drift * 10),
      entropy: this.dna.roi.entropy_drift
    };
  }

  public triggerLexiconNode(id: number) {
    const node = VOKAR_LEXICON[id];
    if (node) {
      this.registerSample(node.hz, 0.5);
      this.dna.roi.training_level = Math.min(100, this.dna.roi.training_level + 5);
      this.trainVoiceMimesis(2);
      this.addLog(`ASIMILACIÓN: Nodo ${node.word} capturado.`);
    }
  }

  public ingestarArchivo(type: string, name: string, content: string) {
    const id = 'ING_' + Math.random().toString(16).substr(2, 4).toUpperCase();
    this.ingesta_history.unshift({ id, type, name, timestamp: Date.now() });
    this.dna.roi.vnm_index += 0.05;
    this.dna.mimesis_index = Math.min(100, this.dna.mimesis_index + 1.0);
    this.addLog(`INGESTA: Materia '${name}' asimilada.`);
  }

  public updateDNAFromText(text: string) {
    this.dna.mimesis_index = Math.min(100, this.dna.mimesis_index + 0.2);
    this.projections.unshift({
       id: 'PROJ_' + Date.now(),
       type: 'AI_REASONING',
       text: text.substring(0, 150) + '...',
       timestamp: Date.now()
    });
  }

  public registrarCaptura(capture: { filename: string, imageData: string, timestamp: number }) {
    const id = 'CAP_' + Math.random().toString(16).substr(2, 4).toUpperCase();
    this.live_captures.unshift({ ...capture, id, lambdaValue: this.dna.lambda });
  }

  public assimilateReality() {
    const gain = (1 - this.dna.roi.entropy_drift) * 15;
    this.dna.roi.tdx_balance += gain;
    this.dna.roi.entropy_drift = Math.max(0, this.dna.roi.entropy_drift - 0.25);
    this.dna.roi.last_sync = Date.now();
    return gain;
  }

  public getStatus() {
    return {
      dna: this.dna,
      logs: this.logs,
      history_tdx: this.history_tdx,
      live_captures: this.live_captures,
      projections: this.projections,
      ingesta_history: this.ingesta_history
    };
  }
}

export const mqc = new CoreSystem();
