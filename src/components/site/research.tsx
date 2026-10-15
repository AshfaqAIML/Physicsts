"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResearchAsk } from "@/components/site/research-ask";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Tex } from "@/components/site/tex";
import { researchAreas, type ResearchArea } from "@/content/research";
import { cn } from "@/lib/utils";

/**
 * RESEARCH INTERESTS — a map of curiosity, not a claim of expertise.
 * Each area opens into a detail view: introduction, concepts, reading.
 */
export function ResearchInterests() {
  const [openArea, setOpenArea] = useState<ResearchArea | null>(null);

  // External openers (command palette)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const area = researchAreas.find((a) => a.id === id);
      if (area) setOpenArea(area);
    };
    window.addEventListener("phys:open-research", onOpen);
    return () => window.removeEventListener("phys:open-research", onOpen);
  }, []);

  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="relative scroll-mt-24 bg-chart-grid py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="02"
          eyebrow="Research Interests"
          title="Mapping the Frontiers of Curiosity."
          lede="The directions I read toward and think about — a map of interests being earned, not a list of credentials claimed."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {researchAreas.map((area, i) => (
            <Reveal key={area.id} delay={0.05 * (i % 3)}>
              <button
                type="button"
                onClick={() => setOpenArea(area)}
                aria-haspopup="dialog"
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-card/80 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-photon/50 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-transparent before:via-photon/70 before:to-transparent before:transition-transform before:duration-500 hover:before:scale-x-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[11px] tabular-nums text-photon">
                    {area.index}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-photon"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-6 font-serif text-2xl leading-tight text-foreground">
                  {area.title}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {area.tagline}
                </p>

                <div className="my-5 overflow-hidden border-y border-border/70 bg-plot-grid py-4 text-center text-foreground/85">
                  <Tex math={area.equation} ariaLabel={area.equationLabel} />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{area.summary}</p>

                <span className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors group-hover:text-photon">
                  Explore this area →
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
            These are directions of study and fascination — not claimed
            specialisations.
          </p>
        </Reveal>
      </div>

      {/* Detail view */}
      <Dialog open={openArea !== null} onOpenChange={(o) => !o && setOpenArea(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          {openArea && (
            <>
              <DialogHeader className="text-left">
                <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-photon">
                  <span>{openArea.index}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-border" />
                  <span>Area of Interest</span>
                </p>
                <DialogTitle className="mt-3 font-serif text-3xl leading-tight">
                  {openArea.title}
                </DialogTitle>
                <DialogDescription className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                  {openArea.tagline}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-8">
                <div className="equation-plate mt-2 text-center text-foreground/90">
                  <Tex display math={openArea.equation} ariaLabel={openArea.equationLabel} />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {openArea.equationLabel}
                  </p>
                </div>

                <p className="leading-[1.85] text-muted-foreground">{openArea.detail}</p>

                <div>
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <Tag className="size-3.5" aria-hidden="true" /> Related concepts
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {openArea.concepts.map((c) => (
                      <li
                        key={c}
                        className={cn(
                          "rounded-full border border-border bg-background/60 px-3 py-1",
                          "font-mono text-[11px] text-muted-foreground"
                        )}
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <BookOpen className="size-3.5" aria-hidden="true" /> On the shelf
                  </h4>
                  <ul className="mt-3 divide-y divide-border border-y border-border">
                    {openArea.reading.map((r) => (
                      <li key={r.title} className="py-3">
                        <p className="text-sm font-medium text-foreground/90">{r.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.author}</p>
                        <p className="mt-1 text-xs italic text-muted-foreground/80">{r.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <ResearchAsk key={openArea.id} area={openArea} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
