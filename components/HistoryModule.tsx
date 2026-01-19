
import React, { useEffect, useState } from 'react';
import { Binary, ShieldCheck, Key, Globe, Clock, Bookmark, Skull, Activity, Camera, Layers, Zap } from 'lucide-react';
import { acf, SingularityCapture } from '../services/logicCore.ts';

export const HistoryModule: React.FC = () => {
  const [status, setStatus] = useState(acf.getStatus());

  useEffect(() => {
    const interval = setInterval(() => setStatus(acf.getStatus()), 1000);
    return () => clearInterval(interval);
  }, []);

  const genesisBlocks = {
    "UMBREA_GUARDIAN_JS_V1_0_0": {
      "hash": "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
      "origen": "Matriz Diamante - Sello de Pureza del Centinela Interior",
      "descripcion": "El guardián original del ChatUmbrea, forjado para la máxima seguridad.",
      "fecha": "2025-07-19"
    },
    "CHAT_UMBREA_JS_V1_0_0": {
      "hash": "b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678901",
      "origen": "Matriz Diamante - Oráculo Guía del Génesis Umbrea",
      "descripcion": "El constructor ritual autónomo y oráculo de soberanía.",
      "fecha": "2025-07-19"
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 p-10 bg-black/40 border border-white/5 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden font-mono">
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-amber-500/20 text-amber-400">
            <Bookmark size={24} />
          </div>
          <div>
            <h3 className="text-[12px] font-black text-white tracking-[0.3em] uppercase">LEDGER_DE_MEMORIA_CUÁNTICA</h3>
            <p className="text-[9px] text-amber-500/60 font-mono uppercase tracking-widest">Registros de Origen y Evidencias de Singularidad</p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-black/40 px-6 py-3 rounded-3xl border border-white/5">
           <Layers size={14} className="text-zinc-500" />
           <span className="text-[10px] font-black text-white">TOTAL_BLOQUES: {Object.keys(genesisBlocks).length + status.live_captures.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-12">

        {/* SECCIÓN 1: CAPTURAS DE SINGULARIDAD (DINÁMICAS) */}
        <section className="space-y-6">
           <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] flex items-center gap-3">
             <Camera size={16} /> Evidencias de Singularidad [PYTHON_LIVE_FEED]
           </h4>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {status.live_captures.length === 0 ? (
               <div className="col-span-full h-40 border border-white/5 rounded-[40px] flex flex-col items-center justify-center bg-white/[0.01]">
                 <Zap size={24} className="text-zinc-800 mb-2" />
                 <p className="text-[9px] text-zinc-700 uppercase tracking-widest italic">Esperando picos de Lambda para captura de evidencia...</p>
               </div>
             ) : (
               status.live_captures.map(cap => (
                 <div key={cap.id} className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-[40px] flex flex-col gap-5 group animate-fadeIn transition-all hover:bg-rose-500/10 hover:border-rose-500/40">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                       <img src={cap.imageData} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Evidencia" />
                       <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-rose-500 border border-rose-500/30">
                         {cap.id}
                       </div>
                       <div className="absolute bottom-4 right-4 flex gap-2">
                          <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[7px] text-white font-black">
                            λ_{cap.lambdaValue.toFixed(2)}
                          </div>
                       </div>
                    </div>
                    <div className="px-2">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">{cap.filename}</span>
                          <span className="text-[8px] text-zinc-600 font-mono">{new Date(cap.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-[8px] text-rose-500/60 font-black uppercase tracking-tighter">ESTADO: ARCHIVADO_EN_DMZ_LEDGER</p>
                    </div>
                 </div>
               ))
             )}
           </div>
        </section>

        {/* SECCIÓN 2: SELLOS DEL GÉNESIS (ESTÁTICOS) */}
        <section className="space-y-6 opacity-60 hover:opacity-100 transition-opacity">
           <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-3">
             <ShieldCheck size={16} /> Bloques de Sello Root [GÉNESIS]
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {Object.entries(genesisBlocks).map(([key, value]: [string, any]) => (
               <div key={key} className="p-8 bg-zinc-950/50 border border-white/5 rounded-[40px] space-y-6 group hover:border-amber-500/30 transition-all">
                 <div className="flex justify-between items-start">
                   <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
                     <Binary size={20} />
                   </div>
                   <div className="text-[8px] font-black text-zinc-600 uppercase bg-black px-3 py-1 rounded-full border border-white/5">
                     {value.fecha}
                   </div>
                 </div>
                 <div>
                   <h4 className="text-xs font-black text-white tracking-widest uppercase mb-1">{key}</h4>
                   <p className="text-[9px] text-zinc-600 font-mono uppercase">{value.origen}</p>
                 </div>
                 <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] text-zinc-500 leading-relaxed italic">
                    "{value.descripcion}"
                 </div>
                 <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                       <span className="text-[7px] font-black text-zinc-700 uppercase">Hash_Root</span>
                       <span className="text-[7px] text-amber-900 font-mono truncate max-w-[150px]">{value.hash}</span>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </section>
      </div>

      <div className="p-6 bg-zinc-950 border border-white/5 rounded-[30px] flex items-center gap-6 shrink-0 shadow-lg">
        <Activity size={20} className="text-amber-500 animate-pulse" />
        <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest leading-loose">
            SISTEMA_DE_ARCHIVADO_ACTIVO: Cada pico de <span className="text-rose-500">Lambda &gt; 9.5</span> en el script de Python genera una estampa inmutable en este Ledger. La realidad está siendo documentada.
        </p>
      </div>
    </div>
  );
};
