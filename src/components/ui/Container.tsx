import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)} {...rest}>
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
}

/** Consistent vertical rhythm wrapper for full-width page sections. */
export function Section({ children, className, id, ...rest }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)} {...rest}>
      {children}
    </section>
  );
}
