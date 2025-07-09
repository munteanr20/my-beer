'use client';

import { useAuth } from '../hooks/useAuth';
import { getCurrentYear } from '../lib/utils';
import AddBeerForm from './AddBeerForm';
import BeerList from './BeerList';
import BeerStats from './BeerStats';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-semibold text-[var(--tavern-cream)]">Pouring the perfect ale for you... 🍺</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
      {/* Header */}
      <header className="relative z-10 bg-[var(--tavern-dark)] shadow-lg border-b border-[var(--tavern-copper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-4 space-y-6 sm:space-y-0">
            {/* Logo and Title Section */}
            <div className="flex items-center space-x-3 sm:space-x-3">
              <div className="text-5xl sm:text-5xl lg:text-6xl transform hover:scale-110 transition-transform duration-300">🍺</div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <h1 className="heading-font text-3xl sm:text-3xl lg:text-4xl font-bold text-[var(--tavern-gold)] mb-1 sm:mb-0" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
                  Ghimbav's Tavern
                </h1>
                <span className="hidden sm:inline text-[var(--tavern-copper)] text-lg">|</span>
                <span className="body-font text-sm sm:text-base text-[var(--tavern-cream)] opacity-80">
                  Beer Tracker
                </span>
              </div>
            </div>

            {/* User Info and Actions Section */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 sm:space-x-3 order-2 sm:order-1 mt-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--tavern-gold)]"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-10 sm:h-10 bg-[var(--tavern-copper)] rounded-full flex items-center justify-center">
                    <span className="text-[var(--tavern-dark)] text-base sm:text-base font-medium">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <div className="body-font text-base sm:text-base text-[var(--tavern-cream)] font-semibold text-center sm:text-left" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
                    Welcome, {user.displayName || user.email?.split('@')[0]}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="beer-button px-6 sm:px-4 py-3 sm:py-2 rounded-md transition-colors text-base sm:text-base order-1 sm:order-2 w-48 sm:w-auto"
              >
                <span className="hidden sm:inline">Leave the Tavern</span>
                <span className="sm:hidden">Leave the Tavern</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <div className="mb-8">
          <BeerStats userId={user.uid} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Beer Form */}
          <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
            <AddBeerForm 
              userId={user.uid} 
              onBeerAdded={() => {
                console.log('Beer added successfully!');
              }}
            />
          </div>
          
          {/* Beer List */}
          <div>
            <BeerList 
              userId={user.uid} 
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[var(--tavern-dark)] border-t border-[var(--tavern-copper)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tavern Info */}
            <div className="text-center md:text-left">
              <h3 className="heading-font text-xl font-bold text-[var(--tavern-gold)] mb-3" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
                Ghimbav's Tavern
              </h3>
              <p className="body-font text-[var(--tavern-cream)] text-md">
              Hark, travelers! My friend's simple wish to count his beers sparked an idea. How could I help? Thus, I forged the finest establishment for tracking your beer journey across the realm – an app to record every cherished pint. Embark on your own legendary beer odyssey today!
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="text-center md:text-right">
              <h4 className="body-font font-semibold text-[var(--tavern-gold)] mb-3" style={{ textShadow: '1px 1px 1px var(--tavern-copper)' }}>
                Tavern Keeper
              </h4>
              <p className="body-font text-[var(--tavern-cream)] text-md">
                For support and inquiries
              </p>              
              {/* Social Links */}
              <div className="mt-4 space-y-2">
                <a href="mailto:razvan.muntean@best-eu.org" className="flex items-center justify-center md:justify-end space-x-2 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="body-font text-sm">Email</span>
                </a>
                <a href="https://www.instagram.com/munteanr20/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-end space-x-2 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="body-font text-sm">Instagram</span>
                </a>
                <a href="https://revolut.me/munteanr20" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-end space-x-2 text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M 5 2  L 5 18  L 7 18 M 5 2  L 12 2  A 4 4 0 0 1 12 10 L 7 10  L 7 18 M 11 10 L 17 18 L 15 18 L 9 10 Z"/>
                  </svg>
                  <span className="body-font text-sm">Revolut</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[var(--tavern-copper)] mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="body-font text-[var(--tavern-cream)] text-sm text-center md:text-left">
                © {getCurrentYear()} Ghimbav's Tavern. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-lg">🍺</span>
                <span className="body-font text-[var(--tavern-cream)] text-sm">
                  Crafted with ale and magic
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 