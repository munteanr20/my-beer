import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
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
  
async function addDisplayNameLowerToAllUsers() {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
  
    let updated = 0, skipped = 0;
    for (const userDoc of snapshot.docs) {
      const data = userDoc.data();
      if (data.displayName) {
        const displayNameLower = data.displayName.toLowerCase();
        await updateDoc(doc(db, 'users', userDoc.id), { displayNameLower });
        console.log(`✅ Updated user ${userDoc.id} with displayNameLower: ${displayNameLower}`);
        updated++;
      } else {
        console.log(`⏭️  Skipped user ${userDoc.id} (no displayName)`);
        skipped++;
      }
    }
    console.log(`Migration complete! Updated: ${updated}, Skipped: ${skipped}`);
    process.exit(0);
  }
  
  addDisplayNameLowerToAllUsers().catch((err) => {
    console.error(err);
    process.exit(1);
  });