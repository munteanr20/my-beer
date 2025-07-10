import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Achievement, ApiResponse, BeerStats } from '../types';
import { ACHIEVEMENTS } from '../constants';

export class AchievementService {
  private collectionName = 'achievements';

  async getAchievements(userId: string): Promise<Achievement[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('unlockedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const achievements: Achievement[] = [];

      querySnapshot.forEach((doc) => {
        achievements.push({
          id: doc.id,
          ...doc.data()
        } as Achievement);
      });

      return achievements;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async unlockAchievement(achievementId: string): Promise<ApiResponse<void>> {
    try {
      const achievementRef = doc(db, this.collectionName, achievementId);
      await updateDoc(achievementRef, {
        unlocked: true,
        unlockedAt: new Date()
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return {
        success: false,
        error: 'Failed to unlock achievement'
      };
    }
  }

  async checkAchievements(userId: string, stats: BeerStats): Promise<Achievement[]> {
    try {
      const unlockedAchievements: Achievement[] = [];
      const existingAchievements = await this.getAchievements(userId);
      const existingAchievementIds = new Set(existingAchievements.map(a => a.id));

      // Check each achievement type
      for (const [key, achievementDef] of Object.entries(ACHIEVEMENTS)) {
        if (existingAchievementIds.has(achievementDef.id)) {
          continue; // Already unlocked
        }

        let shouldUnlock = false;
        let currentProgress = 0;

        switch (achievementDef.type) {
          case 'milestone':
            if (achievementDef.id === 'first_beer') {
              shouldUnlock = stats.totalBeers >= achievementDef.criteria.target;
              currentProgress = stats.totalBeers;
            }
            break;

          case 'beer_count':
            shouldUnlock = stats.totalBeers >= achievementDef.criteria.target;
            currentProgress = stats.totalBeers;
            break;

          case 'time_based':
            // For weekly drinker, check if user has logged beers for 4 consecutive weeks
            // This is a simplified check - in a real app you'd track weekly activity
            if (achievementDef.id === 'weekly_drinker') {
              // Simplified: if user has been active for at least 4 weeks
              const weeksActive = Math.ceil(stats.averageBeersPerWeek > 0 ? stats.totalBeers / stats.averageBeersPerWeek : 0);
              shouldUnlock = weeksActive >= achievementDef.criteria.target;
              currentProgress = weeksActive;
            }
            break;

          case 'variety':
            // For variety seeker, we'd need to track unique beer types
            // This is a placeholder - you'd need to implement type counting
            if (achievementDef.id === 'variety_seeker') {
              // Simplified: assume 3 types for now
              const uniqueTypes = 3; // This should be calculated from actual data
              shouldUnlock = uniqueTypes >= achievementDef.criteria.target;
              currentProgress = uniqueTypes;
            }
            break;

          case 'streak':
            // For streaks, we'd need to track consecutive days
            // This is a placeholder - you'd need to implement streak tracking
            if (achievementDef.id === 'streak_7') {
              // Simplified: if user has logged beers this week
              shouldUnlock = stats.beersThisWeek >= 7;
              currentProgress = stats.beersThisWeek;
            } else if (achievementDef.id === 'streak_30') {
              // Simplified: if user has logged beers this month
              shouldUnlock = stats.beersThisMonth >= 30;
              currentProgress = stats.beersThisMonth;
            }
            break;
        }

        if (shouldUnlock) {
          const newAchievement: Omit<Achievement, 'id'> = {
            type: achievementDef.type,
            title: achievementDef.title,
            description: achievementDef.description,
            icon: achievementDef.icon,
            criteria: {
              target: achievementDef.criteria.target,
              current: currentProgress,
              unit: achievementDef.criteria.unit
            },
            unlocked: true,
            unlockedAt: new Date(),
            userId
          };

          const docRef = await addDoc(collection(db, this.collectionName), newAchievement);
          unlockedAchievements.push({
            id: docRef.id,
            ...newAchievement
          });
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  async initializeUserAchievements(userId: string): Promise<void> {
    try {
      // Check if user already has achievements
      const existingAchievements = await this.getAchievements(userId);
      
      if (existingAchievements.length > 0) {
        return; // User already has achievements
      }

      // Create initial achievements for the user
      const initialAchievements = Object.values(ACHIEVEMENTS).map(achievementDef => ({
        type: achievementDef.type,
        title: achievementDef.title,
        description: achievementDef.description,
        icon: achievementDef.icon,
        criteria: {
          target: achievementDef.criteria.target,
          current: 0,
          unit: achievementDef.criteria.unit
        },
        unlocked: false,
        userId
      }));

      // Add all initial achievements
      for (const achievement of initialAchievements) {
        await addDoc(collection(db, this.collectionName), achievement);
      }
    } catch (error) {
      console.error('Error initializing user achievements:', error);
    }
  }

  async updateAchievementProgress(achievementId: string, currentProgress: number): Promise<ApiResponse<void>> {
    try {
      const achievementRef = doc(db, this.collectionName, achievementId);
      await updateDoc(achievementRef, {
        'criteria.current': currentProgress
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return {
        success: false,
        error: 'Failed to update achievement progress'
      };
    }
  }
}

// Export singleton instance
export const achievementService = new AchievementService(); 