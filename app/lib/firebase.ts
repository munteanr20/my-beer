import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBqZR44yMUBVzTYe3rKWpdx212h4oNZeFU",
  authDomain: "my-beer-44ecc.firebaseapp.com",
  projectId: "my-beer-44ecc",
  storageBucket: "my-beer-44ecc.firebasestorage.app",
  messagingSenderId: "246118157347",
  appId: "1:246118157347:web:c9a8f4bf41222dcbd67596",
  measurementId: "G-05CNGKK6TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional, for production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 