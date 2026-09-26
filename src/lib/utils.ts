import { clsx, type ClassValue } from "clsx";

/** Joins conditional class names, filtering out falsy values. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Formats an ISO date string as "Jan 15, 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
