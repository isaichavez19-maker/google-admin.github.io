const { Client } = require('node-osc');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const BRIDGE_WS_PORT = 8081;
const BRIDGE_OSC_PORT = 57121;
const MSG_COUNT = 1000;

async function runBenchmark() {
    console.log('--- Starting Benchmark ---');

    // 1. Start Bridge
    const bridge = spawn('node', ['bridge.cjs'], { stdio: ['ignore', 'pipe', 'pipe'] });

    bridge.stdout.on('data', (data) => console.log(`[BRIDGE] ${data}`));
    bridge.stderr.on('data', (data) => console.error(`[BRIDGE ERR] ${data}`));

    // Wait for bridge to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Connect WebSocket
    const ws = new WebSocket(`ws://localhost:${BRIDGE_WS_PORT}`);

    await new Promise((resolve, reject) => {
        ws.on('open', resolve);
        ws.on('error', reject);
    });
    console.log('WS Connected');

    // 3. Prepare OSC Client
    const oscClient = new Client('127.0.0.1', BRIDGE_OSC_PORT);

    // 4. Measure
    let received = 0;
    const start = process.hrtime.bigint();

    return new Promise((resolve, reject) => {
        // Safety timeout
        const timeout = setTimeout(() => {
            console.error('Benchmark timed out!');
            console.log(`Received only ${received}/${MSG_COUNT} messages.`);
            oscClient.close();
            ws.close();
            bridge.kill();
            resolve(); // Resolve anyway to show partial results
        }, 10000);

        ws.on('message', (data) => {
            received++;
            if (received % 100 === 0) console.log(`Received ${received}...`);
            if (received === MSG_COUNT) {
                clearTimeout(timeout);
                const end = process.hrtime.bigint();
                const duration = Number(end - start) / 1e6; // ms
                console.log(`Received ${MSG_COUNT} messages in ${duration.toFixed(2)}ms`);
                console.log(`Throughput: ${(MSG_COUNT / (duration / 1000)).toFixed(2)} msg/sec`);

                oscClient.close();
                ws.close();
                bridge.kill();
                resolve();
            }
        });

        console.log(`Sending ${MSG_COUNT} OSC messages...`);
        // Add a small delay between sends to avoid flooding UDP buffer if that's the issue
        let sent = 0;
        const sendInterval = setInterval(() => {
            if (sent >= MSG_COUNT) {
                clearInterval(sendInterval);
                return;
            }
            // Send a batch
            for(let k=0; k<10 && sent < MSG_COUNT; k++) {
                 oscClient.send('/bench/test', sent++);
            }
        }, 1);
    });
}

runBenchmark().catch(err => {
    console.error(err);
    process.exit(1);
});
