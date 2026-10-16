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
import {
  EXPERIMENT_EVENT,
  restoreFlag,
  restoreNumber,
  type BenchReporter,
  type ExperimentSpec,
} from "./experiment-link";
import { ShareExperimentButton } from "./share-experiment";

/**
 * ORBITAL MECHANICS — the Newtonian two-body problem, live.
 *
 * MODEL. The relative coordinate obeys r̈ = −GM·r/|r|³ with GM ≡ 1 in
 * natural units (total mass M = m₁ + m₂ = 1). Integrated with velocity
 * Verlet at fixed dt, with adaptive sub-stepping near periapsis —
 * symplectic in form, so energy drift stays bounded, not zero. The dashed
 * overlay is the exact analytic conic r(θ) = p/(1 + e·cos(θ − θ_P))
 * computed from the launch conditions; agreement between the two is the
 * demonstration. The eccentricity vector e = (v × h)/GM − r̂ fixes both
 * the shape and the orientation of the conic, so drag-launched orbits
 * (arbitrary direction) are handled by the same closed-form machinery.
 *
 * UNITS (physical scaling). Lengths are in AU and the total mass is
 * 1 M☉, so the natural time unit is τ = √(AU³/GM☉) = yr/2π ≈ 58.13 d
 * and the velocity unit is √(GM☉/AU) = 29.78 km/s. In these units
 * Kepler's third law reads exactly T[yr] = a[AU]^(3/2). Every readout
 * carries its physical unit.
 *
 * APPROXIMATIONS (stated in the UI, not hidden here): Newtonian gravity
 * only — no relativistic precession (Mercury's 43″/century is absent by
 * construction), no tides, no drag, no third bodies. The mass-ratio
 * slider is deliberately exaggerated for visibility. An honest
 * educational model — not a complete theory, not mission ephemeris.
 */

const DT = 0.002; // integration step, natural time units (τ)
const V_KMS = 29.78; // one velocity unit in km/s: √(GM☉ / 1 AU)
const TAU_D = 58.13; // one time unit in days: √(AU³ / GM☉)
const YR = 2 * Math.PI; // one year in natural time units
const DRAG_PX_PER_V = 110; // drag length (CSS px) per velocity unit
const GRAB_PX = 30; // pointer grab radius around the secondary body
const IMPACT_R = 0.03; // below this, the point-mass model declares impact

/* ---------- one-tap experiments ----------
 *
 * Tangential launch at radius r₀ with speed f·v_circ, v_circ = 1/√r₀:
 *   ε = (f² − 2)/(2r₀),  h = f·√r₀,  e = |1 − f²|,  a = r₀/(2 − f²).
 * · circle:  f = 1.00 → e = 0, T = r₀^{3/2} (Kepler III, exact here)
 * · ellipse: f = 0.75 → launch at apoapsis, e = 0.44
 * · comet:   f = 0.60 at r₀ = 1.6 AU → e = 0.64, perihelion ≈ 0.35 AU
 * · escape:  f = 1.45 → past f = √2 ≈ 1.414, e = 1.10, hyperbolic
 * · binary:  m₂/m₁ = 0.5 → both bodies orbit the barycentre at ⅓ and
 *   ⅔ of the separation: the exoplanet wobble, at full tilt
 */

type OrbitsPreset = Preset & {
  massRatio: number;
  launchF: number;
  launchR: number;
  showAnalytic: boolean;
  showTrails: boolean;
};

const ORBITS_PRESETS: readonly OrbitsPreset[] = [
  {
    id: "circle",
    label: "Perfect circle",
    title: "f = 1.00 · r₀ = 1.00 AU — exactly circular: e = 0, T = 1 yr (Kepler: T = a³ᐟ²)",
    massRatio: 0.2,
    launchF: 1.0,
    launchR: 1.0,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "ellipse",
    label: "Elliptical orbit",
    title: "f = 0.75 · r₀ = 1.00 AU — bound ellipse (e = 0.44) launched at apoapsis, T ≈ 0.58 yr",
    massRatio: 0.2,
    launchF: 0.75,
    launchR: 1.0,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "comet",
    label: "Comet",
    title: "f = 0.60 · r₀ = 1.60 AU — comet-like: e = 0.64, perihelion 0.35 AU, T ≈ 0.96 yr",
    massRatio: 0.05,
    launchF: 0.6,
    launchR: 1.6,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "kepler3",
    label: "Kepler III",
    title: "f = 1.00 · r₀ = 1.60 AU — still a circle, but T = 1.6³ᐟ² ≈ 2.02 yr: the third law, live",
    massRatio: 0.2,
    launchF: 1.0,
    launchR: 1.6,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "escape",
    label: "Close escape",
    title: "f = 1.45 — just past escape speed √2 ≈ 1.414: e = 1.10, v∞ ≈ 9.5 km/s, unbound",
    massRatio: 0.2,
    launchF: 1.45,
    launchR: 1.0,
    showAnalytic: true,
    showTrails: true,
  },
  {
    id: "binary",
    label: "Binary dance",
    title: "m₂/m₁ = 0.50 (maximum) · f = 1.00 — both bodies waltz around the barycentre at ⅓ and ⅔ of the separation",
    massRatio: 0.5,
    launchF: 1.0,
    launchR: 1.0,
    showAnalytic: true,
    showTrails: true,
  },
];

