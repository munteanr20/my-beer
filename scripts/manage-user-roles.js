// Script to manage user roles in the database
// This script allows you to view and modify user roles

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
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
    
    console.log('🔐 Authenticating with admin account...');
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('✅ Admin authentication successful');
  } catch (error) {
    console.error('❌ Admin authentication failed:', error);
    process.exit(1);
  }
}

// Get all users with their roles
async function getAllUsers() {
  try {
    const usersQuery = await getDocs(collection(db, 'users'));
    const users = [];
    
    usersQuery.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role || 'user',
        achievements: userData.achievements || [],
        createdAt: userData.createdAt
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// Update user role
async function updateUserRole(userId, newRole) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date()
    });
    console.log(`✅ Updated user ${userId} role to: ${newRole}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating user ${userId} role:`, error);
    return false;
  }
}

// Display users in a table format
function displayUsers(users) {
  console.log('\n📋 Users in Database:');
  console.log('='.repeat(80));
  console.log('ID'.padEnd(28) + 'Email'.padEnd(25) + 'Name'.padEnd(20) + 'Role'.padEnd(10) + 'Achievements');
  console.log('='.repeat(80));
  
  users.forEach(user => {
    const id = user.id.substring(0, 8) + '...';
    const email = (user.email || 'N/A').substring(0, 22) + (user.email && user.email.length > 22 ? '...' : '');
    const name = (user.displayName || 'N/A').substring(0, 17) + (user.displayName && user.displayName.length > 17 ? '...' : '');
    const role = user.role || 'user';
    const achievements = user.achievements.length;
    
    console.log(
      id.padEnd(28) + 
      email.padEnd(25) + 
      name.padEnd(20) + 
      role.padEnd(10) + 
      achievements
    );
  });
  console.log('='.repeat(80));
}

// Main function
async function manageUserRoles() {
  try {
    await authenticateAdmin();
    
    console.log('🚀 User Role Management Script');
    console.log('================================');
    
    const users = await getAllUsers();
    console.log(`📊 Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('No users found in database');
      return;
    }
    
    displayUsers(users);
    
    // Example: Update a specific user to owner role
    // Uncomment and modify the lines below to change user roles
    
    /*
    // Example: Make the first user an owner
    if (users.length > 0) {
      const firstUser = users[0];
      console.log(`\n🏰 Making ${firstUser.displayName || firstUser.email} an owner...`);
      await updateUserRole(firstUser.id, 'owner');
    }
    
    // Example: Make a specific user admin
    // await updateUserRole('USER_ID_HERE', 'admin');
    
    // Example: Make a specific user moderator
    // await updateUserRole('USER_ID_HERE', 'moderator');
    */
    
    console.log('\n💡 To modify user roles:');
    console.log('1. Uncomment the lines in the script');
    console.log('2. Replace USER_ID_HERE with actual user IDs');
    console.log('3. Run the script again');
    console.log('\nAvailable roles: user, admin, owner, moderator');
    
  } catch (error) {
    console.error('❌ Error in manageUserRoles:', error);
    process.exit(1);
  }
}

// Run the script
manageUserRoles().then(() => {
  console.log('\n✨ Script completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
}); 