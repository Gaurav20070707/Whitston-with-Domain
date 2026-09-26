"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusCircle, ShieldOff, FileText, Trophy, ChevronDown, Radio } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  listCompetitions, createCompetition, setCompetitionStatus, listSubmissions, evaluateSubmission,
  getLeaderboard, listGameStatuses, setGameStatus,
} from "@/firebase/caseCompetition";
import type { CaseCompetition, CaseSubmission, CompetitionStatus, GameStatus } from "@/types";

export default function AdminCaseCompetitionPage() {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();
  const [competitions, setCompetitions] = useState<CaseCompetition[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<GameStatus[]>([]);

  const load = useCallback(async () => {
    setCompetitions(await listCompetitions({ isAdmin: true }));
    setStatuses(await listGameStatuses());
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  if (isLoading) {
    return (
      <Section className="pt-16 md:pt-20"><Container>
        <div className="h-40 animate-pulse rounded-xl2 border-2 border-ink-900/10 bg-ink-900/5 dark:border-parchment-100/10 dark:bg-parchment-100/5" />
      </Container></Section>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Section className="pt-16 md:pt-20"><Container>
        <div className="flex flex-col items-center gap-3 rounded-xl2 border-2 border-dashed border-ink-900/25 py-20 text-center dark:border-parchment-100/25">
          <ShieldOff className="h-8 w-8 text-ink-500 dark:text-ink-300" aria-hidden="true" />
          <p className="font-display text-lg font-bold text-ink-800 dark:text-parchment-200">
            You don&apos;t have access to this page.
          </p>
          <p className="max-w-sm text-sm text-ink-600 dark:text-ink-300">
            Case competition administration is limited to site admins. See firestore.rules for how to grant access.
          </p>
        </div>
      </Container></Section>
    );
  }

  return (
    <Section className="pt-16 md:pt-20">
      <Container>
        <h1 className="font-display text-3xl font-black uppercase text-ink-900 dark:text-parchment-100">
          Case Competition &mdash; Admin
        </h1>

        <GameStatusPanel statuses={statuses} onChanged={load} />
        <CreateCompetitionForm onCreated={load} />

        <div className="mt-12 space-y-4">
          {competitions.map((c) => (
            <CompetitionRow
              key={c.id}
              competition={c}
              expanded={expanded === c.id}
              onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
              onChanged={load}
            />
          ))}
          {competitions.length === 0 && (
            <p className="text-sm text-ink-500 dark:text-ink-300">No competitions created yet - add one below.</p>
          )}
        </div>
      </Container>
    </Section>
  );
}

/** Part 11: the live-status strip's data source. A quick manual toggle per
 *  game/competition-system entry, shown publicly near the top of the site. */
function GameStatusPanel({ statuses, onChanged }: { statuses: GameStatus[]; onChanged: () => void }) {
  const known = new Map(statuses.map((s) => [s.id, s]));
  const entries: { id: string; label: string }[] = [
    { id: "stock-market", label: "Stock Market" },
    { id: "case-competition", label: "Case Competition" },
  ];

  return (
    <div className="mt-8 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 dark:border-parchment-100 dark:bg-ink-700">
      <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-brass-dark dark:text-brass-light">
        <Radio className="h-4 w-4" aria-hidden="true" /> Live status strip
      </h2>
      <p className="mt-2 text-xs text-ink-500 dark:text-ink-300">
        Controls the &quot;games live now&quot; strip shown near the top of the site.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {entries.map(({ id, label }) => {
          const current = known.get(id);
          const isLive = current?.isLive ?? false;
          return (
            <button
              key={id}
              onClick={() => setGameStatus(id, label, !isLive).then(onChanged)}
              className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                isLive
                  ? "border-mint bg-mint/10 text-mint"
                  : "border-ink-900/20 text-ink-600 hover:border-ink-900/40 dark:border-parchment-100/20 dark:text-ink-300"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-mint" : "bg-ink-400"}`} />
              {label}: {isLive ? "Live" : "Not live"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CreateCompetitionForm({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<CompetitionStatus>("DRAFT");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setMessage(null);
    try {
      await createCompetition({ title, description, instructions, status }, user.uid);
      setTitle(""); setDescription(""); setInstructions(""); setStatus("DRAFT");
      setMessage("Competition created.");
      onCreated();
    } catch (err) {
      setMessage((err as Error).message || "Couldn't create the competition.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 dark:border-parchment-100 dark:bg-ink-700">
      <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-brass-dark dark:text-brass-light">
        <PlusCircle className="h-4 w-4" aria-hidden="true" /> New competition
      </h2>
      <input
        value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Topic / title"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
      />
      <textarea
        value={description} onChange={(e) => setDescription(e.target.value)} required rows={2}
        placeholder="Short description shown on the listing card"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
      />
      <textarea
        value={instructions} onChange={(e) => setInstructions(e.target.value)} required rows={5}
        placeholder="Full instructions participants will read on the brief page"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
      />
      <label className="block max-w-xs">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">Status</span>
        <select
          value={status} onChange={(e) => setStatus(e.target.value as CompetitionStatus)}
          className="w-full rounded-lg border-2 border-ink-900/20 bg-transparent px-3.5 py-2.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
        >
          <option value="DRAFT">Draft (admin preview only)</option>
          <option value="LIVE">Live (visible, accepting submissions)</option>
          <option value="CLOSED">Closed (visible, no new submissions)</option>
        </select>
      </label>
      {message && <p className="text-sm text-ink-600 dark:text-ink-200">{message}</p>}
      <Button type="submit" size="sm" disabled={busy}>{busy ? "Creating\u2026" : "Create competition"}</Button>
    </form>
  );
}

function CompetitionRow({
  competition, expanded, onToggle, onChanged,
}: { competition: CaseCompetition; expanded: boolean; onToggle: () => void; onChanged: () => void }) {
  const [submissions, setSubmissions] = useState<CaseSubmission[] | null>(null);
  const [leaderboard, setLeaderboard] = useState<Awaited<ReturnType<typeof getLeaderboard>>>([]);

  const refresh = useCallback(async () => {
    setSubmissions(await listSubmissions(competition.id));
    setLeaderboard(await getLeaderboard(competition.id));
  }, [competition.id]);

  useEffect(() => { if (expanded) refresh(); }, [expanded, refresh]);

  return (
    <div className="overflow-hidden rounded-xl2 border-2 border-ink-900 dark:border-parchment-100">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-parchment-100 px-5 py-4 text-left dark:bg-ink-700"
      >
        <div>
          <p className="font-display font-bold text-ink-900 dark:text-parchment-100">{competition.title}</p>
          <p className="text-xs text-ink-500 dark:text-ink-300">{competition.status}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={competition.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => { e.stopPropagation(); setCompetitionStatus(competition.id, e.target.value as CompetitionStatus).then(onChanged); }}
            className="rounded-md border-2 border-ink-900/20 bg-transparent px-2 py-1 text-xs font-semibold dark:border-parchment-100/20 dark:text-parchment-100"
          >
            <option value="DRAFT">Draft</option>
            <option value="LIVE">Live</option>
            <option value="CLOSED">Closed</option>
          </select>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </div>
      </button>

      {expanded && (
        <div className="border-t-2 border-ink-900/10 bg-parchment p-5 dark:border-parchment-100/10 dark:bg-ink-800">
          {leaderboard.length > 0 && (
            <div className="mb-5 rounded-lg border-2 border-ink-900/15 p-3 dark:border-parchment-100/15">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-600 dark:text-ink-300">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> Current standings
              </p>
              {leaderboard.map((row) => (
                <div key={row.id} className="flex justify-between py-0.5 text-sm text-ink-800 dark:text-ink-100">
                  <span>#{row.rank} {row.teamName}</span>
                  <span className="font-mono">{row.total}/100</span>
                </div>
              ))}
            </div>
          )}

          {submissions === null ? (
            <p className="text-sm text-ink-500 dark:text-ink-300">Loading submissions\u2026</p>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-ink-500 dark:text-ink-300">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <SubmissionRow
                  key={s.id}
                  submission={s}
                  competitionId={competition.id}
                  onEvaluated={() => { refresh(); onChanged(); }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CRITERIA: { key: keyof import("@/firebase/caseCompetition").EvaluationInput; label: string }[] = [
  { key: "problemUnderstanding", label: "Problem understanding" },
  { key: "innovation", label: "Innovation" },
  { key: "strategy", label: "Strategy" },
  { key: "feasibility", label: "Feasibility" },
  { key: "presentation", label: "Presentation" },
];

function SubmissionRow({
  submission, competitionId, onEvaluated,
}: { submission: CaseSubmission; competitionId: string; onEvaluated: () => void }) {
  const { user } = useAuth();
  const [scores, setScores] = useState({
    problemUnderstanding: 0, innovation: 0, strategy: 0, feasibility: 0, presentation: 0,
  });
  const [busy, setBusy] = useState(false);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  async function save() {
    if (!user) return;
    setBusy(true);
    try {
      await evaluateSubmission(competitionId, submission, scores, user.uid);
      onEvaluated();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border-2 border-ink-900/15 p-4 dark:border-parchment-100/15">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-ink-900 dark:text-parchment-100">{submission.teamName}</p>
          <p className="text-xs text-ink-500 dark:text-ink-300">
            {submission.submitterEmail} \u00b7 {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
        <a
          href={submission.fileUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brass-dark underline dark:text-brass-light"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Open PDF
        </a>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {CRITERIA.map(({ key, label }) => (
          <label key={key} className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-300">
              {label} (0\u201320)
            </span>
            <input
              type="number" min={0} max={20} value={scores[key]}
              onChange={(e) => setScores((s) => ({ ...s, [key]: Number(e.target.value) }))}
              className="w-full rounded-md border-2 border-ink-900/20 bg-transparent px-2 py-1.5 text-sm dark:border-parchment-100/20 dark:text-parchment-100"
            />
          </label>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900 dark:text-parchment-100">
          <Trophy className="h-4 w-4 text-brass-dark dark:text-brass-light" aria-hidden="true" /> Total: {total}/100
        </p>
        <Button size="sm" onClick={save} disabled={busy}>
          {busy ? "Saving\u2026" : "Save score"}
        </Button>
      </div>
    </div>
  );
}
