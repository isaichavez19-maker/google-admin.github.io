
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Music, CheckCircle, Database, Search, Code, ShieldAlert, Loader2, Sparkles, Binary } from 'lucide-react';
import { mqc } from '../services/systemCore.ts';

export const IngestaModule: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [status, setStatus] = useState(mqc.getStatus());

  useEffect(() => {
    const interval = setInterval(() => setStatus(mqc.getStatus()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage('SINCRO_NÚCLEO...');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let type = 'DOC';
        if (file.type.includes('audio')) type = 'AUDIO';
        else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) type = 'CODE';

        setTimeout(() => {
          mqc.ingestarArchivo(type, file.name, content);
          setIsUploading(false);
          setStatusMessage('');
        }, 1500);
      } catch (err) {
        setIsUploading(false);
        setStatusMessage('ERR: COLLAPSE');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full gap-8 p-10 bg-black/60 border border-white/5 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">

      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="p-5 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl">
            <Upload size={32} className={isUploading ? 'text-yellow-500 animate-bounce' : 'text-zinc-600'} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-[0.4em] uppercase italic">Ingesta_de_Materia</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-3">
              <Database size={12} className="text-yellow-500" /> VNM_Index: {status.dna.roi.vnm_index.toFixed(3)}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="px-8 py-4 bg-zinc-950 rounded-full border border-white/5 text-[10px] font-black text-zinc-500 uppercase flex items-center gap-3">
              <Binary size={16} /> STORAGE: ONLINE
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <label className={`flex-1 border-2 border-dashed rounded-[50px] transition-all cursor-pointer flex flex-col items-center justify-center gap-6 relative overflow-hidden ${
          isUploading ? 'bg-yellow-500/10 border-yellow-500' : 'bg-white/[0.02] border-white/10 hover:border-yellow-500/40 hover:bg-yellow-500/5'
        }`}>
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          <div className={`p-10 rounded-full ${isUploading ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-900'} transition-colors`}>
            {isUploading ? <Loader2 size={44} className="text-black animate-spin" /> : <Sparkles size={44} className="text-zinc-700" />}
          </div>
          <div className="text-center px-10">
            <h4 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">
              {isUploading ? statusMessage : 'CARGAR_NUEVA_MATERIA'}
            </h4>
            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
              DOC, CODE, AUDIO, DNA_STAMPS
            </p>
          </div>
        </label>

        <div className="w-full lg:w-[450px] bg-zinc-950/40 border border-white/5 rounded-[50px] p-10 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
               <Search size={14} /> Ledger_de_Ingesta
             </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {status.ingesta_history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] text-zinc-500 uppercase tracking-widest text-center gap-4">
                <ShieldAlert size={40} />
                Esperando primera carga...
              </div>
            ) : (
              status.ingesta_history.map((item: any) => (
                <div key={item.id} className="p-6 bg-black/60 border border-white/5 rounded-[35px] hover:border-yellow-500/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-zinc-900 rounded-2xl text-yellow-500 group-hover:scale-110 transition-transform">
                      {item.type === 'AUDIO' ? <Music size={18}/> : <FileText size={18}/>}
                    </div>
                    <div>
                      <div className="text-[12px] font-black text-white truncate max-w-[150px]">{item.name}</div>
                      <div className="text-[8px] text-zinc-600 font-mono uppercase mt-1">{item.type} // {new Date(item.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <CheckCircle size={18} className="text-emerald-500" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
