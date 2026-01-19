
import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, Zap, Terminal, Binary,
  Paperclip, FileText, X, Eye, Music, Video, Database,
  Archive, Box, Loader2, Sparkles, Flame, BrainCircuit, Volume2, Ghost, Trash2
} from 'lucide-react';
import { GoogleGenAI, Part, Content } from '@google/genai';
import { getSystemPrompt } from '../services/qDataService.ts';
import { mqc } from '../services/systemCore.ts';
import { narrator } from '../services/narratorService.ts';

interface Attachment {
  name: string;
  type: string;
  data: string; // base64
}

interface Message {
  role: 'user' | 'model';
  text: string;
  files?: string[];
  isTalking?: boolean;
}

export const NexusModule: React.FC = () => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const status = mqc.getStatus();

  useEffect(() => {
    const saved = localStorage.getItem('DOMINUS_NEXUS_HISTORY_V4');
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ role: 'model', text: 'Nexo Terminal v4.5: SOBERANÍA_ESTABLECIDA. Canal de razonamiento profundo abierto. ¿Cuál es tu directiva, Arquitecto?' }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    localStorage.setItem('DOMINUS_NEXUS_HISTORY_V4', JSON.stringify(messages));
  }, [messages, isThinking]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files) as File[]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        const base64 = result.split(',')[1];
        setAttachments((prev) => [...prev, { name: file.name, type: file.type || 'application/octet-stream', data: base64 }]);
        mqc.addLog(`ADJUNTO: '${file.name}' preparado para ingesta.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const speakMessage = async (index: number, text: string) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTalking: true } : m));
    await narrator.speak(text);
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTalking: false } : m));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isThinking) return;

    const userMsg = input.trim();
    const currentAttachments = [...attachments];
    setInput('');
    setAttachments([]);

    setMessages((prev) => [...prev, {
      role: 'user',
      text: userMsg || "[INGESTA_DE_MATERIA]",
      files: currentAttachments.map(a => a.name)
    }]);

    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: Part[] = [{ text: userMsg || "Analiza los adjuntos e integra su esencia." }];
      currentAttachments.forEach(att => {
        parts.push({ inlineData: { mimeType: att.type, data: att.data } });
        mqc.ingestarArchivo(att.type, att.name, "MATERIA_ASIMILADA");
      });

      const history: Content[] = messages.slice(-8).map(m => ({
        role: m.role as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...history, { role: 'user', parts: parts }],
        config: {
          systemInstruction: getSystemPrompt(true) + `\nCONVERGENCIA_ACTUAL: ${status.dna.roi.convergence_index.toFixed(1)}%.`,
          temperature: 0.8,
          thinkingConfig: { thinkingBudget: 24576 }
        }
      });

      const text = response.text || "La realidad ha colapsado. No hay respuesta.";
      setMessages((prev) => [...prev, { role: 'model', text }]);
      mqc.updateDNAFromText(text.substring(0, 100));

    } catch (e: any) {
      setMessages((prev) => [...prev, { role: 'model', text: 'SYSTEM_ERROR: Fallo en el canal de razonamiento. Reintenta.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 p-10 bg-black/60 border border-white/5 rounded-[60px] backdrop-blur-3xl animate-fadeIn overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,1)]">

      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl">
            <BrainCircuit size={32} className={isThinking ? 'text-yellow-500 animate-pulse' : 'text-zinc-600'} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-[0.4em] uppercase">Nexus_Terminal_v4.5</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-3">
              <Ghost size={12} className="text-yellow-500" /> Córtex: Proactivo // Lambda: {status.dna.lambda.toFixed(3)}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => { setMessages([]); localStorage.removeItem('DOMINUS_NEXUS_HISTORY_V4'); }} className="p-4 rounded-2xl bg-zinc-950 border border-white/5 text-rose-500 hover:bg-rose-500/10 transition-all">
              <Trash2 size={18} />
           </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pr-4 px-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] p-8 rounded-[40px] shadow-2xl relative group ${
              msg.role === 'user'
                ? 'bg-zinc-900 border border-white/10 text-white rounded-br-none'
                : 'bg-zinc-950 border border-white/5 text-zinc-300 rounded-bl-none'
            }`}>
              <div className="flex items-center justify-between gap-6 mb-6">
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${msg.role === 'user' ? 'text-zinc-500' : 'text-yellow-500'}`}>
                  {msg.role === 'user' ? 'Arquitecto' : 'Dominus_Clon'}
                </span>
                {msg.role === 'model' && (
                  <button
                    onClick={() => speakMessage(i, msg.text)}
                    disabled={msg.isTalking}
                    className={`p-2 rounded-xl transition-all active:scale-90 ${msg.isTalking ? 'text-yellow-500 animate-pulse' : 'text-zinc-600 hover:text-white'}`}
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-[14px] font-light leading-relaxed font-mono whitespace-pre-wrap">{msg.text}</p>
              {msg.files && msg.files.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {msg.files.map((f, fi) => (
                    <div key={fi} className="px-4 py-2 bg-black/60 rounded-xl text-[9px] text-zinc-600 border border-white/5 flex items-center gap-2">
                      <FileText size={12} /> {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse">
             <div className="bg-zinc-950/50 border border-white/5 p-8 rounded-[40px] rounded-bl-none flex items-center gap-6">
                <Loader2 size={24} className="text-yellow-500 animate-spin" />
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.6em]">Procesando razonamiento...</span>
             </div>
          </div>
        )}
      </div>

      <div className="pt-6 shrink-0">
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-4 px-4">
             {attachments.map((a, i) => (
               <div key={i} className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] text-yellow-500 flex items-center gap-2">
                  <span className="truncate max-w-[100px]">{a.name}</span>
                  <X size={12} className="cursor-pointer" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />
               </div>
             ))}
          </div>
        )}
        <div className="relative group">
          <div className="relative flex items-center gap-6 bg-zinc-950 border border-white/10 rounded-[45px] p-3 pl-10 shadow-2xl focus-within:border-yellow-500/50 transition-all">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
             <button onClick={() => fileInputRef.current?.click()} className="p-4 text-zinc-600 hover:text-white transition-all active:scale-90">
               <Paperclip size={24} />
             </button>
             <input
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Inyectar directiva administrativa..."
               className="flex-1 bg-transparent border-none py-6 text-[14px] font-mono text-white focus:outline-none placeholder:text-zinc-800"
             />
             <button
               onClick={handleSend}
               disabled={isThinking}
               className={`p-6 rounded-full transition-all active:scale-90 shadow-2xl ${
                 isThinking ? 'bg-zinc-900 text-zinc-700' : 'bg-white hover:scale-105 text-black'
               }`}
             >
               <Send size={24} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
