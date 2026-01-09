import React, { useState, useMemo } from 'react';
import { Feedback, FeedbackCategory, Sentiment, User } from '../types';
import { AnalyticsView } from './AnalyticsView';
import { generateCSV, generatePDF } from '../utils/reportGenerator';

interface StaffDashboardProps {
  feedbacks: Feedback[];
  user: User;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ feedbacks, user, onLogout }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'analytics'>('dashboard');

  // --- Metrics Calculation ---
  const stats = useMemo(() => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    feedbacks.forEach(f => {
      const s = f.analysis?.sentiment || Sentiment.NEUTRAL;
      if (s === Sentiment.POSITIVE) positive++;
      else if (s === Sentiment.NEGATIVE) negative++;
      else neutral++;
    });

    const total = feedbacks.length || 1; // Avoid division by zero
    return {
      total: feedbacks.length,
      posPct: Math.round((positive / total) * 100),
      negPct: Math.round((negative / total) * 100),
      neuPct: Math.round((neutral / total) * 100)
    };
  }, [feedbacks]);

  // --- Urgent Alerts (Simulation) ---
  const urgentAlerts = useMemo(() => {
    return feedbacks.filter(f =>
      f.analysis?.sentiment === Sentiment.NEGATIVE &&
      (f.analysis?.confidence || 0) > 80
    ).slice(0, 5);
  }, [feedbacks]);

  // --- Helper for Severity ---
  const getSeverity = (f: Feedback) => {
    // Mock logic: Negative + High Confidence = High
    if (f.analysis?.sentiment === Sentiment.NEGATIVE) {
      return (f.analysis.confidence > 80) ? 'High' : 'Med';
    }
    return 'Low';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'High') return 'bg-severity-high';
    if (severity === 'Med') return 'bg-severity-med';
    return 'bg-severity-low';
  };

  // --- Helper for Date ---
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="bg-background-dark text-white overflow-hidden selection:bg-white selection:text-black font-sans h-full flex flex-col">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto group cursor-pointer">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <span className="material-symbols-outlined text-black text-xl">hub</span>
          </div>
          <span className="font-mono font-bold text-lg tracking-tighter text-white">FEEDTRACK</span>
        </div>
        <div className="hidden md:flex items-center gap-12 pointer-events-auto">
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            <button className="px-4 py-1 text-[10px] uppercase font-mono tracking-widest bg-white text-black rounded-full">System</button>
            <button className="px-4 py-1 text-[10px] uppercase font-mono tracking-widest text-white/50 hover:text-white transition-colors">Individual</button>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              Unified Management Hub / Staff Portal
            </div>
            <div className="flex gap-4 items-center">
              <button className="text-white/20 hover:text-white transition-colors group" title="Settings">
                <span className="material-symbols-outlined text-lg">settings</span>
              </button>
              <button className="text-white/20 hover:text-white transition-colors group" title="Notifications">
                <span className="material-symbols-outlined text-lg">notifications</span>
              </button>
              <div className="h-3 w-px bg-white/10 mx-1"></div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-white/20 hover:text-white transition-colors" title="Logout"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Exit</span>
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative flex-1 flex flex-col md:flex-row h-full pt-24">
        {view === 'analytics' ? (
          <AnalyticsView feedbacks={feedbacks} onBack={() => setView('dashboard')} />
        ) : (
          <>
            {/* Main Content */}
            <section className="relative flex w-full md:w-[75%] management-gradient-bg flex-col justify-start px-6 md:px-20 overflow-y-auto border-r border-white/5 custom-scrollbar pb-12 h-full">
              <div className="grain-overlay absolute inset-0"></div>
              <div className="relative z-10 w-full max-w-6xl mt-8">

                {/* Header */}
                <div className="flex items-baseline justify-between mb-2">
                  <h1 className="font-display italic text-5xl md:text-6xl text-white">Management</h1>
                  <div className="flex gap-4 items-center">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Live Monitoring Active</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  <div className="metric-card">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Total Feedback</span>
                    <div className="flex items-end gap-2 mt-2">
                      <span className="text-4xl font-display italic">{stats.total}</span>
                      <span className="text-xs text-green-500 mb-1">+12%</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Sentiment Mix</span>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex flex-col">
                        <span className="text-2xl font-mono">{stats.posPct}%</span>
                        <span className="text-[9px] text-white/40 uppercase">Positive</span>
                      </div>
                      <div className="h-8 w-px bg-white/10"></div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-mono">{stats.negPct}%</span>
                        <span className="text-[9px] text-white/40 uppercase">Negative</span>
                      </div>
                    </div>
                  </div>
                  <div className="metric-card group cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setView('analytics')}>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Trend Indicator</span>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-500 text-3xl">bar_chart</span>
                      <span className="text-sm font-sans text-white/70">Click to view Detailed Analytics</span>
                    </div>
                  </div>
                </div>

                {/* Inbox */}
                <div className="mb-8">
                  <h2 className="font-display italic text-3xl mb-8">Feedback Inbox</h2>
                  <div className="w-full">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="table-header">Timestamp</th>
                          <th className="table-header">Category</th>
                          <th className="table-header">Status</th>
                          <th className="table-header">Severity</th>
                          <th className="table-header">Emotion</th>
                          <th className="table-header"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((fb, idx) => {
                          const severity = getSeverity(fb);
                          const isExpanded = expandedId === fb.id;
                          const status = fb.analysis ? 'Analyzed' : 'Pending';

                          return (
                            <React.Fragment key={fb.id}>
                              <tr
                                className={`table-row animate-fade-in-up ${isExpanded ? 'bg-white/[0.05]' : ''}`}
                                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                                onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                              >
                                <td className="py-5 font-mono text-[11px] text-white/60">{formatDate(fb.timestamp)}</td>
                                <td className="py-5 text-sm font-sans capitalize">{fb.analysis?.category || 'Uncategorized'}</td>
                                <td className="py-5">
                                  <span className={`status-pill ${status === 'Analyzed' ? 'bg-white/10 text-white' : 'bg-status-pending/20 text-status-pending'}`}>
                                    {status}
                                  </span>
                                </td>
                                <td className="py-5">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(severity)}`}></div>
                                    <span className="font-mono text-[10px] text-white/80">{severity}</span>
                                  </div>
                                </td>
                                <td className="py-5">
                                  <span className="text-sm capitalize">{fb.analysis?.sentiment?.toLowerCase() || '-'}</span>
                                </td>
                                <td className="py-5 text-right">
                                  <span className="material-symbols-outlined text-white/30 transition-transform duration-300 transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    expand_more
                                  </span>
                                </td>
                              </tr>

                              {/* Expanded Detail */}
                              {isExpanded && (
                                <tr className="bg-white/[0.03] animate-in fade-in zoom-in-95 duration-200 origin-top">
                                  <td className="p-0 border-b border-white/5" colSpan={6}>
                                    <div className="grid grid-cols-2 gap-12 p-8 animate-spring-expand">
                                      <div className="space-y-4">
                                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Raw Feedback Source</h4>
                                        <p className="text-sm italic text-white/70 leading-relaxed font-serif pl-4 border-l-2 border-white/10">
                                          "{fb.text}"
                                        </p>
                                      </div>
                                      <div className="space-y-4">
                                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-staff-accent border-b border-staff-accent/20 pb-2 flex items-center gap-2">
                                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                          Neural Analysis
                                        </h4>

                                        <div className="relative p-4 bg-staff-accent/5 border border-staff-accent/10 rounded-sm animate-pulse-glow">
                                          <p className="text-sm text-white/90 leading-relaxed">
                                            {fb.analysis?.summary || "Analysis pending..."}
                                          </p>
                                        </div>

                                        <div className="flex gap-4">
                                          <div className="flex-1 bg-white/5 p-3 rounded-sm">
                                            <span className="block text-[9px] uppercase font-mono text-white/40 mb-1">Key Action</span>
                                            <span className="text-xs text-white">Review & Escalate</span>
                                          </div>
                                          <div className="flex-1 bg-white/5 p-3 rounded-sm">
                                            <span className="block text-[9px] uppercase font-mono text-white/40 mb-1">Impact Score</span>
                                            <span className="text-xs text-white">{(fb.analysis?.confidence || 0) > 80 ? 'High' : 'Moderate'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-auto pt-12 pb-8">
                  <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">
                    Unified Staff Dashboard / Build v4.2 / Encryption: AES-256
                  </p>
                </div>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="relative flex-none md:flex-1 bg-charcoal flex flex-col justify-start pt-8 px-10 w-full md:w-[25%] overflow-y-auto border-l border-white/5 custom-scrollbar h-full">
              <div className="grain-overlay absolute inset-0"></div>
              <div className="relative z-10 w-full mt-8">

                {/* Urgent Alerts */}
                <div className="sidebar-module border-t-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Urgent Alerts</h3>
                    <span className="px-1.5 py-0.5 bg-severity-high text-[9px] text-white font-mono">{urgentAlerts.length} NEW</span>
                  </div>
                  <div className="space-y-4">
                    {urgentAlerts.map(alert => (
                      <div key={alert.id} className="p-4 bg-severity-high/5 border border-severity-high/20 rounded-sm">
                        <p className="text-[10px] font-mono text-severity-high uppercase mb-1">Severity Spike</p>
                        <p className="text-sm font-sans text-white/80 line-clamp-2">{alert.analysis?.summary || alert.text}</p>
                      </div>
                    ))}
                    {urgentAlerts.length === 0 && (
                      <p className="text-xs text-white/40 italic">No urgent alerts detected.</p>
                    )}
                  </div>
                </div>

                {/* Action Tracking */}
                <div className="sidebar-module">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">Action Tracking</h3>
                  <div className="space-y-4">
                    <div className="group cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-sans text-white/90">Update Housing Protocol</p>
                          <span className="text-[10px] font-mono text-white/30">AI-Suggested / High Priority</span>
                        </div>
                        <div className="w-10 h-5 bg-staff-accent/20 rounded-full relative flex items-center px-0.5">
                          <div className="w-4 h-4 bg-staff-accent rounded-full translate-x-4"></div>
                        </div>
                      </div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-sans text-white/90">Staff Sensitivity Training</p>
                          <span className="text-[10px] font-mono text-white/30">AI-Suggested / Medium Priority</span>
                        </div>
                        <div className="w-10 h-5 bg-white/10 rounded-full relative flex items-center px-0.5">
                          <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export & Reports */}
                <div className="sidebar-module">
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">Export & Reports</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => generatePDF(feedbacks)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-sm text-white/40 group-hover:text-white transition-colors">file_download</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest">Monthly Summary</span>
                      </div>
                      <span className="text-[9px] text-white/20">PDF</span>
                    </button>
                    <button
                      onClick={() => generateCSV(feedbacks)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-sm text-white/40 group-hover:text-white transition-colors">analytics</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest">Trend Analysis</span>
                      </div>
                      <span className="text-[9px] text-white/20">CSV</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Controls */}

              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
};
