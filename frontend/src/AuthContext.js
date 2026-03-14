import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Google or Firebase user
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Farmer',
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || null,
          provider: firebaseUser.providerData[0]?.providerId || 'email',
        });
        setLoading(false);
      } else {
        // Check localStorage for email/password login
        const localUser = localStorage.getItem('bharatpath_user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('bharatpath_user');
    setUser(null);
  };

  const loginWithEmail = (userData) => {
    localStorage.setItem('bharatpath_user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, logout, setUser, loading, loginWithEmail }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}