'use client';

import { useBeers } from '../../hooks/useBeers';
import { useBeerStyles } from '../../hooks/useBeerStyles';
import { Beer } from '../../types';

interface BeerListProps {
  userId: string;
}

export default function BeerList({ userId }: BeerListProps) {
  const { beers, totalBeers, loading } = useBeers(userId);
  const { beerStyles, loading: stylesLoading } = useBeerStyles();

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
        <span className="ml-2 body-font text-[var(--tavern-cream)]">Pouring your beers...</span>
      </div>
    );
  }

  if (beers.length === 0) {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">🍺</div>
        <h3 className="heading-font text-xl font-bold text-tavern-primary mb-3">
          Empty Tank
        </h3>
        <p className="body-font text-tavern-primary text-sm">
          Your beer journey awaits! Add your first brew to start your legendary collection.
        </p>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getBeerEmoji = (type: string) => {
    const beerStyle = beerStyles.find(style => style.name === type);
    return beerStyle?.icon || '🍺';
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blonde': return 'bg-[var(--tavern-gold)] text-tavern-dark border-[var(--tavern-copper)]';
      case 'dark': return 'bg-[var(--tavern-dark)] text-[var(--tavern-cream)] border-[var(--tavern-copper)]';
      case 'ipa': return 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] border-[var(--tavern-copper)]';
      case 'craft': return 'bg-[var(--tavern-gold)] text-[var(--tavern-dark)] border-[var(--tavern-copper)]';
      default: return 'bg-[var(--tavern-gold)] text-[var(--tavern-cream)] border-[var(--tavern-copper)]';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-2xl font-semibold mb-6 text-tavern-primary">
            Your Beer Collection
          </h3>
          <p className="body-font font-bold text-tavern-primary text-md">
            {totalBeers} {totalBeers === 1 ? 'beer' : 'beers'} in your tavern
          </p>
        </div>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
        {beers.map((beer, index) => (
          <div
            key={beer.id}
            className="tavern-glass rounded-lg p-4 border border-[var(--tavern-copper)] border-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-2xl transform hover:scale-110 transition-transform duration-300">
                  {getBeerEmoji(beer.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="heading-font font-bold text-tavern-primary text-lg truncate">
                      {beer.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(beer.type)}`}>
                      {beer.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    {beer.quantity && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[var(--tavern-copper)]">🥃</span>
                        <span className="body-font text-tavern-primary">{beer.quantity}ml</span>
                      </div>
                    )}
                    {beer.alcohol && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[var(--tavern-copper)]">⚡</span>
                        <span className="body-font text-tavern-primary">{beer.alcohol}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="body-font text-[var(--tavern-copper)] text-xs font-medium">
                  {formatDate(beer.createdAt)}
                </div>
                <div className="text-xs text-tavern-primary opacity-70">
                  #{index + 1}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 