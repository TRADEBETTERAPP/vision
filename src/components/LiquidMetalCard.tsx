"use client";

/**
 * LiquidMetalCard — Glass-morphism card with liquid metal interactive finish.
 *
 * VAL-VISUAL-030: Cards across the graph workspace and content surfaces use
 * glass-morphism (semi-transparent white backgrounds, white borders at low
 * opacity) with a liquid metal interactive finish (cursor-tracking metallic
 * sheen or equivalent radial-gradient effect).
 *
 * Glass-morphism base:
 *   - background: rgba(255, 255, 255, 0.10)
 *   - border: 1px solid rgba(255, 255, 255, 0.20)
 *   - border-radius: 8px (rounded-lg)
 *   - backdrop-filter: blur(10px)
 *
 * Liquid metal finish:
 *   - Cursor-tracking radial-gradient with metallic blue (#455eff) sheen
 *   - Activated on hover/interaction
 *   - CSS-only, no WebGL
 *
 * Hover state:
 *   - background: rgba(255, 255, 255, 0.15)
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
  active: "ring-1 ring-[rgba(69,94,255,0.30)]",
  focused:
    "ring-1 ring-[rgba(69,94,255,0.50)] border-[rgba(69,94,255,0.35)]",
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

    // Glass-morphism base + liquid metal sheen via inline style
    const baseBackground = isHovered
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(255, 255, 255, 0.10)";

    const inlineStyle: React.CSSProperties = {
      background: isHovered
        ? `radial-gradient(circle at var(--metal-x, 50%) var(--metal-y, 50%), rgba(69, 94, 255, 0.25) 0%, transparent 60%), ${baseBackground}`
        : baseBackground,
      border: "1px solid rgba(255, 255, 255, 0.20)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
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
