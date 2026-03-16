import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCP9ESgRHUYr7XKY0vxqZ4yEGI_RCLBAFU',
  authDomain: 'quipuapp-1bc33.firebaseapp.com',
  projectId: 'quipuapp-1bc33',
  storageBucket: 'quipuapp-1bc33.firebasestorage.app',
  messagingSenderId: '806915953361',
  appId: '1:806915953361:web:0179b079d34bf9289e6bf0',
  measurementId: 'G-E9X7M6PMTC',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
