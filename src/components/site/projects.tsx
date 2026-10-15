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
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={0.06 * (i % 2)}>
              <button
                type="button"
                onClick={() => setOpen(p)}
                aria-haspopup="dialog"
                aria-label={`Open project details: ${p.title}`}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-photon/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {p.discipline}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
                      p.status === "example"
                        ? "border-dashed border-nebula/50 text-nebula"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {projectStatusCopy[p.status].label}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-2xl leading-tight text-foreground sm:text-[1.75rem]">
                  {p.title}
                </h3>

                <p className="mt-3 font-serif text-base italic leading-relaxed text-muted-foreground">
                  “{p.question}”
                </p>

                <div className="my-6 overflow-x-auto border-y border-border/70 bg-plot-grid py-4 text-foreground/85">
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
          ))}
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
