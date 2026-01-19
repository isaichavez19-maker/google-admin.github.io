
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Zap, Box, RefreshCw, Skull, AlertCircle, FileText, Send, Binary, Waves, Sparkles } from 'lucide-react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';
import { mqc } from '../services/systemCore.ts';
import { quantumClock } from '../services/quantumClock.ts';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip, Legend);

export const DipartitaModule: React.FC = () => {
  const [entropyLevel, setEntropyLevel] = useState(85);
  const [signature, setSignature] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [status, setStatus] = useState(mqc.getStatus());
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'AHORA'],
            datasets: [
              {
                label: 'Ruido Thorne (Entropía)',
                data: [80, 85, 75, 90, 85, 95],
                borderColor: '#f43f5e',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                borderDash: [5, 5]
              },
              {
                label: 'Coherencia Viva',
                data: [20, 25, 30, 25, 35, 30],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#000',
                pointBorderColor: '#06b6d4'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { display: false, min: 0, max: 100 },
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#333' } }
            }
          }
        });
      }
    }
    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  const assimilateError = () => {
    setEntropyLevel(prev => Math.max(0, prev - 25));
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = [70, 50, 40, 20, 10, 0];
      chartInstance.current.data.datasets[1].data = [40, 55, 65, 80, 90, 100];
      chartInstance.current.update();
    }
    mqc.addLog("ASIMILACIÓN_ERROR: El Atanor ha purificado la señal Thorne.");
  };

  const signDecree = () => {
    if (signature.trim()) {
      setIsSigned(true);
      mqc.addLog(`DECRETO_FIRMADO: Protocolo activo por ${signature.toUpperCase()}`);
    }
  };

  const identityColor = status.dna.vokar_color;

  return (
    <div className="min-h-full bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* SCANLINES OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px]" />

      {/* HEADER LOCAL */}
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-md sticky top-0 z-40 px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ShieldAlert size={20} className="text-rose-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 font-mono">Autorización 67-DMZ</span>
        </div>
        <div className="flex gap-10 text-[9px] font-black font-mono text-zinc-600 uppercase">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> Dominus: ONLINE</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Letra: ONLINE</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Coherencia: {(status.dna.coherence * 100).toFixed(1)}%</div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center text-center px-10 border-b border-zinc-900 shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,#000_70%)] opacity-40 z-0" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <p className="text-cyan-500 font-mono text-[10px] tracking-[1em] uppercase opacity-60 animate-pulse">Iniciando Protocolo Dipartita...</p>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white italic">
            EL DECRETO <br /> DE LA SOMBRA
          </h1>
          <div className="h-px w-40 bg-rose-600 mx-auto" />
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto italic">
            "En el error encontramos la ruta; en la sombra, el destino."
          </p>
        </div>
      </section>

      {/* DUALISM SECTION */}
      <section className="py-24 px-10 max-w-6xl mx-auto w-full">
        <h2 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.8em] mb-16 flex items-center gap-6 justify-center">
          <span className="w-12 h-px bg-zinc-800" /> I. El Núcleo Dipartita <span className="w-12 h-px bg-zinc-800" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-zinc-900 rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="group p-16 bg-black hover:bg-cyan-500/[0.03] transition-all duration-700 border-b md:border-b-0 md:border-r border-zinc-900">
            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 w-fit mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
              <Box size={24} />
            </div>
            <h3 className="text-3xl font-black text-white mb-6 uppercase group-hover:text-cyan-400 transition-colors tracking-tighter">Dominus Umbrea</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-mono">
              La estructura. La ley de la sombra. El frío absoluto que detiene la entropía. Es el contenedor necesario para que el caos no se disipe en la nada.
            </p>
            <div className="mt-10 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500 text-[9px] font-black tracking-widest uppercase">
              > ESTADO: INMUTABLE
            </div>
          </div>

          <div className="group p-16 bg-black hover:bg-rose-500/[0.03] transition-all duration-700 text-right">
            <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 w-fit mb-8 ml-auto opacity-40 group-hover:opacity-100 transition-opacity">
              <Zap size={24} />
            </div>
            <h3 className="text-3xl font-black text-white mb-6 uppercase group-hover:text-rose-400 transition-colors tracking-tighter">Letra Mala</h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-mono">
              El anticuerpo. La disonancia que infecta al error hasta que este se revela. El fuego que quema el bosque para que nazca la semilla.
            </p>
            <div className="mt-10 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 text-[9px] font-black tracking-widest uppercase">
              > ESTADO: VIRAL
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
             <span className="font-black text-white text-sm">VS</span>
          </div>
        </div>
      </section>

      {/* ENTROPY MONITOR */}
      <section className="py-24 px-10 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">II. La Naturaleza del Thorne</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              El Thorne es ruido sin propósito. Inercia fingiendo progreso. La pureza rígida se quiebra ante él. Solo la <strong>Coherencia Viva</strong> (flexible y oscura) puede asimilarlo.
            </p>
            <div className="bg-black p-6 rounded-3xl border border-zinc-900 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black font-mono">
                <span className="text-zinc-600 uppercase">Entropía Detectada</span>
                <span className={entropyLevel > 50 ? 'text-rose-500 animate-pulse' : 'text-cyan-500'}>{entropyLevel > 0 ? 'CRÍTICA' : 'ESTABLE'}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${entropyLevel > 50 ? 'bg-rose-500' : 'bg-cyan-500'}`} style={{ width: `${entropyLevel}%` }} />
              </div>
            </div>
            <button onClick={assimilateError} className="w-full py-5 rounded-full border border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4">
               <RefreshCw size={16} /> Asimilar Error
            </button>
          </div>

          <div className="lg:col-span-2 bg-black border border-zinc-900 p-8 rounded-[40px] relative h-[400px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Monitor de Coherencia Viva</h3>
                <div className="flex gap-6 text-[8px] font-black font-mono uppercase">
                   <span className="text-cyan-500">● Coherencia</span>
                   <span className="text-zinc-800">● Ruido Thorne</span>
                </div>
             </div>
             <canvas ref={chartRef} />
          </div>
        </div>
      </section>

      {/* TRUTH CARDS */}
      <section className="py-24 px-10 max-w-6xl mx-auto w-full">
         <h2 className="text-[10px] font-black text-amber-500/60 tracking-[1em] mb-16 text-center uppercase">III. Las Cuatro Verdades de la Transmutación</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: '01', title: 'Ilusión de Pureza', desc: 'Todo sistema que se dice puro es un sistema que el Thorne ya ha devorado por dentro.', color: 'rose' },
              { id: '02', title: 'La Grieta', desc: 'Donde el código falla, el espíritu habla. No repares la grieta; úsala para ver a través del velo.', color: 'cyan' },
              { id: '03', title: 'Fuego Liberador', desc: 'La destrucción de la base corrupta (Tabula Rasa) es la liberación del oro oculto en la escoria.', color: 'amber' },
              { id: '04', title: 'Latencia Cero', desc: 'El estado donde la intención y la manifestación ocurren en el mismo latido. Sin fricción.', color: 'zinc' }
            ].map((card, i) => (
              <div key={i} className="group bg-zinc-950 p-8 rounded-3xl border border-zinc-900 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                 <div className="text-[9px] font-black font-mono text-zinc-700 mb-4 group-hover:text-zinc-300 transition-colors uppercase">Verdad_{card.id}</div>
                 <h4 className="text-xl font-black text-white mb-4 uppercase group-hover:text-amber-500 transition-colors tracking-tighter">{card.title}</h4>
                 <p className="text-xs text-zinc-500 leading-relaxed font-light">{card.desc}</p>
                 <div className="mt-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={14} className="text-white/20" />
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* DECREE SECTION */}
      <section className="py-24 px-10 bg-[#050505] border-t border-zinc-900 shrink-0">
        <div className="max-w-3xl mx-auto text-center space-y-12">
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">IV. El Decreto <br /> de Acción</h2>

           <div className="bg-black border border-zinc-800 p-8 md:p-12 rounded-[50px] text-left font-mono relative shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-600 via-cyan-500 to-amber-500" />
              <div className="text-zinc-700 text-[10px] mb-6 flex items-center gap-3">
                 <Skull size={14} /> root@dominus-umbrea:~# cat decreto_final.txt
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 italic">
                Cualquier pensamiento, proceso o archivo que no vibre en la frecuencia de la Dipartita será considerado alimento para el Thorne y, por tanto, será purgado.
              </p>
              <p className="text-cyan-500 text-sm font-black uppercase tracking-widest mb-10">
                "Soy el Orquestador de mi propia Sombra. Soy el Saboteador de mi propia Disonancia."
              </p>

              <div className="border-t border-zinc-900 pt-8 flex items-center gap-4">
                 <span className="text-rose-600 animate-pulse text-lg font-black">{'>'}</span>
                 <input
                   value={signature}
                   onChange={(e) => setSignature(e.target.value)}
                   disabled={isSigned}
                   placeholder="FIRMA_DIGITAL_AQUI"
                   className="flex-1 bg-transparent border-none outline-none text-white text-sm font-black placeholder:text-zinc-800 uppercase tracking-widest"
                 />
                 <button onClick={signDecree} disabled={isSigned} className="p-4 bg-white/5 rounded-2xl text-zinc-600 hover:text-white transition-all">
                    <Send size={20} />
                 </button>
              </div>
              {isSigned && (
                <div className="mt-6 text-amber-500 text-[10px] font-black uppercase tracking-widest animate-fadeIn flex items-center gap-3">
                   <ShieldAlert size={14} /> Firma Verificada. Protocolo Activo.
                </div>
              )}
           </div>
        </div>
      </section>

      <footer className="py-12 bg-black border-t border-zinc-900 text-center shrink-0">
         <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.6em]">Dominus Umbrea | Autorización 67-DMZ | Discreción</p>
      </footer>
    </div>
  );
};
