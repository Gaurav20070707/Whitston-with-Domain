import {
  collection, doc, getDoc, getDocs, updateDoc, deleteDoc, addDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./config";
import { getIdToken } from "./auth";
import type { CaseDeck } from "@/types";
import type { CaseDeckCategory } from "@/constants/site";

/**
 * FIRESTORE LAYOUT (see firestore.rules for the enforcement side of this)
 * ========================================================================
 * /caseDecks/{deckId} - public read, admin-only write. Everyone (signed in
 *   or not) can browse and open a deck; only an admin can add, edit, or
 *   remove one. That's the whole "view-only for participants, editable for
 *   admins" requirement.
 *
 * FILE STORAGE: Appwrite, not Firebase Storage (Firebase Storage requires a
 * billing account even on its free tier; Appwrite Cloud doesn't). Firestore
 * security rules can't gate an Appwrite write the way they gate a Firestore
 * write, so the actual "only an admin can upload/replace/delete a file"
 * check lives server-side in src/app/api/case-decks/{upload,delete} — this
 * module just calls those routes with the caller's Firebase ID token
 * attached, the same way it always called Firebase Storage directly before.
 */

function fromDoc(id: string, data: Record<string, unknown>): CaseDeck {
  const toMillis = (v: unknown): number =>
    v instanceof Timestamp ? v.toMillis() : typeof v === "number" ? v : Date.now();
  return {
    id,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    category: (data.category as CaseDeck["category"]) ?? "Case Competitions",
    team: (data.team as string | undefined) || undefined,
    thumbnailUrl: String(data.thumbnailUrl ?? ""),
    fileUrl: (data.fileUrl as string | undefined) || undefined,
    appwriteFileId: (data.appwriteFileId as string | undefined) || undefined,
    uploadDate: new Date(toMillis(data.updatedAt ?? data.createdAt)).toISOString().slice(0, 10),
    createdByUid: (data.createdByUid as string | undefined) || undefined,
  };
}

/** Public — no admin check needed, matches firestore.rules `allow read: if true`. */
export async function listCaseDecks(): Promise<CaseDeck[]> {
  const db = getFirebaseFirestore();
  const q = query(collection(db, "caseDecks"), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc(d.id, d.data()));
}

export async function getCaseDeck(id: string): Promise<CaseDeck | null> {
  const snap = await getDoc(doc(getFirebaseFirestore(), "caseDecks", id));
  return snap.exists() ? fromDoc(snap.id, snap.data()) : null;
}

export interface CaseDeckInput {
  title: string;
  description: string;
  category: Exclude<CaseDeckCategory, "All">;
  team?: string;
  thumbnailUrl: string;
  fileUrl?: string;
}

async function authHeader(): Promise<HeadersInit> {
  const token = await getIdToken();
  if (!token) throw new Error("You need to be signed in to do that.");
  return { Authorization: `Bearer ${token}` };
}

export async function createCaseDeck(input: CaseDeckInput, adminUid: string, file?: File | null): Promise<string> {
  const db = getFirebaseFirestore();
  const docRef = await addDoc(collection(db, "caseDecks"), {
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    team: input.team?.trim() || null,
    thumbnailUrl: input.thumbnailUrl.trim(),
    fileUrl: input.fileUrl || null,
    appwriteFileId: null,
    createdByUid: adminUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (file) {
    await attachFile(docRef.id, file);
  }

  return docRef.id;
}

/** Uploads (or replaces) the PDF for an existing deck via the admin-only API
 *  route, then updates the Firestore doc with the resulting Appwrite file
 *  id and public view URL. The route itself deletes the old Appwrite file
 *  when replacing, so there's nothing else to clean up here. */
export async function attachFile(deckId: string, file: File): Promise<void> {
  if (file.type !== "application/pdf") {
    throw new Error("Please upload a PDF file.");
  }

  const MAX_MB = 50; // Appwrite free-plan per-file limit
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(
      `This PDF is ${(file.size / (1024 * 1024)).toFixed(1)}MB, over the ${MAX_MB}MB limit. Compress it (e.g. ilovepdf.com/compress_pdf) and try again.`,
    );
  }



  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("deckId", deckId);

  const res = await fetch("/api/case-decks/upload", {
    method: "POST",
    headers: await authHeader(),
    body: formData,
  });
    const raw = await res.text();
    
  let body: { error?: string; fileId?: string; fileUrl?: string } = {};
  try { body = JSON.parse(raw); } catch { /* non-JSON response */ }
  if (!res.ok) {
    throw new Error(body.error || `Upload failed (server error ${res.status}).`);
  }
  if (!body.fileId || !body.fileUrl) throw new Error("Upload failed: unexpected server response.");
  const { fileId, fileUrl } = body as { fileId: string; fileUrl: string };

  const db = getFirebaseFirestore();
  await updateDoc(doc(db, "caseDecks", deckId), { fileUrl, appwriteFileId: fileId, updatedAt: serverTimestamp() });
}

export async function updateCaseDeck(
  deckId: string,
  patch: Partial<Omit<CaseDeckInput, "fileUrl">>,
): Promise<void> {
  const db = getFirebaseFirestore();
  const clean: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.title !== undefined) clean.title = patch.title.trim();
  if (patch.description !== undefined) clean.description = patch.description.trim();
  if (patch.category !== undefined) clean.category = patch.category;
  if (patch.team !== undefined) clean.team = patch.team.trim() || null;
  if (patch.thumbnailUrl !== undefined) clean.thumbnailUrl = patch.thumbnailUrl.trim();
  await updateDoc(doc(db, "caseDecks", deckId), clean);
}

/** Deletes the Firestore doc, then (if present) its Appwrite file via the
 *  admin-only delete route. Firestore rules require `isAdmin()` for the
 *  first step; the route re-checks admin status for the second. */
export async function deleteCaseDeck(deckId: string): Promise<void> {
  const db = getFirebaseFirestore();
  const existing = await getDoc(doc(db, "caseDecks", deckId));
  const fileId = existing.exists() ? (existing.data().appwriteFileId as string | undefined) : undefined;

  await deleteDoc(doc(db, "caseDecks", deckId));

  if (fileId) {
    try {
      await fetch("/api/case-decks/delete", {
        method: "POST",
        headers: { ...(await authHeader()), "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
    } catch {
      // Firestore doc is already gone either way; an orphaned Appwrite file
      // is a minor cleanup issue, not a reason to fail the whole deletion.
    }
  }
}
