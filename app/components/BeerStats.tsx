'use client';

import { useBeers, Beer } from '../hooks/useBeers';

interface BeerStatsProps {
  userId: string;
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

export default function BeerStats({ userId }: BeerStatsProps) {
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

    // Calculate total liters (convert from ml to liters)
    const totalLiters = beers.reduce((total, beer) => {
      if (beer.quantity) {
        const quantity = parseFloat(beer.quantity.replace(/[^\d.]/g, ''));
        return total + (isNaN(quantity) ? 0 : quantity / 1000); // Convert ml to liters
      }
      return total;
    }, 0);

    // Calculate alcohol statistics
    const alcoholValues = beers
      .map(beer => beer.alcohol ? parseFloat(beer.alcohol.replace(/[^\d.]/g, '')) : 0)
      .filter(alcohol => !isNaN(alcohol));

    const averageAlcohol = alcoholValues.length > 0 
      ? alcoholValues.reduce((sum, alcohol) => sum + alcohol, 0) / alcoholValues.length 
      : 0;

    const totalAlcohol = beers.reduce((total, beer) => {
      if (beer.alcohol && beer.quantity) {
        const alcohol = parseFloat(beer.alcohol.replace(/[^\d.]/g, ''));
        const quantity = parseFloat(beer.quantity.replace(/[^\d.]/g, ''));
        return total + (isNaN(alcohol) || isNaN(quantity) ? 0 : (alcohol * quantity / 100));
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

    // Calculate average beers per week (based on first beer date)
    const firstBeerDate = beers
      .map(beer => beer.createdAt?.toDate ? beer.createdAt.toDate() : new Date(beer.createdAt))
      .sort((a, b) => a.getTime() - b.getTime())[0];

    const weeksSinceFirst = firstBeerDate 
      ? Math.max(1, Math.ceil((now.getTime() - firstBeerDate.getTime()) / (7 * 24 * 60 * 60 * 1000)))
      : 1;

    const averageBeersPerWeek = beers.length / weeksSinceFirst;

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
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-2 body-font text-[var(--tavern-cream)]">Loading statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
      <h3 className="heading-font text-xl font-bold text-tavern-primary mb-6">
        Your Beer Journey Stats
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Beers */}
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-font text-[var(--tavern-cream)] text-sm">Total Beers</p>
              <p className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">{stats.totalBeers}</p>
            </div>
            <div className="text-2xl">🍺</div>
          </div>
        </div>

        {/* Total Liters */}
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-font text-[var(--tavern-cream)] text-sm">Total Liters</p>
              <p className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">{stats.totalLiters.toFixed(1)}L</p>
            </div>
            <div className="text-2xl">🥃</div>
          </div>
        </div>

        {/* Average Alcohol */}
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-font text-[var(--tavern-cream)] text-sm">Avg. Alcohol</p>
              <p className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">{stats.averageAlcohol.toFixed(1)}%</p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>
        </div>

        {/* Total Alcohol */}
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-font text-[var(--tavern-cream)] text-sm">Total Alcohol</p>
              <p className="heading-font text-2xl font-bold text-[var(--tavern-gold)]">{stats.totalAlcohol.toFixed(1)}L</p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <p className="body-font text-[var(--tavern-cream)] text-sm">This Week</p>
          <p className="heading-font text-xl font-bold text-[var(--tavern-gold)]">{stats.beersThisWeek} beers</p>
        </div>
        
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <p className="body-font text-[var(--tavern-cream)] text-sm">This Month</p>
          <p className="heading-font text-xl font-bold text-[var(--tavern-gold)]">{stats.beersThisMonth} beers</p>
        </div>
        
        <div className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
          <p className="body-font text-[var(--tavern-cream)] text-sm">Avg. per Week</p>
          <p className="heading-font text-xl font-bold text-[var(--tavern-gold)]">{stats.averageBeersPerWeek.toFixed(1)}</p>
        </div>
      </div>

      {/* Favorite Type */}
      <div className="mt-6 bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)]">
        <p className="body-font text-[var(--tavern-cream)] text-sm mb-2">Favorite Beer Type</p>
        <p className="heading-font text-lg font-bold text-[var(--tavern-gold)]">{stats.favoriteType}</p>
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
    </div>
  );
} 