import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

// "Stamped" brutalist buttons: a bold 2px border, an offset hard shadow on
// hover, and uppercase tracked labels — the signature interactive motif
// reused across cards and badges elsewhere in the redesign.
const variantStyles: Record<Variant, string> = {
  primary:
    "brutal-edge bg-brass text-white border-2 border-ink-900 shadow-[3px_3px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:shadow-[3px_3px_0_0_theme(colors.parchment.100)] hover:bg-brass-dark",
  secondary:
    "brutal-edge bg-parchment-100 text-ink-900 border-2 border-ink-900 shadow-[3px_3px_0_0_theme(colors.brass.DEFAULT)] dark:bg-ink-700 dark:text-parchment-100 dark:border-parchment-100 dark:shadow-[3px_3px_0_0_theme(colors.brass.light)]",
  outline:
    "brutal-edge-accent bg-transparent text-ink-900 border-2 border-ink-900 dark:text-parchment-100 dark:border-parchment-100 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10",
  ghost:
    "text-ink-800 hover:bg-ink-900/5 dark:text-parchment-100 dark:hover:bg-parchment-100/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-4 py-2 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-sm md:text-base px-7 py-3.5 gap-2.5",
};

const base =
  "inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-wide font-body transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-parchment dark:focus-visible:ring-offset-ink-800 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  href?: undefined;
}

interface ButtonAsLink
  extends CommonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Polymorphic Button — renders a <button>, an internal Next.js <Link>, or an
 * external <a> depending on whether `href` (and `external`) are supplied.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    children,
    className,
    icon,
    iconPosition = "right",
    ...rest
  } = props;

  const classes = cn(base, variantStyles[variant], sizeStyles[size], className);
  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external, ...anchorRest } = rest as ButtonAsLink;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
