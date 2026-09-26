"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Trophy, ShieldCheck } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { listCompetitions } from "@/firebase/caseCompetition";
import type { CaseCompetition } from "@/types";

export default function CaseCompetitionPage() {
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [competitions, setCompetitions] = useState<CaseCompetition[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminLoading) return;
    let live = true;
    listCompetitions({ isAdmin })
      .then((rows) => { if (live) setCompetitions(rows); })
      .catch((e) => { if (live) setError((e as Error).message); });
    return () => { live = false; };
  }, [isAdmin, adminLoading]);

  return (
    <Section className="pt-16 md:pt-20">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <SectionHeading
            eyebrow="Case Competition"
            title="Put your strategy to the test."
            description="Read the brief, build your case, and submit your deck before the window closes. Judged on problem understanding, innovation, strategy, feasibility, and presentation."
          />
          {isAdmin && (
            <Button href="/admin/case-competition" size="sm" variant="secondary">
              Manage competitions
            </Button>
          )}
        </div>

        {error && (
          <p className="mt-8 rounded-lg border-2 border-coral/40 bg-coral/5 px-4 py-3 text-sm text-coral">
            {error}
          </p>
        )}

        {!error && competitions === null && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl2 border-2 border-ink-900/10 bg-ink-900/5 dark:border-parchment-100/10 dark:bg-parchment-100/5"
              />
            ))}
          </div>
        )}

        {competitions && competitions.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 rounded-xl2 border-2 border-dashed border-ink-900/25 py-16 text-center dark:border-parchment-100/25">
            <Trophy className="h-8 w-8 text-ink-500 dark:text-ink-300" aria-hidden="true" />
            <p className="font-display text-lg font-bold text-ink-800 dark:text-parchment-200">
              No competitions are live right now.
            </p>
            <p className="max-w-sm text-sm text-ink-600 dark:text-ink-300">
              Check back soon, or join the WhatsApp community to hear the moment a new one opens.
            </p>
          </div>
        )}

        {competitions && competitions.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((c) => (
              <Link
                key={c.id}
                href={`/case-competition/${c.id}`}
                className="brutal-edge group flex flex-col overflow-hidden rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 shadow-[4px_4px_0_0_theme(colors.ink.900)] transition-transform hover:-translate-y-0.5 dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[4px_4px_0_0_theme(colors.parchment.100)]"
              >
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                    c.status === "LIVE"
                      ? "border-mint/40 bg-mint/10 text-mint"
                      : c.status === "CLOSED"
                        ? "border-ink-900/20 bg-ink-900/5 text-ink-500 dark:border-parchment-100/20 dark:bg-parchment-100/10 dark:text-ink-300"
                        : "border-brass/40 bg-brass/10 text-brass-dark dark:text-brass-light"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  {c.status === "LIVE" ? "Live" : c.status === "CLOSED" ? "Closed" : "Draft"}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink-900 dark:text-parchment-100">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
                  {c.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brass-dark dark:text-brass-light">
                  Open brief
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        )}

        {!user && (
          <p className="mt-10 text-center text-sm text-ink-500 dark:text-ink-300">
            You&apos;ll need to sign in with Google to submit a deck once you open a competition.
          </p>
        )}
      </Container>
    </Section>
  );
}
