"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Route } from "lucide-react";
import { toast } from "sonner";
import { buildLabTourHash, type ExperimentTab } from "./experiment-link";

/**
 * "Share lab tour" — the lab-wide companion to the per-bench share chip:
 * it copies one link that replays the WHOLE laboratory, bench by bench,
 * exactly as the sharer left each instrument. Untouched benches are
 * omitted from the link, which is honest — they stood at their defaults
 * when the link was made.
 */

/** The benches reported by the lab, in canonical tour order. */
export type ReportedBench = {
  tab: ExperimentTab;
  params: Record<string, string | number | boolean>;
  preset?: string | null;
};

export function ShareLabTourButton({
  benches,
}: {
  /** Last-known state of each bench, read live at click time. */
  benches: () => ReportedBench[];
}) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = async () => {
    const reported = benches();
    if (reported.length === 0) {
      toast.info("Nothing to share yet.", {
        description:
          "Every instrument is at its defaults — the single-bench share chips cover this case better.",
      });
      return;
    }
    // The active bench leads the tour; the rest follow in canonical order.
    const hash = buildLabTourHash(reported);
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
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
      toast.success("Lab tour link copied.", {
        description:
          reported.length === 3
            ? "Whoever opens it finds all three benches set as you left them."
            : `${reported.length} of 3 benches shared — the rest stand at their defaults, exactly as you left them.`,
      });
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy the link.");
    }
  };

  // External openers (command palette) — one action, one copy flow.
  // handleCopy reads benches() at call time and only touches
  // setState/toast, so the listener never needs re-arming.
  const handleCopyRef = useRef(handleCopy);
  handleCopyRef.current = handleCopy;
  useEffect(() => {
    const onShare = () => void handleCopyRef.current();
    window.addEventListener("phys:share-lab-tour", onShare);
    return () => window.removeEventListener("phys:share-lab-tour", onShare);
  }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy a link that replays the whole lab — every bench as you left it"
      title="Copy a link that replays the whole lab — every bench as you left it"
      className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 meta-sm text-muted-foreground transition-colors hover:border-photon/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {copied ? (
        <Check className="size-3 text-photon" aria-hidden="true" />
      ) : (
        <Route className="size-3" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Share lab tour"}
    </button>
  );
}
