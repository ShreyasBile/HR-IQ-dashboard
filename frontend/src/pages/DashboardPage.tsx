import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, UserCheck, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary"></div>
    </div>
  );

  if (!data) return (
    <div className="text-center p-12 glass-card rounded-3xl">
      <h2 className="text-2xl font-bold text-text-main mb-4">No data available</h2>
      <p className="text-secondary">Please upload an HR dataset to see the intelligence dashboard.</p>
    </div>
  );

  const COLORS = ['#66a5ad', '#c4dfe6', '#07575b', '#003b46', '#e4f1f6'];

  const StatCard = ({ title, value, icon, change, isPositive }: any) => (
    <div className="glass-card rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-primary/20 text-secondary rounded-2xl">
          {icon}
        </div>
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-secondary text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-text-main">{value}</h4>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-text-main tracking-tight mb-2">Workforce <span className="gradient-text">Intelligence</span></h1>
        <p className="text-secondary text-lg">Real-time analytical overview of your human capital performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Headcount" 
          value={data.overview.totalEmployees} 
          icon={<Users className="h-6 w-6" />} 
          change="12%" 
          isPositive={true} 
        />
        <StatCard 
          title="Avg Engagement" 
          value={`${data.overview.avgEngagement}%`} 
          icon={<TrendingUp className="h-6 w-6" />} 
          change="5.4%" 
          isPositive={true} 
        />
        <StatCard 
          title="Job Satisfaction" 
          value={`${data.overview.avgSatisfaction}/10`} 
          icon={<UserCheck className="h-6 w-6" />} 
          change="2.1%" 
          isPositive={false} 
        />
        <StatCard 
          title="Attrition Risk" 
          value={`${data.overview.resignationRate}%`} 
          icon={<AlertTriangle className="h-6 w-6" />} 
          change="0.8%" 
          isPositive={false} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-xl font-bold text-text-main mb-6">Headcount by Department</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.departmentDistribution.labels.map((l: any, i: any) => ({ name: l, value: data.charts.departmentDistribution.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0eef0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#66a5ad', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#66a5ad', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#07575b' }}
                />
                <Bar dataKey="value" fill="#66a5ad" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Education Distribution */}
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-xl font-bold text-text-main mb-6">Education Diversity</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.educationDistribution.labels.map((l: any, i: any) => ({ name: l, value: data.charts.educationDistribution.values[i] }))}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.charts.educationDistribution.labels.map((_: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance vs Engagement */}
        <div className="glass-card rounded-3xl p-8 lg:col-span-2">
          <h3 className="text-xl font-bold text-text-main mb-6">Performance & Engagement Dynamics</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.performanceEngagement.performance.map((p: any, i: any) => ({ p, e: data.charts.performanceEngagement.engagement[i] })).sort((a: any, b: any) => a.p - b.p)}>
                <defs>
                  <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66a5ad" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#66a5ad" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0eef0" />
                <XAxis dataKey="p" label={{ value: 'Performance Rating', position: 'insideBottom', offset: -5, fill: '#66a5ad' }} axisLine={false} tickLine={false} />
                <YAxis label={{ value: 'Engagement Score', angle: -90, position: 'insideLeft', fill: '#66a5ad' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="e" stroke="#66a5ad" strokeWidth={3} fillOpacity={1} fill="url(#colorP)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
