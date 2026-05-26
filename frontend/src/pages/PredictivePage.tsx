import React, { useEffect, useState } from 'react';
import { getPredictiveScores } from '../services/api';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Info, Search, Filter, ChevronRight, Brain } from 'lucide-react';

export const PredictivePage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPredictiveScores();
        setData(result.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch scores. Please upload a dataset first.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk > 70) return 'text-red-600 bg-red-50 border-red-100';
    if (risk >= 40) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  const getTrajectoryIcon = (traj: string) => {
    if (traj === 'Upward') return <TrendingUp className="h-4 w-4 text-emerald-500 mr-2" />;
    if (traj === 'Downward') return <TrendingDown className="h-4 w-4 text-red-500 mr-2" />;
    return <Minus className="h-4 w-4 text-secondary/40 mr-2" />;
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-12 glass-card rounded-[3rem] text-center">
      <div className="bg-red-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-text-main mb-3">Predictive Model Unavailable</h3>
      <p className="text-secondary mb-8">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-1000">
      <div className="flex-1">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-text-main tracking-tight mb-2">Predictive <span className="gradient-text">Intelligence</span></h1>
          <p className="text-secondary text-lg">AI-powered risk modeling and future performance trajectories.</p>
        </header>

        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/60 shadow-premium">
          <div className="p-6 bg-white/40 border-b border-secondary/10 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/50" />
              <input 
                type="text" 
                placeholder="Search workforce..." 
                className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-secondary/20 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10"
              />
            </div>
            <button className="flex items-center px-4 py-2.5 bg-white border border-secondary/20 rounded-xl text-xs font-bold text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm">
              <Filter className="h-3.5 w-3.5 mr-2" />
              ADVANCED FILTERS
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/10 text-text-main text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-8 py-5 cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => handleSort('id')}>Employee</th>
                  <th className="px-8 py-5 cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => handleSort('attritionRisk')}>Attrition Risk</th>
                  <th className="px-8 py-5 cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => handleSort('promotionReadiness')}>Promotion Readiness</th>
                  <th className="px-8 py-5 cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => handleSort('performanceTrajectory')}>Trajectory</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5">
                {sortedData.map((emp) => (
                  <tr 
                    key={emp.id} 
                    className={`group transition-all duration-300 hover:bg-white/60 cursor-pointer ${selectedEmp?.id === emp.id ? 'bg-white/80' : ''}`}
                    onClick={() => setSelectedEmp(emp)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary/30 mr-4 flex items-center justify-center font-bold text-secondary shadow-sm">
                          {emp.id.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-main group-hover:text-secondary transition-colors">{emp.id}</p>
                          <p className="text-[10px] text-secondary/60 font-medium uppercase tracking-wider">{emp.role} • {emp.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold ${getRiskColor(emp.attritionRisk)}`}>
                        {emp.attritionRisk}%
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-full max-w-[100px] bg-secondary/10 h-2 rounded-full mr-3 overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: `${emp.promotionReadiness}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-text-main">{emp.promotionReadiness}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm font-semibold text-text-main">
                        {getTrajectoryIcon(emp.performanceTrajectory)}
                        {emp.performanceTrajectory}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <ChevronRight className={`h-5 w-5 text-secondary/30 transition-transform ${selectedEmp?.id === emp.id ? 'translate-x-1 text-secondary' : ''}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reasoning Panel */}
      <div className={`w-full lg:w-[400px] transition-all duration-500 ${selectedEmp ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none hidden lg:block'}`}>
        {selectedEmp && (
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/60 shadow-hover sticky top-24">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-secondary to-accent p-0.5 shadow-lg">
                   <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center font-bold text-2xl text-secondary">
                    {selectedEmp.id.charAt(0)}
                   </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-text-main">{selectedEmp.id}</h3>
                  <p className="text-xs font-bold text-secondary/60 uppercase tracking-widest">{selectedEmp.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmp(null)}
                className="p-2 hover:bg-red-50 text-secondary/40 hover:text-red-500 rounded-xl transition-all"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-2xl border border-secondary/5">
                  <p className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest mb-1">Risk Score</p>
                  <p className={`text-2xl font-bold ${selectedEmp.attritionRisk > 70 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedEmp.attritionRisk}%
                  </p>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-secondary/5">
                  <p className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest mb-1">Readiness</p>
                  <p className="text-2xl font-bold text-text-main">
                    {selectedEmp.promotionReadiness}%
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/5 to-primary/20 p-6 rounded-[2rem] border border-white/60 shadow-inner relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-10">
                  <Brain className="h-12 w-12 text-secondary" />
                </div>
                <div className="flex items-center mb-4 text-secondary font-bold text-xs uppercase tracking-[0.2em]">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Logic Breakdown
                </div>
                <p className="text-sm text-text-main leading-relaxed font-medium italic">
                  "{selectedEmp.reasoning}"
                </p>
              </div>

              <button className="w-full py-4 rounded-2xl btn-primary text-white font-bold text-sm shadow-lg flex items-center justify-center group">
                INITIATE RETENTION PLAN
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
