"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Clock, Link2, ListTree, NotebookPen, Shuffle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AskAssistant } from "@/components/site/ask-assistant";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Prose } from "@/components/site/tex";
import { noteCategories, notes, type Note, type NoteCategory } from "@/content/notes";
import { cn } from "@/lib/utils";

/**
 * SCIENTIFIC NOTEBOOK — a premium digital journal. One full example
 * essay; the rest are honestly-marked planned topics.
 */

/* ------------------------------------------------------------------ */
/* Deep links — readable essays are addressable as `#note-<noteId>`    */
/* ------------------------------------------------------------------ */

const NOTE_HASH_PREFIX = "#note-";

const noteHash = (note: Note) => `${NOTE_HASH_PREFIX}${note.id}`;

/* Recently-read essays — most recent first, capped at three, kept in
   localStorage so the command palette can offer to resume them. */
const RECENT_KEY = "phys:recent-notes";
const RECENT_CAP = 3;

function recordRecentNote(id: string) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    const ids: string[] = Array.isArray(stored) ? stored.filter((x): x is string => typeof x === "string") : [];
    if (ids[0] === id) return;
    window.localStorage.setItem(
      RECENT_KEY,
      JSON.stringify([id, ...ids.filter((x) => x !== id)].slice(0, RECENT_CAP))
    );
    window.dispatchEvent(new Event("phys:recent-notes-changed"));
  } catch {
    // Storage unavailable (private mode, quota) — recently-read is a bonus,
    // never a blocker.
  }
}

/** Resolve a location hash to a readable (essay-bearing) note, else null. */
function readableNoteFromHash(hash: string): Note | null {
  if (!hash.startsWith(NOTE_HASH_PREFIX)) return null;
  const note = notes.find((n) => n.id === hash.slice(NOTE_HASH_PREFIX.length));
  return note?.essay ? note : null;
}

