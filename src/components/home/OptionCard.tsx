"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface OptionCardProps {
  href: string;
  index: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * One of the three big landing-page options. The whole card is a single
 * <Link>, so the entire surface is clickable and keyboard-focusable.
 * Reuses the site's `brutal-edge` hover (lift + hard shadow) for consistency.
 */
export function OptionCard({ href, index, title, description, icon: Icon }: OptionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + index * 0.08 }}
      className="h-full"
    >
      <Link
        href={href}
        className="brutal-edge group flex h-full flex-col rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 shadow-[5px_5px_0_0_theme(colors.brass.DEFAULT)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-parchment dark:border-parchment-100 dark:bg-ink-700 dark:focus-visible:ring-offset-ink-800 md:p-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-brass/40 bg-brass/10 text-brass-dark transition-colors duration-200 group-hover:border-brass group-hover:bg-brass group-hover:text-white dark:text-brass-light">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </div>
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-ink-500 dark:text-ink-300" aria-hidden="true">
            0{index + 1}
          </span>
        </div>

        <h2 className="mt-6 font-display text-2xl font-black uppercase leading-tight tracking-tight text-ink-900 dark:text-parchment-100 md:text-3xl">
          {title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-200 md:text-base">
          {description}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wide text-brass-dark dark:text-brass-light">
          Explore
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}
