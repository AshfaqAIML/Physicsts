"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { BlackHoleCanvas } from "@/components/site/black-hole";
import { Tex } from "@/components/site/tex";

/**
 * HERO — the cinematic opening. A procedural black hole behind,
 * an editorial statement in front, and Einstein's field equation
 * presented as an intellectual aside, not a decoration.
 */
export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax — content drifts up and fades; the scene scales.
  const contentY = useTransform(scrollYProgress, [0, 0.8], ["0%", reduce ? "0%" : "-18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  const ease = [0.21, 0.47, 0.32, 0.98] as const;

  return (
    <section
      id="home"
      ref={ref}
      aria-labelledby="hero-heading"
      className="grain relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Scene */}
      <motion.div style={{ scale: sceneScale }} className="absolute inset-0" aria-hidden="true">
        <BlackHoleCanvas />
        {/* Vignette + transition into the page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_105%)]" />
        {/* Readability scrim — keeps the editorial column clear of the scene */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_0%,color-mix(in_oklab,var(--background)_55%,transparent)_38%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-background" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-32 sm:px-6 sm:pb-32 lg:px-8"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground"
          >
            <span aria-hidden="true" className="inline-block h-px w-10 bg-photon/70" />
            Physics · Mathematics · The Universe
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease }}
            className="mt-7 font-serif text-[2.6rem] leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            The Universe Is a{" "}
            <em className="text-glow-photon not-italic text-photon">Question</em>{" "}
            Worth a Lifetime.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            I explore the ideas, mathematical structures, and physical
            principles that help us understand the universe — from the
            smallest scales of nature to the largest structures of the cosmos.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.68, ease }}
            data-print="hide"
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex h-12 items-center gap-2.5 rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:hover:shadow-photon/25"
            >
              Explore My Work
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#about"
              className="inline-flex h-12 items-center rounded-md border border-border px-7 text-sm font-medium text-foreground transition-colors duration-300 hover:border-photon/50 hover:bg-photon/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              About the Physicist
            </a>
          </motion.div>

          {/* The field equation — an aside, presented quietly */}
          <motion.figure
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.0 }}
            className="mt-14 max-w-md"
          >
            <div className="border-l-2 border-photon/40 pl-5 text-muted-foreground">
              <div className="text-[1.05em]">
                <Tex
                  display
                  math="G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^{4}}\, T_{\mu\nu}"
                  ariaLabel="Einstein's field equations: G mu nu plus Lambda g mu nu equals 8 pi G over c to the fourth, times T mu nu"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                Einstein field equations · 1915
              </figcaption>
            </div>
          </motion.figure>
        </div>
      </motion.div>

      {/* Scroll invitation */}
      <motion.a
        href="#about"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        data-print="hide"
        className="group absolute inset-x-0 bottom-7 z-10 mx-auto flex w-fit flex-col items-center gap-3 rounded-sm pb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-label="Scroll down to the About section"
      >
        <span>Descend into the Universe</span>
        <span aria-hidden="true" className="relative flex h-10 w-px justify-center overflow-hidden bg-border">
          <motion.span
            className="absolute top-0 h-4 w-px bg-photon"
            animate={reduce ? undefined : { y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeIn" }}
          />
        </span>
        <ArrowDown className="size-3 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
