"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Presentation, Trophy, TrendingUp, type LucideIcon } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { stockGameConfig } from "@/constants/site";

interface Program {
  id: string;
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  body: string;
  points: string[];
  href: string;
  cta: string;
}

const programs: Program[] = [
  {
    id: "stock-market",
    eyebrow: "Program 01",
    title: "Stock Market",
    icon: TrendingUp,
    body: stockGameConfig.shortDescription,
    points: [
      "Practice reading price movement the way real markets behave",
      "Build a portfolio and see the result of every decision instantly",
      "Compete with classmates on the leaderboard — with no real money, ever",
    ],
    href: "/stock-game",
    cta: "Explore the Simulator",
  },
  {
    id: "case-decks",
    eyebrow: "Program 02",
    title: "Case Decks",
    icon: Presentation,
    body: "Case decks are story-driven, bite-sized presentations built around real business situations. Work through the problem, study how a strategy was structured, and learn how strong teams approach a case.",
    points: [
      "Understand core business and finance concepts through real examples",
      "See how winning teams frame a problem and structure a solution",
      "Browse and filter decks by category to learn at your own pace",
    ],
    href: "/case-decks",
    cta: "Browse Case Decks",
  },
  {
    id: "case-competitions",
    eyebrow: "Program 03",
    title: "Case Competitions",
    icon: Trophy,
    body: "Put what you've learned to work. Read the brief, build your case with your team, and submit your deck before the window closes — judged on problem understanding, innovation, strategy, feasibility, and presentation.",
    points: [
      "Take on real business challenges in a structured format",
      "Practice teamwork, research, and presenting under a deadline",
      "Get a clear idea of how your strategy is evaluated",
    ],
    href: "/case-competition",
    cta: "View Competitions",
  },
];

export function ProgramDetails() {
  return (
    <Section id="programs" className="pb-4 md:pb-8">
      <Container>
        <SectionHeading
          eyebrow="What you can do"
          title="Three ways to learn by doing."
          description="Start with the simulator, study real cases, then test yourself in competition — each program builds on the last."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 space-y-6">
          {programs.map((program) => (
            <motion.article
              key={program.id}
              id={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="scroll-mt-24 rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 shadow-[4px_4px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[4px_4px_0_0_theme(colors.parchment.100)] md:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-brass/40 bg-brass/10 text-brass-dark dark:text-brass-light">
                      <program.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brass-dark dark:text-brass-light">
                      {program.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-black uppercase leading-tight tracking-tight text-ink-900 dark:text-parchment-100 md:text-4xl">
                    {program.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ink-600 dark:text-ink-200">
                    {program.body}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-8">
                  <ul className="space-y-3">
                    {program.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-ink-700 dark:text-parchment-200 md:text-base">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-brass-dark dark:text-brass-light" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Button href={program.href} icon={<ArrowUpRight className="h-4 w-4" />}>
                      {program.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
