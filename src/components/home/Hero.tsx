"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { stockGameConfig } from "@/constants/site";

const tickerWords = [
  "MARKETS",
  "JUDGMENT",
  "CASE DECKS",
  "PORTFOLIOS",
  "COMPOUND INTEREST",
  "ENTREPRENEURSHIP",
  "RISK",
  "STRATEGY",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24">
      {/* Faint architectural grid, purely decorative */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.5] dark:opacity-[0.25]" aria-hidden="true" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-lg border-2 border-brass bg-brass/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brass-dark dark:text-brass-light">
              Student-first financial education
            </span>

            <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink-900 dark:text-parchment-100 sm:text-5xl md:text-6xl">
              Learn markets.
              <br />
              Build judgment.
              <br />
              <span className="text-brass">Own your future.</span>
            </h1>

            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-ink-600 dark:text-ink-200 md:text-lg">
              Whitston pairs a real-time market simulator with case-based
              learning decks built for students — so financial literacy
              feels like a story worth following, not a subject to memorize.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/stock-game" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                Launch Market Simulator
              </Button>
              <Button href="/case-decks" variant="outline" size="lg" icon={<PlayCircle className="h-5 w-5" />} iconPosition="left">
                Browse Case Decks
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* "Ledger card" — the hero's signature visual: a stamped case-file look */}
            <div className="relative rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 shadow-[6px_6px_0_0_theme(colors.brass.DEFAULT)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[6px_6px_0_0_theme(colors.brass.DEFAULT)]">
              <div className="flex items-center justify-between border-b-2 border-dashed border-ink-900/15 pb-4 dark:border-parchment-100/20">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-ink-600 dark:text-ink-300">
                  Portfolio Ledger
                </span>
                <span className="rounded-md border border-ledger/30 bg-ledger/10 px-2.5 py-1 font-mono text-xs font-semibold text-ledger dark:bg-ledger-light/15 dark:text-ledger-light">
                  {stockGameConfig.status === "live" ? "Live" : "Coming soon"}
                </span>
              </div>

              <dl className="mt-5 space-y-4">
                {[
                  { label: "Simulated Portfolio Value", value: "₹1,04,230" },
                  { label: "Cases Completed", value: "12 / 18" },
                  { label: "Learning Streak", value: "9 days" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <dt className="text-sm text-ink-600 dark:text-ink-300">{row.label}</dt>
                    <dd className="font-mono text-sm font-semibold text-ink-900 dark:text-parchment-100">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-lg border border-brass/20 bg-brass/10 px-4 py-3 text-xs leading-relaxed text-ink-700 dark:text-parchment-200">
                Illustrative preview — your real progress appears here once you sign in.
              </div>
            </div>

            <div
              className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-xl2 border-2 border-brass/40 sm:-right-6 sm:-top-6"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </Container>

      {/* Signature marquee: a ticker tape of the ideas Whitston teaches */}
      <div className="mt-16 overflow-hidden border-y-2 border-ink-900 bg-ink-900 py-3.5 dark:border-parchment-100 dark:bg-ink-950">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.2em] text-parchment-300/80">
          {[...tickerWords, ...tickerWords].map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center gap-10">
              {word}
              <span className="text-brass" aria-hidden="true">
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
