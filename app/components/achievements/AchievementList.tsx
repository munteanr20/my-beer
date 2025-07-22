'use client';

import React, { useState } from 'react';
import { useAchievements } from '../../hooks/useAchievements';
import AchievementCard from './AchievementCard';

interface AchievementListProps {
  userId: string;
  showHeader?: boolean;
}

type FilterType = 'all' | 'unlocked' | 'locked';
type SortType = 'progress' | 'name' | 'type';

export default function AchievementList({ userId, showHeader = true }: AchievementListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('progress');
  const [currentPage, setCurrentPage] = useState(1);
  const achievementsPerPage = 4;
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const {
    achievements,
    loading,
    unlockedCount,
    totalCount,
  } = useAchievements(userId);

  // Filter achievements based on selected filter
  const filteredAchievements = achievements.filter(achievement => {
    switch (filter) {
      case 'unlocked':
        return achievement.unlocked;
      case 'locked':
        return !achievement.unlocked;
      default:
        return true;
    }
  });

  // Sort achievements based on selected sort
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        const progressA = (a.criteria.current / a.criteria.target) * 100;
        const progressB = (b.criteria.current / b.criteria.target) * 100;
        return progressB - progressA; // Highest progress first
      case 'name':
        return a.title.localeCompare(b.title);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  // Reset to first page when filter or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedAchievements.length / achievementsPerPage);
  const startIndex = (currentPage - 1) * achievementsPerPage;
  const endIndex = startIndex + achievementsPerPage;
  const currentAchievements = sortedAchievements.slice(startIndex, endIndex);

  // Touch/swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  if (loading) {
    return (
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] border-2">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-2 body-font text-tavern-primary">Loading achievements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] border-2">
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-tavern-primary">
              Tavern Achievements
            </h3>
            <p className="body-font font-bold text-tavern-primary text-md">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 sm:mt-0">
            <div className="w-32 bg-[var(--tavern-copper)] rounded-full h-3">
              <div 
                className="bg-[var(--tavern-gold)] h-3 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <label className="body-font text-sm text-tavern-primary">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="beer-input px-3 py-1 rounded text-sm"
          >
            <option value="all">All</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <label className="body-font text-sm text-tavern-primary">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="beer-input px-3 py-1 rounded text-sm"
          >
            <option value="progress">Progress</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      {sortedAchievements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <p className="body-font text-tavern-primary">
            {filter === 'all' 
              ? 'No achievements found. Start logging beers to unlock achievements!'
              : filter === 'unlocked'
              ? 'No unlocked achievements yet. Keep going!'
              : 'No locked achievements. You\'ve unlocked everything!'
            }
          </p>
        </div>
      ) : (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="touch-pan-y"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onClick={() => {
                  // Could add modal or detailed view here
                  console.log('Achievement clicked:', achievement.title);
                }}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="beer-button px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === page
                        ? 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)]'
                        : 'beer-button'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="beer-button px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
          
          {/* Page Info */}
          {totalPages > 1 && (
            <div className="mt-2 text-center">
              <p className="body-font text-sm text-tavern-primary">
                Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, sortedAchievements.length)} of {sortedAchievements.length} achievements
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 