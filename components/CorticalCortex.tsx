
import React, { useRef, useEffect } from 'react';
// Fixed VokarEngine import source: it resides in vokarMotor.ts
import { PHI } from '../services/systemCore.ts';
import { VokarEngine } from '../services/vokarMotor.ts';

interface Props {
  audioData: Uint8Array;
  lambda: number;
  sealColor: string;
}

export default function CorticalCortex({ audioData, lambda, sealColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };
    window.addEventListener('resize', resize);
    resize();

    // Partículas reducidas para móviles
    const particleCount = window.innerWidth < 768 ? 60 : 120;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      theta: (i / particleCount) * Math.PI * 24,
      speed: 0.004 + Math.random() * 0.008,
      radius: 1.5 + Math.random() * 2.5,
      offset: Math.random() * Math.PI * 2
    }));

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Fondo oscuro absoluto
      ctx.fillStyle = '#020205';
      ctx.fillRect(0, 0, w, h);

      // Dibujar Guía de Espiral de Fibonacci (Solo si hay actividad)
      const avgAudio = audioData.reduce((a, b) => a + b, 0) / audioData.length;
      if (avgAudio > 5) {
        ctx.beginPath();
        ctx.strokeStyle = `${sealColor}11`;
        ctx.lineWidth = 1;
        for (let t = 0; t < Math.PI * 6; t += 0.2) {
          const p = VokarEngine.getGoldenPoint(t, 5 + (avgAudio / 20));
          const x = cx + p.x;
          const y = cy + p.y;
          if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Partículas con flujo áureo
      particles.forEach((p, i) => {
        const audioVal = audioData[i % audioData.length] / 255;
        p.theta += p.speed * (1 + audioVal * 4) * (lambda / 2);

        const pulse = Math.sin(Date.now() / 1000 + p.offset) * 5;
        const pos = VokarEngine.getGoldenPoint(p.theta, 12 + pulse + (audioVal * 25));
        const x = cx + pos.x;
        const y = cy + pos.y;

        const r = p.radius + (audioVal * 20);

        ctx.beginPath();
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.2, sealColor);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Líneas de conexión neural si hay excitación Lambda alta
        if (lambda > 5 && i % 8 === 0) {
          ctx.beginPath();
          ctx.strokeStyle = `${sealColor}08`;
          ctx.moveTo(x, y);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      });

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [audioData, lambda, sealColor]);

  return <canvas ref={canvasRef} className="w-full h-full rounded-[40px] shadow-2xl bg-black" />;
}
