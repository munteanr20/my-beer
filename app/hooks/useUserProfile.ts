import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: any;
  preferences?: {
    favoriteBeerType?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
  stats?: {
    totalBeers: number;
    favoriteBeerType?: string;
    lastBeerDate?: any;
  };
}

export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get or create user profile
  const getUserProfile = async (userData: { uid: string; email: string | null; displayName?: string | null }) => {
    if (!userId) return null;
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Profile exists, return it
        return { uid: userId, ...userSnap.data() } as UserProfile;
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: userId,
          email: userData.email || '',
          displayName: userData.displayName || '',
          createdAt: new Date(),
          preferences: {
            notifications: true,
            theme: 'light'
          },
          stats: {
            totalBeers: 0
          }
        };
        
        await setDoc(userRef, newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, updates);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Listen to profile changes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setProfile({ uid: userId, ...doc.data() } as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to profile:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    profile,
    loading,
    getUserProfile,
    updateProfile
  };
}; 