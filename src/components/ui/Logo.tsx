import { cn } from "@/lib/utils";

/**
 * The Whitston mark: a squared case-file block with a monogram "W" cut from
 * a rising ticker line — nodding to both the market simulator and the
 * case-file/ledger visual language used across the site. Sharpened corners
 * (vs. the previous fully-rounded badge) match the new editorial-brutalist
 * identity while keeping the same silhouette for brand continuity.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Whitston logo"
    >
      <rect x="1" y="1" width="38" height="38" rx="4" className="fill-ink-900 dark:fill-brass" />
      <rect x="1" y="1" width="38" height="38" rx="4" className="fill-none stroke-brass dark:stroke-ink-900" strokeWidth="1.5" />
      <path
        d="M9 14L14.5 27L20 17L25.5 27L31 14"
        stroke="currentColor"
        className="text-brass dark:text-ink-900"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
