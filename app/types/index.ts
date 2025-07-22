// User achievement unlock record
export interface UserAchievement {
  achievementId: string;
  unlockedAt: any; // Firestore timestamp
}

// User related types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  displayNameLower: string | null;
  photoURL: string | null;
  role?: 'user' | 'admin' | 'owner' | 'moderator';
  achievements?: UserAchievement[];
  createdAt?: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
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
  type: 'beer_count' | 'time_based' | 'variety' | 'streak' | 'milestone' | 'special';
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
  templateId?: string; // Reference to the achievement template
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
  
  // Progres detaliat pentru achievement-uri
  uniqueTypes: number;
  highAlcoholBeers: number;
  lowAlcoholBeers: number;
  largeBeers: number;
  pintSizedBeers: number;
  totalPureAlcohol: number;
  currentStreak: number;
  weeklyStreak: number;
  weekendStreak: number;
  lateNightBeers: number;
  detailedLogs: number;
  ratedBeers: number;
  megaBeers: number;
  variedAlcoholBeers: number;
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
  getAchievementDefinitions: () => Promise<any[]>;
  getUserAchievements: (userId: string) => Promise<string[]>;
  addAchievementToUser: (userId: string, achievementId: string) => Promise<ApiResponse<void>>;
  checkAchievements: (userId: string, stats: BeerStats) => Promise<string[]>;
}

// Auth service types
export interface AuthService {
  signIn: (email: string, password: string) => Promise<ApiResponse<User>>;
  signUp: (email: string, password: string, displayName: string) => Promise<ApiResponse<User>>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
} 