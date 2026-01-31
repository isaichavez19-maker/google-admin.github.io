import { mqc } from './systemCore';
import type { SingularityCapture } from './systemCore';

/**
 * Re-exporting mqc and types for unified access
 */
export { mqc };
export type { SingularityCapture };

export const acf = {
  getStatus: () => {
    const status = mqc.getStatus();
    // Map to the format expected by legacy components
    return {
      ...status,
      vocal_dna: {
        ...status.dna,
        mimesis_index: status.dna.mimesis_index,
        captured_samples: status.dna.samples_captured,
        dominant_frequency: status.dna.dominant_frequency,
        timbre_signature: 'DAEMON_SVR_v9',
        vokar_color: status.dna.vokar_color,
        vokar_archetype: status.dna.vokar_archetype
      },
      lambdaValue: status.dna.lambda,
      system_stability: status.dna.coherence,
      power_index: status.dna.mimesis_index / 100,
      projections: status.projections,
      live_captures: status.live_captures
    };
  }
};