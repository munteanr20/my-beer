'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with beer icon */}
        <div className="text-center mb-8">
          <div className="beer-icon mb-4">
            <svg className="w-20 h-20 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="heading-primary text-4xl mb-2">My Beer Tracker</h1>
          <p className="text-gray-300 text-lg">Craft your beer journey with style</p>
        </div>

        {/* Auth container with glass effect */}
        <div className="card hover-lift">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            🍺 Track your beer consumption with modern style
          </p>
        </div>
      </div>
    </div>
  );
} 