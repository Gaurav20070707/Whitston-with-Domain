import { NextResponse } from "next/server";
import { verifyIdToken, isAdminUid, getCaseDeckFileId } from "@/lib/firebaseAdmin";
import { uploadPdf, deletePdf, BUCKETS } from "@/lib/appwrite";

export const runtime = "nodejs";

/**
 * POST /api/case-decks/upload
 * Body: multipart/form-data { file: Blob, deckId: string }
 * Header: Authorization: Bearer <firebase-id-token>
 *
 * This is the actual permission boundary for "admin-editable" case decks,
 * now that the file bytes live in Appwrite rather than Firebase Storage —
 * firestore.rules can no longer be the enforcement layer for the file
 * itself (only for the Firestore document describing it), so this route is
 * where "is this caller an admin" gets checked before anything is written.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) return NextResponse.json({ error: "Missing Authorization header." }, { status: 401 });

  let uid: string;
  try {
    uid = await verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid or expired sign-in. Please refresh and try again." }, { status: 401 });
  }

  if (!(await isAdminUid(uid))) {
    return NextResponse.json({ error: "Case deck uploads are limited to admins." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const deckId = formData.get("deckId");
  if (!(file instanceof Blob) || typeof deckId !== "string" || !deckId) {
    return NextResponse.json({ error: "Missing file or deckId." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }
  const MAX_BYTES = 75 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File is too large. The limit is ${MAX_BYTES / (1024 * 1024)}MB.` }, { status: 400 });
  }

  const bucketId = BUCKETS.caseDecks();
  const previousFileId = await getCaseDeckFileId(deckId);

  const fileName = (file as File).name ?? `${deckId}.pdf`;
  const { fileId, fileUrl } = await uploadPdf(bucketId, file, fileName);

  if (previousFileId && previousFileId !== fileId) {
    await deletePdf(bucketId, previousFileId);
  }

  return NextResponse.json({ fileId, fileUrl });
}
