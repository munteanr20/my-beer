'use client';

import { useState } from 'react';
import { useBeers } from '../hooks/useBeers';
import { useAuth } from '../hooks/useAuth';

export default function BeerList() {
  const { user } = useAuth();
  const { beers, loading } = useBeers(user?.uid || '');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (beerId: string) => {
    if (!confirm('Are you sure you want to delete this beer?')) {
      return;
    }

    setDeletingId(beerId);
    try {
      // Delete functionality removed - UI/UX focus only
      console.log('Delete beer:', beerId);
    } catch (err) {
      console.error('Error deleting beer:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'blonde':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'dark':
        return 'bg-amber-800/20 text-amber-300 border-amber-800/30';
      case 'ipa':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'craft':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="loading-pulse">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your beer collection...</p>
        </div>
      </div>
    );
  }



  if (!beers || beers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍺</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No beers yet</h3>
        <p className="text-gray-400">Start your beer journey by adding your first beer!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Your Collection ({beers.length})
        </h3>
        <div className="text-sm text-gray-400">
          Total: {beers.reduce((sum, beer) => sum + (parseInt(beer.quantity || '0') || 0), 0)} ml
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {beers.map((beer) => (
          <div
            key={beer.id}
            className="card hover-lift p-4 border border-gray-600/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-white text-lg">{beer.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(beer.type)}`}>
                    {beer.type}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  {beer.quantity && (
                    <div className="flex items-center space-x-1">
                      <span>📏</span>
                      <span>{beer.quantity} ml</span>
                    </div>
                  )}
                  {beer.alcohol && parseFloat(beer.alcohol) > 0 && (
                    <div className="flex items-center space-x-1">
                      <span>🍺</span>
                      <span>{beer.alcohol}%</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>
                      {beer.createdAt?.toDate ? 
                        beer.createdAt.toDate().toLocaleDateString() : 
                        new Date(beer.createdAt).toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => beer.id && handleDelete(beer.id)}
                disabled={deletingId === beer.id}
                className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                title="Delete beer"
              >
                {deletingId === beer.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 