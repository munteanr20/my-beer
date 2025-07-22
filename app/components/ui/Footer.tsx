'use client';

import { getCurrentYear } from '../../lib/utils';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-t from-[var(--tavern-dark)] via-[var(--tavern-dark)]/95 to-[var(--tavern-dark)]/90 border-t border-[var(--tavern-copper)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Enhanced Tavern Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="text-4xl transform hover:scale-110 transition-transform duration-300">🍺</div>
              <h3 className="heading-font text-2xl font-bold text-[var(--tavern-gold)]" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
                Ghimbav's Tavern
              </h3>
            </div>
            <p className="body-font text-[var(--tavern-cream)] text-lg leading-relaxed mb-6">
              Hark, travelers! My friend's simple wish to count his beers sparked an idea. How could I help? Thus, I forged the finest establishment for tracking your beer journey across the realm – an app to record every cherished pint.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div className="text-center lg:text-left">
            <h4 className="body-font font-bold text-[var(--tavern-gold)] mb-6 text-lg" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
              Quick Links
            </h4>
            <div className="space-y-4">
              <a href="/" className="block body-font text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-all duration-300 hover:translate-x-2 group">
                <span className="flex items-center justify-center lg:justify-start space-x-2">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Dashboard</span>
                </span>
              </a>
              <a href="/profile" className="block body-font text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-all duration-300 hover:translate-x-2 group">
                <span className="flex items-center justify-center lg:justify-start space-x-2">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Profile</span>
                </span>
              </a>
              <a href="/leaderboard" className="block body-font text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-all duration-300 hover:translate-x-2 group">
                <span className="flex items-center justify-center lg:justify-start space-x-2">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Leaderboard</span>
                </span>
              </a>
            </div>
          </div>
          
          {/* Enhanced Contact Info */}
          <div className="text-center lg:text-left">
            <h4 className="body-font font-bold text-[var(--tavern-gold)] mb-6 text-lg" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
              Tavern Keeper
            </h4>
            <p className="body-font text-[var(--tavern-cream)] text-lg mb-6">
              For support and inquiries
            </p>              
            {/* Enhanced Social Links */}
            <div className="space-y-4">
              <a href="mailto:razvan.muntean@best-eu.org" className="flex items-center justify-center lg:justify-start space-x-3 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-all duration-300 hover:translate-x-2 group">
                <div className="w-10 h-10 bg-[var(--tavern-copper)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--tavern-copper)]/40 transition-all duration-300">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <span className="body-font text-base font-medium">Email</span>
              </a>
              <a href="https://www.instagram.com/munteanr20/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start space-x-3 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-all duration-300 hover:translate-x-2 group">
                <div className="w-10 h-10 bg-[var(--tavern-copper)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--tavern-copper)]/40 transition-all duration-300">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="body-font text-base font-medium">Instagram</span>
              </a>
              <a href="https://revolut.me/munteanr20" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start space-x-3 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-all duration-300 hover:translate-x-2 group">
                <div className="w-10 h-10 bg-[var(--tavern-copper)]/20 rounded-full flex items-center justify-center group-hover:bg-[var(--tavern-copper)]/40 transition-all duration-300">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M 5 2  L 5 18  L 7 18 M 5 2  L 12 2  A 4 4 0 0 1 12 10 L 7 10  L 7 18 M 11 10 L 17 18 L 15 18 L 9 10 Z"/>
                  </svg>
                </div>
                <span className="body-font text-base font-medium">Revolut</span>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar with Better Design */}
        <div className="border-t border-[var(--tavern-copper)] pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-2xl animate-pulse">🍺</span>
              <p className="body-font text-[var(--tavern-cream)] text-sm">
                © {getCurrentYear()} Ghimbav's Tavern. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="body-font text-[var(--tavern-cream)] text-sm opacity-80">
                Made with ❤️, ale and magic
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 