import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";
import type { AppUser } from "@/types";

const googleProvider = new GoogleAuthProvider();
// Always show the account chooser instead of silently reusing the last session.
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Maps the full Firebase `User` down to the small shape the UI needs. */
export function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}

/**
 * Opens the Google Sign-In popup. Firebase's `browserLocalPersistence` is
 * the default, so the resulting session survives page refreshes automatically.
 */
export async function signInWithGoogle(): Promise<AppUser> {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);
  return toAppUser(result.user);
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/**
 * A fresh Firebase ID token for the signed-in user, or null if nobody's
 * signed in. Used to authenticate calls to the app's own API routes (see
 * src/app/api/) — those routes verify this token server-side to decide
 * whether the caller may upload/delete a file in Appwrite Storage.
 * `getIdToken()` auto-refreshes if the cached token is close to expiry, so
 * this is safe to call right before every upload rather than caching it.
 */
export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  return auth.currentUser ? auth.currentUser.getIdToken() : null;
}

/** Subscribes to auth state changes; returns the unsubscribe function. */
export function subscribeToAuthChanges(
  callback: (user: AppUser | null) => void
): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAppUser(user) : null);
  });
}
