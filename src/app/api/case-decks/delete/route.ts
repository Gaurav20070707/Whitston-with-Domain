import { NextResponse } from "next/server";
import { verifyIdToken, isAdminUid } from "@/lib/firebaseAdmin";
import { deletePdf, BUCKETS } from "@/lib/appwrite";

export const runtime = "nodejs";

/**
 * POST /api/case-decks/delete
 * Body (JSON): { fileId: string }
 * Header: Authorization: Bearer <firebase-id-token>
 *
 * The caller passes the fileId it already has from Firestore (rather than
 * this route looking it up by deckId) because deleting a deck's Firestore
 * doc and deleting its file are two separate client calls — see
 * firebase/caseDecks.ts. Either way, only an admin can reach this: the
 * fileId alone isn't a capability, this route re-checks admin status
 * itself regardless of what's passed in.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) return NextResponse.json({ error: "Missing Authorization header." }, { status: 401 });

  let uid: string;
  try {
    uid = await verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid or expired sign-in." }, { status: 401 });
  }

  if (!(await isAdminUid(uid))) {
    return NextResponse.json({ error: "Case deck deletion is limited to admins." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const fileId = body?.fileId;
  if (typeof fileId !== "string" || !fileId) {
    return NextResponse.json({ error: "Missing fileId." }, { status: 400 });
  }

  await deletePdf(BUCKETS.caseDecks(), fileId);
  return NextResponse.json({ ok: true });
}
