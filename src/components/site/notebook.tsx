"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Clock, ListTree, NotebookPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Prose } from "@/components/site/tex";
import { noteCategories, notes, type Note, type NoteCategory } from "@/content/notes";
import { cn } from "@/lib/utils";

/**
 * SCIENTIFIC NOTEBOOK — a premium digital journal. One full example
 * essay; the rest are honestly-marked planned topics.
 */
export function Notebook() {
  const [category, setCategory] = useState<NoteCategory | "All">("All");
  const [open, setOpen] = useState<Note | null>(null);

  const filtered = useMemo(
    () => (category === "All" ? notes : notes.filter((n) => n.category === category)),
    [category]
  );

  return (
    <section
      id="notes"
      aria-labelledby="notes-heading"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="05"
          eyebrow="Scientific Notebook"
          title="Ideas in Progress."
          lede="Essays and notes on physics, mathematics, and the history of ideas — written to think clearly, published when ready."
        />

        {/* Category filter */}
        <Reveal delay={0.05} className="mt-12">
          <div
            role="group"
            aria-label="Filter notes by category"
            className="flex flex-wrap items-center gap-2"
          >
            {(["All", ...noteCategories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  category === c
                    ? "border-photon/60 bg-photon/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* The ledger */}
        <div className="mt-8 divide-y divide-border border-y border-border">
          {filtered.map((note, i) => {
            const readable = Boolean(note.essay);
            return (
              <Reveal key={note.id} delay={Math.min(0.05 * i, 0.25)} as="div">
                <button
                  type="button"
                  disabled={!readable}
                  onClick={() => readable && setOpen(note)}
                  aria-haspopup="dialog"
                  aria-label={
                    readable
                      ? `Read the essay: ${note.title}`
                      : `${note.title} — planned, not yet written`
                  }
                  className={cn(
                    "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 py-6 text-left sm:gap-x-8",
                    readable
                      ? "transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                      : "cursor-default opacity-60"
                  )}
                >
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span>
                    <span
                      className={cn(
                        "block font-serif text-xl leading-snug sm:text-2xl",
                        readable ? "text-foreground transition-colors group-hover:text-photon" : "text-muted-foreground"
                      )}
                    >
                      {note.title}
                    </span>
                    <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {note.excerpt}
                    </span>
                    <span className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                      <span className="rounded-full border border-border/70 px-2 py-0.5">
                        {note.category}
                      </span>
                      {readable ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3" aria-hidden="true" />
                          {note.readingMinutes} min read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <NotebookPen className="size-3" aria-hidden="true" />
                          Planned — not yet written
                        </span>
                      )}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "self-center",
                      readable
                        ? "text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-photon"
                        : "text-muted-foreground/30"
                    )}
                    aria-hidden="true"
                  >
                    {readable ? <ArrowUpRight className="size-5" /> : <span className="font-mono text-[10px]">—</span>}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Reading view — a quiet room for one essay */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          className="max-h-[92vh] gap-0 overflow-hidden border-border bg-background p-0 sm:max-w-5xl"
          showCloseButton
        >
          {open?.essay && <ReadingView note={open} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The reading view                                                      */
/* ------------------------------------------------------------------ */

function ReadingView({ note }: { note: Note }) {
  const essay = note.essay!;
  const [active, setActive] = useState(essay.sections[0]?.id ?? "");

  return (
    <div className="grid h-[92vh] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Table of contents */}
      <aside className="hidden flex-col border-r border-border bg-card/60 py-6 lg:flex">
        <p className="flex items-center gap-2 px-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <ListTree className="size-3.5" aria-hidden="true" /> Contents
        </p>
        <nav aria-label="Table of contents" className="mt-5 flex-1 overflow-y-auto px-3">
          <ol className="space-y-1">
            {essay.sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    active === s.id
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-2 font-mono text-[10px] text-photon">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading.replace(/^\d+\s·\s/, "")}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="mt-4 border-t border-border px-6 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {essay.readingMinutes} min read · {essay.date}
        </p>
      </aside>

      {/* The essay */}
      <article className="overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 py-5 text-left backdrop-blur-sm sm:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-photon">
            Scientific Notebook · {note.category}
          </p>
          <DialogTitle className="mt-2 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl">
            {essay.title}
          </DialogTitle>
          <DialogDescription className="max-w-2xl font-serif text-base italic leading-relaxed">
            {essay.dek}
          </DialogDescription>
        </DialogHeader>

        <div className="reading-measure px-6 py-10 sm:px-10">
          {essay.sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className={cn("scroll-mt-24", i > 0 && "mt-12", i === 0 && "first:mt-0")}
              aria-labelledby={`${s.id}-h`}
            >
              <h2
                id={`${s.id}-h`}
                className="font-serif text-xl leading-snug text-foreground sm:text-2xl"
              >
                {s.heading}
              </h2>
              <div className="mt-5 space-y-5">
                {s.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className={cn(
                      "text-[1.05rem] leading-[1.85] text-muted-foreground",
                      i === 0 && j === 0 && "drop-cap text-foreground/90"
                    )}
                  >
                    <Prose text={p} />
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* References */}
          <section className="mt-16 border-t border-border pt-8" aria-labelledby="refs-h">
            <h2 id="refs-h" className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              References
            </h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {essay.references.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-xs text-photon">[{i + 1}]</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
            <p className="mt-10 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/60">
              Example essay · placeholder content until replaced by genuine
              writing
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
