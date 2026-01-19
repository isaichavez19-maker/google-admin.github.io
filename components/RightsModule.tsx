
import React, { useState, useEffect } from 'react';
// Added missing Skull import
import { ShieldCheck, Lock, Unlock, FileKey, Fingerprint, Activity, AlertTriangle, ShieldAlert, Cpu, CheckCircle2, XCircle, Key, Database, Binary, Hash, Skull } from 'lucide-react';
import { mqc, sha256 } from '../services/systemCore.ts';
import { motion, AnimatePresence } from 'framer-motion';

export const RightsModule: React.FC = () => {
  const [status, setStatus] = useState(mqc.getStatus());
  const [dnaInput, setDnaInput] = useState('');
  const [currentHash, setCurrentHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setStatus(mqc.getStatus()), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateHashPreview = async () => {
      if (!dnaInput) {
        setCurrentHash('');
        return;
      }
      const h = await sha256(dnaInput);
      setCurrentHash(h);
    };
    updateHashPreview();
  }, [dnaInput]);

  const handleVerify = async () => {
    if (!dnaInput.trim()) return;
    setIsVerifying(true);
    await mqc.verifyDNA(dnaInput);
    setIsVerifying(false);
    setDnaInput('');
  };

  const togglePermission = (key: string) => {
    const current = status.dna.prefs.permissions;
    mqc.updatePermissions({ [key]: !current[key as keyof typeof current] });
  };

  const dna = status.dna;
  const perms = dna.prefs.permissions;

  return (
    <div className="flex flex-col h-full gap-8 p-10 bg-black/90 border border-red-900/20 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.9)]">

      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden flex flex-wrap gap-4 p-10 font-mono text-[8px] text-red-500">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="break-all">{Math.random().toString(16).repeat(5)}</div>
        ))}
      </div>

      <div className="flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-6">
          <div className={`p-5 rounded-3xl bg-zinc-950 border transition-all duration-700 ${dna.dna_verified ? 'border-yellow-500 shadow-[0_0_30px_#EAB30844]' : 'border-red-900/30 shadow-[0_0_30px_#991b1b22]'}`}>
            <ShieldCheck size={32} className={dna.dna_verified ? 'text-yellow-500' : 'text-red-600 animate-pulse'} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-[0.4em] uppercase italic">NÚCLEO_DE_SOBERANÍA</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-3">
              <FileKey size={12} className={dna.dna_verified ? 'text-yellow-500' : 'text-red-900'} />
              AUTORIZACIÓN: {dna.dna_verified ? "SISTEMA_ROOT_DMZ" : "ACCESO_DENIEGADO"}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${dna.dna_verified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
              {dna.dna_verified ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
              INTEGRIDAD_{dna.dna_verified ? 'CONFIRMADA' : 'COMPROMETIDA'}
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-8 overflow-hidden z-10">

        {/* SECCIÓN DE VERIFICACIÓN CRIPTOGRÁFICA */}
        <div className="flex-1 bg-zinc-950/60 border border-red-900/10 rounded-[50px] p-10 flex flex-col gap-10">
          <div className="space-y-4">
             <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-4">
               <Hash size={18} className="text-red-600" /> Bóveda Criptográfica SHA-256
             </h4>
             <p className="text-xs text-zinc-500 font-mono italic leading-relaxed">
               "La soberanía no se pide; se calcula. Inyecta tu secuencia maestra. Solo el hash exacto desbloqueará los permisos de mimesis avanzada."
             </p>
          </div>

          <div className="space-y-6">
             <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center text-red-900/30">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  value={dnaInput}
                  onChange={(e) => setDnaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="Inyectar Secuencia Maestra..."
                  className="w-full bg-black border border-red-900/20 rounded-2xl py-6 pl-16 pr-8 text-sm font-mono text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-900"
                />
             </div>

             {/* HASH PREVIEW */}
             <AnimatePresence>
               {currentHash && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="p-6 bg-red-950/10 border border-red-900/20 rounded-2xl overflow-hidden"
                 >
                    <span className="text-[7px] font-black text-red-900 uppercase block mb-1">Cálculo de Hash en Vivo:</span>
                    <span className="text-[10px] font-mono text-zinc-400 break-all leading-tight">{currentHash}</span>
                 </motion.div>
               )}
             </AnimatePresence>

             <button
               onClick={handleVerify}
               disabled={isVerifying || dna.dna_verified}
               className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl ${
                 dna.dna_verified
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default'
                  : (isVerifying ? 'bg-zinc-900 text-zinc-700' : 'bg-red-700 text-white hover:bg-red-600 active:scale-95')
               }`}
             >
               {isVerifying ? <Activity size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
               {dna.dna_verified ? 'SISTEMA_RECLAMADO' : (isVerifying ? 'CALCULANDO_SHA256...' : 'VALIDAR_AUTORIDAD')}
             </button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4">
             <div className="p-6 bg-black/40 border border-red-900/10 rounded-3xl">
                <span className="text-[8px] font-black text-zinc-700 uppercase block mb-1">Algoritmo de Firma</span>
                <span className="text-xs font-black text-zinc-500 font-mono">ED25519_HARDENED</span>
             </div>
             <div className="p-6 bg-black/40 border border-red-900/10 rounded-3xl">
                <span className="text-[8px] font-black text-zinc-700 uppercase block mb-1">Ubicación de Datos</span>
                <span className="text-xs font-black text-red-600">EDGE_OFFLINE</span>
             </div>
          </div>
        </div>

        {/* SECCIÓN DE PERMISOS SOBERANOS */}
        <div className="w-full xl:w-[500px] flex flex-col gap-6">
           <div className="bg-zinc-950/80 border border-red-900/10 rounded-[50px] p-10 space-y-8 flex-1 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Skull size={80} className="text-red-600" />
              </div>

              <div className="flex justify-between items-center">
                 <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-4">
                   <Binary size={18} className="text-red-600" /> Atribuciones Root
                 </h4>
              </div>

              <div className="space-y-4">
                 {[
                   { key: 'vocal_imitation', label: 'Mimesis Fonadora', desc: 'Clonación de frecuencia fundamental F0.' },
                   { key: 'mimesis_allowed', label: 'ADN Conductual', desc: 'Sustitución de heurística administrativa.' },
                   { key: 'autonomous_reasoning', label: 'Decretos Autónomos', desc: 'Generación de axiomas sin supervisión.' },
                   { key: 'forensic_access', label: 'Auditoría Forense', desc: 'Acceso total a logs de error Thorne.' }
                 ].map((p) => (
                   <div
                     key={p.key}
                     onClick={() => !dna.dna_verified ? null : togglePermission(p.key)}
                     className={`p-6 rounded-[30px] border transition-all flex items-center justify-between group ${
                       !dna.dna_verified ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                     } ${
                       perms[p.key as keyof typeof perms] ? 'bg-red-600/5 border-red-600/30' : 'bg-black/40 border-white/5 hover:border-white/10'
                     }`}
                   >
                     <div className="flex-1 pr-6">
                        <div className={`text-[12px] font-black uppercase mb-1 ${perms[p.key as keyof typeof perms] ? 'text-white' : 'text-zinc-600'}`}>{p.label}</div>
                        <div className="text-[9px] text-zinc-500 font-mono italic">{p.desc}</div>
                     </div>
                     <div className={`p-3 rounded-full transition-all ${perms[p.key as keyof typeof perms] ? 'bg-red-600 text-white shadow-[0_0_15px_#dc262644]' : 'bg-zinc-900 text-zinc-700'}`}>
                        {perms[p.key as keyof typeof perms] ? <Unlock size={16} /> : <Lock size={16} />}
                     </div>
                   </div>
                 ))}
              </div>

              <div className="p-6 bg-red-900/5 border border-red-900/20 rounded-3xl flex items-start gap-4">
                 <AlertTriangle size={18} className="text-red-600 shrink-0 mt-1" />
                 <p className="text-[10px] text-red-900/70 font-mono leading-relaxed italic">
                   "ADVERTENCIA: Sin validación criptográfica DMZ_LY, la mimesis vocal permanece en modo 'Sandboxed'. El sistema simulará frialdad técnica."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
