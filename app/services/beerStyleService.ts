import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BeerStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt?: any;
  updatedAt?: any;
}

export class BeerStyleService {
  private collectionName = 'beerStyles';

  // Get all beer styles from database
  async getBeerStyles(): Promise<BeerStyle[]> {
    try {
      
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const beerStyles: BeerStyle[] = [];
      
      querySnapshot.forEach((doc) => {
        beerStyles.push({
          id: doc.id,
          ...doc.data()
        } as BeerStyle);
      });
      
      // Sort by name for consistent ordering
      beerStyles.sort((a, b) => a.name.localeCompare(b.name));
      
      return beerStyles;
    } catch (error) {
      console.error('❌ Error fetching beer styles:', error);
      return [];
    }
  }

  // Get beer style names only (for dropdown)
  async getBeerStyleNames(): Promise<string[]> {
    try {
      const beerStyles = await this.getBeerStyles();
      return beerStyles.map(style => style.name);
    } catch (error) {
      console.error('❌ Error fetching beer style names:', error);
      return [];
    }
  }

  // Get beer style by name
  async getBeerStyleByName(name: string): Promise<BeerStyle | null> {
    try {
      const beerStyles = await this.getBeerStyles();
      return beerStyles.find(style => style.name === name) || null;
    } catch (error) {
      console.error('❌ Error fetching beer style by name:', error);
      return null;
    }
  }
}

// Export singleton instance
export const beerStyleService = new BeerStyleService(); 