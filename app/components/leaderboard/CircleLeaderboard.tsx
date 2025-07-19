'use client';

import { useState } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAuth } from '../../hooks/useAuth';

export default function CircleLeaderboard() {
  const { leaderboard, loading, error, timeFilter, refreshLeaderboard, changeTimeFilter } = useLeaderboard();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  
  const usersPerPage = 7;
  const totalPages = Math.ceil(leaderboard.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = leaderboard.slice(startIndex, endIndex);

  const getCircleSize = (beerCount: number, maxBeers: number) => {
    if (maxBeers === 0) return 60; // Default size if no beers
    const maxSize = 120; // Maximum circle size
    const minSize = 60; // Minimum circle size
    const ratio = beerCount / maxBeers;
    return Math.max(minSize, Math.min(maxSize, minSize + (maxSize - minSize) * ratio));
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getStatusColor = (beerCount: number) => {
    if (beerCount === 0) return 'border-gray-400';
    if (beerCount >= 10) return 'border-green-400';
    if (beerCount >= 5) return 'border-blue-400';
    return 'border-yellow-400';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="tavern-glass rounded-xl p-4 md:p-6 border border-[var(--tavern-copper)] shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-3 text-[var(--tavern-cream)]">Loading circle leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tavern-glass rounded-xl p-4 md:p-6 border border-[var(--tavern-copper)] shadow-lg">
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={refreshLeaderboard}
            className="beer-button px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const maxBeers = Math.max(...currentUsers.map(entry => entry.beersThisMonth), 1);
  const topUsers = currentUsers.slice(0, 7); // Show top 7 users from current page

  return (
    <div className="tavern-glass rounded-xl p-4 md:p-6 border border-[var(--tavern-copper)] shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="text-2xl md:text-3xl">🎯</div>
          <div>
            <h2 className="heading-font text-xl md:text-2xl font-bold text-[var(--tavern-gold)]" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
              Circle Leaderboard
            </h2>
            <p className="body-font text-xs md:text-sm text-[var(--tavern-cream)] opacity-80">
              Bigger circles = more beers in selected period
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Time Filter Buttons */}
          <div className="flex bg-[var(--tavern-dark)] bg-opacity-30 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => changeTimeFilter('today')}
              className={`flex-1 sm:flex-none px-3 py-2 md:py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeFilter === 'today'
                  ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] shadow-sm'
                  : 'text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => changeTimeFilter('week')}
              className={`flex-1 sm:flex-none px-3 py-2 md:py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeFilter === 'week'
                  ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] shadow-sm'
                  : 'text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => changeTimeFilter('month')}
              className={`flex-1 sm:flex-none px-3 py-2 md:py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeFilter === 'month'
                  ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] shadow-sm'
                  : 'text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)]'
              }`}
            >
              Month
            </button>
          </div>
          <button
            onClick={refreshLeaderboard}
            className="beer-button px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 shadow-sm w-full sm:w-auto"
            title="Refresh leaderboard"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Circle Leaderboard */}
      <div className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center">
        {topUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🍺</div>
            <p className="body-font text-[var(--tavern-cream)] text-sm md:text-base">No patrons have joined the tavern yet</p>
            <p className="body-font text-xs md:text-sm text-[var(--tavern-cream)] opacity-70 mt-1">Be the first to add a beer!</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Center circle for #1 */}
            {topUsers[0] && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative group">
                  <div
                    className={`rounded-full border-4 ${getStatusColor(topUsers[0].beersThisMonth)} transition-all duration-300 hover:scale-110 shadow-2xl`}
                    style={{
                      width: `${getCircleSize(topUsers[0].beersThisMonth, maxBeers)}px`,
                      height: `${getCircleSize(topUsers[0].beersThisMonth, maxBeers)}px`,
                    }}
                  >
                    {topUsers[0].user.photoURL ? (
                      <img
                        src={topUsers[0].user.photoURL}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center">
                        <span className="text-[var(--tavern-dark)] text-sm md:text-lg font-bold">
                          {topUsers[0].user.displayName ? topUsers[0].user.displayName.charAt(0).toUpperCase() : topUsers[0].user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Rank badge */}
                  <div className="absolute -top-2 -right-2 bg-[var(--tavern-gold)] text-[var(--tavern-dark)] rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                    {getRankIcon(topUsers[0].rank)}
                  </div>
                  {/* User info tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-[var(--tavern-dark)] text-[var(--tavern-cream)] px-3 py-2 rounded-lg text-xs md:text-sm font-medium shadow-lg whitespace-nowrap">
                      <div className="font-bold">{topUsers[0].user.displayName || topUsers[0].user.email?.split('@')[0] || 'Anonymous'}</div>
                      <div className="text-[var(--tavern-gold)]">{topUsers[0].beersThisMonth} beers</div>
                      {user?.uid === topUsers[0].user.uid && <div className="text-xs text-[var(--tavern-gold)]">(You)</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Surrounding circles */}
            {topUsers.slice(1).map((entry, index) => {
              const angle = (index * 360) / (topUsers.length - 1);
              const radius = window.innerWidth < 768 ? 100 : 150; // Smaller radius on mobile
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

              return (
                <div
                  key={entry.user.uid}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div className="relative">
                    <div
                      className={`rounded-full border-3 ${getStatusColor(entry.beersThisMonth)} transition-all duration-300 hover:scale-110 shadow-lg ${
                        user?.uid === entry.user.uid ? 'ring-2 ring-[var(--tavern-gold)] ring-opacity-50' : ''
                      }`}
                      style={{
                        width: `${getCircleSize(entry.beersThisMonth, maxBeers)}px`,
                        height: `${getCircleSize(entry.beersThisMonth, maxBeers)}px`,
                      }}
                    >
                      {entry.user.photoURL ? (
                        <img
                          src={entry.user.photoURL}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center">
                          <span className="text-[var(--tavern-dark)] text-xs md:text-sm font-bold">
                            {entry.user.displayName ? entry.user.displayName.charAt(0).toUpperCase() : entry.user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Rank badge */}
                    <div className="absolute -top-1 -right-1 bg-[var(--tavern-gold)] text-[var(--tavern-dark)] rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold shadow-md">
                      {getRankIcon(entry.rank)}
                    </div>
                    {/* User info tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="bg-[var(--tavern-dark)] text-[var(--tavern-cream)] px-3 py-2 rounded-lg text-xs md:text-sm font-medium shadow-lg whitespace-nowrap">
                        <div className="font-bold">{entry.user.displayName || entry.user.email?.split('@')[0] || 'Anonymous'}</div>
                        <div className="text-[var(--tavern-gold)]">{entry.beersThisMonth} beers</div>
                        {user?.uid === entry.user.uid && <div className="text-xs text-[var(--tavern-gold)]">(You)</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-[var(--tavern-copper)] border-opacity-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-tavern-primary opacity-70">
              Showing {startIndex + 1}-{Math.min(endIndex, leaderboard.length)} of {leaderboard.length} patrons
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-[var(--tavern-dark)] text-[var(--tavern-cream)] rounded-md hover:bg-[var(--tavern-copper)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] font-bold'
                        : 'bg-[var(--tavern-dark)] text-[var(--tavern-cream)] hover:bg-[var(--tavern-copper)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs bg-[var(--tavern-dark)] text-[var(--tavern-cream)] rounded-md hover:bg-[var(--tavern-copper)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[var(--tavern-copper)] border-opacity-50">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs text-[var(--tavern-cream)]">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-green-400"></div>
            <span className="text-xs">Legend (10+)</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-blue-400"></div>
            <span className="text-xs">Regular (5-9)</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-yellow-400"></div>
            <span className="text-xs">Novice (1-4)</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full border-2 border-gray-400"></div>
            <span className="text-xs">New (0)</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-[var(--tavern-copper)] border-opacity-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-[var(--tavern-cream)] opacity-70 space-y-1 sm:space-y-0">
          <span className="body-font text-center sm:text-left">
            Top {currentUsers.length} Patrons (Page {currentPage})
          </span>
          <span className="body-font text-center sm:text-right">
            Max: {maxBeers} beers | Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
} 