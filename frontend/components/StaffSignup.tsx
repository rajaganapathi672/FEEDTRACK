
import React, { useState } from 'react';

interface StaffSignupProps {
    onBack: () => void;
    onSwitchToLogin: () => void;
    onSignup: (data: any) => Promise<void>;
    loading?: boolean;
    error?: string;
}

export const StaffSignup: React.FC<StaffSignupProps> = ({ onBack, onSwitchToLogin, onSignup, loading, error }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignup({ name, email, department, password });
    };

    return (
        <div className="bg-background-dark text-white overflow-hidden selection:bg-staff-accent selection:text-black fixed inset-0 z-50">
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
                        <span className="font-mono font-bold text-lg tracking-tighter text-white">FEEDTRACK</span>
                    </div>
                </div>
                <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                    Institutional Registration / Phase 2.4
                </div>
            </nav>

            <main className="relative h-screen w-full flex">
                <section className="relative hidden md:flex flex-1 staff-gradient-bg flex-col justify-center px-24 overflow-hidden border-r border-white/5">
                    <div className="grain-overlay absolute inset-0"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-staff-accent/10 text-staff-accent font-mono text-[10px] uppercase tracking-widest mb-12 border border-staff-accent/30">
                            Faculty Onboarding
                        </span>
                        <h1 className="font-display italic giant-text mb-6">
                            Join Us
                        </h1>
                        <p className="max-w-md text-white/40 font-sans text-sm leading-loose tracking-wide">
                            Create your administrative profile to begin managing student feedback loops and accessing departmental analytics.
                        </p>
                    </div>
                    <div className="absolute bottom-8 left-24">
                        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20">
                            © 2026 Feedtrack Analytics Group
                        </p>
                    </div>
                </section>

                <section className="relative flex-1 bg-charcoal flex flex-col justify-center px-8 md:px-24">
                    <div className="grain-overlay absolute inset-0"></div>
                    <div className="relative z-10 w-full max-w-sm mx-auto md:mx-0">
                        <div className="mb-12">
                            <h2 className="font-display text-4xl mb-2">Staff Portal</h2>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Credentials Verification Required</p>
                        </div>
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-white/30" htmlFor="full-name">Full Name</label>
                                <input
                                    className="input-line"
                                    id="full-name"
                                    placeholder="Dr. Julian Thorne"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-white/30" htmlFor="staff-email">Staff Email</label>
                                <input
                                    className="input-line"
                                    id="staff-email"
                                    placeholder="j.thorne@institution.edu"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-white/30" htmlFor="department">Department</label>
                                <input
                                    className="input-line"
                                    id="department"
                                    placeholder="Department of Social Sciences"
                                    type="text"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-white/30" htmlFor="password">Create Password</label>
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

                            <div className="pt-6">
                                <button
                                    className="group flex items-center gap-4 text-white hover:text-staff-accent transition-colors disabled:opacity-50"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <span className="font-mono text-xs uppercase tracking-[0.2em] border-b border-white/40 pb-1 group-hover:border-staff-accent">
                                        {loading ? 'Registering...' : 'Register as Staff'}
                                    </span>
                                    <span className="material-symbols-outlined text-xl transform group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                                </button>
                            </div>
                        </form>
                        <div className="mt-16 flex items-center gap-4">
                            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Already have an account?</span>
                            <span
                                onClick={onSwitchToLogin}
                                className="font-mono text-[10px] text-white hover:text-staff-accent uppercase tracking-widest underline decoration-white/20 underline-offset-4 hover:decoration-staff-accent transition-all cursor-pointer"
                            >
                                Login
                            </span>
                        </div>
                    </div>
                    <div className="absolute bottom-8 right-8 md:right-24 flex gap-6">
                        <button className="text-white/20 hover:text-white transition-colors" title="Privacy Policy">
                            <span className="material-symbols-outlined text-lg">shield</span>
                        </button>
                        <button className="text-white/20 hover:text-white transition-colors" title="Terms of Service">
                            <span className="material-symbols-outlined text-lg">gavel</span>
                        </button>
                        <button className="text-white/20 hover:text-white transition-colors" title="Contact Support">
                            <span className="material-symbols-outlined text-lg">support_agent</span>
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
        .staff-gradient-bg {
            background: radial-gradient(circle at 30% 30%, rgba(139, 140, 75, 0.15) 0%, transparent 60%), 
                        linear-gradient(135deg, #1a1b12 0%, #1a1512 100%);
        }
        .input-line {
            background: transparent;
            border: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.75rem 0;
            outline: none;
            width: 100%;
            color: white;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        .input-line::placeholder {
            color: rgba(255, 255, 255, 0.2);
        }
        .input-line:focus {
            border-color: #a3a363;
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
