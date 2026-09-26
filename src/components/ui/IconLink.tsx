import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
  variant?: "solid" | "outline";
  className?: string;
}

/**
 * Squared icon button used for social/contact links. Always includes an
 * accessible label via `aria-label` + visually-hidden text, since the icon
 * alone isn't enough context for screen reader users.
 */
export function IconLink({
  href,
  label,
  icon: Icon,
  external = true,
  variant = "outline",
  className,
}: IconLinkProps) {
  const isPlaceholder = href === "#";

  return (
    <a
      href={href}
      aria-label={label}
      title={isPlaceholder ? `${label} (link coming soon)` : label}
      target={external && !href.startsWith("mailto:") && !href.startsWith("tel:") ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "brutal-edge group inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 transition-colors duration-200",
        variant === "outline" &&
          "border-ink-900/20 bg-transparent text-ink-800 hover:border-brass hover:bg-brass/5 hover:text-brass-dark dark:border-parchment-100/25 dark:text-parchment-200 dark:hover:border-brass-light dark:hover:text-brass-light",
        variant === "solid" &&
          "border-ink-900 bg-ink-900 text-parchment-100 hover:bg-brass hover:text-white dark:border-parchment-100 dark:bg-parchment-100/10 dark:hover:bg-brass-light dark:hover:text-ink-900",
        className
      )}
    >
      <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </a>
  );
}
