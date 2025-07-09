'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AddBeerForm() {
  const [name, setName] = useState('');
  const [type, setType] = useState('Blonde');
  const [quantity, setQuantity] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const beerTypes = ['Blonde', 'Dark', 'IPA', 'Craft'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!name.trim()) {
      setError('Beer name is required');
      setLoading(false);
      return;
    }

    if (!quantity.trim()) {
      setError('Quantity is required');
      setLoading(false);
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    const alcoholNum = alcohol ? parseFloat(alcohol) : 0;
    if (alcohol && (isNaN(alcoholNum) || alcoholNum < 0 || alcoholNum > 100)) {
      setError('Please enter a valid alcohol percentage (0-100)');
      setLoading(false);
      return;
    }

    try {
      // Add beer functionality removed - UI/UX focus only
      console.log('Add beer:', {
        name: name.trim(),
        type,
        quantity: quantityNum,
        alcohol: alcoholNum,
        userId: user!.uid,
        createdAt: new Date(),
      });

      // Reset form
      setName('');
      setType('Blonde');
      setQuantity('');
      setAlcohol('');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to add beer. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="success-glow bg-green-500/10 border border-green-500/20 text-green-300 text-sm p-4 rounded-lg">
          🍺 Beer added successfully!
        </div>
      )}

      {error && (
        <div className="error-glow bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="beerName" className="block text-sm font-medium text-gray-200 mb-2">
            Beer Name*
          </label>
          <input
            type="text"
            id="beerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-modern w-full"
            placeholder="Ex: Heineken, Guinness, Corona"
            required
          />
        </div>
        
        <div>
          <label htmlFor="beerType" className="block text-sm font-medium text-gray-200 mb-2">
            Beer Type*
          </label>
          <select
            id="beerType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-modern w-full"
          >
            {beerTypes.map((beerType) => (
              <option key={beerType} value={beerType}>
                {beerType}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="beerQuantity" className="block text-sm font-medium text-gray-200 mb-2">
            Quantity* (ml)
          </label>
          <input
            type="number"
            id="beerQuantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-modern w-full"
            placeholder="Ex: 330, 500, 1000"
            min="1"
            step="1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="beerAlcohol" className="block text-sm font-medium text-gray-200 mb-2">
            Alcohol %
          </label>
          <input
            type="number"
            id="beerAlcohol"
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            className="input-modern w-full"
            placeholder="Ex: 3.5, 5.5"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding beer...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">🍺</span>
              Add Beer
            </div>
          )}
        </button>
      </form>
    </div>
  );
} 