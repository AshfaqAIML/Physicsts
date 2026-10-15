"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { getMotionReduced } from "@/lib/motion-preference";
import { cn } from "@/lib/utils";

/**
 * ASCEND — after the hero has passed, a quiet circular control returns
 * the visitor to the surface (top of the page).
 */
export function AscendButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const past = window.scrollY > window.innerHeight * 0.9;
      // Near the very bottom the footer's own "Back to orbit" takes over —
      // the floating control steps aside so it never crowds the colophon.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 180;
      setVisible(past && !nearBottom);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: getMotionReduced() ? "auto" : "smooth" })
      }
      aria-label="Return to the top of the page"
      className={cn(
        "group fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-lg backdrop-blur-md transition-all duration-500 hover:border-photon/50 hover:text-photon focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.24em] text-transparent transition-colors duration-300 group-hover:text-muted-foreground"
      >
        Ascend
      </span>
    </button>
  );
}
