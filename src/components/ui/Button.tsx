/**
 * Button — CVA-based button primitive for the BETTER design system.
 *
 * tradebetter-exact CTA styling (VAL-VISUAL-031):
 * - ALL CTAs are SQUARE: border-radius: 0px (brutalist, no rounded corners)
 * - Monospace text (IBM Plex Mono), UPPERCASE, -0.08em tracking
 * - Primary: solid white bg, dark text, white glow on hover
 * - Secondary: transparent bg, white border, no glow
 * - Ghost: minimal-chrome for tertiary / nav actions
 * - Live: green-accented for live-destination CTAs
 *
 * Sizes: `sm`, `md`, `lg`
 */
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  /* base — SQUARE corners (0px radius), monospace, uppercase, tight tracking */
  "inline-flex items-center justify-center font-terminal font-medium uppercase tracking-[-0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 rounded-none",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-[#101010] hover:shadow-[0px_0px_16px_0px_rgba(255,255,255,0.75)] font-semibold",
        secondary:
          "border border-white text-white hover:bg-white/10",
        ghost:
          "text-secondary hover:text-foreground hover:bg-surface",
        live:
          "bg-accent-green text-[#101010] hover:bg-accent-green/90 font-semibold",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-sm",
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
