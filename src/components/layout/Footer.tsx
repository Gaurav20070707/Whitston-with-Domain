import Link from "next/link";
import { Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig, navLinks, contactHrefs } from "@/constants/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { IconLink } from "@/components/ui/IconLink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-ink-900 bg-parchment-200 dark:border-parchment-100 dark:bg-ink-950">
      <Container className="py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
              <Logo />
              <span className="font-display text-xl font-black uppercase text-ink-900 dark:text-parchment-100">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600 dark:text-ink-200">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brass-dark dark:text-brass-light">
              {"// Navigate"}
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink-700 transition-colors hover:text-brass-dark dark:text-parchment-200 dark:hover:text-brass-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brass-dark dark:text-brass-light">
              {"// Explore"}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/stock-game"
                  className="text-sm font-medium text-ink-700 transition-colors hover:text-brass-dark dark:text-parchment-200 dark:hover:text-brass-light"
                >
                  Market Simulator
                </Link>
              </li>
              <li>
                <Link
                  href="/case-decks"
                  className="text-sm font-medium text-ink-700 transition-colors hover:text-brass-dark dark:text-parchment-200 dark:hover:text-brass-light"
                >
                  Case Decks
                </Link>
              </li>
              <li>
                <a
                  href={contactHrefs.email}
                  className="text-sm font-medium text-ink-700 transition-colors hover:text-brass-dark dark:text-parchment-200 dark:hover:text-brass-light"
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brass-dark dark:text-brass-light">
              {"// Connect"}
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <IconLink href={contactHrefs.instagram} label="Whitston on Instagram" icon={Instagram} />
              <IconLink href={contactHrefs.linkedin} label="Whitston on LinkedIn" icon={Linkedin} />
              <IconLink href={contactHrefs.email} label="Email Whitston" icon={Mail} external={false} />
              <IconLink href={contactHrefs.whatsapp} label="Whitston WhatsApp community" icon={MessageCircle} />
              <IconLink href={contactHrefs.phone} label="Call Whitston" icon={Phone} external={false} />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t-2 border-ink-900/10 pt-8 text-xs text-ink-600 dark:border-parchment-100/15 dark:text-ink-300 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-wide">Built for students, by students.</p>
        </div>
      </Container>
    </footer>
  );
}
