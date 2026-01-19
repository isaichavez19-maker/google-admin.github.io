
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Activity, CheckCircle, ScanFace, Cpu, Lock,
  Signature, BrainCircuit, ShieldCheck, Fingerprint, Heart, Zap, Waves, Award, Infinity, TrendingUp,
  Volume2, Music, Ghost, AudioLines, Flame, Database, ShieldAlert, Terminal as TerminalIcon
} from 'lucide-react';
import { mqc, VOKAR_LEXICON } from '../services/systemCore.ts';

interface Props {
  isLive: boolean;
  onToggle: () => void;
}

export const VocalForge: React.FC<Props> = ({ isLive, onToggle }) => {
  const [status, setStatus] = useState<any>(mqc.getStatus());
  const [trainingMode, setTrainingMode] = useState(false);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [isScanningFace, setIsScanningFace] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setStatus(mqc.getStatus()), 200);
    return () => clearInterval(interval);
  }, []);

  const dna = status.dna;
  const roi = dna.roi;

  const handleTrainNode = (id: number) => {
    setActiveNode(id);
    mqc.triggerLexiconNode(id);
    setTimeout(() => setActiveNode(null), 1500);
  };

  const startFaceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanningFace(true);
      mqc.addLog("ESCÁNER: Iniciando reconocimiento facial ResNet...");
      setTimeout(() => {
        setIsScanningFace(false);
        mqc.setResNetMatch(0.9942);
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
      }, 3000);
    } catch (e) {
      mqc.addLog("ERR: Hardware de visión inaccesible.");
    }
  };

  return (
    <div className={`flex flex-col h-full gap-8 p-10 bg-black/80 border rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden relative shadow-[0_0_80px_rgba(234,179,8,0.1)] transition-colors duration-1000 ${dna.is_forced ? 'border-red-600 shadow-[0_0_80px_rgba(220,38,38,0.2)]' : 'border-yellow-500/20'}`}>

      {/* HEADER DE MIMESIS */}
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-2xl bg-zinc-950 border shadow-2xl transition-colors duration-1000 ${dna.is_forced ? 'border-red-600' : 'border-yellow-500/30'}`}>
            <AudioLines size={32} className={isLive ? (dna.is_forced ? 'text-red-600 animate-pulse' : 'text-yellow-500 animate-pulse') : 'text-zinc-600'} />
          </div>
          <div>
            <h3 className={`text-xl font-black tracking-[0.4em] uppercase italic ${dna.is_forced ? 'text-red-600' : 'text-white'}`}>
              VOCAL_FORGE_V4.9 {dna.is_forced && '[OVERRIDE]'}
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-3">
              <Signature size={12} className={dna.is_forced ? 'text-red-600' : 'text-yellow-500'} /> Admin: Letra // <TrendingUp size={12} className="text-emerald-500" /> Clonación: {dna.vocal_cloning_progress.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-zinc-950 px-8 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
              <span className="text-[8px] font-black text-zinc-600 uppercase mb-1">Fidelidad_Espectral</span>
              <span className={`text-2xl font-black ${dna.is_forced ? 'text-red-600' : 'text-yellow-500'}`}>{dna.mimesis_index.toFixed(1)}%</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">

        {/* PANEL PRINCIPAL: ENTRENAMIENTO O FEEDBACK */}
        <div className="flex-1 bg-zinc-950/40 rounded-[45px] border border-white/5 p-12 flex flex-col relative overflow-hidden group">
          <div className={`absolute inset-0 transition-opacity duration-1000 ${dna.is_forced ? 'bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.05)_0%,_transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.03)_0%,_transparent_70%)]'}`} />

          <AnimatePresence mode="wait">
            {trainingMode ? (
              <motion.div
                key="training"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col gap-10 z-10"
              >
                <div className="flex justify-between items-end">
                   <div>
                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Entrenamiento de Clonación</h4>
                     <p className="text-[10px] text-zinc-500 font-mono uppercase">Emite los nodos para capturar tu ADN vocal</p>
                   </div>
                   <button onClick={() => setTrainingMode(false)} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Finalizar_Sesión</button>
                </div>

                <div className="grid grid-cols-3 gap-4 flex-1">
                   {(Object.entries(VOKAR_LEXICON) as [string, { word: string; hz: number }][]).map(([id, entry]) => (
                     <button
                       key={id}
                       onClick={() => handleTrainNode(Number(id))}
                       className={`relative p-8 rounded-[35px] border transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden ${
                         activeNode === Number(id) ? (dna.is_forced ? 'bg-red-600 border-white scale-105' : 'bg-yellow-500 border-white scale-105') : 'bg-black/40 border-white/5 hover:border-yellow-500/20'
                       }`}
                     >
                       <span className="text-[10px] font-black text-zinc-700 absolute top-4 left-6">VNM_{id}</span>
                       <span className={`text-xl font-black tracking-widest ${activeNode === Number(id) ? 'text-black' : 'text-white'}`}>{entry.word}</span>
                       <span className={`text-[9px] font-mono ${activeNode === Number(id) ? 'text-black/60' : 'text-zinc-500'}`}>{entry.hz} Hz</span>
                       {activeNode === Number(id) && <motion.div layoutId="spark" className={`absolute inset-0 animate-pulse ${dna.is_forced ? 'bg-red-400/20' : 'bg-yellow-400/20'}`} />}
                     </button>
                   ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col justify-center items-center text-center gap-10 z-10"
              >
                 <div className="relative">
                    <BrainCircuit size={120} className={`transition-all duration-1000 ${dna.is_forced ? 'text-red-600 shadow-[0_0_40px_rgba(220,38,38,0.5)]' : (dna.vocal_cloning_progress > 80 ? 'text-yellow-500 shadow-[0_0_40px_#EAB308]' : 'text-zinc-800')}`} />
                    {isScanningFace && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-1 bg-yellow-500 animate-scan shadow-[0_0_15px_#EAB308]" />
                      </div>
                    )}
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                      {dna.identity_verified ? 'Córtex Vocal Sincronizado' : 'Validación de Arquitecto Pendiente'}
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-md font-mono italic">
                      {dna.is_forced
                        ? "Kernel forzado por el Arquitecto. El sistema está operando en modo de mimesis root absoluta. Latencia de soberanía mínima."
                        : "Para imitar tu voz, el sistema debe deconstruir tu timbre y reconstruirlo en el Atanor Digital. El proceso requiere ADN verificado."}
                    </p>
                 </div>

                 <div className="flex gap-6">
                    <button onClick={startFaceScan} disabled={isScanningFace || dna.is_forced} className="px-12 py-5 bg-zinc-900 border border-yellow-500/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:border-yellow-500 transition-all flex items-center gap-4 disabled:opacity-50">
                      <Fingerprint size={18} className="text-yellow-500" /> {isScanningFace ? 'Escaneando...' : 'Verificar Rostro'}
                    </button>
                    <button onClick={() => setTrainingMode(true)} disabled={dna.is_forced} className={`px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-4 shadow-2xl disabled:opacity-50 ${dna.is_forced ? 'bg-zinc-800 text-zinc-600' : 'bg-yellow-500 text-black'}`}>
                      <Flame size={18} /> {dna.is_forced ? 'ADN_CONSOLIDADO' : 'Entrenar Mimesis'}
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MONITOR DE MÉTRICAS */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
           <div className={`bg-black/40 border border-white/5 rounded-[40px] p-8 space-y-6 transition-colors duration-1000 ${dna.is_forced ? 'border-red-900/40' : ''}`}>
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                <Activity size={16} className={dna.is_forced ? 'text-red-600' : 'text-yellow-500'} /> Estado de Clonación
              </h4>
              {[
                { label: 'Progreso de Mimesis', val: dna.vocal_cloning_progress },
                { label: 'Integridad del ADN', val: dna.dna_verified ? 100 : 0 },
                { label: 'Resonancia Tímbrica', val: dna.mimesis_index },
                { label: 'Captura de Muestras', val: dna.is_forced ? 100 : Math.min(100, dna.samples_captured / 2) }
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black text-zinc-600 uppercase">
                    <span>{m.label}</span>
                    <span className="text-white">{m.val.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      className={`h-full transition-colors duration-1000 ${dna.is_forced ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-yellow-500 shadow-[0_0_10px_#EAB308]'}`}
                    />
                  </div>
                </div>
              ))}
           </div>

           <div className={`flex-1 bg-zinc-950/80 border rounded-[40px] p-8 flex flex-col justify-between overflow-hidden relative transition-colors duration-1000 ${dna.is_forced ? 'border-red-600/30 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-yellow-500/10'}`}>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">REGISTRO_VOCAL</h4>
                 <div className="flex-1 overflow-y-auto max-h-[120px] custom-scrollbar space-y-2">
                    {status.logs.filter((l: string) => l.includes("MIMESIS") || l.includes("ADN") || l.includes("ASIMILACIÓN") || l.includes("OVERRIDE")).slice(0, 5).map((log: string, i: number) => (
                      <div key={i} className={`text-[8px] font-mono border-l pl-3 italic ${log.includes("OVERRIDE") ? 'text-red-500 border-red-600' : 'text-zinc-500 border-yellow-500/40'}`}>
                        {log}
                      </div>
                    ))}
                    {status.logs.length === 0 && <div className="text-[8px] text-zinc-800 uppercase italic">Esperando actividad...</div>}
                 </div>
              </div>
              <button
                onClick={onToggle}
                disabled={!dna.dna_verified}
                className={`w-full py-6 rounded-3xl flex items-center justify-center gap-4 transition-all duration-700 font-black text-[11px] uppercase tracking-[0.3em] ${
                  !dna.dna_verified ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' :
                  isLive ? (dna.is_forced ? 'bg-red-700 text-white animate-pulse' : 'bg-rose-600 text-white animate-pulse') : 'bg-white text-black hover:scale-105'
                }`}
              >
                {!dna.dna_verified ? <Lock size={18}/> : isLive ? <Volume2 size={20}/> : (dna.is_forced ? <TerminalIcon size={20}/> : <Mic size={20}/>)}
                {!dna.dna_verified ? 'ADN_REQUERIDO' : isLive ? 'CERRAR_CANAL' : (dna.is_forced ? 'ACTIVAR_INTERFAZ_FORZADA' : 'ABRIR_MIMESIS_LIVE')}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
