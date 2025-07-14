'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface LeaderboardContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    console.log('Triggering leaderboard refresh...');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <LeaderboardContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboardContext must be used within a LeaderboardProvider');
  }
  return context;
} 