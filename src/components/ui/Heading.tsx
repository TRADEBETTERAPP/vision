/**
 * Heading — typography primitive for section headings in the BETTER design system.
 *
 * tradebetter-exact heading treatment (VAL-VISUAL-031):
 * - ALL headings: UPPERCASE, -0.06em tracking, pure white
 * - Font: Helvetica Neue Medium (shipped as Geist Sans via --font-display)
 * - Label: IBM Plex Mono, uppercase, tight tracking, accent color
 * - Description: IBM Plex Mono, #a0a0a0
 */
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends HTMLAttributes<HTMLDivElement> {
  /** Small terminal-styled label above the heading */
  label?: string;
  /** Main heading text */
  title: string;
  /** Supporting description below the heading */
  description?: string;
  /** Text alignment */
  align?: "center" | "left";
}

export function Heading({
  label,
  title,
  description,
  align = "center",
  className,
  ...props
}: HeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
      {...props}
    >
      {label && (
        <p className="mb-2 font-terminal text-xs font-medium uppercase tracking-[-0.08em] text-accent">
          {label}
        </p>
      )}
      <h2 className="font-display text-3xl font-medium uppercase tracking-[-0.06em] text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 font-terminal text-lg text-secondary tracking-[-0.04em]",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
