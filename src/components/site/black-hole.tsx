"use client";

import { useEffect, useRef } from "react";
import { getMotionReduced } from "@/lib/motion-preference";

/**
 * BLACK HOLE — a procedural, physically-inspired visualisation.
 *
 * The accretion disk is a cloud of particles on Keplerian orbits
 * (ω ∝ r^{-3/2}); the far side of the disk is drawn as an arc above
 * the shadow, the way gravitational lensing presents it (as in the
 * Interstellar imagery and the EHT photographs); brightness is
 * Doppler-beamed to one side. It is an artist's rendering governed
 * by real structure, not a ray-traced solution of the geodesics —
 * and it is quiet, slow, and calm.
 */

type Particle = {
  /** orbital radius in units of the shadow radius */
  r: number;
  phi: number;
  omega: number;
  size: number;
  tint: number;
  jitter: number;
  baseAlpha: number;
};

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function BlackHoleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let dark = true;

    let starCanvas: HTMLCanvasElement | null = null;
    let particles: Particle[] = [];

    const buildStars = () => {
      const sc = document.createElement("canvas");
      sc.width = Math.max(1, Math.round(w * dpr));
      sc.height = Math.max(1, Math.round(h * dpr));
      const sctx = sc.getContext("2d");
      if (!sctx) return;

      sctx.fillStyle = cssVar("--background");
      sctx.fillRect(0, 0, sc.width, sc.height);

      const photon = hexToRgb(cssVar("--photon"));
      const nebula = hexToRgb(cssVar("--nebula"));
      const fg = hexToRgb(cssVar("--foreground"));

      // Two restrained nebulosities
      for (let i = 0; i < 2; i++) {
        const cx = sc.width * (i === 0 ? 0.22 : 0.8);
        const cy = sc.height * (i === 0 ? 0.24 : 0.78);
        const r = Math.min(sc.width, sc.height) * 0.5;
        const tint = i === 0 ? photon : nebula;
        const g = sctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${tint[0]},${tint[1]},${tint[2]},${dark ? 0.05 : 0.045})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        sctx.fillStyle = g;
        sctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      }

      // Stars — sizes biased small, a few bright ones
      const count = Math.round((sc.width * sc.height) / 4200);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * sc.width;
        const y = Math.random() * sc.height;
        const t = Math.random();
        const r = (0.4 + t * t * 1.1) * dpr;
        const roll = Math.random();
        const tint = roll < 0.12 ? photon : roll < 0.2 ? nebula : fg;
        const alpha = 0.25 + Math.random() * 0.6;
        sctx.fillStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${alpha})`;
        sctx.beginPath();
        sctx.arc(x, y, r, 0, Math.PI * 2);
        sctx.fill();
      }
      starCanvas = sc;
    };

    const buildParticles = () => {
      const arr: Particle[] = [];
      /* Performance guard — the particle budget scales with the area
         being painted, so small viewports (usually the weakest GPUs)
         carry a lighter disk. ~560 at phone sizes, ~900 at tablet,
         the full 1150 on desktop. */
      const budget = w * h;
      const N = budget < 500_000 ? 560 : budget < 1_100_000 ? 900 : 1150;
      for (let i = 0; i < N; i++) {
        // Radius biased toward the hot inner edge
        const u = Math.random();
        const r = 2.15 + Math.pow(u, 1.6) * 2.25;
        arr.push({
          r,
          phi: Math.random() * Math.PI * 2,
          omega: 0.42 * Math.pow(2.15 / r, 1.5), // Keplerian
          size: 0.5 + Math.random() * 1.5,
          tint: Math.random(),
          jitter: (Math.random() - 0.5) * 0.5,
          baseAlpha: 0.22 + Math.random() * 0.6,
        });
      }
      particles = arr;
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect || rect.width < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      dark = document.documentElement.classList.contains("dark");
      buildStars();
    };

    const draw = (dt: number) => {
      const photon = hexToRgb(cssVar("--photon"));
      const fg = hexToRgb(cssVar("--foreground"));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      if (starCanvas) ctx.drawImage(starCanvas, 0, 0, w, h);

      const cx = w * 0.62;
      const cy = h * 0.45;
      const R = Math.min(Math.max(Math.min(w, h) * 0.085, 44), 108);
      /* Below ~1180px the editorial column spans nearly the full hero, so
         the disc cannot clear the text. In light mode a solid ink disc
         under dark grey text measures ≈2.9:1 — so narrow viewports render
         the shadow as a watermark: 10% ink fill plus an engraved outline,
         which measures ≥4.8:1 behind the same text. The photon ring keeps
         the figure legible. Dark mode keeps the full shadow (light text
         on it passes comfortably). */
      const watermark = !dark && w < 1180;

      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

      /* ----- far side of the disk: lensed into an arc above ----- */
      for (const p of particles) {
        const s = Math.sin(p.phi);
        if (s <= 0) continue;
        const px = cx + Math.cos(p.phi) * p.r * R;
        const py =
          cy -
          Math.pow(s, 0.62) * p.r * R * 0.5 +
          p.jitter * R * 0.05;
        const beam = Math.max(0.32, 1 - 0.62 * Math.cos(p.phi));
        const a = p.baseAlpha * beam * 0.8;
        const color = p.tint < 0.68 ? fg : p.tint < 0.9 ? photon : hexToRgb(cssVar("--nebula"));
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${a * (dark ? 1 : 0.55)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ----- faint secondary image, arcing below ----- */
      for (const p of particles) {
        const s = Math.sin(p.phi);
        if (s <= 0.2) continue;
        const px = cx + Math.cos(p.phi) * p.r * R * 0.94;
        const py = cy + Math.pow(s, 0.8) * p.r * R * 0.3;
        const a = p.baseAlpha * 0.14;
        const color = p.tint < 0.8 ? fg : photon;
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${a * (dark ? 1 : 0.5)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ----- the shadow ----- */
      ctx.globalCompositeOperation = "source-over";
      if (dark) {
        const halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 2.1);
        halo.addColorStop(0, "rgba(2,3,6,0.85)");
        halo.addColorStop(1, "rgba(2,3,6,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(cx - R * 2.1, cy - R * 2.1, R * 4.2, R * 4.2);
      }
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      if (watermark) {
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = cssVar("--foreground");
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(${fg[0]},${fg[1]},${fg[2]},0.28)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.fillStyle = dark ? "#020306" : cssVar("--foreground");
        ctx.fill();
      }

      /* ----- photon ring ----- */
      const ringA = dark ? 0.85 : 0.75;
      if (dark) {
        ctx.strokeStyle = `rgba(${photon[0]},${photon[1]},${photon[2]},0.16)`;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${photon[0]},${photon[1]},${photon[2]},${ringA})`;
      ctx.lineWidth = dark ? 1.6 : 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
      ctx.stroke();

      /* ----- near side of the disk: passing in front, below ----- */
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (const p of particles) {
        const s = Math.sin(p.phi);
        if (s > 0) continue;
        const px = cx + Math.cos(p.phi) * p.r * R;
        const py =
          cy + -s * p.r * R * 0.17 + p.jitter * R * 0.045;
        const beam = Math.max(0.32, 1 - 0.62 * Math.cos(p.phi));
        const a = p.baseAlpha * beam;
        const color = p.tint < 0.68 ? fg : p.tint < 0.9 ? photon : hexToRgb(cssVar("--nebula"));
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${a * (dark ? 1 : 0.6)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Advance orbits
      for (const p of particles) p.phi += p.omega * dt;
    };

    let reduced = getMotionReduced();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      if (reduced) {
        draw(0);
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      draw(dt);
    };

    resize();
    buildParticles();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Site-level motion preference ("calm the universe")
    const onMotion = () => {
      reduced = getMotionReduced();
      if (reduced) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        draw(0);
      } else if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener("phys:motion", onMotion);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !reduced && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      /* Only a genuine theme change rebuilds the star canvas — the
         <html> class also flips for motion preferences and the theme
         cross-fade, none of which should re-seed the sky. */
      const darkNow = document.documentElement.classList.contains("dark");
      if (darkNow === dark) return;
      dark = darkNow;
      buildStars();
      if (reduced) draw(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("phys:motion", onMotion);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />;
}
