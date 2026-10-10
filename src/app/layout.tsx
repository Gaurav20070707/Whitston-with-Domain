import type { Metadata } from "next";
import { League_Spartan, Space_Grotesk, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { siteConfig } from "@/constants/site";
import { Providers } from "@/context/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveStatusStrip } from "@/components/layout/LiveStatusStrip";

const spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-spartan",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [{ url: "/images/whitston-logo.jpg", width: 716, height: 705, alt: "Whitston — build judgment early" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/whitston-logo.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spartan.variable} ${grotesk.variable} ${instrumentSerif.variable} ${plexMono.variable} font-body`}
      >
        <Providers>
          <div className="grain-overlay" aria-hidden="true" />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border-2 focus:border-ink-900 focus:bg-brass focus:px-4 focus:py-2 focus:font-bold focus:text-white"
          >
            Skip to main content
          </a>
          <LiveStatusStrip />
          <Navbar />
          <main id="main-content" className="relative">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
