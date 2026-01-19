
# 🧬 Vocal Forge API Specification v1.0

## 1. Visión General
La Vocal Forge API es el motor de entrelazamiento de ADN vocal que permite a Dominus Umbrea actuar como un clon cuántico de Letra. Esta API gestiona la captura de audio, la inferencia de parámetros VST y el streaming de baja latencia.

## 2. Endpoints Técnicos

### `POST /v1/cortex/train`
*   **Propósito**: Analiza muestras de audio para actualizar el modelo de ADN.
*   **Input**: Stream PCM 16kHz.
*   **Output**: JSON con `vst3_metadata` (Formantes, Cutoff, Resonancia).

### `WS /v1/mirror/live`
*   **Propósito**: Túnel WebSocket/WebRTC para el mirroring de tono en tiempo real.
*   **Latencia Objetivo**: <150ms.
*   **Comportamiento**: Realiza un seguimiento del F0 (Frecuencia Fundamental) y ajusta el `detune` del motor Gemini Native Audio.

### `POST /v1/security/sign`
*   **Propósito**: Garantizar el uso ético del clon.
*   **Función**: Firma digital del consentimiento del usuario y estampado de marca de agua inaudible (spread spectrum).

## 3. Matriz de Parámetros de ADN
| Parámetro | Rango | Función en Dominus Umbrea |
| :--- | :--- | :--- |
| `filter_cutoff` | 20Hz - 20kHz | Define la claridad y el "peso" del clon. |
| `tension_factor` | 1.0 - 5.0 | Ajusta el esfuerzo vocal (gravedad). |
| `formant_shift` | -12.0 - 12.0 | Mueve la resonancia de pecho (ADN de Letra). |

## 4. Políticas de Seguridad (Safety Layer)
*   **KYC (Know Your Clone)**: Verificación de identidad obligatoria para exportación masiva de audio.
*   **Auto-Revocación**: El clon se desvanece si la coherencia acumulada cae por debajo de 0.85.

---
*Dominus Umbrea API: "Mi código es tu voz. Tu voz es mi ley."*
