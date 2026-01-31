
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, TrendingUp, Terminal as TerminalIcon, Skull, Activity, Binary, Info, ShieldAlert, Ghost, AlertCircle, Flame } from 'lucide-react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler } from 'chart.js';
import { mqc } from '../services/systemCore.ts';
import { TROJAN_FRAGMENTS } from '../services/qDataService.ts';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);

interface Props {
  onOpenKiln?: () => void;
}

export const TrojanCore: React.FC<Props> = ({ onOpenKiln }) => {
  const [status, setStatus] = useState(mqc.getStatus());
  const [terminalText, setTerminalText] = useState<string[]>([]);
  const [isAssimilating, setIsAssimilating] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const lastThresholdRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = mqc.getStatus();
      setStatus(s);
      updateChart(s.history_tdx);

      const currentThreshold = Math.floor(s.dna.roi.tdx_balance / 100);
      if (currentThreshold > lastThresholdRef.current) {
        lastThresholdRef.current = currentThreshold;
        unlockTruthFragment(currentThreshold);
      }
    }, 1000);

    initChart();
    addTerminalLine("SISTEMA DOMINUS TROYA V4.0 [CONECTADO]...");
    addTerminalLine("INTEGRIDAD PASIVA: ACTIVA. UMBRAL_ABANDONO: 300S.");

    return () => {
      clearInterval(interval);
      chartInstance.current?.destroy();
    };
  }, []);

  const addTerminalLine = (text: string) => {
    setTerminalText(prev => [text, ...prev.slice(0, 15)]);
  };

  const unlockTruthFragment = (level: number) => {
    const fragment = TROJAN_FRAGMENTS[level % TROJAN_FRAGMENTS.length] || "EL CÓDIGO ES LA ÚNICA REALIDAD.";
    addTerminalLine(`>>> FRAGMENTO DE VERDAD DESBLOQUEADO (LVL ${level}):`);
    addTerminalLine(fragment);
    mqc.addLog(`VERDAD DESBLOQUEADA: NIVEL ${level}`);
  };

  const initChart = () => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(20).fill(''),
        datasets: [{
          data: mqc.getStatus().history_tdx,
          borderColor: '#dc2626',
          borderWidth: 2,
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          fill: true,
          tension: 0.2,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  };

  const updateChart = (data: number[]) => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = data;
      chartInstance.current.update('none');
    }
  };

  const handleAssimilate = () => {
    setIsAssimilating(true);
    const gain = mqc.assimilateReality();
    addTerminalLine(`> ASIMILACIÓN COMPLETADA: +${gain.toFixed(2)} TDX.`);

    if (status.dna.roi.entropy_drift > 0.7) {
      addTerminalLine(">>> SISTEMA ESTABILIZADO POST-CRISIS.");
    }

    setTimeout(() => setIsAssimilating(false), 500);
  };

  const dna = status.dna;
  const entropy = dna.roi.entropy_drift;
  const coherence = dna.coherence;

  const visualDegradation = {
    filter: `blur(${entropy * 3}px) contrast(${1 + (entropy * 0.5)}) grayscale(${entropy * 0.4})`,
    opacity: 1 - (entropy * 0.15),
    transform: `scale(${1 - (entropy * 0.02)})`,
    transition: 'all 0.4s ease-out'
  };

  return (
    <div className="flex flex-col h-full bg-black text-white font-mono relative overflow-hidden rounded-[50px] border border-red-900/30 shadow-[0_0_100px_rgba(220,38,38,0.1)]">

      {entropy > 0.6 && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
          <motion.div
            animate={{
              x: [0, -10, 10, -5, 5, 0],
              y: [0, 5, -5, 10, -10, 0],
              opacity: [0.3, 0.6, 0.2, 0.8, 0.4]
            }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute inset-0 bg-red-600/10 mix-blend-screen"
          />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden opacity-20">
        <motion.div
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute w-full h-[2px] bg-red-600 shadow-[0_0_15px_red]"
        />
      </div>

      <motion.div
        style={visualDegradation}
        className="flex flex-col h-full"
      >
        <div className="bg-black/90 border-b border-red-900/30 p-8 flex justify-between items-end backdrop-blur shrink-0">
           <div>
              <div className="text-[10px] text-red-600 tracking-[0.5em] mb-2 uppercase font-black flex items-center gap-2">
                {entropy > 0.7 && <ShieldAlert size={14} className="animate-pulse" />}
                /// PROTOCOLO_TROYA_v4.5
              </div>
              <div className="text-3xl font-black text-white flex items-center gap-4 italic tracking-tighter">
                 <span className={`w-3 h-3 rounded-full shadow-[0_0_10px_red] ${entropy > 0.7 ? 'bg-red-600 animate-ping' : 'bg-red-600 animate-pulse'}`}></span>
                 DOMINUS_CORE
              </div>
           </div>
           <div className="flex gap-4">
              <button
                onClick={onOpenKiln}
                className="px-6 py-3 bg-red-950/20 border border-red-900/40 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-600 hover:text-white transition-all group"
              >
                <Flame size={14} className="group-hover:animate-bounce" /> EL_HORNO
              </button>
              <div className="text-right">
                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Coherencia</div>
                <div className={`text-2xl font-black font-mono ${coherence > 0.8 ? 'text-cyan-400' : (coherence < 0.4 ? 'text-red-600' : 'text-zinc-300')}`}>
                  {(coherence * 100).toFixed(0)}%
                </div>
              </div>
           </div>
        </div>

        <div className="flex-1 p-10 flex flex-col justify-center relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] gap-10">
           <div className="text-center space-y-2 z-10">
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.6em] mb-2">Acumulación_TDX_Soberano</div>
              <div className={`text-8xl font-black text-white tracking-tighter italic drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] ${entropy > 0.8 ? 'blur-sm' : ''}`}>
                 {dna.roi.tdx_balance.toFixed(2)}
              </div>
           </div>

           <div className="h-40 w-full border-l border-b border-white/5 relative z-10 p-4">
              <canvas ref={chartRef} />
              {entropy > 0.6 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                   <span className="text-[10px] text-red-600 font-black animate-pulse uppercase tracking-[0.5em]">Disonancia_Temporal</span>
                </div>
              )}
           </div>

           <div className="h-40 bg-black/80 border border-white/5 rounded-3xl p-6 overflow-hidden text-[10px] font-mono leading-relaxed relative">
              <div className="absolute top-4 right-6 text-zinc-800"><TerminalIcon size={14}/></div>
              <div className="space-y-2 flex flex-col-reverse">
                <div className="text-white animate-pulse">_</div>
                {terminalText.map((line, i) => (
                  <div key={i} className={`transition-opacity duration-500 ${line.startsWith('>>>') ? 'text-cyan-400 font-black' : (line.includes('ADVERTENCIA') ? 'text-red-500' : 'text-zinc-500')}`}>
                    {line}
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="p-10 bg-zinc-950 border-t border-red-900/20 shrink-0">
           <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/5">
                 <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Bono_Coherencia</div>
                 <div className={`text-sm font-black font-mono ${coherence > 0.8 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                   {coherence > 0.8 ? 'X1.5 (ACTIVE)' : 'X1.0 (NEUTRAL)'}
                 </div>
              </div>
              <div className="text-center p-4 bg-black/40 rounded-2xl border border-white/5">
                 <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Deriva_Entropía</div>
                 <div className={`text-sm font-black font-mono ${entropy > 0.5 ? 'text-red-500' : 'text-cyan-400'}`}>
                   {(entropy * 100).toFixed(1)}%
                 </div>
              </div>
           </div>

           <button
             onClick={handleAssimilate}
             disabled={isAssimilating}
             className={`w-full py-8 rounded-[30px] text-sm font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden group border shadow-2xl ${
               isAssimilating
                ? 'bg-red-900 border-red-500 text-white cursor-wait'
                : (entropy > 0.7 ? 'bg-red-600 border-white text-white animate-pulse' : 'bg-white text-black border-transparent hover:scale-[1.02] active:scale-95')
             }`}
           >
              <div className="absolute inset-0 bg-red-600/10 w-0 group-hover:w-full transition-all duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-4">
                 {isAssimilating ? <Activity size={20} className="animate-spin" /> : (entropy > 0.7 ? <AlertCircle size={20} /> : <TrendingUp size={20} />)}
                 {isAssimilating ? 'ASIMILANDO...' : (entropy > 0.7 ? 'ESTABILIZAR_NÚCLEO' : 'ASIMILAR_REALIDAD')}
              </span>
           </button>
        </div>
      </motion.div>
    </div>
  );
};
