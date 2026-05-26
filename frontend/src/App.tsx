import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { PredictivePage } from './pages/PredictivePage';
import { AlertsPage } from './pages/AlertsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { BenchmarkingPage } from './pages/BenchmarkingPage';
import { ReportPage } from './pages/ReportPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { UploadPage } from './pages/UploadPage';
import { LayoutDashboard, Settings, Target, Bell, MessageSquare, FileText, BrainCircuit, Sparkles, Database } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/upload', label: 'Dataset', icon: <Database className="h-5 w-5" /> },
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/predictive', label: 'Predictive', icon: <Target className="h-5 w-5" /> },
    { path: '/alerts', label: 'Alerts', icon: <Bell className="h-5 w-5" /> },
    { path: '/chat', label: 'Assistant', icon: <MessageSquare className="h-5 w-5" /> },
    { path: '/benchmarks', label: 'Benchmarks', icon: <Sparkles className="h-5 w-5" /> },
    { path: '/reports', label: 'Reports', icon: <FileText className="h-5 w-5" /> },
    { path: '/queries', label: 'Placeholder Page', icon: <BrainCircuit className="h-5 w-5" /> },
  ];

  return (
    <nav className="glass-card sticky top-4 mx-4 z-50 rounded-2xl mb-8 px-6 py-3 border border-white/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center mr-8">
            <div className="bg-gradient-to-br from-secondary to-accent p-2 rounded-xl mr-3 shadow-lg">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">HRIQ</span>
          </div>
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentPath === item.path
                    ? 'bg-secondary text-white shadow-md transform scale-105'
                    : 'text-text-main hover:bg-primary/30'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-secondary hover:bg-primary/20 rounded-full transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary border-2 border-white shadow-sm"></div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen premium-gradient selection:bg-secondary/30">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/predictive" element={<PredictivePage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/benchmarks" element={<BenchmarkingPage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/queries" element={<PlaceholderPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
