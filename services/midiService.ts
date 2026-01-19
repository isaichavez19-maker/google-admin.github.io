
export class MidiService {
  private output: MIDIOutput | null = null;

  async init() {
    if (!navigator.requestMIDIAccess) return null;
    try {
      const access = await navigator.requestMIDIAccess();
      return Array.from(access.outputs.values());
    } catch (e) {
      return [];
    }
  }

  setOutput(output: MIDIOutput | null) {
    this.output = output;
  }

  sendNote(freq: number, velocity: number = 100) {
    if (!this.output || freq <= 0) return;

    // Convertir Hz a nota MIDI
    const midiNote = Math.round(12 * Math.log2(freq / 440) + 69);
    if (midiNote < 0 || midiNote > 127) return;

    const noteOn = [0x90, midiNote, velocity];
    const noteOff = [0x80, midiNote, 0];

    this.output.send(noteOn);
    setTimeout(() => this.output?.send(noteOff), 100);
  }

  sendControlChange(cc: number, value: number) {
    if (!this.output) return;
    const msg = [0xB0, cc, Math.floor(Math.max(0, Math.min(127, value)))];
    this.output.send(msg);
  }
}

export const midiService = new MidiService();
