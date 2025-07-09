'use client';

import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="beer-icon mb-4">
            <svg className="w-16 h-16 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="loading-pulse">
            <h2 className="heading-primary text-2xl mb-2">Loading...</h2>
            <p className="text-gray-300">Preparing your beer journey</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? <Dashboard /> : <AuthPage />}
    </div>
  );
}
