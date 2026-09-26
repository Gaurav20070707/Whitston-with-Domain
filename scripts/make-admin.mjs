#!/usr/bin/env node
/**
 * One-time bootstrap: grants case-competition admin access to a Firebase
 * user by creating a document at /admins/{uid}. Firestore rules deny this
 * write from any client (see firestore.rules), so it can only be done from
 * a trusted context like this script — run locally, never in the browser.
 *
 * Usage:
 *   1. Firebase console -> Project settings -> Service accounts ->
 *      "Generate new private key". Save the JSON somewhere OUTSIDE the repo.
 *   2. GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/make-admin.mjs <uid-or-email>
 *
 * Finding a uid: Firebase console -> Authentication -> Users tab, or pass
 * an email instead and this script will look the uid up for you.
 */
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/make-admin.mjs <uid-or-email>");
  process.exit(1);
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
initializeApp({
  credential: keyPath ? cert(JSON.parse(readFileSync(keyPath, "utf8"))) : applicationDefault(),
});

const auth = getAuth();
const db = getFirestore();

async function main() {
  const uid = target.includes("@") ? (await auth.getUserByEmail(target)).uid : target;
  await db.doc(`admins/${uid}`).set({ grantedAt: new Date().toISOString(), source: target });
  console.log(`Granted case-competition admin access to uid ${uid}.`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
