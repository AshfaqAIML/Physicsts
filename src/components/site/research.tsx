"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, CircleDashed, Landmark, Printer, Tag } from "lucide-react";
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
  // If a print dialogue outlives our patience, still clean up the mode.
  const printTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The print chip — the handler walks up from here to its dialog.
  const areaChipRef = useRef<HTMLButtonElement | null>(null);
  useEffect(
    () => () => {
      if (printTimerRef.current) clearTimeout(printTimerRef.current);
      document.documentElement.classList.remove("area-printing");
    },
    []
  );

  /** AREA OFFPRINT — paper receives the open research area alone:
   * kicker, equation, the short brief, concepts, and the shelf. The
   * interactive ask-assistant stays on screen; provenance is inked
   * from the site address so the copy knows where it came from. The
   * area's own dialogue is marked `print-target` — a stacked dialogue
   * underneath never leaks onto the page. */
  const handlePrintArea = () => {
    if (!openArea) return;
    const url = `${window.location.origin}${window.location.pathname}#research`;
    const slot = document.querySelector('[data-area-print="url"]');
    if (slot) slot.textContent = url;

    const root = document.documentElement;
    // The button lives inside the area's own dialogue — that one prints.
    const dialog = areaChipRef.current?.closest('[role="dialog"]');
    const finish = () => {
      root.classList.remove("area-printing");
      dialog?.classList.remove("print-target");
      if (printTimerRef.current) clearTimeout(printTimerRef.current);
    };
    root.classList.add("area-printing");
    dialog?.classList.add("print-target");
    window.addEventListener("afterprint", finish, { once: true });
    window.print();
    // afterprint is unreliable in some embedded browsers — a safety net.
    printTimerRef.current = setTimeout(finish, 1200);
  };

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
      className="relative section-pad bg-chart-grid"
    >
      <div className="shell">
        <SectionHeading
          index="02"
          headingId="research-heading"
          eyebrow="Research Interests"
          title="Mapping the Frontiers of Curiosity."
          lede="The directions I read toward and think about — a map of interests being earned, not a list of credentials claimed."
          meta="Index · 6 directions"
        />

        {/* The index — a journal table of contents, not a card grid.
            Each direction is a full-width entry: folio numeral, the
            words, the equation set on its plate, and a cue. */}
        <div className="section-flow border-t border-border">
          {researchAreas.map((area, i) => (
            <Reveal key={area.id} delay={0.04 * i}>
              <button
                type="button"
                onClick={() => setOpenArea(area)}
                aria-haspopup="dialog"
                aria-label={`Open research area: ${area.title}`}
                className="group relative flex w-full flex-col gap-5 border-b border-border py-7 pl-4 pr-4 text-left transition-colors duration-300 hover:bg-accent/30 focus-visible:bg-accent/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring active:bg-accent/50 sm:pl-6 lg:grid lg:grid-cols-[84px_minmax(0,1fr)_minmax(260px,320px)_44px] lg:items-center lg:gap-x-9 lg:py-9"
              >
                {/* Folio numeral */}
                <span
                  aria-hidden="true"
                  className="type-folio text-muted-foreground transition-all duration-300 group-hover:text-photon"
                >
                  {area.index}
                </span>

                {/* The words */}
                <span className="block">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="type-h3 text-foreground">
                      {area.title}
                    </span>
                    <span className="meta-sm text-muted-foreground">
                      {area.tagline}
                    </span>
                  </span>
                  <span className="mt-2.5 block max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {area.summary}
                  </span>
                </span>

                {/* The equation, set on its plate */}
                <span className="plate-box block overflow-x-auto text-foreground/85 transition-colors duration-300 group-hover:border-photon/40">
                  <Tex math={area.equation} ariaLabel={area.equationLabel} />
                </span>

                {/* Cue */}
                <ArrowUpRight
                  className="hidden size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-photon lg:block"
                  aria-hidden="true"
                />
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10">
          <p className="text-center meta-sm text-muted-foreground">
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
                {/* Offprint provenance — inked only by the area print mode */}
                <p
                  data-area-print="only"
                  className="hidden font-mono text-[9.5pt] uppercase tracking-[0.14em] text-black/70"
                >
                  The Physicist · Research Area · printed from the companion site ·{" "}
                  <span data-area-print="url" />
                </p>
                <p className="flex items-center gap-3 meta-sm text-photon">
                  <span>{openArea.index}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-border" />
                  <span>Area of Interest</span>
                </p>
                <DialogTitle className="type-h3-feature mt-3 text-left">
                  {openArea.title}
                </DialogTitle>
                <DialogDescription className="mt-2 eyebrow">
                  {openArea.tagline}
                </DialogDescription>
                {/* Desk line — honest counts plus the paper deed */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <p className="meta-xs text-muted-foreground">
                    {openArea.concepts.length} related concepts · {openArea.reading.length} on the shelf
                  </p>
                  <button
                    ref={areaChipRef}
                    type="button"
                    onClick={handlePrintArea}
                    aria-label="Print this research area as an archival offprint"
                    data-print="hide"
                    className="chip-btn"
                  >
                    <Printer className="size-3" aria-hidden="true" />
                    Print
                  </button>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-8">
                <div className="equation-plate mt-2 text-center text-foreground/90">
                  <Tex display math={openArea.equation} ariaLabel={openArea.equationLabel} />
                  <p className="mt-3 meta-sm text-muted-foreground">
                    {openArea.equationLabel}
                  </p>
                </div>

                <p className="leading-[1.85] text-muted-foreground">{openArea.detail}</p>

                {/* Established science vs open questions — the honest ledger.
                    A solid plate for what is settled; a dashed plate for the
                    frontier, matching the site's placeholder semantics. */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background/60 p-4">
                    <h4 className="flex items-center gap-2 meta-sm text-muted-foreground">
                      <Landmark className="size-3.5 text-photon" aria-hidden="true" />
                      What is settled
                    </h4>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                      {openArea.established}
                    </p>
                  </div>
                  <div className="rounded-lg border border-dashed border-border p-4">
                    <h4 className="flex items-center gap-2 meta-sm text-muted-foreground">
                      <CircleDashed className="size-3.5 text-nebula" aria-hidden="true" />
                      Open questions
                    </h4>
                    <ul className="mt-2.5 space-y-2">
                      {openArea.openQuestions.map((q) => (
                        <li key={q} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                          <span aria-hidden="true" className="mt-1 h-1 w-1 shrink-0 rounded-full bg-nebula/70" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 meta-sm text-muted-foreground">
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
                  <h4 className="flex items-center gap-2 meta-sm text-muted-foreground">
                    <BookOpen className="size-3.5" aria-hidden="true" /> On the shelf
                  </h4>
                  <ul className="mt-3 divide-y divide-border border-y border-border">
                    {openArea.reading.map((r) => (
                      <li key={r.title} className="py-3">
                        <p className="text-sm font-medium text-foreground/90">{r.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.author}</p>
                        <p className="mt-1 text-xs italic text-muted-foreground">{r.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div data-print="hide">
                  <ResearchAsk key={openArea.id} area={openArea} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
