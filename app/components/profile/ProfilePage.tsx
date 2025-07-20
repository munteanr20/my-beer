'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAchievements } from '../../hooks/useAchievements';
import { useBeers } from '../../hooks/useBeers';
import { useBeerStyles } from '../../hooks/useBeerStyles';
import { userService } from '../../services/userService';
import { User } from '../../types';
import BeerStats from '../beer/BeerStats';
import BeerList from '../beer/BeerList';
import AchievementList from '../achievements/AchievementList';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { LeaderboardProvider } from '../../contexts/LeaderboardContext';

type ProfileTab = 'overview' | 'collection' | 'achievements' | 'settings';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [userData, setUserData] = useState<User | null>(null);
  
  // Get real achievement data
  const { achievements, loading: achievementsLoading, unlockedCount, totalCount } = useAchievements(user?.uid || '');
  
  // Get beer data for enhanced insights
  const { beers, totalBeers, loading: beersLoading } = useBeers(user?.uid || '');
  const { beerStyles, loading: stylesLoading } = useBeerStyles();

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

  // Calculate total alcohol more accurately
  const totalAlcohol = beers.reduce((total, beer) => {
    if (beer.alcohol && beer.quantity) {
      // Clean and parse alcohol percentage
      const cleanAlcohol = beer.alcohol.replace(/[^\d.]/g, '');
      const alcohol = parseFloat(cleanAlcohol);
      
      // Clean and parse quantity in ml
      const cleanQuantity = beer.quantity.replace(/[^\d.]/g, '');
      const quantity = parseFloat(cleanQuantity);
      
      // Calculate pure alcohol in liters: (alcohol_percentage / 100) * quantity_ml / 1000
      // Example: 5% alcohol in 330ml = (5/100) * 330 / 1000 = 0.0165 liters pure alcohol
      if (!isNaN(alcohol) && !isNaN(quantity) && alcohol > 0 && quantity > 0) {
        return total + (alcohol / 100) * (quantity / 1000);
      }
    }
    return total;
  }, 0);


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
      {/* Reusable Navbar Component */}
      <Navbar currentPage="Profile"/>

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
              
              {/* Personal Beer Journey Insights */}
              <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl">
                <h3 className="heading-font text-2xl font-bold text-[var(--tavern-gold)] mb-6 flex items-center space-x-3">
                  <span className="text-3xl">🍺</span>
                  <span>Your Beer Journey</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Beers */}
                  <div className="text-center p-4 rounded-xl bg-[var(--tavern-copper)]/10 hover:bg-[var(--tavern-copper)]/20 transition-all duration-300">
                    <div className="text-3xl mb-2">🍺</div>
                    <div className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">
                      {beersLoading ? '...' : totalBeers}
                    </div>
                    <div className="body-font text-sm text-tavern-primary opacity-80">Total Beers</div>
                  </div>
                  
                  {/* Unique Types */}
                  <div className="text-center p-4 rounded-xl bg-[var(--tavern-copper)]/10 hover:bg-[var(--tavern-copper)]/20 transition-all duration-300">
                    <div className="text-3xl mb-2">🎨</div>
                    <div className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">
                      {beersLoading ? '...' : new Set(beers.map(b => b.type)).size}
                    </div>
                    <div className="body-font text-sm text-tavern-primary opacity-80">Unique Types</div>
                  </div>
                  
                  {/* Total Alcohol */}
                  <div className="text-center p-4 rounded-xl bg-[var(--tavern-copper)]/10 hover:bg-[var(--tavern-copper)]/20 transition-all duration-300">
                    <div className="text-3xl mb-2">🍺</div>
                    <div className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">
                      {totalAlcohol.toFixed(2)} L
                    </div>
                    <div className="body-font text-sm text-tavern-primary opacity-80">Total Alcohol</div>
                  </div>
                  {/* Days Active */}
                  <div className="text-center p-4 rounded-xl bg-[var(--tavern-copper)]/10 hover:bg-[var(--tavern-copper)]/20 transition-all duration-300">
                    <div className="text-3xl mb-2">📅</div>
                    <div className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">
                      {beersLoading ? '...' : beers.length > 0 
                        ? new Set(beers.map(b => new Date(b.createdAt).toDateString())).size
                        : '0'
                      }
                    </div>
                    <div className="body-font text-sm text-tavern-primary opacity-80">Days Active</div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Beers */}
                <div className="tavern-glass rounded-2xl p-6 border border-[var(--tavern-copper)] shadow-2xl">
                  <h4 className="heading-font text-xl font-bold text-[var(--tavern-gold)] mb-4 flex items-center space-x-2">
                    <span className="text-2xl">📝</span>
                    <span>Recent Activity</span>
                  </h4>
                  
                  {beersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-[var(--tavern-copper)]/30 rounded mb-2"></div>
                          <div className="h-3 bg-[var(--tavern-copper)]/20 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : beers.length > 0 ? (
                    <div className="space-y-3">
                      {beers.slice(0, 5).map((beer, index) => (
                        <div key={beer.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--tavern-copper)]/10 hover:bg-[var(--tavern-copper)]/20 transition-all duration-300">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">🍺</div>
                            <div>
                              <p className="body-font font-semibold text-tavern-primary">{beer.name}</p>
                              <p className="body-font text-sm text-tavern-primary opacity-70">{beer.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="body-font text-sm text-tavern-primary opacity-70">
                              {new Date(beer.createdAt).toLocaleDateString()}
                            </p>
                            {beer.alcohol && (
                              <p className="body-font text-xs text-tavern-primary opacity-60">{beer.alcohol}%</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🍺</div>
                      <p className="body-font text-tavern-primary opacity-70">No beers logged yet</p>
                      <a href="/" className="beer-button mt-4 px-6 py-2 rounded-lg text-sm inline-block">
                        Add Your First Beer
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Favorite Types */}
                <div className="tavern-glass rounded-2xl p-6 border border-[var(--tavern-copper)] shadow-2xl">
                  <h4 className="heading-font text-xl font-bold text-[var(--tavern-gold)] mb-4 flex items-center space-x-2">
                    <span className="text-2xl">❤️</span>
                    <span>Favorite Types</span>
                  </h4>
                  
                  {beersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-[var(--tavern-copper)]/30 rounded mb-2"></div>
                          <div className="h-3 bg-[var(--tavern-copper)]/20 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : beers.length > 0 ? (
                    <div className="space-y-3">
                      {(() => {
                        const typeCounts = beers.reduce((acc, beer) => {
                          acc[beer.type] = (acc[beer.type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);
                        
                        const sortedTypes = Object.entries(typeCounts)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5);
                        
                        return sortedTypes.map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-[var(--tavern-copper)]/10 hover:bg-[var(--tavern-copper)]/20 transition-all duration-300">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">🍺</div>
                              <div>
                                <p className="body-font font-semibold text-tavern-primary">{type}</p>
                                <p className="body-font text-sm text-tavern-primary opacity-70">{count} beers</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="w-16 bg-[var(--tavern-copper)]/30 rounded-full h-2">
                                <div 
                                  className="bg-[var(--tavern-gold)] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(count / beers.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">❤️</div>
                      <p className="body-font text-tavern-primary opacity-70">No favorites yet</p>
                      <p className="body-font text-sm text-tavern-primary opacity-50">Start logging beers to see your preferences</p>
                    </div>
                  )}
                </div>
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
            <div className="animate-fadeIn">
              {/* Collection Header with Stats */}
              <div className="tavern-glass rounded-2xl p-6 border border-[var(--tavern-copper)] shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h3 className="heading-font text-2xl font-bold text-[var(--tavern-gold)] mb-2 flex items-center space-x-3">
                      <span className="text-3xl">📚</span>
                      <span>Your Beer Collection</span>
                    </h3>
                    <p className="body-font text-tavern-primary opacity-80">
                      {beersLoading ? 'Loading your collection...' : `${totalBeers} beers logged`}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <a
                      href="/"
                      className="beer-button px-6 py-3 rounded-xl text-sm flex items-center space-x-3 hover:scale-105 transition-all duration-300"
                    >
                      <span className="text-lg">🍺</span>
                      <span>Add New Beer</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Beer List */}
              <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl">
                <BeerList userId={user.uid} showHeader={false} />
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="animate-fadeIn">
              {/* Achievements Header with Progress */}
              <div className="tavern-glass rounded-2xl p-6 border border-[var(--tavern-copper)] shadow-2xl mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h3 className="heading-font text-2xl font-bold text-[var(--tavern-gold)] mb-2 flex items-center space-x-3">
                      <span className="text-3xl">🏆</span>
                      <span>Your Achievements</span>
                    </h3>
                    <p className="body-font text-tavern-primary opacity-80">
                      {achievementsLoading ? 'Loading achievements...' : `${unlockedCount} of ${totalCount} unlocked`}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="heading-font text-3xl font-bold text-[var(--tavern-gold)]">
                          {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%
                        </div>
                        <div className="body-font text-sm text-tavern-primary opacity-70">Completion</div>
                      </div>
                      <div className="w-32 bg-[var(--tavern-copper)]/30 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-[var(--tavern-gold)] to-[var(--tavern-copper)] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Achievement List */}
              <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl">
                <AchievementList userId={user.uid} showHeader={false} />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fadeIn">
              {/* Settings Header */}
              <div className="tavern-glass rounded-2xl p-6 border border-[var(--tavern-copper)] shadow-2xl mb-8">
                <h3 className="heading-font text-2xl font-bold text-[var(--tavern-gold)] mb-2 flex items-center space-x-3">
                  <span className="text-3xl">⚙️</span>
                  <span>Profile Settings</span>
                </h3>
                <p className="body-font text-tavern-primary opacity-80">
                  Manage your account and preferences
                </p>
              </div>
              
              {/* Settings Content */}
              <div className="tavern-glass rounded-2xl p-8 border border-[var(--tavern-copper)] shadow-2xl">
                <div className="space-y-6">
                  {/* Account Info */}
                  <div className="p-6 bg-[var(--tavern-copper)]/10 rounded-xl">
                    <h4 className="body-font font-semibold text-tavern-primary text-lg mb-4 flex items-center space-x-2">
                      <span className="text-xl">👤</span>
                      <span>Account Information</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="body-font text-tavern-primary opacity-80">Email</span>
                        <span className="body-font text-tavern-primary font-medium">{user.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="body-font text-tavern-primary opacity-80">Display Name</span>
                        <span className="body-font text-tavern-primary font-medium">
                          {user.displayName || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="body-font text-tavern-primary opacity-80">Member Since</span>
                        <span className="body-font text-tavern-primary font-medium">
                          {userData?.createdAt ? (
                            (() => {
                              try {
                                let userCreatedAt: Date;
                                if (userData.createdAt && typeof userData.createdAt === 'object' && 'seconds' in userData.createdAt) {
                                  userCreatedAt = new Date(userData.createdAt.seconds * 1000);
                                } else if (typeof userData.createdAt === 'string') {
                                  userCreatedAt = new Date(userData.createdAt);
                                } else if (typeof userData.createdAt === 'number') {
                                  userCreatedAt = new Date(userData.createdAt);
                                } else {
                                  return 'Recently';
                                }
                                
                                if (isNaN(userCreatedAt.getTime())) {
                                  return 'Recently';
                                }
                                
                                const july21st2025 = new Date('2025-07-21');
                                
                                if (userCreatedAt < july21st2025) {
                                  return 'Prehistorical Era';
                                } else {
                                  return userCreatedAt.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  });
                                }
                              } catch (error) {
                                return 'Recently';
                              }
                            })()
                          ) : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preferences */}
                  <div className="p-6 bg-[var(--tavern-copper)]/10 rounded-xl">
                    <h4 className="body-font font-semibold text-tavern-primary text-lg mb-4 flex items-center space-x-2">
                      <span className="text-xl">🎨</span>
                      <span>Preferences</span>
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="body-font font-semibold text-tavern-primary">Theme</p>
                          <p className="body-font text-sm text-tavern-primary opacity-80">Customize your tavern experience</p>
                        </div>
                        <div className="text-[var(--tavern-cream)] opacity-60">
                          <span className="text-sm">Available in navbar</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="body-font font-semibold text-tavern-primary">Notifications</p>
                          <p className="body-font text-sm text-tavern-primary opacity-80">Achievement and milestone alerts</p>
                        </div>
                        <button className="beer-button px-6 py-3 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-300">
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Data Management */}
                  <div className="p-6 bg-[var(--tavern-copper)]/10 rounded-xl">
                    <h4 className="body-font font-semibold text-tavern-primary text-lg mb-4 flex items-center space-x-2">
                      <span className="text-xl">📊</span>
                      <span>Data Management</span>
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="body-font font-semibold text-tavern-primary">Data Export</p>
                          <p className="body-font text-sm text-tavern-primary opacity-80">Download your beer journey data</p>
                        </div>
                        <button className="beer-button px-6 py-3 rounded-lg text-sm font-semibold hover:scale-105 transition-all duration-300">
                          Export
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="body-font font-semibold text-tavern-primary">Account Statistics</p>
                          <p className="body-font text-sm text-tavern-primary opacity-80">
                            {totalBeers} beers logged • {unlockedCount} achievements unlocked
                          </p>
                        </div>
                        <div className="text-[var(--tavern-gold)] font-semibold">
                          Active User
                        </div>
                      </div>
                    </div>
                  </div>
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