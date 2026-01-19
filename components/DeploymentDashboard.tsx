
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Activity, Zap, Server, ShieldAlert, Fingerprint, Lock, Unlock, Rocket, FileKey } from 'lucide-react';

interface Props {
  status: any;
  onDeploy: () => void;
}

export const DeploymentDashboard: React.FC<Props> = ({ status, onDeploy }) => {
  const dna = status.dna;
  const roi = dna.roi;

  const nodules = [
    { label: "Mimesis Vocal", val: dna.mimesis_index, ok: dna.mimesis_index > 70 },
    { label: "Autenticación ADN", val: dna.dna_verified ? 100 : 0, ok: dna.dna_verified },
    { label: "Firma de Identidad", val: dna.identity_verified ? 100 : 0, ok: dna.identity_verified },
    { label: "Permisos de IA", val: Object.values(dna.prefs.permissions).filter(v => v).length * 20, ok: dna.prefs.permissions.vocal_imitation }
  ];

  return (
    <div className="h-full flex flex-col gap-10 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {nodules.map((n, i) => (
          <div key={i} className="bg-zinc-950/60 border border-white/5 p-6 rounded-[35px] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{n.label}</span>
              {n.ok ? <ShieldCheck size={14} className="text-emerald-500" /> : <ShieldAlert size={14} className="text-rose-500 animate-pulse" />}
            </div>
            <div className="text-2xl font-black text-white">{n.val.toFixed(1)}%</div>
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${n.val}%` }} className={`h-full ${n.ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden">
        <div className="flex-1 bg-zinc-950/40 border border-white/5 rounded-[50px] p-12 flex flex-col items-center justify-center gap-12 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.05)_0%,_transparent_70%)]" />

           <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-zinc-800 rounded-full"
              />
              <div className="text-center space-y-4">
                <span className="text-7xl font-black text-white tracking-tighter italic">{roi.convergence_index.toFixed(0)}%</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.5em]">ÍNDICE_DE_CONVERGENCIA</p>
              </div>
           </div>

           <div className="text-center max-w-md space-y-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                {roi.deployment_ready ? 'SISTEMA_LISTO_PARA_EL_SALTO' : 'REQUERIMIENTO_DE_CONVERGENCIA'}
              </h3>
              <p className="text-xs text-zinc-500 font-mono italic">
                {roi.deployment_ready
                  ? "La mimesis es absoluta y el ADN ha sido verificado. El despliegue de soberanía puede iniciarse."
                  : "Todos los pilares, incluyendo la autenticación de ADN Digital, deben superar el umbral del 85%."}
              </p>
           </div>
        </div>

        <div className="w-full lg:w-[450px] flex flex-col gap-6">
           <div className="bg-zinc-900/40 border border-white/5 rounded-[45px] p-10 flex flex-col justify-between shadow-2xl">
              <div className="space-y-8">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                    <FileKey size={16} className="text-yellow-500" /> Licencia DMZ Activa
                 </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 bg-black rounded-3xl border border-white/5">
                       <span className="text-[10px] text-zinc-500 uppercase">Estado ADN</span>
                       <span className={`text-[10px] font-black ${dna.dna_verified ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`}>
                         {dna.dna_verified ? 'AUTÉNTICO' : 'NO_VERIFICADO'}
                       </span>
                    </div>
                    <div className={`p-5 rounded-3xl border border-white/5 flex flex-col gap-2 ${dna.dna_verified ? 'bg-emerald-500/5' : 'bg-black'}`}>
                       <span className="text-[8px] text-zinc-700 uppercase font-black">Hash_Licencia</span>
                       <span className="text-[10px] font-mono text-zinc-400 break-all">
                         {dna.license_key || '--------------------------------'}
                       </span>
                    </div>
                 </div>
              </div>

              <button
                onClick={onDeploy}
                disabled={!roi.deployment_ready}
                className={`w-full py-8 rounded-[35px] text-[12px] font-black uppercase tracking-[0.6em] transition-all flex items-center justify-center gap-6 shadow-2xl ${
                  roi.deployment_ready
                    ? 'bg-yellow-500 text-black hover:scale-[1.02] active:scale-95'
                    : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                }`}
              >
                {roi.deployment_ready ? <Rocket size={24} /> : <Lock size={24} />}
                {roi.deployment_ready ? 'INICIAR_DESPLIEGUE_FINAL' : 'DERECHOS_BLOQUEADOS'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
