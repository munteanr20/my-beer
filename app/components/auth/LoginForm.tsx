'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const validateEmail = (email: string) => {
    return email.endsWith('@best-eu.org');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Only email addresses ending in @best-eu.org are allowed.');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login error');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const result = await loginWithGoogle();
    
    if (!result.success) {
      setError(result.error || 'Google login error');
    }
    
    setGoogleLoading(false);
  };

  return (
    <div>
      <h2 className="heading-font text-2xl font-bold text-center mb-6 text-tavern-primary" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
        Welcome Back!
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-tavern-primary mb-2" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.2)' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="beer-input w-full px-4 py-2.5 rounded-lg focus:outline-none text-[var(--tavern-dark)] placeholder-[var(--tavern-dark)]/60"
            placeholder="user@best-eu.org"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-tavern-primary mb-2" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.2)' }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="beer-input w-full px-4 py-2.5 rounded-lg pr-10 focus:outline-none text-[var(--tavern-dark)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--tavern-copper)] hover:text-[var(--tavern-dark)]"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.1)' }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="beer-button w-full py-2.5 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Pouring...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-8">
        <div className="relative flex items-center justify-center gap-4">
          <div className="w-full border-t border-[var(--tavern-copper)]" />
          <span className="text-lg font-semibold px-4 text-tavern-primary" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.2)' }}>
            Or
          </span>
          <div className="w-full border-t border-[var(--tavern-copper)]" />
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="google-button mt-6 w-full flex items-center justify-center px-4 py-2.5 rounded-lg disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Opening the can...' : 'Continue with Google'}
        </button>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToSignup}
          className="text-tavern-primary text-sm font-semibold transition-colors" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.2)' }}>
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
} 