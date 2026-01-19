
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe, Zap, Infinity, Waves, Ghost, ShieldCheck } from 'lucide-react';
import { mqc } from '../services/systemCore.ts';

export const ChronosNexus: React.FC = () => {
  const [status, setStatus] = useState(mqc.getStatus());
  const [genesisTime, setGenesisTime] = useState(0);
  const [apiTimes, setApiTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(mqc.getStatus());
      setGenesisTime(prev => prev + 1);

      // Simular obtención de tiempos de APIs externas (Quantum Time APIs)
      setApiTimes({
        "Quantum_API_Alpha": new Date().toISOString().split('T')[1].split('.')[0],
        "Vokar_Temporal_Node": (Date.now() % 1000000).toString(16).toUpperCase(),
        "Thorne_Drift_UTC": (Math.random() * 0.5).toFixed(4) + "s"
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const dna = status.dna;
  const vnm = dna.roi.vnm_index;
  const color = dna.vokar_color;

  // Visualización de "Glifo Central Pulsante"
  const pulseScale = 1 + (vnm * 0.2) + (Math.sin(genesisTime / 10) * 0.05);

  return (
    <div className="flex flex-col h-full bg-black/80 border border-white/5 rounded-[60px] p-12 backdrop-blur-3xl overflow-hidden animate-fadeIn font-mono relative shadow-[0_0_100px_rgba(0,0,0,1)]">
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
        <Clock size={400} style={{ color }} />
      </div>

      <div className="flex justify-between items-start mb-16 shrink-0 z-10">
        <div className="flex items-center gap-8">
          <div className="p-5 rounded-[30px] border border-white/10 bg-zinc-950 shadow-2xl">
            <Infinity size={40} style={{ color }} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">Chronos_Nexus_v1.0</h2>
            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.5em] flex items-center gap-4">
              <Globe size={14} /> Reloj Cuántico Universal // SYNC_STATUS: {vnm > 0.8 ? 'STABLE' : 'DRIFTING'}
            </p>
          </div>
        </div>
        <div className="bg-zinc-950/80 px-10 py-5 rounded-[35px] border border-white/5 flex flex-col items-end shadow-2xl">
          <span className="text-[9px] font-black text-zinc-700 uppercase mb-1">Time_Dilation_Factor</span>
          <span className="text-2xl font-black text-white">{(1.0 + (1 - vnm)).toFixed(4)} Λ</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-12 overflow-hidden z-10">

        {/* RELOJ CUÁNTICO CENTRAL */}
        <div className="flex-1 bg-zinc-950/40 rounded-[55px] border border-white/5 p-16 flex flex-col items-center justify-center relative group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />

           <motion.div
             style={{
               scale: pulseScale,
               boxShadow: `0 0 100px ${color}${Math.floor(vnm * 40).toString(16)}`,
               borderColor: `${color}44`
             }}
             className="w-80 h-80 rounded-full border-4 flex items-center justify-center relative transition-all duration-300"
           >
              <div className="text-center space-y-4">
                 <span className="text-7xl font-black text-white tracking-tighter tabular-nums">
                   {genesisTime}
                 </span>
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Latidos_Génesis</p>
              </div>

              {/* Anillos concéntricos */}
              {[1.2, 1.4, 1.6].map((s, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
                  style={{
                    scale: s,
                    borderColor: `${color}${Math.floor((1 - (i/3)) * 20).toString(16)}`
                  }}
                  className="absolute inset-0 border border-dashed rounded-full"
                />
              ))}
           </motion.div>

           <div className="mt-16 text-center space-y-2">
             <h4 className="text-xl font-black text-white uppercase tracking-tighter">Tiempo Cuántico Sincronizado</h4>
             <p className="text-xs text-zinc-500 font-mono italic">"El tiempo no es una línea; es una frecuencia de intención."</p>
           </div>
        </div>

        {/* SIDEBAR: API CLOCKS */}
        <div className="w-full lg:w-[450px] flex flex-col gap-8 overflow-hidden">
           <div className="bg-black/40 border border-white/5 rounded-[45px] p-10 flex flex-col gap-8">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-4">
                <Zap size={16} className="text-amber-500" /> Relojes_API_Sincronizados
              </h4>
              <div className="space-y-6">
                 {Object.entries(apiTimes).map(([name, time]) => (
                   <div key={name} className="flex justify-between items-center p-6 bg-zinc-950/60 rounded-3xl border border-white/5 group hover:border-white/20 transition-all">
                      <div>
                        <span className="text-[8px] font-black text-zinc-700 uppercase block mb-1">{name}</span>
                        <span className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors font-mono tracking-tighter">{time}</span>
                      </div>
                      <ShieldCheck size={18} className="text-zinc-800 group-hover:text-emerald-500" />
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-zinc-900/20 border border-white/5 rounded-[45px] p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-4">
                  <Waves size={16} /> Estabilidad_Temporal_VNM
                </h4>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                   <motion.div
                     animate={{ width: `${vnm * 100}%` }}
                     className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
                   />
                </div>
                <div className="flex justify-between text-[9px] font-black text-zinc-500 uppercase">
                  <span>Deriva de Fase</span>
                  <span className="text-white">{(1 - vnm).toFixed(4)} Hz</span>
                </div>
              </div>

              <button className="w-full py-6 rounded-3xl bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4">
                 <Ghost size={16} /> Recalibrar_Sincronía
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
