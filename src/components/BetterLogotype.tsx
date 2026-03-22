/**
 * BetterLogotype — renders the provided BETTER logotype SVG asset.
 *
 * VAL-VISUAL-019: The provided asset replaces text wordmarks across key shell surfaces.
 * VAL-VISUAL-023: Usage is traceable to the provided asset at
 *   /Users/test/Downloads/Better_Design/Logo/Better_Logotype_Light.svg
 *   → copied into the repo at /public/better-logotype.svg
 *
 * The logotype is used in three surfaces:
 *   - Header (navigation bar)
 *   - Hero (dominant above-the-fold brand signal)
 *   - Mobile navigation overlay
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BetterLogotypeProps {
  /** Visual context: header, hero, or mobile-overlay */
  variant?: "header" | "hero" | "mobile-overlay";
  /** Additional class names */
  className?: string;
  /** data-testid for testing */
  "data-testid"?: string;
}

const variantStyles = {
  header: "h-6 w-auto sm:h-7",
  hero: "h-16 w-auto sm:h-20 lg:h-24",
  "mobile-overlay": "h-7 w-auto",
} as const;

export function BetterLogotype({
  variant = "header",
  className,
  "data-testid": testId,
}: BetterLogotypeProps) {
  return (
    <Image
      src="/better-logotype.svg"
      alt="BETTER"
      width={966}
      height={376}
      priority={variant === "hero"}
      data-testid={testId}
      className={cn(variantStyles[variant], "object-contain", className)}
      // Inline SVGs for immediate render (no layout shift)
      unoptimized
    />
  );
}
