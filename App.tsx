
import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import {
  Fingerprint, Zap, Skull, Activity, Radio as RadioIcon, Flame, MessageSquare, Upload, History, Boxes, Shield, Loader2, AlertCircle, Heart, TrendingUp, Disc, Hexagon, Waves, Sun, Rocket, LayoutDashboard, Settings, Eye, Volume2, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from './services/geminiService.ts';
import { decode, decodeAudioData } from './services/audioService.ts';
import { vocalHost, createPcmBlob } from './services/vocalEngine.ts';
import { mqc } from './services/systemCore.ts';
import { DeploymentDashboard } from './components/DeploymentDashboard.tsx';
import { ForensicReport } from './components/ForensicReport.tsx';
import { TheKiln } from './components/TheKiln.tsx';
import { RightsModule } from './components/RightsModule.tsx';

// Lazy Components for optimization
const NexusModule = lazy(() => import('./components/NexusModule.tsx').then(m => ({ default: m.NexusModule })));
const VocalForge = lazy(() => import('./components/VocalForge.tsx').then(m => ({ default: m.VocalForge })));
const BioSyncModule = lazy(() => import('./components/BioSyncModule.tsx').then(m => ({ default: m.BioSyncModule })));
const IngestaModule = lazy(() => import('./components/IngestaModule.tsx').then(m => ({ default: m.IngestaModule })));
const RadioModule = lazy(() => import('./components/RadioModule.tsx').then(m => ({ default: m.RadioModule })));
const HistoryModule = lazy(() => import('./components/HistoryModule.tsx').then(m => ({ default: m.HistoryModule })));
const TrojanCore = lazy(() => import('./components/TrojanCore.tsx').then(m => ({ default: m.TrojanCore })));

const VoidLoader = ({ label = "Sincronizando_Córtex..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 animate-pulse">
    <Loader2 size={40} className="text-yellow-500 animate-spin" />
    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">{label}</span>
  </div>
);

type ActiveView = 'dashboard' | 'vortex' | 'nexus' | 'radio' | 'bio' | 'ingesta' | 'history' | 'forensic' | 'trojan' | 'rights';

export default function App() {
  const [view, setView] = useState<ActiveView>('dashboard');
  const [isLive, setIsLive] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [status, setStatus] = useState(mqc.getStatus());
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128).fill(0));
  const [isKilnOpen, setIsKilnOpen] = useState(false);

  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const syncLoop = () => {
      setStatus(mqc.getStatus());
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        setAudioData(data);
      }
      requestAnimationFrame(syncLoop);
    };
    requestAnimationFrame(syncLoop);
  }, []);

  const toggleMimesis = async () => {
    if (!status.dna.prefs.permissions.vocal_imitation) {
      mqc.addLog("ERR: Permiso de imitación vocal denegado por el Arquitecto.");
      setView('rights');
      return;
    }

    if (isLive) {
      if (liveSessionRef.current) await liveSessionRef.current.close().catch(() => {});
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsLive(false);
      mqc.addLog("VORTEX_CLOSED: La frecuencia retorna al silencio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      vocalHost.init(ctx);
      analyserRef.current = vocalHost.getAnalyser();

      const sessionPromise = geminiService.connectVocalForge({
        onopen: () => {
          setIsLive(true);
          mqc.addLog("VORTEX_CONNECTED: Aquiles Aureus activo.");
        },
        onmessage: async (m) => {
          const b64 = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = m.serverContent?.modelTurn?.parts?.[0]?.text;
          if (text) mqc.updateDNAFromText(text);
          if (b64 && ctx.state !== 'closed') {
            setIsAiTalking(true);
            try {
              const buf = await decodeAudioData(decode(b64), ctx, 24000, 1);
              const src = ctx.createBufferSource();
              src.buffer = buf;
              src.connect(vocalHost.getInput() || ctx.destination);
              const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
              src.start(startTime);
              nextStartTimeRef.current = startTime + buf.duration;
              src.onended = () => { if (ctx.currentTime >= nextStartTimeRef.current - 0.05) setIsAiTalking(false); };
            } catch (e) { console.error("DSP_ERR", e); }
          }
        },
        onclose: () => setIsLive(false),
        onerror: () => setIsLive(false)
      });

      const sourceNode = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        let sum = 0; for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
        const rms = Math.sqrt(sum / inputData.length);
        sessionPromise.then(session => { if (isLive) session.sendRealtimeInput({ media: createPcmBlob(inputData) }); });
        mqc.registerSample(136.1, rms);
      };
      sourceNode.connect(processor);
      processor.connect(ctx.destination);
    } catch (e) { setIsLive(false); mqc.addLog("ERR: Fallo en la inicialización del hardware."); }
  };

  const navItems: { id: ActiveView; icon: any; color: string; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, color: 'text-zinc-400', label: 'Centro' },
    { id: 'rights', icon: ShieldCheck, color: 'text-yellow-500', label: 'Derechos' },
    { id: 'vortex', icon: Waves, color: 'text-yellow-500', label: 'Vórtex' },
    { id: 'nexus', icon: MessageSquare, color: 'text-cyan-500', label: 'Nexus' },
    { id: 'radio', icon: RadioIcon, color: 'text-purple-500', label: 'Radio' },
    { id: 'bio', icon: Heart, color: 'text-rose-500', label: 'BioSync' },
    { id: 'ingesta', icon: Upload, color: 'text-emerald-500', label: 'Ingesta' },
    { id: 'history', icon: History, color: 'text-amber-500', label: 'Ledger' },
    { id: 'forensic', icon: Shield, color: 'text-indigo-500', label: 'Forense' },
    { id: 'trojan', icon: Skull, color: 'text-red-600', label: 'Troya' },
  ];

  const roi = status.dna.roi;

  return (
    <div className="fixed inset-0 font-mono flex bg-[#020205] text-white overflow-hidden">

      {/* SIDEBAR DE DESPLIEGUE TOTAL */}
      <nav className="w-24 border-r border-white/5 flex flex-col items-center py-8 gap-4 bg-black/40 backdrop-blur-3xl z-50">
        <div className="mb-6 flex flex-col items-center gap-2">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${roi.deployment_ready ? 'bg-yellow-500 shadow-[0_0_20px_#EAB308]' : 'bg-zinc-900'}`}>
              <Rocket size={20} className={roi.deployment_ready ? 'text-black' : 'text-zinc-600'} />
           </div>
           <span className="text-[7px] font-black uppercase text-zinc-600">v4.0</span>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`group relative p-4 rounded-2xl transition-all duration-500 ${view === item.id ? 'bg-white/10 scale-110' : 'hover:bg-white/5'}`}
          >
            <item.icon size={22} className={`${view === item.id ? item.color : 'text-zinc-600 group-hover:text-zinc-300'}`} />
            <div className="absolute left-full ml-4 px-3 py-1 bg-zinc-900 text-[8px] font-black uppercase tracking-widest text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10">
              {item.label}
            </div>
          </button>
        ))}

        <div className="flex-1" />
        <button
          onClick={() => setIsKilnOpen(true)}
          className="p-4 text-red-600 hover:text-red-400 transition-colors animate-pulse"
        >
          <Flame size={20} />
        </button>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(234,179,8,0.02)_0%,_transparent_50%)]">

        {/* HEADER DE COMANDO */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/20 backdrop-blur-xl shrink-0 z-40">
          <div className="flex items-center gap-10">
            <div className={`w-14 h-14 rounded-3xl border flex items-center justify-center transition-all duration-700 ${isLive ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_30px_#EAB30833]' : 'border-white/5 bg-white/5'}`}>
              {isAiTalking ? <Disc size={28} className="text-yellow-500 animate-spin-slow" /> : <Hexagon size={28} className={isLive ? 'text-yellow-500' : 'text-zinc-700'} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                  {isLive ? 'Aquiles_Aureus' : 'Dominus_Deploy'}
                </h1>
                {roi.deployment_ready && <div className="px-3 py-1 bg-yellow-500 text-black text-[8px] font-black rounded-full animate-pulse">SOBERANÍA_ACTIVA</div>}
              </div>
              <p className="text-[9px] uppercase tracking-[0.4em] opacity-30 mt-1">Sincronía: {roi.convergence_index.toFixed(2)}% // VNM: {roi.vnm_index.toFixed(3)}</p>
            </div>
          </div>

          <div className="flex items-center gap-12">
             <div className="flex items-center gap-8 px-8 py-3 bg-zinc-950/80 rounded-[25px] border border-white/5">
                <div className="text-center">
                  <span className="text-[7px] font-black text-zinc-700 uppercase block mb-1">Mimesis_Idx</span>
                  <span className="text-sm font-black text-cyan-400">{status.dna.mimesis_index.toFixed(1)}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/5" />
                <div className="text-center">
                  <span className="text-[7px] font-black text-zinc-700 uppercase block mb-1">Lambda_Tensor</span>
                  <span className="text-sm font-black text-rose-500">{status.dna.lambda.toFixed(3)}</span>
                </div>
             </div>

             <button
               onClick={toggleMimesis}
               className={`px-12 py-5 rounded-[25px] text-[10px] font-black uppercase tracking-[0.4em] border transition-all duration-700 flex items-center gap-4 ${
                 isLive ? 'bg-black text-yellow-500 border-yellow-500 shadow-[0_0_60px_#EAB30866]' : 'bg-white text-black border-transparent hover:scale-105 active:scale-95'
               }`}
             >
               <Fingerprint size={20} /> {isLive ? 'CERRAR_VORTEX' : 'INICIAR_DESPLIEGUE'}
             </button>
          </div>
        </header>

        {/* ÁREA DE OPERACIONES */}
        <section className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
             <Suspense fallback={<VoidLoader />}>
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  {view === 'dashboard' && <DeploymentDashboard status={status} onDeploy={() => mqc.addLog("DESPLIEGUE_FINAL_INICIADO...")} />}
                  {view === 'rights' && <RightsModule />}
                  {view === 'vortex' && <VocalForge isLive={isLive} onToggle={toggleMimesis} />}
                  {view === 'nexus' && <NexusModule />}
                  {view === 'radio' && <RadioModule audioData={audioData} />}
                  {view === 'bio' && <BioSyncModule />}
                  {view === 'ingesta' && <IngestaModule />}
                  {view === 'history' && <HistoryModule />}
                  {view === 'forensic' && <ForensicReport />}
                  {view === 'trojan' && <TrojanCore onOpenKiln={() => setIsKilnOpen(true)} />}
                </motion.div>
             </Suspense>
          </AnimatePresence>
        </section>

        {/* BARRA DE ESTADO INFERIOR */}
        <footer className="h-16 border-t border-white/5 flex items-center px-12 justify-between bg-black/60 backdrop-blur-2xl shrink-0 z-40">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-800'}`} />
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Canal_Aureus</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${status.dna.dna_verified ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">ADN_{status.dna.dna_verified ? 'AUTÉNTICO' : 'FALTANTE'}</span>
              </div>
           </div>

           <div className="flex items-center gap-10">
              <div className="flex gap-1 items-end h-4">
                 {Array.from({ length: 24 }).map((_, i) => (
                   <motion.div
                     key={i}
                     animate={{ height: isAiTalking ? [4, 16, 4] : 4 }}
                     transition={{ duration: 0.5, delay: i * 0.02, repeat: Infinity }}
                     className={`w-0.5 rounded-full ${isAiTalking ? 'bg-yellow-500' : 'bg-zinc-900'}`}
                   />
                 ))}
              </div>
              <span className="text-[8px] font-black opacity-20 uppercase tracking-[0.8em]">Architect: dmz Ly // Vector: Charon // Sovereignty_Protocol: ACTIVE</span>
           </div>
        </footer>
      </main>

      {/* MODAL GLOBAL: EL HORNO */}
      <AnimatePresence>
        {isKilnOpen && (
          <TheKiln isOpen={isKilnOpen} onClose={() => setIsKilnOpen(false)} />
        )}
      </AnimatePresence>

      {/* Glitch Overlay Global */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay z-[100]" />
    </div>
  );
}
