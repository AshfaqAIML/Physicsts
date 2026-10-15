import { FileText, Hourglass } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { publicationTypes, publicationsEmptyState } from "@/content/publications";

/**
 * PUBLICATIONS — an honest empty state. No fabricated papers, no
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
        />

        <Reveal delay={0.05} className="mt-16">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-border">
            {/* The (currently dormant) filter rail — honest about being inactive */}
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/80 px-5 py-4">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Filter
              </span>
              {publicationTypes.slice(0, 4).map((t) => (
                <span
                  key={t}
                  aria-disabled="true"
                  className="cursor-not-allowed rounded-full border border-dashed border-border/80 px-3 py-1 font-mono text-[10px] text-muted-foreground/50"
                >
                  {t}
                </span>
              ))}
              <span className="font-mono text-[10px] text-muted-foreground/50">+ year</span>
            </div>

            {/* Empty state */}
            <div className="relative bg-card px-6 py-16 text-center sm:px-12">
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

              <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur-sm">
                <Hourglass className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-serif text-2xl text-foreground sm:text-3xl">
                {publicationsEmptyState.headline}
              </h3>
              {publicationsEmptyState.body.map((p, i) => (
                <p key={i} className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                <FileText className="size-3" aria-hidden="true" />
                {publicationsEmptyState.note}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
