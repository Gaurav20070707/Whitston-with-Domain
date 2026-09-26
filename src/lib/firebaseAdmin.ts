import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Server-only. Never import this from a client component or from anything
 * under src/firebase/ (that folder is the browser-side Firebase SDK).
 *
 * WHY THIS EXISTS
 * ================
 * Once file storage moved from Firebase Storage to Appwrite (see
 * src/lib/appwrite.ts), the two upload API routes became the only place
 * left that can enforce "is this caller an admin" / "is this caller who
 * they claim to be" for a file write — Appwrite has no idea what a Firebase
 * uid or an /admins/{uid} Firestore doc is. This module lets those routes
 * verify a Firebase ID token and read Firestore with full admin
 * privileges (bypassing firestore.rules, which is fine — this only ever
 * runs server-side, never reachable from the browser).
 */
function getAdminApp(): App {
  if (getApps().length) return getApps()[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel/most hosts mangle literal newlines in env vars; they're stored
  // escaped as \n and need to be turned back into real newlines here.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY. " +
      "These come from a service account key (Firebase console -> Project settings -> " +
      "Service accounts -> Generate new private key) and are separate from the " +
      "NEXT_PUBLIC_FIREBASE_* client config. See .env.local.example.",
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

/** Verifies a Firebase ID token (from an `Authorization: Bearer <token>`
 *  header) and returns the caller's uid, or throws. */
export async function verifyIdToken(idToken: string): Promise<string> {
  const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
  return decoded.uid;
}

export async function isAdminUid(uid: string): Promise<boolean> {
  const snap = await getFirestore(getAdminApp()).doc(`admins/${uid}`).get();
  return snap.exists;
}

export async function getCompetitionStatus(competitionId: string): Promise<string | null> {
  const snap = await getFirestore(getAdminApp()).doc(`competitions/${competitionId}`).get();
  return snap.exists ? ((snap.data()?.status as string) ?? null) : null;
}

export async function getSubmissionFileId(competitionId: string, uid: string): Promise<string | null> {
  const snap = await getFirestore(getAdminApp()).doc(`competitions/${competitionId}/submissions/${uid}`).get();
  return snap.exists ? ((snap.data()?.appwriteFileId as string) ?? null) : null;
}

export async function getCaseDeckFileId(deckId: string): Promise<string | null> {
  const snap = await getFirestore(getAdminApp()).doc(`caseDecks/${deckId}`).get();
  return snap.exists ? ((snap.data()?.appwriteFileId as string) ?? null) : null;
}
