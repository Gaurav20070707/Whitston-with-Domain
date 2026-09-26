"use client";

import { useMemo, useState } from "react";
import { FolderSearch } from "lucide-react";
import type { CaseDeck } from "@/types";
import { type CaseDeckCategory } from "@/constants/site";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { CaseDeckCard } from "./CaseDeckCard";

export function CaseDeckGrid({ decks }: { decks: CaseDeck[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CaseDeckCategory>("All");

  const filteredDecks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return decks.filter((deck) => {
      const matchesCategory = category === "All" || deck.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        deck.title.toLowerCase().includes(normalizedQuery) ||
        deck.description.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [decks, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      {filteredDecks.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map((deck) => (
            <CaseDeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 rounded-xl2 border-2 border-dashed border-ink-900/25 py-16 text-center dark:border-parchment-100/25">
          <FolderSearch className="h-8 w-8 text-ink-500 dark:text-ink-300" aria-hidden="true" />
          <p className="font-display text-lg font-bold text-ink-800 dark:text-parchment-200">
            No case decks match your search.
          </p>
          <p className="max-w-sm text-sm text-ink-600 dark:text-ink-300">
            Try a different keyword, or clear the category filter to see everything available.
          </p>
        </div>
      )}
    </div>
  );
}
