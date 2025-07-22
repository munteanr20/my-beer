import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from '../services/userService';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role?: 'user' | 'admin' | 'owner' | 'moderator';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        const authUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          displayNameLower: user.displayName ? user.displayName.toLowerCase() : null,
          photoURL: user.photoURL
        };
        setUser(authUser);
        
        // Create or update user document in Firestore
        try {
          const result = await userService.createOrUpdateUser(authUser);
          if (result.success) {
            
            // Load user data including role from Firestore
            const userData = await userService.getUser(user.uid);
            if (userData) {
              const userWithRole = {
                ...authUser,
                role: userData.role
              };
              setUser(userWithRole);
            }
          } else {
            console.error('useAuth: Failed to create/update user document:', result.error);
          }
        } catch (error) {
          console.error('useAuth: Error creating/updating user document:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('useAuth: Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string) => {
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('useAuth: Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('useAuth: Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout
  };
}; 