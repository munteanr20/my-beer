// Script to add beer styles to Firestore
// Run this script to populate the beerStyles collection

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

// Beer styles to add
const BEER_STYLES = [
  {
    name: 'Lager',
    description: 'Clean, crisp, and refreshing beer with a light to medium body.',
    icon: '🍺'
  },
  {
    name: 'Dark',
    description: 'Rich, malty beer with darker color and smooth flavor.',
    icon: '🍺'
  },
  {
    name: 'Amber',
    description: 'Medium-bodied ale with balanced malt and hop profile.',
    icon: '🍺'
  },
  {
    name: 'IPA',
    description: 'Hop-forward ale with high bitterness and aromatic flavors.',
    icon: '🍺'
  },
  {
    name: 'Craft',
    description: 'Innovative beer from small, independent breweries.',
    icon: '🍺'
  }
];

async function checkExistingStyles() {
  try {
    const stylesSnapshot = await getDocs(collection(db, 'beerStyles'));
    const existingStyles = [];
    
    stylesSnapshot.forEach((doc) => {
      existingStyles.push(doc.data().name);
    });
    
    return existingStyles;
  } catch (error) {
    console.error('Error checking existing styles:', error);
    return [];
  }
}

async function addBeerStyles() {
  try {
    console.log('🚀 Starting to add beer styles...');
    
    // Check for existing styles
    const existingStyles = await checkExistingStyles();
    console.log(`📊 Found ${existingStyles.length} existing beer styles`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const style of BEER_STYLES) {
      // Skip if style already exists
      if (existingStyles.includes(style.name)) {
        console.log(`⏭️  Skipping ${style.name} - already exists`);
        skippedCount++;
        continue;
      }
      
      try {
        const docRef = await addDoc(collection(db, 'beerStyles'), {
          ...style,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Added ${style.name} (ID: ${docRef.id})`);
        addedCount++;
        
        // Small delay to avoid overwhelming Firestore
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error adding ${style.name}:`, error);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ Successfully added: ${addedCount} beer styles`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount} beer styles`);
    console.log(`📊 Total processed: ${addedCount + skippedCount} beer styles`);
    
    if (addedCount > 0) {
      console.log('\n🎉 Beer styles have been successfully added to your Firebase database!');
      console.log('You can now use these styles in your beer tracking app.');
    } else {
      console.log('\nℹ️  All beer styles already exist in the database.');
    }
    
  } catch (error) {
    console.error('❌ Error in addBeerStyles:', error);
    process.exit(1);
  }
}

// Run the script
console.log('🍺 Beer Styles Addition Script');
console.log('================================');
addBeerStyles().then(() => {
  console.log('\n✨ Script completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
