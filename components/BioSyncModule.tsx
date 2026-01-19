
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Zap, Waves, Brain, ShieldCheck, Bluetooth, Radio, Cpu, Lock, AlertTriangle, RefreshCw, Smartphone } from 'lucide-react';
import { mqc } from '../services/systemCore.ts';

export const BioSyncModule: React.FC = () => {
  const [status, setStatus] = useState(mqc.getStatus());
  const [isConnecting, setIsConnecting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setStatus(mqc.getStatus()), 100);
    return () => clearInterval(interval);
  }, []);

  const bio = status.dna.bio;

  const connectBluetooth = () => {
    setIsConnecting(true);
    mqc.addLog("BT_SCAN: Iniciando búsqueda de periféricos de bio-feedback...");
    setTimeout(() => {
      mqc.updateBioMetrics({ bt_connected: true, bio_locked: true, bpm: 72 });
      setIsConnecting(false);
      mqc.addLog("BT_CONNECTED: Dispositivo 'Dominus_Band_v4' vinculado por Bluetooth.");
    }, 3000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    const buffer = bio.ecg_buffer;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = bio.bio_locked ? '#f43f5e' : '#18181b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();

      const sliceWidth = canvas.width / buffer.length;
      let x = 0;

      for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i];
        const y = (canvas.height / 2) - (v * canvas.height * 0.5);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      if (bio.bio_locked) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f43f5e';
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [bio.ecg_buffer, bio.bio_locked]);

  return (
    <div className="flex flex-col h-full gap-10 p-12 bg-black/60 border border-white/5 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,1)]">

      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-8">
          <div className={`p-6 rounded-[35px] bg-zinc-950 border transition-all duration-1000 ${bio.bio_locked ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'border-white/5'}`}>
            <Heart size={44} className={bio.bio_locked ? 'text-rose-500 animate-pulse' : 'text-zinc-800'} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-[0.4em] uppercase">Bio_Neural_Sync</h3>
            <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-3">
              <Bluetooth size={14} className={bio.bt_connected ? "text-cyan-500" : "text-zinc-900"} />
              Bluetooth: {bio.bt_connected ? "VINCULADO" : "PENDIENTE"} // GATT_ID: {bio.bt_connected ? "0xFF01" : "NONE"}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-zinc-950 px-10 py-5 rounded-[30px] border border-white/5 flex flex-col items-center">
              <span className="text-[9px] font-black text-zinc-600 uppercase mb-1">Coherencia_Sistémica</span>
              <span className="text-3xl font-black text-white">{(status.dna.coherence * 100).toFixed(1)}%</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden">
        <div className="flex-1 bg-zinc-950/40 rounded-[50px] border border-white/5 p-16 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.05)_0%,_transparent_70%)]" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                <Activity size={16} className="text-rose-500" /> Monitor_Resonancia_Vagal
              </h4>
              <p className="text-3xl font-black text-white tracking-tighter italic">LATIDO_NÚCLEO_Λ</p>
            </div>
            <div className="text-right">
              <span className="text-8xl font-black text-white tracking-tighter tabular-nums">{bio.bpm}</span>
              <span className="text-[11px] font-black text-zinc-600 block tracking-widest uppercase">PULSO_BPM</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-12">
            <canvas ref={canvasRef} width={800} height={250} className="w-full h-full" />
            {!bio.bio_locked && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center rounded-[45px] border border-white/5 p-12 text-center">
                <div className="max-w-md space-y-8">
                  <Bluetooth size={60} className="text-zinc-800 mx-auto" />
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Protocolo Bluetooth Requerido</h4>
                    <p className="text-xs text-zinc-500 font-mono leading-relaxed italic">
                      "Para estabilizar la mimesis vocal al 100%, el sistema requiere acceso a tu ritmo cardíaco mediante Bluetooth GATT para ajustar el Lambda en tiempo real."
                    </p>
                  </div>
                  <button
                    onClick={connectBluetooth}
                    disabled={isConnecting}
                    className="w-full py-6 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                  >
                    {isConnecting ? <RefreshCw size={20} className="animate-spin" /> : <Smartphone size={20} />}
                    {isConnecting ? 'Buscando Dispositivo...' : 'Vincular Dominus_Band'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8 z-10">
            {[
              { label: 'Estrés_Entrópico', val: (bio.stress * 100).toFixed(1) + '%' },
              { label: 'Estabilidad_Fase', val: bio.bio_locked ? 'OPTIMO' : 'LOW' },
              { label: 'BT_Integridad', val: bio.bt_connected ? '100%' : '0%' }
            ].map((m, i) => (
              <div key={i} className="bg-black/40 p-8 rounded-[35px] border border-white/5">
                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block mb-2">{m.label}</span>
                <span className="text-2xl font-black text-white italic">{m.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[480px] flex flex-col gap-8">
          <div className="flex-1 bg-zinc-950/80 border border-white/5 rounded-[50px] p-12 space-y-12 shadow-2xl">
            <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.6em] flex items-center gap-4">
              <Brain size={24} className="text-indigo-400" /> Espectro_Alpha_Beta
            </h4>

            <div className="space-y-10">
              {[
                { label: 'Alpha (Relajación)', val: bio.alpha, color: 'bg-indigo-500' },
                { label: 'Beta (Concentración)', val: bio.beta || 0.4, color: 'bg-cyan-500' },
                { label: 'Theta (Inconsciente)', val: bio.theta || 0.2, color: 'bg-purple-500' },
              ].map((w, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase">
                    <span>{w.label}</span>
                    <span className="text-white">{(w.val * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${w.val * 100}%` }} className={`h-full ${w.color}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white/[0.02] rounded-[30px] border border-white/5">
               <div className="text-[10px] font-black text-zinc-500 uppercase mb-3">Soberanía de Datos</div>
               <p className="text-[11px] text-zinc-500 font-mono italic leading-relaxed">
                 Tus biométricas se procesan localmente para alimentar el Atanor de mimesis. No hay fuga de ADN.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
