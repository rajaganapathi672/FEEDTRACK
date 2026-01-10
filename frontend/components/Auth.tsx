import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { apiService } from '../services/apiService';
import { LandingPage } from './LandingPage';
import { StudentLogin } from './StudentLogin';
import { StaffLogin } from './StaffLogin';
import { StudentSignup } from './StudentSignup';
import { StaffSignup } from './StaffSignup';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'signin' | 'signup';

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle browser history and initial load
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role');
      const modeParam = params.get('mode');

      if (role === 'student') {
        setSelectedRole(UserRole.STUDENT);
      } else if (role === 'staff') {
        setSelectedRole(UserRole.STAFF);
      } else {
        setSelectedRole(null);
      }

      if (modeParam === 'signup') {
        setMode('signup');
      } else {
        setMode('signin');
      }
      setError('');
    };

    // Initial load check
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (role: UserRole | null, newMode: AuthMode) => {
    setSelectedRole(role);
    setMode(newMode);
    setError('');

    const url = new URL(window.location.href);
    if (role) {
      url.searchParams.set('role', role === UserRole.STUDENT ? 'student' : 'staff');
      url.searchParams.set('mode', newMode);
    } else {
      url.searchParams.delete('role');
      url.searchParams.delete('mode');
    }
    window.history.pushState({}, '', url.toString());
  };

  const handleLogin = async (id: string, password: string) => {
    if (!selectedRole) return;

    setError('');
    setLoading(true);

    try {
      const user = await apiService.signin(id, password);

      if (user.role !== selectedRole) {
        throw new Error(`This account is registered as a ${user.role.toLowerCase()}. Please use the correct portal.`);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: any) => {
    if (!selectedRole) return;

    setError('');
    setLoading(true);

    try {
      // Adapt new fields to existing apiService.signup(name, email, role, password)
      // For student: data = { name, email, studentId, password }
      // For staff: data = { name, email, department, password }

      const institutionId = selectedRole === UserRole.STUDENT ? data.studentId : data.department;
      const user = await apiService.signup(data.name, data.email, selectedRole, data.password, institutionId);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const resetPortal = () => {
    navigateTo(null, 'signin');
  };

  const switchToSignup = () => {
    navigateTo(selectedRole, 'signup');
  };

  const switchToLogin = () => {
    navigateTo(selectedRole, 'signin');
  };

  // 1. Initial Portal Selection View
  if (!selectedRole) {
    return (
      <LandingPage onSelectRole={(role) => navigateTo(role, 'signin')} />
    );
  }

  // 2. Focused Authentication View
  if (selectedRole === UserRole.STUDENT) {
    if (mode === 'signup') {
      return (
        <StudentSignup
          onBack={resetPortal}
          onSwitchToLogin={switchToLogin}
          onSignup={handleSignup}
          loading={loading}
          error={error}
        />
      );
    }
    return (
      <StudentLogin
        onBack={resetPortal}
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
        loading={loading}
        error={error}
      />
    );
  }

  if (selectedRole === UserRole.STAFF) {
    if (mode === 'signup') {
      return (
        <StaffSignup
          onBack={resetPortal}
          onSwitchToLogin={switchToLogin}
          onSignup={handleSignup}
          loading={loading}
          error={error}
        />
      );
    }
    return (
      <StaffLogin
        onBack={resetPortal}
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
        loading={loading}
        error={error}
      />
    );
  }

  return null;
};
