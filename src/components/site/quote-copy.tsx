"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Printer, Quote as QuoteIcon } from "lucide-react";
import { toast } from "sonner";
import type { Note } from "@/content/notes";

/**
 * QUOTE THIS PASSAGE — a quiet research-desk affordance. Select any text
 * inside the open essay and a small chip rises beneath the selection;
 * one click copies a citation that carries its own address: the quoted
 * words, the essay's title, and the deep link back to it. A second action
 * prints the selection alone — an excerpt offprint, typeset on paper.
 */

/** A selection shorter than this is a slip, not a quotation. */
const MIN_QUOTE_CHARS = 12;
/** Share-friendly cap — long passages cite themselves into oblivion. */
const MAX_QUOTE_CHARS = 280;
/** Paper carries more than a clipboard — an excerpt offprint may run
 * longer than a share payload, but still not the whole essay. */
const MAX_EXCERPT_CHARS = 640;
/** If the print dialogue outlives our patience, still clean up. */
const PRINT_CLEANUP_MS = 1200;
/** How long an assistive-tech selection must hold still before the chip
 * rises — selections made by voice control or screen readers announce
 * themselves only through selectionchange, with no pointer or key to
 * settle them, so we give the selection a moment to stabilise. */
const AT_SELECTION_SETTLE_MS = 350;

type Anchor = { top: number; left: number };

