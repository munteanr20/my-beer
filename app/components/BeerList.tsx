'use client';

import { useBeers } from '../hooks/useBeers';
import { Beer } from '../hooks/useBeers';

interface BeerListProps {
  userId: string;
}

export default function BeerList({ userId }: BeerListProps) {
  const { beers, totalBeers, loading } = useBeers(userId);

  if (loading) {
    return (
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tavern-gold)]"></div>
          <span className="ml-2 body-font text-[var(--tavern-cream)]">Pouring your beers...</span>
        </div>
      </div>
    );
  }

  if (beers.length === 0) {
    return (
      <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
        <div className="text-center">
          <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">🍺</div>
          <h3 className="heading-font text-xl font-bold text-tavern-primary mb-3">
            Empty Tank
          </h3>
          <p className="body-font text-tavern-primary text-sm">
            Your beer journey awaits! Add your first brew to start your legendary collection.
          </p>
        </div>
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
    switch (type.toLowerCase()) {
      case 'blonde': return '🍺';
      case 'dark': return '🍺';
      case 'ipa': return '🍺';
      case 'craft': return '🍺';
      default: return '🍺';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blonde': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dark': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ipa': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'craft': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="tavern-glass rounded-xl p-6 border border-[var(--tavern-copper)]">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-2xl font-display mb-6 text-tavern-primary">
            Your Beer Collection
          </h3>
          <p className="body-font font-bold text-tavern-primary text-md">
            {totalBeers} {totalBeers === 1 ? 'beer' : 'beers'} in your tavern
          </p>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {beers.map((beer, index) => (
          <div
            key={beer.id}
            className="bg-[var(--tavern-dark)] rounded-lg p-4 border border-[var(--tavern-copper)] hover:border-[var(--tavern-gold)] transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-2xl transform hover:scale-110 transition-transform duration-300">
                  {getBeerEmoji(beer.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="heading-font font-bold text-[var(--tavern-gold)] text-lg truncate">
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
                        <span className="body-font text-[var(--tavern-cream)]">{beer.quantity}ml</span>
                      </div>
                    )}
                    {beer.alcohol && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[var(--tavern-copper)]">⚡</span>
                        <span className="body-font text-[var(--tavern-cream)]">{beer.alcohol}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="body-font text-[var(--tavern-copper)] text-xs font-medium">
                  {formatDate(beer.createdAt)}
                </div>
                <div className="text-xs text-[var(--tavern-cream)] opacity-70">
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