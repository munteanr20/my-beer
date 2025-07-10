// User related types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Beer related types
export interface Beer {
  id: string;
  name: string;
  type: string;
  quantity?: string; // in ml
  alcohol?: string; // percentage
  createdAt: any; // Firestore timestamp
  userId: string;
}

// Achievement related types
export interface Achievement {
  id: string;
  type: 'beer_count' | 'time_based' | 'variety' | 'streak' | 'milestone';
  title: string;
  description: string;
  icon: string;
  criteria: {
    target: number;
    current: number;
    unit: string;
  };
  unlocked: boolean;
  unlockedAt?: any; // Firestore timestamp
  userId: string;
}

// Statistics types
export interface BeerStats {
  totalBeers: number;
  totalLiters: number;
  averageAlcohol: number;
  totalAlcohol: number;
  favoriteType: string;
  beersThisMonth: number;
  beersThisWeek: number;
  averageBeersPerWeek: number;
}

// Theme types
export type Theme = 'dark' | 'light';

// Form types
export interface AddBeerFormData {
  name: string;
  type: string;
  quantity?: string;
  alcohol?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Beer service types
export interface BeerService {
  addBeer: (beer: Omit<Beer, 'id' | 'createdAt'>) => Promise<ApiResponse<Beer>>;
  getBeers: (userId: string) => Promise<Beer[]>;
  deleteBeer: (beerId: string) => Promise<ApiResponse<void>>;
  updateBeer: (beerId: string, updates: Partial<Beer>) => Promise<ApiResponse<Beer>>;
}

// Achievement service types
export interface AchievementService {
  getAchievements: (userId: string) => Promise<Achievement[]>;
  unlockAchievement: (achievementId: string) => Promise<ApiResponse<void>>;
  checkAchievements: (userId: string, stats: BeerStats) => Promise<Achievement[]>;
}

// Auth service types
export interface AuthService {
  signIn: (email: string, password: string) => Promise<ApiResponse<User>>;
  signUp: (email: string, password: string, displayName: string) => Promise<ApiResponse<User>>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
} 