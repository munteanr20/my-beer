'use client';

import { useState } from 'react';
import { useBeers } from '../hooks/useBeers';

interface AddBeerFormProps {
  userId: string;
  onBeerAdded: () => void;
}

export default function AddBeerForm({ userId, onBeerAdded }: AddBeerFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { addBeer } = useBeers(userId);

  const beerTypes = [
    'Blonde',
    'Dark', 
    'IPA',
    'Craft'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!name.trim()) {
      setError('Beer name is required.');
      setLoading(false);
      return;
    }

    if (!type) {
      setError('Please select the beer type.');
      setLoading(false);
      return;
    }

    const result = await addBeer({
      name: name.trim(),
      type: type,
      quantity: quantity.trim() || undefined,
      alcohol: alcohol.trim() || undefined
    });

    if (result.success) {
      setSuccess(true);
      setName('');
      setType('');
      setQuantity('');
      setAlcohol('');
      onBeerAdded();
    } else {
      setError(result.error || 'Error adding beer');
    }

    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-tavern-primary">
        Add a new beer
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="beerName" className="block text-base font-medium text-tavern-primary mb-2">
            Beer name *
          </label>
          <input
            type="text"
            id="beerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[var(--golden-light)] rounded-lg focus:outline-none focus:border-[var(--golden-dark)] text-tavern-primary placeholder-[var(--malt-brown)]/50 bg-[var(--foam-light)]"
            placeholder="Ex: Heineken, Guinness, etc."
            required
          />
        </div>
        
        <div>
          <label htmlFor="beerType" className="block text-base font-medium text-tavern-primary mb-2">
            Beer type *
          </label>
          <select
            id="beerType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[var(--golden-light)] rounded-lg focus:outline-none focus:border-[var(--golden-dark)] text-tavern-primary bg-[var(--foam-light)]"
            required
          >
            <option value="">Select type</option>
            {beerTypes.map((beerType) => (
              <option key={beerType} value={beerType}>
                {beerType}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="beerQuantity" className="block text-base font-medium text-tavern-primary mb-2">
            Quantity (ml) *
          </label>
          <input
            type="text"
            id="beerQuantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[var(--golden-light)] rounded-lg focus:outline-none focus:border-[var(--golden-dark)] text-tavern-primary placeholder-[var(--malt-brown)]/50 bg-[var(--foam-light)]"
            placeholder="Ex: 330, 500, 1000"
          />
        </div>
        
        <div>
          <label htmlFor="beerAlcohol" className="block text-base font-medium text-tavern-primary mb-2">
            Alcohol %
          </label>
          <input
            type="text"
            id="beerAlcohol"
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[var(--golden-light)] rounded-lg focus:outline-none focus:border-[var(--golden-dark)] text-tavern-primary placeholder-[var(--malt-brown)]/50 bg-[var(--foam-light)]"            placeholder="Ex: 3.5, 5.5"
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-4 rounded-lg border border-green-100">
            Beer added successfully! 🍺
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="beer-button w-full py-3 px-4 rounded-lg text-lg disabled:opacity-50"
        >
          {loading ? 'Pouring...' : 'Add beer 🍺'}
        </button>
      </form>
    </div>
  );
} 