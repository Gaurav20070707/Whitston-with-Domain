import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase configuration, sourced entirely from environment variables so no
 * keys are ever committed to source control. See `.env.local.example` for
 * the full list of variables this project expects.
 *
 * Note: file storage (case decks, competition submissions) uses Appwrite,
 * not Firebase Storage — see src/lib/appwrite.ts for why. Firebase here is
 * only Auth + Firestore.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase once. Next.js can re-evaluate modules in dev (fast
 * refresh) and in serverless/edge contexts, so we guard against duplicate
 * app initialization using `getApps()`.
 */
function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

/**
 * Lazily-created singleton Auth instance. Firebase Auth relies on browser
 * APIs (IndexedDB, etc.), so this must only ever be called client-side.
 */
let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("getFirebaseAuth() must only be called on the client.");
  }
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

/**
 * Firestore powers the Case Competition and Case Decks features
 * (competitions, submissions, evaluations, deck metadata, admin allowlist,
 * live-status flags) — see src/firebase/caseCompetition.ts and
 * src/firebase/caseDecks.ts. Firestore Security Rules (/firestore.rules)
 * are the enforcement layer for all of that data. Same lazy-singleton,
 * client-only pattern as Auth above.
 */
let firestoreInstance: Firestore | null = null;

export function getFirebaseFirestore(): Firestore {
  if (typeof window === "undefined") {
    throw new Error("getFirebaseFirestore() must only be called on the client.");
  }
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }
  return firestoreInstance;
}

export const firebaseApp = typeof window !== "undefined" ? getFirebaseApp() : undefined;
