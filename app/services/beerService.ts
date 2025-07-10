import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Beer, ApiResponse } from '../types';

export class BeerService {
  private collectionName = 'beers';

  async addBeer(beer: Omit<Beer, 'id' | 'createdAt'>): Promise<ApiResponse<Beer>> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...beer,
        createdAt: new Date()
      });

      const newBeer: Beer = {
        id: docRef.id,
        ...beer,
        createdAt: new Date()
      };

      return {
        success: true,
        data: newBeer
      };
    } catch (error) {
      console.error('Error adding beer:', error);
      return {
        success: false,
        error: 'Failed to add beer'
      };
    }
  }

  async getBeers(userId: string): Promise<Beer[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const beers: Beer[] = [];

      querySnapshot.forEach((doc) => {
        beers.push({
          id: doc.id,
          ...doc.data()
        } as Beer);
      });

      return beers;
    } catch (error) {
      console.error('Error getting beers:', error);
      return [];
    }
  }

  async deleteBeer(beerId: string): Promise<ApiResponse<void>> {
    try {
      await deleteDoc(doc(db, this.collectionName, beerId));
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting beer:', error);
      return {
        success: false,
        error: 'Failed to delete beer'
      };
    }
  }

  async updateBeer(beerId: string, updates: Partial<Beer>): Promise<ApiResponse<Beer>> {
    try {
      const beerRef = doc(db, this.collectionName, beerId);
      await updateDoc(beerRef, updates);

      // Get the updated beer
      const updatedBeer = await this.getBeerById(beerId);
      
      if (!updatedBeer) {
        return {
          success: false,
          error: 'Beer not found after update'
        };
      }
      
      return {
        success: true,
        data: updatedBeer
      };
    } catch (error) {
      console.error('Error updating beer:', error);
      return {
        success: false,
        error: 'Failed to update beer'
      };
    }
  }

  private async getBeerById(beerId: string): Promise<Beer | null> {
    try {
      const docRef = doc(db, this.collectionName, beerId);
      const docSnap = await getDocs(query(collection(db, this.collectionName), where('__name__', '==', beerId)));
      
      if (!docSnap.empty) {
        const doc = docSnap.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Beer;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting beer by id:', error);
      return null;
    }
  }

  async getBeersByType(userId: string, type: string): Promise<Beer[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const beers: Beer[] = [];

      querySnapshot.forEach((doc) => {
        beers.push({
          id: doc.id,
          ...doc.data()
        } as Beer);
      });

      return beers;
    } catch (error) {
      console.error('Error getting beers by type:', error);
      return [];
    }
  }

  async getBeersByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Beer[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const beers: Beer[] = [];

      querySnapshot.forEach((doc) => {
        beers.push({
          id: doc.id,
          ...doc.data()
        } as Beer);
      });

      return beers;
    } catch (error) {
      console.error('Error getting beers by date range:', error);
      return [];
    }
  }
}

// Export singleton instance
export const beerService = new BeerService(); 