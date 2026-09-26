"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-500 dark:text-ink-300"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search case decks…"
        aria-label="Search case decks"
        className="w-full rounded-lg border-2 border-ink-900/20 bg-parchment-100 py-2.5 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30 dark:border-parchment-100/20 dark:bg-ink-700 dark:text-parchment-100 dark:placeholder:text-ink-300"
      />
    </div>
  );
}
