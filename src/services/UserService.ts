import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase.ts';

export interface UserProfile {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
}

class UserService {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }

  async createUserProfile(uid: string, data: UserProfile) {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data); // setDoc creates the document
  }

  async updateUserProfile(uid: string, data: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data); // updateDoc only changes the provided fields
  }

  async deleteUserProfile(uid: string) {
    const docRef = doc(db, 'users', uid);
    await deleteDoc(docRef);
  }

  subscribeToUserProfile(
    uid: string,
    callback: (profile: UserProfile | null) => void,
  ) {
    const docRef = doc(db, 'users', uid);

    // onSnapshot listens for live changes to this specific user's document
    return onSnapshot(docRef, docSnap => {
      if (docSnap.exists()) {
        callback(docSnap.data() as UserProfile);
      } else {
        callback(null);
      }
    });
  }
}

export default new UserService();
