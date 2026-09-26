import { NextResponse } from "next/server";
import { verifyIdToken, getCompetitionStatus, getSubmissionFileId } from "@/lib/firebaseAdmin";
import { uploadPdf, deletePdf, BUCKETS } from "@/lib/appwrite";

export const runtime = "nodejs";

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

  const formData = await request.formData();
  const file = formData.get("file");
  const competitionId = formData.get("competitionId");
  if (!(file instanceof Blob) || typeof competitionId !== "string" || !competitionId) {
    return NextResponse.json({ error: "Missing file or competitionId." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }
  const MAX_BYTES = 25 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File is too large. The limit is ${MAX_BYTES / (1024 * 1024)}MB.` }, { status: 400 });
  }

  const status = await getCompetitionStatus(competitionId);
  if (status !== "LIVE") {
    return NextResponse.json({ error: "This competition isn't accepting submissions right now." }, { status: 403 });
  }

  const bucketId = BUCKETS.submissions();
  const previousFileId = await getSubmissionFileId(competitionId, uid);

  const { fileId, fileUrl } = await uploadPdf(bucketId, file, `${uid}.pdf`);

  if (previousFileId && previousFileId !== fileId) {
    await deletePdf(bucketId, previousFileId);
  }

  return NextResponse.json({ fileId, fileUrl, uid });
}
