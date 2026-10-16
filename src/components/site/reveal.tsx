"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMotionPreference } from "@/components/site/providers";
import { DUR, EASE, VIEW_ONCE } from "@/lib/motion-tokens";

/**
 * Restrained scroll-reveal: a gentle rise and fade, once.
 * Renders statically when the visitor has calmed the universe
 * (site preference) or asked the OS to reduce motion — the same
 * signal that stills the canvases, so the whole site agrees.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const { reduced } = useMotionPreference();
  const Comp = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW_ONCE}
      transition={{ duration: DUR.entrance, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}
