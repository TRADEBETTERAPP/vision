"use client";

/**
 * LiquidMetalCard — Nearly-transparent glass panel with liquid metal finish.
 *
 * VAL-VISUAL-030: Cards across the graph workspace and content surfaces use
 * glass-morphism (semi-transparent white backgrounds, white borders at low
 * opacity) with a liquid metal interactive finish (cursor-tracking metallic
 * sheen or equivalent radial-gradient effect).
 *
 * VAL-VISUAL-035: Cards are nearly transparent so the shader background shows
 * through. No backdrop-blur. Cursor-tracking metallic sheen clearly visible
 * on hover. Subtle inner glow adds depth without opacity.
 *
 * Glass-morphism base:
 *   - background: rgba(255, 255, 255, 0.04) — nearly transparent
 *   - border: 1px solid rgba(255, 255, 255, 0.12) — subtle edge
 *   - border-radius: 8px (rounded-lg)
 *   - NO backdrop-filter (removed to let shader show through)
 *
 * Liquid metal finish:
 *   - Cursor-tracking radial-gradient with metallic white/silver sheen
 *   - Center highlight: rgba(255, 255, 255, 0.38) — clearly visible over 0.08 base
 *   - Secondary metallic ring: rgba(200, 210, 255, 0.12) at 40% for depth
 *   - Activated on hover/interaction
 *   - CSS-only, no WebGL
 *
 * Hover state:
 *   - background: rgba(255, 255, 255, 0.08)
 *   - box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.03) — subtle inner glow
 */

import React, {
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LiquidMetalCardBaseProps {
  children: ReactNode;
  className?: string;
  /** Visual variant */
  variant?: "default" | "active" | "focused";
  /** Element to render as */
  as?: ElementType;
  /** External ref */
  ref?: Ref<HTMLElement>;
}

export type LiquidMetalCardProps = LiquidMetalCardBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof LiquidMetalCardBaseProps>;

// ---------------------------------------------------------------------------
// Variant classes
// ---------------------------------------------------------------------------

const VARIANT_CLASSES: Record<string, string> = {
  default: "",
  active: "ring-1 ring-[rgba(255,255,255,0.12)]",
  focused:
    "ring-1 ring-[rgba(255,255,255,0.40)] border-[rgba(255,255,255,0.30)]",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const LiquidMetalCard = forwardRef<HTMLElement, Omit<LiquidMetalCardProps, "ref">>(
  function LiquidMetalCard(
    {
      children,
      className,
      variant = "default",
      as: Component = "div",
      ...rest
    },
    externalRef
  ) {
    const internalRef = useRef<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Expose the internal ref to the external ref
    useImperativeHandle(externalRef, () => internalRef.current!, []);

    // Track cursor position relative to the card for the metallic sheen
    const handleMouseMove = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const el = internalRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--metal-x", `${x}%`);
        el.style.setProperty("--metal-y", `${y}%`);
      },
      []
    );

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      const el = internalRef.current;
      if (el) {
        el.style.removeProperty("--metal-x");
        el.style.removeProperty("--metal-y");
      }
    }, []);

    // Nearly-transparent glass base + liquid metal sheen via inline style
    // VAL-VISUAL-035: 0.04 base / 0.08 hover — shader visible through cards
    const baseBackground = isHovered
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(255, 255, 255, 0.04)";

    const inlineStyle: React.CSSProperties = {
      background: isHovered
        ? `radial-gradient(circle at var(--metal-x, 50%) var(--metal-y, 50%), rgba(255, 255, 255, 0.38) 0%, rgba(200, 210, 255, 0.12) 40%, transparent 70%), ${baseBackground}`
        : baseBackground,
      border: "1px solid rgba(255, 255, 255, 0.12)",
      // No backdrop-filter — removed to let shader background show through
      boxShadow: isHovered ? "inset 0 0 30px rgba(255, 255, 255, 0.03)" : "none",
      transition: "background 0.2s ease, box-shadow 0.2s ease",
      ...(rest.style ?? {}),
    };

    // Merge testid: use provided data-testid or default
    const testId =
      (rest as Record<string, unknown>)["data-testid"] ?? "liquid-metal-card";

    return (
      <Component
        ref={internalRef}
        className={cn(
          "rounded-lg",
          VARIANT_CLASSES[variant],
          className
        )}
        style={inlineStyle}
        data-testid={testId}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
