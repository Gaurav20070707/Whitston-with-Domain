"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  Users,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { features } from "@/constants/site";

const iconMap: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  "book-open": BookOpen,
  users: Users,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  target: Target,
};

export function FeatureCards() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="What you get"
          title="One platform, built to grow with you."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
                className="brutal-edge group rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-7 shadow-[4px_4px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[4px_4px_0_0_theme(colors.parchment.100)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-brass/40 bg-brass/12 text-brass-dark transition-colors group-hover:border-brass group-hover:bg-brass group-hover:text-white dark:text-brass-light">
                  {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink-900 dark:text-parchment-100">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
