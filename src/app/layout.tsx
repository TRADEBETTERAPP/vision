import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { NAV_ITEMS } from "@/components/nav-items";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BETTER — Vision & Ecosystem Roadmap",
  description:
    "The canonical future-state artifact for the BETTER ecosystem: roadmap, tokenomics, architecture, and interactive strategy atlas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
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
          className="font-terminal text-lg font-bold tracking-wider text-accent"
          aria-label="BETTER home"
        >
          BETTER<span className="text-muted">_</span>
        </Link>

        {/* Desktop navigation */}
        <div
          className="hidden items-center gap-6 text-sm font-medium text-secondary sm:flex"
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
