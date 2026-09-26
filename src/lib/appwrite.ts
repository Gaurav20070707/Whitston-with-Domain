import { Client, Storage, Permission, Role, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";;

/**
 * Server-only. Holds the Appwrite API key, which grants full write access to
 * the storage bucket below — it must never reach the browser. This is the
 * whole reason file uploads/deletes go through the two API routes in
 * src/app/api/ instead of a client-side Appwrite SDK call: an API key can't
 * be scoped the way a Firestore security rule can, so the only safe place
 * for it is a server environment variable, used only in server code.
 *
 * ONE bucket (APPWRITE_BUCKET_ID) holds both case decks and competition
 * submissions — Appwrite's free tier caps you at one bucket, but that's no
 * real limitation here: every file gets a random, globally-unique id
 * (ID.unique()) regardless of which "kind" of file it is, so there's no
 * naming collision between the two, and which Firestore doc a file belongs
 * to is tracked in Firestore either way, not by which bucket it sits in.
 * Create it in the Appwrite console with permissions "Read: Any" — writes
 * only ever happen through these server routes using the API key, which
 * bypasses bucket-level permissions entirely.
 */
function getClient(): Client {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_APPWRITE_ENDPOINT / NEXT_PUBLIC_APPWRITE_PROJECT_ID / APPWRITE_API_KEY. " +
      "See .env.local.example and the Appwrite setup section in README.md.",
    );
  }

  return new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
}

/** Builds the public view URL for a file in a public-read bucket. Appwrite
 *  serves this directly over HTTP with no auth needed, same as a Firebase
 *  Storage download URL — this is a plain string, not an API call. */
export function buildFileViewUrl(bucketId: string, fileId: string): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

export async function uploadPdf(bucketId: string, file: Blob, fileName: string): Promise<{ fileId: string; fileUrl: string }> {
  const storage = new Storage(getClient());
  const buffer = Buffer.from(await file.arrayBuffer());
  const input = InputFile.fromBuffer(buffer, fileName);
  const created = await storage.createFile(bucketId, ID.unique(), input, [Permission.read(Role.any())]);
  return { fileId: created.$id, fileUrl: buildFileViewUrl(bucketId, created.$id) };
}

export async function deletePdf(bucketId: string, fileId: string): Promise<void> {
  const storage = new Storage(getClient());
  try {
    await storage.deleteFile(bucketId, fileId);
  } catch {
    // Already gone, or never existed - fine either way, this is best-effort cleanup.
  }
}

export const BUCKETS = {
  caseDecks: () => requireEnv("APPWRITE_BUCKET_ID"),
  submissions: () => requireEnv("APPWRITE_BUCKET_ID"),
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. See .env.local.example.`);
  return v;
}
