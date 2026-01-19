/**
 * BRIDGE SVR v5.0 - CONSOLIDATED HYBRID
 * Architect: Jules (via User Request)
 * Protocol: WS <-> UDP (OSC)
 */
const WebSocket = require('ws');
const { Client, Server } = require('node-osc');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const CONFIG = {
    wsPort: 8081,           // Listen for Frontend
    udpClientPort: 9000,    // Send to Python (Cerebro)
    udpServerPort: 57121,   // Listen from Python
    pythonIP: "127.0.0.1"
};

// 1. OSC Client (Talk to Python)
const oscClient = new Client(CONFIG.pythonIP, CONFIG.udpClientPort);

// 2. OSC Server (Listen to Python)
const oscServer = new Server(CONFIG.udpServerPort, '0.0.0.0', () => {
    console.log(`[UDP] Listening to Python on port ${CONFIG.udpServerPort}`);
});

// 3. WebSocket Server (Talk to Frontend)
const wss = new WebSocket.Server({ port: CONFIG.wsPort });

console.log('>>> DOMINUS BRIDGE v5.0 ACTIVATED <<<');
console.log(`[LINK] Frontend (WS): ${CONFIG.wsPort} <-> Python (UDP): ${CONFIG.udpClientPort}/${CONFIG.udpServerPort}`);

// Broadcast helper
function broadcast(msg) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

// --- LOGIC ---

wss.on('connection', ws => {
    console.log('[NEXUS] Frontend Connected.');

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            // Format check: Frontend might send { address: '/foo', value: 123 }
            // OSC expects (address, value)
            if (data.address) {
                // If data.value is object or array, OSC might need specific handling,
                // but usually it's single value or list of args.
                // SimpleUDPClient in Python expects args.
                // The old bridge sent data.args[0].value. Let's support both.
                let value = data.value;
                if (value === undefined && data.args && data.args[0]) {
                     value = data.args[0].value;
                }

                if (value !== undefined) {
                    oscClient.send(data.address, value);
                }
            }
        } catch (e) {
            console.error('[ERR] Invalid WS message:', e.message);
        }
    });
});

oscServer.on('message', (msg) => {
    // msg is ['/address', value1, value2...]
    const address = msg[0];
    const value = msg[1]; // Assuming single value for most controls

    // Special Handling: Image Capture Notification
    if (address === '/sistema/alerta' && typeof value === 'string' && value.startsWith('FOTO_CAPTURA_')) {
        // Format: FOTO_CAPTURA_{timestamp}
        // Filename: EVIDENCIA_{timestamp}.png
        const timestamp = value.replace('FOTO_CAPTURA_', '');
        const filename = `EVIDENCIA_${timestamp}.png`;
        const filepath = path.join(__dirname, filename);

        console.log(`[BRIDGE] Detected capture: ${filename}`);

        // Read file and send to Frontend
        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.error(`[ERR] Could not read image ${filename}:`, err.message);
                return;
            }
            const base64Image = data.toString('base64');
            const dataUrl = `data:image/png;base64,${base64Image}`;

            console.log(`[BRIDGE] Sending image to Frontend...`);
            broadcast({
                address: '/sistema/clon_imagen',
                value: {
                    filename: filename,
                    data: dataUrl,
                    timestamp: parseInt(timestamp)
                }
            });
        });
    } else {
        // Standard forwarding
        // console.log(`[FEEDBACK] ${address}: ${value}`);
        broadcast({ address: address, value: value });
    }
});

process.on('SIGINT', () => {
    oscClient.close();
    oscServer.close();
    wss.close();
    process.exit();
});
