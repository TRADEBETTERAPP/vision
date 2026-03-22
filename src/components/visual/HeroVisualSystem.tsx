"use client";

import { useSyncExternalStore } from "react";
import { VisualEffectsProvider } from "./VisualEffectsProvider";
import { HeroShaderCanvas } from "./HeroShaderCanvas";
import { AsciiBackground } from "./AsciiBackground";

/**
 * HeroVisualSystem — immersive BETTER atmosphere for the hero section.
 *
 * Visual layers (back to front):
 * 1. Radiant-influenced shader canvas — organic blue depth field (WebGL, client-only)
 * 2. ASCII terminal atmosphere — structured Hermes-inspired text overlay
 * 3. Scanline overlay — CSS-only terminal texture
 * 4. Vignette gradient — readability protection for hero content
 *
 * Motion strategy (VAL-VISUAL-011): exactly 3 intentional motions:
 *   M1 — Shader canvas: slow organic drift (~0.06x speed)
 *   M2 — ASCII layer: sparse character transitions (~4fps, 5% of chars per cycle)
 *   M3 — Hero entrance: content fades in on mount via CSS (one-shot, no loop)
 *
 * Content-first (VAL-VISUAL-001): children render at z-10 immediately.
 * CSS-only layers render on server; WebGL/ASCII mount after hydration.
 *
 * Reduced-motion (VAL-VISUAL-003): all 3 motions stop; static layers persist.
 * Fallback (VAL-VISUAL-004): WebGL failure → CSS gradient + static ASCII remain.
 */

const emptySubscribe = () => () => {};

export function HeroVisualSystem({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR-safe mount detection for client-only layers
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <VisualEffectsProvider>
      <div
        data-testid="hero-visual-system"
        className="relative overflow-hidden"
      >
        {/* Layer 0: CSS-only radiant fallback gradient (always visible, no JS) */}
        <div
          className="hero-radiant-fallback absolute inset-0"
          aria-hidden="true"
          data-testid="hero-radiant-fallback"
        />

        {/* Layer 1: WebGL Radiant shader (client-only, graceful fallback) */}
        {hasMounted && <HeroShaderCanvas />}

        {/* Layer 2: Hermes ASCII terminal atmosphere (client-only) */}
        {hasMounted && <AsciiBackground />}

        {/* Layer 3: CSS scanline overlay — terminal texture */}
        <div
          className="scanline-overlay absolute inset-0 z-[3]"
          aria-hidden="true"
        />

        {/* Layer 4: Vignette + readability gradient */}
        <div
          className="hero-vignette absolute inset-0 z-[4]"
          aria-hidden="true"
        />

        {/* Layer 10: Content — M3 entrance animation via CSS */}
        <div
          data-testid="hero-content"
          className="hero-entrance relative z-10"
        >
          {children}
        </div>
      </div>
    </VisualEffectsProvider>
  );
}
