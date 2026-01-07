
import React, { useState, useEffect } from 'react';
import { User, UserRole, Feedback } from './types';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { StudentDashboard } from './components/StudentDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { apiService } from './services/apiService';
import { GraduationCap, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load existing user session
    const savedUser = localStorage.getItem('feedtrack_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse saved user", e);
        // If parsing fails, we should stop loading and maybe clear invalid storage
        localStorage.removeItem('feedtrack_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const initializeData = async () => {
      try {
        const data = await apiService.getAllFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        console.error("Critical failure during initialization", err);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    initializeData();
  }, [user]);

  // Polling effect for pending analysis
  useEffect(() => {
    if (!feedbacks.some(f => (f.analysis?.sentiment as any) === 'Pending' || !f.analysis)) return;

    const intervalId = setInterval(async () => {
      try {
        // Silent update
        const data = await apiService.getAllFeedbacks();

        // Only update if there are changes to avoid render thrashing (simple length/content check or just set)
        // For simplicity, we just set it, React will handle diffing mostly, but we can check specifically if pending count changed?
        // Let's just set it. The user wants updates.
        setFeedbacks(data);
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(intervalId);
  }, [feedbacks]);

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    localStorage.setItem('feedtrack_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('feedtrack_user');
  };

  const handleAddFeedback = (feedback: Feedback) => {
    setFeedbacks(prev => [feedback, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 radial-glow animate-pulse-glow pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-12 relative group">
            <div className="absolute -inset-4 bg-accent-purple/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative w-24 h-24 bg-white/5 dark:bg-white/10 backdrop-blur-xl border border-white/10 dark:border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-6xl logo-gradient select-none">
                school
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-accent-purple/20 dark:border-white/10"></div>
              <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-t-2 border-accent-purple animate-spin-slow"></div>
            </div>
            <div className="text-center">
              <p className="text-xs font-outfit font-medium tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400 opacity-80 animate-pulse">
                Syncing Feedtrack...
              </p>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-20">
          <button
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:scale-110 active:scale-95 text-gray-600 dark:text-gray-300"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            <span className="material-symbols-outlined text-sm dark:hidden">dark_mode</span>
            <span className="material-symbols-outlined text-sm hidden dark:block">light_mode</span>
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {user.role === UserRole.STUDENT ? (
        <StudentDashboard
          user={user}
          feedbacks={feedbacks}
          onAddFeedback={handleAddFeedback}
          onLogout={handleLogout}
        />
      ) : (
        <StaffDashboard
          feedbacks={feedbacks}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
};

export default App;
