"use client";

import { Zap, ZapOff } from "lucide-react";
import { useMotionPreference } from "@/components/site/providers";

/**
 * MOTION TOGGLE — "calm the universe". One tap stills the site:
 * framer animations resolve instantly, canvases render their quiet
 * frame, smooth scrolling becomes direct. The choice persists.
 */
export function MotionToggle() {
  const { reduced, ready, toggle } = useMotionPreference();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      aria-keyshortcuts="M"
      aria-label={
        reduced
          ? "Motion is reduced — restore animation"
          : "Calm the universe — reduce motion"
      }
      title={reduced ? "Restore motion (M)" : "Calm the universe (M)"}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Placeholder until hydrated — avoids flashing the wrong icon */}
      {ready ? (
        reduced ? (
          <ZapOff className="size-4" aria-hidden="true" />
        ) : (
          <Zap className="size-4" aria-hidden="true" />
        )
      ) : (
        <span className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
