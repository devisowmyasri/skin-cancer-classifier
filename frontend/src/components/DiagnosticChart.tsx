import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DiagnosticChartProps {
  data: Record<string, number>;
  isMalignant: boolean;
}

const CLASS_LABELS: Record<string, string> = {
  'akiec': 'Actinic Keratoses',
  'bcc': 'Basal Cell Carcinoma',
  'bkl': 'Benign Keratosis-like Lesions',
  'df': 'Dermatofibroma',
  'mel': 'Melanoma',
  'nv': 'Melanocytic Nevi',
  'vasc': 'Vascular Lesions'
};

export const DiagnosticChart: React.FC<DiagnosticChartProps> = ({ data }) => {
  const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);
  const maxVal = Math.max(...Object.values(data));

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
      <div className="flex items-center justify-between mb-4 px-1">
        <h4 className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Spectral Probability Map</h4>
      </div>

      <div className="space-y-6">
        {sortedData.map(([cls, conf], index) => {
          const percentage = (conf * 100).toFixed(1);
          const barWidth = `${(conf / maxVal) * 100}%`;
          const isTop = index === 0;
          
          return (
            <div key={cls} className="relative group">
              <div className="flex justify-between items-end mb-2.5 px-2">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                  isTop ? "text-zinc-100" : "text-zinc-600 group-hover:text-zinc-400"
                )}>
                  {CLASS_LABELS[cls] || cls}
                </span>
                <span className={cn(
                  "font-mono text-[10px] font-black tracking-tighter",
                  isTop ? "text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "text-zinc-800"
                )}>
                  {percentage}%
                </span>
              </div>
              
              <div className="w-full bg-zinc-950 rounded-full h-1 border border-zinc-900/50 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-[2000ms] ease-out-expo shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                    isTop ? "bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-zinc-800/40 group-hover:bg-zinc-800"
                  )} 
                  style={{ width: barWidth }}
                >
                  {/* Subtle Shimmer Animation */}
                  {isTop && (
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_4s_infinite]"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis/Scale Footer */}
      <div className="pt-6 flex justify-between px-2 opacity-30">
        {[0, 25, 50, 75, 100].map((tick) => (
          <div key={tick} className="flex flex-col items-center gap-1.5">
            <div className="w-[1px] h-1.5 bg-zinc-800"></div>
            <span className="text-[7px] font-black text-zinc-900 tracking-widest">{tick}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>
    </div>
  );
};
