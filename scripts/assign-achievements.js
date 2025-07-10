// Script to assign achievements to all users based on their beer stats
// This script will check each user's beer data and assign appropriate achievements

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
  'FIREBASE_APP_ID',
  'FIREBASE_ADMIN_EMAIL',
  'FIREBASE_ADMIN_PASSWORD'
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
const auth = getAuth(app);

// Authenticate with admin account
async function authenticateAdmin() {
  try {
    const adminEmail = process.env.FIREBASE_ADMIN_EMAIL;
    const adminPassword = process.env.FIREBASE_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('❌ Missing admin credentials in .env file');
      console.error('Please add FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD to your .env file');
      process.exit(1);
    }
    
    console.log('🔐 Authenticating with admin account...');
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('✅ Admin authentication successful');
  } catch (error) {
    console.error('❌ Admin authentication failed:', error);
    process.exit(1);
  }
}

// Calculate beer stats for a user
async function calculateUserStats(userId) {
  try {
    // Get user's beers
    const beersQuery = query(collection(db, 'beers'), where('userId', '==', userId));
    const beersSnapshot = await getDocs(beersQuery);
    const beers = [];
    
    beersSnapshot.forEach((doc) => {
      beers.push({
        id: doc.id,
        ...doc.data()
      });
    });

    if (beers.length === 0) {
      return {
        totalBeers: 0,
        totalLiters: 0,
        averageAlcohol: 0,
        totalAlcohol: 0,
        favoriteType: '',
        beersThisMonth: 0,
        beersThisWeek: 0,
        averageBeersPerWeek: 0
      };
    }

    // Calculate stats
    const totalBeers = beers.length;
    const totalLiters = beers.reduce((sum, beer) => {
      const quantity = parseFloat(beer.quantity) || 0;
      return sum + (quantity / 1000); // Convert ml to liters
    }, 0);
    
    const totalAlcohol = beers.reduce((sum, beer) => {
      const alcohol = parseFloat(beer.alcohol) || 0;
      const quantity = parseFloat(beer.quantity) || 0;
      return sum + ((alcohol * quantity) / 100000); // Calculate pure alcohol in liters
    }, 0);
    
    const averageAlcohol = beers.reduce((sum, beer) => {
      return sum + (parseFloat(beer.alcohol) || 0);
    }, 0) / totalBeers;

    // Calculate beer types frequency
    const typeCount = {};
    beers.forEach(beer => {
      typeCount[beer.type] = (typeCount[beer.type] || 0) + 1;
    });
    const favoriteType = Object.keys(typeCount).reduce((a, b) => 
      typeCount[a] > typeCount[b] ? a : b
    );

    // Calculate recent activity (simplified)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const beersThisWeek = beers.filter(beer => {
      const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
      return beerDate >= oneWeekAgo;
    }).length;

    const beersThisMonth = beers.filter(beer => {
      const beerDate = beer.createdAt?.toDate?.() || new Date(beer.createdAt);
      return beerDate >= oneMonthAgo;
    }).length;

    const averageBeersPerWeek = totalBeers / Math.max(1, Math.ceil((now - new Date(beers[0].createdAt)) / (7 * 24 * 60 * 60 * 1000)));

    return {
      totalBeers,
      totalLiters,
      averageAlcohol,
      totalAlcohol,
      favoriteType,
      beersThisMonth,
      beersThisWeek,
      averageBeersPerWeek
    };
  } catch (error) {
    console.error('Error calculating stats for user:', userId, error);
    return null;
  }
}

