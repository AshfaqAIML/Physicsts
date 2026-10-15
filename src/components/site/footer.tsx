import Link from "next/link";
import { ArrowUp, Orbit } from "lucide-react";
import { PhysicsHistory } from "@/components/site/physics-history";
import { navItems, site } from "@/content/site";

/**
 * FOOTER — the colophon. Quiet, mono, honest.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Identity */}
          <div>
            <Link
              href="#home"
              className="group inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full border border-border text-photon transition-colors group-hover:border-photon/50"
              >
                <Orbit className="size-4 transition-transform duration-700 ease-out group-hover:rotate-180" />
              </span>
              <span className="font-serif text-lg">{site.wordmark}</span>
            </Link>
            <p className="mt-4 max-w-xs font-serif text-base italic leading-relaxed text-muted-foreground">
              “{site.motto}”
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {site.observatoryNote}
            </p>
          </div>

          {/* Index */}
          <nav aria-label="Footer">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Index
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colophon */}
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Colophon
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Set in Instrument Serif, Inter, and IBM Plex Mono. Equations
              typeset by KaTeX; visualisations are original procedural work.
              Every fact on this site is real or clearly marked as a
              placeholder.
            </p>
            <a
              href="#home"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
              Back to orbit
            </a>
          </div>
        </div>
      </div>

      {/* Almanac — one real moment per month, full-bleed rule */}
      <PhysicsHistory />

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            © {new Date().getFullYear()} {site.name} · built with curiosity
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
            c² = 299 792 458 m/s · exact by definition
          </p>
        </div>
      </div>
    </footer>
  );
}
