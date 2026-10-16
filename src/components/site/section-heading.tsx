"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMotionPreference } from "@/components/site/providers";
import { DUR, EASE, VIEW_ONCE } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/**
 * Rise — the shared entrance primitive for heading choreography:
 * a fade and rise, once, on scroll. When the visitor has calmed the
 * universe, a plain element renders instead, so nothing is ever left
 * waiting off-stage at opacity 0.
 */
function Rise({
  reduced,
  as = "div",
  delay = 0,
  y = 16,
  duration = DUR.entrance,
  className,
  id,
  children,
}: {
  reduced: boolean;
  as?: "div" | "h2" | "p";
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} id={id}>
        {children}
      </Tag>
    );
  }
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      id={id}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW_ONCE}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/**
 * Editorial section header — mono index, serif display, rule line.
 * The entrance is choreographed like a journal folio: the eyebrow
 * and its growing hairline arrive first, the display title rises a
 * beat later, the lede follows. Static when motion is calmed.
 * The optional `meta` prints a journal running-head.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  meta,
  align = "left",
  headingId,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  meta?: string;
  align?: "left" | "center";
  /** The id the section's aria-labelledby points at — every section
      passes the id its own <section aria-labelledby> references, so
      screen readers get a named region and axe sees valid wiring. */
  headingId?: string;
  className?: string;
}) {
  const { reduced } = useMotionPreference();

  const rule = reduced ? (
    <span aria-hidden="true" className="h-px w-8 shrink-0 bg-border" />
  ) : (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEW_ONCE}
      transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
      className="h-px w-8 shrink-0 origin-left bg-border"
    />
  );

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Rise
        reduced={reduced}
        y={10}
        duration={0.6}
        className={cn(
          "flex items-center gap-3 eyebrow text-muted-foreground",
          align === "center" && "justify-center"
        )}
      >
        <span className="text-photon">{index}</span>
        {rule}
        <span className="min-w-0">{eyebrow}</span>
        {meta ? (
          <>
            <span
              aria-hidden="true"
              className="hidden h-px max-w-24 flex-1 bg-gradient-to-r from-border to-transparent lg:block"
            />
            <span className="hidden meta-xs text-muted-foreground lg:block">
              {meta}
            </span>
          </>
        ) : null}
      </Rise>
      <Rise
        reduced={reduced}
        as="h2"
        y={22}
        delay={0.08}
        className="type-h2 mt-5 text-balance text-foreground"
        id={headingId}
      >
        {title}
      </Rise>
      {lede ? (
        <Rise
          reduced={reduced}
          as="p"
          y={16}
          delay={0.18}
          className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {lede}
        </Rise>
      ) : null}
    </div>
  );
}
