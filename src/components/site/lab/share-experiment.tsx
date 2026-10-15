"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  buildExperimentHash,
  type ExperimentTab,
} from "./experiment-link";

/**
 * "Share experiment" — copies a deep link that replays this exact
 * instrument state for anyone who opens it. The styling matches the
 * notebook's dashed utility chips (Random page, Copy link): a quiet
 * instrument-grade action, not a loud button.
 */
export function ShareExperimentButton({
  tab,
  params,
  preset,
  instrument,
}: {
  tab: ExperimentTab;
  /** Current serializable parameters — read at click time so live
   *  instrument state (including ref-held lens positions) is captured. */
  params: () => Record<string, string | number | boolean>;
  /** Active preset id, when the current state matches one. */
  preset?: string | null;
  /** Human name, e.g. "the orbital-mechanics bench". */
  instrument: string;
}) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Never leave a pending label reset behind on unmount.
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = async () => {
    const hash = buildExperimentHash(tab, params(), preset);
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
      toast.success("Experiment link copied.", {
        description: `Anyone who opens it lands on ${instrument} with this setup.`,
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
      aria-label="Copy a link that replays this experiment"
      title="Copy a link that replays this experiment"
      className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-photon/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {copied ? (
        <Check className="size-3 text-photon" aria-hidden="true" />
      ) : (
        <Share2 className="size-3" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Share experiment"}
    </button>
  );
}
