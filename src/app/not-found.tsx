import Link from "next/link";

/**
 * Custom 404 page — ensures direct-route attempts to non-existent paths
 * land on a coherent recovery surface instead of a generic error.
 *
 * Satisfies VAL-CROSS-008: deep links and refreshes handle gracefully.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-2 font-terminal text-sm font-medium uppercase tracking-widest text-accent">
        404
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mx-auto mb-8 max-w-md text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Explore the BETTER ecosystem roadmap from the home page.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Return to Home
      </Link>
    </div>
  );
}
