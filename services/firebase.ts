import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 1. Robust Environment Variable Loader
// Checks import.meta.env (Vite Standard) -> process.env (Node/Webpack Standard)
const getEnvVar = (key: string): string | undefined => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return undefined;
};

// 2. Configuration Object
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

// Singleton instances
let db: any = null;
let auth: any = null;

// 3. Initialization Logic
try {
  // Validate that critical keys exist
  if (firebaseConfig.apiKey && firebaseConfig.appId) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 Firebase initialized successfully:", firebaseConfig.projectId);
  } else {
    console.warn("⚠️ Firebase keys missing. Please check your .env file or Vercel Environment Variables.");
    console.log("Debug Info (Missing Keys):", Object.keys(firebaseConfig).filter(k => !firebaseConfig[k as keyof typeof firebaseConfig]));
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { db, auth, doc, getDoc, setDoc };