export function QuoteCopy({
  articleRef,
  note,
  essayTitle,
  essayMeta,
}: {
  /** The scrolling essay pane the selection must live inside. */
  articleRef: React.RefObject<HTMLElement | null>;
  note: Note;
  essayTitle: string;
  /** Category · reading time · date — the offprint's citation line. */
  essayMeta: string;
}) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const quoteRef = useRef<string | null>(null);
  const rangeRef = useRef<Range | null>(null);
  const printTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The pill itself — the print handler walks up from here to its dialog.
  const chipRef = useRef<HTMLDivElement | null>(null);
  // A pointer drag in progress — selections changing beneath a held
  // pointer must not raise the chip mid-drag (the original design rule).
  const pointerDownRef = useRef(false);
  // The settle timer for selectionchange-driven (assistive tech) selections.
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    setAnchor(null);
    quoteRef.current = null;
    rangeRef.current = null;
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  /** Position the chip beneath the current selection, clamped to the pane. */
  const place = useCallback(() => {
    const article = articleRef.current;
    const range = rangeRef.current;
    if (!article || !range) return;
    const rect = range.getBoundingClientRect();
    const artRect = article.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return hide();
    // Absolute coordinates inside the pane's scrolling content.
    const top = rect.bottom + article.scrollTop - artRect.top + 10;
    const center = rect.left + rect.width / 2 - artRect.left;
    // Clamp by the pill's REAL width — the two-action group is wider
    // than the old single chip, and a fixed margin would let it spill
    // past a narrow (mobile) pane. Before first mount, a conservative
    // estimate keeps the first frame honest; a layout effect re-places
    // with the measured width.
    const half = (chipRef.current?.offsetWidth ?? 300) / 2;
    const left = Math.min(Math.max(center, half), Math.max(article.clientWidth - half, half));
    const topClamped = Math.max(top, 12);
    // Same-value bailout: the layout-effect re-place must converge, not loop.
    setAnchor((prev) =>
      prev && prev.top === topClamped && prev.left === left ? prev : { top: topClamped, left }
    );
  }, [articleRef, hide]);

  /** Evaluate the live selection; remember it, or fold the chip away. */
  const evaluate = useCallback(() => {
    const sel = window.getSelection();
    const article = articleRef.current;
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !article) {
      return hide();
    }
    const node = sel.anchorNode;
    if (!node) return hide();
    const el = node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
    if (!el || !article.contains(el)) return hide();
    // Typing surfaces have their own selection life; the chip is for prose.
    if (el.closest("input, textarea, button")) return hide();
    const text = sel.toString().replace(/\s+/g, " ").trim();
    if (text.length < MIN_QUOTE_CHARS) return hide();
    rangeRef.current = sel.getRangeAt(0).cloneRange();
    quoteRef.current = text;
    place();
  }, [articleRef, hide, place]);

  // Selection life-cycle: the chip appears when a selection *finishes*
  // (pointer release, touch release, shift-arrow release) and never
  // flickers mid-drag; it folds the moment the selection collapses or
  // leaves the essay. Escape is an explicit dismissal.
  useEffect(() => {
    const onUp = () => {
      pointerDownRef.current = false;
      evaluate();
    };
    const onDown = () => {
      pointerDownRef.current = true;
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        hide();
        return;
      }
      // Assistive technology (voice control, screen-reader cursors)
      // creates selections with no pointer and no key — the only signal
      // is this event. Once such a selection holds still for a moment,
      // treat it as finished and raise the chip. Selections made under a
      // held pointer stay quiet until release, as they always have.
      if (pointerDownRef.current) return;
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null;
        evaluate();
      }, AT_SELECTION_SETTLE_MS);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.getSelection()?.removeAllRanges();
        hide();
      } else if (e.shiftKey) {
        // Selections grown with the keyboard count when the key settles.
        window.setTimeout(evaluate, 60);
      }
    };
    const onScroll = () => {
      // The selection persists; only its viewport anchor moves.
      if (rangeRef.current) place();
    };
    // A resized pane (device rotation, window change) re-clamps the pill
    // against its new width — the two-action group is wide on purpose.
    const onResize = () => {
      if (rangeRef.current) place();
    };

    const article = articleRef.current;
    document.addEventListener("pointerup", onUp);
    document.addEventListener("touchend", onUp);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("keydown", onKey);
    article?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("keydown", onKey);
      article?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [articleRef, evaluate, hide, place]);

  // A different essay resets the desk; a stray print class never lingers.
  useEffect(hide, [note.id, hide]);
  // Once the pill is actually mounted, its measured width sharpens the
  // clamp (the estimate above may have guessed narrow on first raise).
  useLayoutEffect(() => {
    if (anchor) place();
  }, [anchor, place]);
  useEffect(
    () => () => {
      if (printTimerRef.current) clearTimeout(printTimerRef.current);
      document.documentElement.classList.remove("excerpt-printing");
    },
    []
  );

  const handleCopy = async () => {
    const quote = quoteRef.current;
    if (!quote) return;
    const cited =
      quote.length > MAX_QUOTE_CHARS
        ? `${quote.slice(0, MAX_QUOTE_CHARS).trimEnd()}…`
        : quote;
    const url = `${window.location.origin}${window.location.pathname}#note-${note.id}`;
    const payload = `«${cited}»\n— ${essayTitle}, The Physicist's Notebook\n${url}`;

    let ok = false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      let scratch: HTMLTextAreaElement | null = null;
      try {
        scratch = document.createElement("textarea");
        scratch.value = payload;
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
      toast.success("Quote copied — share the passage.", {
        description: "The citation carries the essay's title and a link back to it.",
      });
      // The deed is done; the chip folds away. The selection itself is
      // left untouched — taking it from the reader would be rude.
      hide();
    } else {
      toast.error("Could not copy the quote.");
    }
  };

  /** EXCERPT OFFPRINT — paper receives the selected passage alone. The
   * plate below carries its own masthead and provenance; this handler
   * only inks the slots, stamps the mode class, and opens the dialogue.
   * The print stylesheet does the typesetting. The essay's own dialog is
   * marked `print-target` so a stacked dialogue underneath never leaks
   * onto the page — only the printer's own dialogue prints. */
  const handlePrintExcerpt = () => {
    const quote = quoteRef.current;
    if (!quote) return;
    const excerpt =
      quote.length > MAX_EXCERPT_CHARS
        ? `${quote.slice(0, MAX_EXCERPT_CHARS).trimEnd()}…`
        : quote;
    const url = `${window.location.origin}${window.location.pathname}#note-${note.id}`;

    const set = (slot: string, text: string) => {
      const el = document.querySelector(`[data-excerpt-plate="${slot}"]`);
      if (el) el.textContent = text;
    };
    set("passage", excerpt);
    set("title", essayTitle);
    set("meta", essayMeta);
    set("url", url);

    const root = document.documentElement;
    // The chip lives inside the essay's own dialogue — that one prints.
    const dialog = chipRef.current?.closest("[role=\"dialog\"]");
    const finish = () => {
      root.classList.remove("excerpt-printing");
      dialog?.classList.remove("print-target");
      if (printTimerRef.current) clearTimeout(printTimerRef.current);
    };
    root.classList.add("excerpt-printing");
    dialog?.classList.add("print-target");
    window.addEventListener("afterprint", finish, { once: true });
    window.print();
    // afterprint is unreliable in some embedded browsers — a safety net.
    printTimerRef.current = setTimeout(finish, PRINT_CLEANUP_MS);
  };

  if (!anchor) return null;

  return (
    <>
      {/* The chip — one pill, two deeds: quote to the clipboard, or print
          the selection alone as an excerpt offprint. On a narrow pane the
          deeds stack vertically — the pill never outgrows its essay. */}
      <div
        ref={chipRef}
        role="group"
        aria-label="Selected passage actions"
        data-print="hide"
        style={{ top: `${anchor.top}px`, left: `${anchor.left}px` }}
        className="absolute z-30 flex -translate-x-1/2 flex-col whitespace-nowrap overflow-hidden rounded-xl border border-photon/40 bg-card/95 meta-sm text-foreground shadow-lg backdrop-blur-sm transition-all duration-200 focus-within:border-photon hover:border-photon sm:flex-row sm:rounded-full"
      >
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy the selected passage as a quote"
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 transition-colors hover:text-photon focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
        >
          <QuoteIcon className="inline size-3 text-photon" aria-hidden="true" />
          Quote this passage
        </button>
        <span
          aria-hidden="true"
          className="mx-3 h-px w-auto bg-border sm:mx-0 sm:my-1.5 sm:h-auto sm:w-px"
        />
        <button
          type="button"
          onClick={handlePrintExcerpt}
          aria-label="Print the selected passage as an excerpt offprint"
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 transition-colors hover:text-photon focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
        >
          <Printer className="inline size-3 text-photon" aria-hidden="true" />
          Print excerpt
        </button>
      </div>

      {/* The excerpt plate — invisible on screen; the excerpt-printing
          mode of the print stylesheet is the only thing that inks it.
          Lives inside the reading pane so it prints inside the dialog. */}
      <div data-excerpt-plate="root" className="hidden">
        <p className="font-mono text-[9.5pt] uppercase tracking-[0.14em] text-black/70">
          Offprint · Excerpt — The Physicist&rsquo;s Notebook
        </p>
        <div aria-hidden="true" className="mt-2 border-t-2 border-black" />
        <p className="mt-1.5 font-mono text-[8.5pt] uppercase tracking-[0.14em] text-black/60">
          A passage selected by the reader, printed by request
        </p>
        <p data-excerpt-plate="title" className="mt-6 font-serif text-[16pt] leading-tight text-black" />
        <p data-excerpt-plate="meta" className="mt-1.5 font-mono text-[8.5pt] uppercase tracking-[0.12em] text-black/60" />
        <blockquote className="mt-7 border-l-2 border-black/80 pl-5 font-serif text-[12.5pt] leading-[1.75] text-black">
          <span aria-hidden="true" className="mr-1 text-black/60">«</span>
          <span data-excerpt-plate="passage" />
          <span aria-hidden="true" className="ml-1 text-black/60">»</span>
        </blockquote>
        <p className="mt-8 font-mono text-[8.5pt] uppercase tracking-[0.12em] text-black/60">
          Excerpted from the full essay — <span data-excerpt-plate="url" />
        </p>
      </div>
    </>
  );
}
