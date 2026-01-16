/**
 * ARCHIVO: bridge.js
 * ESTADO: CORREGIDO Y OPTIMIZADO
 * FUNCIÓN: Router de Alta Velocidad (WS <-> UDP)
 */
const WebSocket = require('ws');
const { Client, Server } = require('node-osc');

// --- CONFIGURACIÓN ALINEADA ---
const CONFIG = {
    wsPort: 8081,           // Escucha al Navegador
    udpClientPort: 9000,    // ENVÍA a Python (Cerebro) -> ¡CORREGIDO!
    udpServerPort: 57121,   // ESCUCHA respuestas de Python
    pythonIP: "127.0.0.1",
    logThrottle: 2000       // ms between feedback logs
};

let lastLogTime = 0;

// 1. Cliente OSC (Para hablarle a Python)
const oscClient = new Client(CONFIG.pythonIP, CONFIG.udpClientPort);

// 2. Servidor OSC (Para escuchar a Python)
const oscServer = new Server(CONFIG.udpServerPort, '0.0.0.0', () => {
    console.log('\x1b[32m%s\x1b[0m', `[UDP] Escuchando a Python en puerto ${CONFIG.udpServerPort}`);
});

// 3. Servidor WebSocket (Para el Navegador)
const wss = new WebSocket.Server({ port: CONFIG.wsPort });

console.clear();
console.log('\x1b[36m%s\x1b[0m', '>>> SINAPSIS BRIDGE V4.0 ACTIVADA <<<');
console.log(`[LINK] Navegador (WS): ${CONFIG.wsPort} -> Python (UDP): ${CONFIG.udpClientPort}`);

// --- LÓGICA DE FLUJO ---

// A. Del Navegador a Python (Tu voz crea realidad)
wss.on('connection', ws => {
    console.log('\x1b[35m%s\x1b[0m', '[NEXUS] Cliente Web Conectado.');

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            // Enviar a Python
            oscClient.send(data.address, data.args[0].value);

            // Log ligero para no saturar (solo picos altos)
            if (data.args[0].value > 8.0) {
                process.stdout.write('\x1b[33m.\x1b[0m'); // Punto amarillo por cada pico
            }
        } catch (e) {
            console.error('[ERR] Trama corrupta del Nexus');
        }
    });

    // B. De Python al Navegador (Feedback de la Singularidad)
    oscServer.on('message', (msg) => {
        // msg es ['/address', value]

        // OPTIMIZATION: Throttled logging to prevent event loop blocking
        const now = Date.now();
        if (now - lastLogTime > CONFIG.logThrottle) {
            console.log('\n\x1b[41m\x1b[37m%s\x1b[0m', `[FEEDBACK] ${msg[0]}: ${msg[1]}`);
            lastLogTime = now;
        }

        // Retransmitir al navegador
        const jsonMsg = JSON.stringify({ address: msg[0], value: msg[1] });
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(jsonMsg);
        }
    });
});
