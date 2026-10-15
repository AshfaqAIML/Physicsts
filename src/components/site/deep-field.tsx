"use client";

import { useEffect, useRef } from "react";
import { getMotionReduced } from "@/lib/motion-preference";

/**
 * DEEP FIELD AMBIENCE — a very quiet, fixed starfield behind the page:
 * the sense that every section is observed from the same observatory.
 * ~110 twinkling stars in the dark theme; a faint dusting of paper
 * fibres in the light theme. Parallax is a whisper (≤ 3% of scroll).
 * Reduced motion: one static render, no loop, no parallax.
 */

type Star = {
  x: number; y: number; r: number;
  base: number; phase: number; speed: number; depth: number;
};

export function DeepField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0, h = 0, dpr = 1;
    let raf = 0;
    let running = true;
    let visible = true;
    let last = 0;
    let reduce = getMotionReduced();

    const seed = () => {
      const dark = document.documentElement.classList.contains("dark");
      const count = dark ? 110 : 40;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 0.9,
        base: dark ? 0.12 + Math.random() * 0.4 : 0.05 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.1,
        depth: 0.4 + Math.random() * 0.6,
      }));
    };

    const draw = (t: number, scrollY: number) => {
      const dark = document.documentElement.classList.contains("dark");
      const fg = dark ? [242, 244, 248] : [20, 22, 29];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(s.phase + t * 0.001 * s.speed);
        const py = reduce ? s.y : s.y - (scrollY * 0.03 * s.depth) % (h * 1.2);
        const yy = ((py % h) + h) % h;
        ctx.beginPath();
        ctx.arc(s.x, yy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fg[0]}, ${fg[1]}, ${fg[2]}, ${s.base * tw})`;
        ctx.fill();
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      seed();
      if (reduce) draw(0, window.scrollY);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const mo = new MutationObserver(() => {
      seed();
      if (reduce) draw(0, window.scrollY);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!running || !visible) return;
      if (t - last > 40) {
        last = t;
        draw(t, window.scrollY);
      }
    };
    if (!reduce) raf = requestAnimationFrame(frame);
    else draw(0, window.scrollY);

    // Site-level motion preference ("calm the universe")
    const onMotion = () => {
      reduce = getMotionReduced();
      if (reduce) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        draw(0, window.scrollY);
      } else if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener("phys:motion", onMotion);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("phys:motion", onMotion);
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
