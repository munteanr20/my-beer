import { useState, useEffect } from 'react';
import { beerStyleService, BeerStyle } from '../services/beerStyleService';

export const useBeerStyles = () => {
  const [beerStyles, setBeerStyles] = useState<BeerStyle[]>([]);
  const [beerStyleNames, setBeerStyleNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load beer styles from database
  const loadBeerStyles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const styles = await beerStyleService.getBeerStyles();
      const names = await beerStyleService.getBeerStyleNames();
      
      setBeerStyles(styles);
      setBeerStyleNames(names);
      
    } catch (err) {
      console.error('❌ Error loading beer styles:', err);
      setError('Failed to load beer styles');
    } finally {
      setLoading(false);
    }
  };

  // Get beer style by name
  const getBeerStyleByName = async (name: string): Promise<BeerStyle | null> => {
    try {
      return await beerStyleService.getBeerStyleByName(name);
    } catch (err) {
      console.error('❌ Error getting beer style by name:', err);
      return null;
    }
  };

  // Reload beer styles
  const reloadBeerStyles = () => {
    loadBeerStyles();
  };

  useEffect(() => {
    loadBeerStyles();
  }, []);

  return {
    beerStyles,
    beerStyleNames,
    loading,
    error,
    loadBeerStyles: reloadBeerStyles,
    getBeerStyleByName
  };
}; 