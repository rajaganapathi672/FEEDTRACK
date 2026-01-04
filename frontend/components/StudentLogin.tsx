
import React, { useState } from 'react';

interface StudentLoginProps {
    onBack: () => void;
    onLogin: (id: string, password: string) => Promise<void>;
    onSwitchToSignup: () => void;
    loading?: boolean;
    error?: string;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onBack, onLogin, onSwitchToSignup, loading, error }) => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(studentId, password);
    };

    return (
        <div className="bg-background-dark text-white overflow-hidden selection:bg-white selection:text-black fixed inset-0 z-50">
            <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-6 pointer-events-auto">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest">Back</span>
                    </button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={onBack}>
                        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                            <span className="material-symbols-outlined text-black text-xl">insights</span>
                        </div>
                        <span className="font-mono font-bold text-lg tracking-tighter">FEEDTRACK</span>
                    </div>
                </div>
                <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                    Secure Portal Access / Alpha 2.0
                </div>
            </nav>

            <main className="relative min-h-screen w-full flex flex-col md:flex-row">
                <section className="relative flex flex-1 student-gradient-bg flex-col justify-center px-12 md:px-24 py-20 md:py-0 overflow-hidden border-r border-white/5">
                    <div className="grain-overlay absolute inset-0"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-student-accent/10 text-student-accent font-mono text-[10px] uppercase tracking-widest mb-12 border border-student-accent/30">
                            System Entry
                        </span>
                        <h1 className="font-display italic giant-text mb-6">
                            Student
                        </h1>
                        <p className="max-w-md text-white/40 font-sans text-sm leading-loose tracking-wide">
                            Access your institutional feedback loop. Your identifiers ensure localized data processing and sentiment verification.
                        </p>
                    </div>
                    <div className="absolute bottom-8 left-24">
                        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">
                            © 2026 Feedtrack Analytics Group
                        </p>
                    </div>
                </section>

                <section className="relative flex-1 bg-charcoal flex flex-col justify-center px-8 md:px-24 py-12 md:py-0">
                    <div className="grain-overlay absolute inset-0"></div>
                    <div className="relative z-10 w-full max-w-sm mx-auto md:mx-0">
                        <div className="mb-16">
                            <h2 className="font-display text-4xl mb-2">Portal Alpha</h2>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Identification Required</p>
                        </div>

                        <form className="space-y-12" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-white/30" htmlFor="student-id">Student ID</label>
                                <input
                                    className="input-line"
                                    id="student-id"
                                    placeholder="U-00000000"
                                    type="text"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-white/30" htmlFor="password">Password</label>
                                <input
                                    className="input-line"
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-xs font-mono mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex items-center gap-4 text-white hover:text-student-accent transition-colors disabled:opacity-50"
                                >
                                    <span className="font-mono text-xs uppercase tracking-[0.2em] border-b border-white/40 pb-1 group-hover:border-student-accent">
                                        {loading ? 'Authenticating...' : 'Sign In'}
                                    </span>
                                    <span className="material-symbols-outlined text-xl transform group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-24 flex flex-col gap-4 border-t border-white/5 pt-8">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-8">
                                    <button className="flex items-center gap-2 group">
                                        <span className="material-symbols-outlined text-sm text-white/20 group-hover:text-white transition-colors">fingerprint</span>
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">Biometric</span>
                                    </button>
                                    <button className="flex items-center gap-2 group">
                                        <span className="material-symbols-outlined text-sm text-white/20 group-hover:text-white transition-colors">key</span>
                                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">SSO Login</span>
                                    </button>
                                </div>
                                <span
                                    onClick={onSwitchToSignup}
                                    className="font-mono text-[9px] uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white/30"
                                >
                                    Create Account
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 right-8 md:right-24 flex gap-6">
                        <button className="text-white/20 hover:text-white transition-colors" title="Help">
                            <span className="material-symbols-outlined text-lg">question_mark</span>
                        </button>
                        <button className="text-white/20 hover:text-white transition-colors" title="Language">
                            <span className="material-symbols-outlined text-lg">language</span>
                        </button>
                        <button className="text-white/20 hover:text-white transition-colors" title="Security Status">
                            <span className="material-symbols-outlined text-lg">verified_user</span>
                        </button>
                    </div>
                </section>
            </main>

            <style>{`
        .grain-overlay {
            background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBZ4yr0jt_qVjc6Asbjhim7DluGvTKZcvsI0d7LPtsO0SQNdAjw_911USUrYF3M5MIm419CVSBqel1ioEzy3dBUtsugdVXobCYRafGwJhjpiC3abf78B6sHozPtUQw4gM_vYz6s0PivvNIUifsCwFtJCFRfD5lSfFdl-G1bWMI6g1FHekMdJOj2T8VWXc3bxmh88Q15gsD48w4YD9stgUXaJh_hm3UKl-jw3D1iHa_WX3IHt6vbnrNNkzDrE9QpctPdmJ-G2rEfDg);
            opacity: 0.03;
            pointer-events: none;
        }
        .student-gradient-bg {
            background: radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 60%), 
                        linear-gradient(135deg, #1a1512 0%, #0a0a0a 100%);
        }
        .input-line {
            background: transparent;
            border: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.75rem 0;
            outline: none;
            width: 100%;
            color: white;
            font-family: 'Space Grotesk', monospace;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        .input-line::placeholder {
            color: rgba(255, 255, 255, 0.2);
        }
        .input-line:focus {
            border-color: #a855f7;
            box-shadow: none;
        }
        .giant-text {
            font-size: clamp(4rem, 12vw, 10rem);
            line-height: 0.9;
            letter-spacing: -0.02em;
        }
        /* Custom password eye icon styling for dark mode */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
            filter: invert(1);
            cursor: pointer;
        }
        input[type="password"]::-webkit-password-toggle-button {
            filter: invert(1); 
            cursor: pointer;
        }
      `}</style>
        </div>
    );
};
