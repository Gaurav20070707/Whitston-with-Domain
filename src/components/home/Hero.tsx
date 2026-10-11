"use client";

import { motion } from "framer-motion";
import { ChevronDown, Presentation, Trophy, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OptionCard } from "@/components/home/OptionCard";

const tickerWords = [
  "MARKETS",
  "JUDGMENT",
  "CASE DECKS",
  "CASE COMPETITIONS",
  "PORTFOLIOS",
  "ENTREPRENEURSHIP",
  "RISK",
  "STRATEGY",
];

// Each card points at an existing route — no new pages needed.
const options = [
  {
    href: "/stock-game",
    title: "Stock Market",
    description: "Learn investing, trade virtual stocks, and build your portfolio.",
    icon: TrendingUp,
  },
  {
    href: "/case-decks",
    title: "Case Decks",
    description:
      "Explore case decks, discover business insights, and sharpen your problem-solving skills.",
    icon: Presentation,
  },
  {
    href: "/case-competition",
    title: "Case Competitions",
    description:
      "Discover case competitions, take on business challenges, and test your strategic thinking.",
    icon: Trophy,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 md:pt-14">
      {/* Faint architectural grid, purely decorative */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.5] dark:opacity-[0.25]" aria-hidden="true" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-lg border-2 border-brass bg-brass/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brass-dark dark:text-brass-light">
            Student-first financial education
          </span>

          <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink-900 dark:text-parchment-100 sm:text-5xl md:text-6xl">
            Learn markets. Build judgment.{" "}
            <span className="text-brass">Own your future.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-ink-600 dark:text-ink-200 md:text-lg">
            Welcome to Whitston. Pick where you want to start.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-3 md:gap-6">
          {options.map((option, index) => (
            <OptionCard key={option.href} index={index} {...option} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink-500 transition-colors hover:text-brass-dark dark:text-ink-300 dark:hover:text-brass-light"
          >
            Scroll to learn more
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Container>

      {/* Signature marquee: a ticker tape of the ideas Whitston teaches */}
      <div className="mt-10 overflow-hidden border-y-2 border-ink-900 bg-ink-900 py-3.5 dark:border-parchment-100 dark:bg-ink-950">
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
