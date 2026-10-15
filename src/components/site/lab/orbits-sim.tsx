"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  getMotionReduced as getReduceMotion,
  subscribeMotion as subscribeReduceMotion,
} from "@/lib/motion-preference";
import { PresetChips, presetParamEq, type Preset } from "./preset-chips";

/**
 * ORBITAL MECHANICS — the Newtonian two-body problem, live.
 *
 * The relative coordinate obeys r̈ = −GM·r/|r|³ (units: G = 1, M = 1,
 * launch radius r₀ = 1). Integrated with velocity Verlet at fixed
 * dt — a symplectic scheme, so energy drift stays bounded. The dashed
 * overlay is the exact analytic conic r(θ) = p/(1 + e·cosθ) computed
 * from the launch conditions; agreement between the two is the point.
 *
 * Approximations: Newtonian gravity only — no relativistic precession,
 * drag, or third bodies. Fixed-step integration.
 */

const DT = 0.002;

/* ---------- one-tap experiments ----------
 *
 * Launch at r₀ = 1 with tangential speed f·v_circ (v_circ = 1, GM = 1):
 *   ε = f²/2 − 1,  h = f,  e = √(1 + 2εh²),  a = −1/(2ε) if bound.
 * · circle:  f = 1.00 → ε = −0.500, e = 0.000, T = 2π
 * · ellipse: f = 0.75 → ε = −0.719, e = 0.438 (launch at apoapsis), T ≈ 3.65
 * · escape:  f = 1.45 → ε = +0.051, e = 1.103 — just past f = √2 ≈ 1.414,
 *   the conic opens into a hyperbola and the body never returns
 * · binary:  m₂/m₁ = 0.5 at f = 1 — both bodies orbit the barycentre at
 *   1/3 and 2/3 of the separation: the exoplanet wobble, at full tilt
 */

type OrbitsPreset = Preset & {
  massRatio: number;
  launchF: number;
  showAnalytic: boolean;
  showTrails: boolean;
};

const ORBITS_PRESETS: readonly OrbitsPreset[] = [
  {
    id: "circle",
    label: "Perfect circle",
    title: "f = 1.00 · m₂/m₁ = 0.20 — exactly circular: ε = −0.50, e = 0, period T = 2π",
    massRatio: 0.2,
    launchF: 1.0,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "ellipse",
    label: "Elliptical orbit",
    title: "f = 0.75 · m₂/m₁ = 0.20 — bound ellipse: ε = −0.72, e = 0.44, launch at apoapsis, T ≈ 3.6",
    massRatio: 0.2,
    launchF: 0.75,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "escape",
    label: "Close escape",
    title: "f = 1.45 · m₂/m₁ = 0.20 — just past escape speed √2 ≈ 1.414: ε = +0.05, e = 1.10, unbound",
    massRatio: 0.2,
    launchF: 1.45,
    showAnalytic: false,
    showTrails: true,
  },
  {
    id: "binary",
    label: "Binary dance",
    title: "m₂/m₁ = 0.50 (maximum) · f = 1.00 — both bodies waltz around the barycentre at ⅓ and ⅔ of the separation",
    massRatio: 0.5,
    launchF: 1.0,
    showAnalytic: true,
    showTrails: true,
  },
];

type Vec = { x: number; y: number };

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(rgb: [number, number, number], a: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
}

const getServerReduceMotion = () => false;

