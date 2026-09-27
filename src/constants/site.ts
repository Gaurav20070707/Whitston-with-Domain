/**
 * ============================================================================
 * WHITSTON — SITE CONFIGURATION
 * ============================================================================
 * This is the single source of truth for content that changes often:
 * external links, contact details, and site metadata.
 *
 * When you have the real Stock Market Game URL, your social handles, etc.,
 * update the values below. Nothing else in the codebase needs to change —
 * every component imports from here.
 * ============================================================================
 */

export const siteConfig = {
  name: "Whitston",
  tagline: "Learn markets. Build judgment. Own your future.",
  description:
    "Whitston is a student-first platform combining a live-style stock market simulation with real, case-based learning decks for young minds.",
  url: "https://whitston.example.com",
  locale: "en_US",
};

/**
 * Stock Market Game
 * Update `launchUrl` once your game is deployed. Every "Launch Game" button
 * across the site reads from this one value.
 */
export const stockGameConfig = {
  title: "Whitston Market Simulator",
  shortDescription:
    "Trade in a risk-free, real-time market environment. Build a portfolio, compete on the leaderboard, and learn how markets actually move — without risking a single rupee.",
  launchUrl: "https://stockgame-new.onrender.com", // TODO: replace with the real Stock Market Game URL
  status: "live" as "live" | "coming-soon" | "beta",
};

/**
 * Social & contact links.
 * Replace the placeholder values below when ready — every icon/link on the
 * site (footer, contact section, nav) reads from this object.
 */
export const socialLinks = {
  instagram: "#", // TODO: replace with real Instagram URL
  linkedin: "#", // TODO: replace with real LinkedIn URL
  email: "mailto@gmail.com", // TODO: replace with real email address
  whatsapp: "#", // TODO: replace with real WhatsApp community invite link
  phone: "+910000000000", // TODO: replace with real phone number (E.164 format, no spaces)
};

/** Derived, ready-to-use hrefs so components never have to format these. */
export const contactHrefs = {
  instagram: socialLinks.instagram,
  linkedin: socialLinks.linkedin,
  email: socialLinks.email.startsWith("mailto:")
    ? socialLinks.email
    : `mailto:${socialLinks.email}`,
  whatsapp: socialLinks.whatsapp,
  phone: `tel:${socialLinks.phone}`,
  phoneDisplay: socialLinks.phone,
};

/**
 * Primary navigation. Add/remove entries here to change the nav bar and
 * mobile menu everywhere at once.
 */
export const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Stock Game", href: "/stock-game" },
  { label: "Case Decks", href: "/case-decks" },
  { label: "Case Competition", href: "/case-competition" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Feature highlights shown on the landing page. Safe to add/remove/reorder —
 * the grid that renders these is fully dynamic.
 */
export const features: {
  title: string;
  description: string;
  icon: "trending-up" | "book-open" | "users" | "shield-check" | "sparkles" | "target";
}[] = [
  {
    title: "Market Simulator",
    description:
      "A live-style trading environment where students build real intuition for how markets behave, with zero real-world risk.",
    icon: "trending-up",
  },
  {
    title: "Case-Based Learning",
    description:
      "Bite-sized, story-driven case decks that turn finance and business concepts into ideas kids actually remember.",
    icon: "book-open",
  },
  {
    title: "Built for Students",
    description:
      "Every feature is designed around how students actually learn — visual, interactive, and paced for real classrooms.",
    icon: "users",
  },
  {
    title: "Safe & Verified",
    description:
      "Google Sign-In keeps every account secure, while your progress and portfolio stay saved across sessions.",
    icon: "shield-check",
  },
  {
    title: "Gamified Progress",
    description:
      "Leaderboards, streaks, and milestones (coming soon) keep learning momentum going long after the first login.",
    icon: "sparkles",
  },
  {
    title: "Always Expanding",
    description:
      "New case decks, competitions, and tools ship regularly — Whitston grows with the students who use it.",
    icon: "target",
  },
];

/** Case deck categories — used to power the filter UI on /case-decks. */
export const caseDeckCategories = [
  "All",
  "Business Basics",
  "Personal Finance",
  "Markets & Investing",
  "Entrepreneurship",
  "Economics",
  "Case Competitions",
] as const;

export type CaseDeckCategory = (typeof caseDeckCategories)[number];
