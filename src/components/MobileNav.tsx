"use client";

import { useState, useCallback, useEffect } from "react";
import { NAV_ITEMS } from "./nav-items";
import { BetterLogotype } from "./BetterLogotype";

export { NAV_ITEMS } from "./nav-items";

export const MOBILE_NAV_ITEMS = [
  ...NAV_ITEMS,
  { label: "Macro Thesis", href: "#graph-macro-thesis" },
  { label: "HFT Edge", href: "#graph-hft-edge" },
  { label: "LLM Product", href: "#graph-llm-product" },
  { label: "TRUTH-PERP & Flywheel", href: "#graph-truth-perp-flywheel" },
] as const;

/**
 * Mobile navigation overlay with hamburger toggle.
 * Satisfies VAL-NARR-004: mobile navigation exposes required destinations.
 * Satisfies VAL-NARR-005: labels are understandable without insider context.
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-white hover:text-foreground"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        onClick={toggle}
        data-testid="mobile-menu-button"
      >
        {isOpen ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-background/95 backdrop-blur-md"
          data-testid="mobile-nav-overlay"
        >
          <nav
            className="flex flex-col gap-1 px-4 py-6"
            aria-label="Mobile navigation"
          >
            {/* BETTER logotype in mobile overlay (VAL-VISUAL-019) */}
            <div className="mb-4 px-4">
              <BetterLogotype variant="mobile-overlay" data-testid="mobile-overlay-logotype" />
            </div>
            {MOBILE_NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-terminal rounded-md px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-surface hover:text-foreground"
                onClick={close}
                data-testid="mobile-nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
