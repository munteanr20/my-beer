import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('useAuth: Auth state changed, user:', user);
      
      if (user) {
        const authUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        console.log('useAuth: Setting authenticated user:', authUser);
        setUser(authUser);
      } else {
        console.log('useAuth: No user authenticated');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('useAuth: Attempting login with email:', email);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('useAuth: Login successful:', userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('useAuth: Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string) => {
    console.log('useAuth: Attempting signup with email:', email);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('useAuth: Signup successful:', userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('useAuth: Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    console.log('useAuth: Attempting Google login');
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log('useAuth: Google login successful:', userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('useAuth: Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    console.log('useAuth: Attempting logout');
    
    try {
      await signOut(auth);
      console.log('useAuth: Logout successful');
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