type Vec = { x: number; y: number };

/** The osculating orbit of a state (r, v) — everything the UI shows. */
type Conic = {
  eps: number; // specific orbital energy (natural units)
  h: number; // specific angular momentum (signed)
  e: number; // eccentricity
  a: number; // semi-major axis (AU); negative when unbound
  p: number; // semi-latus rectum h²
  thetaP: number; // periapsis direction (radians, sim frame)
  bound: boolean;
  rPeri: number;
  rApo: number; // NaN when unbound or degenerate
};

function conicFrom(r: Vec, v: Vec): Conic {
  const rn = Math.max(Math.hypot(r.x, r.y), 1e-9);
  const eps = (v.x * v.x + v.y * v.y) / 2 - 1 / rn;
  const h = r.x * v.y - r.y * v.x;
  // Eccentricity vector: e = (v × h)/GM − r̂, with h = h·ẑ and GM = 1.
  const ex = v.y * h - r.x / rn;
  const ey = -v.x * h - r.y / rn;
  const e = Math.hypot(ex, ey);
  const p = h * h;
  const bound = eps < 0;
  const a = Math.abs(eps) > 1e-12 ? -1 / (2 * eps) : Infinity;
  return {
    eps,
    h,
    e,
    a,
    p,
    thetaP: e > 1e-9 ? Math.atan2(ey, ex) : 0,
    bound,
    rPeri: p / (1 + e),
    rApo: bound && e < 0.999 ? p / (1 - e) : NaN,
  };
}

/* ---------- formatting (physical units) ---------- */

function fmtAU(x: number): string {
  if (!Number.isFinite(x)) return "—";
  if (x < 0.01) return x.toExponential(1);
  return x >= 10 ? x.toFixed(1) : x.toFixed(2);
}

function fmtYears(y: number): string {
  if (!Number.isFinite(y)) return "—";
  if (y < 0.02) return `${(y * 365.25).toFixed(0)} d`;
  if (y < 10) return `${y.toFixed(2)} yr`;
  if (y < 100) return `${y.toFixed(1)} yr`;
  return `${y.toFixed(0)} yr`;
}

function classify(c: Conic, impact: boolean): string {
  if (impact) return "impact";
  if (c.e < 0.005) return "circle";
  if (c.bound) return Math.abs(c.h) < 1e-6 ? "radial fall" : "ellipse";
  if (Math.abs(c.e - 1) < 0.005) return "parabola";
  return "hyperbola";
}

function glossFor(c: Conic, impact: boolean): string {
  if (impact) {
    return "Surface impact: the point masses have met. The Newtonian point-mass model ends there — reset to launch again.";
  }
  if (c.e < 0.005) {
    return "A circle — constant separation, constant speed. Gravity is exactly the centripetal demand (f = 1).";
  }
  if (c.bound && Math.abs(c.h) < 1e-6) {
    return "Degenerate ellipse: launched radially, the pair falls straight through the barycentre and back out.";
  }
  if (c.bound) {
    const tYr = Math.pow(c.a, 1.5);
    return `Bound: the pair retraces this ellipse every ${fmtYears(tYr)} — watch it trade speed for height between the apses. That trade is Kepler's second law.`;
  }
  if (Math.abs(c.e - 1) < 0.005) {
    return "Exactly parabolic — the boundary between bound and unbound. It never returns, but it just barely escapes.";
  }
  return `Unbound: a hyperbola with excess speed ${(Math.sqrt(2 * c.eps) * V_KMS).toFixed(1)} km/s. This pair disperses; there is no period.`;
}

/* ---------- canvas helpers ---------- */

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

