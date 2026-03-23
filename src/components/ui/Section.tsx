/**
 * Section — layout primitive for page sections in the BETTER design system.
 *
 * Provides consistent vertical spacing, max-width containment, and optional
 * border-top divider. Replaces ad-hoc section + div patterns with a
 * composable, typed primitive.
 */
import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva(
  /* base — horizontal padding + centered container */
  "px-4 sm:px-6 lg:px-8",
  {
    variants: {
      spacing: {
        /** Standard page section spacing — tradebetter 100px (py-[100px]) */
        default: "py-[100px]",
        /** Tighter spacing for secondary / legend sections — 80px */
        compact: "py-[80px]",
        /** Hero-level generous spacing */
        hero: "py-0",
        /** Large section spacing — tradebetter 136px */
        large: "py-[136px]",
      },
      container: {
        /** Standard content width */
        default: "[&>*]:mx-auto [&>*]:max-w-5xl",
        /** Wider layout for immersive content */
        wide: "[&>*]:mx-auto [&>*]:max-w-7xl",
        /** Full-width (no max-width constraint) */
        full: "",
      },
      divider: {
        /** Top border divider */
        top: "border-t border-border",
        /** No divider */
        none: "",
      },
    },
    defaultVariants: {
      spacing: "default",
      container: "default",
      divider: "top",
    },
  }
);

export interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

export function Section({
  className,
  spacing,
  container,
  divider,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ spacing, container, divider }), className)}
      {...props}
    />
  );
}
