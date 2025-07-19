import { useState, useEffect } from 'react';
import { Achievement, BeerStats } from '../types';
import { achievementService } from '../services/achievementService';
import { beerService } from '../services/beerService';

export const useAchievements = (userId: string) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockedCount, setUnlockedCount] = useState(0);

  // Funcție pentru calculul progresului real
  const calculateAchievementProgress = (achievementDef: any, userStats: BeerStats, isUnlocked: boolean): number => {
    if (isUnlocked) return achievementDef.criteria.target; // 100% dacă e deblocat
    
    switch (achievementDef.type) {
      case 'milestone':
      case 'beer_count':
        return Math.min(userStats.totalBeers, achievementDef.criteria.target);
        
      case 'variety':
        const uniqueTypes = userStats.uniqueTypes || 0;
        return Math.min(uniqueTypes, achievementDef.criteria.target);
        
      case 'alcohol':
        switch (achievementDef.criteria.unit) {
          case 'high_alcohol':
            return Math.min(userStats.highAlcoholBeers || 0, achievementDef.criteria.target);
          case 'pure_alcohol_liters':
            return Math.min(userStats.totalPureAlcohol || 0, achievementDef.criteria.target);
          case 'low_alcohol':
            return Math.min(userStats.lowAlcoholBeers || 0, achievementDef.criteria.target);
          default:
            return 0;
        }
        
      case 'quantity':
        switch (achievementDef.criteria.unit) {
          case 'large_beers':
            return Math.min(userStats.largeBeers || 0, achievementDef.criteria.target);
          case 'total_liters':
            return Math.min(userStats.totalLiters, achievementDef.criteria.target);
          case 'pint_sized':
            return Math.min(userStats.pintSizedBeers || 0, achievementDef.criteria.target);
          default:
            return 0;
        }
        
      case 'streak':
        switch (achievementDef.criteria.unit) {
          case 'days':
            return Math.min(userStats.currentStreak || 0, achievementDef.criteria.target);
          case 'weeks':
            return Math.min(userStats.weeklyStreak || 0, achievementDef.criteria.target);
          case 'weekends':
            return Math.min(userStats.weekendStreak || 0, achievementDef.criteria.target);
          default:
            return 0;
        }
        
      case 'special':
        // Pentru achievement-uri speciale, progresul e 0 sau 100%
        return isUnlocked ? achievementDef.criteria.target : 0;
        
      default:
        return 0;
    }
  };

  // Load achievements for user
  const loadAchievements = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Get user's achievement IDs
      const userAchievementIds = await achievementService.getUserAchievements(userId);
      
      // Get all achievement definitions
      const achievementDefinitions = await achievementService.getAchievementDefinitions();
      
      // Get user's beer stats for progress calculation
      const userStats = await beerService.getUserStats(userId);
      
      // Create achievement objects with REAL progress
      const allAchievements: Achievement[] = achievementDefinitions.map(def => {
        const isUnlocked = userAchievementIds.includes(def.id);
        const currentProgress = calculateAchievementProgress(def, userStats, isUnlocked);
        
        return {
          id: def.id,
          type: def.type,
          title: def.title,
          description: def.description,
          icon: def.icon,
          criteria: {
            target: def.criteria.target,
            current: currentProgress, // ✅ Progres real calculat
            unit: def.criteria.unit
          },
          unlocked: isUnlocked,
          unlockedAt: isUnlocked ? new Date() : undefined,
          userId
        };
      });
      
      setAchievements(allAchievements);
      setUnlockedCount(allAchievements.filter(a => a.unlocked).length);
    } catch (error) {
      console.error('❌ Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize achievements for new user
  const initializeAchievements = async () => {
    if (!userId) return;
    
    try {
      await achievementService.initializeUserAchievements(userId);
      await loadAchievements(); // Reload after initialization
    } catch (error) {
      console.error('Error initializing achievements:', error);
    }
  };

  // Check for new achievements based on current stats
  const checkAchievements = async (stats: BeerStats): Promise<string[]> => {
    if (!userId) return [];
    
    try {
      const newAchievementIds = await achievementService.checkAchievements(userId, stats);
      
      if (newAchievementIds.length > 0) {
        // Reload achievements to get updated state
        await loadAchievements();
      }
      
      return newAchievementIds;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  };

  // Get achievements by type
  const getAchievementsByType = (type: Achievement['type']) => {
    return achievements.filter(achievement => achievement.type === type);
  };

  // Get unlocked achievements
  const getUnlockedAchievements = () => {
    return achievements.filter(achievement => achievement.unlocked);
  };

  // Get locked achievements
  const getLockedAchievements = () => {
    return achievements.filter(achievement => !achievement.unlocked);
  };

  // Get achievement progress percentage
  const getAchievementProgress = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;
    
    return Math.min(100, (achievement.criteria.current / achievement.criteria.target) * 100);
  };

  // Get all available achievements from database
  const getAllAvailableAchievements = async () => {
    return await achievementService.getAchievementDefinitions();
  };

  // Get achievement definition by ID
  const getAchievementDefinition = async (achievementId: string) => {
    const definitions = await achievementService.getAchievementDefinitions();
    return definitions.find((def: any) => def.id === achievementId);
  };

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  return {
    achievements,
    loading,
    unlockedCount,
    totalCount: achievements.length,
    loadAchievements,
    initializeAchievements,
    checkAchievements,
    getAchievementsByType,
    getUnlockedAchievements,
    getLockedAchievements,
    getAchievementProgress,
    getAllAvailableAchievements,
    getAchievementDefinition
  };
}; 