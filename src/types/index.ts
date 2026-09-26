import type { CaseDeckCategory } from "@/constants/site";

/**
 * A single case deck entry. Designed so uploading real content later only
 * means swapping `thumbnailUrl` / `fileUrl` for real asset paths — the shape
 * itself doesn't need to change.
 */
export interface CaseDeck {
  id: string;
  title: string;
  description: string;
  category: Exclude<CaseDeckCategory, "All">;
  thumbnailUrl: string;
  /** Team or author credit, shown on the card. */
  team?: string;
  /**
   * Link to the actual PDF. Either a static asset under /public/case-decks
   * or an Appwrite Storage view URL (see appwriteFileId) — either way it's
   * read-only from the visitor's side: viewed in the browser's own PDF
   * viewer, never editable in place. Left undefined for a deck whose file
   * hasn't been uploaded yet — the card shows a pending state instead of a
   * broken link.
   */
  fileUrl?: string;
  /** Present only when the file was uploaded through the admin page (as
   *  opposed to being a static asset) — the Appwrite Storage file id, used
   *  so a replace/delete can clean up the old object. */
  appwriteFileId?: string;
  uploadDate: string; // ISO date string, e.g. "2026-01-15"
  gradeLevel?: string;
  estimatedMinutes?: number;
  /** uid of the admin who created/last edited this deck, when known. */
  createdByUid?: string;
}

/** Minimal, serializable slice of the Firebase user we care about in the UI. */
export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// ============================================================================
// CASE COMPETITION
// ============================================================================

export type CompetitionStatus = "DRAFT" | "LIVE" | "CLOSED";

export interface CaseCompetition {
  id: string;
  title: string;
  description: string;
  instructions: string;
  status: CompetitionStatus;
  createdByUid: string;
  createdAt: number; // epoch ms
  deadline: number | null; // epoch ms, or null for no deadline
}

export interface CaseSubmission {
  /** Same as the submitter's uid — one submission per person per competition,
   *  and structural isolation (see firestore.rules) rather than a rule the
   *  UI has to enforce. */
  id: string;
  competitionId: string;
  teamName: string;
  submitterUid: string;
  submitterEmail: string | null;
  submitterName: string | null;
  fileUrl: string;
  appwriteFileId: string;
  submittedAt: number;
}

/** Judging rubric. Every score is 0–20; `total` is their sum (0–100). */
export interface CaseEvaluation {
  /** Same id as the submission it scores (the submitter's uid). */
  id: string;
  teamName: string;
  problemUnderstanding: number;
  innovation: number;
  strategy: number;
  feasibility: number;
  presentation: number;
  total: number;
  evaluatedAt: number; // epoch ms
  evaluatedByUid: string;
}

export interface LeaderboardRow extends CaseEvaluation {
  rank: number;
}

/** One doc per tracked game/competition, powering the live-status strip. */
export interface GameStatus {
  id: string;
  label: string;
  isLive: boolean;
}
