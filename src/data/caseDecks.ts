import type { CaseDeck } from "@/types";

/**
 * Real submitted case decks. Each `fileUrl` points at a static PDF under
 * `/public/case-decks` — served as-is by Next.js, so it opens in the
 * browser's own PDF viewer (view-only; there is no edit affordance) and can
 * also be fetched directly for the Download button.
 *
 * NOTE ON FILE SIZE: `case-study-portfolio.pdf` is ~60MB. Committing a file
 * that size to the repo works but is not ideal — consider moving it (and any
 * future large decks) to Firebase Storage or S3 and swapping `fileUrl` for
 * the hosted URL, same as the original placeholder comment in this file
 * suggested. The card/view/download UI needs no changes either way.
 */
export const caseDecks: CaseDeck[] = [
  {
    id: "arthat-5-case-wizards",
    title: "Food Price Shock Absorber (FPSA): A Rule-Based Stabilisation Framework",
    description:
      "A policy case on India's food inflation volatility — proposing an automatic, rule-based price-band system to replace crisis-driven export bans and MSP hikes within a capped fiscal envelope.",
    category: "Economics",
    team: "Team Case Wizards · Sri Guru Gobind Singh College of Commerce (Arthat 5.0)",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    fileUrl: "/case-decks/arthat-5-case-wizards.pdf",
    uploadDate: "2026-08-30",
  },
  {
    id: "team-whitston-balanced-bites",
    title: "Balanced Bites: Sustainable Growth & CSR Strategy",
    description:
      "A sustainability case for a healthy-food retailer — a circular-waste \"CLEAN\" model, ethical sourcing, and a transparency framework to address environmental and labour criticisms.",
    category: "Case Competitions",
    team: "Team Whitston",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    // File not yet available on the site — the original upload for this deck
    // didn't come through as a PDF asset (only as inline text), so there's
    // nothing real to link here yet. Re-upload the PDF to wire this up.
    fileUrl: undefined,
    uploadDate: "2026-08-30",
  },
  {
    id: "case-study-portfolio",
    title: "Case Study Portfolio (multiple submissions)",
    description:
      "A 125-page compiled portfolio spanning several separate case studies — road-safety wearables, retail expansion, fintech market-sizing, pricing strategy, and more. Ask us to split this into individual case-deck entries if you'd like each one listed on its own.",
    category: "Case Competitions",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    fileUrl: "/case-decks/case-study-portfolio.pdf",
    uploadDate: "2026-08-30",
  },
];
