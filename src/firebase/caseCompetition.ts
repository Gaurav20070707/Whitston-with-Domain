import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc,
  query, where, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./config";
import { getIdToken } from "./auth";
import type {
  CaseCompetition, CaseSubmission, CaseEvaluation, CompetitionStatus, GameStatus, AppUser,
} from "@/types";

/**
 * FIRESTORE LAYOUT (see firestore.rules for the enforcement side of this)
 * ========================================================================
 * /admins/{uid}                                    - presence marks an admin
 * /gameStatus/{id}                                 - live-status strip entries
 * /competitions/{competitionId}                     - status: DRAFT | LIVE | CLOSED
 * /competitions/{id}/submissions/{uid}              - one doc per participant,
 *   private to its owner and to admins. Never exposes evaluation data.
 * /competitions/{id}/evaluations/{uid}              - one doc per scored
 *   submission, readable by ANY signed-in user. This is deliberately a
 *   separate collection from `submissions`, not a field on it: it lets the
 *   leaderboard (and a participant's own score) be read directly, without
 *   ever granting read access to somebody else's actual submission file.
 */

const toMillis = (v: unknown): number => {
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "number") return v;
  return Date.now();
};

// ------------------------------------------------------------------- admin

export async function checkIsAdmin(uid: string): Promise<boolean> {
  const db = getFirebaseFirestore();
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
}

// ------------------------------------------------------------ game status

export async function listGameStatuses(): Promise<GameStatus[]> {
  const db = getFirebaseFirestore();
  const snap = await getDocs(collection(db, "gameStatus"));
  return snap.docs.map((d) => ({
    id: d.id,
    label: String(d.data().label ?? d.id),
    isLive: Boolean(d.data().isLive),
  }));
}

/** Admin only - enforced by rules. Creates the doc on first use. */
export async function setGameStatus(id: string, label: string, isLive: boolean): Promise<void> {
  const db = getFirebaseFirestore();
  await setDoc(doc(db, "gameStatus", id), { label, isLive }, { merge: true });
}

// ------------------------------------------------------------ competitions

function fromCompetitionDoc(id: string, data: Record<string, unknown>): CaseCompetition {
  return {
    id,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    instructions: String(data.instructions ?? ""),
    status: (data.status as CompetitionStatus) ?? "DRAFT",
    createdByUid: String(data.createdByUid ?? ""),
    createdAt: toMillis(data.createdAt),
    deadline: data.deadline ? toMillis(data.deadline) : null,
  };
}

/**
 * Participants only ever see LIVE and CLOSED competitions (a CLOSED one
 * stays visible so its final leaderboard remains reachable). Admins see
 * everything, including DRAFTs they haven't published yet.
 */
export async function listCompetitions(opts: { isAdmin: boolean }): Promise<CaseCompetition[]> {
  const db = getFirebaseFirestore();
  const base = collection(db, "competitions");
  const q = opts.isAdmin
    ? query(base, orderBy("createdAt", "desc"))
    : query(base, where("status", "in", ["LIVE", "CLOSED"]), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromCompetitionDoc(d.id, d.data()));
}

export async function getCompetition(id: string): Promise<CaseCompetition | null> {
  const db = getFirebaseFirestore();
  const snap = await getDoc(doc(db, "competitions", id));
  if (!snap.exists()) return null;
  return fromCompetitionDoc(snap.id, snap.data());
}

export interface CreateCompetitionInput {
  title: string;
  description: string;
  instructions: string;
  status: CompetitionStatus;
  deadline?: Date | null;
}

/** Admin only - enforced by Firestore rules. */
export async function createCompetition(input: CreateCompetitionInput, adminUid: string): Promise<string> {
  const db = getFirebaseFirestore();
  const docRef = await addDoc(collection(db, "competitions"), {
    title: input.title.trim(),
    description: input.description.trim(),
    instructions: input.instructions.trim(),
    status: input.status,
    createdByUid: adminUid,
    createdAt: serverTimestamp(),
    deadline: input.deadline ?? null,
  });
  return docRef.id;
}

export async function setCompetitionStatus(id: string, status: CompetitionStatus): Promise<void> {
  const db = getFirebaseFirestore();
  await updateDoc(doc(db, "competitions", id), { status });
}

// ------------------------------------------------------------- submissions

const MAX_PDF_BYTES = 25 * 1024 * 1024; // matches the cap in api/case-competition/submit/route.ts

export class SubmissionError extends Error {}

function submissionPath(competitionId: string, uid: string) {
  return ["competitions", competitionId, "submissions", uid] as const;
}

function fromSubmissionDoc(competitionId: string, id: string, data: Record<string, unknown>): CaseSubmission {
  return {
    id,
    competitionId,
    teamName: String(data.teamName ?? ""),
    submitterUid: String(data.submitterUid ?? ""),
    submitterEmail: (data.submitterEmail as string | null) ?? null,
    submitterName: (data.submitterName as string | null) ?? null,
    fileUrl: String(data.fileUrl ?? ""),
    appwriteFileId: String(data.appwriteFileId ?? ""),
    submittedAt: toMillis(data.submittedAt),
  };
}

/** A participant's own submission, or null if they haven't submitted yet. */
export async function getMySubmission(competitionId: string, uid: string): Promise<CaseSubmission | null> {
  const db = getFirebaseFirestore();
  const snap = await getDoc(doc(db, ...submissionPath(competitionId, uid)));
  if (!snap.exists()) return null;
  return fromSubmissionDoc(competitionId, snap.id, snap.data());
}

/** Admin only - enforced by rules (a participant can only read their own). */
export async function listSubmissions(competitionId: string): Promise<CaseSubmission[]> {
  const db = getFirebaseFirestore();
  const snap = await getDocs(collection(db, "competitions", competitionId, "submissions"));
  return snap.docs.map((d) => fromSubmissionDoc(competitionId, d.id, d.data()));
}

