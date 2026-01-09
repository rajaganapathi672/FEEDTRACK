
import React, { useState } from 'react';
import { Feedback, User } from '../types';
import { apiService } from '../services/apiService';
import { Loader2 } from 'lucide-react';
import { CATEGORY_GROUPS, CATEGORY_TYPES } from '../constants';

interface StudentDashboardProps {
  user: User;
  feedbacks: Feedback[];
  onAddFeedback: (feedback: Feedback) => void;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, feedbacks, onAddFeedback, onLogout }) => {
  const [categoryGroup, setCategoryGroup] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.length < 10) {
      setError('Please provide at least 10 characters of feedback.');
      return;
    }
    if (!categoryGroup || !categoryType) {
      setError('Please select both a Category Group and Type.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const newFeedback = await apiService.submitFeedback(text, categoryGroup, categoryType, user.id, user.name, isAnonymous);
      onAddFeedback(newFeedback);
      setText('');
      setCategoryGroup('');
      setCategoryType('');
    } catch (err: any) {
      console.error("Feedback Submission Error:", err);
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const myFeedbacks = feedbacks
    .filter(f => f.studentId === user.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="min-h-screen bg-background-dark text-white overflow-hidden selection:bg-white selection:text-black font-sans">

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-charcoal border border-white/10 p-8 relative">
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-display text-2xl mb-4 italic">Privacy Information</h2>
            <div className="space-y-4 font-sans text-sm text-white/60 leading-relaxed">
              <p>Your feedback is handled with institutional-grade security. When anonymous mode is toggled, your personal identifiers are stripped from the submission before it reaches administrative eyes.</p>
              <p>AI Insights are generated locally to ensure your data remains within our secure environment.</p>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto group cursor-pointer">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <span className="material-symbols-outlined text-black text-xl">insights</span>
          </div>
          <span className="font-mono font-bold text-lg tracking-tighter text-white">FEEDTRACK</span>
        </div>
        <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 pointer-events-auto">
          Student Dashboard / Activity Hub
        </div>
      </nav>

      <main className="relative min-h-screen w-full flex flex-col md:flex-row">
        <section className="relative flex w-full md:w-[75%] feedback-gradient-bg flex-col justify-center px-8 md:px-24 py-20 md:py-0 border-r border-white/5">
          <div className="grain-overlay absolute inset-0"></div>
          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <h1 className="font-display italic giant-text mb-4 text-white">
              Feedback
            </h1>
            <p className="font-display italic text-2xl text-white/50 mb-20 leading-relaxed">
              Share your institutional insights.
            </p>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-sans font-medium text-[10px] uppercase tracking-[0.2em] text-white/40" htmlFor="categoryGroup">Category Group</label>
                  <div className="relative">
                    <select
                      className="input-line w-full appearance-none bg-transparent cursor-pointer focus:ring-0 rounded-none border-b border-white/20 pb-2 text-sm no-native-select"
                      id="categoryGroup"
                      value={categoryGroup}
                      onChange={(e) => {
                        setCategoryGroup(e.target.value);
                        setCategoryType('');
                      }}
                      disabled={isSubmitting}
                    >
                      <option value="" className="bg-[#240a30] text-white/40">Select Group</option>
                      {CATEGORY_GROUPS.map(g => (
                        <option key={g} value={g} className="bg-[#240a30] text-white">{g}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-lg">expand_more</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-sans font-medium text-[10px] uppercase tracking-[0.2em] text-white/40" htmlFor="categoryType">Category Type</label>
                  <div className="relative">
                    <select
                      className="input-line w-full appearance-none bg-transparent cursor-pointer focus:ring-0 rounded-none border-b border-white/20 pb-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed no-native-select"
                      id="categoryType"
                      value={categoryType}
                      onChange={(e) => setCategoryType(e.target.value)}
                      disabled={!categoryGroup || isSubmitting}
                    >
                      <option value="" className="bg-[#240a30] text-white/40">Select Type</option>
                      {categoryGroup && CATEGORY_TYPES[categoryGroup]?.map(t => (
                        <option key={t} value={t} className="bg-[#240a30] text-white">{t}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-lg">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-sans font-medium text-[10px] uppercase tracking-[0.2em] text-white/40" htmlFor="comment">Comment</label>
                <textarea
                  className="input-line h-24 resize-none"
                  id="comment"
                  placeholder="Describe your experience..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {error && (
                <p className="font-mono text-xs text-red-400 tracking-wide">{error}</p>
              )}

              <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-12">
                  <button
                    type="submit"
                    disabled={isSubmitting || !text.trim()}
                    className={`group relative overflow-hidden flex items-center gap-4 text-white hover:opacity-100 transition-all disabled:opacity-50 btn-fill-animation pr-2 ${!isSubmitting && !text.trim() ? '' : ''}`}
                  >
                    {isSubmitting ? (
                      <span className="font-mono text-xs uppercase tracking-[0.3em] border-b border-white/40 pb-1 z-10 relative">Processing...</span>
                    ) : (
                      <>
                        <span className="font-mono text-xs uppercase tracking-[0.3em] border-b border-white/40 pb-1 z-10 relative">Submit Feedback</span>
                        {/* Animated Arrow / Checkmark */}
                        <div className="relative w-6 h-6 z-10">
                          <span className={`material-symbols-outlined text-2xl absolute inset-0 transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100 transform group-hover:translate-x-2 transition-transform'}`}>arrow_right_alt</span>
                        </div>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Anonymous</span>
                    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                      <input
                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer"
                        id="toggle"
                        name="toggle"
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <label
                        className="toggle-label block overflow-hidden h-5 rounded-full bg-white/10 cursor-pointer"
                        htmlFor="toggle"
                      ></label>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors underline underline-offset-4 decoration-white/10"
                >
                  Privacy Info
                </button>
              </div>
            </form>
          </div>

          <div className="absolute bottom-8 left-24">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">
              Data Encryption Active / v2.0
            </p>
          </div>
        </section>

        <section className="relative flex bg-charcoal flex-col px-6 py-12 md:py-24 md:px-8 w-full md:w-[25%] overflow-y-auto custom-scrollbar h-auto md:h-screen">
          <div className="grain-overlay absolute inset-0"></div>
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl mb-1 text-white">Recent Activity</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Your Submission History</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95" title="Settings">
                  <span className="material-symbols-outlined text-xl">settings</span>
                </button>
                <button className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-95" title="Account">
                  <span className="material-symbols-outlined text-xl">person_outline</span>
                </button>
                <button onClick={onLogout} className="p-2 rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all hover:scale-110 active:scale-95" title="Log Out">
                  <span className="material-symbols-outlined text-xl">logout</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-white/30">calendar_month</span>
                <div className="relative">
                  <select className="no-native-select bg-transparent border-0 text-[9px] font-mono uppercase tracking-widest text-white/40 pl-0 pr-4 py-0 focus:ring-0 cursor-pointer hover:text-white transition-colors">
                    <option className="bg-charcoal">All Time</option>
                    <option className="bg-charcoal">This Week</option>
                  </select>
                  <span className="material-symbols-outlined text-[10px] text-white/30 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-white/30">filter_list</span>
                <div className="relative">
                  <select className="no-native-select bg-transparent border-0 text-[9px] font-mono uppercase tracking-widest text-white/40 pl-0 pr-4 py-0 focus:ring-0 cursor-pointer hover:text-white transition-colors">
                    <option className="bg-charcoal">All Status</option>
                    <option className="bg-charcoal">Pending</option>
                    <option className="bg-charcoal">Analyzed</option>
                  </select>
                  <span className="material-symbols-outlined text-[10px] text-white/30 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {myFeedbacks.length === 0 ? (
                <div className="py-8 text-white/20 font-mono text-xs uppercase tracking-widest text-center">No activity recorded.</div>
              ) : (
                myFeedbacks.map((fb, idx) => {
                  const dateObj = new Date(fb.timestamp);
                  const isValidDate = !isNaN(dateObj.getTime());
                  const displayDate = isValidDate
                    ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Date Pending';

                  // Handle confidence: if > 1, assume 0-100 scale, else 0-1 scale
                  const rawConf = fb.analysis?.confidence || 0;
                  const confidencePct = rawConf > 1 ? Math.round(rawConf) : Math.round(rawConf * 100);

                  const isAnalyzed = !!fb.analysis;

                  return (
                    <div
                      key={fb.id || idx}
                      className="border-l border-white/10 pl-4 py-1 group animate-fade-in-up"
                      style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                          {displayDate}
                        </span>
                        {/* Simulating status based on analysis presence */}
                        <span className={`status-pill border ${isAnalyzed
                          ? 'bg-status-analyzed/10 text-status-analyzed border-status-analyzed/20'
                          : 'bg-status-pending/10 text-status-pending border-status-pending/20'
                          }`}>
                          {isAnalyzed ? 'Analyzed' : 'Pending'}
                        </span>
                      </div>
                      <div className="mb-2">
                        {fb.categoryGroup && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="px-1.5 py-0.5 rounded-[1px] bg-white/5 border border-white/5 text-[9px] font-mono uppercase tracking-wider text-white/60 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]" title={fb.categoryGroup}>{fb.categoryGroup}</span>
                            <span className="material-symbols-outlined text-[10px] text-white/20">arrow_right_alt</span>
                            <span className="text-[10px] font-sans text-white/80 line-clamp-1" title={fb.categoryType}>{fb.categoryType || 'General'}</span>
                          </div>
                        )}
                        <h3 className="font-sans text-sm text-white/80 group-hover:text-white transition-colors line-clamp-1">{fb.analysis?.summary || fb.text || 'New Submission'}</h3>
                      </div>
                      <details className="mt-4 group/details">
                        <summary className="flex items-center gap-2 cursor-pointer text-white/40 hover:text-student-accent transition-colors list-none">
                          <span className="material-symbols-outlined text-sm">psychology</span>
                          <span className="font-mono text-[9px] uppercase tracking-widest">AI Insights</span>
                          <span className="material-symbols-outlined text-xs transition-transform group-open/details:rotate-180">expand_more</span>
                        </summary>
                        <div className="mt-3 p-4 bg-white/[0.02] border border-white/5 space-y-3 rounded-sm origin-top animate-spring-expand">
                          {isAnalyzed ? (
                            <>
                              <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-3">
                                <div>
                                  <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Emotion</p>
                                  <p className="text-[10px] text-white/80 capitalize tracking-wide">{fb.analysis?.sentiment?.toLowerCase() || 'neutral'}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Confidence</p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-student-accent" style={{ width: `${confidencePct}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-white/60">{confidencePct}%</p>
                                  </div>
                                </div>
                              </div>

                              <div className="relative p-3 bg-student-accent/5 border border-student-accent/10 rounded-sm animate-pulse-glow">
                                <p className="text-[8px] font-mono text-student-accent uppercase mb-2 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[10px]">auto_awesome</span>
                                  Neural Summary
                                </p>
                                <p className="text-[11px] text-white/80 italic leading-relaxed font-serif">
                                  "{fb.analysis?.summary || 'Processing feedback...'}"
                                </p>
                              </div>

                              <div className="pt-2">
                                <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Original Source</p>
                                <p className="text-[10px] text-white/40 line-clamp-2 hover:line-clamp-none transition-all cursor-crosshair">"{fb.text}"</p>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-3 py-4">
                              <span className="material-symbols-outlined text-white/20 animate-spin">sync</span>
                              <p className="text-[10px] text-white/40 italic font-mono uppercase tracking-widest">Neural Engine Processing...</p>
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-12 pt-6 border-t border-white/5">
              <a className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors cursor-pointer">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]">View Full Archive</span>
                <span className="material-symbols-outlined text-base">north_east</span>
              </a>
            </div>
          </div>


        </section>
      </main>
      <style>{`
        .no-native-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: none;
        }
        .no-native-select::-ms-expand {
          display: none;
        }
      `}</style>
    </div>
  );
};
