'use client';

import { useAuth } from '../hooks/useAuth';
import AddBeerForm from './AddBeerForm';
import BeerList from './BeerList';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="mb-8">
        <div className="card hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="beer-icon">
                <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h1 className="heading-primary text-3xl">My Beer Tracker</h1>
                <p className="text-gray-300">Track your beer journey with style</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-amber-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-right">
                <p className="text-white font-medium">Hello, {user?.displayName || user?.email}</p>
                <button
                  onClick={handleLogout}
                  className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Beer Form */}
        <div className="card hover-lift">
          <h2 className="heading-secondary text-2xl mb-6">Add New Beer</h2>
          <AddBeerForm />
        </div>

        {/* Beer List */}
        <div className="card hover-lift">
          <h2 className="heading-secondary text-2xl mb-6">Your Beer Collection</h2>
          <BeerList />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8">
        <div className="card hover-lift">
          <h2 className="heading-secondary text-2xl mb-6">Your Beer Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
              <div className="text-3xl font-bold text-amber-400 mb-2">🍺</div>
              <h3 className="text-white font-semibold mb-1">Total Beers</h3>
              <p className="text-amber-300 text-2xl font-bold">0</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/30">
              <div className="text-3xl font-bold text-yellow-400 mb-2">📊</div>
              <h3 className="text-white font-semibold mb-1">Total Volume</h3>
              <p className="text-yellow-300 text-2xl font-bold">0 ml</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <div className="text-3xl font-bold text-orange-400 mb-2">🎯</div>
              <h3 className="text-white font-semibold mb-1">Avg. Alcohol</h3>
              <p className="text-orange-300 text-2xl font-bold">0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 