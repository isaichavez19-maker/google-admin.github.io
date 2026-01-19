#!/bin/bash
echo ">>> INICIANDO SISTEMA OMEGA (DOMINUS UMBREA)..."

# Matar procesos anteriores en los puertos para asegurar un inicio limpio
echo "--- Limpiando puertos..."
kill $(lsof -t -i:8081) 2>/dev/null || true
kill $(lsof -t -i:9000) 2>/dev/null || true
kill $(lsof -t -i:57121) 2>/dev/null || true
kill $(lsof -t -i:8080) 2>/dev/null || true  # Sidecar

# Iniciar el Sidecar (Go)
echo "--- Activando Sidecar (Oráculo)..."
go run sidecar.go > sidecar.log 2>&1 &
SIDECAR_PID=$!
sleep 1

# Iniciar el Puente Node.js en segundo plano
echo "--- Activando el puente (bridge.js)..."
node bridge.js > bridge.log 2>&1 &
BRIDGE_PID=$!
sleep 2 # Dar tiempo para que el puente se inicie

# Iniciar el Visualizador en segundo plano
echo "--- Activando el córtex visual (cerebro_v3.py)..."
python3 cerebro_v3.py > cerebro.log 2>&1 &
VISUALIZER_PID=$!
sleep 2 # Dar tiempo para que el visualizador se inicie

echo ">>> SISTEMA ACTIVADO."
echo "  - Sidecar PID: $SIDECAR_PID"
echo "  - Puente PID: $BRIDGE_PID"
echo "  - Visualizador PID: $VISUALIZER_PID"
echo "Logs disponibles en sidecar.log, bridge.log y cerebro.log"
echo "Acceda a index.html para iniciar la interfaz principal."
echo "Acceda a visual_engine.html para el Generador Visual."
