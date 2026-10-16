"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tex } from "@/components/site/tex";
import {
  lexiconCategories,
  lexiconTerms,
  type LexiconTerm,
} from "@/content/lexicon";
import { cn } from "@/lib/utils";

/**
 * THE LEXICON — a searchable field guide to the language of physics.
 * Opened from the navigation bar, the mobile menu, and the ⌘K palette
 * via the `phys:open-lexicon` window event (same decoupling pattern
 * as the command palette uses for sections).
 */

type CategoryFilter = LexiconTerm["category"] | "All";

const categoryFilters: CategoryFilter[] = ["All", ...lexiconCategories];

export function Lexicon() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  // External openers — nav bar button, mobile sheet, ⌘K palette
  useEffect(() => {
    const onOpen = () => {
      setQuery("");
      setCategory("All");
      setOpen(true);
    };
    window.addEventListener("phys:open-lexicon", onOpen);
    return () => window.removeEventListener("phys:open-lexicon", onOpen);
  }, []);

  // Land focus in the search field once Radix has mounted the content
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return lexiconTerms.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (words.length === 0) return true;
      const haystack = [
        t.term,
        t.definition,
        t.category,
        t.formulaLabel ?? "",
        t.formula ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [query, category]);

  // The words the ledger highlights — single characters are skipped to
  // keep the glow meaningful (searching "e" would light up everything).
  const highlightWords = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter((w) => w.length >= 2),
    [query]
  );

  // "See also" — refocus the search onto a related term
  const jumpTo = (id: string) => {
    const target = lexiconTerms.find((t) => t.id === id);
    if (!target) return;
    setCategory("All");
    setQuery(target.term);
    inputRef.current?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="flex max-h-[85vh] flex-col gap-0 overflow-hidden border-border bg-card/95 p-0 backdrop-blur-xl sm:max-w-2xl"
      >
        {/* Header — eyebrow, field-guide title, search, category chips */}
        <div className="shrink-0 border-b border-border px-6 pb-5 pt-6">
          <p className="meta-sm text-photon">
            The Lexicon — {lexiconTerms.length} Terms
          </p>
          <DialogTitle className="mt-2 text-left font-serif text-2xl leading-tight text-balance sm:text-3xl">
            A Field Guide to the Language.
          </DialogTitle>
          <DialogDescription className="mt-1 text-left text-sm leading-relaxed">
            The working vocabulary of this site, from classical mechanics to
            cosmology — each term with its canonical formula.
          </DialogDescription>

          <div className="relative mt-5">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terms, formulas, concepts…"
              aria-label="Search the lexicon"
              className="h-10 w-full rounded-md border border-border bg-background/60 pr-3 pl-9 font-mono text-xs text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </div>

          <div
            role="group"
            aria-label="Filter terms by category"
            className="mt-3 flex flex-wrap items-center gap-2"
          >
            {categoryFilters.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1 meta-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  category === c
                    ? "border-photon/60 bg-photon/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* The ledger */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-1">
          {filtered.length === 0 ? (
            <p
              role="status"
              aria-live="polite"
              className="py-12 text-center eyebrow text-muted-foreground"
            >
              No terms in this light cone.
            </p>
          ) : (
            <div className="divide-y divide-border border-y border-border">
              {filtered.map((t, i) => (
                <TermRow key={t.id} term={t} index={i} onJump={jumpTo} words={highlightWords} />
              ))}
            </div>
          )}
        </div>

        {/* Footer microcopy */}
        <div className="shrink-0 border-t border-border px-6 py-3 meta-xs text-muted-foreground">
          Definitions are standard physics — see the notebook essays for worked
          ideas.
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* One ledger row                                                       */
/* ------------------------------------------------------------------ */

function TermRow({
  term,
  index,
  onJump,
  words,
}: {
  term: LexiconTerm;
  index: number;
  onJump: (id: string) => void;
  /** Search words to glow within the term and definition. */
  words: string[];
}) {
  const related = (term.seeAlso ?? [])
    .map((id) => lexiconTerms.find((t) => t.id === id))
    .filter((t): t is LexiconTerm => t !== undefined);

  return (
    <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 py-6 sm:gap-x-8">
      <span
        aria-hidden="true"
        className="pt-1 meta-num text-muted-foreground"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
          <h4 className="font-serif text-xl leading-snug text-foreground transition-colors hover:text-photon sm:text-2xl">
            <Highlighted text={term.term} words={words} />
          </h4>
          <span className="rounded-full border border-border/70 px-2 py-0.5 meta-xs text-muted-foreground">
            {term.category}
          </span>
        </div>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <Highlighted text={term.definition} words={words} />
        </p>

        {term.formula ? (
          <div className="mx-auto mt-4 w-fit max-w-full overflow-x-auto rounded-md border border-border/70 bg-background/60 px-4 py-2.5 text-center text-foreground/90 [&_.katex-display]:my-0.5">
            <Tex math={term.formula} display ariaLabel={term.formulaLabel ?? term.term} />
            {term.formulaLabel ? (
              <p className="mt-1.5 meta-xs text-muted-foreground">
                {term.formulaLabel}
              </p>
            ) : null}
          </div>
        ) : null}

        {related.length > 0 ? (
          <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 meta-sm">
            <span className="text-muted-foreground">→ See also:</span>
            {related.map((r, i) => (
              <span key={r.id} className="flex items-baseline gap-1.5">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-muted-foreground/50">
                    ·
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onJump(r.id)}
                  className="text-photon underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {r.term}
                </button>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Search-match highlighting — a soft photon glow on the words that     */
/* matched, via a case-insensitive alternation split (with a capture    */
/* group, odd-indexed parts of the split are the matches).              */
/* ------------------------------------------------------------------ */

function Highlighted({ text, words }: { text: string; words: string[] }) {
  if (words.length === 0) return <>{text}</>;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  let parts: string[];
  try {
    parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  } catch {
    return <>{text}</>; // defensive — an unparsable pattern never breaks the ledger
  }
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : part
      )}
    </>
  );
}
