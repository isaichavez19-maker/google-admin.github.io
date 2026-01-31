
import React, { useState, useEffect } from 'react';
import { Book, Zap, Activity } from 'lucide-react';

interface Props {
  vnmFlow: number;
  genesisTime: string;
}

// @google/genai - Dominus Umbrea Aether Tracking - Letra DMZ
export const AetherLog: React.FC<Props> = ({ vnmFlow, genesisTime }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      "CALIBRANDO_RELOJ_ATÓMICO",
      "ESTABLECIENDO_NODO_DOMINUS",
      "SINC_FASE_LETRA_DMZ",
      "BLOQUE_GÉNESIS_VALIDADO",
      "MIMESIS_FLUX_ACTIVO",
      "VNM_SINC_ESTABLECIDA",
      "AUDITANDO_THORNE_VECTORS",
      "NÚCLEO_UMBREA_OPERATIVO"
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 12)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between shrink-0">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
          <Book size={14} className="text-amber-500" /> LOG_DE_AETHER
        </h4>
        <span className="text-[8px] font-mono text-zinc-700">{genesisTime}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 font-mono pr-2">
        {logs.map((log, i) => (
          <div key={i} className="text-[9px] text-zinc-500 animate-fadeIn flex gap-2">
            <span className="text-amber-500/40 shrink-0">»</span>
            <span className="truncate">{log}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 gap-2">
            <Activity size={20} />
            <span className="text-[8px] uppercase tracking-widest">Iniciando Buffer...</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/5 space-y-4 shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">VNM_Flow_State</span>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-zinc-500">{(vnmFlow * 100).toFixed(1)}%</span>
            <Zap size={10} className={vnmFlow > 0.8 ? "text-cyan-500 shadow-[0_0_8px_#06b6d4]" : "text-zinc-800"} />
          </div>
        </div>
        <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div
            className="h-full bg-amber-500 transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.3)] rounded-full"
            style={{ width: `${Math.min(100, vnmFlow * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
