import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Beer, ApiResponse, BeerStats } from '../types';

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

  // Calculul statisticilor detaliate pentru achievement-uri
  async getUserStats(userId: string): Promise<BeerStats> {
    try {
      const beers = await this.getBeers(userId);
      
      if (beers.length === 0) {
        return {
          totalBeers: 0,
          totalLiters: 0,
          averageAlcohol: 0,
          totalAlcohol: 0,
          favoriteType: '',
          beersThisMonth: 0,
          beersThisWeek: 0,
          averageBeersPerWeek: 0,
          uniqueTypes: 0,
          highAlcoholBeers: 0,
          lowAlcoholBeers: 0,
          largeBeers: 0,
          pintSizedBeers: 0,
          totalPureAlcohol: 0,
          currentStreak: 0,
          weeklyStreak: 0,
          weekendStreak: 0,
          lateNightBeers: 0,
          detailedLogs: 0,
          ratedBeers: 0,
          megaBeers: 0,
          variedAlcoholBeers: 0
        };
      }

      // Calculul de bază
      const totalBeers = beers.length;
      const totalLiters = beers.reduce((sum, beer) => {
        const quantity = parseFloat((beer.quantity || 0).toString()) || 0;
        return sum + (quantity / 1000); // Convert ml to liters
      }, 0);
      
      const totalAlcohol = beers.reduce((sum, beer) => {
        const alcohol = parseFloat((beer.alcohol || 0).toString()) || 0;
        const quantity = parseFloat((beer.quantity || 0).toString()) || 0;
        return sum + ((alcohol * quantity) / 100000); // Calculate pure alcohol in liters
      }, 0);
      
      const averageAlcohol = beers.reduce((sum, beer) => {
        return sum + (parseFloat((beer.alcohol || 0).toString()) || 0);
      }, 0) / totalBeers;

      // Calculul beer types frequency
      const typeCount: { [key: string]: number } = {};
      beers.forEach(beer => {
        typeCount[beer.type] = (typeCount[beer.type] || 0) + 1;
      });
      const favoriteType = Object.keys(typeCount).reduce((a, b) => 
        typeCount[a] > typeCount[b] ? a : b
      );

      // Calculul recent activity
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const beersThisWeek = beers.filter(beer => {
        const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
        return beerDate >= oneWeekAgo;
      }).length;

      const beersThisMonth = beers.filter(beer => {
        const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
        return beerDate >= oneMonthAgo;
      }).length;

      const averageBeersPerWeek = totalBeers / Math.max(1, Math.ceil((now.getTime() - new Date(beers[0].createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)));

      // ✅ Calculul detaliat pentru achievement-uri
      const uniqueTypes = new Set(beers.map(b => b.type)).size;
      const highAlcoholBeers = beers.filter(b => parseFloat((b.alcohol || 0).toString()) >= 8).length;
      const lowAlcoholBeers = beers.filter(b => parseFloat((b.alcohol || 0).toString()) < 4).length;
      const largeBeers = beers.filter(b => parseFloat((b.quantity || 0).toString()) >= 500).length;
      const pintSizedBeers = beers.filter(b => parseFloat((b.quantity || 0).toString()) === 330).length;
      const totalPureAlcohol = beers.reduce((sum, b) => {
        const alcohol = parseFloat((b.alcohol || 0).toString()) || 0;
        const quantity = parseFloat((b.quantity || 0).toString()) || 0;
        return sum + ((alcohol * quantity) / 100000);
      }, 0);
      
      // Calculul streak-urilor
      const currentStreak = this.calculateCurrentStreak(beers);
      const weeklyStreak = this.calculateWeeklyStreak(beers);
      const weekendStreak = this.calculateWeekendStreak(beers);
      
      // Calculul berelor nocturne (după 22:00)
      const lateNightBeers = beers.filter(beer => {
        const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
        return beerDate.getHours() >= 22;
      }).length;
      
      // Calculul berelor cu detalii (presupunem că au descriere)
      const detailedLogs = beers.filter(beer => (beer as any).description && (beer as any).description.trim().length > 0).length;
      
      // Calculul berelor evaluate (presupunem că au rating)
      const ratedBeers = beers.filter(beer => (beer as any).rating && (beer as any).rating > 0).length;
      
      // Calculul berelor mega (1L+)
      const megaBeers = beers.filter(b => parseFloat((b.quantity || 0).toString()) >= 1000).length;
      
      // Calculul berelor cu alcool variat (diferite procente)
      const alcoholLevels = new Set(beers.map(b => Math.floor(parseFloat((b.alcohol || 0).toString()))));
      const variedAlcoholBeers = alcoholLevels.size;

      return {
        totalBeers,
        totalLiters,
        averageAlcohol,
        totalAlcohol,
        favoriteType,
        beersThisMonth,
        beersThisWeek,
        averageBeersPerWeek,
        uniqueTypes,
        highAlcoholBeers,
        lowAlcoholBeers,
        largeBeers,
        pintSizedBeers,
        totalPureAlcohol,
        currentStreak,
        weeklyStreak,
        weekendStreak,
        lateNightBeers,
        detailedLogs,
        ratedBeers,
        megaBeers,
        variedAlcoholBeers
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {
        totalBeers: 0,
        totalLiters: 0,
        averageAlcohol: 0,
        totalAlcohol: 0,
        favoriteType: '',
        beersThisMonth: 0,
        beersThisWeek: 0,
        averageBeersPerWeek: 0,
        uniqueTypes: 0,
        highAlcoholBeers: 0,
        lowAlcoholBeers: 0,
        largeBeers: 0,
        pintSizedBeers: 0,
        totalPureAlcohol: 0,
        currentStreak: 0,
        weeklyStreak: 0,
        weekendStreak: 0,
        lateNightBeers: 0,
        detailedLogs: 0,
        ratedBeers: 0,
        megaBeers: 0,
        variedAlcoholBeers: 0
      };
    }
  }

  // Funcții helper pentru calculul streak-urilor
  private calculateCurrentStreak(beers: Beer[]): number {
    if (beers.length === 0) return 0;
    
    const sortedBeers = beers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;
    
    for (const beer of sortedBeers) {
      const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
      const beerDay = new Date(beerDate);
      beerDay.setHours(0, 0, 0, 0);
      
      if (beerDay.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (beerDay.getTime() < currentDate.getTime()) {
        break;
      }
    }
    
    return streak;
  }

  private calculateWeeklyStreak(beers: Beer[]): number {
    if (beers.length === 0) return 0;
    
    const sortedBeers = beers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    const today = new Date();
    const currentWeek = this.getWeekNumber(today);
    
    let streak = 0;
    let weekToCheck = currentWeek;
    
    for (const beer of sortedBeers) {
      const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
      const beerWeek = this.getWeekNumber(beerDate);
      
      if (beerWeek === weekToCheck) {
        streak++;
        weekToCheck--;
      } else if (beerWeek < weekToCheck) {
        break;
      }
    }
    
    return streak;
  }

  private calculateWeekendStreak(beers: Beer[]): number {
    if (beers.length === 0) return 0;
    
    const sortedBeers = beers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    const today = new Date();
    let streak = 0;
    let currentWeekend = this.getWeekendNumber(today);
    
    for (const beer of sortedBeers) {
      const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
      const beerWeekend = this.getWeekendNumber(beerDate);
      
      if (beerWeekend === currentWeekend) {
        streak++;
        currentWeekend--;
      } else if (beerWeekend < currentWeekend) {
        break;
      }
    }
    
    return streak;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  private getWeekendNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.floor(pastDaysOfYear / 7);
  }
}

// Export singleton instance
export const beerService = new BeerService(); 