// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwRWCkdMNhKDXFMs5he0fyOG6u5GGJ8ho",
  authDomain: "wordify-73492.firebaseapp.com",
  projectId: "wordify-73492",
  storageBucket: "wordify-73492.firebasestorage.app",
  messagingSenderId: "171626099549",
  appId: "1:171626099549:web:d7e271e48e6ea3100f2eb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;