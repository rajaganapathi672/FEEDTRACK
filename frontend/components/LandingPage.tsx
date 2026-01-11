import React, { useState } from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const [hoveredSection, setHoveredSection] = useState<'student' | 'staff' | null>(null);

  const getFlexStyle = (section: 'student' | 'staff') => {
    if (!hoveredSection) return { flex: 1 };
    return { flex: hoveredSection === section ? 1.1 : 0.9 };
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-white selection:bg-white selection:text-black min-h-screen w-full flex flex-col font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto group cursor-pointer">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-md">
            <span className="material-symbols-outlined text-black text-2xl">insights</span>
          </div>
          <span className="font-mono font-bold text-xl tracking-tighter">FEEDTRACK</span>
        </div>
        <div className="hidden md:block font-mono text-[10px] uppercase tracking-widest text-white/40">
          2026 Feedback System / Version 1.0.0
        </div>
      </nav>

      <main className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
        {/* Student Section - Slides from Left */}
        <section
          className="relative split-pane student-bg border-r border-white/5 group flex flex-col justify-center px-12 md:px-24 cursor-pointer transition-all duration-700 ease-out py-20 animate-slide-in-left"
          style={getFlexStyle('student')}
          onMouseEnter={() => setHoveredSection('student')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSelectRole(UserRole.STUDENT)}
        >
          <div className="grain-overlay absolute inset-0"></div>
          <div className="relative z-10 max-w-lg pointer-events-none group-hover:pointer-events-auto">
            <span className="inline-block px-3 py-1 bg-student-accent/20 text-student-accent font-mono text-[10px] uppercase tracking-widest mb-8 border border-student-accent/30 animate-fade-in-up stagger-3">
              Portal Alpha
            </span>
            <h1 className="font-display italic text-7xl md:text-8xl lg:text-9xl mb-8 leading-tight transform transition-transform duration-1000 group-hover:translate-x-4">
              Students
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-sans leading-relaxed mb-12 animate-fade-in-up stagger-4">
              Your voice is the catalyst for change. Share insights, report issues, and shape the campus evolution through direct feedback.
            </p>
            <button className="group/link inline-flex items-center gap-4 text-white hover:text-student-accent transition-colors animate-fade-in-up stagger-5">
              <span className="font-mono text-sm uppercase tracking-[0.2em] border-b border-white pb-1 group-hover/link:border-student-accent">Launch Portal</span>
              <span className="material-symbols-outlined text-2xl transform group-hover/link:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="absolute bottom-8 left-12 md:left-24 max-w-xs animate-fade-in-up stagger-5">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 leading-relaxed">
              Institutional Intelligence & Student Sentiment Tracking. Managed by Feedtrack Analytics Group.
            </p>
          </div>
        </section>

        {/* Staff Section - Slides from Right */}
        <section
          className="relative split-pane staff-bg group flex flex-col justify-center px-12 md:px-24 cursor-pointer transition-all duration-700 ease-out py-20 animate-slide-in-right"
          style={getFlexStyle('staff')}
          onMouseEnter={() => setHoveredSection('staff')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSelectRole(UserRole.STAFF)}
        >
          <div className="grain-overlay absolute inset-0"></div>
          <div className="relative z-10 max-w-lg pointer-events-none group-hover:pointer-events-auto">
            <span className="inline-block px-3 py-1 bg-staff-accent/20 text-staff-accent font-mono text-[10px] uppercase tracking-widest mb-8 border border-staff-accent/30 animate-fade-in-up stagger-3">
              Portal Beta
            </span>
            <h1 className="font-display italic text-7xl md:text-8xl lg:text-9xl mb-8 leading-tight transform transition-transform duration-1000 group-hover:-translate-x-4">
              Staff
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-sans leading-relaxed mb-12 animate-fade-in-up stagger-4">
              Turn feedback into action. Utilize AI-driven analytics to master student relations and drive institutional growth effectively.
            </p>
            <button className="group/link inline-flex items-center gap-4 text-white hover:text-staff-accent transition-colors animate-fade-in-up stagger-5">
              <span className="font-mono text-sm uppercase tracking-[0.2em] border-b border-white pb-1 group-hover/link:border-staff-accent">Enter Dashboard</span>
              <span className="material-symbols-outlined text-2xl transform group-hover/link:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="absolute bottom-8 right-12 md:right-24 flex gap-3 pointer-events-auto animate-fade-in-up stagger-5">
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm text-white/40">language</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm text-white/40">security</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm text-white/40">help_outline</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
