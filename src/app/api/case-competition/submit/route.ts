import { NextResponse } from "next/server";
import { verifyIdToken, getCompetitionStatus, getSubmissionFileId } from "@/lib/firebaseAdmin";
import { uploadPdf, deletePdf, BUCKETS } from "@/lib/appwrite";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024;

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/**
 * POST /api/case-competition/submit
 * Body: multipart/form-data { file: Blob, competitionId: string }
 * Header: Authorization: Bearer <firebase-id-token>
 *
 * There is no "which team's slot" parameter here on purpose — the uid comes
 * only from the verified token, never from the request body, so a
 * participant structurally cannot upload into anyone else's submission no
 * matter what the client sends. The competition-must-be-LIVE check mirrors
 * firestore.rules' identical check for the Firestore submission doc; this
 * route enforces it again for the file itself, since Appwrite has no
 * equivalent of a Firestore security rule to do it for us.
 *
 * Every failure path returns JSON ({ error }) — never an HTML error page —
 * so the browser can always show the participant a real message.
 */
export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (err) {
    console.error("[case-competition/submit] failure:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("Missing ")) {
      return NextResponse.json({ error: `Server not configured: ${msg}` }, { status: 500 });
    }
    return NextResponse.json({ error: `Storage error: ${msg || "the file couldn't be saved."}` }, { status: 502 });
  }
}

async function handle(request: Request)  {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) return fail("Missing Authorization header.", 401);

    let uid: string;
    try {
      uid = await verifyIdToken(idToken);
    } catch (err) {
      // Distinguish "bad token" from "server has no Firebase Admin creds".
      const msg = err instanceof Error ? err.message : "";
      if (msg.startsWith("Missing FIREBASE_")) {
        console.error("[submit] Firebase Admin env vars missing:", msg);
        return fail("Submissions aren't configured on the server yet (Firebase Admin credentials missing).", 500);
      }
      console.error("[submit] verifyIdToken failed:", err);
      return fail("Invalid or expired sign-in. Please refresh and try again.", 401);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return fail("Couldn't read the upload. The file may be too large for the server — try a smaller PDF.", 400);
    }

    const file = formData.get("file");
    const competitionId = formData.get("competitionId");
    if (!(file instanceof Blob) || typeof competitionId !== "string" || !competitionId) {
      return fail("Missing file or competitionId.", 400);
    }
    if (file.size === 0) return fail("That file is empty.", 400);
    if (file.size > MAX_BYTES) {
      return fail(`File is too large. The limit is ${MAX_BYTES / (1024 * 1024)}MB.`, 400);
    }

    // Don't trust file.type: some browsers/OSes send "" or
    // "application/octet-stream" for a perfectly valid PDF. Check the actual
    // bytes instead — every PDF starts with "%PDF-".
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    const magic = String.fromCharCode(...head);
    if (magic !== "%PDF-") return fail("Only PDF files are accepted.", 400);

    const status = await getCompetitionStatus(competitionId);
    if (status !== "LIVE") {
      return fail("This competition isn't accepting submissions right now.", 403);
    }

    const bucketId = BUCKETS.submissions();
    const previousFileId = await getSubmissionFileId(competitionId, uid);

    const { fileId, fileUrl } = await uploadPdf(bucketId, file, `${uid}.pdf`);

    if (previousFileId && previousFileId !== fileId) {
      await deletePdf(bucketId, previousFileId);
    }

    return NextResponse.json({ fileId, fileUrl, uid });
  } catch (err) {
    console.error("[submit] unexpected failure:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("Missing ")) {
      // e.g. APPWRITE_SUBMISSIONS_BUCKET_ID / APPWRITE_API_KEY not set on the host.
      return fail(`Submissions aren't configured on the server yet. ${msg}`, 500);
    }
    // Appwrite SDK errors carry a human-readable message (bad key scope,
    // bucket not found, file larger than the bucket's max size, ...).
    return fail(`Storage error: ${msg || "the file couldn't be saved."}`, 502);
  }
}
