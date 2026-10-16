"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { BlackHoleCanvas } from "@/components/site/black-hole";
import { useMotionPreference } from "@/components/site/providers";
import { DUR, EASE, EASE_MASK, STAGGER } from "@/lib/motion-tokens";

/** The display statement, split at its rhetorical seam: the
    emphasised word opens the second line. */
const HERO_LINES = [
  <>The Universe Is a</>,
  <>
    <em className="text-glow-photon not-italic text-photon">Question</em>{" "}
    Worth a Lifetime.
  </>,
] as const;

/**
 * HERO — the cinematic opening. A procedural black hole behind,
 * an editorial statement in front, and Einstein's field equation
 * presented as an intellectual aside, not a decoration.
 *
 * Choreography (no waiting required — the page is usable at 0s):
 * eyebrow → display lines rising out of their own masks → lede →
 * keys → the equation, whose rule draws itself in. On scroll, the
 * scene and the content part at different rates — a parallax with
 * actual depth — and the whole statement lifts away.
 */
export function Hero({ equation }: { equation: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced } = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Two-plane parallax — content lifts away faster than the scene
  // recedes, and the scene slowly scales: depth without weight.
  const contentY = useTransform(scrollYProgress, [0, 0.8], ["0%", reduced ? "0%" : "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "9%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);

  return (
    <section
      id="home"
      ref={ref}
      aria-labelledby="hero-heading"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Scene */}
      <motion.div
        style={{ scale: sceneScale, y: sceneY }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <BlackHoleCanvas />
        {/* Vignette + transition into the page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_105%)]" />
        {/* Readability scrim — keeps the editorial column clear of the scene */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_0%,color-mix(in_oklab,var(--background)_55%,transparent)_38%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-background" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-32 sm:px-6 sm:pb-32 lg:px-8"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="flex items-center gap-3 eyebrow-wide text-muted-foreground"
          >
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="inline-block h-px w-10 origin-left bg-photon/70"
            />
            Physics · Mathematics · The Universe
          </motion.p>

          {/* The display statement — each line rises out of its own
              mask. The padding/negative-margin pair reserves room for
              the serif descenders the tight line-height would clip. */}
          <h1
            id="hero-heading"
            className="type-display mt-7 text-balance text-foreground"
          >
            {HERO_LINES.map((line, i) => (
              <span
                key={i}
                className="-mb-[0.26em] block overflow-hidden pb-[0.26em]"
              >
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: DUR.cinematic,
                    delay: 0.3 + i * STAGGER,
                    ease: EASE_MASK,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.56, ease: EASE }}
            className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Notes that rebuild spacetime and quantum theory from first
            principles, and laboratory simulations where every photon,
            orbit, and wavefront is computed live — assumptions stated
            beside the results.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.72, ease: EASE }}
            data-print="hide"
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            {/* The instrument button — the system's one primary key */}
            <a href="#projects" className="btn-key group">
              <span className="btn-key-label">Explore the work</span>
              <span className="btn-key-glyph" aria-hidden="true">
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
            {/* The quiet alternative — an editorial link, not a button */}
            <a
              href="#about"
              className="group inline-flex h-12 items-center gap-2 eyebrow text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="link-quiet pb-0.5">About the physicist</span>
              <ArrowDown
                className="size-3.5 text-muted-foreground/60 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-photon"
                aria-hidden="true"
              />
            </a>
          </motion.div>

          {/* The field equation — an aside, presented quietly; its
              rule draws itself in, like a margin being ruled. */}
          <motion.figure
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.0 }}
            className="mt-14 max-w-md"
          >
            <div className="relative pl-5 text-muted-foreground">
              <motion.span
                aria-hidden="true"
                initial={reduced ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.1, delay: 1.05, ease: EASE }}
                className="absolute left-0 top-0 h-full w-[2px] origin-top bg-photon/40"
              />
              <div className="text-[1.05em]">{equation}</div>
              <figcaption className="mt-3 meta-sm text-muted-foreground">
                Einstein field equations · 1915 — geometry on the left,
                matter and energy on the right
              </figcaption>
            </div>
          </motion.figure>
        </div>
      </motion.div>

      {/* Observatory annotation — binds the render to the page furniture.
          The lensing behind is computed live; the label states exactly that. */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.3 }}
        aria-hidden="true"
        data-print="hide"
        className="absolute bottom-28 right-8 z-10 hidden flex-col items-center gap-4 xl:flex"
      >
        <span className="size-1.5 rounded-full bg-photon/80" />
        <span className="h-28 w-px bg-gradient-to-b from-photon/50 to-transparent" />
        <span className="writing-vertical meta-xs text-muted-foreground/60">
          Fig. 00 · Gravitational lensing — computed live
        </span>
      </motion.div>

      {/* Scroll invitation */}
      <motion.a
        href="#about"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        data-print="hide"
        className="group absolute inset-x-0 bottom-7 z-10 mx-auto flex w-fit flex-col items-center gap-3 rounded-sm pb-1 eyebrow text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-label="Scroll down to the About section"
      >
        <span>Descend into the Universe</span>
        <span aria-hidden="true" className="relative flex h-10 w-px justify-center overflow-hidden bg-border">
          <motion.span
            className="absolute top-0 h-4 w-px bg-photon"
            animate={reduced ? undefined : { y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
          />
        </span>
        <ArrowDown className="size-3 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
