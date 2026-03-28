import { TriangleAlert, CircleCheck, Info, Activity } from 'lucide-react';
import { DiagnosticChart } from './DiagnosticChart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResultCardProps {
  result: {
    predicted_class: string;
    verdict: string;
    confidence: number;
    all_confidences: Record<string, number>;
    heatmap: string;
    is_simulated?: boolean;
  };
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

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isMalignant = result.verdict === 'Malignant' || result.verdict === 'Cancerous';

  return (
    <div className="w-full space-y-12 shrink-in-from-bottom duration-1000">
      
      {/* SIMULATION WARNING */}
      {result.is_simulated && (
        <div className="flex items-center gap-4 px-6 py-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Simulation Mode Active // No Model Weights Detected</span>
        </div>
      )}

      {/* TOP SECTION: SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-950/40 p-10 rounded-[40px] border border-zinc-900 shadow-xl flex flex-col justify-center">
          <dt className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4">Verdict</dt>
          <dd className={cn(
            "text-4xl font-black italic tracking-tighter lowercase leading-none",
            isMalignant ? "text-red-500/80" : "text-emerald-500/80"
          )}>
            {result.verdict}
          </dd>
        </div>

        <div className="bg-zinc-950/40 p-10 rounded-[40px] border border-zinc-900 shadow-xl flex flex-col justify-center">
          <dt className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4">Primary Class</dt>
          <dd className="text-xl font-black text-white uppercase tracking-wider leading-none">
            {CLASS_LABELS[result.predicted_class] || result.predicted_class}
          </dd>
        </div>

        <div className="bg-zinc-950/40 p-10 rounded-[40px] border border-zinc-900 shadow-xl flex flex-col justify-center">
          <dt className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4">Confidence</dt>
          <dd className="text-4xl font-black text-zinc-200 tracking-tighter italic leading-none">
            {(result.confidence * 100).toFixed(1)}<span className="text-zinc-800 ml-1">%</span>
          </dd>
        </div>
      </div>

      {/* ANALYTICS GRID: STRUCTURED TABLES AND GRAPH */}
      <div className="grid lg:grid-cols-2 gap-12">
        
        {/* GRAPH PANEL */}
        <div className="bg-zinc-950/40 rounded-[48px] border border-zinc-900 p-10 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Activity className="w-32 h-32 text-amber-500" />
          </div>
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
            <span className="w-4 h-px bg-amber-500"></span>
            Spectral Analysis Graph
          </h4>
          <DiagnosticChart data={result.all_confidences} />
        </div>

        {/* DATA TABLE PANEL */}
        <div className="bg-zinc-950/40 rounded-[48px] border border-zinc-900 p-10 shadow-2xl overflow-hidden group">
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
            <span className="w-4 h-px bg-zinc-800 group-hover:bg-amber-500 transition-colors"></span>
            Structured Dataset Output
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="text-zinc-800 uppercase font-black tracking-[0.4em]">
                  <th className="px-6 py-4 pb-8 border-b border-zinc-900/40">Classification</th>
                  <th className="px-6 py-4 pb-8 border-b border-zinc-900/40 text-right">Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/20">
                {Object.entries(result.all_confidences)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cls, conf]) => (
                    <tr key={cls} className="group hover:bg-zinc-900/20 transition-all">
                      <td className="px-6 py-5 text-zinc-500 group-hover:text-zinc-100 font-bold uppercase tracking-widest transition-colors">
                        {CLASS_LABELS[cls] || cls}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="font-mono text-zinc-800 group-hover:text-amber-500/80 transition-colors italic">
                          {(conf * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HEATMAP / EVIDENCE PANEL */}
      <div className="bg-zinc-950/40 rounded-[64px] border border-zinc-900 overflow-hidden shadow-2xl group relative">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
            <img 
              src={result.heatmap} 
              alt="Diagnostic Heatmap" 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          </div>
          
          <div className="p-16 flex flex-col justify-center space-y-12">
            <div className="inline-flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Visual Evidence Data</h4>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Grad-CAM Heatmap Localization</p>
              </div>
            </div>

            <p className="text-sm text-zinc-500 leading-relaxed font-medium uppercase tracking-tight">
              The neural system has localized significant visual signatures within the highlighted red/yellow spectrum. This indicates structural patterns consistent with the primary classification.
            </p>

            <div className="pt-10 border-t border-zinc-900 grid grid-cols-2 gap-10">
              <div>
                <dt className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em] mb-2">Resolution</dt>
                <dd className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">300x300 Neural Matched</dd>
              </div>
              <div>
                <dt className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em] mb-2">Architecture</dt>
                <dd className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">EfficientNet-B3</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISCLAMER BORDER */}
      <div className="mt-20 border border-amber-500/10 bg-black p-10 rounded-[48px] group">
        <div className="flex gap-8 items-start">
          <TriangleAlert className="w-6 h-6 text-amber-900 group-hover:text-amber-500 transition-colors mt-1 shrink-0" />
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.6em]">Clinical Liability Disclaimer</h5>
            <p className="text-[10px] text-zinc-700 leading-relaxed font-bold uppercase tracking-[0.05em] group-hover:text-zinc-500 transition-colors">
              THIS SYSTEM OPERATES ON UNTREATED EMPIRICAL DATA. RESULTS EXHIBITED IN THIS INTERFACE ARE FOR SCIENTIFIC DEMONSTRATION AND LABORATORY SIMULATION ONLY. FINAL DIAGNOSTIC DECISIONS MUST BE PERFORMED BY QUALIFIED DERMATOLOGISTS IN A SECURE CLINICAL ENVIRONMENT. 
              <strong> NOT FOR PRIMARY PATIENT CARE.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
