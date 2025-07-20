'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAchievements } from '../../hooks/useAchievements';
import { userService } from '../../services/userService';
import { User } from '../../types';
import BeerStats from '../beer/BeerStats';
import BeerList from '../beer/BeerList';
import AchievementList from '../achievements/AchievementList';
import ThemeToggle from '../ui/ThemeToggle';
import Footer from '../ui/Footer';
import { LeaderboardProvider } from '../../contexts/LeaderboardContext';

type ProfileTab = 'overview' | 'collection' | 'achievements' | 'settings';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [userData, setUserData] = useState<User | null>(null);
  
  // Get real achievement data
  const { achievements, loading: achievementsLoading, unlockedCount, totalCount } = useAchievements(user?.uid || '');

  // Fetch user data with creation date
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const data = await userService.getUser(user.uid);
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-bounce text-6xl mb-4">🍺</div>
            <p className="text-xl font-semibold text-tavern-primary">Pouring the perfect ale for you...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'collection', label: 'Collection' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <LeaderboardProvider>
    <div className="min-h-screen relative overflow-hidden tavern-bg wood-texture">
      {/* Enhanced Header with Gradient */}
      <header className="relative z-10 bg-gradient-to-b from-[var(--tavern-dark)] via-[var(--tavern-dark)] to-[var(--tavern-dark)]/95 shadow-2xl border-b border-[var(--tavern-copper)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 sm:py-4 space-y-6 sm:space-y-0">
            {/* Logo and Title Section with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="text-6xl sm:text-5xl lg:text-4xl transform hover:scale-110 transition-all duration-300 hover:rotate-12">🍺</div>
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4">
                <h1 className="heading-font text-3xl sm:text-3xl lg:text-4xl font-bold text-[var(--tavern-gold)] mb-1 sm:mb-0 text-center sm:text-left" style={{ textShadow: '3px 3px 6px var(--tavern-copper)' }}>
                  Ghimbav's Tavern
                </h1>
                <span className="hidden sm:inline text-tavern-accent text-3xl animate-pulse">|</span>
                <span className="body-font text-sm sm:text-base text-[var(--tavern-cream)] opacity-90 mt-2 font-semibold text-center sm:text-left bg-[var(--tavern-copper)]/20 px-3 py-1 rounded-full">
                  Profile
                </span>
              </div>
            </div>

            {/* Enhanced User Info and Actions Section */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
              {/* Enhanced User Profile Section */}
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 order-1 sm:order-1">
                {/* Enhanced Profile Image with Glow Effect */}
                <div className="relative group">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border-3 border-[var(--tavern-gold)] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <span className="text-[var(--tavern-dark)] text-xl sm:text-lg font-bold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-[var(--tavern-gold)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Enhanced Welcome Text and Name */}
                <div className="flex flex-col items-center space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                  <div className="body-font text-sm sm:text-base text-[var(--tavern-cream)] font-medium text-center sm:text-left" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
                    Welcome back,
                  </div>
                  <div className="body-font text-base sm:text-lg text-[var(--tavern-gold)] font-bold text-center sm:text-left" style={{ textShadow: '2px 2px 4px var(--tavern-copper)' }}>
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons with Better Styling */}
              <div className="flex flex-row items-center justify-center space-x-3 sm:flex-row sm:space-x-4 order-2 sm:order-2 mt-4 sm:mt-0">
                <ThemeToggle />
                <a
                  href="/"
                  className="beer-button px-5 py-2.5 rounded-lg transition-all duration-300 text-sm sm:text-base flex items-center space-x-2 hover:scale-105 hover:shadow-lg transform"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Home</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="beer-button px-5 py-2.5 rounded-lg transition-all duration-300 text-sm sm:text-base flex items-center space-x-2 hover:scale-105 hover:shadow-lg transform"
                >
                  <svg className="w-4 h-4 sm:hidden flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ margin: 0 }}>
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h11.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Leave the Tavern</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content with Better Spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Profile Header with Glassmorphism */}
        <div className="mb-8">
          <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Enhanced Profile Image with Animation */}
              <div className="flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--tavern-gold)] to-[var(--tavern-copper)] rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="relative w-28 h-28 rounded-full border-4 border-[var(--tavern-gold)] shadow-2xl group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="relative w-28 h-28 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all duration-300">
                    <span className="text-[var(--tavern-dark)] text-4xl font-bold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Enhanced Profile Info with Better Typography */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="heading-font text-4xl font-bold text-tavern-secondary mb-3" style={{ textShadow: '2px 2px 4px var(--tavern-dark)' }}>
                  {user.displayName || user.email?.split('@')[0]}
                </h2>
                <p className="body-font text-tavern-primary text-xl mb-3 opacity-90">
                  {user.email}
                </p>
                <div className="inline-flex items-center space-x-2 bg-[var(--tavern-copper)]/20 px-4 py-2 rounded-full">
                  <span className="text-sm">🍺</span>
                  <p className="body-font text-tavern-primary opacity-90 text-sm">
                    {(() => {
                      try {
                        if (!userData?.createdAt) return "Member since recently";
                        
                        // Convert Firebase timestamp to Date
                        let userCreatedAt: Date;
                        if (userData.createdAt && typeof userData.createdAt === 'object' && 'seconds' in userData.createdAt) {
                          // Firebase timestamp format
                          userCreatedAt = new Date(userData.createdAt.seconds * 1000);
                        } else if (typeof userData.createdAt === 'string') {
                          // String date format
                          userCreatedAt = new Date(userData.createdAt);
                        } else if (typeof userData.createdAt === 'number') {
                          // Unix timestamp
                          userCreatedAt = new Date(userData.createdAt);
                        } else {
                          // Fallback
                          return "Member since recently";
                        }
                        
                        // Check if date is valid
                        if (isNaN(userCreatedAt.getTime())) {
                          return "Member since recently";
                        }
                        
                        const july21st2025 = new Date('2025-07-21');
                        
                        if (userCreatedAt < july21st2025) {
                          return "Member since Prehistorical Era";
                        } else {
                          return `Member since ${userCreatedAt.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}`;
                        }
                      } catch (error) {
                        console.error('Error processing user creation date:', error);
                        return "Member since recently";
                      }
                    })()}
                  </p>
                </div>
              </div>

              {/* Enhanced Quick Actions with Better Styling */}
              <div className="flex flex-col space-y-3">
                <a
                  href="/"
                  className="beer-button px-6 py-3 rounded-xl text-sm flex items-center space-x-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="font-semibold">Add Beer</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Tab Navigation with Text Only */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`group relative px-6 py-3 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-[var(--tavern-copper)]'
                    : 'text-tavern-primary hover:text-tavern-secondary'
                }`}
              >
                {/* Label */}
                <span className="body-font font-bold text-xl tracking-wide">{tab.label}</span>
                
                {/* Animated Underline */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[var(--tavern-gold)] to-[var(--tavern-copper)] rounded-full transition-all duration-300 ${
                  activeTab === tab.id ? 'w-full' : 'group-hover:w-1/2'
                }`}></div>
                
                {/* Background glow effect for active tab */}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--tavern-gold)]/10 to-transparent rounded-xl -z-10"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Decorative separator line */}
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[var(--tavern-copper)] to-transparent"></div>
          </div>
        </div>

        {/* Enhanced Tab Content with Better Spacing and Animations */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Enhanced Statistics Section */}
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <BeerStats userId={user.uid} variant="profile" />
              </div>
              
              {/* Enhanced Quick Stats Cards with Real Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Next Achievement Goal */}
                <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🎯</div>
                    <div>
                      <p className="body-font text-sm text-tavern-primary opacity-80 mb-1">Next Goal</p>
                      {achievementsLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-[var(--tavern-copper)]/30 rounded mb-2"></div>
                          <div className="w-full bg-[var(--tavern-copper)]/30 rounded-full h-2"></div>
                        </div>
                      ) : (
                        <>
                          {(() => {
                            // Find the locked achievement with the highest progress percentage
                            const nextAchievement = achievements
                              .filter(a => !a.unlocked)
                              .sort((a, b) => {
                                const progressA = (a.criteria.current / a.criteria.target) * 100;
                                const progressB = (b.criteria.current / b.criteria.target) * 100;
                                return progressB - progressA; // Highest progress first
                              })[0];
                            return nextAchievement ? (
                              <>
                                <p className="heading-font text-lg font-bold text-[var(--tavern-gold)] truncate">
                                  {nextAchievement.title}
                                </p>
                                <div className="w-full bg-[var(--tavern-copper)]/30 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-[var(--tavern-gold)] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (nextAchievement.criteria.current / nextAchievement.criteria.target) * 100)}%` }}
                                  ></div>
                                </div>
                                <p className="body-font text-xs text-tavern-primary opacity-70 mt-1">
                                  {nextAchievement.description}
                                </p>
                                <p className="body-font text-xs text-tavern-primary opacity-70 mt-1">
                                  {nextAchievement.criteria.current}/{nextAchievement.criteria.target}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="heading-font text-lg font-bold text-[var(--tavern-gold)]">All Done!</p>
                                <p className="body-font text-xs text-tavern-primary opacity-70">Master of the tavern</p>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Achievement Progress */}
                <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🏆</div>
                    <div>
                      <p className="body-font text-sm text-tavern-primary opacity-80 mb-1">Achievements</p>
                      {achievementsLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-[var(--tavern-copper)]/30 rounded mb-2"></div>
                          <div className="w-full bg-[var(--tavern-copper)]/30 rounded-full h-2"></div>
                        </div>
                      ) : (
                        <>
                          <p className="heading-font text-xl font-bold text-[var(--tavern-gold)]">
                            {unlockedCount}/{totalCount}
                          </p>
                          <div className="w-full bg-[var(--tavern-copper)]/30 rounded-full h-2 mt-2">
                            <div 
                              className="bg-[var(--tavern-gold)] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <p className="body-font text-xs text-tavern-primary opacity-70 mt-1">
                            {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}% Complete
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Recent Achievements */}
                <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">⭐</div>
                    <div>
                      <p className="body-font text-sm text-tavern-primary opacity-80 mb-1">Recent Unlocks</p>
                      {achievementsLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 bg-[var(--tavern-copper)]/30 rounded mb-2"></div>
                          <div className="w-full bg-[var(--tavern-copper)]/30 rounded-full h-2"></div>
                        </div>
                      ) : (
                        <>
                          {(() => {
                            const recentUnlocked = achievements
                              .filter(a => a.unlocked)
                              .slice(0, 3);
                            
                            return recentUnlocked.length > 0 ? (
                              <>
                                <p className="heading-font text-lg font-bold text-[var(--tavern-gold)]">
                                  {recentUnlocked.length} Recent
                                </p>
                                <div className="space-y-1 mt-2">
                                  {recentUnlocked.map((achievement, index) => (
                                    <div key={achievement.id} className="flex items-center space-x-2">
                                      <span className="text-sm">{achievement.icon}</span>
                                      <p className="body-font text-xs text-tavern-primary opacity-80 truncate">
                                        {achievement.title}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="heading-font text-lg font-bold text-[var(--tavern-gold)]">No Unlocks Yet</p>
                                <p className="body-font text-xs text-tavern-primary opacity-70">Start logging beers!</p>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl animate-fadeIn">
              <BeerList userId={user.uid} />
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="animate-fadeIn">
              <AchievementList userId={user.uid} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl animate-fadeIn">
              <h3 className="text-2xl font-semibold mb-6 text-tavern-primary">
                Profile Settings
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-[var(--tavern-copper)]/10 rounded-xl hover:bg-[var(--tavern-copper)]/20 transition-all duration-300 group">
                  <div>
                    <p className="body-font font-semibold text-tavern-primary text-lg">Theme</p>
                    <p className="body-font text-sm text-tavern-primary opacity-80">Customize your tavern experience</p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center justify-between p-6 bg-[var(--tavern-copper)]/10 rounded-xl hover:bg-[var(--tavern-copper)]/20 transition-all duration-300 group">
                  <div>
                    <p className="body-font font-semibold text-tavern-primary text-lg">Notifications</p>
                    <p className="body-font text-sm text-tavern-primary opacity-80">Achievement and milestone alerts</p>
                  </div>
                  <button className="beer-button px-6 py-3 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-300">
                    Configure
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-[var(--tavern-copper)]/10 rounded-xl hover:bg-[var(--tavern-copper)]/20 transition-all duration-300 group">
                  <div>
                    <p className="body-font font-semibold text-tavern-primary text-lg">Data Export</p>
                    <p className="body-font text-sm text-tavern-primary opacity-80">Download your beer journey data</p>
                  </div>
                  <button className="beer-button px-6 py-3 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-300">
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
    </LeaderboardProvider>
  );
} 