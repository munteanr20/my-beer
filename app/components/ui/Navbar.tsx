'use client';

import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import NavbarDropdownItem from './NavbarDropdownItem';
import { UserService } from '../../services/userService';
import { User } from '../../types';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  currentPage?: string;
  showAddBeer?: boolean;
}

const navigationItems: Array<{ name: string; href: string; icon: string; label: string }> = [
  // No navigation items - logo/brand will be clickable instead
];

export default function Navbar({ currentPage = 'Dashboard'}: NavbarProps) {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // desktop
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false); // mobile
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleLiveSearch = () =>{
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const userService = new UserService();
      userService.searchUsersByName(searchTerm.toLowerCase()).then((users) => {
        setSearchResults(users);
      });
    }, 300);
  }
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if (searchTerm) {
      setSearchTerm('');
    }
    else{
    }
  }

  const handleMobileSearch = () =>{
    setIsMobileProfileMenuOpen(false);
    setIsMobileSearchOpen(!isMobileSearchOpen);
  }

  // Desktop profile menu handler
  const handleDesktopProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMobileProfileMenuOpen(false);
  };
  // Mobile profile menu handler
  const handleMobileProfileMenu = () => {
    setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen);
    setIsMobileSearchOpen(false);
  };

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

          <div className="relative w-full max-w-sm hidden md:flex mx-auto">
            <form className="flex items-center w-full" role="search" onSubmit={handleSearch}>
              <input type = "text" placeholder='Search users' aria-label="Search users" name="search" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); handleLiveSearch()}} className='w-full bg-transparent border-2 border-[var(--tavern-gold)] rounded-l-full py-2 px-4 text-sm text-[var(--tavern-cream)] focus:outline-none focus:border-[var(--tavern-copper)] transition-colors duration-300' />
              {searchTerm ? (
                <button
                  type="button"
                  className="bg-[var(--tavern-gold)] text-[var(--tavern-dark)] px-6 py-2 rounded-r-full -ml-px hover:bg-[var(--tavern-copper)] transition-colors duration-300 flex items-center justify-center"
                  aria-label="Clear search"
                  onClick={() => { setSearchTerm(''); setSearchResults([]); }}
                >
                  {/* X icon */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button className='bg-[var(--tavern-gold)] text-[var(--tavern-dark)] px-6 py-3 rounded-r-full -ml-px hover:bg-[var(--tavern-copper)] transition-colors duration-300' aria-label="Search">
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
                  </svg>
                </button>
              )}
            </form>
            {searchTerm && (
              <div className="absolute left-0 right-0 mt-13 bg-[var(--tavern-dark)] border border-[var(--tavern-copper)] rounded-lg shadow-2xl z-50 max-h-72 overflow-y-auto w-full animate-fadeIn">
                {searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div 
                    key={user.uid} 
                    className="flex items-center px-4 py-2 hover:bg-[var(--tavern-copper)]/10 cursor-pointer transition-colors"
                    onClick={() => {
                      router.push(`/profile/${user.uid}`);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-3" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center mr-3">
                          <span className="text-[var(--tavern-dark)] font-bold">
                            {user.displayName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[var(--tavern-gold)] font-medium">{user.displayName}</span>
                        <span className="text-xs text-[var(--tavern-cream)]">{user.email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-[var(--tavern-cream)] text-sm text-center opacity-70">
                    No users found.
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onClick={handleDesktopProfileMenu}
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
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--tavern-dark)] border border-[var(--tavern-copper)] rounded-lg shadow-2xl backdrop-blur-sm z-50">
                  <div className="py-2">
                    <NavbarDropdownItem
                      onClick={() => {
                        router.push(`/profile/${user.uid}`);
                      }}
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
            <div className='flex items-center space-x-3'>
            <button className='text-[var(--tavern-gold)] p-2' onClick={handleMobileSearch}>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
                </svg>
              </button>
            </div>
          {/* User Profile */}
          <button className='text-[var(--tavern-gold)] p-2' onClick={handleMobileProfileMenu}>
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
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileProfileMenuOpen && (
          <div className="absolute right-3 mt-2 w-48 bg-[var(--tavern-dark)] border border-[var(--tavern-copper)] rounded-lg shadow-2xl backdrop-blur-sm z-50">
            <div className="py-2">
              <NavbarDropdownItem
                onClick={() => {
                  router.push(`/profile/${user.uid}`);
                }}
                text="View Profile"
                className="text-[var(--tavern-gold)]"
                icon={
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                }
              />
              {/* Divider */}
              <div className="my-2 w-4/5 mx-auto border-t border-[var(--tavern-copper)]/60" />
              <NavbarDropdownItem
                text="Logout"
                onClick={handleLogout}
                className="text-[var(--tavern-gold)]"
                icon={
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                }
              />
            </div>
          </div>
        )}

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden border-t border-[var(--tavern-copper)]/20 relative">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="flex items-center justify-between px-3 py-2">
                <form className="flex items-center w-full max-w-sm md:flex mx-auto" role="search" onSubmit={handleSearch}>
                  <input type = "text" placeholder='Search users' aria-label="Search users" name="search" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); handleLiveSearch()}} className='w-full max-w-sm bg-transparent border-2 border-[var(--tavern-gold)] rounded-full py-2 px-4 text-sm text-[var(--tavern-cream)] focus:outline-none focus:border-[var(--tavern-copper)] transition-colors duration-300' />
                </form>
              </div>
              {/* Mobile user search results dropdown */}
              {searchTerm && (
                <div className="absolute left-0 right-0 mt-2 bg-[var(--tavern-dark)] border border-[var(--tavern-copper)] rounded-lg shadow-2xl z-50 max-h-72 overflow-y-auto w-full animate-fadeIn">
                  {searchResults.length > 0 ? (
                    searchResults.map(user => (
                      <div 
                      key={user.uid}
                      onClick={() => {
                        router.push(`/profile/${user.uid}`);
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                      className="flex items-center px-4 py-2 hover:bg-[var(--tavern-copper)]/10 cursor-pointer transition-colors">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-3" />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center mr-3">
                            <span className="text-[var(--tavern-dark)] font-bold">
                              {user.displayName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[var(--tavern-gold)] font-medium">{user.displayName}</span>
                          <span className="text-xs text-[var(--tavern-cream)]">{user.email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-[var(--tavern-cream)] text-sm text-center opacity-70">
                      No users found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>  
    </nav>
  );
} 