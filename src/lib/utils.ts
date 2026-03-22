/**
 * Shared utility helpers for the BETTER design system.
 *
 * `cn` merges Tailwind classes with conflict resolution via tailwind-merge
 * and conditional class application via class-variance-authority (clsx).
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with conflict resolution.
 *
 * Combines clsx conditional class logic with tailwind-merge deduplication
 * so that later utility classes correctly override earlier ones.
 *
 * @example
 * cn("px-4 py-2", condition && "px-8") // → "py-2 px-8" when condition is true
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
