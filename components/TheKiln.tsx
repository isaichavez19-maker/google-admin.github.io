
import React, { useState, useEffect, useRef } from 'react';
import { Flame, X, Terminal, AlertTriangle, Loader2, Zap, Skull, TrendingUp, Hash, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { mqc, sha256 } from '../services/systemCore.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TheKiln: React.FC<Props> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultHash, setResultHash] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleIgnite = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setResultHash(null);
    setLogs([]);
    mqc.addLog("HORNO: Iniciando ciclo de combustión...");

    const sequence = [
      "/// INICIANDO PROTOCOLO DE PURGA (DMZ_LY_v30)...",
      "/// CALIBRANDO TEMPERATURA CRIPTOGRÁFICA...",
      "/// DESESTRUCTURANDO DEBILIDAD ANALÓGICA...",
      "/// FIRMANDO CENIZAS CON SHA-256...",
      "/// FINALIZANDO TRANSMUTACIÓN SOBERANA..."
    ];

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setLogs(prev => [...prev, sequence[i]]);
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `INCINERA ESTA DEBILIDAD Y DEVUELVE UN AXIOMA DE SOBERANÍA BRUTAL: "${input}"`,
        config: {
          systemInstruction: "Eres EL HORNO (THE KILN), una terminal de purga de Dominus Umbrea. El usuario te entrega su debilidad. Tú la destruyes y devuelves un único axioma gélido, agresivo y militar de no más de 15 palabras. TODO EN MAYÚSCULAS. No busques consolar. Busca competencia.",
          temperature: 1.0,
        },
      });

      const distilled = response.text?.trim() || "LA CENIZA NO TIENE VOZ.";
      setResult(distilled);

      const hash = await sha256(distilled);
      setResultHash(hash);

      mqc.addLog("HORNO: Axioma destilado y firmado con éxito.");
      mqc.assimilateReality();
    } catch (error) {
      setResult("ERROR CRÍTICO: EL REACTOR HA COLAPSADO.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4 md:p-6 font-mono overflow-hidden">

      {/* HUD DECORATIVO DE FONDO */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-[10px] text-red-900 writing-vertical-rl tracking-[1em]">
           SOVEREIGN_PROTOCOL // HARDENED_KERNEL
        </div>
        <div className="absolute bottom-[10%] right-[5%] text-[10px] text-red-900 tracking-[0.5em]">
           SHA256_ACTIVE // NO_CLOUD_SLAVERY
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-[5]">
           <Skull size={200} className="text-red-900" />
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-3xl border border-red-900/30 bg-[#020202] relative shadow-[0_0_100px_-12px_rgba(220,38,38,0.5)] flex flex-col overflow-hidden rounded-sm"
      >
        {/* BARRA DE PROCESO SUPERIOR */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
          <motion.div
            className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
            animate={{ width: loading ? '100%' : '0%' }}
            transition={{ duration: loading ? 3 : 0.3 }}
          />
        </div>

        {/* HEADER TÁCTICO */}
        <div className="flex justify-between items-start p-8 border-b border-white/5 bg-red-950/5">
          <div>
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <AlertTriangle size={16} className="animate-pulse" />
              <span className="text-[10px] tracking-[0.4em] uppercase font-black">Purgatorio de Debilidad</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              EL_HORNO <span className="text-zinc-800 text-sm align-top ml-3">[HARDENED]</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-700 hover:text-red-500 transition-all hover:rotate-90 duration-500">
            <X size={28} />
          </button>
        </div>

        {/* ÁREA DE OPERACIONES */}
        <div className="p-8 md:p-12 relative min-h-[400px] flex flex-col gap-8">

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="input-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-8"
              >
                {/* INPUT AREA */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-950 to-zinc-900 rounded opacity-20 group-hover:opacity-50 transition duration-700 blur"></div>
                  <textarea
                    className="relative w-full h-48 bg-black/60 border border-red-900/20 text-zinc-300 p-6 font-mono text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-900/50 resize-none placeholder-red-900/30 transition-all uppercase tracking-widest leading-relaxed custom-scrollbar"
                    placeholder="> INGRESA LA DEBILIDAD A INCINERAR..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    spellCheck="false"
                  />
                </div>

                {/* LOGS DE CONSOLA DURANTE CARGA */}
                <div className="h-24 overflow-hidden border-l-2 border-red-950 pl-6 flex flex-col-reverse">
                  {loading && (
                    <div className="space-y-1">
                      {logs.slice().reverse().map((log, i) => (
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          key={i}
                          className="text-[10px] text-red-500/80 font-mono tracking-widest"
                        >
                          {log}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {!loading && !input && (
                    <span className="text-[10px] text-zinc-800 uppercase tracking-[0.5em] animate-pulse">Aguardando_Materia_Entrópica...</span>
                  )}
                </div>

                {/* BOTÓN DE DETONACIÓN */}
                <button
                  onClick={handleIgnite}
                  disabled={loading || !input.trim()}
                  className={`group relative w-full py-6 overflow-hidden font-black uppercase tracking-[0.6em] text-[11px] flex items-center justify-center gap-4 transition-all border border-transparent ${
                    loading
                      ? 'bg-zinc-900 text-zinc-700 cursor-wait'
                      : 'bg-red-700 text-white hover:bg-red-600 shadow-2xl active:scale-[0.98]'
                  }`}
                >
                  {!loading && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />}
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Flame size={20} className="group-hover:animate-bounce" />}
                  {loading ? 'FIRMANDO_DECRETO...' : 'INICIAR_COMBUSTIÓN_SOBERANA'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="result-stage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="border border-red-900/40 bg-red-950/10 p-12 relative overflow-hidden rounded-sm">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Hash size={60} className="text-red-500" />
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.6em]">
                      /// AXIOMA_FIRMADO_SHA256
                    </p>
                  </div>

                  <h3 className="text-2xl md:text-4xl text-white font-black leading-tight uppercase tracking-tighter italic mb-8" style={{ textShadow: '0 0 40px rgba(220,38,38,0.4)' }}>
                    "{result}"
                  </h3>

                  <div className="p-4 bg-black/60 border border-red-900/20 rounded-xl mb-12">
                     <div className="text-[7px] text-red-900 uppercase font-black mb-1">Hash de Identidad del Axioma:</div>
                     <div className="text-[9px] font-mono text-zinc-500 break-all">{resultHash}</div>
                  </div>

                  <div className="pt-8 border-t border-red-900/20 flex justify-between items-end">
                    <div className="text-[10px] text-zinc-700 font-mono space-y-1 uppercase tracking-widest">
                       STATUS: HARDENED_DMZ<br/>
                       SIGN: VERIFIED
                    </div>
                    <button
                      onClick={() => { setResult(null); setInput(''); }}
                      className="text-[10px] font-black text-white underline decoration-red-600 underline-offset-8 hover:text-red-500 transition-colors uppercase tracking-[0.4em]"
                    >
                      [ REINICIAR_CICLO ]
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
