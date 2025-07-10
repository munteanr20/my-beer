// Script to add achievement templates to Firestore
// Run this script to populate the achievements collection

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Validate environment variables
const requiredEnvVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN', 
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.error('Please check your scripts/.env file and ensure all Firebase config values are set.');
  process.exit(1);
}

console.log('🔧 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Achievement templates to add
const ACHIEVEMENTS = [
  {
    type: 'milestone',
    title: 'First Sip',
    description: 'Log your first beer in the tavern',
    icon: '🍺',
    criteria: {
      target: 1,
      unit: 'beers'
    }
  },
  {
    type: 'beer_count',
    title: 'Beer Collector',
    description: 'Log 10 different beers',
    icon: '📚',
    criteria: {
      target: 10,
      unit: 'beers'
    }
  },
  {
    type: 'beer_count',
    title: 'Beer Enthusiast',
    description: 'Log 50 different beers',
    icon: '📖',
    criteria: {
      target: 50,
      unit: 'beers'
    }
  },
  {
    type: 'beer_count',
    title: 'Beer Master',
    description: 'Log 100 different beers',
    icon: '👑',
    criteria: {
      target: 100,
      unit: 'beers'
    }
  },
  {
    type: 'time_based',
    title: 'Weekly Regular',
    description: 'Log beers for 4 consecutive weeks',
    icon: '📅',
    criteria: {
      target: 4,
      unit: 'weeks'
    }
  },
  {
    type: 'variety',
    title: 'Variety Seeker',
    description: 'Try 5 different beer types',
    icon: '🎨',
    criteria: {
      target: 5,
      unit: 'types'
    }
  },
  {
    type: 'streak',
    title: 'Week Warrior',
    description: 'Log beers for 7 consecutive days',
    icon: '🔥',
    criteria: {
      target: 7,
      unit: 'days'
    }
  },
  {
    type: 'streak',
    title: 'Monthly Master',
    description: 'Log beers for 30 consecutive days',
    icon: '⭐',
    criteria: {
      target: 30,
      unit: 'days'
    }
  },
  // Fun tavern-themed achievements based on existing beer data
  {
    type: 'special',
    title: 'Tavern Owner',
    description: 'The legendary keeper of this fine establishment',
    icon: '🏰',
    criteria: {
      target: 1,
      unit: 'owner'
    }
  },
  {
    type: 'alcohol',
    title: 'Drunken Sailor',
    description: 'Drink 5 beers with 8%+ alcohol content',
    icon: '⚓',
    criteria: {
      target: 5,
      unit: 'high_alcohol'
    }
  },
  {
    type: 'alcohol',
    title: 'Alcohol Coma',
    description: 'Consume 10 liters of pure alcohol total',
    icon: '💀',
    criteria: {
      target: 10,
      unit: 'pure_alcohol_liters'
    }
  },
  {
    type: 'quantity',
    title: 'Tank Engine',
    description: 'Drink 20 beers of 500ml or larger',
    icon: '🚂',
    criteria: {
      target: 20,
      unit: 'large_beers'
    }
  },
  {
    type: 'quantity',
    title: 'Thirsty Giant',
    description: 'Consume 50 liters of beer total',
    icon: '🌊',
    criteria: {
      target: 50,
      unit: 'total_liters'
    }
  },
  {
    type: 'streak',
    title: 'Night Owl',
    description: 'Log beers after 10 PM for 5 consecutive nights',
    icon: '🦉',
    criteria: {
      target: 5,
      unit: 'late_nights'
    }
  },
  {
    type: 'variety',
    title: 'Beer Connoisseur',
    description: 'Try all 11 different beer types',
    icon: '🍷',
    criteria: {
      target: 11,
      unit: 'all_types'
    }
  },
  {
    type: 'alcohol',
    title: 'Lightweight',
    description: 'Stick to beers under 4% alcohol for 10 beers',
    icon: '🍃',
    criteria: {
      target: 10,
      unit: 'low_alcohol'
    }
  },
  {
    type: 'quantity',
    title: 'Pint Master',
    description: 'Drink 100 beers of exactly 330ml',
    icon: '🥃',
    criteria: {
      target: 100,
      unit: 'pint_sized'
    }
  },
  {
    type: 'streak',
    title: 'Weekend Warrior',
    description: 'Log beers every weekend for 2 months',
    icon: '🎉',
    criteria: {
      target: 8,
      unit: 'weekends'
    }
  },
  {
    type: 'alcohol',
    title: 'Beer Sommelier',
    description: 'Rate 50 beers with detailed alcohol content',
    icon: '📝',
    criteria: {
      target: 50,
      unit: 'rated_beers'
    }
  },
  {
    type: 'quantity',
    title: 'Mega Tank',
    description: 'Drink 10 beers of 1 liter or larger',
    icon: '🛢️',
    criteria: {
      target: 10,
      unit: 'mega_beers'
    }
  },
  {
    type: 'alcohol',
    title: 'Brewmaster',
    description: 'Try 25 different beers with varying alcohol content',
    icon: '🏭',
    criteria: {
      target: 25,
      unit: 'varied_alcohol'
    }
  },
  {
    type: 'streak',
    title: 'Secretary',
    description: 'Log detailed beer info for 30 consecutive days',
    icon: '📋',
    criteria: {
      target: 30,
      unit: 'detailed_logs'
    }
  },
  {
    type: 'special',
    title: 'Tavern Legend',
    description: 'Achieve all other achievements - the ultimate tavern master',
    icon: '⚔️',
    criteria: {
      target: 1,
      unit: 'all_achievements'
    }
  }
];

async function addAchievements() {
  try {
    console.log('Starting to check and add achievements to Firestore...');
    
    // Get all existing achievements
    const existingAchievements = await getDocs(collection(db, 'achievements'));
    const existingTitles = new Set();
    
    existingAchievements.forEach((doc) => {
      const data = doc.data();
      existingTitles.add(data.title);
    });
    
    console.log(`Found ${existingAchievements.size} existing achievements`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    // Check and add each achievement individually
    for (const achievement of ACHIEVEMENTS) {
      if (existingTitles.has(achievement.title)) {
        console.log(`⏭️  Skipped: ${achievement.title} (already exists)`);
        skippedCount++;
      } else {
        try {
          const docRef = await addDoc(collection(db, 'achievements'), achievement);
          console.log(`✅ Added: ${achievement.title} (ID: ${docRef.id})`);
          addedCount++;
        } catch (error) {
          console.error(`❌ Error adding ${achievement.title}:`, error);
        }
      }
    }
    
    console.log('\n🎉 Achievement check completed!');
    console.log(`📊 Summary:`);
    console.log(`   ✅ Added: ${addedCount} achievements`);
    console.log(`   ⏭️  Skipped: ${skippedCount} achievements (already exist)`);
    console.log(`   📈 Total in database: ${existingAchievements.size + addedCount}`);
    
  } catch (error) {
    console.error('❌ Error checking/adding achievements:', error);
  }
}

// Run the script
addAchievements().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
}); 