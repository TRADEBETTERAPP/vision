import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { BetterLogotype } from "@/components/BetterLogotype";
import { NAV_ITEMS } from "@/components/nav-items";
import { SiteAtmosphere } from "@/components/visual/SiteAtmosphere";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * IBM Plex Mono — tradebetter-led terminal UI typography.
 * Extracted from tradebetter.app Framer source: primary UI/body font.
 * Design system ref: .factory/library/design-system.md § Tradebetter Theme Signals
 */
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BETTER — Vision & Ecosystem Roadmap",
  description:
    "The canonical future-state artifact for the BETTER ecosystem: roadmap, tokenomics, architecture, and interactive strategy atlas.",
  metadataBase: new URL("https://better-vision.vercel.app"),
  openGraph: {
    title: "BETTER — Vision & Ecosystem Roadmap",
    description:
      "Interactive roadmap, whale-first tokenomics, architecture deep-dives, and scenario projections for the BETTER prediction-market intelligence ecosystem.",
    siteName: "BETTER Vision",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BETTER — Vision & Ecosystem Roadmap",
    description:
      "Interactive roadmap, whale-first tokenomics, architecture deep-dives, and scenario projections for the BETTER ecosystem.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <SiteAtmosphere>
          <main className="flex-1">{children}</main>
        </SiteAtmosphere>
        <Footer />
      </body>
    </html>
  );
}

/**
 * Desktop + mobile navigation header.
 * Satisfies VAL-NARR-004: clear paths to what BETTER is, what is live,
 * roadmap, tokenomics, evidence/sources, and risks/caveats.
 * Satisfies VAL-NARR-005: labels are understandable without insider context.
 */
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="flex items-center"
          aria-label="BETTER home"
        >
          <BetterLogotype variant="header" data-testid="header-logotype" />
        </Link>

        {/* Desktop navigation */}
        <div
          className="hidden items-center gap-6 font-terminal text-sm font-medium text-secondary sm:flex"
          data-testid="desktop-nav"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
              data-testid="desktop-nav-link"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile navigation (client component) */}
        <MobileNav />
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-terminal text-sm text-muted">
            © {new Date().getFullYear()} BETTER. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            This site presents the BETTER ecosystem vision. Maturity labels
            distinguish live features from planned and speculative roadmap
            items.
          </p>
        </div>
      </div>
    </footer>
  );
}
