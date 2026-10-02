"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Trophy, UploadCloud, FileText, RefreshCcw } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  getCompetition, getMySubmission, submitCaseDeck, replaceCaseDeck, SubmissionError,
  getEvaluation, getLeaderboard,
} from "@/firebase/caseCompetition";
import type { CaseCompetition, CaseSubmission, CaseEvaluation } from "@/types";

export default function CaseCompetitionDetailPage() {
  const params = useParams<{ id: string }>();
  const competitionId = params.id;
  const { user, signIn } = useAuth();
  const { isAdmin } = useIsAdmin();

  const [competition, setCompetition] = useState<CaseCompetition | null | "loading">("loading");
  const [submission, setSubmission] = useState<CaseSubmission | null>(null);
  const [myEvaluation, setMyEvaluation] = useState<CaseEvaluation | null>(null);
  const [leaderboard, setLeaderboard] = useState<(CaseEvaluation & { rank: number })[]>([]);
  const [teamName, setTeamName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
    try {
      const c = await getCompetition(competitionId);
      setCompetition(c);
      if (!c) return;
      // Submissions, evaluations and the leaderboard are readable by signed-in
      // users only (see firestore.rules), so don't even ask when signed out.
      if (!user) return;
      const mine = await getMySubmission(competitionId, user.uid);
      setSubmission(mine);
      if (mine) setTeamName(mine.teamName);
      setMyEvaluation(await getEvaluation(competitionId, user.uid));
      setLeaderboard(await getLeaderboard(competitionId));
    } catch (err) {
      // Permission/network errors shouldn't crash the page.
      console.error("[case-competition] load failed:", err);
      setCompetition((prev) => (prev === "loading" ? null : prev));
    }
  }, [competitionId, user]);

  useEffect(() => { load(); }, [load]);

  const canView = competition && competition !== "loading" &&
    (competition.status === "LIVE" || competition.status === "CLOSED" || isAdmin);
  const canSubmit = competition && competition !== "loading" && competition.status === "LIVE";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { signIn(); return; }
    if (!file) { setMessage({ kind: "err", text: "Choose a PDF file first." }); return; }
    setBusy(true);
    setMessage(null);
    try {
      const result = submission
        ? await replaceCaseDeck(competitionId, file, user, submission)
        : await submitCaseDeck(competitionId, teamName, file, user);
      setSubmission(result);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage({ kind: "ok", text: "Your case deck was uploaded successfully." });
    } catch (err) {
      const text = err instanceof SubmissionError ? err.message : "Upload failed. Please try again.";
      setMessage({ kind: "err", text });
    } finally {
      setBusy(false);
    }
  }

  if (competition === "loading") {
    return (
      <Section className="pt-16 md:pt-20">
        <Container>
          <div className="h-64 animate-pulse rounded-xl2 border-2 border-ink-900/10 bg-ink-900/5 dark:border-parchment-100/10 dark:bg-parchment-100/5" />
        </Container>
      </Section>
    );
  }

  if (!competition || !canView) {
    return (
      <Section className="pt-16 md:pt-20">
        <Container>
          <div className="flex flex-col items-center gap-3 rounded-xl2 border-2 border-dashed border-ink-900/25 py-20 text-center dark:border-parchment-100/25">
            <Trophy className="h-8 w-8 text-ink-500 dark:text-ink-300" aria-hidden="true" />
            <p className="font-display text-lg font-bold text-ink-800 dark:text-parchment-200">
              This competition isn&apos;t available.
            </p>
            <p className="max-w-sm text-sm text-ink-600 dark:text-ink-300">
              It may not be live yet, or the link may be wrong.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-16 md:pt-20">
      <Container className="max-w-3xl">
        {competition.status !== "LIVE" && isAdmin && (
          <p className="mb-6 rounded-lg border-2 border-brass/40 bg-brass/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-brass-dark dark:text-brass-light">
            Admin preview - status is {competition.status.toLowerCase()}, so participants {competition.status === "DRAFT" ? "can't see this yet" : "can no longer submit"}.
          </p>
        )}

        <h1 className="font-display text-3xl font-black uppercase leading-tight text-ink-900 dark:text-parchment-100 sm:text-4xl">
          {competition.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-200">
          {competition.description}
        </p>

        <div className="mt-8 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 dark:border-parchment-100 dark:bg-ink-700">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brass-dark dark:text-brass-light">
            Instructions
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700 dark:text-ink-100">
            {competition.instructions}
          </p>
          {competition.deadline && (
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-300">
              Deadline: {new Date(competition.deadline).toLocaleString()}
            </p>
          )}
        </div>

        {/* --------------------------------------------------------- submit */}
        <div className="mt-10 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 dark:border-parchment-100 dark:bg-ink-700">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brass-dark dark:text-brass-light">
            {submission ? "Your submission" : "Submit your case deck"}
          </h2>

          {!user ? (
            <div className="mt-4 flex flex-col items-start gap-3">
              <p className="text-sm text-ink-600 dark:text-ink-200">Sign in to submit your team&apos;s deck.</p>
              <Button onClick={signIn} variant="outline" size="sm">Sign in with Google</Button>
            </div>
          ) : (
            <>
              {submission && (
                <div className="mt-4 flex items-start gap-3 rounded-lg border-2 border-mint/40 bg-mint/5 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
                  <div className="text-sm text-ink-700 dark:text-ink-100">
                    <p className="font-semibold">Submitted as &quot;{submission.teamName}&quot;</p>
                    <p className="text-xs text-ink-500 dark:text-ink-300">
                      {new Date(submission.submittedAt).toLocaleString()}
                      {myEvaluation && ` \u00b7 Scored ${myEvaluation.total}/100`}
                    </p>
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brass-dark underline dark:text-brass-light"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" /> View your uploaded deck
                    </a>
                  </div>
                </div>
              )}

              {canSubmit ? (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {!submission && (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">
                        Team name
                      </span>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        maxLength={80}
                        placeholder="e.g. Team Whitston"
                        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-brass dark:border-parchment-100/20 dark:text-parchment-100"
                      />
                    </label>
                  )}

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">
                      {submission ? "Replace file (PDF)" : "Case deck (PDF, up to 25MB)"}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="w-full rounded-lg border-2 border-dashed border-ink-900/25 bg-transparent px-3.5 py-2.5 text-sm text-ink-700 file:mr-3 file:rounded-md file:border-0 file:bg-brass file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-white dark:border-parchment-100/25 dark:text-parchment-100"
                    />
                  </label>

                  {message && (
                    <p className={`text-sm ${message.kind === "ok" ? "text-mint" : "text-coral"}`}>{message.text}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={busy}
                    icon={submission ? <RefreshCcw className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                  >
                    {busy ? "Uploading\u2026" : submission ? "Replace submission" : "Submit deck"}
                  </Button>
                </form>
              ) : (
                !submission && (
                  <p className="mt-4 text-sm text-ink-500 dark:text-ink-300">
                    Submissions aren&apos;t open for this competition right now.
                  </p>
                )
              )}
            </>
          )}
        </div>

        {/* ------------------------------------------------------ leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mt-10 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 dark:border-parchment-100 dark:bg-ink-700">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-brass-dark dark:text-brass-light">
              <Trophy className="h-4 w-4" aria-hidden="true" /> Leaderboard
            </h2>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {leaderboard.map((row) => (
                  <tr key={row.id} className="border-b border-ink-900/10 last:border-0 dark:border-parchment-100/10">
                    <td className="py-2 font-mono text-xs font-bold text-ink-500 dark:text-ink-300">#{row.rank}</td>
                    <td className="py-2 font-semibold text-ink-900 dark:text-parchment-100">{row.teamName}</td>
                    <td className="py-2 text-right font-mono text-ink-700 dark:text-ink-100">{row.total}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </Section>
  );
}
