"use client";

import { motion } from "framer-motion";
import { Section, Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: "2", label: "Core programs — Simulator & Case Decks" },
  { value: "100%", label: "Risk-free practice environment" },
  { value: "∞", label: "Room to grow — built to expand" },
];

export function About() {
  return (
    <Section id="about" className="bg-parchment-300/50 dark:bg-ink-950/40">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="About Whitston"
            title="Financial fluency shouldn't wait until adulthood."
            description="Whitston exists because the best time to understand money, markets, and decision-making is before the stakes are real. We build tools that let students practice first — trading in a simulated market, working through real-world case studies — so judgment is earned before it's ever tested."
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="brutal-edge rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 shadow-[4px_4px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[4px_4px_0_0_theme(colors.parchment.100)]"
              >
                <p className="font-display text-3xl font-black text-brass">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
