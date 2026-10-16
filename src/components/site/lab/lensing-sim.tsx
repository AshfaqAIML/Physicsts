"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PresetChips, presetParamEq, type Preset } from "./preset-chips";
import {
  EXPERIMENT_EVENT,
  restoreFlag,
  restoreNumber,
  type BenchReporter,
  type ExperimentSpec,
} from "./experiment-link";
import { ShareExperimentButton } from "./share-experiment";

/**
 * GRAVITATIONAL LENSING — a working thin-lens ray-shooting simulation.
 *
 * Physics: for a point-mass lens, a light ray arriving at image-plane
 * position θ (relative to the lens) originates from source-plane
 * position β = θ − θ_E²·θ/|θ|². Every screen block below is traced
 * backwards through this mapping to the source plane and the sky is
 * sampled there. Surface brightness is conserved by construction, so
 * Einstein rings, arcs, and multiple images emerge from the mapping
 * itself — nothing is painted.
 *
 * Approximations (stated honestly): point-mass lens, thin-lens
 * (single deflection plane), small-angle deflection. No full
 * null-geodesic integration through the metric.
 */

type Mode = "stars" | "grid";

type RGB = [number, number, number];

const MASS_MIN = 24;
const MASS_MAX = 140;
const DEFAULT_THETA_E = 72;
const DEFAULT_LENS = { x: 0.55, y: 0.42 }; // fractions of canvas size

/* ---------- one-tap experiments ----------
 *
 * Physics notes (point-mass lens, β = θ − θ_E²θ/|θ|²):
 * · "Einstein ring" — a source aligned with the lens (|β| → 0) images onto
 *   the ring of radius θ_E; a large θ_E makes the ring unmissable.
 * · "Double image" — any misalignment |β| = u·θ_E splits the source into two
 *   images at θ± = ½(β ± √(β² + 4θ_E²)); with u = 0.35 they sit at
 *   +1.19 θ_E and −0.84 θ_E, straddling the ring, total magnification
 *   μ = (u² + 2)/(u√(u² + 4)) ≈ 3.0.
 * · "Caustic grid" — the coordinate grid in the source plane is mapped
 *   through the lens equation; the tangential stretching and the fold at
 *   θ_E show the lens mapping itself.
 */

type LensingPreset = Preset & {
  thetaE: number;
  mode: Mode;
  showRing: boolean;
  /** "aligned" resets the lens to the default plate position; "offset" drags it ~0.35 θ_E off alignment. */
  placement: "aligned" | "offset";
};

