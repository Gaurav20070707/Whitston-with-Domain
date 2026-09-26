"use client";

import { useEffect, useState } from "react";
import { Section, Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CaseDeckGrid } from "@/components/case-decks/CaseDeckGrid";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { listCaseDecks } from "@/firebase/caseDecks";
import type { CaseDeck } from "@/types";

/**
 * The deck library lives in Firestore now (see firebase/caseDecks.ts) so an
 * admin can add, edit, or remove decks from /admin/case-decks — but reading
 * it is public (`allow read: if true` in firestore.rules), so this page
 * works the same for a signed-out visitor as it does for a participant or
 * an admin. Only the "Manage decks" button is gated.
 */
export default function CaseDecksPage() {
  const { isAdmin } = useIsAdmin();
  const [decks, setDecks] = useState<CaseDeck[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    listCaseDecks()
      .then((rows) => { if (live) setDecks(rows); })
      .catch((e) => { if (live) setError((e as Error).message); });
    return () => { live = false; };
  }, []);

  return (
    <Section className="pt-16 md:pt-20">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <SectionHeading
            eyebrow="Case Decks"
            title="Stories that teach students to think, not just memorize."
            description="Each deck is a short, real-world case built for the classroom or self-study. Search by keyword or filter by category to find the right one."
          />
          {isAdmin && (
            <Button href="/admin/case-decks" size="sm" variant="secondary">
              Manage decks
            </Button>
          )}
        </div>

        {error && (
          <p className="mt-8 rounded-lg border-2 border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-100/20 dark:bg-red-950/30 dark:text-red-200">
            Couldn&apos;t load case decks: {error}
          </p>
        )}

        <div className="mt-12">
          {decks === null && !error ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl2 border-2 border-ink-900/10 bg-ink-900/5 dark:border-parchment-100/10 dark:bg-parchment-100/5" />
              ))}
            </div>
          ) : (
            <CaseDeckGrid decks={decks ?? []} />
          )}
        </div>
      </Container>
    </Section>
  );
}
