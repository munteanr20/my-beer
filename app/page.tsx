'use client';

import { useAuth } from './hooks/useAuth';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-bounce text-6xl mb-4">🍺</div>
            <p className="text-xl font-semibold text-tavern-primary">Pouring the perfect ale for you..</p>
          </div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
}
