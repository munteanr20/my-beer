'use client';

import { useState } from 'react';
import { useBeers } from '../../hooks/useBeers';
import { useBeerStyles } from '../../hooks/useBeerStyles';
import { useNotification } from '../../contexts/NotificationContext';
import { AddBeerFormData } from '../../types';

interface AddBeerFormProps {
  userId: string;
}

export default function AddBeerForm({ userId}: AddBeerFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { addBeer } = useBeers(userId);
  const { beerStyleNames, loading: stylesLoading, error: stylesError } = useBeerStyles();
  const { addNotification } = useNotification();

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

    const beerData: AddBeerFormData = {
      name: name.trim(),
      type: type,
      quantity: quantity.trim() || undefined,
      alcohol: alcohol.trim() || undefined
    };

    const result = await addBeer(beerData);

    if (result.success) {
      setSuccess(true);
      setName('');
      setType('');
      setQuantity('');
      setAlcohol('');
      addNotification('Beer added successfully! 🍺', 'success', 4000);
    } else {
      setError(result.error || 'Error adding beer');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-2xl font-semibold mb-6 text-tavern-primary">
        Add a new beer
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div>
          <label htmlFor="beerName" className="block text-base font-medium text-tavern-primary mb-2">
            Beer name *
          </label>
          <input
            type="text"
            id="beerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="beer-input w-full px-4 py-3 rounded-lg focus:outline-none"
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
            className="beer-input w-full px-4 py-3 rounded-lg focus:outline-none"
            required
            disabled={stylesLoading}
          >
            <option value="">{stylesLoading ? 'Loading types...' : 'Select type'}</option>
            {beerStyleNames.map((beerType: string) => (
              <option key={beerType} value={beerType}>
                {beerType}
              </option>
            ))}
          </select>
          {stylesError && (
            <p className="text-red-500 text-sm mt-1">{stylesError}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="beerQuantity" className="block text-base font-medium text-tavern-primary mb-2">
            Quantity (ml) *
          </label>
          <input
            type="number"
            id="beerQuantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="beer-input w-full px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Ex: 330, 500, 1000"
            required
          />
        </div>
        
        <div>
          <label htmlFor="beerAlcohol" className="block text-base font-medium text-tavern-primary mb-2">
            Alcohol %
          </label>
          <input
            type="number"
            id="beerAlcohol"
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            className="beer-input w-full px-4 py-3 rounded-lg focus:outline-none"
            placeholder="Ex: 3.5, 5.5"
            required
          />
        </div>
        
        {error && (
          <div className="message-error text-sm p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Show success message only on mobile screens */}
        {success && (
          <div className="md:hidden message-success text-sm p-4 rounded-lg relative">
            <div className="flex items-center justify-between">
              <span>Beer added successfully! 🍺</span>
              <button
                onClick={() => setSuccess(false)}
                className="ml-2 p-1 hover:bg-[var(--tavern-gold)] hover:bg-opacity-20 rounded-full transition-colors duration-200"
                aria-label="Close notification"
              >
                <span className="text-[var(--tavern-cream)] text-lg">×</span>
              </button>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="beer-button w-full py-3 px-4 rounded-lg text-lg disabled:opacity-50 mt-auto"
        >
          {loading ? 'Pouring...' : 'Add beer 🍺'}
        </button>
      </form>
    </div>
  );
} 