import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Achievement, ApiResponse, BeerStats } from '../types';

export class AchievementService {
  private collectionName = 'achievements'; // Achievement definitions collection
  private usersCollection = 'users'; // Users collection

  // Get achievement definitions from database
  async getAchievementDefinitions(): Promise<any[]> {
    try {
      console.log('🔍 Getting achievement definitions from collection:', this.collectionName);
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const definitions: any[] = [];

      querySnapshot.forEach((doc) => {
        definitions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log('📚 Found achievement definitions:', definitions.length);
      console.log('📋 Achievement titles:', definitions.map(d => d.title));
      
      return definitions;
    } catch (error) {
      console.error('❌ Error getting achievement definitions:', error);
      return [];
    }
  }

  // Get user's unlocked achievements (from user document)
  async getUserAchievements(userId: string): Promise<string[]> {
    try {
      console.log('🔍 Getting achievements for user:', userId);
      const userDoc = await getDocs(query(collection(db, this.usersCollection), where('__name__', '==', userId)));
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const achievements = userData.achievements || [];
        console.log('📋 User achievements found:', achievements);
        return achievements;
      }
      
      console.log('⚠️ No user document found for userId:', userId);
      return [];
    } catch (error) {
      console.error('❌ Error getting user achievements:', error);
      return [];
    }
  }

  // Add achievement to user's achievements field
  async addAchievementToUser(userId: string, achievementId: string): Promise<ApiResponse<void>> {
    try {
      const userDoc = await getDocs(query(collection(db, this.usersCollection), where('__name__', '==', userId)));
      
      if (!userDoc.empty) {
        const userRef = doc(db, this.usersCollection, userId);
        const userData = userDoc.docs[0].data();
        const currentAchievements = userData.achievements || [];
        
        if (!currentAchievements.includes(achievementId)) {
          await updateDoc(userRef, {
            achievements: [...currentAchievements, achievementId]
          });
        }
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Error adding achievement to user:', error);
      return {
        success: false,
        error: 'Failed to add achievement to user'
      };
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

  async checkAchievements(userId: string, stats: BeerStats): Promise<string[]> {
    try {
      const unlockedAchievementIds: string[] = [];
      const userAchievements = await this.getUserAchievements(userId);
      const achievementDefs = await this.getAchievementDefinitions();

      // Check each achievement definition against user stats
      for (const achievementDef of achievementDefs) {
        // Skip if user already has this achievement
        if (userAchievements.includes(achievementDef.id)) {
          continue;
        }

        let shouldUnlock = false;

        // Check achievement criteria based on type
        switch (achievementDef.type) {
          case 'milestone':
            if (achievementDef.criteria.unit === 'beers') {
              shouldUnlock = stats.totalBeers >= achievementDef.criteria.target;
            }
            break;

          case 'beer_count':
            shouldUnlock = stats.totalBeers >= achievementDef.criteria.target;
            break;

          case 'time_based':
            if (achievementDef.criteria.unit === 'weeks') {
              const weeksActive = stats.averageBeersPerWeek > 0 
                ? Math.ceil(stats.totalBeers / stats.averageBeersPerWeek) 
                : 0;
              shouldUnlock = weeksActive >= achievementDef.criteria.target;
            }
            break;

          case 'variety':
            // This would need unique beer types count from user's beers
            const uniqueTypes = 3; // Placeholder - should be calculated from actual beer data
            shouldUnlock = uniqueTypes >= achievementDef.criteria.target;
            break;

          case 'streak':
            if (achievementDef.criteria.unit === 'days') {
              if (achievementDef.criteria.target === 7) {
                shouldUnlock = stats.beersThisWeek >= 7;
              } else if (achievementDef.criteria.target === 30) {
                shouldUnlock = stats.beersThisMonth >= 30;
              }
            }
            break;

          case 'special':
            // Special achievements like "Tavern Owner" might have custom logic
            if (achievementDef.criteria.unit === 'owner') {
              shouldUnlock = true; // Always unlock for now
            }
            break;
        }

        if (shouldUnlock) {
          // Add achievement to user's achievements field
          await this.addAchievementToUser(userId, achievementDef.id);
          unlockedAchievementIds.push(achievementDef.id);
        }
      }

      return unlockedAchievementIds;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  async initializeUserAchievements(userId: string): Promise<void> {
    try {
      console.log('Initializing achievements for userId:', userId);
      
      // Check if user already has achievements
      const existingAchievements = await this.getUserAchievements(userId);
      
      if (existingAchievements.length > 0) {
        console.log('User already has achievements, skipping initialization');
        return; // User already has achievements
      }

      console.log('User has no achievements, ready to unlock them based on progress');
      console.log('Achievement initialization completed');
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