export function OrbitsSim() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // null = automatic: paused when the visitor prefers reduced motion
  const [playingOverride, setPlayingOverride] = useState<boolean | null>(null);
  const reduceMotion = useSyncExternalStore(
    subscribeReduceMotion,
    getReduceMotion,
    getServerReduceMotion
  );
  const playing = playingOverride ?? !reduceMotion;
  const [massRatio, setMassRatio] = useState(0.18);
  const [launchF, setLaunchF] = useState(1.0);
  const [speed, setSpeed] = useState(8);
  const [showAnalytic, setShowAnalytic] = useState(true);
  const [showTrails, setShowTrails] = useState(true);

  // Simulation state (ref-held; the loop never re-renders React)
  const rRef = useRef<Vec>({ x: 1, y: 0 });
  const vRef = useRef<Vec>({ x: 0, y: 1 });
  const e0Ref = useRef(0); // initial specific energy
  const orbitRef = useRef({ h: 1, e: 0, a: 1, bound: true, thetaP: Math.PI });
  const scaleRef = useRef(1); // px per sim unit
  const ratioRef = useRef(massRatio);
  const speedRef = useRef(speed);
  const analyticRef = useRef(showAnalytic);
  const trailsRef = useRef(showTrails);
  const playingRef = useRef(playing);
  const visibleRef = useRef(true);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const readE = useRef<HTMLSpanElement | null>(null);
  const readA = useRef<HTMLSpanElement | null>(null);
  const readEps = useRef<HTMLSpanElement | null>(null);
  const readT = useRef<HTMLSpanElement | null>(null);
  const readDE = useRef<HTMLSpanElement | null>(null);

  /* ---------- initial conditions & analytic conic ---------- */

  const resetSim = useCallback((f: number, keepLensPosition = false) => {
    const { w, h } = sizeRef.current;
    rRef.current = { x: 1, y: 0 };
    vRef.current = { x: 0, y: f }; // tangential launch; v_circ = 1 at r = 1

    const eps = (f * f) / 2 - 1;
    const hAng = f;
    const e = Math.sqrt(Math.max(0, 1 + 2 * eps * hAng * hAng));
    const bound = eps < 0;
    const a = bound ? -1 / (2 * eps) : Infinity;
    const thetaP = f >= 1 ? 0 : Math.PI; // periapsis direction

    e0Ref.current = eps;
    orbitRef.current = { h: hAng, e, a, bound, thetaP };

    // Fit the view to the whole conic
    const rMax = bound ? a * (1 + e) : 1.6;
    const minDim = Math.min(w, h);
    scaleRef.current = (0.42 * minDim) / Math.max(rMax, 1);

    if (!keepLensPosition) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }
  }, []);

  /* ---------- integration & drawing ---------- */

  const step = () => {
    const r = rRef.current;
    const v = vRef.current;

    const r1 = Math.hypot(r.x, r.y);
    const k1 = -1 / (r1 * r1 * r1); // r̈ = −r/|r|³ (GM = 1)
    const ax1 = k1 * r.x;
    const ay1 = k1 * r.y;

    r.x += v.x * DT + 0.5 * ax1 * DT * DT;
    r.y += v.y * DT + 0.5 * ay1 * DT * DT;

    const r2 = Math.hypot(r.x, r.y);
    const k2 = -1 / (r2 * r2 * r2);
    const ax2 = k2 * r.x;
    const ay2 = k2 * r.y;

    v.x += 0.5 * (ax1 + ax2) * DT;
    v.y += 0.5 * (ay1 + ay2) * DT;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h, dpr } = sizeRef.current;
    if (!w || !h) return;

    const dark = document.documentElement.classList.contains("dark");
    const bg = hexToRgb(cssVar("--background"));
    const photon = hexToRgb(cssVar("--photon"));
    const dust = hexToRgb(cssVar("--dust"));
    const star: [number, number, number] = dark ? [242, 244, 248] : hexToRgb(cssVar("--foreground"));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fade (or clear) — this is what leaves the trails
    if (trailsRef.current) {
      ctx.fillStyle = rgba(bg, 0.055);
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = rgba(bg, 1);
      ctx.fillRect(0, 0, w, h);
    }

    const cx = w / 2;
    const cy = h / 2;
    const scale = scaleRef.current;

    // Analytic conic (dashed) — the exact solution, for contrast
    const orb = orbitRef.current;
    if (analyticRef.current && orb.bound) {
      const p = orb.h * orb.h; // semi-latus rectum (GM = 1)
      ctx.save();
      ctx.strokeStyle = rgba(dust, dark ? 0.55 : 0.6);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const th = (i / 240) * Math.PI * 2;
        const rr = p / (1 + orb.e * Math.cos(th - orb.thetaP));
        if (rr <= 0 || rr > 60) continue;
        const X = cx + Math.cos(th) * rr * scale;
        const Y = cy - Math.sin(th) * rr * scale;
        if (i === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      }
      ctx.closePath();
      ctx.stroke();

      // Periapsis / apoapsis ticks
      const rPeri = p / (1 + orb.e);
      const rApo = p / (1 - orb.e);
      const tick = (ang: number, rad: number, label: string) => {
        const X = cx + Math.cos(ang) * rad * scale;
        const Y = cy - Math.sin(ang) * rad * scale;
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(dust, 0.8);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(X - 4, Y - 4);
        ctx.lineTo(X + 4, Y + 4);
        ctx.moveTo(X - 4, Y + 4);
        ctx.lineTo(X + 4, Y - 4);
        ctx.stroke();
        ctx.fillStyle = rgba(dust, 0.9);
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(label, X + 7, Y - 5);
        ctx.setLineDash([4, 6]);
      };
      tick(orb.thetaP, rPeri, "P");
      tick(orb.thetaP + Math.PI, rApo, "A");
      ctx.restore();
    }

    // Barycentre
    ctx.strokeStyle = rgba(dust, 0.7);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx, cy + 5);
    ctx.stroke();

    // Body positions: r1 = −(m2/M)·r, r2 = +(m1/M)·r, M = 1
    const rho = ratioRef.current;
    const m1 = 1 / (1 + rho);
    const m2 = rho / (1 + rho);
    const r = rRef.current;
    const x1 = cx - m2 * r.x * scale;
    const y1 = cy + m2 * r.y * scale; // canvas y is inverted
    const x2 = cx + m1 * r.x * scale;
    const y2 = cy - m1 * r.y * scale;

    // Primary — warm starlight with a restrained glow
    const R1 = 8 + 7 * m1;
    const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, R1 * 3);
    g1.addColorStop(0, rgba(star, 0.16));
    g1.addColorStop(1, rgba(star, 0));
    ctx.fillStyle = g1;
    ctx.fillRect(x1 - R1 * 3, y1 - R1 * 3, R1 * 6, R1 * 6);
    ctx.beginPath();
    ctx.arc(x1, y1, R1, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${star[0]}, ${star[1]}, ${star[2]})`;
    ctx.fill();

    // Secondary — photon cyan
    const R2 = 3.5 + 9 * m2;
    const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, R2 * 4);
    g2.addColorStop(0, rgba(photon, 0.28));
    g2.addColorStop(1, rgba(photon, 0));
    ctx.fillStyle = g2;
    ctx.fillRect(x2 - R2 * 4, y2 - R2 * 4, R2 * 8, R2 * 8);
    ctx.beginPath();
    ctx.arc(x2, y2, R2, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${photon[0]}, ${photon[1]}, ${photon[2]})`;
    ctx.fill();

    // Velocity vector on the secondary
    const v = vRef.current;
    const vmag = Math.hypot(v.x, v.y);
    if (vmag > 1e-6) {
      // velocity of m2 in the barycentric frame: m1·v
      const vx = m1 * v.x;
      const vy = -m1 * v.y; // canvas inversion
      const len = Math.hypot(vx, vy) * 52;
      const ux = (vx / Math.hypot(vx, vy)) * len;
      const uy = (vy / Math.hypot(vx, vy)) * len;
      const tipX = x2 + ux;
      const tipY = y2 + uy;
      ctx.strokeStyle = rgba(photon, 0.9);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      // arrowhead
      const ang = Math.atan2(uy, ux);
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - 8 * Math.cos(ang - 0.4), tipY - 8 * Math.sin(ang - 0.4));
      ctx.lineTo(tipX - 8 * Math.cos(ang + 0.4), tipY - 8 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fillStyle = rgba(photon, 0.9);
      ctx.fill();
    }

    // Live readouts (direct DOM writes — no React re-render per frame)
    const epsNow = (v.x * v.x + v.y * v.y) / 2 - 1 / Math.hypot(r.x, r.y);
    const eNow = Math.sqrt(Math.max(0, 1 + 2 * epsNow * Math.pow(orbitRef.current.h, 2)));
    const aNow = epsNow < 0 ? -1 / (2 * epsNow) : Infinity;
    const dE = e0Ref.current !== 0 ? ((epsNow - e0Ref.current) / Math.abs(e0Ref.current)) * 100 : 0;
    const T = aNow < Infinity ? 2 * Math.PI * Math.pow(aNow, 1.5) : Infinity;
    if (readE.current) readE.current.textContent = eNow.toFixed(3);
    if (readA.current)
      readA.current.textContent = aNow < Infinity ? aNow.toFixed(3) : "—";
    if (readEps.current) readEps.current.textContent = epsNow.toFixed(3);
    if (readT.current)
      readT.current.textContent = T < Infinity ? `${T.toFixed(1)} τ` : "unbound";
    if (readDE.current) readDE.current.textContent = `${dE >= 0 ? "+" : ""}${dE.toFixed(3)} %`;
  }, []);

  /* ---------- lifecycle ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevScale = scaleRef.current;
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      if (prevScale === 1) {
        resetSim(launchF);
      } else {
        // keep the orbit fitted on resize
        resetSim(launchF, false);
      }
    };

    resize();
    resetSim(launchF);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const mo = new MutationObserver(() => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let last = performance.now();
    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      // Advance only while playing and on screen; always redraw (cheap)
      if (playingRef.current && visibleRef.current) {
        const sub = speedRef.current;
        for (let i = 0; i < sub; i++) step();
      }
      if (now - last > 8) {
        last = now;
        draw();
      }
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [draw, resetSim]);

  // Mirror state into refs for the animation loop
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { ratioRef.current = massRatio; }, [massRatio]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { analyticRef.current = showAnalytic; }, [showAnalytic]);
  useEffect(() => { trailsRef.current = showTrails; }, [showTrails]);

  const reset = () => {
    resetSim(launchF);
  };

  /* ---------- presets: parameters + reset + run (unless calm) ---------- */

  const applyPreset = (preset: OrbitsPreset) => {
    setMassRatio(preset.massRatio);
    setLaunchF(preset.launchF);
    setShowAnalytic(preset.showAnalytic);
    setShowTrails(preset.showTrails);
    resetSim(preset.launchF);
    // f only takes effect on reset, so the preset resets the integration;
    // mass ratio and the toggles are live. Run the experiment immediately —
    // unless the visitor prefers calm, in which case it stays paused (the
    // overlay play button remains available), matching the initial state.
    if (!playing && !reduceMotion) setPlayingOverride(true);
  };

  const activePresetId =
    ORBITS_PRESETS.find(
      (p) =>
        presetParamEq(p.massRatio, massRatio) &&
        presetParamEq(p.launchF, launchF) &&
        p.showAnalytic === showAnalytic &&
        p.showTrails === showTrails
    )?.id ?? null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      setPlayingOverride(!playing);
    } else if (e.key.toLowerCase() === "r") {
      e.preventDefault();
      reset();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <figure className="m-0">
        <div className="relative h-[380px] overflow-hidden rounded-lg border border-border bg-card sm:h-[460px] lg:h-[560px]">
          <canvas
            ref={canvasRef}
            className="h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            tabIndex={0}
            role="application"
            aria-label="Two-body orbital mechanics simulation. Press Space to play or pause, R to reset. Adjust parameters in the controls panel."
            onKeyDown={onKeyDown}
          />
          {!playing && (
            <button
              type="button"
              onClick={() => setPlayingOverride(true)}
              className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px] transition-colors hover:bg-background/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Play the simulation"
            >
              <span className="flex size-16 items-center justify-center rounded-full border border-border bg-card/90">
                <Play className="size-6 translate-x-0.5" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>Fig. L-2 · Two-body · Velocity-Verlet</span>
          <span className="tabular-nums">GM = 1 · dt = {DT}</span>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Controls
          </h4>

          <div className="mt-5 space-y-5">
            <PresetChips
              ariaLabel="Experiment presets for orbital mechanics"
              presets={ORBITS_PRESETS}
              activeId={activePresetId}
              onSelect={applyPreset}
            />

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="mass-ratio" className="text-sm">
                  Mass ratio
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  m₂/m₁ = {massRatio.toFixed(2)}
                </span>
              </div>
              <Slider
                id="mass-ratio"
                aria-label="Mass ratio of the two bodies"
                min={0.05}
                max={0.5}
                step={0.01}
                value={[massRatio]}
                onValueChange={([v]) => setMassRatio(v)}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Live — shifts the barycentre the two bodies orbit around.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="launch-speed" className="text-sm">
                  Launch speed
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  f = {launchF.toFixed(2)} v_circ
                </span>
              </div>
              <Slider
                id="launch-speed"
                aria-label="Initial tangential speed as a fraction of circular speed"
                min={0.5}
                max={1.5}
                step={0.01}
                value={[launchF]}
                onValueChange={([v]) => setLaunchF(v)}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Applies on reset — f &lt; 1 drops from apoapsis, f &gt; 1 climbs
                from periapsis, and past f = √2 ≈ 1.41 the conic opens and the
                body escapes for good.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="sim-speed" className="text-sm">
                  Simulation speed
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  {speed}× dt
                </span>
              </div>
              <Slider
                id="sim-speed"
                aria-label="Simulation speed"
                min={1}
                max={15}
                step={1}
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={playing ? "outline" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => setPlayingOverride(!playing)}
                aria-pressed={playing}
              >
                {playing ? (
                  <>
                    <Pause className="size-3.5" aria-hidden="true" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" aria-hidden="true" /> Play
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={reset}>
                <RotateCcw className="size-3.5" aria-hidden="true" /> Reset
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="analytic-toggle" className="text-sm">
                Analytic orbit
              </Label>
              <Switch
                id="analytic-toggle"
                aria-label="Show the exact analytic conic section"
                checked={showAnalytic}
                onCheckedChange={setShowAnalytic}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="trails-toggle" className="text-sm">
                Trails
              </Label>
              <Switch
                id="trails-toggle"
                aria-label="Show fading trails behind the bodies"
                checked={showTrails}
                onCheckedChange={setShowTrails}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Readout
          </h4>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs tabular-nums">
            <dt className="text-muted-foreground">eccentricity e</dt>
            <dd className="text-right" ref={readE}>—</dd>
            <dt className="text-muted-foreground">semi-major a</dt>
            <dd className="text-right" ref={readA}>—</dd>
            <dt className="text-muted-foreground">energy ε</dt>
            <dd className="text-right" ref={readEps}>—</dd>
            <dt className="text-muted-foreground">period T</dt>
            <dd className="text-right" ref={readT}>—</dd>
            <dt className="text-muted-foreground">ΔE drift</dt>
            <dd className="text-right text-photon" ref={readDE}>—</dd>
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            ΔE is the honest measure of the integrator: velocity Verlet is
            symplectic, so the drift stays bounded rather than accumulating.
          </p>
        </div>
      </div>
    </div>
  );
}
