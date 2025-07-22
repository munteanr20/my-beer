import { useState, useEffect } from 'react';
import { 
  collection,
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Beer } from '../types';
import { beerService } from '../services/beerService';
import { achievementService } from '../services/achievementService';

export const useBeers = (userId: string) => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBeers, setTotalBeers] = useState(0);

  // Fetch beers for the current user with real-time listener
  const fetchBeers = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'beers'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      // Use real-time listener instead of one-time fetch
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const beersData: Beer[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          beersData.push({
            id: doc.id,
            ...data
          } as Beer);
        });
        
        setBeers(beersData);
        setTotalBeers(beersData.length);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching beers:', error);
        setLoading(false);
      });
      
      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up listener:', error);
      setLoading(false);
    }
  };

  // Get beers using the service (for one-time fetching)
  const getBeers = async () => {
    if (!userId) return [];
    
    try {
      setLoading(true);
      const beers = await beerService.getBeers(userId);
      setBeers(beers);
      setTotalBeers(beers.length);
      setLoading(false);
      return beers;
    } catch (error) {
      console.error('Error getting beers:', error);
      setLoading(false);
      return [];
    }
  };

  // Add a new beer using the service
  const addBeer = async (beerData: Omit<Beer, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    try {
      const result = await beerService.addBeer({
        ...beerData,
        userId
      });
      
      // ✅ Reîncarcă achievement-urile cu progres actualizat
      if (result.success) {
        try {
          const userStats = await beerService.getUserStats(userId);
          await achievementService.checkAchievements(userId, userStats);
        } catch (error) {
          console.error('Error updating achievements after adding beer:', error);
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Error adding beer:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    if (userId) {
      fetchBeers().then((unsub) => {
        if (unsub) unsubscribe = unsub;
      });
    }
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  return {
    beers,
    totalBeers,
    loading,
    addBeer,
    fetchBeers,
    getBeers
  };
}; 