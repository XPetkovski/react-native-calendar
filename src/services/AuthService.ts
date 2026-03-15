// src/services/AuthService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase.ts';

class AuthService {
  // Sign Up
  async register(email: string, pass: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass,
    );
    return userCredential.user;
  }

  // Sign In
  async login(email: string, pass: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  }

  // Sign Out
  async logout(): Promise<void> {
    await signOut(auth);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export default new AuthService(); // Export as a singleton