export function OrbitsSim({
  onReport,
}: {
  /** Reports the bench's shareable state upward for whole-lab tour links. */
  onReport?: BenchReporter;
}) {
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
  const [launchR, setLaunchR] = useState(1.0);
  const [speed, setSpeed] = useState(8);
  const [showAnalytic, setShowAnalytic] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  // Impact is rare (radial launches) but reactive, so the paused overlay
  // and canvas banner stay in agreement with the loop's halt state.
  const [impacted, setImpacted] = useState(false);

  // Simulation state (ref-held; the loop never re-renders React)
  const rRef = useRef<Vec>({ x: 1, y: 0 });
  const vRef = useRef<Vec>({ x: 0, y: 1 });
  const tRef = useRef(0); // elapsed natural time since launch
  const launchRef = useRef<Conic>(conicFrom({ x: 1, y: 0 }, { x: 0, y: 1 }));
  const impactRef = useRef(false);
  const scaleRef = useRef(1); // px per sim unit (per AU)
  const ratioRef = useRef(massRatio);
  const speedRef = useRef(speed);
  const analyticRef = useRef(showAnalytic);
  const trailsRef = useRef(showTrails);
  const playingRef = useRef(playing);
  const visibleRef = useRef(true);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const launchFRef = useRef(launchF);
  const launchRRef = useRef(launchR);
  // Slider ghost: the conic the visitor is building, before it launches
  const pendingRef = useRef<{ f: number; r0: number } | null>(null);
  // Drag-to-launch state
  const dragRef = useRef<{ active: boolean; px: number; py: number }>({
    active: false,
    px: 0,
    py: 0,
  });

  const readClass = useRef<HTMLSpanElement | null>(null);
  const readE = useRef<HTMLSpanElement | null>(null);
  const readA = useRef<HTMLSpanElement | null>(null);
  const readApse = useRef<HTMLSpanElement | null>(null);
  const readR = useRef<HTMLSpanElement | null>(null);
  const readV = useRef<HTMLSpanElement | null>(null);
  const readT = useRef<HTMLSpanElement | null>(null);
  const readVinf = useRef<HTMLSpanElement | null>(null);
  const readTm = useRef<HTMLSpanElement | null>(null);
  const readEps = useRef<HTMLSpanElement | null>(null);
  const readDE = useRef<HTMLSpanElement | null>(null);
  const glossEl = useRef<HTMLParagraphElement | null>(null);

  const setText = (el: HTMLElement | null, s: string) => {
    if (el && el.textContent !== s) el.textContent = s;
  };

  /* ---------- launches ---------- */

  const fitView = useCallback(() => {
    const { w, h } = sizeRef.current;
    const c = launchRef.current;
    const rNow = Math.hypot(rRef.current.x, rRef.current.y);
    const rMax = c.bound
      ? Math.max(Number.isFinite(c.rApo) ? c.rApo : rNow, rNow, 0.3)
      : Math.max(1.5, 1.25 * rNow);
    const minDim = Math.min(w, h);
    if (minDim > 0) scaleRef.current = (0.42 * minDim) / rMax;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }, []);

  const setSimState = useCallback(
    (r: Vec, v: Vec) => {
      rRef.current = r;
      vRef.current = v;
      launchRef.current = conicFrom(r, v);
      tRef.current = 0;
      impactRef.current = false;
      setImpacted(false);
      clearCanvas();
      fitView();
    },
    [clearCanvas, fitView]
  );

  /** Tangential launch from the +x axis at radius r₀, speed f·v_circ. */
  const launchAt = useCallback(
    (r0: number, f: number) => {
      setSimState({ x: r0, y: 0 }, { x: 0, y: f / Math.sqrt(r0) });
    },
    [setSimState]
  );

  /** Drag launch: arbitrary position and velocity. */
  const launchCustom = useCallback(
    (r: Vec, v: Vec) => {
      setSimState({ x: r.x, y: r.y }, { x: v.x, y: v.y });
    },
    [setSimState]
  );

  /* ---------- integration ---------- */

  const verlet = (dt: number) => {
    const r = rRef.current;
    const v = vRef.current;
    const r1 = Math.max(Math.hypot(r.x, r.y), 1e-9);
    const k1 = -1 / (r1 * r1 * r1);
    const ax1 = k1 * r.x;
    const ay1 = k1 * r.y;

    r.x += v.x * dt + 0.5 * ax1 * dt * dt;
    r.y += v.y * dt + 0.5 * ay1 * dt * dt;

    const r2 = Math.max(Math.hypot(r.x, r.y), 1e-9);
    const k2 = -1 / (r2 * r2 * r2);
    v.x += 0.5 * (ax1 + k2 * r.x) * dt;
    v.y += 0.5 * (ay1 + k2 * r.y) * dt;
  };

  /** One fixed step DT. Near periapsis the step subdivides so the
   *  inverse-square singularity is resolved honestly. */
  const advance = (): void => {
    const rn = Math.hypot(rRef.current.x, rRef.current.y);
    const n = rn < 0.3 ? Math.min(12, Math.ceil(0.3 / Math.max(rn, 1e-4))) : 1;
    const dt = DT / n;
    for (let i = 0; i < n; i++) {
      verlet(dt);
      const rr = Math.hypot(rRef.current.x, rRef.current.y);
      if (!Number.isFinite(rr) || rr < IMPACT_R) {
        impactRef.current = true;
        setImpacted(true);
        break;
      }
    }
    tRef.current += DT;
  };

  /* ---------- drawing ---------- */

  const secondaryScreen = useCallback(() => {
    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;
    const rho = ratioRef.current;
    const m1 = 1 / (1 + rho);
    const r = rRef.current;
    return {
      x: cx + m1 * r.x * scaleRef.current,
      y: cy - m1 * r.y * scaleRef.current,
    };
  }, []);

  /** Velocity the current drag represents (sim frame), speed-clamped to
   *  the slider range so sliders and state can never disagree. */
  const dragVelocity = useCallback((): Vec => {
    const b = secondaryScreen();
    const d = dragRef.current;
    let vx = (d.px - b.x) / DRAG_PX_PER_V;
    let vy = -(d.py - b.y) / DRAG_PX_PER_V;
    const rn = Math.hypot(rRef.current.x, rRef.current.y);
    const mag = Math.hypot(vx, vy);
    if (mag > 1e-9) {
      const fEq = mag * Math.sqrt(Math.max(rn, 1e-9));
      if (fEq > 1.45) {
        const s = 1.45 / Math.sqrt(Math.max(rn, 1e-9)) / mag;
        vx *= s;
        vy *= s;
      }
    }
    return { x: vx, y: vy };
  }, [secondaryScreen]);

  const conicPath = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      c: Conic
    ) => {
      if (c.p < 1e-6) return; // degenerate radial orbit — no curve to draw
      const scale = scaleRef.current;
      const rrMax =
        (6 * 0.42 * Math.min(sizeRef.current.w, sizeRef.current.h)) /
        Math.max(scale, 1e-9);
      let pen = false;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const th = (i / 360) * Math.PI * 2;
        const denom = 1 + c.e * Math.cos(th - c.thetaP);
        if (denom <= 1e-6) {
          pen = false;
          continue;
        }
        const rr = c.p / denom;
        if (rr > rrMax) {
          pen = false;
          continue;
        }
        const X = cx + Math.cos(th) * rr * scale;
        const Y = cy - Math.sin(th) * rr * scale;
        if (!pen) {
          ctx.moveTo(X, Y);
          pen = true;
        } else {
          ctx.lineTo(X, Y);
        }
      }
    },
    []
  );

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
    const star: [number, number, number] = dark
      ? [242, 244, 248]
      : hexToRgb(cssVar("--foreground"));

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

    // AU rings — the physical scale, drawn faintly
    const diag = Math.hypot(w / 2, h / 2);
    ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    for (const rr of [0.5, 1, 1.5, 2, 3]) {
      const px = rr * scale;
      if (px < 30 || px > diag + 4) continue;
      ctx.strokeStyle = rgba(dust, dark ? 0.13 : 0.16);
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(cx, cy, px, 0, Math.PI * 2);
      ctx.stroke();
      if (rr === 1 && cx + px < w - 40) {
        ctx.fillStyle = rgba(dust, dark ? 0.55 : 0.65);
        ctx.fillText("1 AU", cx + px + 5, cy - 5);
      }
    }

    // Analytic conic (dashed) — the exact solution from launch conditions
    const orb = launchRef.current;
    if (analyticRef.current) {
      ctx.save();
      ctx.strokeStyle = rgba(dust, dark ? 0.55 : 0.6);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      conicPath(ctx, cx, cy, orb);
      ctx.stroke();

      // Periapsis / apoapsis ticks
      const tick = (ang: number, rad: number, label: string) => {
        const X = cx + Math.cos(ang) * rad * scale;
        const Y = cy - Math.sin(ang) * rad * scale;
        if (X < -10 || X > w + 10 || Y < -10 || Y > h + 10) return;
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
        ctx.fillText(label, X + 7, Y - 5);
        ctx.setLineDash([4, 6]);
      };
      if (orb.p >= 1e-6) {
        tick(orb.thetaP, orb.rPeri, "P");
        if (orb.bound && Number.isFinite(orb.rApo)) {
          tick(orb.thetaP + Math.PI, orb.rApo, "A");
        }
      }
      ctx.restore();
    }

    // Ghost conic — the orbit the visitor is building, before it launches
    const pending = pendingRef.current;
    const dragging = dragRef.current.active;
    let ghostConic: Conic | null = null;
    if (pending) {
      ghostConic = conicFrom(
        { x: pending.r0, y: 0 },
        { x: 0, y: pending.f / Math.sqrt(pending.r0) }
      );
    } else if (dragging) {
      ghostConic = conicFrom(
        { x: rRef.current.x, y: rRef.current.y },
        dragVelocity()
      );
    }
    if (ghostConic) {
      ctx.save();
      ctx.strokeStyle = rgba(photon, 0.55);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      conicPath(ctx, cx, cy, ghostConic);
      ctx.stroke();
      ctx.restore();
    }

    // Barycentre
    ctx.strokeStyle = rgba(dust, 0.7);
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx, cy + 5);
    ctx.stroke();

    // Body positions: r₁ = −(m₂/M)·r, r₂ = +(m₁/M)·r, M = 1
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

    // Velocity vector on the secondary (the relative velocity v = v₂ − v₁)
    const v = vRef.current;
    const vmag = Math.hypot(v.x, v.y);
    if (vmag > 1e-6 && !dragging) {
      const len = Math.min(96, vmag * 55);
      const tipX = x2 + (v.x / vmag) * len;
      const tipY = y2 - (v.y / vmag) * len; // canvas inversion
      ctx.strokeStyle = rgba(photon, 0.9);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      const ang = Math.atan2(tipY - y2, tipX - x2);
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - 8 * Math.cos(ang - 0.4), tipY - 8 * Math.sin(ang - 0.4));
      ctx.lineTo(tipX - 8 * Math.cos(ang + 0.4), tipY - 8 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fillStyle = rgba(photon, 0.9);
      ctx.fill();
      ctx.fillStyle = rgba(photon, 0.75);
      ctx.fillText("v", tipX + 6, tipY - 4);
    }

    // Grab affordance — a quiet dashed ring whenever aiming is possible.
    // The hint sits on the lower-right diagonal so it can never collide
    // with the "1 AU" ring label (upper-right of the +x axis) or the
    // periapsis tick labels.
    if (!playingRef.current && !dragging && !impactRef.current) {
      ctx.strokeStyle = rgba(photon, 0.4);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(x2, y2, R2 + 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = rgba(dust, 0.85);
      const hx = Math.min(x2 + R2 + 14, w - 88);
      const hy = Math.min(y2 + R2 + 12, h - 8);
      ctx.fillText("drag to launch", hx, hy);
    }

    // Drag arrow — the velocity being set, with a live readout
    if (dragging) {
      const d = dragRef.current;
      ctx.strokeStyle = rgba(photon, 0.95);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(d.px, d.py);
      ctx.stroke();
      const ang = Math.atan2(d.py - y2, d.px - x2);
      ctx.beginPath();
      ctx.moveTo(d.px, d.py);
      ctx.lineTo(d.px - 9 * Math.cos(ang - 0.42), d.py - 9 * Math.sin(ang - 0.42));
      ctx.lineTo(d.px - 9 * Math.cos(ang + 0.42), d.py - 9 * Math.sin(ang + 0.42));
      ctx.closePath();
      ctx.fillStyle = rgba(photon, 0.95);
      ctx.fill();
      const dv = dragVelocity();
      const dvm = Math.hypot(dv.x, dv.y);
      const label =
        dvm > 1e-6
          ? `v₀ ${(dvm * V_KMS).toFixed(1)} km/s`
          : "v₀ = 0 — free fall";
      ctx.fillStyle = rgba(photon, 0.95);
      const lx = Math.min(Math.max(d.px + 12, 8), w - 92);
      const ly = Math.max(d.py - 12, 16);
      ctx.fillText(label, lx, ly);
    }

    // Scale bar — the honest measure of the view
    {
      const candidates = [0.05, 0.1, 0.2, 0.5, 1, 2, 5];
      let best = candidates[0];
      let bestD = Infinity;
      for (const c of candidates) {
        const d = Math.abs(c * scale - 90);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      const barPx = best * scale;
      const bx = 16;
      const by = h - 18;
      if (barPx >= 24) {
        ctx.strokeStyle = rgba(dust, 0.8);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + barPx, by);
        ctx.moveTo(bx, by - 4);
        ctx.lineTo(bx, by + 4);
        ctx.moveTo(bx + barPx, by - 4);
        ctx.lineTo(bx + barPx, by + 4);
        ctx.stroke();
        ctx.fillStyle = rgba(dust, dark ? 0.75 : 0.85);
        ctx.fillText(`${best} AU`, bx, by - 8);
      }
    }

    // Impact banner — the model's honest edge
    if (impactRef.current) {
      const bw = 268;
      const bh = 52;
      const bx = cx - bw / 2;
      const by = cy - bh / 2;
      ctx.setLineDash([]);
      ctx.fillStyle = rgba(bg, 0.88);
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = rgba(photon, 0.6);
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = `rgb(${photon[0]}, ${photon[1]}, ${photon[2]})`;
      ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace';
      ctx.textAlign = "center";
      ctx.fillText("SURFACE IMPACT", cx, by + 22);
      ctx.fillStyle = rgba(dust, 0.95);
      ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace';
      ctx.fillText("the point-mass model ends here — R to reset", cx, by + 38);
      ctx.textAlign = "left";
    }

    /* Live readouts — direct DOM writes, no React re-render per frame.
     * Osculating quantities come from the CURRENT state, so they show
     * the integration's truth, including any drift. */
    const now = conicFrom(rRef.current, vRef.current);
    const rNow = Math.hypot(rRef.current.x, rRef.current.y);
    setText(readClass.current, classify(now, impactRef.current));
    setText(readE.current, now.e.toFixed(3));
    setText(
      readA.current,
      now.bound ? `${fmtAU(now.a)} AU` : "—"
    );
    if (now.p < 1e-6) {
      setText(readApse.current, "degenerate");
    } else {
      setText(
        readApse.current,
        now.bound && Number.isFinite(now.rApo)
          ? `${fmtAU(now.rPeri)} → ${fmtAU(now.rApo)} AU`
          : `${fmtAU(now.rPeri)} → ∞`
      );
    }
    setText(readR.current, `${fmtAU(rNow)} AU`);
    setText(readV.current, `${(vmag * V_KMS).toFixed(1)} km/s`);
    setText(
      readT.current,
      now.bound ? fmtYears(Math.pow(now.a, 1.5)) : "unbound"
    );
    setText(
      readVinf.current,
      now.bound ? "—" : `${(Math.sqrt(2 * now.eps) * V_KMS).toFixed(1)} km/s`
    );
    setText(readTm.current, fmtYears(tRef.current / YR));
    setText(readEps.current, now.eps.toFixed(3));
    const e0 = launchRef.current.eps;
    if (Math.abs(e0) > 1e-9) {
      const dE = ((now.eps - e0) / Math.abs(e0)) * 100;
      setText(readDE.current, `${dE >= 0 ? "+" : ""}${dE.toFixed(3)} %`);
    } else {
      setText(readDE.current, "—");
    }
    setText(glossEl.current, glossFor(now, impactRef.current));
  }, [conicPath, dragVelocity]);

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
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      // The bitmap resets on resize — refit the view to the orbit, keep time.
      fitView();
    };

    resize();
    launchAt(launchRRef.current, launchFRef.current);

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

    const mo = new MutationObserver(() => clearCanvas());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Frame-rate-independent stepping: speed = steps per frame at 60 fps,
    // accumulated from real elapsed time, so 60 Hz and 144 Hz displays
    // advance the physics at the same rate. Lag spikes are clamped.
    let last = performance.now();
    let acc = 0;
    let lastDraw = 0;
    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const elapsed = Math.min(now - last, 50);
      last = now;
      if (playingRef.current && visibleRef.current && !impactRef.current) {
        acc = Math.min(acc + (elapsed / 1000) * speedRef.current * 60, 90);
        const steps = Math.floor(acc);
        acc -= steps;
        for (let i = 0; i < steps; i++) advance();
      } else {
        acc = 0;
      }
      if (now - lastDraw > 8) {
        lastDraw = now;
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
  }, [draw, fitView, launchAt, clearCanvas]);

  // Mirror state into refs for the animation loop
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { ratioRef.current = massRatio; }, [massRatio]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { analyticRef.current = showAnalytic; }, [showAnalytic]);
  useEffect(() => { trailsRef.current = showTrails; }, [showTrails]);
  useEffect(() => { launchFRef.current = launchF; }, [launchF]);
  useEffect(() => { launchRRef.current = launchR; }, [launchR]);

  const reset = useCallback(() => {
    pendingRef.current = null;
    launchAt(launchRRef.current, launchFRef.current);
  }, [launchAt]);

  /* ---------- slider handlers: ghost while sliding, launch on commit ---------- */

  const onRadiusChange = ([v]: number[]) => {
    setLaunchR(v);
    pendingRef.current = { f: launchFRef.current, r0: v };
  };
  const onRadiusCommit = () => {
    launchAt(launchRRef.current, launchFRef.current);
    pendingRef.current = null;
  };
  const onSpeedChange = ([v]: number[]) => {
    setLaunchF(v);
    pendingRef.current = { f: v, r0: launchRRef.current };
  };
  const onSpeedCommit = () => {
    launchAt(launchRRef.current, launchFRef.current);
    pendingRef.current = null;
  };

  /* ---------- drag-to-launch (pointer, incl. touch) ---------- */

  const canvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = canvasPoint(e);
    if (!p) return;
    const b = secondaryScreen();
    if (Math.hypot(p.x - b.x, p.y - b.y) > GRAB_PX) return;
    // Capture keeps the drag alive when the pointer leaves the canvas.
    // Synthetic or vanished pointers may reject it — the drag still works
    // while the pointer stays inside, so never let this throw.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer already gone or synthetic — proceed without capture */
    }
    dragRef.current = { active: true, px: p.x, py: p.y };
    if (playingRef.current) setPlayingOverride(false);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = canvasPoint(e);
    if (!p) return;
    const canvas = canvasRef.current;
    if (dragRef.current.active) {
      dragRef.current.px = p.x;
      dragRef.current.py = p.y;
      if (canvas) canvas.style.cursor = "grabbing";
      return;
    }
    if (canvas) {
      const b = secondaryScreen();
      canvas.style.cursor =
        Math.hypot(p.x - b.x, p.y - b.y) <= GRAB_PX ? "grab" : "";
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const p = canvasPoint(e);
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = "";
    if (p) {
      dragRef.current.px = p.x;
      dragRef.current.py = p.y;
    }
    dragRef.current.active = false;
    const r = rRef.current;
    const rn = Math.hypot(r.x, r.y);
    if (rn > 0.35 && rn < 3.2) {
      const v = dragVelocity();
      launchCustom({ x: r.x, y: r.y }, { x: v.x, y: v.y });
      // Snap the sliders to the equivalent tangential configuration
      setLaunchR(Math.min(Math.max(rn, 0.4), 1.6));
      setLaunchF(
        Math.min(Math.max(Math.hypot(v.x, v.y) * Math.sqrt(rn), 0.55), 1.45)
      );
      if (!playing && !reduceMotion) setPlayingOverride(true);
    }
  };

  /* ---------- presets: parameters + reset + run (unless calm) ---------- */

  const applyPreset = (preset: OrbitsPreset) => {
    setMassRatio(preset.massRatio);
    setLaunchF(preset.launchF);
    setLaunchR(preset.launchR);
    setShowAnalytic(preset.showAnalytic);
    setShowTrails(preset.showTrails);
    pendingRef.current = null;
    launchAt(preset.launchR, preset.launchF);
    // Launch parameters only take effect on a relaunch, so the preset
    // resets the integration; mass ratio and the toggles are live. Run
    // the experiment immediately — unless the visitor prefers calm, in
    // which case it stays paused (the overlay play button remains
    // available), matching the initial state.
    if (!playing && !reduceMotion) setPlayingOverride(true);
  };

  const activePresetId =
    ORBITS_PRESETS.find(
      (p) =>
        presetParamEq(p.massRatio, massRatio) &&
        presetParamEq(p.launchF, launchF) &&
        presetParamEq(p.launchR, launchR) &&
        p.showAnalytic === showAnalytic &&
        p.showTrails === showTrails
    )?.id ?? null;

  // One builder feeds the per-bench share chip and the tour reporter,
  // so the two views of "this experiment" can never drift apart.
  const shareParams = useCallback(
    () => ({
      m: massRatio.toFixed(2),
      f: launchF.toFixed(2),
      r: launchR.toFixed(2),
      a: showAnalytic ? 1 : 0,
      t: showTrails ? 1 : 0,
    }),
    [massRatio, launchF, launchR, showAnalytic, showTrails]
  );

  useEffect(() => {
    onReport?.(shareParams(), activePresetId);
  }, [onReport, shareParams, activePresetId]);

  /* ---------- shared-link restore ---------- */

  useEffect(() => {
    const onRestore = (e: Event) => {
      const spec = (e as CustomEvent<ExperimentSpec>).detail;
      if (spec?.tab !== "orbits") return;
      const m = restoreNumber(spec.params, "m", 0.05, 0.5, 0.18);
      const f = restoreNumber(spec.params, "f", 0.55, 1.45, 1.0);
      const r = restoreNumber(spec.params, "r", 0.4, 1.6, 1.0);
      setMassRatio(m);
      setLaunchF(f);
      setLaunchR(r);
      setShowAnalytic(restoreFlag(spec.params, "a", true));
      setShowTrails(restoreFlag(spec.params, "t", true));
      pendingRef.current = null;
      // Launch parameters only take effect on a relaunch, so restoring
      // replays the launch.
      launchAt(r, f);
      if (!playing && !reduceMotion) setPlayingOverride(true);
    };
    window.addEventListener(EXPERIMENT_EVENT, onRestore);
    return () => window.removeEventListener(EXPERIMENT_EVENT, onRestore);
  }, [launchAt, playing, reduceMotion]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      setPlayingOverride(!playing);
    } else if (e.key.toLowerCase() === "r") {
      e.preventDefault();
      reset();
    }
  };

  // Launch-speed display: the physical v₀ implied by both sliders, live
  const v0Kms = (launchF / Math.sqrt(launchR)) * V_KMS;
  // Days per second of wall time at the current speed (60 fps reference)
  const daysPerSec = DT * 60 * TAU_D * speed;

  return (
    <div data-print="hide" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <figure className="m-0">
        <div className="relative h-[380px] overflow-hidden rounded-lg border border-border bg-card sm:h-[460px] lg:h-[560px]">
          <canvas
            ref={canvasRef}
            className="h-full w-full touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            tabIndex={0}
            role="application"
            aria-label="Two-body orbital mechanics simulation. Press Space to play or pause, R to reset. Drag from the planet to set a new launch velocity. Adjust parameters in the controls panel."
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
          {!playing && !impacted && (
            <button
              type="button"
              onClick={() => setPlayingOverride(true)}
              className="absolute left-1/2 top-1/2 z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-sm backdrop-blur-[1px] transition-colors hover:border-photon/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Play the simulation"
            >
              <Play className="size-6 translate-x-0.5" aria-hidden="true" />
            </button>
          )}
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 meta-sm text-muted-foreground">
          <span>Fig. L-2 · Two-body Kepler problem — dashed: analytic conic</span>
          <span className="tabular-nums">M = 1 M☉ · dt = 2×10⁻³ τ</span>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="meta-sm text-muted-foreground">
            Controls
          </h3>

          <div className="mt-5 space-y-5">
            <PresetChips
              ariaLabel="Experiment presets for orbital mechanics"
              presets={ORBITS_PRESETS}
              activeId={activePresetId}
              onSelect={applyPreset}
            />

            <div>
              <ShareExperimentButton
                tab="orbits"
                preset={activePresetId}
                instrument="the orbital-mechanics bench"
                params={shareParams}
              />
            </div>

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
                Live — shifts the barycentre both bodies orbit. The relative
                orbit depends only on the total mass (1 M☉); real star–planet
                ratios are 10³–10⁶× smaller.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="launch-radius" className="text-sm">
                  Launch radius
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  r₀ = {launchR.toFixed(2)} AU
                </span>
              </div>
              <Slider
                id="launch-radius"
                aria-label="Launch radius in astronomical units"
                min={0.4}
                max={1.6}
                step={0.01}
                value={[launchR]}
                onValueChange={onRadiusChange}
                onValueCommit={onRadiusCommit}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Applies on release — the photon ghost previews the conic you
                are building. For circles, T grows as r₀³ᐟ²: Kepler III.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="launch-speed" className="text-sm">
                  Launch speed
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  f = {launchF.toFixed(2)} · v₀ {v0Kms.toFixed(1)} km/s
                </span>
              </div>
              <Slider
                id="launch-speed"
                aria-label="Initial tangential speed as a fraction of circular speed"
                min={0.55}
                max={1.45}
                step={0.01}
                value={[launchF]}
                onValueChange={onSpeedChange}
                onValueCommit={onSpeedCommit}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Applies on release. f &lt; 1 starts at apoapsis, f &gt; 1 at
                periapsis; past f = √2 ≈ 1.414 the conic opens and the body
                escapes for good.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="sim-speed" className="text-sm">
                  Playback rate
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  {speed}× · ≈{daysPerSec.toFixed(0)} d/s
                </span>
              </div>
              <Slider
                id="sim-speed"
                aria-label="Simulation playback rate"
                min={1}
                max={15}
                step={1}
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Watch speed only — the physics step dt never changes, so
                accuracy is identical at every rate.
              </p>
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

            <div className="space-y-2 border-t border-border pt-4">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 meta-xs text-muted-foreground">
                <span className="kbd">Space</span> play / pause
                <span className="kbd">R</span> reset
              </p>
              <p className="meta-xs leading-relaxed text-muted-foreground">
                Drag from the planet to fling it — the photon ghost is the
                orbit you are building. Touch keeps vertical swipes for
                scrolling; the sliders cover everything else.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="meta-sm text-muted-foreground">Readout</h3>
            <span
              ref={readClass}
              className="tag text-foreground"
              aria-live="polite"
            >
              —
            </span>
          </div>
          <dl className="mt-3 space-y-1.5 meta-num text-foreground">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">eccentricity e</dt>
              <dd className="text-right tabular-nums" ref={readE}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">semi-major a</dt>
              <dd className="text-right tabular-nums" ref={readA}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">apses r_p → r_a</dt>
              <dd className="text-right tabular-nums" ref={readApse}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">separation r</dt>
              <dd className="text-right tabular-nums" ref={readR}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">relative speed v</dt>
              <dd className="text-right tabular-nums" ref={readV}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">period T</dt>
              <dd className="text-right tabular-nums" ref={readT}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">escape excess v∞</dt>
              <dd className="text-right tabular-nums" ref={readVinf}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">elapsed t</dt>
              <dd className="text-right tabular-nums" ref={readTm}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">energy ε (nat.)</dt>
              <dd className="text-right tabular-nums" ref={readEps}>—</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">ΔE drift</dt>
              <dd className="text-right tabular-nums text-photon" ref={readDE}>—</dd>
            </div>
          </dl>
          <p
            ref={glossEl}
            aria-live="polite"
            className="mt-3 text-xs italic leading-relaxed text-muted-foreground"
          >
            —
          </p>
          <p className="mt-3 border-t border-border pt-3 meta-xs leading-relaxed text-muted-foreground">
            Units — total mass 1 M☉, lengths in AU ⇒ time in τ = yr/2π ≈
            58.13 d, speed in √(GM☉/AU) = 29.78 km/s, so Kepler III reads
            exactly T[yr] = a[AU]³ᐟ². ε is specific orbital energy in natural
            units (GM = 1). ΔE is the integrator&apos;s honesty: velocity
            Verlet is symplectic, so the drift stays bounded rather than
            accumulating.
          </p>
        </div>
      </div>
    </div>
  );
}
