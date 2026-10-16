"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookMarked, FlaskConical, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Tex } from "@/components/site/tex";
import { projectStatusCopy, projects, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * PROJECTS — a research-journal gallery. The five entries are
 * example concepts, clearly marked; the structure is the product.
 */
export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);

  // External openers (command palette)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const p = projects.find((x) => x.id === id);
      if (p) setOpen(p);
    };
    window.addEventListener("phys:open-project", onOpen);
    return () => window.removeEventListener("phys:open-project", onOpen);
  }, []);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          eyebrow="Research & Scientific Projects"
          title="Questions, Made Operational."
          lede="Projects where an idea becomes a computation, a visualisation, or an experiment you can run. The entries below are example concepts — placeholders demonstrating the structure, replaced by real work as it exists."
          meta="Briefs · 5 figures · examples"
        />

        {/* FIG. 01 — the lead brief breaks the grid: words on the
            left, the mathematics set large on an instrument plate. */}
        <Reveal className="mt-14 lg:mt-16">
          <button
            type="button"
            onClick={() => setOpen(projects[0])}
            aria-haspopup="dialog"
            aria-label={`Open project details: ${projects[0].title}`}
            className="group grid w-full overflow-hidden rounded-lg border border-border bg-card text-left transition-colors duration-300 hover:border-photon/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:border-photon/30 lg:grid-cols-12"
          >
            <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {projects[0].discipline}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-photon">
                  Fig. 01
                </span>
              </div>
              <h3 className="mt-5 font-serif text-3xl leading-[1.1] text-foreground sm:text-4xl">
                {projects[0].title}
              </h3>
              <p className="mt-4 font-serif text-lg italic leading-relaxed text-muted-foreground">
                “{projects[0].question}”
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors group-hover:text-photon">
                <BookMarked className="size-3.5" aria-hidden="true" />
                Open the full brief
                <ArrowUpRight
                  className="size-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div className="relative flex items-center justify-center border-t border-border bg-plot-grid px-6 py-10 sm:px-10 lg:col-span-7 lg:border-l lg:border-t-0 lg:py-14">
              {/* Register ticks — the plate reads as an instrument */}
              <span aria-hidden="true" className="absolute left-3 top-3 size-3 border-l border-t border-photon/40 transition-colors duration-300 group-hover:border-photon/80" />
              <span aria-hidden="true" className="absolute bottom-3 right-3 size-3 border-b border-r border-photon/40 transition-colors duration-300 group-hover:border-photon/80" />
              <div className="text-center">
                <div className="text-foreground/90 [&_.katex]:text-[1.28em]">
                  <Tex display math={projects[0].equation} ariaLabel={projects[0].equationLabel} />
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {projects[0].equationLabel}
                </p>
              </div>
            </div>
          </button>
        </Reveal>

        {/* FIG. 02–05 — an asymmetric spread: 7/5, then mirrored 5/7 */}
        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          {projects.slice(1).map((p, i) => {
            // Asymmetric mirror: 7/5 across the first pair, 5/7 across the second
            const wide = i === 0 || i === 3;
            return (
              <Reveal key={p.id} delay={0.05 * (i % 2)} className={cn(wide ? "lg:col-span-7" : "lg:col-span-5")}>
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  aria-haspopup="dialog"
                  aria-label={`Open project details: ${p.title}`}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 text-left transition-all duration-300 hover:border-photon/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:border-photon/30 before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-transparent before:via-nebula/70 before:to-transparent before:transition-transform before:duration-500 hover:before:scale-x-100 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {p.discipline}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em]",
                        p.status === "example" ? "text-nebula" : "text-muted-foreground"
                      )}
                    >
                      <span className={p.status === "example" ? "border-dashed border border-nebula/50 rounded-full px-2 py-0.5" : "border border-border rounded-full px-2 py-0.5"}>
                        {projectStatusCopy[p.status].label}
                      </span>
                      <span className="text-muted-foreground/50">Fig. {String(i + 2).padStart(2, "0")}</span>
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl leading-tight text-foreground">
                    {p.title}
                  </h3>

                  <p className="mt-2.5 font-serif text-[15px] italic leading-relaxed text-muted-foreground">
                    “{p.question}”
                  </p>

                  <div className="my-5 overflow-x-auto border-y border-border/70 bg-plot-grid py-4 text-foreground/85">
                    <Tex math={p.equation} ariaLabel={p.equationLabel} />
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors group-hover:text-photon">
                      <BookMarked className="size-3.5" aria-hidden="true" />
                      Full project brief
                    </span>
                    <ArrowUpRight
                      className="size-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-photon"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <p className="mx-auto max-w-2xl text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/70">
            Example concepts · no fabricated results · replace with actual work
            as it is completed
          </p>
        </Reveal>
      </div>

      {/* Project brief */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          {open && (
            <>
              <DialogHeader className="text-left">
                <p className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>{open.discipline}</span>
                  <span aria-hidden="true" className="h-px w-6 bg-border" />
                  <span className={open.status === "example" ? "text-nebula" : undefined}>
                    {projectStatusCopy[open.status].label}
                  </span>
                </p>
                <DialogTitle className="mt-3 font-serif text-3xl leading-tight">
                  {open.title}
                </DialogTitle>
                <DialogDescription className="mt-2 font-serif text-lg italic leading-relaxed">
                  “{open.question}”
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-7 text-sm leading-[1.8]">
                <Detail label="Motivation" body={open.motivation} />
                <Detail label="Theoretical background" body={open.background} />

                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Mathematical formulation
                  </h4>
                  <div className="equation-plate mt-3 text-center text-foreground/90">
                    <Tex display math={open.equation} ariaLabel={open.equationLabel} />
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {open.equationLabel}
                    </p>
                  </div>
                </div>

                <Detail label="Methodology" body={open.methodology} icon={<FlaskConical className="size-3.5" aria-hidden="true" />} />
                <Detail label="Findings (illustrative)" body={open.findings} />
                <Detail label="Limitations" body={open.limitations} />

                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    References & further reading
                  </h4>
                  <ul className="mt-3 list-inside space-y-1.5 text-muted-foreground">
                    {open.references.map((r) => (
                      <li key={r} className="relative pl-4 before:absolute before:left-0 before:text-photon before:content-['—']">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {open.repository ? (
                  <a
                    href={open.repository}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-photon/50 hover:bg-photon/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <Github className="size-4" aria-hidden="true" />
                    View repository
                  </a>
                ) : (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    Repository link — added when the code exists
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Detail({
  label,
  body,
  icon,
}: {
  label: string;
  body: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {icon}
        {label}
      </h4>
      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  );
}