const LENSING_PRESETS: readonly LensingPreset[] = [
  {
    id: "ring",
    label: "Einstein ring",
    title: "θ_E = 110 px · starfield · guide on — lens realigned with the plate; sources near the axis bloom into a ring",
    thetaE: 110,
    mode: "stars",
    showRing: true,
    placement: "aligned",
  },
  {
    id: "double",
    label: "Double image",
    title: "θ_E = 70 px · lens offset by 0.35 θ_E — aligned sources split into two images at +1.19 θ_E and −0.84 θ_E (μ ≈ 3)",
    thetaE: 70,
    mode: "stars",
    showRing: true,
    placement: "offset",
  },
  {
    id: "caustic",
    label: "Caustic grid",
    title: "θ_E = 90 px · coordinate grid — the source-plane grid warps through the lens mapping; drag the lens to sweep the caustic",
    thetaE: 90,
    mode: "grid",
    showRing: true,
    placement: "aligned",
  },
];

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgb(hex: string): RGB {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function withAlpha(rgb: RGB, a: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
}

export function LensingSim({
  onReport,
}: {
  /** Reports the bench's shareable state upward for whole-lab tour links. */
  onReport?: BenchReporter;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);

  const [thetaE, setThetaE] = useState(DEFAULT_THETA_E);
  const [showRing, setShowRing] = useState(true);
  const [mode, setMode] = useState<Mode>("stars");
  // False until the visitor moves the lens by hand — presets place it too,
  // so lens placement participates in the active-preset comparison.
  const [lensMoved, setLensMoved] = useState(false);

  // Mirrors for the render loop
  const thetaERef = useRef(thetaE);
  const ringRef = useRef(showRing);
  const modeRef = useRef(mode);
  const lensRef = useRef({ x: 0, y: 0 }); // CSS pixels, set on first sizing
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const skyRef = useRef<ImageData | null>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<ImageData | null>(null);
  const dirtyRef = useRef(true);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);
  const colorsRef = useRef<{ photon: RGB; dust: RGB }>({ photon: [120, 220, 232], dust: [167, 176, 192] });

  /* ---------- procedural sky (a quiet deep-field, not a stock image) ---------- */

  const generateSky = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;

    const sky = document.createElement("canvas");
    sky.width = W;
    sky.height = H;
    const ctx = sky.getContext("2d");
    if (!ctx) return;

    const dpr = sizeRef.current.dpr;
    const dark = document.documentElement.classList.contains("dark");

    // Plate background
    ctx.fillStyle = cssVar("--background");
    ctx.fillRect(0, 0, W, H);

    const photon = hexToRgb(cssVar("--photon"));
    const nebula = hexToRgb(cssVar("--nebula"));
    const star: RGB = dark ? [242, 244, 248] : hexToRgb(cssVar("--foreground"));

    // Faint nebular patches (restrained, ≤ 6% alpha)
    for (let i = 0; i < 3; i++) {
      const cx = Math.random() * W;
      const cy = Math.random() * H;
      const r = (0.16 + Math.random() * 0.22) * Math.min(W, H);
      const tint = i % 2 === 0 ? photon : nebula;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, withAlpha(tint, dark ? 0.055 : 0.05));
      g.addColorStop(1, withAlpha(tint, 0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    }

    // Star field — sizes biased small, a handful of brighter stars with glow
    const count = Math.round((W * H) / (dpr * dpr) * 0.0011);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const t = Math.random();
      const r = (0.35 + t * t * 1.15) * dpr;
      const roll = Math.random();
      const tint = roll < 0.15 ? photon : roll < 0.23 ? nebula : star;
      const alpha = 0.28 + Math.random() * 0.68;

      if (r > 1.05 * dpr) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
        g.addColorStop(0, withAlpha(tint, alpha * 0.22));
        g.addColorStop(1, withAlpha(tint, 0));
        ctx.fillStyle = g;
        ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
      }

      ctx.fillStyle = withAlpha(tint, alpha);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    skyRef.current = ctx.getImageData(0, 0, W, H);
  }, []);

  /* ---------- the lens equation, ray-shot per block ---------- */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;

    const dpr = sizeRef.current.dpr;
    const dark = document.documentElement.classList.contains("dark");
    const block = Math.max(2, Math.round(dpr));
    const bw = Math.ceil(W / block);
    const bh = Math.ceil(H / block);

    let off = offRef.current;
    if (!off) {
      off = document.createElement("canvas");
      offRef.current = off;
    }
    if (off.width !== bw || off.height !== bh) {
      off.width = bw;
      off.height = bh;
    }
    const octx = off.getContext("2d");
    if (!octx) return;

    let img = imgRef.current;
    if (!img || img.width !== bw || img.height !== bh) {
      img = octx.createImageData(bw, bh);
      imgRef.current = img;
    }
    const data = img.data;

    const Lx = lensRef.current.x * dpr;
    const Ly = lensRef.current.y * dpr;
    const tE = thetaERef.current * dpr;
    const tE2 = tE * tE;
    const keep2 = (16 * dpr) * (16 * dpr);

    const gridMode = modeRef.current === "grid";
    const spacing = 56 * dpr;
    const lineW = 1.15 * dpr;
    const [dr, dg, db] = colorsRef.current.dust;
    const sky = skyRef.current;

    for (let by = 0; by < bh; by++) {
      const py = by * block + block * 0.5;
      for (let bx = 0; bx < bw; bx++) {
        const px = bx * block + block * 0.5;
        const dx = px - Lx;
        const dy = py - Ly;
        const d2 = dx * dx + dy * dy;
        const o = (by * bw + bx) * 4;

        if (d2 < keep2 || !sky) {
          data[o + 3] = 0;
          continue;
        }

        // β = θ − θ_E²·θ/|θ|²  (trace the block back to the source plane)
        const inv = tE2 / d2;
        const sx = px - dx * inv;
        const sy = py - dy * inv;

        if (gridMode) {
          // Coordinate grid drawn in the SOURCE plane — the distortion
          // near the Einstein radius becomes directly visible.
          const fx = sx / spacing;
          const gx = Math.abs(fx - Math.round(fx)) * spacing;
          const fy = sy / spacing;
          const gy = Math.abs(fy - Math.round(fy)) * spacing;
          const ax = Math.max(0, 1 - gx / lineW);
          const ay = Math.max(0, 1 - gy / lineW);
          const a = Math.max(ax, ay);
          if (a <= 0.004) {
            data[o + 3] = 0;
            continue;
          }
          data[o] = dr;
          data[o + 1] = dg;
          data[o + 2] = db;
          data[o + 3] = Math.round(a * 92);
        } else {
          // Sample the sky at the traced source position (wrapping edges)
          let ix = Math.floor(sx);
          let iy = Math.floor(sy);
          ix = ((ix % W) + W) % W;
          iy = ((iy % H) + H) % H;
          const s = (iy * W + ix) * 4;
          data[o] = sky.data[s];
          data[o + 1] = sky.data[s + 1];
          data[o + 2] = sky.data[s + 2];
          data[o + 3] = sky.data[s + 3];
        }
      }
    }

    octx.putImageData(img, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, W, H);

    const [pr, pg, pb] = colorsRef.current.photon;

    // Einstein radius (optional guide)
    if (ringRef.current) {
      ctx.save();
      ctx.strokeStyle = withAlpha(colorsRef.current.photon, 0.5);
      ctx.lineWidth = dpr;
      ctx.setLineDash([5 * dpr, 7 * dpr]);
      ctx.beginPath();
      ctx.arc(Lx, Ly, tE, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // The lens glyph: a dark mass with a thin photon rim
    const glowR = 30 * dpr;
    const g = ctx.createRadialGradient(Lx, Ly, 0, Lx, Ly, glowR);
    g.addColorStop(0, withAlpha(colorsRef.current.photon, 0.22));
    g.addColorStop(1, withAlpha(colorsRef.current.photon, 0));
    ctx.fillStyle = g;
    ctx.fillRect(Lx - glowR, Ly - glowR, glowR * 2, glowR * 2);

    ctx.beginPath();
    ctx.arc(Lx, Ly, 10 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = dark ? "#04060b" : "#10131c";
    ctx.fill();
    ctx.lineWidth = 1.5 * dpr;
    ctx.strokeStyle = `rgb(${pr}, ${pg}, ${pb})`;
    ctx.stroke();
  }, []);

  /* ---------- lifecycle: sizing, visibility, theme, input ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const refreshColors = () => {
      try {
        colorsRef.current = {
          photon: hexToRgb(cssVar("--photon")),
          dust: hexToRgb(cssVar("--dust")),
        };
      } catch {
        /* keep previous colours */
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      // keep lens proportions on resize
      lensRef.current = {
        x: rect.width * DEFAULT_LENS.x,
        y: rect.height * DEFAULT_LENS.y,
      };
      refreshColors();
      generateSky();
      dirtyRef.current = true;
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      refreshColors();
      generateSky();
      dirtyRef.current = true;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const frame = () => {
      rafRef.current = requestAnimationFrame(frame);
      if (!dirtyRef.current || !visibleRef.current) return;
      dirtyRef.current = false;
      draw();
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, [draw, generateSky]);

  /* ---------- pointer: drag the lens, read the impact parameter ---------- */

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const updateReadout = (px: number, py: number) => {
    const el = readoutRef.current;
    if (!el) return;
    const L = lensRef.current;
    const b = Math.hypot(px - L.x, py - L.y);
    const tE = thetaERef.current;
    const deflect = b > 1 ? (tE * tE) / b : Infinity;
    el.textContent =
      b < 16
        ? "b — · δθ —"
        : `b = ${b.toFixed(0)} px · δθ ≈ ${deflect.toFixed(1)} px`;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pointerPos(e);
    const { w, h } = sizeRef.current;
    lensRef.current = {
      x: Math.min(Math.max(p.x, 0), w),
      y: Math.min(Math.max(p.y, 0), h),
    };
    setLensMoved(true);
    dirtyRef.current = true;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerPos(e);
    updateReadout(p.x, p.y);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      const { w, h } = sizeRef.current;
      lensRef.current = {
        x: Math.min(Math.max(p.x, 0), w),
        y: Math.min(Math.max(p.y, 0), h),
      };
      if (!lensMoved) setLensMoved(true);
      dirtyRef.current = true;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = e.shiftKey ? 2 : 10;
    const L = lensRef.current;
    const { w, h } = sizeRef.current;
    let handled = true;
    switch (e.key) {
      case "ArrowLeft": L.x = Math.max(0, L.x - step); break;
      case "ArrowRight": L.x = Math.min(w, L.x + step); break;
      case "ArrowUp": L.y = Math.max(0, L.y - step); break;
      case "ArrowDown": L.y = Math.min(h, L.y + step); break;
      default: handled = false;
    }
    if (handled) {
      e.preventDefault();
      setLensMoved(true);
      dirtyRef.current = true;
    }
  };

  const reset = () => {
    const { w, h } = sizeRef.current;
    lensRef.current = { x: w * DEFAULT_LENS.x, y: h * DEFAULT_LENS.y };
    setThetaE(DEFAULT_THETA_E);
    thetaERef.current = DEFAULT_THETA_E;
    dirtyRef.current = true;
  };

  /* ---------- presets: set every parameter and place the lens ---------- */

  const applyPreset = (preset: LensingPreset) => {
    setThetaE(preset.thetaE);
    thetaERef.current = preset.thetaE;
    setMode(preset.mode);
    modeRef.current = preset.mode;
    setShowRing(preset.showRing);
    ringRef.current = preset.showRing;

    const { w, h } = sizeRef.current;
    let x = w * DEFAULT_LENS.x;
    let y = h * DEFAULT_LENS.y;
    if (preset.placement === "offset") {
      // ~0.35 θ_E of misalignment: two well-separated images (u = |β|/θ_E)
      const off = (0.35 * preset.thetaE) / Math.SQRT2;
      x += off;
      y += off;
    }
    lensRef.current = {
      x: Math.min(Math.max(x, 0), w),
      y: Math.min(Math.max(y, 0), h),
    };
    setLensMoved(false);
    dirtyRef.current = true;
  };

  const activePresetId = lensMoved
    ? null
    : (LENSING_PRESETS.find(
        (p) =>
          presetParamEq(p.thetaE, thetaE) &&
          p.mode === mode &&
          p.showRing === showRing
      )?.id ?? null);

  // The shareable state of this bench — one builder feeds the per-bench
  // share chip, the tour reporter, and nothing else, so the three views
  // of "this experiment" can never drift apart.
  const shareParams = useCallback(
    () => ({
      e: Math.round(thetaE),
      d: mode,
      r: showRing ? 1 : 0,
      x: (
        sizeRef.current.w > 1
          ? lensRef.current.x / sizeRef.current.w
          : DEFAULT_LENS.x
      ).toFixed(3),
      y: (
        sizeRef.current.h > 1
          ? lensRef.current.y / sizeRef.current.h
          : DEFAULT_LENS.y
      ).toFixed(3),
      m: lensMoved ? 1 : 0,
    }),
    [thetaE, mode, showRing, lensMoved]
  );

  // Report upward whenever the shareable state settles. Lens drags move
  // the mass through refs without re-rendering, so the figure's pointerup
  // reports once more after the hand lets go.
  useEffect(() => {
    onReport?.(shareParams(), activePresetId);
  }, [onReport, shareParams, activePresetId]);

  /* ---------- shared-link restore ---------- */

  useEffect(() => {
    const onRestore = (e: Event) => {
      const spec = (e as CustomEvent<ExperimentSpec>).detail;
      if (spec?.tab !== "lensing") return;
      const e2 = restoreNumber(spec.params, "e", MASS_MIN, MASS_MAX, DEFAULT_THETA_E);
      setThetaE(e2);
      thetaERef.current = e2;
      const d: Mode = spec.params["d"] === "grid" ? "grid" : "stars";
      setMode(d);
      modeRef.current = d;
      const r = restoreFlag(spec.params, "r", true);
      setShowRing(r);
      ringRef.current = r;

      // Lens position is shared as canvas-normalized fractions so the link
      // survives different screen sizes.
      const { w, h } = sizeRef.current;
      if (w > 1 && h > 1) {
        const nx = restoreNumber(spec.params, "x", 0, 1, DEFAULT_LENS.x);
        const ny = restoreNumber(spec.params, "y", 0, 1, DEFAULT_LENS.y);
        lensRef.current = { x: nx * w, y: ny * h };
      }
      setLensMoved(restoreFlag(spec.params, "m", false));
      dirtyRef.current = true;
    };
    window.addEventListener(EXPERIMENT_EVENT, onRestore);
    return () => window.removeEventListener(EXPERIMENT_EVENT, onRestore);
  }, []);

  /* ---------- UI ---------- */

  return (
    <div data-print="hide" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <figure className="m-0">
        <div
          className="relative h-[380px] overflow-hidden rounded-lg border border-border bg-card sm:h-[460px] lg:h-[560px]"
          onPointerUp={() => onReport?.(shareParams(), activePresetId)}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full cursor-grab touch-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            tabIndex={0}
            role="application"
            aria-label="Gravitational lensing demonstration. Drag or use arrow keys to move the lens mass; hold Shift for fine control."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onKeyDown={onKeyDown}
          />
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 meta-sm text-muted-foreground">
          <span>Fig. L-1 · Point-mass thin lens · Ray-shot</span>
          <span ref={readoutRef} className="tabular-nums" aria-live="off">
            b — · δθ —
          </span>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="meta-sm text-muted-foreground">
            Controls
          </h3>

          <div className="mt-5 space-y-5">
            <PresetChips
              ariaLabel="Experiment presets for gravitational lensing"
              presets={LENSING_PRESETS}
              activeId={activePresetId}
              onSelect={applyPreset}
            />

            <div>
              <ShareExperimentButton
                tab="lensing"
                preset={activePresetId}
                instrument="the lensing bench"
                params={shareParams}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="lens-mass" className="text-sm">
                  Lens mass
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  θ_E = {thetaE} px
                </span>
              </div>
              <Slider
                id="lens-mass"
                aria-label="Einstein radius in pixels, proportional to the square root of lens mass"
                min={MASS_MIN}
                max={MASS_MAX}
                step={1}
                value={[thetaE]}
                onValueChange={([v]) => {
                  setThetaE(v);
                  thetaERef.current = v;
                  dirtyRef.current = true;
                }}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Sets θ_E = √(4GM/c² · D_LS/(D_L D_S)) — the Einstein radius grows
                with the square root of the enclosed mass.
              </p>
            </div>

            <div className="space-y-3">
              <span className="block text-sm" id="lens-mode-label">
                Source plane
              </span>
              <div
                role="radiogroup"
                aria-labelledby="lens-mode-label"
                className="grid grid-cols-2 gap-2"
              >
                {(["stars", "grid"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => {
                      setMode(m);
                      modeRef.current = m;
                      dirtyRef.current = true;
                    }}
                    className={cn(
                      "rounded-md border px-3 py-2 eyebrow transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      mode === m
                        ? "border-photon/60 bg-photon/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m === "stars" ? "Starfield" : "Coord grid"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="lens-ring" className="text-sm">
                Einstein ring guide
              </Label>
              <Switch
                id="lens-ring"
                aria-label="Show the Einstein radius circle"
                checked={showRing}
                onCheckedChange={(v) => {
                  setShowRing(v);
                  ringRef.current = v;
                  dirtyRef.current = true;
                }}
              />
            </div>

            <Button variant="outline" size="sm" onClick={reset} className="w-full">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset lens
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="meta-sm text-muted-foreground">
            How it works
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Every block of pixels is traced <em>backwards</em> through the lens
            equation to where its light originated, and the sky is sampled there.
            Surface brightness is conserved by the mapping — rings, arcs, and
            multiple images are consequences, not drawings. Drag the dark mass
            across a star and watch it split into arcs.
          </p>
        </div>
      </div>
    </div>
  );
}
