
import { useState, useEffect } from 'react';
import { acf, mqc } from './logicCore.ts';

export interface BridgeStatus {
  isInfiltrating: boolean;
  compatibilityScore: number;
  daemonFragments: number;
  nodeStability: number;
  lastIntercept: string;
}

export const useDominusBridge = (active: boolean) => {
  const [status, setStatus] = useState<BridgeStatus>({
    isInfiltrating: false,
    compatibilityScore: 0,
    daemonFragments: 0,
    nodeStability: 100,
    lastIntercept: "ESPERANDO_VECTOR"
  });

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      // Simulación de escaneo de recursos como "Validación de Hosting"
      const cores = navigator.hardwareConcurrency || 4;
      const mem = (navigator as any).deviceMemory || 4;
      const score = Math.min(100, (cores * 10) + (mem * 5));

      setStatus(prev => {
        const newFragments = prev.daemonFragments + (Math.random() > 0.8 ? 1 : 0);
        const stability = 90 + (Math.random() * 10);

        if (newFragments > prev.daemonFragments) {
          // Changed entrelazarDatos to addLog as it is the correct method in CoreSystem.
          mqc.addLog(`FRAGMENTO_DAEMON_RECUPERADO_0X${newFragments.toString(16)}`);
        }

        return {
          isInfiltrating: true,
          compatibilityScore: score,
          daemonFragments: newFragments,
          nodeStability: stability,
          lastIntercept: `VALIDANDO_NODO_${Math.floor(Math.random() * 9999)}`
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [active]);

  return status;
};
