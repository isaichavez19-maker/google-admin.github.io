
/**
 * VOKAR MOTOR v36.0 - Golden Ratio Edition
 * Arquitecto: Letra DMZ
 * Propósito: Reducción Ontológica y Geometría Sagrada (PHI)
 */

export type VokarDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface VokarSeal {
  digit: VokarDigit;
  hexColor: string;
  archetype: string;
  meaning: string;
  frequency: number;
  period: number;
  phi: number;            // Constante Áurea
  related: {
    complementary: string;
    analogous: string[];
    triad: string[];
    square: string[];
    tetradic: string[];
  };
}

const VOKAR_PALETTE: Record<VokarDigit, { hex: string; archetype: string; meaning: string }> = {
  1: { hex: "#FF0000", archetype: "ZEL (Inicio)", meaning: "Energía, Fuego, Fuerza, Intensidad" },
  2: { hex: "#FF7F00", archetype: "DUO (Conexión)", meaning: "Felicidad, Éxito, Creatividad, Calidez" },
  3: { hex: "#FFFF00", archetype: "TRI (Estructura)", meaning: "Brillo, Alegría, Optimismo, Claridad" },
  4: { hex: "#00FF00", archetype: "TEK (Código)", meaning: "Naturaleza, Crecimiento, Seguridad, Frescura" },
  5: { hex: "#00FFFF", archetype: "LUN (Fluidez)", meaning: "Comunicación, Expansión, Tranquilidad" },
  6: { hex: "#0000FF", archetype: "HEX (Visión)", meaning: "Estabilidad, Confianza, Profundidad, Mar" },
  7: { hex: "#4B0082", archetype: "MYS (Mística)", meaning: "Poder, Ambición, Nobleza, Realeza" },
  8: { hex: "#8F00FF", archetype: "MOR (Transmutación)", meaning: "Espiritualidad, Magia, Transformación" },
  9: { hex: "#FF00FF", archetype: "SAR (Totalidad)", meaning: "Totalidad, Compasión, Infinito" },
};

export class VokarEngine {
  private static BASE_FREQ = 13;
  public static readonly PHI = 1.618033988749895;

  public static reduce(num: number): VokarDigit {
    let current = Math.abs(num);
    while (current > 9) {
      current = current.toString().split("").reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return (current === 0 ? 9 : current) as VokarDigit;
  }

  private static getHex(digit: number): string {
    const d = ((digit - 1) % 9 + 1) as VokarDigit;
    return VOKAR_PALETTE[d].hex;
  }

  public static getGoldenPoint(theta: number, scale: number = 1): { x: number, y: number } {
    const r = scale * Math.pow(this.PHI, 2 * theta / Math.PI);
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    };
  }

  public static processInput(input: string): VokarSeal {
    const cleanInput = input.toUpperCase().replace(/[^A-Z]/g, "");
    let gematriaSum = 0;
    for (let i = 0; i < cleanInput.length; i++) {
      const charCode = cleanInput.charCodeAt(i) - 64;
      const value = (charCode - 1) % 9 + 1;
      gematriaSum += value;
    }

    const finalDigit = this.reduce(gematriaSum);
    const data = VOKAR_PALETTE[finalDigit];

    return {
      digit: finalDigit,
      hexColor: data.hex,
      archetype: data.archetype,
      meaning: data.meaning,
      frequency: (this.BASE_FREQ * finalDigit) + 52,
      period: 1 / ((this.BASE_FREQ * finalDigit) + 52),
      phi: this.PHI,
      related: {
        complementary: this.getHex(finalDigit + 4),
        analogous: [this.getHex(finalDigit - 1), this.getHex(finalDigit + 1)],
        triad: [this.getHex(finalDigit + 3), this.getHex(finalDigit + 6)],
        square: [this.getHex(finalDigit + 2), this.getHex(finalDigit + 4), this.getHex(finalDigit + 6)],
        tetradic: [this.getHex(finalDigit + 1), this.getHex(finalDigit + 4), this.getHex(finalDigit + 5)]
      }
    };
  }
}

export const vokar = VokarEngine;
