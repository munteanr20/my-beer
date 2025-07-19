'use client';

import { useState } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAuth } from '../../hooks/useAuth';

export default function Leaderboard() {
  const { leaderboard, loading, error, timeFilter, refreshLeaderboard, changeTimeFilter } = useLeaderboard();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  
  const usersPerPage = 7;
  const totalPages = Math.ceil(leaderboard.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = leaderboard.slice(startIndex, endIndex);

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

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-[var(--tavern-gold)] font-bold'; // 🥇 Gold pentru locul 1
      case 2:
        return 'text-[var(--tavern-copper)] font-bold'; // 🥈 Copper pentru locul 2
      case 3:
        return 'text-amber-600 font-bold'; // 🥉 Amber pentru locul 3
      default:
        return 'text-tavern-primary font-normal'; // Culoarea default pentru restul
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="tavern-glass rounded-xl p-4 md:p-6 border border-[var(--tavern-copper)] shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-3 text-[var(--tavern-cream)]">Loading leaderboard...</span>
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

  return (
    <div className="tavern-glass rounded-xl p-4 md:p-6 border border-[var(--tavern-copper)] shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="text-2xl md:text-3xl">🏆</div>
          <div>
            <h2 className="heading-font text-xl md:text-2xl font-bold text-[var(--tavern-gold)]" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
              Tavern Leaderboard
            </h2>
            <p className="body-font text-xs md:text-sm text-[var(--tavern-cream)] opacity-80">
              Beers consumed in selected period
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

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] md:min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 md:gap-4 px-2 md:px-4 py-3 bg-gradient-to-r from-[var(--tavern-dark)] to-[var(--tavern-copper)] bg-opacity-60 rounded-t-lg border-b border-[var(--tavern-copper)] backdrop-blur-sm shadow-sm">
            <div className="col-span-1 text-center">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-xs md:text-sm drop-shadow-sm">Rank</span>
            </div>
            <div className="col-span-8">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-xs md:text-sm drop-shadow-sm">Tavern Patron</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-xs md:text-sm drop-shadow-sm">Beers</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-xs md:text-sm drop-shadow-sm">Status</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {currentUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🍺</div>
                <p className="body-font text-[var(--tavern-cream)] text-sm md:text-base">No patrons have joined the tavern yet</p>
                <p className="body-font text-xs md:text-sm text-[var(--tavern-cream)] opacity-70 mt-1">Be the first to add a beer!</p>
              </div>
            ) : (
              currentUsers.map((entry, index) => (
                <div
                  key={entry.user.uid}
                  className={`grid grid-cols-12 gap-2 md:gap-4 px-2 md:px-4 py-3 border-b border-[var(--tavern-copper)] border-opacity-30 transition-all duration-300 hover:shadow-xl`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className={`text-sm md:text-lg font-bold ${getRankClass(entry.rank)} drop-shadow-sm`}>
                      {getRankIcon(entry.rank)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="col-span-8 flex items-center space-x-2 md:space-x-3">
                    {/* Profile Image */}
                    {entry.user.photoURL ? (
                      <img
                        src={entry.user.photoURL}
                        alt="Profile"
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[var(--tavern-copper)] border-opacity-50 shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-[var(--tavern-dark)] text-xs md:text-sm font-bold">
                          {entry.user.displayName ? entry.user.displayName.charAt(0).toUpperCase() : entry.user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* User Name */}
                    <div className="flex-1 min-w-0">
                      <div className="body-font font-medium text-tavern-primary text-xs md:text-sm truncate">
                        {entry.user.displayName || entry.user.email?.split('@')[0] || 'Anonymous Patron'}
                      </div>
                      {user?.uid === entry.user.uid && (
                        <div className="text-xs text-tavern-primary font-medium">(You)</div>
                      )}
                    </div>
                  </div>

                  {/* Beer Count */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="body-font font-bold text-[var(--tavern-gold)] text-sm md:text-lg">
                      {entry.beersThisMonth}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center justify-center">
                    {entry.beersThisMonth === 0 ? (
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-400" title="New Patron"></div>
                    ) : entry.beersThisMonth >= 10 ? (
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400" title="🍺 Legend (10+ beers)"></div>
                    ) : entry.beersThisMonth >= 5 ? (
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400" title="🍺 Regular (5-9 beers)"></div>
                    ) : (
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400" title="🍺 Novice (1-4 beers)"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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

      {/* Status Legend */}
      <div className="mt-4 pt-4 border-t border-[var(--tavern-copper)] border-opacity-50">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs text-tavern-primary mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400"></div>
            <span>Legend (10+ beers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400"></div>
            <span>Regular (5-9 beers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
            <span>Novice (1-4 beers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-400"></div>
            <span>New Patron (0 beers)</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-[var(--tavern-copper)] border-opacity-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-tavern-primary opacity-70 space-y-1 sm:space-y-0">
          <span className="body-font text-center sm:text-left">
            Total Patrons: {leaderboard.length}
          </span>
          <span className="body-font text-center sm:text-right">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
} 