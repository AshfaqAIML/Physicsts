"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Quote as QuoteIcon } from "lucide-react";
import { toast } from "sonner";
import type { Note } from "@/content/notes";

/**
 * QUOTE THIS PASSAGE — a quiet research-desk affordance. Select any text
 * inside the open essay and a small chip rises beneath the selection;
 * one click copies a citation that carries its own address: the quoted
 * words, the essay's title, and the deep link back to it.
 */

/** A selection shorter than this is a slip, not a quotation. */
const MIN_QUOTE_CHARS = 12;
/** Share-friendly cap — long passages cite themselves into oblivion. */
const MAX_QUOTE_CHARS = 280;

type Anchor = { top: number; left: number };

export function QuoteCopy({
  articleRef,
  note,
  essayTitle,
}: {
  /** The scrolling essay pane the selection must live inside. */
  articleRef: React.RefObject<HTMLElement | null>;
  note: Note;
  essayTitle: string;
}) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const quoteRef = useRef<string | null>(null);
  const rangeRef = useRef<Range | null>(null);

  const hide = useCallback(() => {
    setAnchor(null);
    quoteRef.current = null;
    rangeRef.current = null;
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
    const left = Math.min(Math.max(center, 84), article.clientWidth - 84);
    setAnchor({ top: Math.max(top, 12), left });
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
    const onUp = () => evaluate();
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) hide();
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

    const article = articleRef.current;
    document.addEventListener("pointerup", onUp);
    document.addEventListener("touchend", onUp);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("keydown", onKey);
    article?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("keydown", onKey);
      article?.removeEventListener("scroll", onScroll);
    };
  }, [articleRef, evaluate, hide, place]);

  // A different essay resets the desk.
  useEffect(hide, [note.id, hide]);

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

  if (!anchor) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy the selected passage as a quote"
      data-print="hide"
      style={{ top: `${anchor.top}px`, left: `${anchor.left}px` }}
      className="absolute z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-photon/40 bg-card/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-photon hover:text-photon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <QuoteIcon className="mr-1 inline size-3 text-photon" aria-hidden="true" />
      Quote this passage
    </button>
  );
}
