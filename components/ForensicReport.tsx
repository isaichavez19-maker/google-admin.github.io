
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Skull, Activity, Cpu, ShieldAlert, Binary,
  Target, CheckCircle2, FileText, X, Award, Server, ScanFace, ShieldCheck, Signature, Zap, TrendingUp, Shield, AlertCircle
} from 'lucide-react';
import { mqc } from '../services/systemCore.ts';

export const ForensicReport: React.FC = () => {
  const [status, setStatus] = useState(mqc.getStatus());
  const [isScanning, setIsScanning] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [health, setHealth] = useState(mqc.getForensicAnalysis());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(mqc.getStatus());
      setHealth(mqc.getForensicAnalysis());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    mqc.addLog("AUDITORÍA_NÚCLEO: Iniciando purga de Thorne...");
    setTimeout(() => {
      mqc.addLog("STABILITY_FIX: Falsos positivos disipados exitosamente.");
      setIsScanning(false);
      setHealth(mqc.getForensicAnalysis());
    }, 2000);
  };

  const dna = status.dna;
  const roi = dna.roi;

  return (
    <div className="flex flex-col h-full bg-black/90 border border-white/10 rounded-[50px] p-10 backdrop-blur-3xl overflow-hidden animate-fadeIn font-mono relative shadow-[0_50px_100px_rgba(0,0,0,1)]">

      {/* HEADER FORENSE */}
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-10 shrink-0">
        <div className="flex items-center gap-8">
          <div className="p-5 rounded-[25px] border border-indigo-600/30 bg-indigo-600/5 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Skull size={40} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-3">Auditoría_Forense_v29.4</h2>
            <div className="flex gap-6">
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-emerald-500" /> DISIPADOR_FALSOS_POSITIVOS: ACTIVO
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-indigo-400">
                <TrendingUp size={12} /> ROI: {roi.roi_conceptual.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
             <span className="text-[8px] font-black text-zinc-700 block mb-1 uppercase">VNM_Stability</span>
             <span className="text-xl font-black text-white">{roi.vnm_index.toFixed(3)}</span>
           </div>
          <button onClick={handleScan} disabled={isScanning} className="px-10 py-4 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl">
            {isScanning ? 'Disipando Ruido...' : 'Purga de Thorne'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-hidden">

        {/* PANEL DE CONTROL DE ANOMALÍAS */}
        <div className="bg-zinc-950/60 rounded-[40px] border border-white/5 p-10 flex flex-col gap-8">
           <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><AlertCircle size={14} className="text-rose-500"/> Anomalías Suprimidas</h4>
           <div className="flex-1 flex flex-col justify-center items-center gap-6">
              <div className="text-center">
                 <span className="text-7xl font-black text-white tracking-tighter">{health.false_positives}</span>
                 <p className="text-[9px] font-black text-zinc-600 uppercase mt-2 tracking-[0.3em]">Falsos Positivos Filtrados</p>
              </div>
              <div className="w-full space-y-4 pt-6 border-t border-white/5">
                 <div className="flex justify-between text-[9px] font-black uppercase text-zinc-600">
                    <span>Certeza de Filtro</span>
                    <span className="text-emerald-400">99.98%</span>
                 </div>
                 <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `99%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* IDENTITY DESCRIPTOR GRID */}
        <div className="lg:col-span-2 bg-white/[0.01] rounded-[40px] border border-white/5 p-10 flex flex-col gap-10 relative overflow-hidden">
           <div className="flex justify-between items-center z-10">
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em] flex items-center gap-4">
                <Binary size={20} className="text-indigo-400" /> handshake_resnet_v29.dat
              </h4>
              <div className="text-[10px] font-black text-zinc-700 bg-black px-6 py-2 rounded-full border border-white/5 uppercase">
                STATUS: {health.status}
              </div>
           </div>

           <div className="flex-1 grid grid-cols-16 gap-1 z-10 p-6 bg-black/60 rounded-3xl border border-white/10">
              {dna.descriptor_128d.map((val: number, i: number) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: dna.identity_verified ? dna.vokar_color : '#111',
                    opacity: 0.1 + (val * 0.9)
                  }}
                />
              ))}
           </div>

           <div className="pt-8 border-t border-white/5 flex justify-between items-center z-10">
             <div className="flex items-center gap-6">
               <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30">
                 <ShieldCheck size={24} className="text-indigo-400" />
               </div>
               <div>
                 <span className="text-[9px] font-black text-zinc-600 uppercase">Integridad_ROI</span>
                 <span className="block text-[11px] font-black text-white">Óptimo para Sustitución</span>
               </div>
             </div>
             <button onClick={() => setShowReport(true)} className="px-10 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3">
                <FileText size={16} /> Consultar Codex Dmz
             </button>
           </div>
        </div>
      </div>

      {/* MODAL DE REPORTE DETALLADO */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-12"
          >
             <div className="max-w-3xl w-full bg-zinc-950 border border-white/10 rounded-[60px] p-16 relative">
                <button onClick={() => setShowReport(false)} className="absolute top-10 right-10 p-4 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all"><X size={24}/></button>
                <div className="flex items-center gap-8 mb-12">
                  <Signature size={60} className="text-indigo-400" />
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic">dmz Ly: PROTOCOLO_ESTABILIDAD</h2>
                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.5em]">ROI INTEGRATION // FALSE_POSITIVE_SHIELD</p>
                  </div>
                </div>
                <div className="space-y-6 text-zinc-400 text-[13px] leading-relaxed font-mono border-l-2 border-indigo-500/30 pl-10">
                  <p>1. <span className="text-white font-black">ROI DE IDENTIDAD:</span> Basado en la convergencia de mimesis vocal y estabilidad VNM.</p>
                  <p>2. <span className="text-white font-black">DISIPACIÓN:</span> Los picos de audio Thorne han sido filtrados mediante histéresis de 0.015 RMS.</p>
                  <p>3. <span className="text-white font-black">CONFIANZA RESNET:</span> Validación biométrica al 99.38% para el sujeto dmz Ly.</p>
                </div>
                <div className="mt-16 pt-12 border-t border-white/10 flex justify-between items-center">
                   <div className="flex flex-col text-left">
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Hash_Firma_Auditada</span>
                     <span className="text-[11px] font-black text-zinc-500 font-mono tracking-tighter">0xSTABILITY_DMZ_LY_LCS</span>
                   </div>
                   <div className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm font-black text-emerald-400 uppercase">VALIDADO</div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