// Check achievements for a user based on their stats
async function checkUserAchievements(userId, stats) {
  try {
    // Get achievement definitions
    const achievementsQuery = await getDocs(collection(db, 'achievements'));
    const achievementDefinitions = [];
    
    achievementsQuery.forEach((doc) => {
      achievementDefinitions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const unlockedAchievements = [];

    // Check each achievement
    for (const achievementDef of achievementDefinitions) {
      let shouldUnlock = false;

      switch (achievementDef.type) {
        case 'milestone':
          if (achievementDef.criteria.unit === 'beers') {
            shouldUnlock = stats.totalBeers >= achievementDef.criteria.target;
          }
          break;

        case 'beer_count':
          shouldUnlock = stats.totalBeers >= achievementDef.criteria.target;
          break;

        case 'time_based':
          if (achievementDef.criteria.unit === 'weeks') {
            const weeksActive = stats.averageBeersPerWeek > 0 
              ? Math.ceil(stats.totalBeers / stats.averageBeersPerWeek) 
              : 0;
            shouldUnlock = weeksActive >= achievementDef.criteria.target;
          }
          break;

        case 'variety':
          // Calculate unique beer types
          const uniqueTypes = new Set();
          const beersQuery = query(collection(db, 'beers'), where('userId', '==', userId));
          const beersSnapshot = await getDocs(beersQuery);
          beersSnapshot.forEach((doc) => {
            const beer = doc.data();
            if (beer.type) uniqueTypes.add(beer.type);
          });
          shouldUnlock = uniqueTypes.size >= achievementDef.criteria.target;
          break;

        case 'streak':
          if (achievementDef.criteria.unit === 'days') {
            if (achievementDef.criteria.target === 7) {
              shouldUnlock = stats.beersThisWeek >= 7;
            } else if (achievementDef.criteria.target === 30) {
              shouldUnlock = stats.beersThisMonth >= 30;
            }
          }
          break;

        case 'special':
          if (achievementDef.criteria.unit === 'owner') {
            // Tavern Owner - only give to users with role 'owner'
            // Get user data to check role
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              shouldUnlock = userData.role === 'owner';
            }
          }
          break;
      }

      if (shouldUnlock) {
        unlockedAchievements.push(achievementDef.id);
      }
    }

    return unlockedAchievements;
  } catch (error) {
    console.error('Error checking achievements for user:', userId, error);
    return [];
  }
}

// Assign achievements to a user
async function assignAchievementsToUser(userId) {
  try {
    console.log(`🔍 Processing user: ${userId}`);
    
    // Calculate user stats
    const stats = await calculateUserStats(userId);
    if (!stats) {
      console.log(`⚠️ Could not calculate stats for user: ${userId}`);
      return;
    }

    console.log(`📊 User stats:`, {
      totalBeers: stats.totalBeers,
      totalLiters: stats.totalLiters.toFixed(2),
      averageAlcohol: stats.averageAlcohol.toFixed(2),
      beersThisWeek: stats.beersThisWeek,
      beersThisMonth: stats.beersThisMonth
    });

    // Check which achievements user should have
    const unlockedAchievements = await checkUserAchievements(userId, stats);
    console.log(`🏆 Achievements to unlock: ${unlockedAchievements.length}`);

    if (unlockedAchievements.length > 0) {
      // Get current user achievements
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
      
      if (!userDoc.empty) {
        const userRef = doc(db, 'users', userId);
        const userData = userDoc.docs[0].data();
        const currentAchievements = userData.achievements || [];
        
        // Add new achievements
        const newAchievements = unlockedAchievements.filter(id => !currentAchievements.includes(id));
        
        if (newAchievements.length > 0) {
          await updateDoc(userRef, {
            achievements: [...currentAchievements, ...newAchievements]
          });
          console.log(`✅ Added ${newAchievements.length} achievements to user ${userId}`);
        } else {
          console.log(`ℹ️ User ${userId} already has all eligible achievements`);
        }
      } else {
        console.log(`⚠️ User document not found for: ${userId}`);
      }
    } else {
      console.log(`ℹ️ No achievements to unlock for user: ${userId}`);
    }
  } catch (error) {
    console.error(`❌ Error processing user ${userId}:`, error);
  }
}

// Main function to process all users
async function assignAchievementsToAllUsers() {
  try {
    // First authenticate as admin
    await authenticateAdmin();
    
    console.log('🚀 Starting achievement assignment for all users...');
    
    // Get all users
    const usersQuery = await getDocs(collection(db, 'users'));
    const users = [];
    
    usersQuery.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📋 Found ${users.length} users to process`);

    let processedCount = 0;
    let totalAchievementsAssigned = 0;

    for (const user of users) {
      console.log(`\n--- Processing User ${processedCount + 1}/${users.length} ---`);
      
      const initialAchievements = user.achievements?.length || 0;
      await assignAchievementsToUser(user.id);
      
      // Check how many achievements user has now
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', user.id)));
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const finalAchievements = userData.achievements?.length || 0;
        const newAchievements = finalAchievements - initialAchievements;
        
        if (newAchievements > 0) {
          totalAchievementsAssigned += newAchievements;
          console.log(`🎉 User ${user.id} gained ${newAchievements} new achievements!`);
        }
      }
      
      processedCount++;
      
      // Small delay to avoid overwhelming Firestore
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n📈 Summary:');
    console.log(`✅ Processed ${processedCount} users`);
    console.log(`🏆 Total new achievements assigned: ${totalAchievementsAssigned}`);
    console.log('\n🎉 Achievement assignment completed successfully!');

  } catch (error) {
    console.error('❌ Error in assignAchievementsToAllUsers:', error);
    process.exit(1);
  }
}

// Run the script
console.log('🍺 Achievement Assignment Script');
console.log('================================');
assignAchievementsToAllUsers().then(() => {
  console.log('\n✨ Script completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 