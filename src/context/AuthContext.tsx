import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // onAuthStateChanged is the heavy lifter here
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setAuthState({
        user: currentUser,
        loading: false,
      });
    });

    return unsubscribe;
  }, []);

  // This prevents the context from re-triggering a render of the entire app
  // unless the user or loading state actually changes.
  const value = useMemo(() => authState, [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Adding a check here ensures that if you try to use useAuth()
// outside of the Provider, the app gives you a helpful error instead of just crashing.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
