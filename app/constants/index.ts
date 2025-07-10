// Beer types
export const BEER_TYPES = [
  'Blonde',
  'Dark', 
  'IPA',
  'Craft',
  'Lager',
  'Pilsner',
  'Stout',
  'Porter',
  'Wheat',
  'Sour',
  'Other'
] as const;

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_BEER: {
    id: 'first_beer',
    type: 'milestone' as const,
    title: 'First Sip',
    description: 'Log your first beer in the tavern',
    icon: '🍺',
    criteria: { target: 1, current: 0, unit: 'beers' }
  },
  BEER_COLLECTOR_10: {
    id: 'beer_collector_10',
    type: 'beer_count' as const,
    title: 'Beer Collector',
    description: 'Log 10 different beers',
    icon: '📚',
    criteria: { target: 10, current: 0, unit: 'beers' }
  },
  BEER_COLLECTOR_50: {
    id: 'beer_collector_50',
    type: 'beer_count' as const,
    title: 'Beer Enthusiast',
    description: 'Log 50 different beers',
    icon: '📖',
    criteria: { target: 50, current: 0, unit: 'beers' }
  },
  BEER_COLLECTOR_100: {
    id: 'beer_collector_100',
    type: 'beer_count' as const,
    title: 'Beer Master',
    description: 'Log 100 different beers',
    icon: '👑',
    criteria: { target: 100, current: 0, unit: 'beers' }
  },
  WEEKLY_DRINKER: {
    id: 'weekly_drinker',
    type: 'time_based' as const,
    title: 'Weekly Regular',
    description: 'Log beers for 4 consecutive weeks',
    icon: '📅',
    criteria: { target: 4, current: 0, unit: 'weeks' }
  },
  VARIETY_SEEKER: {
    id: 'variety_seeker',
    type: 'variety' as const,
    title: 'Variety Seeker',
    description: 'Try 5 different beer types',
    icon: '🎨',
    criteria: { target: 5, current: 0, unit: 'types' }
  },
  STREAK_7: {
    id: 'streak_7',
    type: 'streak' as const,
    title: 'Week Warrior',
    description: 'Log beers for 7 consecutive days',
    icon: '🔥',
    criteria: { target: 7, current: 0, unit: 'days' }
  },
  STREAK_30: {
    id: 'streak_30',
    type: 'streak' as const,
    title: 'Monthly Master',
    description: 'Log beers for 30 consecutive days',
    icon: '⭐',
    criteria: { target: 30, current: 0, unit: 'days' }
  }
} as const;

// Theme constants
export const THEMES = {
  DARK: 'dark' as const,
  LIGHT: 'light' as const
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'ghimbav-tavern-theme',
  USER_PREFERENCES: 'ghimbav-tavern-preferences'
} as const;

// API endpoints (if needed for future backend integration)
export const API_ENDPOINTS = {
  BEERS: '/api/beers',
  ACHIEVEMENTS: '/api/achievements',
  USERS: '/api/users'
} as const;

// Tavern branding
export const TAVERN_BRANDING = {
  NAME: "Ghimbav's Tavern",
  TAGLINE: "The finest tavern in the realm",
  DESCRIPTION: "Track your beer journey across the realm"
} as const;

// Validation constants
export const VALIDATION = {
  MIN_BEER_NAME_LENGTH: 2,
  MAX_BEER_NAME_LENGTH: 100,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10000,
  MIN_ALCOHOL: 0,
  MAX_ALCOHOL: 100
} as const; 