
/**
 * AtomicClock v4.0 - ALMA High-Precision Engine
 * Architect: LETRA DMZ | Direct Hardware Observer
 */

export interface QuantumEvent {
  descripcion: string;
  timestamp: number;
  datetime: Date;
  id: string;
}

export interface QuantumAnalysis {
  total_eventos: number;
  intervalos: number[];
  media_intervalos: number;
  mediana_intervalos: number;
  desviacion_estandar: number;
  min_intervalo: number;
  max_intervalo: number;
  coherencia: number;
}

export class AtomicClock {
  private eventos: QuantumEvent[] = [];
  private readonly MAX_BUFFER = 100;

  /**
   * Marca un evento observando el jitter real del hardware.
   */
  public marcarEvento(descripcion: string = "Evento"): QuantumEvent {
    const timestamp = performance.now(); // Tiempo de alta precisión desde el inicio del contexto

    const evento: QuantumEvent = {
      descripcion,
      timestamp,
      datetime: new Date(),
      id: btoa(Math.random().toString()).substring(10, 18).toUpperCase()
    };

    this.eventos.push(evento);
    if (this.eventos.length > this.MAX_BUFFER) this.eventos.shift();
    return evento;
  }

  public analizarTiempos(): QuantumAnalysis {
    const sincronizados = [...this.eventos].sort((a, b) => a.timestamp - b.timestamp);

    if (sincronizados.length < 2) {
      return {
        total_eventos: sincronizados.length,
        intervalos: [],
        media_intervalos: 0,
        mediana_intervalos: 0,
        desviacion_estandar: 0,
        min_intervalo: 0,
        max_intervalo: 0,
        coherencia: 1.0
      };
    }

    const intervalos: number[] = [];
    for (let i = 0; i < sincronizados.length - 1; i++) {
      intervalos.push(sincronizados[i + 1].timestamp - sincronizados[i].timestamp);
    }

    const media = intervalos.reduce((a, b) => a + b, 0) / intervalos.length;
    const sorted = [...intervalos].sort((a, b) => a - b);
    const mediana = sorted[Math.floor(sorted.length / 2)];
    const varianza = intervalos.reduce((a, b) => a + Math.pow(b - media, 2), 0) / intervalos.length;
    const stdev = Math.sqrt(varianza);

    // Coherencia: Inversa de la entropía temporal detectada
    const coherencia = Math.max(0, 1.0 - (stdev / 100));

    return {
      total_eventos: sincronizados.length,
      intervalos,
      media_intervalos: media,
      mediana_intervalos: mediana,
      desviacion_estandar: stdev,
      min_intervalo: Math.min(...intervalos),
      max_intervalo: Math.max(...intervalos),
      coherencia
    };
  }

  public generateEntropyHash(): string {
    const analysis = this.analizarTiempos();
    return "0x" + Math.abs(analysis.media_intervalos * 1000).toString(16).toUpperCase();
  }
}

export const quantumClock = new AtomicClock();
