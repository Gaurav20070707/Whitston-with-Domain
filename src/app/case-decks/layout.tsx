import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Decks",
  description: "Educational case decks that make finance and business concepts click for students.",
};

export default function CaseDecksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
