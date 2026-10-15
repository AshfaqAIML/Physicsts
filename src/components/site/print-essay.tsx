"use client";

import { useEffect, useRef } from "react";
import { Printer } from "lucide-react";
import type { Note } from "@/content/notes";

/**
 * PRINT THIS ESSAY — paper receives one offprint. The button stamps a
 * class on <html> for the duration of the print job; the print stylesheet
 * lets the whole site step aside and typesets the open essay alone, with
 * a provenance line (site · deep link) so the paper copy knows where it
 * came from.
 */

export function PrintEssayButton({ note }: { note: Note }) {
  // If the print dialogue outlives our patience, still clean up.
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The chip itself — the print handler walks up from here to its dialog.
  const chipRef = useRef<HTMLButtonElement | null>(null);

  useEffect(
    () => () => {
      if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
      document.documentElement.classList.remove("essay-printing");
      chipRef.current?.closest('[role="dialog"]')?.classList.remove("print-target");
    },
    []
  );

  const handlePrint = () => {
    const root = document.documentElement;

    // Fill the provenance slot with the address of *this* essay.
    const url = `${window.location.origin}${window.location.pathname}#note-${note.id}`;
    const slot = document.querySelector("[data-essay-print=\"url\"]");
    if (slot) slot.textContent = url;

    // Mark this essay's own dialogue — a stacked dialogue underneath
    // (opened from the palette, say) never leaks onto the page.
    const dialog = chipRef.current?.closest('[role="dialog"]');
    const finish = () => {
      root.classList.remove("essay-printing");
      dialog?.classList.remove("print-target");
      if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
    };

    root.classList.add("essay-printing");
    dialog?.classList.add("print-target");
    window.addEventListener("afterprint", finish, { once: true });
    window.print();
    // afterprint is unreliable in some embedded browsers — a safety net.
    cleanupTimer.current = setTimeout(finish, 1200);
  };

  return (
    <button
      ref={chipRef}
      type="button"
      onClick={handlePrint}
      aria-label="Print this essay as an archival offprint"
      data-print="hide"
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Printer className="size-3" aria-hidden="true" />
      Print
    </button>
  );
}
