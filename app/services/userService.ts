import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, UserAchievement, ApiResponse } from '../types';

function formatEmailName(raw: string | undefined) {
  if (!raw) return '';
  return raw
    .split('.')
    .map(
      part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(' ');
}

export class UserService {
  private collectionName = 'users';

  // Create or update user document
  async createOrUpdateUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    try {
      
      const userRef = doc(db, this.collectionName, userData.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user
        const emailPrefix = userData.email?.split('@')[0];
        const formattedName = userData.displayName || formatEmailName(emailPrefix);

        const newUser: User = {
          ...userData,
          role: 'user', // Default role for new users
          achievements: [],
          displayName: formattedName,
          displayNameLower: formattedName.toLowerCase(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(userRef, newUser);
        return { success: true, data: newUser };
      } else {
        // Update existing user
        const updateData = {
          ...userData,
          displayNameLower: userData.displayName?.toLowerCase() || null,
          updatedAt: new Date()
        };
        
        await updateDoc(userRef, updateData);
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
      
      const userDoc = await getDoc(doc(db, this.collectionName, userId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data() as User;
      return userData;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async searchUsersByName (searchTerm: string) : Promise<User[]> {
    try{
      const usersRef = collection(db, this.collectionName);
      const q = query(usersRef, orderBy("displayNameLower"), startAt(searchTerm), endAt(searchTerm + "\uf8ff"));
      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as User);
      });

      return users;

    } catch (error){
      console.error ("Error getting users", error);
      return [];
    }
  }

  // Add achievement to user
  async addAchievement(userId: string, achievementId: string): Promise<ApiResponse<void>> {
    try {
      
      const userRef = doc(db, this.collectionName, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
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
      
      const user = await this.getUser(userId);
      if (!user) {
        return [];
      }
      
      const achievements = user.achievements || [];
      return achievements;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Get all users (admin function)
  async getAllUsers(): Promise<User[]> {
    try {
      
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          uid: doc.id,
          ...doc.data()
        } as User);
      });
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}

// Export singleton instance
export const userService = new UserService(); 