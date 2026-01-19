#!/bin/bash
export SDL_VIDEODRIVER=dummy
echo ">>> INICIANDO SISTEMA OMEGA (GLOBAL DEPLOYMENT)..."

# Cleanup
echo "--- Limpiando puertos..."
kill $(lsof -t -i:8081) 2>/dev/null || true
kill $(lsof -t -i:9000) 2>/dev/null || true
kill $(lsof -t -i:57121) 2>/dev/null || true
kill $(lsof -t -i:5173) 2>/dev/null || true

# Start Backend
echo "--- Activando el puente (bridge.js)..."
node bridge.cjs > bridge.log 2>&1 &
BRIDGE_PID=$!
sleep 2

echo "--- Activando el córtex visual (cerebro_v3.py)..."
python3 cerebro_v3.py > cerebro.log 2>&1 &
CEREBRO_PID=$!
sleep 2

# Start Frontend
echo "--- Iniciando Frontend (Vite)..."
npm run dev -- --port 5173 --host 0.0.0.0 > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ">>> SISTEMA ACTIVADO."
echo "PID Bridge: $BRIDGE_PID"
echo "PID Cerebro: $CEREBRO_PID"
echo "PID Frontend: $FRONTEND_PID"
echo "Frontend accesible en http://localhost:5173"
