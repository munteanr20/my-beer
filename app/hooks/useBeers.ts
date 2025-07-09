import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Beer {
  id?: string;
  name: string;
  type: string;
  quantity?: string;
  alcohol?: string;
  userId: string;
  createdAt?: any;
}

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

  // Add a new beer
  const addBeer = async (beerData: Omit<Beer, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    try {
      const newBeer = {
        ...beerData,
        userId,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'beers'), newBeer);
      
      // No need to manually refresh since we have real-time listener
      return { success: true, id: docRef.id };
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
    fetchBeers
  };
}; 