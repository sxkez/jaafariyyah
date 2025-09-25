// src/lib/firebase.ts
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: Partial<FirebaseOptions> = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

const initializeFirebaseApp = (): FirebaseApp | null => {
  if (!hasFirebaseConfig) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Firebase configuration is missing. Auth and database features are disabled."
      );
    }
    return null;
  }

  if (getApps().length) {
    return getApp();
  }

  return initializeApp(firebaseConfig as FirebaseOptions);
};

const app = initializeFirebaseApp();

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const analytics =
  app && typeof window !== "undefined" ? getAnalytics(app) : null;
export const isFirebaseConfigured = hasFirebaseConfig;
