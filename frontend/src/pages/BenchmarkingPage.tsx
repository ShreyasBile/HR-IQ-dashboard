import React, { useEffect, useState } from 'react';
import { getBenchmarks } from '../services/api';
import { BarChart3, TrendingUp, TrendingDown, Minus, Building } from 'lucide-react';

export const BenchmarkingPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [industry, setIndustry] = useState('Technology');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getBenchmarks(industry);
        setData(result.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch benchmarks.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [industry]);

  const getStatusColor = (status: string) => {
    if (status === 'Green') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Amber') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Green') return <TrendingUp className="h-4 w-4 mr-1 text-green-600" />;
    if (status === 'Amber') return <Minus className="h-4 w-4 mr-1 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 mr-1 text-red-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Industry Benchmarking</h1>
          <p className="text-gray-600">Compare your workforce metrics against market standards.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <Building className="h-5 w-5 text-gray-500 ml-2" />
          <select 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            className="p-2 border-none bg-transparent focus:ring-0 font-medium text-gray-700 cursor-pointer outline-none"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind} Industry</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-4">Metric</th>
                  <th className="px-6 py-4">Your Company</th>
                  <th className="px-6 py-4">Industry Median</th>
                  <th className="px-6 py-4">Top Quartile</th>
                  <th className="px-6 py-4">Gap to Median</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                      {row.metric}
                    </td>
                    <td className="px-6 py-4 text-lg font-semibold">{row.company}</td>
                    <td className="px-6 py-4">{row.median}</td>
                    <td className="px-6 py-4 text-gray-500">{row.topQuartile}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${row.gap > 0 ? (row.metric.includes('Attrition') || row.metric.includes('Hire') ? 'text-red-600' : 'text-green-600') : row.gap < 0 ? (row.metric.includes('Attrition') || row.metric.includes('Hire') ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}`}>
                        {row.gap > 0 ? '+' : ''}{row.gap}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                        {getStatusIcon(row.status)}
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
