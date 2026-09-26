"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Google "G" mark, inline so we don't depend on an external icon asset. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

export function AuthButton({ compact = false }: { compact?: boolean }) {
  const { user, isLoading, error, signIn, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div
        className="h-10 w-10 animate-pulse rounded-lg border-2 border-ink-900/10 bg-ink-900/5 dark:border-parchment-100/10 dark:bg-parchment-100/10"
        aria-label="Checking sign-in status"
      />
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button variant="outline" size={compact ? "sm" : "md"} onClick={signIn} icon={<GoogleGlyph />} iconPosition="left">
          Sign in with Google
        </Button>
        {error && <p className="text-xs font-medium text-coral">{error}</p>}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="flex items-center gap-2 rounded-lg border-2 border-ink-900/15 py-1 pl-1 pr-3 transition-colors hover:border-brass dark:border-parchment-100/20"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brass text-sm font-bold text-white">
            {(user.displayName ?? user.email ?? "?").charAt(0).toUpperCase()}
          </div>
        )}
        {!compact && (
          <span className="max-w-[120px] truncate text-sm font-medium text-ink-800 dark:text-parchment-100">
            {user.displayName?.split(" ")[0] ?? "Account"}
          </span>
        )}
        <ChevronDown
          className={cn("h-4 w-4 text-ink-500 transition-transform", menuOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl2 border-2 border-ink-900 bg-parchment-100 shadow-[5px_5px_0_0_theme(colors.ink.900)] dark:border-parchment-100 dark:bg-ink-700 dark:shadow-[5px_5px_0_0_theme(colors.parchment.100)]"
        >
          <div className="border-b-2 border-dashed border-ink-900/15 px-4 py-3 dark:border-parchment-100/20">
            <p className="truncate text-sm font-semibold text-ink-900 dark:text-parchment-100">
              {user.displayName ?? "Whitston Student"}
            </p>
            <p className="truncate text-xs text-ink-500 dark:text-ink-200">{user.email}</p>
          </div>
          <button
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/5"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
