/**
 * Button — CVA-based button primitive for the BETTER design system.
 *
 * Variants:
 * - `primary`: BETTER blue filled button (dominant CTA)
 * - `secondary`: border-only button for secondary actions
 * - `ghost`: minimal-chrome button for tertiary / nav actions
 * - `live`: green accent button for live-destination CTAs
 *
 * Sizes: `sm`, `md`, `lg`
 */
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  /* base */
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-background hover:bg-accent-bright font-semibold",
        secondary:
          "border border-border text-secondary hover:border-accent hover:text-foreground",
        ghost:
          "text-secondary hover:text-foreground hover:bg-surface",
        live:
          "bg-accent-green text-background hover:bg-accent-green/90 font-semibold",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 rounded-md px-5 text-sm",
        lg: "h-12 rounded-md px-8 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a different element (e.g. anchor) via className forwarding */
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
