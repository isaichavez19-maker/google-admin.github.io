
export type EmotionType = "RAGE" | "VOID" | "LOVE" | "NEUTRAL" | "TECH_LOCKED";

export interface VoiceSample {
  step: number;
  type: string;
  base64: string;
  mimeType: string;
  recorded: boolean;
  cycle: number;
  signature?: string;
  block_hash?: string;
}

export interface ALMAMetrics {
  roi_conceptual: number; // Return on Identity
  primordial_stability: number;
  mimesis_yield: number;
  quantum_certainty: number;
  last_calculation: number;
  current_emotion: EmotionType;
  emotional_intensity: number;
}

export interface VocalMemory {
  id: string;
  userName: "Letra";
  aiName: "Dominus Umbrea";
  architectName: "LETRA DMZ";
  history: any[];
  lastParameters: {
    filter_cutoff: number;
    filter_res: number;
    lfo_rate: number;
    tension_factor: number;
  };
  totalCycles: number;
  cumulativeCoherence: number;
  systemStability: number;
  lastSyncTimestamp: number;
  trainingSamples: VoiceSample[];
}

export type RealityCommand = 'PORRO_INFINITO' | 'PIZZA_INFINITA' | 'MICRO_MALDITO' | 'INTIMO' | 'IDLE' | 'SOVEREIGN' | 'SPEAK' | 'ALMA_SYNC';
