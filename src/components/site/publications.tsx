import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { publicationTypes, publicationsEmptyState } from "@/content/publications";

/**
 * PUBLICATIONS — an honest ledger, not an empty box. The written
 * record is presented as a journal page: the philosophy of the
 * section on the left, the index of contribution types on the
 * right with every count at zero. No fabricated papers, no
 * invented DOIs. The shelf is built; the books come later.
 */
export function Publications() {
  return (
    <section
      id="publications"
      aria-labelledby="publications-heading"
      className="relative scroll-mt-24 bg-chart-grid py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          eyebrow="Publications & Academic Contributions"
          title="The Written Record."
          lede="Journal articles, preprints, conference papers, posters, theses, reports, and essays — listed only once they verifiably exist."
          meta="Ledger · empty by design"
        />

        <Reveal delay={0.05} className="mt-14 lg:mt-16">
          <div className="grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-12">
            {/* The left leaf — the philosophy of the section */}
            <div className="relative flex flex-col justify-center p-8 sm:p-10 lg:col-span-7 lg:p-12">
              {/* A faint uncharted constellation — points not yet named */}
              <svg
                aria-hidden="true"
                viewBox="0 0 520 220"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16] dark:opacity-[0.22]"
                preserveAspectRatio="xMidYMid slice"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="0.75"
                  fill="none"
                  className="text-muted-foreground"
                >
                  <path d="M40 170 L105 120 L180 138 L255 82 L330 104 L410 58" />
                  <path d="M105 120 L150 60 M255 82 L305 30 M330 104 L390 160 M410 58 L480 96" />
                </g>
                <g className="text-photon">
                  {[
                    [40, 170], [105, 120], [180, 138], [255, 82], [330, 104],
                    [410, 58], [150, 60], [305, 30], [390, 160], [480, 96],
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={i % 3 === 0 ? 2.4 : 1.5}
                      fill="currentColor"
                    />
                  ))}
                </g>
              </svg>

              <p className="relative flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span aria-hidden="true" className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-photon/60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-photon" />
                </span>
                Status · open
              </p>
              <h3 className="relative mt-6 font-serif text-2xl text-foreground sm:text-3xl">
                {publicationsEmptyState.headline}
              </h3>
              {publicationsEmptyState.body.map((p, i) => (
                <p key={i} className="relative mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              <p className="relative mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                {publicationsEmptyState.note}
              </p>
            </div>

            {/* The right leaf — the ledger of contribution types */}
            <div className="border-t border-border lg:col-span-5 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between border-b border-border bg-accent/30 px-6 py-4 lg:px-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Index of contributions
                </span>
                <span className="font-mono text-[10px] tabular-nums text-photon">
                  {publicationTypes.length.toString().padStart(2, "0")} classes
                </span>
              </div>
              <ul aria-label="Publication types and their current counts">
                {publicationTypes.map((t) => (
                  <li
                    key={t}
                    className="group flex items-baseline gap-3 border-b border-border/60 px-6 py-3.5 last:border-b-0 lg:px-8"
                  >
                    <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                      {t}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px grow border-t border-dotted border-border"
                    />
                    <span
                      aria-label="0 entries"
                      className="font-mono text-[10px] tabular-nums text-muted-foreground/70"
                    >
                      000
                    </span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-border bg-accent/20 px-6 py-3.5 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/70 lg:px-8">
                Counts move when verified work exists — never before
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
