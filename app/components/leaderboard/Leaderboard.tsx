'use client';

import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAuth } from '../../hooks/useAuth';

export default function Leaderboard() {
  const { leaderboard, loading, error, timeFilter, refreshLeaderboard, changeTimeFilter } = useLeaderboard();
  const { user } = useAuth();

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
        return 'text-yellow-500 font-bold';
      case 2:
        return 'text-gray-400 font-bold';
      case 3:
        return 'text-amber-600 font-bold';
      default:
        return 'text-tavern-cream';
    }
  };

  if (loading) {
    return (
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-3 text-[var(--tavern-cream)]">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] shadow-lg">
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
    <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🏆</div>
          <div>
            <h2 className="heading-font text-2xl font-bold text-[var(--tavern-gold)]" style={{ textShadow: '1px 1px 2px var(--tavern-copper)' }}>
              Tavern Leaderboard
            </h2>
            <p className="body-font text-sm text-[var(--tavern-cream)] opacity-80">
              Beers consumed in selected period
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* Time Filter Buttons */}
          <div className="flex bg-[var(--tavern-dark)] bg-opacity-30 rounded-lg p-1">
            <button
              onClick={() => changeTimeFilter('today')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeFilter === 'today'
                  ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] shadow-sm'
                  : 'text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => changeTimeFilter('week')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                timeFilter === 'week'
                  ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] shadow-sm'
                  : 'text-[var(--tavern-cream)] hover:text-[var(--tavern-gold)]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => changeTimeFilter('month')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
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
            className="beer-button px-3 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200 shadow-sm"
            title="Refresh leaderboard"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gradient-to-r from-[var(--tavern-dark)] to-[var(--tavern-copper)] bg-opacity-60 rounded-t-lg border-b border-[var(--tavern-copper)] backdrop-blur-sm shadow-sm">
            <div className="col-span-1 text-center">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-sm drop-shadow-sm">Rank</span>
            </div>
            <div className="col-span-7">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-sm drop-shadow-sm">Tavern Patron</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-sm drop-shadow-sm">Beers</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="body-font font-bold text-[var(--tavern-gold)] text-sm drop-shadow-sm">Status</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🍺</div>
                <p className="body-font text-[var(--tavern-cream)]">No patrons have joined the tavern yet</p>
                <p className="body-font text-sm text-[var(--tavern-cream)] opacity-70 mt-1">Be the first to add a beer!</p>
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                                  <div
                    key={entry.user.uid}
                    className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-[var(--tavern-copper)] border-opacity-30 transition-all duration-300 hover:shadow-xl`}
                  >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getRankClass(entry.rank)} drop-shadow-sm`}>
                      {getRankIcon(entry.rank)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="col-span-7 flex items-center space-x-3">
                    {/* Profile Image */}
                    {entry.user.photoURL ? (
                      <img
                        src={entry.user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-[var(--tavern-copper)] border-opacity-50 shadow-sm "
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-[var(--tavern-copper)] to-[var(--tavern-gold)] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-[var(--tavern-dark)] text-sm font-bold">
                          {entry.user.displayName ? entry.user.displayName.charAt(0).toUpperCase() : entry.user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* User Name */}
                    <div className="flex-1 min-w-0">
                      <div className="body-font font-medium text-tavern-primary truncate">
                        {entry.user.displayName || entry.user.email?.split('@')[0] || 'Anonymous Patron'}
                      </div>
                      {user?.uid === entry.user.uid && (
                        <div className="text-xs text-tavern-primary font-medium">(You)</div>
                      )}
                    </div>
                  </div>

                  {/* Beer Count */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="body-font font-bold text-[var(--tavern-gold)] text-lg">
                      {entry.beersThisMonth}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center justify-center">
                    {entry.beersThisMonth === 0 ? (
                      <span className="text-xs text-[var(--tavern-dark)] font-medium px-2 py-1 rounded-full bg-gray-100 bg-opacity-20">New Patron</span>
                    ) : entry.beersThisMonth >= 10 ? (
                      <span className="text-xs text-[var(--tavern-dark)] font-bold px-2 py-1 rounded-full bg-green-100 bg-opacity-20 drop-shadow-sm">🍺 Legend</span>
                    ) : entry.beersThisMonth >= 5 ? (
                      <span className="text-xs text-[var(--tavern-dark)] font-bold px-2 py-1 rounded-full bg-blue-100 bg-opacity-20 drop-shadow-sm">🍺 Regular</span>
                    ) : (
                      <span className="text-xs text-[var(--tavern-dark)] font-bold px-2 py-1 rounded-full bg-yellow-100 bg-opacity-20 drop-shadow-sm">🍺 Novice</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-[var(--tavern-copper)] border-opacity-50">
        <div className="flex justify-between items-center text-xs text-tavern-primary opacity-70">
          <span className="body-font">
            Total Patrons: {leaderboard.length}
          </span>
          <span className="body-font">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
} 