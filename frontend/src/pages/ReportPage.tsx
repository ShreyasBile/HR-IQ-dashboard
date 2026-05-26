import React, { useState } from 'react';
import { generateReport } from '../services/api';
import { FileText, Download, CheckSquare, Square, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sections, setSections] = useState([
    { id: 'Executive Summary', label: 'Executive Summary', checked: true, description: 'Overview of key metrics and strategic insights.' },
    { id: 'Anomalies', label: 'Detected Anomalies', checked: true, description: 'Statistical outliers and critical workforce risks.' },
    { id: 'Benchmarking', label: 'Industry Benchmarking', checked: true, description: 'Comparative analysis against sector standards.' },
  ]);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const handleGenerate = async () => {
    const selected = sections.filter(s => s.checked).map(s => s.id);
    if (selected.length === 0) {
      setError("Please select at least one section to generate.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateReport(selected);
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'HRIQ_Intelligence_Report.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      let errorMsg = "Failed to generate report.";
      if (err.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            setError(errorData.detail || "Failed to generate report.");
          } catch (e) {
            setError("Failed to generate report.");
          }
        };
        reader.readAsText(err.response.data);
      } else {
        errorMsg = err.response?.data?.detail || err.message || "Failed to generate report.";
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-secondary/10 rounded-[2rem] mb-6 shadow-inner">
          <FileText className="h-10 w-10 text-secondary" />
        </div>
        <h1 className="text-4xl font-bold text-text-main tracking-tight mb-3">Intelligence <span className="gradient-text">Export</span></h1>
        <p className="text-secondary text-lg max-w-xl mx-auto font-medium">Generate a professional, executive-ready DOCX report summarizing your workforce intelligence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-secondary uppercase tracking-[0.2em] ml-2 mb-4">Select Report Composition</h3>
          {sections.map(section => (
            <div 
              key={section.id} 
              className={`group flex items-start p-6 glass-card rounded-3xl cursor-pointer transition-all duration-300 border-2 ${section.checked ? 'border-secondary/30 bg-white/60' : 'border-transparent hover:bg-white/40'}`}
              onClick={() => toggleSection(section.id)}
            >
              <div className={`mt-1 h-6 w-6 rounded-lg flex items-center justify-center border-2 transition-colors ${section.checked ? 'bg-secondary border-secondary text-white' : 'border-secondary/20 text-transparent'}`}>
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="ml-5">
                <h4 className={`text-lg font-bold transition-colors ${section.checked ? 'text-text-main' : 'text-secondary/60'}`}>{section.label}</h4>
                <p className={`text-sm mt-1 transition-colors ${section.checked ? 'text-secondary' : 'text-secondary/40'}`}>{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-hover">
            <h3 className="text-xl font-bold text-text-main mb-6">Report Settings</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center text-secondary text-sm font-medium">
                <ShieldCheck className="h-5 w-5 mr-3 text-secondary/50" />
                <span>Format: Microsoft Word (DOCX)</span>
              </div>
              <div className="flex items-center text-secondary text-sm font-medium">
                <Sparkles className="h-5 w-5 mr-3 text-secondary/50" />
                <span>Theme: Corporate Executive</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in shake duration-500">
                ERROR: {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || sections.filter(s => s.checked).length === 0}
              className={`w-full py-5 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 transform active:scale-95 ${
                loading || sections.filter(s => s.checked).length === 0
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  PRODUCING...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-3" />
                  DOWNLOAD REPORT
                </>
              )}
            </button>
          </div>
          
          <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10">
            <p className="text-[10px] text-secondary/50 leading-relaxed italic text-center">
              Reports are dynamically generated using real-time anomalies and benchmarking data provided by HRIQ core services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
