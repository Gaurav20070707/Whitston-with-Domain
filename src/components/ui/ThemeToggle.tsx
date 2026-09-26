"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-16 shrink-0 items-center rounded-lg border-2 border-ink-900/20 bg-ink-900/5 transition-colors duration-300 dark:border-parchment-100/25 dark:bg-parchment-100/10",
        className
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md bg-parchment-100 text-ink-900 shadow-sm transition-transform duration-300 ease-out dark:bg-brass dark:text-ink-900",
          isDark ? "translate-x-[32px]" : "translate-x-1"
        )}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" aria-hidden="true" /> : <Sun className="h-3.5 w-3.5" aria-hidden="true" />}
      </span>
    </button>
  );
}
