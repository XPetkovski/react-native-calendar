import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';

// 1. Define the shape of our combined state
interface AuthState {
  user: User | null;
  loading: boolean;
}

// 2. The Context type stays similar but uses our new state shape
interface AuthContextType extends AuthState {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 3. Combined State Object
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // onAuthStateChanged is the heavy lifter here
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setAuthState({
        user: currentUser,
        loading: false, // Once we get a response (null or user), we are no longer loading
      });
    });

    return unsubscribe;
  }, []);

  // 4. Performance Finesse: useMemo
  // This prevents the context from re-triggering a render of the entire app
  // unless the user or loading state actually changes.
  const value = useMemo(() => authState, [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Custom Hook Improvement
// Adding a check here ensures that if you try to use useAuth()
// outside of the Provider, the app gives you a helpful error instead of just crashing.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
