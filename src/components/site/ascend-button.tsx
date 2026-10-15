"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
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
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Return to the top of the page"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground shadow-lg backdrop-blur-md transition-all duration-500 hover:border-photon/50 hover:text-photon focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="size-4" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.24em] text-muted-foreground/0 transition-colors duration-300 group-hover:text-muted-foreground"
      >
        Ascend
      </span>
    </button>
  );
}
