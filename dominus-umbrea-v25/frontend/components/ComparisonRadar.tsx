import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type Metrics = {
  poder: number;
  poesia: number;
  control: number;
  vision: number;
  resiliencia: number;
  tecnologia: number;
};

interface RadarProps {
  metrics: Metrics;
  glitch: number;
}

const ComparisonRadar = ({ metrics, glitch }: RadarProps) => {
  const chaosFactor = glitch / 2;

  const data = {
    labels: ['Poder', 'Poesía', 'Control', 'Visión', 'Resiliencia', 'Tecnología'],
    datasets: [
      {
        label: 'LETRA',
        data: [metrics.poder, metrics.poesia, metrics.control, metrics.vision, metrics.resiliencia, metrics.tecnologia],
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Emerald-500
        borderColor: '#10b981',
        borderWidth: 2,
      },
      {
        label: 'THORNE',
        data: [90, 20, Math.max(0, 100 - chaosFactor), 50, 60, 95],
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red-500
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#9ca3af', font: { size: 10 } },
        ticks: { display: false, backdropColor: 'transparent' },
      },
    },
    plugins: {
      legend: { labels: { color: '#d1d5db', font: { size: 10, family: 'monospace' } } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-64 w-full bg-[#0a0a0c] rounded border border-gray-800 p-2 relative overflow-hidden">
      <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-bold tracking-widest uppercase">
        Análisis de Entidad
      </div>
      <Radar data={data} options={options} />
    </div>
  );
};

export default ComparisonRadar;
