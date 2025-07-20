'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import NavbarButton from './NavbarButton';
import NavbarDropdownItem from './NavbarDropdownItem';

interface NavbarProps {
  currentPage?: string;
  showAddBeer?: boolean;
}

const navigationItems: Array<{ name: string; href: string; icon: string; label: string }> = [
  // No navigation items - logo/brand will be clickable instead
];

export default function Navbar({ currentPage = 'Dashboard'}: NavbarProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  if (!user) {
    return null;
  }

  return (
    <nav className="relative z-10 bg-gradient-to-b from-[var(--tavern-dark)] via-[var(--tavern-dark)] to-[var(--tavern-dark)]/95 shadow-2xl border-b border-[var(--tavern-copper)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand - Clickable */}
          <a href="/" className="flex items-center space-x-4 group hover:scale-105 transition-all duration-300">
            <div className="text-4xl transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
              🍺
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <h1 className="heading-font text-2xl font-bold text-[var(--tavern-gold)] group-hover:text-[var(--tavern-copper)] transition-colors duration-300" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
                Ghimbav's Tavern
              </h1>
              <span className="text-[var(--tavern-cream)] text-lg">|</span>
              <span className="body-font text-sm text-[var(--tavern-cream)] opacity-80">
                Beer Tracker
              </span>
            </div>
            {/* Mobile Brand */}
            <div className="sm:hidden">
              <h1 className="heading-font text-xl font-bold text-[var(--tavern-gold)] group-hover:text-[var(--tavern-copper)] transition-colors duration-300" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
                Tavern
              </h1>
            </div>
          </a>

          {/* Desktop Navigation - Removed since logo is clickable */}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-[var(--tavern-gold)] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <span className="text-[var(--tavern-dark)] text-lg font-bold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-[var(--tavern-gold)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="flex flex-col">
                  <span className="body-font text-sm text-[var(--tavern-cream)]">Hello,</span>
                  <span className="body-font text-sm font-semibold text-[var(--tavern-gold)] group-hover:text-[var(--tavern-copper)] transition-colors duration-300">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--tavern-dark)] border border-[var(--tavern-copper)] rounded-lg shadow-2xl backdrop-blur-sm z-50">
                  <div className="py-2">
                    <NavbarDropdownItem
                      href="/profile"
                      text="View Profile"
                      icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      }
                    />
                    <NavbarDropdownItem
                      text="Logout"
                      onClick={handleLogout}
                      icon={
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-3">
            {/* User Profile */}
            <div className="relative group">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-[var(--tavern-gold)] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-[var(--tavern-dark)] text-lg font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="beer-button p-2 rounded-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--tavern-copper)]/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile User Info */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center space-x-3">
                  <ThemeToggle />
                  <span className="body-font text-sm text-[var(--tavern-cream)]">
                    Hello, {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <NavbarButton
                  text="Logout"
                  emoji="🚪"
                  onClick={handleLogout}
                  className="px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 