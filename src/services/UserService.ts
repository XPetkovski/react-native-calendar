import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.ts';

export interface UserProfile {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
}

class UserService {
  // 1. Fetch the profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null; // Profile doesn't exist yet!
  }

  // 2. Create the profile (Used in the Onboarding Modal)
  async createUserProfile(uid: string, data: UserProfile) {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, data); // setDoc creates the document
  }

  // 3. Update the profile (Used in the Profile Screen)
  async updateUserProfile(uid: string, data: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data); // updateDoc only changes the provided fields
  }

  async deleteUserProfile(uid: string) {
    const docRef = doc(db, 'users', uid);
    await deleteDoc(docRef);
  }
}

export default new UserService();
