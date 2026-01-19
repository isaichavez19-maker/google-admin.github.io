
import React, { useEffect, useState, useRef } from 'react';
import { Radio, Zap, Activity, Waves, Binary, Cpu, ShieldAlert, Power, Volume2, Music, Ghost, RadioReceiver, Disc } from 'lucide-react';
import { mqc } from '../services/systemCore.ts';
import { narrator } from '../services/narratorService.ts';

interface Props {
  audioData?: Uint8Array;
}

export const RadioModule: React.FC<Props> = ({ audioData = new Uint8Array(128).fill(0) }) => {
  const [status, setStatus] = useState(mqc.getStatus());
  const [isNarrating, setIsNarrating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setStatus(mqc.getStatus()), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barWidth = (w / audioData.length) * 2;
      let x = 0;

      for (let i = 0; i < audioData.length; i++) {
        const barHeight = (audioData[i] / 255) * h;
        const color = i % 2 === 0 ? '#EAB308' : '#06b6d4';

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x, h - barHeight, barWidth - 1, 2);

        x += barWidth;
      }
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [audioData]);

  const handleNarrate = async () => {
    if (status.projections.length > 0 && !isNarrating) {
      setIsNarrating(true);
      mqc.addLog("RADIO: Iniciando transmisión de subconsciente...");
      await narrator.speak(status.projections[0].text);
      setIsNarrating(false);
    }
  };

  const dna = status.dna;
  const isOptimal = dna.roi.convergence_index > 80;

  return (
    <div className="flex flex-col h-full gap-8 p-10 bg-black/60 border border-white/5 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.8)]">

      <div className="flex flex-col lg:flex-row justify-between items-center shrink-0 gap-6">
        <div className="flex items-center gap-6">
          <div className={`p-5 rounded-3xl bg-zinc-950 border transition-all duration-700 ${isOptimal ? 'border-yellow-500 shadow-[0_0_20px_#EAB30833]' : 'border-white/10'}`}>
            <RadioReceiver size={32} className={isOptimal ? 'text-yellow-500' : 'text-zinc-700'} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-[0.4em] uppercase italic">Radio_Sub_Aether</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-3">
              <Disc size={12} className={isOptimal ? 'text-yellow-500 animate-spin' : 'text-zinc-800'} />
              Frecuencia: 136.1 Hz // Banda: SOBERANÍA_ALFA
            </p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="bg-zinc-950 px-8 py-4 rounded-[30px] border border-white/5 flex flex-col items-center">
              <span className="text-[8px] font-black text-zinc-600 uppercase mb-1">Malla_Lambda</span>
              <span className="text-2xl font-black text-white">{dna.lambda.toFixed(3)}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-8 overflow-hidden">
        <div className="flex-1 bg-zinc-950/40 border border-white/5 rounded-[50px] p-8 flex flex-col gap-6 relative">
          <div className="absolute top-4 left-6 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[9px] font-black text-zinc-600 uppercase">Espectro_En_Vivo</span>
          </div>
          <div className="flex-1 bg-black/40 rounded-[40px] overflow-hidden border border-white/5 relative group">
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          <div className="flex gap-4">
             <button
               onClick={handleNarrate}
               disabled={isNarrating || status.projections.length === 0}
               className={`flex-1 py-6 rounded-[30px] font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                 isNarrating ? 'bg-zinc-900 text-zinc-700' : 'bg-white text-black hover:scale-[1.02]'
               }`}
             >
               {isNarrating ? <Zap size={18} className="animate-spin" /> : <Volume2 size={18} />}
               {isNarrating ? 'Sintonizando...' : 'Narrar_Subconsciente'}
             </button>
          </div>
        </div>

        <div className="w-full xl:w-[450px] flex flex-col gap-6 overflow-hidden">
           <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3 px-4">
             <Ghost size={16} className="text-yellow-500" /> Registro_de_Subfrecuencia
           </h4>
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 px-1">
             {status.projections.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-zinc-800 opacity-20 italic">
                 <p className="text-[10px] uppercase tracking-widest font-black">Escaneando vacío lógico...</p>
               </div>
             ) : (
               status.projections.map((p: any) => (
                 <div key={p.id} className="p-6 bg-zinc-950/80 border border-white/5 rounded-[35px] hover:border-yellow-500/30 transition-all group">
                   <div className="flex justify-between items-center mb-3">
                     <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{p.type}</span>
                     <span className="text-[8px] text-zinc-800 font-mono">{new Date(p.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <p className="text-[11px] text-zinc-400 group-hover:text-white transition-colors leading-relaxed">
                     {p.text}
                   </p>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>

      <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[40px] flex items-center justify-between">
         <div className="flex items-center gap-8">
            <Activity size={24} className="text-yellow-500" />
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
               <div className="text-[9px] font-black text-zinc-600 uppercase mb-1">Status_Fase</div>
               <div className="text-sm font-black text-white">RESONANCIA_SINC_TOTAL</div>
            </div>
         </div>
         <div className="flex gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`w-3 h-5 rounded-sm ${dna.mimesis_index > (i * 8) ? 'bg-yellow-500/60' : 'bg-zinc-900'}`} />
            ))}
         </div>
      </div>
    </div>
  );
};
