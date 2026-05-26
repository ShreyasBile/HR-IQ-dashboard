import React, { useState, useRef } from 'react';
import { uploadDataset } from '../services/api';
import { UploadCloud, CheckCircle, FileText, AlertCircle, Loader2, Sparkles, Database, ShieldCheck, ChevronRight } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadDataset(file);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <header className="mb-10">
        <div className="inline-flex items-center px-4 py-1.5 bg-secondary/10 rounded-full border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
          <Database className="h-3.5 w-3.5 mr-2" />
          Data Foundation
        </div>
        <h1 className="text-4xl font-bold text-text-main tracking-tight mb-2">Dataset <span className="gradient-text">Ingestion</span></h1>
        <p className="text-secondary text-lg">Initialize your intelligence pipeline by uploading raw workforce data.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-10 border border-white/60 shadow-premium relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
            
            <div 
              className={`border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-500 cursor-pointer ${
                file 
                  ? 'bg-secondary/5 border-secondary/40' 
                  : 'bg-white/40 border-secondary/20 hover:bg-white/60 hover:border-secondary/40'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-white h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2">Drop your dataset here</h3>
              <p className="text-secondary/60 font-medium text-sm mb-8 tracking-wide uppercase">Supports high-volume .CSV and .XLSX assets</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                onChange={handleFileChange}
              />
              
              <button className="px-10 py-3.5 bg-white border border-secondary/20 rounded-2xl text-sm font-bold text-secondary shadow-sm hover:shadow-md transition-all active:scale-95">
                SELECT SOURCE FILE
              </button>
            </div>

            {file && (
              <div className="mt-8 flex items-center justify-between bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-secondary/10 animate-in slide-in-from-top-4 duration-500 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary/10 rounded-xl mr-5">
                    <FileText className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-text-main leading-none mb-1">{file.name}</p>
                    <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR EXTRACTION</p>
                  </div>
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={loading}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 flex items-center ${
                    loading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'btn-primary'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      PREPROCESSING...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      UPLOAD & CLEAN
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-5 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-start animate-in shake duration-500">
                <AlertCircle className="h-5 w-5 mr-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-bold uppercase tracking-wide">{error}</div>
              </div>
            )}
          </div>
          
          <div className="glass-card rounded-[2.5rem] p-10 border border-white/60">
            <h3 className="text-xl font-bold text-text-main mb-6 flex items-center">
              <Sparkles className="h-5 w-5 mr-3 text-secondary" />
              Ingestion Safeguards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Anomaly Cleansing", desc: "Automatic detection and removal of statistical outliers and noise." },
                { title: "Privacy Masking", desc: "Sensitive PII attributes are automatically hashed for security compliance." },
                { title: "Schema Normalization", desc: "Standardization of disparate attribute names into HRIQ core format." },
                { title: "Duplicate Resolution", desc: "Entity matching logic to ensure zero-redundancy in analytics." }
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary mr-3 shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-text-main mb-1">{item.title}</h4>
                    <p className="text-xs text-secondary/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
              <div className="glass-card rounded-[2.5rem] p-8 border border-emerald-100 bg-emerald-50/30 overflow-hidden relative shadow-premium">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <CheckCircle className="h-24 w-24 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">Ingestion Successful</h3>
                <p className="text-emerald-700 text-sm font-medium">Pipeline processed {result.total_rows} records across {result.total_columns} analytical dimensions.</p>
                <div className="mt-6 flex items-center text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
                  <Zap className="h-4 w-4 mr-2" />
                  Live Context Updated
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-hover">
                <h3 className="text-lg font-bold text-text-main mb-6 tracking-wide uppercase">Audit Sequence</h3>
                <div className="bg-white/60 p-6 rounded-3xl border border-secondary/5 h-64 overflow-y-auto custom-scrollbar">
                  <ul className="space-y-3 font-mono text-[10px] text-secondary/70">
                    {result.log.map((entry: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="text-secondary/30 mr-3">[{i.toString().padStart(3, '0')}]</span>
                        <span className="leading-relaxed">{entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[2.5rem] p-10 border border-white/40 h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="bg-secondary/10 h-24 w-24 rounded-full flex items-center justify-center mb-8">
                <Loader2 className="h-10 w-10 text-secondary/30" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Awaiting Stream</h3>
              <p className="text-secondary text-sm">Real-time audit telemetry will appear here once the ingestion begins.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
