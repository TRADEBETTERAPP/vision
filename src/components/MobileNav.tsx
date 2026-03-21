"use client";

import { useState, useCallback, useEffect } from "react";
import { NAV_ITEMS } from "./nav-items";

export { NAV_ITEMS } from "./nav-items";

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
        className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:text-foreground"
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
          className="fixed inset-0 top-14 z-40 bg-background backdrop-blur-md"
          data-testid="mobile-nav-overlay"
        >
          <nav
            className="flex flex-col gap-1 px-4 py-6"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-4 py-3 text-base font-medium text-secondary transition-colors hover:bg-surface hover:text-foreground"
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
