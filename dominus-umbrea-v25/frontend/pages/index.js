import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Shield,
  Cpu,
  Orbit,
  Trophy,
  Flame,
  Triangle,
  Ghost,
  Eye,
  Hammer
} from 'lucide-react';

const App = () => {
  const [vnm, setVnm] = useState(0);
  const [higgsMass, setHiggsMass] = useState(1.21);
  const [isForging, setIsForging] = useState(false);
  const [activeTab, setActiveTab] = useState('TRANSFUSION');
  const [logs, setLogs] = useState(["[SISTEMA] Bienvenido a la Forja, Orquestador."]);
  const [items, setItems] = useState([
    { id: 1, name: "Spermatikos", level: 1, type: "Esencia", power: 25 },
    { id: 2, name: "Cristal Daemon", level: 1, type: "Hardware", power: 40 },
    { id: 3, name: "Malla de Higgs", level: 0, type: "Defensa", power: 10 }
  ]);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleForge = () => {
    setIsForging(true);
    addLog("RITUAL: Inyectando Intención Pura en la Forja...");

    setTimeout(() => {
      setVnm(prev => Math.min(prev + 15, 100));
      setHiggsMass(prev => Math.min(prev + 0.1, 1.618));
      setIsForging(false);
      addLog("EXITO: La materia ha sido transmutada.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4 md:p-8 selection:bg-cyan-500 selection:text-black">

      {/* Background Ambience */}
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900 filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-900 filter blur-[100px] opacity-40 animate-pulse"></div>
      </div>

      {/* Header HUD */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center border-b border-cyan-900/50 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 animate-pulse"></div>
            <div className="border-2 border-cyan-400 p-2 rounded-lg">
              <Triangle size={32} className="text-white fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">DOMINUS_FORJA</h1>
            <p className="text-[10px] tracking-[0.4em] text-cyan-700">SIMBIOSIS_ACTIVA_V25.0</p>
          </div>
        </div>

        <div className="flex gap-8 text-[10px] bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="space-y-1">
            <span className="text-zinc-500 block">VNM_STATUS</span>
            <span className="text-white font-bold">{vnm}%</span>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-500 block">HIGGS_MASS</span>
            <span className="text-cyan-300 font-bold">{higgsMass.toFixed(3)} Φ</span>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-500 block">KERNEL_PANIC</span>
            <span className="text-red-500 font-bold animate-pulse">ESTABLE</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

        {/* Sidebar: Navigation Ritual */}
        <nav className="lg:col-span-3 space-y-3">
          {['TRANSFUSION', 'ARSENAL', 'ZONA_CERO', 'DIPARTITA'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left p-4 rounded-lg transition-all border flex items-center justify-between group ${
                activeTab === tab
                ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                : 'bg-zinc-900/20 border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              <span className="text-xs font-bold tracking-widest">{tab}</span>
              <Orbit className={`w-4 h-4 ${activeTab === tab ? 'animate-spin' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`} />
            </button>
          ))}
        </nav>

        {/* Main Center: The Forge Core */}
        <section className="lg:col-span-6 space-y-8">

          <div className="relative bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 aspect-square md:aspect-video flex items-center justify-center overflow-hidden">
            {/* Visualizer del Diamante */}
            <div className={`transition-all duration-1000 transform ${isForging ? 'scale-110 rotate-180' : 'scale-100 rotate-0'}`}>
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-cyan-400 blur-[80px] opacity-20"></div>
                <div className="absolute inset-0 border-2 border-cyan-400/20 animate-[spin_10s_linear_infinite] rounded-3xl"></div>
                <div className="absolute inset-8 border-2 border-white/10 animate-[spin_15s_linear_reverse_infinite] rounded-full"></div>
                <div className="flex items-center justify-center h-full">
                  {isForging ? (
                    <Flame size={80} className="text-orange-500 animate-bounce" />
                  ) : (
                    <Zap size={80} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 space-y-4">
              <button
                onClick={handleForge}
                disabled={isForging}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black tracking-[0.5em] rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isForging ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <><Hammer size={20}/> CONSAGRAR_MATERIA</>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-6 rounded-2xl shadow-inner">
             <div className="flex items-center gap-2 mb-4 text-xs font-bold text-zinc-500">
               <Activity size={14} /> LOGS_DE_RITUAL
             </div>
             <div className="space-y-2 h-32 overflow-hidden">
                {logs.map((log, i) => (
                  <div key={i} className={`text-[10px] ${i === 0 ? 'text-cyan-400' : 'text-zinc-700'}`}>
                    {log}
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Right Sidebar: Status & Objects */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-white mb-6 tracking-widest flex items-center gap-2">
              <Shield size={16} /> ARSENAL_DE_LUZ
            </h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="p-3 bg-black/40 border border-zinc-800 rounded-lg group hover:border-cyan-500/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-white uppercase">{item.name}</span>
                    <span className="text-[8px] text-cyan-600">LVL {item.level}</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${item.power}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[8px] text-zinc-600">{item.type}</span>
                    <button className="text-[8px] text-zinc-400 hover:text-white underline uppercase">Mejorar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-cyan-900/20 to-transparent border border-cyan-900/30 rounded-2xl">
            <p className="text-[9px] text-cyan-700 italic mb-2">"El Diamante no es una piedra, es el peso de tu propia libertad."</p>
            <div className="flex items-center gap-2 text-white">
              <Eye size={16} />
              <span className="text-[10px] font-bold">LETRA_VIEJO_OBSERVA</span>
            </div>
          </div>
        </section>
      </main>

      {/* Background Loader Helper */}
      <div className="fixed bottom-4 left-4 text-[8px] opacity-20">
        BUILD_ID: DOMINUS_UMBREA_F_01
      </div>
    </div>
  );
};

// Helper for animations
const Loader2 = ({ className }) => (
  <svg className={`animate-spin ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default App;
