import type { Config } from "tailwindcss";

// Whitston design tokens — "market brief meets brutalist editorial":
// a near-black violet ink, lavender-white paper, and a signature royal-purple
// accent, paired with an emerald "ledger" tone for growth/positive signal.
// Token *names* (ink / parchment / brass / ledger / coral) are kept stable
// across the codebase — only the underlying hues changed — so every
// component that already reads from these tokens re-themes automatically.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0C0A12",
          50: "#F5F3FA",
          100: "#E7E3F3",
          200: "#C7C0DD",
          300: "#9F94BC",
          400: "#6F6390",
          500: "#4C4368",
          600: "#332C4C",
          700: "#221D34", // card surface, dark mode
          800: "#151220", // primary dark background
          900: "#0C0A12", // deepest background
          950: "#060510",
        },
        parchment: {
          DEFAULT: "#F5F2FB", // primary light background
          100: "#FFFFFF",
          200: "#F5F2FB",
          300: "#E9E3F6",
          400: "#D8CFEC",
        },
        brass: {
          DEFAULT: "#7C3AED", // signature accent — royal purple
          light: "#A78BFA",
          dark: "#5B21B6",
        },
        ledger: {
          DEFAULT: "#188A5A", // growth / positive signal
          light: "#22B378",
          dark: "#0F5D3C",
        },
        coral: {
          DEFAULT: "#DC4C3E",
        },
        slate: {
          DEFAULT: "#544B6B",
        },
      },
      fontFamily: {
        display: ["var(--font-spartan)", "Arial Black", "sans-serif"],
        body: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        accent: ["var(--font-instrument)", "Georgia", "serif"],
      },
      backgroundImage: {
        "ledger-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, currentColor 39px, currentColor 40px)",
        "grid-lines":
          "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(12, 10, 18, 0.06), 0 8px 24px -8px rgba(12, 10, 18, 0.16)",
        "card-hover": "0 4px 10px rgba(12, 10, 18, 0.10), 0 20px 44px -14px rgba(12, 10, 18, 0.30)",
        stamp: "0 0 0 1px rgba(124, 58, 237, 0.4)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-tick": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
      borderRadius: {
        xl2: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
