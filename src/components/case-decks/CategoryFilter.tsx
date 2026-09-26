"use client";

import { caseDeckCategories, type CaseDeckCategory } from "@/constants/site";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  active: CaseDeckCategory;
  onChange: (category: CaseDeckCategory) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter case decks by category">
      {caseDeckCategories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={cn(
              "rounded-lg border-2 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition-colors duration-200",
              isActive
                ? "border-ink-900 bg-ink-900 text-parchment-100 dark:border-brass dark:bg-brass dark:text-ink-900"
                : "border-ink-900/20 text-ink-700 hover:border-ink-900/40 hover:bg-ink-900/5 dark:border-parchment-100/20 dark:text-parchment-200 dark:hover:bg-parchment-100/5"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
