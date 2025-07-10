'use client';

import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ThemeToggle from './ThemeToggle';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [bubbles, setBubbles] = useState<Array<{ id: number; size: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
      {/* Theme Toggle Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Enhanced bubbles */}
      <div className="bubble-container">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">🍺</div>
            <h1 className="heading-font text-4xl font-bold text-tavern-primary mb-4" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
              Ghimbav's Tavern
            </h1>
            <p className="body-font text-lg text-tavern-primary font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              Welcome to the finest tavern in the realm!
            </p>
          </div>
          
          <div className="tavern-glass rounded-xl p-8 border border-[var(--tavern-copper)] shadow-2xl">
            {isLogin ? (
              <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
          
          <div className="text-center text-sm">
            <p className="text-tavern-primary body-font tavern-glass p-4 rounded-lg font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
              For a better experience use @best-eu.org ID to enter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 