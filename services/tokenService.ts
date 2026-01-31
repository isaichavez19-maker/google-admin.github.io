
import { GoogleGenAI } from "@google/genai";

export class TokenService {
  private static instance: TokenService;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Genera un token efímero para la sesión Live.
   * Maneja el flujo de selección de llave si es necesario.
   */
  public async createLiveToken() {
    try {
      // Verificar si hay una llave seleccionada (requerido para Veo y Live API en modo pago)
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }

      // Crear instancia con la llave actual (process.env.API_KEY se actualiza tras la selección)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const token = await ai.authTokens.create({
        config: {
          uses: 1,
          expireTime: expireTime,
          newSessionExpireTime: new Date(Date.now() + 60 * 1000).toISOString(),
          liveConnectConstraints: {
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            config: {
              responseModalities: ['AUDIO'],
              systemInstruction: "Eres Volk Thorne, el administrador gélido de Dominus Umbrea."
            }
          },
          httpOptions: { apiVersion: 'v1alpha' }
        },
      });

      return token;
    } catch (error: any) {
      console.error("Error al crear token efímero:", error);
      // Manejo específico del 404: "Requested entity was not found."
      if (error.message?.includes("Requested entity was not found") || error.toString().includes("404")) {
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
        }
      }
      throw error;
    }
  }
}
