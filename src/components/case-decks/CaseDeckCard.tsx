import Image from "next/image";
import { Calendar, Clock, ArrowUpRight, Download, Users, FileClock } from "lucide-react";
import type { CaseDeck } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CaseDeckCard({ deck }: { deck: CaseDeck }) {
  const hasFile = Boolean(deck.fileUrl);

  return (
    <article className="brutal-edge group flex flex-col overflow-hidden rounded-xl2 border-2 border-ink-900 bg-parchment-100 shadow-[4px_4px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[4px_4px_0_0_theme(colors.parchment.100)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-ink-900 bg-ink-900/5 dark:border-parchment-100 dark:bg-ink-950">
        <Image
          src={deck.thumbnailUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-ink-900/90 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-parchment-100 backdrop-blur-sm">
          {deck.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold leading-snug text-ink-900 dark:text-parchment-100">
          {deck.title}
        </h3>
        {deck.team && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brass-dark dark:text-brass-light">
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {deck.team}
          </p>
        )}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
          {deck.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-ink-500 dark:text-ink-300">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(deck.uploadDate)}
          </span>
          {deck.estimatedMinutes && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {deck.estimatedMinutes} min
            </span>
          )}
        </div>

        {hasFile ? (
          <div className="mt-5 flex gap-2">
            <Button
              href={deck.fileUrl}
              external
              variant="outline"
              size="sm"
              className="flex-1"
              icon={<ArrowUpRight className="h-4 w-4" />}
            >
              View Deck
            </Button>
            {/* A plain external anchor (not Next's client-side Link) so the
                browser's native `download` behaviour isn't intercepted by
                client-side routing — and so the source file, which this
                only ever links to or streams, can't be edited in place. */}
            <Button
              href={deck.fileUrl}
              external
              variant="secondary"
              size="sm"
              className="flex-1"
              icon={<Download className="h-4 w-4" />}
              download
            >
              Download
            </Button>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-900/25 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:border-parchment-100/25 dark:text-ink-300">
            <FileClock className="h-4 w-4" aria-hidden="true" />
            File pending upload
          </div>
        )}
      </div>
    </article>
  );
}
