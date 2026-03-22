/**
 * Heading — typography primitive for section headings in the BETTER design system.
 *
 * Supports a terminal-accented label, main heading, and description.
 * Designed for the tradebetter-led visual hierarchy: bold, compressed,
 * and unmistakably BETTER.
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
        <p className="mb-2 font-terminal text-xs font-medium uppercase tracking-widest text-accent">
          {label}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg text-secondary",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
