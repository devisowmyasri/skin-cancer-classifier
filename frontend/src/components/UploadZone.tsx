import React, { useState, useCallback } from 'react';
import { Upload, X, Scan, Zap, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, []);

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setSelectedFile(null);
  };

  const handleStartAnalysis = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-16">
      {!preview ? (
        <label 
          className={cn(
            "group relative flex flex-col items-center justify-center w-full h-96 border border-zinc-900 rounded-[48px] cursor-pointer transition-all duration-700 overflow-hidden",
            dragActive 
              ? "bg-zinc-900 shadow-inner border-zinc-700 scale-[0.98]" 
              : "bg-black hover:bg-zinc-950 shadow-2xl hover:border-zinc-800"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="flex flex-col items-center justify-center p-10 relative z-10 text-center">
            <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-105 group-hover:border-amber-500/20 transition-all duration-700">
              <Upload className="w-8 h-8 text-zinc-600 transition-colors group-hover:text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-white mb-3 uppercase tracking-[0.3em]">Initialize Image Sequence</h3>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-10">Upload high-fidelity dermatoscopy data</p>
            
            <div className="flex items-center gap-8 px-8 py-3 bg-zinc-900/40 rounded-2xl border border-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-amber-500 transition-colors"></div>
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-none">Format: JPG / PNG</span>
              </div>
            </div>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleChange} disabled={isLoading} />
        </label>
      ) : (
        <div className="space-y-14 animate-in fade-in zoom-in-95 duration-1000">
          <div className="relative group rounded-[40px] overflow-hidden border border-zinc-900 bg-black shadow-2xl p-6 max-w-sm mx-auto aspect-square flex items-center justify-center">
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[20px] opacity-70 group-hover:opacity-90 transition-opacity duration-1000" />
            
            {/* SCANNING OVERLAY - AMBER STYLE */}
            {isLoading && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_rgba(245,158,11,1)] animate-[scan_3s_infinite_ease-in-out]"></div>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-pulse"></div>
              </div>
            )}

            <button 
              onClick={clearPreview}
              className="absolute top-8 right-8 p-3 bg-zinc-900/90 backdrop-blur-md hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-red-500 transition-all z-30 opacity-0 group-hover:opacity-100"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleStartAnalysis}
              disabled={isLoading}
              className={cn(
                "group relative px-12 py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-700 overflow-hidden border border-zinc-900 shadow-2xl",
                isLoading 
                  ? "bg-zinc-950 text-zinc-700 border-zinc-900 cursor-wait" 
                  : "bg-black text-white hover:bg-zinc-900 hover:border-amber-500/30 hover:shadow-[0_0_50px_rgba(245,158,11,0.05)] active:scale-[0.98]"
              )}
            >
              {/* Button Shimmer - Subtle Amber */}
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/[0.03] to-transparent translate-x-[-100%] group-hover:animate-[shimmer_3s_infinite]"></div>
              )}

              <div className="relative flex items-center gap-5">
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse text-amber-600" />
                    <span className="animate-pulse">Sequencing Neural Array...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                    <span>Execute Prototype Analysis</span>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:animate-ping"></div>
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-10 mt-6 text-zinc-700">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">End-to-End Encryption</span>
            </div>
            <div className="w-px h-3 bg-zinc-900"></div>
            <div className="flex items-center gap-3">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Isolation</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
