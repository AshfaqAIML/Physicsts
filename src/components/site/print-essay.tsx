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

  useEffect(
    () => () => {
      if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
      document.documentElement.classList.remove("essay-printing");
    },
    []
  );

  const handlePrint = () => {
    const root = document.documentElement;

    // Fill the provenance slot with the address of *this* essay.
    const url = `${window.location.origin}${window.location.pathname}#note-${note.id}`;
    const slot = document.querySelector("[data-essay-print=\"url\"]");
    if (slot) slot.textContent = url;

    const finish = () => {
      root.classList.remove("essay-printing");
      if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
    };

    root.classList.add("essay-printing");
    window.addEventListener("afterprint", finish, { once: true });
    window.print();
    // afterprint is unreliable in some embedded browsers — a safety net.
    cleanupTimer.current = setTimeout(finish, 1200);
  };

  return (
    <button
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
