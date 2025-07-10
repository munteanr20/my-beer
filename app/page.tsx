'use client';

import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen tavern-bg wood-texture">
        <p className="text-xl font-semibold text-tavern-primary">Pouring the perfect beer for you... 🍺</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
}
