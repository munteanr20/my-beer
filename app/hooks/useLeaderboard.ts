import { useState, useEffect } from 'react';
import { leaderboardService, LeaderboardEntry, TimeFilter, UserBeerData } from '../services/leaderboardService';
import { useLeaderboardContext } from '../contexts/LeaderboardContext';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allBeerData, setAllBeerData] = useState<UserBeerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const { refreshTrigger } = useLeaderboardContext();

  const fetchAllBeerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaderboardService.getAllBeersData();
      setAllBeerData(data);
      
      // Apply initial filter
      const filteredData = leaderboardService.filterBeersByTime(data, timeFilter);
      setLeaderboard(filteredData);
    } catch (err) {
      console.error('Error fetching beer data:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBeerData();
  }, []);

  // Listen for refresh triggers from context
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchAllBeerData();
    }
  }, [refreshTrigger]);

  const refreshLeaderboard = () => {
    fetchAllBeerData();
  };

  const changeTimeFilter = (filter: TimeFilter) => {
    setTimeFilter(filter);
    const filteredData = leaderboardService.filterBeersByTime(allBeerData, filter);
    setLeaderboard(filteredData);
  };

  return {
    leaderboard,
    loading,
    error,
    timeFilter,
    refreshLeaderboard,
    changeTimeFilter
  };
} 