
/**
 * AUDIO SERVICE v24.63 - PITCH TRACKING REFINED
 * Architect: LETRA DMZ | Focus: Ritual Fluidity
 */

export interface SpectralAnalysis {
  frequency: number;
  status: 'LOCKED' | 'SEARCHING' | 'SILENCE';
  rms: number;
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Added encode function as per GenAI SDK guidelines for Live API
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const size = buffer.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.008) return -1;

  const minPeriod = sampleRate / 1000;
  const maxPeriod = sampleRate / 50;
  let bestOffset = -1;
  let bestCorrelation = 0;

  for (let offset = Math.floor(minPeriod); offset < maxPeriod; offset++) {
    let correlation = 0;
    for (let i = 0; i < size - offset; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation > 0.01) return sampleRate / bestOffset;
  return -1;
}

export function analyzeSpectralPhase(buffer: Float32Array, sampleRate: number): SpectralAnalysis {
  const pitch = autoCorrelate(buffer, sampleRate);
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / buffer.length);

  if (pitch === -1 || pitch < 40 || pitch > 1500) {
    return { frequency: 0, status: 'SILENCE', rms };
  }

  return { frequency: pitch, status: 'LOCKED', rms };
}
