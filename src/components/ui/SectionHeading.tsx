import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Shared heading treatment: a small "// filed under" mono eyebrow label
 * beside a hairline rule, above a bold, uppercase, tight-tracked display
 * title. Used consistently across landing sections and inner pages so the
 * type system reads as one voice.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl border-l-4 border-brass pl-4 md:pl-6",
        align === "center" && "mx-auto border-l-0 pl-0 text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brass-dark dark:text-brass-light">
          {align !== "center" && <span aria-hidden="true">{"//"}</span>}
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink-900 dark:text-parchment-100 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 font-body text-base leading-relaxed text-ink-600 dark:text-ink-200 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
