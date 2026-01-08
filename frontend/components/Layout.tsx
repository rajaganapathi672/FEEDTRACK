
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, GraduationCap, Users } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-full flex flex-col bg-background-dark overflow-hidden">
      <main className="flex-1 w-full h-full overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};
