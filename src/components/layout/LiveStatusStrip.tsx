"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import { listGameStatuses } from "@/firebase/caseCompetition";
import { stockGameConfig } from "@/constants/site";
import type { GameStatus } from "@/types";

const LINKS: Record<string, string> = {
  "stock-market": "/stock-game",
  "case-competition": "/case-competition",
};

/**
 * "LIVE NOW" strip near the top of the site (Part 11). Data-driven, not
 * hardcoded: it reads /gameStatus from Firestore, which admins control from
 * /admin/case-competition. `stockGameConfig.status` (a static value in
 * constants/site.ts) is only the fallback shown before the Firestore read
 * resolves, or if no `stock-market` doc has been created yet — once an admin
 * sets it once, the Firestore value takes over.
 */
export function LiveStatusStrip() {
  const [statuses, setStatuses] = useState<GameStatus[] | null>(null);

  useEffect(() => {
    let live = true;
    listGameStatuses()
      .then((rows) => { if (live) setStatuses(rows); })
      .catch(() => { if (live) setStatuses([]); });
    return () => { live = false; };
  }, []);

  const known = new Map((statuses ?? []).map((s) => [s.id, s]));
  const entries = [
    {
      id: "stock-market",
      label: "Stock Market",
      isLive: known.get("stock-market")?.isLive ?? stockGameConfig.status === "live",
    },
    {
      id: "case-competition",
      label: "Case Competition",
      isLive: known.get("case-competition")?.isLive ?? false,
    },
  ];

  const anyLive = entries.some((e) => e.isLive);
  if (!anyLive) return null;

  return (
    <div className="border-b-2 border-ink-900 bg-ink-900 text-parchment-100 dark:border-parchment-100 dark:bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-[0.16em] text-brass-light">
          <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          Live now
        </span>
        {entries.filter((e) => e.isLive).map((e) => (
          <Link
            key={e.id}
            href={LINKS[e.id] ?? "#"}
            className="inline-flex items-center gap-1.5 font-medium text-parchment-100/90 transition-colors hover:text-brass-light"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            {e.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
