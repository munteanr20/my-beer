import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, UserAchievement, ApiResponse } from '../types';

export class UserService {
  private collectionName = 'users';

  // Create or update user document
  async createOrUpdateUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    try {
      console.log('Creating/updating user:', userData.uid);
      
      const userRef = doc(db, this.collectionName, userData.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user
        const newUser: User = {
          ...userData,
          role: 'user', // Default role for new users
          achievements: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(userRef, newUser);
        console.log('User created successfully');
        return { success: true, data: newUser };
      } else {
        // Update existing user
        const updateData = {
          ...userData,
          updatedAt: new Date()
        };
        
        await updateDoc(userRef, updateData);
        console.log('User updated successfully');
        return { success: true, data: { ...userDoc.data() as User, ...updateData } };
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      return {
        success: false,
        error: 'Failed to create/update user'
      };
    }
  }

  // Get user by ID
  async getUser(userId: string): Promise<User | null> {
    try {
      console.log('Fetching user:', userId);
      
      const userDoc = await getDoc(doc(db, this.collectionName, userId));
      
      if (!userDoc.exists()) {
        console.log('User not found');
        return null;
      }
      
      const userData = userDoc.data() as User;
      console.log('User found:', userData.displayName);
      return userData;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Add achievement to user
  async addAchievement(userId: string, achievementId: string): Promise<ApiResponse<void>> {
    try {
      console.log(`Adding achievement ${achievementId} to user ${userId}`);
      
      const userRef = doc(db, this.collectionName, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('User not found, creating user document');
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          uid: userId,
          achievements: [{
            achievementId,
            unlockedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Add achievement to existing user
        const userData = userDoc.data() as User;
        const achievements = userData.achievements || [];
        
        // Check if achievement is already unlocked
        const alreadyUnlocked = achievements.some(a => a.achievementId === achievementId);
        if (alreadyUnlocked) {
          console.log('Achievement already unlocked');
          return { success: true };
        }
        
        // Add new achievement
        achievements.push({
          achievementId,
          unlockedAt: new Date()
        });
        
        await updateDoc(userRef, {
          achievements,
          updatedAt: new Date()
        });
      }
      
      console.log('Achievement added successfully');
      return { success: true };
    } catch (error) {
      console.error('Error adding achievement:', error);
      return {
        success: false,
        error: 'Failed to add achievement'
      };
    }
  }

  // Get user achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      console.log('Fetching user achievements for:', userId);
      
      const user = await this.getUser(userId);
      if (!user) {
        console.log('User not found');
        return [];
      }
      
      const achievements = user.achievements || [];
      console.log('Found achievements:', achievements.length);
      return achievements;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Get all users (admin function)
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('Fetching all users...');
      
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          uid: doc.id,
          ...doc.data()
        } as User);
      });
      
      console.log('Found users:', users.length);
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}

// Export singleton instance
export const userService = new UserService(); 