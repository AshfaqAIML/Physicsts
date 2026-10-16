"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * THE FIRST-SIGHT HINT — a quiet, one-time chip in the lower-left corner
 * that tells a first-time visitor the page has an instrument panel: ⌘K
 * opens the spectral console, "?" the operating manual. It retires the
 * moment any of those keys is used, when dismissed, or after a patient
 * half-minute — and never returns (per browser).
 */

const HINT_SEEN_KEY = "phys:hint-seen";
const SHOW_DELAY_MS = 2200;
const RETIRE_AFTER_MS = 30_000;

function markSeen() {
  try {
    window.localStorage.setItem(HINT_SEEN_KEY, "1");
  } catch {
    // Storage unavailable — the hint simply may appear again; harmless.
  }
}

const emptySubscribe = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

function alreadySeen(): boolean {
  try {
    return window.localStorage.getItem(HINT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function KeyboardHint() {
  // Mounted-gate via external store — same pattern the palette uses, so
  // SSR renders nothing and the chip appears only on the client.
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted);
  const [shown, setShown] = useState(false);
  const retired = useRef(false);

  const retire = () => {
    if (retired.current) return;
    retired.current = true;
    markSeen();
    setShown(false);
  };

  useEffect(() => {
    if (alreadySeen()) return;

    // Rise after the hero's opening sequence has settled.
    const rise = window.setTimeout(() => setShown(true), SHOW_DELAY_MS);

    // Using any taught key retires the chip — discovery is complete.
    const onKey = (e: KeyboardEvent) => {
      const taught =
        e.key === "?" || (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (taught) retire();
    };
    // Opening the manual by any other route (palette item, nav) counts too.
    const onManual = () => retire();
    window.addEventListener("keydown", onKey);
    window.addEventListener("phys:open-shortcuts", onManual);

    // A patient visitor has clearly managed without it.
    const fade = window.setTimeout(retire, RETIRE_AFTER_MS);

    return () => {
      window.clearTimeout(rise);
      window.clearTimeout(fade);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("phys:open-shortcuts", onManual);
    };
  }, []);

  // Never rendered during SSR — the chip is a purely client-side courtesy.
  if (!mounted) return null;

  return (
    <aside
      data-print="hide"
      aria-label="Keyboard hint"
      // Once retired the chip is furniture, not a control: inert keeps the
      // invisible dismiss button out of the tab order and the a11y tree.
      aria-hidden={!shown}
      inert={!shown}
      className={cn(
        "fixed bottom-6 left-4 z-40 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card/90 p-3 pl-4 shadow-lg backdrop-blur-md transition-all duration-700 sm:left-6",
        "motion-safe:translate-y-0",
        shown
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <p className="meta-sm text-muted-foreground">
        This page has instruments
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-foreground/85">
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">
            ⌘K
          </kbd>
          <span className="text-muted-foreground">the console</span>
        </span>
        <span aria-hidden="true" className="text-muted-foreground/50">
          ·
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">
            ?
          </kbd>
          <span className="text-muted-foreground">the manual</span>
        </span>
      </p>
      <button
        type="button"
        onClick={retire}
        aria-label="Dismiss the keyboard hint"
        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </aside>
  );
}
