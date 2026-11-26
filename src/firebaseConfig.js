import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBksyKxIIMZj_HgTi3KGDWovamjnrEglNw",
  authDomain: "orbitalwatch-e2621.firebaseapp.com",
  projectId: "orbitalwatch-e2621",
  storageBucket: "orbitalwatch-e2621.firebasestorage.app",
  messagingSenderId: "585439065674",
  appId: "1:585439065674:web:318e45d1ff9c3e501c58b3",
  measurementId: "G-XY04G77DS7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);