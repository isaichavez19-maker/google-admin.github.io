
import { mqc as logicMqc } from './logicCore.ts';
import { mqc as systemMqc } from './systemCore.ts';
import { vocalHost } from './vocalEngine.ts';

export class BridgeService {
  private socket: WebSocket | null = null;
  private url: string = 'ws://localhost:8081';
  private isConnected: boolean = false;
  private ritualActive: boolean = false;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        this.isConnected = true;
        systemMqc.addLog("WORMHOLE_BRIDGE: Enlace Bio-Voyager establecido.");
      };
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.address === '/sistema/ritual') {
            this.ritualActive = data.value === 'ACTIVO' || data.value === 'ESTABLECIDO';
            systemMqc.addLog(`RITUAL_SYNC: ${this.ritualActive ? 'LLAVE_ACEPTADA' : 'PENDIENTE'}`);
          }

          // Inyección de Bio-Métricas
          if (data.address === '/sistema/bio/bpm') {
            systemMqc.updateBioMetrics({ bpm: data.value, bio_locked: true });
          }
          if (data.address === '/sistema/bio/stress') {
            systemMqc.updateBioMetrics({ stress: data.value });
          }
          if (data.address === '/sistema/bio/alpha') {
            systemMqc.updateBioMetrics({ alpha: data.value });
          }

          if (data.address === '/sistema/clon_imagen') {
            logicMqc.registrarCaptura({
              filename: 'GUSANO_VISUAL.png',
              imageData: data.value.data.startsWith('data:') ? data.value.data : `data:image/png;base64,${data.value.data}`,
              timestamp: Date.now()
            });
          }

          if (data.address === '/sistema/orbit_speed') {
            vocalHost.setOrbitSpeed(data.value);
            systemMqc.addLog(`ORBITA_ADJUST: Speed @ ${data.value}`);
          }

        } catch (e) {
          console.error("Bridge Error:", e);
        }
      };
      this.socket.onclose = () => {
        this.isConnected = false;
        setTimeout(() => this.connect(), 5000);
      };
    } catch (e) { this.isConnected = false; }
  }

  public getStatus() {
    return { connected: this.isConnected, ritual: this.ritualActive };
  }
}

export const bridgeService = new BridgeService();