export function Notebook() {
  const [category, setCategory] = useState<NoteCategory | "All">("All");
  const [open, setOpen] = useState<Note | null>(null);
  /**
   * The reading view's table of contents navigates with in-dialog anchors
   * (`#<section-id>`). This ref records the hash a contents link is about
   * to produce so the `hashchange` listener can recognise and ignore it —
   * those hashes are not note deep-links and must never close or swap the
   * reading view.
   */
  const contentsHash = useRef<string | null>(null);

  /**
   * User-initiated open (ledger row, command palette). Pushes a history
   * entry — Back then closes the essay — via pushState, which changes the
   * hash without a scroll jump and without firing a hashchange echo.
   */
  const openNote = useCallback((note: Note) => {
    contentsHash.current = null;
    setOpen(note);
    const target = noteHash(note);
    if (window.location.hash !== target) {
      window.history.pushState(null, "", target);
    }
  }, []);

  const filtered = useMemo(
    () => (category === "All" ? notes : notes.filter((n) => n.category === category)),
    [category]
  );

  // External openers (command palette)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const note = notes.find((n) => n.id === id);
      if (note?.essay) openNote(note);
    };
    window.addEventListener("phys:open-note", onOpen);
    return () => window.removeEventListener("phys:open-note", onOpen);
  }, [openNote]);

  // Random page — fate chooses from the readable essays, preferring the
  // current category filter (external openers: palette action, R hotkey).
  const openRandomNote = useCallback(() => {
    const pool = filtered.filter((n) => n.essay);
    const source = pool.length > 0 ? pool : notes.filter((n) => n.essay);
    if (source.length === 0) return;
    openNote(source[Math.floor(Math.random() * source.length)]);
  }, [filtered, openNote]);

  useEffect(() => {
    const onRandom = () => openRandomNote();
    window.addEventListener("phys:open-random-note", onRandom);
    return () => window.removeEventListener("phys:open-random-note", onRandom);
  }, [openRandomNote]);

  // Any open — ledger row, palette, deep link, random — feeds the
  // recently-read trail the command palette offers to resume.
  useEffect(() => {
    if (open?.essay) recordRecentNote(open.id);
  }, [open]);

  // Deep links: `#note-<id>` opens that essay on initial load and on
  // back/forward navigation. Hashes without the `#note-` prefix (nav
  // anchors, in-dialog contents anchors) never open anything; only a
  // move *away* from a note hash closes the reading view.
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      const expected = contentsHash.current;
      contentsHash.current = null;
      if (expected !== null && expected === hash) return; // contents anchor — ignore
      if (hash.startsWith(NOTE_HASH_PREFIX)) {
        const note = readableNoteFromHash(hash);
        if (note) setOpen(note); // hash-driven opens never touch history
      } else {
        setOpen(null); // back/forward moved away from an essay deep link
      }
    };

    syncFromHash(); // initial load — history is left untouched
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

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

        {/* Category filter + the dice */}
        <Reveal delay={0.05} className="mt-12">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
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
            <button
              type="button"
              onClick={openRandomNote}
              title="Open a random readable essay — prefers the current filter"
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-photon/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:ml-auto"
            >
              <Shuffle className="size-3" aria-hidden="true" />
              Random page
            </button>
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
                  onClick={() => readable && openNote(note)}
                  aria-haspopup="dialog"
                  aria-label={
                    readable
                      ? `Read the essay: ${note.title}`
                      : `${note.title} — planned, not yet written`
                  }
                  className={cn(
                    "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 py-6 text-left transition-colors sm:gap-x-8",
                    readable
                      ? "hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
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
      <Dialog
        open={open !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && open) {
            // Manual close: if the hash points at this essay (its deep link
            // or a stale in-dialog contents anchor), clear it without adding
            // a history entry.
            const hash = window.location.hash;
            const pointsAtThisEssay =
              hash === noteHash(open) ||
              Boolean(open.essay?.sections.some((s) => `#${s.id}` === hash));
            if (pointsAtThisEssay) {
              window.history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
              );
            }
            contentsHash.current = null;
            setOpen(null);
          }
        }}
      >
        <DialogContent
          className="max-h-[92vh] gap-0 overflow-hidden border-border bg-background p-0 sm:max-w-5xl"
          showCloseButton
        >
          {open?.essay && (
            <ReadingView
              note={open}
              onContentsNavigate={(hash) => {
                contentsHash.current = hash;
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The reading view                                                      */
/* ------------------------------------------------------------------ */

function ReadingView({
  note,
  onContentsNavigate,
}: {
  note: Note;
  /** Reports the hash a contents link is about to navigate to. */
  onContentsNavigate: (hash: string) => void;
}) {
  const essay = note.essay!;
  const [active, setActive] = useState(essay.sections[0]?.id ?? "");
  const articleRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Reading progress — a photon hairline along the top of the reading
  // pane. Driven by direct style writes on scroll (no re-renders), and
  // mirrored as a data attribute that reveals the header's depth shadow.
  const handleArticleScroll = useCallback(() => {
    const el = articleRef.current;
    const bar = progressRef.current;
    if (!el) return;
    if (bar) {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    }
    el.dataset.scrolled = el.scrollTop > 8 ? "true" : "false";
  }, []);

  // A fresh essay starts at the top with a zeroed measure.
  useEffect(() => {
    const el = articleRef.current;
    if (el) {
      el.scrollTop = 0;
      el.dataset.scrolled = "false";
    }
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
  }, [note.id]);

  // Scroll-spy — the contents rail tracks the section under the eye
  // as the essay scrolls, not only on explicit clicks.
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const sections = essay.sections
      .map((s) => article.querySelector(`#${s.id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A band just below the header marks "currently reading"
      { root: article, rootMargin: "-15% 0px -70% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [essay.sections]);

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
                  onClick={() => {
                    onContentsNavigate(`#${s.id}`);
                    setActive(s.id);
                  }}
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
      <article ref={articleRef} onScroll={handleArticleScroll} className="reading-pane overflow-y-auto">
        {/* Reading measure — fills as the essay scrolls */}
        <div aria-hidden="true" className="sticky top-0 z-20 h-0.5">
          <div
            ref={progressRef}
            className="h-full w-full origin-left bg-photon"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <DialogHeader className="reading-head sticky top-0 z-10 border-b border-border bg-background/90 px-6 py-5 text-left backdrop-blur-sm sm:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-photon">
            Scientific Notebook · {note.category}
          </p>
          <DialogTitle className="mt-2 max-w-2xl font-serif text-2xl leading-tight text-balance sm:text-3xl">
            {essay.title}
          </DialogTitle>
          <DialogDescription className="max-w-2xl font-serif text-base italic leading-relaxed">
            {essay.dek}
          </DialogDescription>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {essay.readingMinutes} min read · {essay.date}
            </p>
            <CopyLinkButton note={note} />
          </div>
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
          </section>

          {/* AI study companion — grounded in this essay's actual text */}
          <AskAssistant note={note} />

          <p className="mt-10 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/60">
            Example essay · placeholder content until replaced by genuine
            writing
          </p>
        </div>
      </article>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Copy link — share the deep link to this essay                        */
/* ------------------------------------------------------------------ */

function CopyLinkButton({ note }: { note: Note }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending label-reset if the view unmounts mid-flight.
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}${noteHash(note)}`;
    let ok = false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      // Fallback for insecure contexts / older browsers.
      let scratch: HTMLTextAreaElement | null = null;
      try {
        scratch = document.createElement("textarea");
        scratch.value = url;
        scratch.readOnly = true;
        scratch.style.position = "fixed";
        scratch.style.opacity = "0";
        document.body.appendChild(scratch);
        scratch.select();
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      } finally {
        scratch?.remove();
      }
    }

    if (ok) {
      toast.success("Link copied — share this essay.", {
        description: "The URL now points directly to this essay.",
      });
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy a link to this essay"
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {copied ? (
        <Check className="size-3" aria-hidden="true" />
      ) : (
        <Link2 className="size-3" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
