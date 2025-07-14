import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Beer } from '../types';

export interface LeaderboardEntry {
  user: User;
  beersThisMonth: number;
  rank: number;
}

export interface UserBeerData {
  user: User;
  beers: Beer[];
}

export type TimeFilter = 'today' | 'week' | 'month';

export class LeaderboardService {
  private usersCollection = 'users';
  private beersCollection = 'beers';

  async getAllBeersData(): Promise<UserBeerData[]> {
    try {
      console.log('Fetching all beers data for all users...');
      
      // Get all users
      const usersSnapshot = await getDocs(collection(db, this.usersCollection));
      const users: User[] = [];
      
      usersSnapshot.forEach((doc) => {
        users.push({
          uid: doc.id,
          ...doc.data()
        } as User);
      });

      console.log(`Found ${users.length} users in the system`);

      // Get all beers for all users in one query
      const allBeersQuery = query(
        collection(db, this.beersCollection),
        orderBy('createdAt', 'desc')
      );

      const beersSnapshot = await getDocs(allBeersQuery);
      const allBeers: Beer[] = [];
      
      beersSnapshot.forEach((doc) => {
        allBeers.push({
          id: doc.id,
          ...doc.data()
        } as Beer);
      });

      console.log(`Found ${allBeers.length} total beers`);

      // Group beers by user
      const userBeersMap = new Map<string, Beer[]>();
      
      // Initialize all users with empty beer arrays
      users.forEach(user => {
        userBeersMap.set(user.uid, []);
      });

      // Group beers by userId
      allBeers.forEach(beer => {
        const userBeers = userBeersMap.get(beer.userId) || [];
        userBeers.push(beer);
        userBeersMap.set(beer.userId, userBeers);
      });

      // Create UserBeerData array
      const userBeerData: UserBeerData[] = users.map(user => ({
        user,
        beers: userBeersMap.get(user.uid) || []
      }));

      console.log('All beers data fetched successfully');
      return userBeerData;
    } catch (error) {
      console.error('Error fetching all beers data:', error);
      return [];
    }
  }

  filterBeersByTime(userBeerData: UserBeerData[], timeFilter: TimeFilter): LeaderboardEntry[] {
    const now = new Date();
    let startDate: Date;
    
    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const daysSinceMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
        startDate = new Date(now.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    console.log(`Filtering beers from ${startDate.toDateString()} to ${now.toDateString()}`);

    const leaderboardEntries: LeaderboardEntry[] = userBeerData.map(userData => {
      const filteredBeers = userData.beers.filter(beer => {
        const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
        return beerDate >= startDate;
      });

      return {
        user: userData.user,
        beersThisMonth: filteredBeers.length,
        rank: 0 // Will be set after sorting
      };
    });

    // Sort by beer count (descending) and assign ranks
    leaderboardEntries.sort((a, b) => b.beersThisMonth - a.beersThisMonth);
    
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboardEntries;
  }

  async getUserRank(userId: string, userBeerData: UserBeerData[], timeFilter: TimeFilter = 'month'): Promise<number> {
    try {
      const leaderboard = this.filterBeersByTime(userBeerData, timeFilter);
      const userEntry = leaderboard.find(entry => entry.user.uid === userId);
      return userEntry ? userEntry.rank : 0;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const leaderboardService = new LeaderboardService(); 