'use client';

import { useAuth } from '../hooks/useAuth';
import AddBeerForm from './beer/AddBeerForm';
import BeerList from './beer/BeerList';
import BeerStats from './beer/BeerStats';
import Navbar from './ui/Navbar';
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
          <div className="text-center">
            <div className="animate-bounce text-6xl mb-4">🍺</div>
            <p className="text-xl font-semibold text-tavern-primary">Pouring the perfect ale for you..</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LeaderboardProvider>
    <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
      {/* Reusable Navbar Component */}
      <Navbar currentPage="Dashboard"/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Hero Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl tavern-glass border border-[var(--tavern-copper)] shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-16 h-16 bg-[var(--tavern-gold)] rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-20 right-8 w-12 h-12 bg-[var(--tavern-copper)] rounded-full blur-lg animate-pulse delay-1000"></div>
              <div className="absolute bottom-8 left-1/4 w-20 h-20 bg-[var(--tavern-gold)] rounded-full blur-xl animate-pulse delay-500"></div>
              <div className="absolute bottom-16 right-1/4 w-14 h-14 bg-[var(--tavern-copper)] rounded-full blur-lg animate-pulse delay-1500"></div>
            </div>
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
                {/* Main Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Status Badge */}
                  <div className="inline-flex items-center space-x-3 mb-6 px-4 py-2 hero-badge rounded-full">
                    <div className="w-2 h-2 bg-[var(--tavern-gold)] rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-[var(--tavern-gold)]">Live Dashboard</span>
                  </div>
                  
                  {/* Main Heading */}
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-[var(--tavern-gold)] via-[var(--tavern-copper)] to-[var(--tavern-gold)] bg-clip-text text-transparent animate-gradient">
                      Beer Tracker
                    </span>
                    <br />
                    <span className="text-tavern-primary text-3xl md:text-4xl lg:text-5xl">
                      Dashboard
                    </span>
                  </h1>
                  
                  {/* Feature Highlights */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="flex items-center space-x-2 px-3 py-1 hero-feature-pill rounded-full">
                      <span className="text-sm">📊</span>
                      <span className="text-xs text-tavern-primary">Track Stats</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 hero-feature-pill rounded-full">
                      <span className="text-sm">⭐</span>
                      <span className="text-xs text-tavern-primary">Achievements</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 hero-feature-pill rounded-full">
                      <span className="text-sm">🏆</span>
                      <span className="text-xs text-tavern-primary">Leaderboard</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-tavern-primary opacity-90 max-w-2xl">
                    Your personal beer collection hub. Track, discover, and celebrate your craft beer journey.
                  </p>
                </div>
                
                {/* Interactive Stats Preview */}
                <div className="flex flex-col items-center space-y-6">
                  {/* Central Beer Icon */}
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gradient-to-br from-[var(--tavern-gold)] via-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110">
                      <span className="text-5xl group-hover:rotate-12 transition-transform duration-500">🍺</span>
                    </div>
                    {/* Orbiting Elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--tavern-gold)] rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-xs">📈</span>
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[var(--tavern-copper)] rounded-full flex items-center justify-center animate-pulse delay-500">
                      <span className="text-xs">⭐</span>
                    </div>
                    <div className="absolute top-1/2 -right-4 w-6 h-6 bg-[var(--tavern-gold)] rounded-full flex items-center justify-center animate-pulse delay-1000">
                      <span className="text-xs">🏆</span>
                    </div>
                  </div>
                  
                  {/* Quick Stats Preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 tavern-glass rounded-xl border border-[var(--tavern-copper)]/30">
                      <div className="text-2xl font-bold text-[var(--tavern-gold)]">∞</div>
                      <div className="text-xs text-tavern-primary opacity-80">Beers to Try</div>
                    </div>
                    <div className="text-center p-3 tavern-glass rounded-xl border border-[var(--tavern-copper)]/30">
                      <div className="text-2xl font-bold text-[var(--tavern-gold)]">🎯</div>
                      <div className="text-xs text-tavern-primary opacity-80">Goals Set</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Statistics Section */}
        <div className="mb-12 transform hover:scale-[1.01] transition-transform duration-500">
          <BeerStats userId={user.uid} variant="dashboard" />
        </div>
        
        {/* Modern Dashboard Grid */}
        <div className="space-y-12">
          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Add Beer Form - Modern Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--tavern-gold)] to-[var(--tavern-copper)] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative tavern-glass rounded-3xl p-8 border border-[var(--tavern-copper)] shadow-2xl hover:shadow-3xl transition-all duration-500">
                <AddBeerForm userId={user.uid} />
              </div>
            </div>
            
            {/* Recent Collection - Modern Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative tavern-glass rounded-3xl p-8 border border-[var(--tavern-copper)] shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--tavern-gold)] to-[var(--tavern-copper)] rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--tavern-gold)]">Recent Collection</h3>
                      <p className="text-[var(--tavern-cream)] opacity-80">Your latest beer entries</p>
                    </div>
                  </div>
                </div>
                <BeerList userId={user.uid} showHeader={false} />
              </div>
            </div>
          </div>

          {/* Community Section - Modern Cards */}
          <div className="space-y-8">
            {/* Leaderboard - Modern Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--tavern-gold)] to-[var(--tavern-copper)] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative tavern-glass rounded-3xl p-8 border border-[var(--tavern-copper)] shadow-2xl hover:shadow-3xl transition-all duration-500">
                <Leaderboard />
              </div>
            </div>

            {/* Achievements - Modern Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative tavern-glass rounded-3xl p-8 border border-[var(--tavern-copper)] shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--tavern-gold)] to-[var(--tavern-copper)] rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--tavern-gold)]">Your Achievements</h3>
                      <p className="text-[var(--tavern-cream)] opacity-80">Unlock badges and track your progress</p>
                    </div>
                  </div>
                </div>
                <AchievementList userId={user.uid} showHeader={false} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
    </LeaderboardProvider>
  );
} 