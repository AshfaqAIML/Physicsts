import Link from "next/link";
import { ArrowLeft, Orbit } from "lucide-react";

/**
 * 404 — outside the light cone of this site.
 */
export default function NotFound() {
  return (
    <div className="bg-chart-grid flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="flex items-center gap-3 eyebrow-wide text-muted-foreground">
        <span aria-hidden="true" className="inline-block h-px w-10 bg-photon/70" />
        HTTP 404 · Outside the Light Cone
      </p>

      <h1 className="mt-7 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
        This page exists in your future — or in someone else&rsquo;s
        observable universe.
      </h1>

      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        No signal from this location has ever reached us. The page you
        requested is either beyond our horizon or never formed at all —
        spacetime, like publishing, keeps its own schedule.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2.5 rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Return to the observable universe
        </Link>
      </div>

      <p className="mt-14 flex items-center gap-2 eyebrow text-muted-foreground">
        <Orbit className="size-3.5" aria-hidden="true" />
        The Physicist · single-world line
      </p>
    </div>
  );
}