/**
 * Uploads the PDF via the /api/case-competition/submit route (which
 * verifies the caller's Firebase ID token and re-checks the competition is
 * LIVE server-side — see that route for why Appwrite needs this instead of
 * a Firestore/Storage security rule), then writes the submission doc.
 * Client-side type and size checks here are for a fast, friendly error
 * only; the route re-checks both, since a client check alone isn't
 * enforcement.
 */
export async function submitCaseDeck(
  competitionId: string,
  teamName: string,
  file: File,
  user: AppUser,
): Promise<CaseSubmission> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new SubmissionError("Only PDF files are accepted.");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new SubmissionError(`That file is too large. The limit is ${MAX_PDF_BYTES / (1024 * 1024)}MB.`);
  }
  if (!teamName.trim()) {
    throw new SubmissionError("Enter a team name before submitting.");
  }

  const token = await getIdToken();
  if (!token) throw new SubmissionError("You need to be signed in to submit.");

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("competitionId", competitionId);

  const res = await fetch("/api/case-competition/submit", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new SubmissionError(body.error || "Upload failed.");
  }
  const { fileId, fileUrl } = (await res.json()) as { fileId: string; fileUrl: string };

  const db = getFirebaseFirestore();
  const submissionRef = doc(db, ...submissionPath(competitionId, user.uid));
  await setDoc(submissionRef, {
    teamName: teamName.trim(),
    submitterUid: user.uid,
    submitterEmail: user.email,
    submitterName: user.displayName,
    fileUrl,
    appwriteFileId: fileId,
    submittedAt: serverTimestamp(),
  });

  const snap = await getDoc(submissionRef);
  return fromSubmissionDoc(competitionId, user.uid, snap.data()!);
}

/** Replaces a prior submission's file (re-submission while still LIVE). The
 *  upload route deletes the old Appwrite file itself once it sees a
 *  submission already exists for this uid+competition, so this is just a
 *  thin alias — kept as a separate export because callers already
 *  distinguish "first submission" from "replace" in their UI copy. */
export async function replaceCaseDeck(
  competitionId: string,
  file: File,
  user: AppUser,
  previous: CaseSubmission,
): Promise<CaseSubmission> {
  return submitCaseDeck(competitionId, previous.teamName, file, user);
}

// -------------------------------------------------------------- evaluation

export interface EvaluationInput {
  problemUnderstanding: number;
  innovation: number;
  strategy: number;
  feasibility: number;
  presentation: number;
}

const clampScore = (n: number) => Math.max(0, Math.min(20, Math.round(n)));

function fromEvaluationDoc(id: string, data: Record<string, unknown>): CaseEvaluation {
  return {
    id,
    teamName: String(data.teamName ?? ""),
    problemUnderstanding: Number(data.problemUnderstanding ?? 0),
    innovation: Number(data.innovation ?? 0),
    strategy: Number(data.strategy ?? 0),
    feasibility: Number(data.feasibility ?? 0),
    presentation: Number(data.presentation ?? 0),
    total: Number(data.total ?? 0),
    evaluatedAt: toMillis(data.evaluatedAt),
    evaluatedByUid: String(data.evaluatedByUid ?? ""),
  };
}

/** Readable by any signed-in user - a participant reads their own this way. */
export async function getEvaluation(competitionId: string, submissionUid: string): Promise<CaseEvaluation | null> {
  const db = getFirebaseFirestore();
  const snap = await getDoc(doc(db, "competitions", competitionId, "evaluations", submissionUid));
  if (!snap.exists()) return null;
  return fromEvaluationDoc(snap.id, snap.data());
}

/** The full leaderboard: every evaluation for a competition, ranked. Ties
 *  share a rank (1, 2, 2, 4 - not 1, 2, 2, 3), the standard reading for a
 *  judged score rather than a race. */
export async function getLeaderboard(competitionId: string): Promise<(CaseEvaluation & { rank: number })[]> {
  const db = getFirebaseFirestore();
  const snap = await getDocs(collection(db, "competitions", competitionId, "evaluations"));
  const rows = snap.docs.map((d) => fromEvaluationDoc(d.id, d.data())).sort((a, b) => b.total - a.total);

  let rank = 0;
  let lastTotal: number | null = null;
  return rows.map((row, i) => {
    if (lastTotal === null || row.total !== lastTotal) rank = i + 1;
    lastTotal = row.total;
    return { ...row, rank };
  });
}

/**
 * Admin only - enforced by rules. Writes (or overwrites) the evaluation doc
 * for one submission. `teamName` is denormalized onto the evaluation itself
 * so the leaderboard never needs read access to the private submissions
 * collection to display who scored what.
 */
export async function evaluateSubmission(
  competitionId: string,
  submission: CaseSubmission,
  scores: EvaluationInput,
  adminUid: string,
): Promise<void> {
  const db = getFirebaseFirestore();
  const total =
    clampScore(scores.problemUnderstanding) +
    clampScore(scores.innovation) +
    clampScore(scores.strategy) +
    clampScore(scores.feasibility) +
    clampScore(scores.presentation);

  await setDoc(doc(db, "competitions", competitionId, "evaluations", submission.submitterUid), {
    teamName: submission.teamName,
    problemUnderstanding: clampScore(scores.problemUnderstanding),
    innovation: clampScore(scores.innovation),
    strategy: clampScore(scores.strategy),
    feasibility: clampScore(scores.feasibility),
    presentation: clampScore(scores.presentation),
    total,
    evaluatedAt: serverTimestamp(),
    evaluatedByUid: adminUid,
  });
}
