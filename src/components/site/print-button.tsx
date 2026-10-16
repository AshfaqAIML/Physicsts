"use client";

import { Printer } from "lucide-react";

/**
 * PRINT / PDF — the colophon's paper affordance. A client island so the
 * server-rendered footer stays server-rendered; paper never sees it
 * (data-print="hide"), the browser's print dialog does.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-print="hide"
      className="inline-flex min-w-40 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 meta-sm text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      aria-label="Print this page or save it as a PDF"
    >
      <Printer className="size-3.5" aria-hidden="true" />
      Print / PDF
    </button>
  );
}
