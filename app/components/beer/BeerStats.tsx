'use client';

import { useBeers } from '../../hooks/useBeers';
import { Beer, BeerStats as BeerStatsType } from '../../types';

interface BeerStatsProps {
  userId: string;
  variant?: 'dashboard' | 'profile';
}

interface Stats {
  totalBeers: number;
  totalLiters: number;
  averageAlcohol: number;
  totalAlcohol: number;
  favoriteType: string;
  beersThisMonth: number;
  beersThisWeek: number;
  averageBeersPerWeek: number;
}

export default function BeerStats({ userId, variant = 'dashboard' }: BeerStatsProps) {
  const { beers, loading } = useBeers(userId);

  const calculateStats = (beers: Beer[]): Stats => {
    if (beers.length === 0) {
      return {
        totalBeers: 0,
        totalLiters: 0,
        averageAlcohol: 0,
        totalAlcohol: 0,
        favoriteType: 'None',
        beersThisMonth: 0,
        beersThisWeek: 0,
        averageBeersPerWeek: 0
      };
    }

    // Calculate total liters (convert from ml to liters) - More accurate parsing
    const totalLiters = beers.reduce((total, beer) => {
      if (beer.quantity) {
        // Remove all non-numeric characters except decimal points
        const cleanQuantity = beer.quantity.replace(/[^\d.]/g, '');
        const quantity = parseFloat(cleanQuantity);
        return total + (isNaN(quantity) ? 0 : quantity / 1000); // Convert ml to liters
      }
      return total;
    }, 0);

    // Calculate alcohol statistics - More accurate parsing
    const alcoholValues = beers
      .map(beer => {
        if (!beer.alcohol) return 0;
        // Remove all non-numeric characters except decimal points
        const cleanAlcohol = beer.alcohol.replace(/[^\d.]/g, '');
        return parseFloat(cleanAlcohol);
      })
      .filter(alcohol => !isNaN(alcohol) && alcohol > 0);

    const averageAlcohol = alcoholValues.length > 0 
      ? alcoholValues.reduce((sum, alcohol) => sum + alcohol, 0) / alcoholValues.length 
      : 0;

    // Calculate total alcohol more accurately
    const totalAlcohol = beers.reduce((total, beer) => {
      if (beer.alcohol && beer.quantity) {
        // Clean and parse alcohol percentage
        const cleanAlcohol = beer.alcohol.replace(/[^\d.]/g, '');
        const alcohol = parseFloat(cleanAlcohol);
        
        // Clean and parse quantity in ml
        const cleanQuantity = beer.quantity.replace(/[^\d.]/g, '');
        const quantity = parseFloat(cleanQuantity);
        
        // Calculate pure alcohol in liters: (alcohol_percentage / 100) * quantity_ml / 1000
        // Example: 5% alcohol in 330ml = (5/100) * 330 / 1000 = 0.0165 liters pure alcohol
        if (!isNaN(alcohol) && !isNaN(quantity) && alcohol > 0 && quantity > 0) {
          return total + (alcohol / 100) * (quantity / 1000);
        }
      }
      return total;
    }, 0);

    // Find favorite beer type
    const typeCounts = beers.reduce((counts, beer) => {
      counts[beer.type] = (counts[beer.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const favoriteType = Object.keys(typeCounts).length > 0
      ? Object.entries(typeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 'None';

    // Calculate recent activity
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const beersThisWeek = beers.filter(beer => {
      const beerDate = beer.createdAt?.toDate ? beer.createdAt.toDate() : new Date(beer.createdAt);
      return beerDate >= oneWeekAgo;
    }).length;

    const beersThisMonth = beers.filter(beer => {
      const beerDate = beer.createdAt?.toDate ? beer.createdAt.toDate() : new Date(beer.createdAt);
      return beerDate >= oneMonthAgo;
    }).length;

    // Calculate average beers per week with more accurate time calculation
    const beerDates = beers
      .map(beer => beer.createdAt?.toDate ? beer.createdAt.toDate() : new Date(beer.createdAt))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstBeerDate = beerDates[0];
    const lastBeerDate = beerDates[beerDates.length - 1];
    
    // Calculate time span more accurately
    const timeSpanMs = lastBeerDate.getTime() - firstBeerDate.getTime();
    const timeSpanWeeks = Math.max(1, timeSpanMs / (7 * 24 * 60 * 60 * 1000));
    
    const averageBeersPerWeek = beers.length / timeSpanWeeks;

    return {
      totalBeers: beers.length,
      totalLiters,
      averageAlcohol,
      totalAlcohol,
      favoriteType,
      beersThisMonth,
      beersThisWeek,
      averageBeersPerWeek
    };
  };

  const stats = calculateStats(beers);

  if (loading) {
    return (
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] border-2">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-2 body-font text-[var(--tavern-cream)]">Loading statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)] border-2">
      <h3 className="heading-font text-xl font-bold text-tavern-primary mb-6">
        {variant === 'dashboard' ? 'Quick Stats' : 'Your Beer Journey Stats'}
      </h3>
      
      {variant === 'dashboard' ? (
        // Dashboard - Versiune simplificată
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Beers */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Total</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.totalBeers}</p>
                </div>
                <div className="text-2xl">🍺</div>
              </div>
            </div>

            {/* This Week */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">This Week</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.beersThisWeek}</p>
                </div>
                <div className="text-2xl">📅</div>
              </div>
            </div>

            {/* Total Liters */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Liters</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.totalLiters.toFixed(1)}L</p>
                </div>
                <div className="text-2xl">🥃</div>
              </div>
            </div>

            {/* Favorite Type */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Favorite</p>
                  <p className="heading-font text-lg font-bold text-tavern-secondary">{stats.favoriteType}</p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </div>
          </div>
          
          {/* Gradient Overlay and Profile Suggestion */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--tavern-dark)] via-[var(--tavern-dark)]/80 to-transparent rounded-b-xl pointer-events-none"></div>
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <a 
              href="/profile" 
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--tavern-gold)]/20 backdrop-blur-sm border border-[var(--tavern-gold)]/30 text-[var(--tavern-gold)] hover:bg-[var(--tavern-gold)]/30 transition-all duration-300 group"
            >
              <span className="body-font text-sm font-medium">For more stats, please check your profile</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      ) : (
        // Profile - Versiune completă
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Beers */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Total Beers</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.totalBeers}</p>
                </div>
                <div className="text-2xl">🍺</div>
              </div>
            </div>

            {/* Total Liters */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Total Liters</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.totalLiters.toFixed(1)}L</p>
                </div>
                <div className="text-2xl">🥃</div>
              </div>
            </div>

            {/* Average Alcohol */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Avg. Alcohol</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.averageAlcohol.toFixed(1)}%</p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </div>

            {/* Total Alcohol */}
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-font text-tavern-primary text-sm">Total Alcohol</p>
                  <p className="heading-font text-2xl font-bold text-tavern-secondary">{stats.totalAlcohol.toFixed(4)}L</p>
                </div>
                <div className="text-2xl">🔥</div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <p className="body-font text-tavern-primary text-sm">This Week</p>
              <p className="heading-font text-xl font-bold text-tavern-secondary">{stats.beersThisWeek} beers</p>
            </div>
            
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <p className="body-font text-tavern-primary text-sm">This Month</p>
              <p className="heading-font text-xl font-bold text-tavern-secondary">{stats.beersThisMonth} beers</p>
            </div>
            
            <div className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
              <p className="body-font text-tavern-primary text-sm">Avg. per Week</p>
              <p className="heading-font text-xl font-bold text-tavern-secondary">{stats.averageBeersPerWeek.toFixed(1)}</p>
            </div>
          </div>

          {/* Favorite Type */}
          <div className="mt-6 tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2">
            <p className="body-font text-tavern-primary text-sm mb-2">Favorite Beer Type</p>
            <p className="heading-font text-lg font-bold text-tavern-secondary">{stats.favoriteType}</p>
          </div>

          {/* Progress Bar for Total Beers */}
          {stats.totalBeers > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="body-font font-bold text-tavern-primary text-sm">Beer Collection Progress</p>
                <p className="body-font font-bold text-tavern-primary text-sm">{stats.totalBeers} beers</p>
              </div>
              <div className="w-full bg-[var(--tavern-copper)] rounded-full h-3">
                <div 
                  className="bg-[var(--tavern-dark)] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.totalBeers / 100) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 