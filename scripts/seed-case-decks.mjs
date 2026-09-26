#!/usr/bin/env node
/**
 * One-time seed: creates Firestore /caseDecks documents for the real decks
 * that already live as static files under public/case-decks/. This avoids
 * re-uploading multi-megabyte PDFs through the browser admin form just to
 * get them into the new Firestore-backed library — they're pointed at
 * directly via their existing /case-decks/*.pdf URL instead.
 *
 * After running this once, every deck it creates is fully editable from
 * /admin/case-decks like any other — including replacing its file with a
 * real Storage upload later if you want to retire the static asset.
 *
 * Usage (same credential setup as scripts/make-admin.mjs):
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json node scripts/seed-case-decks.mjs
 *
 * Safe to re-run: it skips any deck id that already exists.
 */
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
initializeApp({
  credential: keyPath ? cert(JSON.parse(readFileSync(keyPath, "utf8"))) : applicationDefault(),
});
const db = getFirestore();

const DECKS = [
  {
    id: "arthat-5-case-wizards",
    title: "Food Price Shock Absorber (FPSA): A Rule-Based Stabilisation Framework",
    description:
      "A policy case on India's food inflation volatility — proposing an automatic, rule-based price-band system to replace crisis-driven export bans and MSP hikes within a capped fiscal envelope.",
    category: "Economics",
    team: "Team Case Wizards · Sri Guru Gobind Singh College of Commerce (Arthat 5.0)",
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    fileUrl: "/case-decks/arthat-5-case-wizards.pdf",
  },
  {
    id: "markquest-masters-team-absolutt",
    title: "Data-Backed B2B Customer Segmentation for a Mentorship Platform",
    description:
      "A go-to-market case for Skilled Sapiens — a three-level (firmographic, needs-based, behavioural) segmentation model and a Priority Index for ranking founder segments by revenue potential.",
    category: "Case Competitions",
    team: "Team Absolutt · Markquest Masters, IIM Rohtak",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
    fileUrl: "/case-decks/markquest-masters-team-absolutt.pdf",
  },
  {
    id: "team-whitston-balanced-bites",
    title: "Balanced Bites: Sustainable Growth & CSR Strategy",
    description:
      "A sustainability case for a healthy-food retailer — a circular-waste \"CLEAN\" model, ethical sourcing, and a transparency framework to address environmental and labour criticisms.",
    category: "Case Competitions",
    team: "Team Whitston",
    thumbnailUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    fileUrl: "/case-decks/team-whitston-balanced-bites.pdf",
  },
  {
    id: "case-study-portfolio",
    title: "Case Study Portfolio (multiple submissions)",
    description:
      "A 125-page compiled portfolio spanning several separate case studies — road-safety wearables, retail expansion, fintech market-sizing, pricing strategy, and more.",
    category: "Case Competitions",
    thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    fileUrl: "/case-decks/case-study-portfolio.pdf",
  },
];

async function main() {
  for (const { id, ...data } of DECKS) {
    const ref = db.collection("caseDecks").doc(id);
    const existing = await ref.get();
    if (existing.exists) {
      console.log(`Skipping "${data.title}" — already exists.`);
      continue;
    }
    await ref.set({
      ...data,
      team: data.team ?? null,
      storagePath: null,
      createdByUid: "seed-script",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`Created "${data.title}".`);
  }
}

main()
  .then(() => { console.log("Done."); process.exit(0); })
  .catch((err) => { console.error(err.message ?? err); process.exit(1); });
