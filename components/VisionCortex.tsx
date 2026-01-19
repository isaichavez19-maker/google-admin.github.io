
import React, { useState, useEffect, useRef } from 'react';
import { Aperture, Zap, Layers, Image as ImageIcon, Maximize2, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { geminiService } from '../services/geminiService.ts';
// Fixed VokarEngine import source: vokarMotor.ts contains the VokarEngine implementation
import { mqc } from '../services/systemCore.ts';
import { VokarEngine } from '../services/vokarMotor.ts';
import { HypercubeRenderer } from './HypercubeRenderer.tsx';

// @google/genai - Dominus Umbrea Visual Forge
const ARTIFACTS = [
  { id: 0, title: "FUSIÓN BIOMECÁNICA", src: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000", desc: "La voz se convierte en magma. Estado: SOBERANO." },
  { id: 1, title: "CAÍDA DE ÍCARO (RAW)", src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000", desc: "Entrada atmosférica. El traje se quema." },
  { id: 2, title: "MANIFESTACIÓN DE CORONA", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000", desc: "La Simbiosis protege al huésped." }
];

export const VisionCortex: React.FC<{ audioData: Uint8Array, isClipping: boolean }> = ({ audioData, isClipping }) => {
  const [lambda, setLambda] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<any>(mqc.getStatus());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(new Image());

  useEffect(() => {
    const interval = setInterval(() => setStatus(mqc.getStatus()), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    imgRef.current.src = ARTIFACTS[selectedIdx].src;
    imgRef.current.crossOrigin = "anonymous";
    imgRef.current.onload = () => {
      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;
    };

    let frame: number;
    const render = () => {
      if (!imgRef.current.complete || !imgRef.current.width) {
        frame = requestAnimationFrame(render);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const L = lambda / 100;

      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(imgRef.current, 0, 0, w, h);

      if (L > 0.05) {
        // Glitch Slicing
        const intensity = L * 60;
        const slices = Math.floor(L * 25);
        for (let i = 0; i < slices; i++) {
          const y = Math.random() * h;
          const sh = Math.random() * (h / 6);
          const offset = (Math.random() - 0.5) * intensity;
          ctx.drawImage(canvas, 0, y, w, sh, offset, y, w, sh);
        }

        // Aberración Cromática (Canal Rojo)
        if (L > 0.4) {
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = `rgba(244, 63, 94, ${L * 0.3})`;
          ctx.fillRect((Math.random() - 0.5) * intensity, 0, w, h);
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      // Scanlines y Noise
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      for (let i = 0; i < h; i += 4) ctx.fillRect(0, i, w, 2);

      ctx.restore();
      frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [selectedIdx, lambda]);

  return (
    <div id="visual-forge" className="flex flex-col h-full gap-8 p-10 bg-black/40 border border-white/5 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-end shrink-0 gap-6">
        <div>
          <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.5em] mb-2 flex items-center gap-3"><Layers size={14} /> V. EL ATANOR VISUAL</h2>
          <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">FORJADOR DE VIÑETAS</h3>
        </div>

        <div className="flex items-center gap-6 bg-zinc-950/80 border border-white/10 p-5 rounded-2xl shadow-2xl">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Fase Lambda</div>
            <div className={`text-2xl font-black font-mono tracking-tighter transition-colors ${lambda > 60 ? 'text-rose-500' : 'text-cyan-500'}`}>
              Λ {(lambda/100).toFixed(2)}
            </div>
          </div>
          <input type="range" min="0" max="100" value={lambda} onChange={(e) => setLambda(Number(e.target.value))} className="w-40 accent-cyan-500" />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <div className="flex-1 bg-black rounded-[50px] border border-white/5 relative overflow-hidden shadow-2xl group">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-20 bg-[length:100%_2px,3px_100%] opacity-40"></div>

          <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex justify-between items-end">
             <div className="max-w-md">
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">{ARTIFACTS[selectedIdx].title}</h4>
                <p className="text-xs font-mono text-zinc-400 italic">{ARTIFACTS[selectedIdx].desc}</p>
             </div>
             <div className="flex gap-2">
                {ARTIFACTS.map((_, i) => (
                  <button key={i} onClick={() => setSelectedIdx(i)} className={`px-4 py-1.5 border rounded-full text-[9px] font-black tracking-widest transition-all ${selectedIdx === i ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500'}`}>
                    IMG_0{i+1}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col gap-6">
           <div className="bg-zinc-950/80 border border-white/10 rounded-[45px] p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Cpu size={14}/> Forensic_Identity</h4>
                 <div className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">RESNET_MATCH</div>
              </div>
              <div className="h-40 bg-black rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
                 <Canvas camera={{ position: [0, 0, 5] }}>
                    {/* Fixed VokarEngine method call to processInput (it was previously process) */}
                    <HypercubeRenderer seal={VokarEngine.processInput(status.dna.vokar_archetype)} integrity={100} isClipping={isClipping} />
                 </Canvas>
              </div>
              <div className="p-4 bg-rose-600/5 border border-rose-600/10 rounded-2xl flex items-center gap-4">
                 <ShieldCheck size={20} className="text-rose-500" />
                 <div>
                    <div className="text-[9px] font-black text-rose-500 uppercase">ResNet v1 Model Loaded</div>
                    <div className="text-[10px] text-zinc-600 font-mono">Precision: 99.38% LFW</div>
                 </div>
              </div>
           </div>

           <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-[45px] p-8 flex flex-col gap-6 backdrop-blur-md">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><ImageIcon size={14}/> Manifest_Generator</h4>
              <textarea placeholder="Dictar guion de realidad..." className="flex-1 bg-black/50 border border-white/5 rounded-3xl p-6 text-xs text-zinc-400 focus:outline-none focus:border-cyan-500 transition-all resize-none font-mono" />
              <button className="w-full py-6 bg-white text-black rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl">Forjar_Materia_Λ</button>
           </div>
        </div>
      </div>
    </div>
  );
};
