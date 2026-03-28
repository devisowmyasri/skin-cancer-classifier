import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { type PredictionResult } from '../api/predict';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HistoryEntry extends PredictionResult {
  id: string;
  timestamp: number;
}

interface HistoryTableProps {
  history: HistoryEntry[];
  onViewResult: (result: HistoryEntry) => void;
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

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onViewResult }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex items-center justify-between mb-10 px-6">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">Protocol Logs</h3>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Validated Diagnostic Archives</p>
          </div>
        </div>
        <div className="px-4 py-1 bg-zinc-900 border border-zinc-900 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-700">
          {history.length} {history.length === 1 ? 'Record' : 'Records'}
        </div>
      </div>

      <div className="bg-zinc-950/40 rounded-[48px] border border-zinc-900 overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] border-collapse">
            <thead>
              <tr className="bg-zinc-950/80 text-zinc-700 uppercase font-black tracking-[0.3em]">
                <th className="px-8 py-5 border-b border-zinc-900">Ref Signature</th>
                <th className="px-8 py-5 border-b border-zinc-900">Timestamp</th>
                <th className="px-8 py-5 border-b border-zinc-900 uppercase">Status</th>
                <th className="px-8 py-5 border-b border-zinc-900">Diagnosis</th>
                <th className="px-8 py-5 border-b border-zinc-900 text-right">Conf %</th>
                <th className="px-8 py-5 border-b border-zinc-900"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/40">
              {history.map((entry) => {
                const isMalignant = entry.verdict === 'Malignant' || entry.verdict === 'Cancerous';
                return (
                  <tr 
                    key={entry.id} 
                    className="group hover:bg-zinc-900/40 transition-all cursor-pointer"
                    onClick={() => onViewResult(entry)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-800 transition-all duration-500 group-hover:border-amber-500/40 group-hover:scale-105">
                          <img src={entry.heatmap} alt="Thumbnail" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all" />
                        </div>
                        <span className="font-mono text-[9px] text-zinc-800 group-hover:text-zinc-500 transition-colors tracking-tighter italic">#{entry.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-zinc-600 font-bold uppercase tracking-tight italic">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        isMalignant 
                          ? 'bg-red-500/5 text-red-500/60 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                          : 'bg-emerald-500/5 text-emerald-500/60 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                      )}>
                        {entry.verdict}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-zinc-300 font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors italic">
                      {CLASS_LABELS[entry.predicted_class] || entry.predicted_class}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={cn(
                        "font-mono font-black italic",
                        isMalignant ? 'text-red-500/80' : 'text-emerald-500/80'
                      )}>
                        {(entry.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <ChevronRight className="w-4 h-4 text-zinc-900 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
