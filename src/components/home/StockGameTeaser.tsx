"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, LineChart } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { stockGameConfig } from "@/constants/site";

export function StockGameTeaser() {
  return (
    <Section className="py-0">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl2 border-2 border-ink-900 bg-ink-900 px-8 py-14 shadow-[8px_8px_0_0_theme(colors.brass.DEFAULT)] dark:border-parchment-100 sm:px-14 md:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-30" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-brass/40 bg-brass/15 text-brass-light">
                <LineChart className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-display text-3xl font-black uppercase leading-tight text-parchment-100 md:text-4xl">
                {stockGameConfig.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-parchment-300/80 md:text-lg">
                {stockGameConfig.shortDescription}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
              <Button
                href="/stock-game"
                variant="secondary"
                size="lg"
                icon={<ArrowUpRight className="h-5 w-5" />}
              >
                Explore the Simulator
              </Button>
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-parchment-300/60">
                No real money, ever
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
