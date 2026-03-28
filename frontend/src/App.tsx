import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';
import { HistoryTable } from './components/HistoryTable';
import { predictImage, type PredictionResult } from './api/predict';
import { Shield, Brain, LoaderCircle, Search, Fingerprint, Terminal } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictImage(file);
      const newEntry = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      setResult(newEntry);
      setHistory(prev => [newEntry, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Error processing image');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = (entry: any) => {
    setResult(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-black text-zinc-400 selection:bg-amber-500/30 font-sans tracking-tight overflow-hidden">
      
      {/* SIDEBAR WORKSTATION */}
      <aside className="w-72 border-r border-zinc-900 bg-black flex flex-col z-20 shrink-0">
        <div className="p-8 border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Fingerprint className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">Obsidian <span className="text-zinc-600">Derm</span></h1>
              <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Protocol v4.0.1</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-10 overflow-y-auto">
          <div>
            <h4 className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em] mb-6 px-4">Core Systems</h4>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-4 px-4 py-3 bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                <Search className="w-4 h-4 text-amber-500" />
                <span>Diagnostic Scan</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-900 group rounded-xl text-zinc-600 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest transition-all">
                <Brain className="w-4 h-4 group-hover:text-amber-500" />
                <span>Neural Assets</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em] mb-6 px-4">Laboratory Tools</h4>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-900 group rounded-xl text-zinc-600 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest transition-all">
                <Terminal className="w-4 h-4 group-hover:text-amber-500" />
                <span>Console</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-900 group rounded-xl text-zinc-600 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest transition-all">
                <Shield className="w-4 h-4 group-hover:text-amber-500" />
                <span>Encryption Keys</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-8 border-t border-zinc-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">Engine Optimized</span>
          </div>
          <p className="text-[8px] text-zinc-800 font-bold uppercase tracking-[0.3em] leading-relaxed">
            Obsidian Diagnostic Suite © 2026<br/>
            Local Edge Node v4.0.1+PRO
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-black">
        
        {/* STEALTH BACKGROUND GRID */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        </div>

        <div className="relative z-10 p-12 lg:p-16 max-w-6xl mx-auto">
          
          {/* WORKSTATION HEADER */}
          <header className="flex flex-col mb-16 animate-in fade-in slide-in-from-top-6 duration-1000">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter italic lowercase">
              Diagnostic <span className="text-zinc-800">workstation</span>
            </h2>
            <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.3em]">Precision Analysis Interface // Active Session</p>
          </header>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* UPLOAD / INPUT PANEL */}
            <div className="lg:col-span-12 xl:col-span-12">
              <div className="bg-zinc-950/40 rounded-[48px] border border-zinc-900 p-10 shadow-2xl relative overflow-hidden group">
                <UploadZone onFileSelect={handleFileSelect} isLoading={loading} />

                {loading && (
                  <div className="mt-12 flex flex-col items-center gap-4 animate-pulse">
                    <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <LoaderCircle className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Sequencing Neural Pathways...</p>
                  </div>
                )}

                {error && (
                  <div className="mt-10 px-8 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                    <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* RESULTS SECTION - STRUCTURED REPORT */}
            {result && (
              <div id="result-viewer" className="lg:col-span-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <ResultCard result={result} />
                
                <div className="mt-20 flex justify-center">
                  <button 
                    onClick={() => {
                      setResult(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-12 py-5 bg-zinc-950 hover:bg-zinc-900 rounded-3xl text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 hover:text-zinc-400 transition-all border border-zinc-900/60 shadow-xl"
                  >
                    Reset Workflow
                  </button>
                </div>
              </div>
            )}

            {/* HISTORY - BOTTOM GRID */}
            <div className="lg:col-span-12 mt-12">
              <HistoryTable history={history} onViewResult={handleViewResult} />
            </div>
          </div>

          {/* FOOTER - MINIMALIST */}
          <footer className="mt-40 pt-16 border-t border-zinc-950 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4">
              <Fingerprint className="w-6 h-6 text-zinc-800" />
              <span className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.4em]">Obsidian Diagnostic Suite © 2026</span>
            </div>
            <div className="flex gap-12 text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-zinc-300">Terms</a>
              <a href="#" className="hover:text-zinc-300">Safety</a>
              <a href="#" className="hover:text-zinc-300">v4.0.1+PRO</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;