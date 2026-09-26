import type { Metadata } from "next";
import { ArrowUpRight, LineChart, ShieldCheck, Trophy, Zap } from "lucide-react";
import { Section, Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { stockGameConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Stock Market Game",
  description: stockGameConfig.shortDescription,
};

const highlights = [
  {
    icon: LineChart,
    title: "Real-time-style pricing",
    description: "Practice reading price movement the way real markets behave.",
  },
  {
    icon: ShieldCheck,
    title: "Zero real-world risk",
    description: "Every trade is simulated — learn by doing without financial exposure.",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Compete with classmates and track your standing over time.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    description: "See the outcome of every decision immediately, not weeks later.",
  },
];

export default function StockGamePage() {
  const isLive = stockGameConfig.status === "live";

  return (
    <Section className="pt-16 md:pt-20">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg border-2 border-brass bg-brass/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brass-dark dark:text-brass-light">
              {isLive ? "Live simulator" : "Coming soon"}
            </span>
            <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink-900 dark:text-parchment-100 sm:text-5xl">
              {stockGameConfig.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 dark:text-ink-200 md:text-lg">
              {stockGameConfig.shortDescription}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                href={stockGameConfig.launchUrl}
                external
                size="lg"
                icon={<ArrowUpRight className="h-5 w-5" />}
              >
                Launch Game
              </Button>
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-ink-500 dark:text-ink-300">
                Opens in a new tab
              </span>
            </div>

            {stockGameConfig.launchUrl === "https://placeholder.com" && (
              <p className="mt-4 text-xs text-ink-500 dark:text-ink-300">
                This button currently points to a placeholder link. Update{" "}
                <code className="rounded bg-ink-900/5 px-1.5 py-0.5 font-mono dark:bg-parchment-100/10">
                  stockGameConfig.launchUrl
                </code>{" "}
                in{" "}
                <code className="rounded bg-ink-900/5 px-1.5 py-0.5 font-mono dark:bg-parchment-100/10">
                  src/constants/site.ts
                </code>{" "}
                once the real game is deployed.
              </p>
            )}
          </div>

          {/* Illustration placeholder */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 border-2 border-ink-900 bg-gradient-to-br from-ink-900 via-ink-700 to-brass-dark shadow-[6px_6px_0_0_theme(colors.brass.DEFAULT)] dark:border-parchment-100">
              <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Stylized rising market chart">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g opacity="0.15" stroke="#F5F2FB" strokeWidth="1">
                  {[60, 110, 160, 210, 260].map((y) => (
                    <line key={y} x1="20" y1={y} x2="380" y2={y} />
                  ))}
                </g>
                <path
                  d="M20 220 L80 200 L140 230 L200 150 L260 175 L320 90 L380 60"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 220 L80 200 L140 230 L200 150 L260 175 L320 90 L380 60 L380 280 L20 280 Z"
                  fill="url(#chartFill)"
                />
                {[
                  [20, 220],
                  [140, 230],
                  [200, 150],
                  [320, 90],
                  [380, 60],
                ].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#F5F2FB" stroke="#7C3AED" strokeWidth="2" />
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="brutal-edge rounded-xl2 border-2 border-ink-900 bg-parchment-100 p-6 shadow-[4px_4px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[4px_4px_0_0_theme(colors.parchment.100)]"
            >
              <item.icon className="h-6 w-6 text-brass-dark dark:text-brass-light" aria-hidden="true" />
              <h3 className="mt-4 font-display text-base font-bold text-ink-900 dark:text-parchment-100">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-200">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
