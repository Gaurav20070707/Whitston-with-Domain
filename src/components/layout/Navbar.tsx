"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/constants/site";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthButton } from "@/components/auth/AuthButton";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "border-b-2 border-ink-900 bg-parchment-100/95 backdrop-blur-md dark:border-parchment-100 dark:bg-ink-900/95"
          : "border-b-2 border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
          <Logo className="h-7" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-600 transition-colors hover:text-brass-dark dark:text-parchment-300 dark:hover:text-brass-light",
                pathname === link.href && "text-ink-900 dark:text-parchment-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <AuthButton compact />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink-900/15 text-ink-900 md:hidden dark:border-parchment-100/20 dark:text-parchment-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="border-t-2 border-ink-900 bg-parchment-100 md:hidden dark:border-parchment-100 dark:bg-ink-900">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-ink-800 hover:bg-ink-900/5 dark:text-parchment-200 dark:hover:bg-parchment-100/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t-2 border-ink-900/10 px-3 pt-4 dark:border-parchment-100/15">
              <ThemeToggle />
              <AuthButton />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
