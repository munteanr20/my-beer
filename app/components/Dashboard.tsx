'use client';

import { useAuth } from '../hooks/useAuth';
import AddBeerForm from './beer/AddBeerForm';
import BeerList from './beer/BeerList';
import BeerStats from './beer/BeerStats';
import ThemeToggle from './ui/ThemeToggle';
import Footer from './ui/Footer';
import AchievementList from './achievements/AchievementList';
import Leaderboard from './leaderboard/Leaderboard';
import { LeaderboardProvider } from '../contexts/LeaderboardContext';
// import CircleLeaderboard from './leaderboard/CircleLeaderboard';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-semibold text-tavern-primary">Pouring the perfect ale for you... 🍺</p>
        </div>
      </div>
    );
  }

  return (
    <LeaderboardProvider>
    <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
      {/* Header */}
      <header className="relative z-10 bg-[var(--tavern-dark)] shadow-lg border-b border-[var(--tavern-copper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-4 space-y-6 sm:space-y-0">
            {/* Logo and Title Section */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="text-5xl sm:text-5xl lg:text-4xl transform hover:scale-110 transition-transform duration-300">🍺</div>
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-3">
                <h1 className="heading-font text-3xl sm:text-3xl lg:text-4xl font-bold text-[var(--tavern-gold)] mb-1 sm:mb-0 text-center sm:text-left" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
                  Ghimbav's Tavern
                </h1>
                <span className="hidden sm:inline text-tavern-accent text-3xl">|</span>
                <span className="body-font text-sm sm:text-base text-[var(--tavern-cream)] opacity-80 mt-2 font-semibold text-center sm:text-left">
                  Beer Tracker
                </span>
              </div>
            </div>

            {/* User Info and Actions Section */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* User Profile Section - Mobile Layout */}
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 order-1 sm:order-1">
                {/* Profile Image */}
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-12 h-12 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--tavern-gold)]"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-10 sm:h-10 bg-[var(--tavern-copper)] rounded-full flex items-center justify-center">
                    <span className="text-[var(--tavern-dark)] text-lg sm:text-base font-medium">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Welcome Text and Name - Mobile Layout */}
                <div className="flex flex-col items-center space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                  <div className="body-font text-sm sm:text-base text-[var(--tavern-cream)] font-medium text-center sm:text-left" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
                    Welcome,
                  </div>
                  <div className="body-font text-base sm:text-base text-[var(--tavern-gold)] font-semibold text-center sm:text-left" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                </div>
              </div>

              {/* Theme Toggle, Profile and Logout Buttons - Mobile Layout */}
              <div className="flex flex-row items-center justify-center space-x-3 sm:flex-row sm:space-x-3 order-2 sm:order-2 mt-4 sm:mt-0">
                <ThemeToggle />
                <a
                  href="/profile"
                  className="beer-button px-4 sm:px-4 py-2 sm:py-2 rounded-md transition-colors text-sm sm:text-base flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Profile</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="beer-button px-4 sm:px-4 py-2 sm:py-2 rounded-md transition-colors text-sm sm:text-base flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 sm:hidden flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ margin: 0 }}>
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Leave the Tavern</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <div className="mb-8">
          <BeerStats userId={user.uid} variant="dashboard" />
        </div>
        
        <div className="dashboard-grid-container">
          {/* Add Beer Form */}
          <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
            <AddBeerForm 
              userId={user.uid} 
            />
          </div>
          
          {/* Beer List */}
          <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
            <BeerList 
              userId={user.uid} 
            />
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <Leaderboard />
            {/* <CircleLeaderboard /> */}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-8">
          <AchievementList userId={user.uid} />
        </div>
      </main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
    </LeaderboardProvider>
  );
} 