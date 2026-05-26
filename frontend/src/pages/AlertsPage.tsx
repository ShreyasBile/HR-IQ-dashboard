import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronRight, ShieldAlert, Zap, Filter } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning'>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAlerts();
        setAlerts(result.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAlerts = alerts.filter(a => filter === 'All' || a.severity === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary"></div>
    </div>
  );

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-100',
          text: 'text-red-700',
          icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
          badge: 'bg-red-100 text-red-700'
        };
      case 'Warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          text: 'text-amber-700',
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          badge: 'bg-amber-100 text-amber-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          text: 'text-blue-700',
          icon: <Info className="h-6 w-6 text-blue-500" />,
          badge: 'bg-blue-100 text-blue-700'
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-1000">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center px-4 py-1.5 bg-secondary/10 rounded-full border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="h-3.5 w-3.5 mr-2" />
            Live Risk Monitoring
          </div>
          <h1 className="text-4xl font-bold text-text-main tracking-tight mb-2">Operational <span className="gradient-text">Alerts</span></h1>
          <p className="text-secondary text-lg">Statistical anomalies and workforce risk events detected in real-time.</p>
        </div>
        
        <div className="flex bg-white/40 p-1.5 rounded-2xl border border-secondary/10 shadow-sm backdrop-blur-md">
          {['All', 'Critical', 'Warning'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                filter === f 
                  ? 'bg-secondary text-white shadow-md' 
                  : 'text-secondary/60 hover:text-secondary'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {filteredAlerts.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-16 text-center border-dashed border-2 border-secondary/20">
          <div className="bg-emerald-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-text-main mb-2">Systems Nominal</h3>
          <p className="text-secondary">No significant risk events detected in the current filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAlerts.map((alert, idx) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div 
                key={alert.id} 
                className="group relative glass-card rounded-[2.5rem] p-8 border border-white/60 transition-all duration-500 hover:shadow-hover hover:scale-[1.01] overflow-hidden"
              >
                {/* Decorative Side Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${alert.severity === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className={`shrink-0 p-4 rounded-2xl shadow-inner ${styles.bg} border ${styles.border}`}>
                    {styles.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-bold text-secondary/40 uppercase tracking-widest">{alert.category}</span>
                      <div className="h-1 w-1 rounded-full bg-secondary/20 hidden md:block"></div>
                      <span className="text-[10px] font-bold text-secondary/30 uppercase">ID: {alert.id.split('-')[0]}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-text-main mb-3 group-hover:text-secondary transition-colors">{alert.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 font-medium">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/40 p-4 rounded-2xl border border-secondary/5">
                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Affected Entity</p>
                        <p className="text-sm font-bold text-text-main">{alert.affected}</p>
                      </div>
                      <div className="bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
                        <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-1">Recommended Response</p>
                        <p className="text-sm font-bold text-secondary">{alert.action}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex md:flex-col gap-2">
                    <button className="p-3 bg-white border border-secondary/10 rounded-2xl text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button className="p-3 bg-white border border-secondary/10 rounded-2xl text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-12 p-8 bg-gradient-to-br from-secondary/5 to-primary/10 rounded-[3rem] border border-white/40 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-2xl shadow-sm mr-5">
            <Bell className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-text-main">Automated Notifications</h4>
            <p className="text-sm text-secondary">Configure external alerts via Slack, Email, or Webhooks.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-white border border-secondary/20 rounded-2xl text-xs font-bold text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm">
          CONFIGURE
        </button>
      </div>
    </div>
  );
};
