"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  getMotionReduced as getReduceMotion,
  subscribeMotion as subscribeReduceMotion,
} from "@/lib/motion-preference";
import { PresetChips, presetParamEq, type Preset } from "./preset-chips";
import {
  EXPERIMENT_EVENT,
  restoreNumber,
  type BenchReporter,
  type ExperimentSpec,
} from "./experiment-link";
import { ShareExperimentButton } from "./share-experiment";

/**
 * QUANTUM WAVE PACKET — the one-dimensional time-dependent Schrödinger
 * equation, solved live on a grid.
 *
 * i ∂ψ/∂t = [ −(1/2) ∂²/∂x² + V(x) ] ψ      (natural units ħ = m = 1)
 *
 * The integrator is Crank–Nicolson — (I + i·dt/2·H)ψⁿ⁺¹ = (I − i·dt/2·H)ψⁿ —
 * unconditionally stable and unitary, so probability is conserved exactly
 * (up to round-off) until the absorbing potential at the domain edges
 * deliberately removes outgoing waves, mimicking an infinite domain.
 * The left-side tridiagonal system is factorised once per parameter change
 * (Thomas algorithm over complex re/im arrays); each step is then O(N).
 *
 * Approximations: single particle, non-relativistic, potential barrier
 * static in time. The transmitted/reflected readouts are packet
 * measurements; the comparison figure is the plane-wave formula.
 */

const N = 768;          // grid points
const X_MIN = -24;      // domain
const X_MAX = 24;
const DX = (X_MAX - X_MIN) / N;
const DT = 0.005;       // Crank–Nicolson is unconditionally stable
const X0 = -14;          // packet start
const SIGMA = 1.2;      // position spread
const CAP_WIDTH = 6;    // absorbing ramp width (each edge)
const E_MIN = 0.4, E_MAX = 3.0;
const V0_MIN = 0.2, V0_MAX = 4.0;
const W_MIN = 0.4, W_MAX = 4.0;

/* ---------- small theme helpers (shared convention with the other sims) ---------- */

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

/* ---------- plane-wave transmission through a rectangular barrier ---------- */

function planeWaveT(E: number, V0: number, w: number): number {
  const dE = E - V0;
  if (Math.abs(dE) < 1e-6) {
    // E → V₀ limit: T → 1/(1 + V₀w²/2)
    return 1 / (1 + (V0 * w * w) / 2);
  }
  if (dE < 0) {
    const kappa = Math.sqrt(2 * Math.max(0, V0 - E));
    const s = Math.sinh(kappa * w);
    return 1 / (1 + (V0 * V0 * s * s) / (4 * E * (V0 - E)));
  }
  const k2 = Math.sqrt(2 * dE);
  const s = Math.sin(k2 * w);
  return 1 / (1 + (V0 * V0 * s * s) / (4 * E * dE));
}

/* ---------- one-tap experiments ----------
 *
 * Plane-wave comparison values (same formula as the readout):
 * · tunnel: E = 1.40 < V₀ = 1.60, w = 2.0 → T_pw ≈ 0.14 — the
 *   classically forbidden leak, exponential in κw
 * · over:   E = 2.20 > V₀ = 1.60, w = 2.0 → T_pw ≈ 0.76 — mostly over the
 *   wall, with a visible reflection ripple
 * · thin:   E = 1.00 < V₀ = 1.60, w = 0.8 → T_pw ≈ 0.49 — halve the width
 *   and nearly half the packet walks through a wall it cannot climb
 */

type WavePreset = Preset & {
  energy: number;
  v0: number;
  w: number;
};

const WAVE_PRESETS: readonly WavePreset[] = [
  {
    id: "tunnel",
    label: "Textbook tunneling",
    title: "E = 1.40 < V₀ = 1.60 · w = 2.0 — the classically forbidden leak; plane-wave T ≈ 0.14",
    energy: 1.4,
    v0: 1.6,
    w: 2.0,
  },
  {
    id: "over",
    label: "Over the wall",
    title: "E = 2.20 > V₀ = 1.60 · w = 2.0 — mostly transmitted (plane-wave T ≈ 0.76) with a reflection ripple",
    energy: 2.2,
    v0: 1.6,
    w: 2.0,
  },
  {
    id: "thin",
    label: "Thin barrier",
    title: "E = 1.00 < V₀ = 1.60 · w = 0.8 — a thin wall leaks almost half the packet; plane-wave T ≈ 0.49",
    energy: 1.0,
    v0: 1.6,
    w: 0.8,
  },
];

export function WaveSim({
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

  const [energy, setEnergy] = useState(1.4);
  const [barrierV, setBarrierV] = useState(1.6);
  const [barrierW, setBarrierW] = useState(1.6);
  const [speed, setSpeed] = useState(5);

  /* ---------- simulation state (refs; the loop never re-renders React) ---------- */

  const re = useRef(new Float64Array(N));
  const im = useRef(new Float64Array(N));
  const vPot = useRef(new Float64Array(N));   // real potential
  const gamma = useRef(new Float64Array(N));  // absorbing potential

  // Crank–Nicolson factorisation of A = I + i·dt/2·H (complex, stored as re/im)
  const diagRe = useRef(new Float64Array(N));
  const diagIm = useRef(new Float64Array(N));
  const cPrimeRe = useRef(new Float64Array(N));
  const cPrimeIm = useRef(new Float64Array(N));
  const pRe = useRef(new Float64Array(N));
  const pIm = useRef(new Float64Array(N));
  const rhsRe = useRef(new Float64Array(N));
  const rhsIm = useRef(new Float64Array(N));
  const dRe = useRef(new Float64Array(N));
  const dIm = useRef(new Float64Array(N));

  // off-diagonal of H (real, constant): −1/(2dx²)
  const H_OFF = -1 / (2 * DX * DX);

  const tRef = useRef(0);
  const yMaxRef = useRef(0.35);   // smoothed |ψ|² axis scale
  const doneRef = useRef(false);  // packet fully absorbed
  const readout = useRef<{ t?: HTMLSpanElement | null; x?: HTMLSpanElement | null; R?: HTMLSpanElement | null; T?: HTMLSpanElement | null; A?: HTMLSpanElement | null }>({});

  const energyRef = useRef(energy);
  const v0Ref = useRef(barrierV);
  const wRef = useRef(barrierW);
  const speedRef = useRef(speed);
  const playingRef = useRef(playing);
  const visibleRef = useRef(true);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  /* ---------- build the system for current V₀, w, E ---------- */

  const buildSystem = useCallback(() => {
    const V0 = v0Ref.current;
    const w = wRef.current;
    const E = energyRef.current;
    const gMax = Math.min(0.35, Math.max(0.03, 0.05 * Math.max(E, V0)));

    for (let j = 0; j < N; j++) {
      const x = X_MIN + (j + 0.5) * DX;
      vPot.current[j] = Math.abs(x) < w / 2 ? V0 : 0;

      // absorbing ramp near both edges
      let g = 0;
      if (x < X_MIN + CAP_WIDTH) g = (X_MIN + CAP_WIDTH - x) / CAP_WIDTH;
      else if (x > X_MAX - CAP_WIDTH) g = (x - (X_MAX - CAP_WIDTH)) / CAP_WIDTH;
      gamma.current[j] = gMax * g * g;

      // H diagonal: 1/dx² + V − iγ  →  A diagonal: 1 + i·(dt/2)·(that)
      //   1 + i·(dt/2)·(hRe + i·hIm) = [1 − (dt/2)·hIm] + i·(dt/2)·hRe
      const hDiagRe = 1 / (DX * DX) + vPot.current[j];
      const hDiagIm = -gamma.current[j];
      diagRe.current[j] = 1 - (DT / 2) * hDiagIm;
      diagIm.current[j] = (DT / 2) * hDiagRe;
    }

    // Dirichlet edges: row 0 and N−1 become identity so ψ stays 0 there
    diagRe.current[0] = 1; diagIm.current[0] = 0;
    diagRe.current[N - 1] = 1; diagIm.current[N - 1] = 0;

    // Thomas forward elimination (complex):
    //   p₀ = b₀,  c'₀ = 0 (identity row)
    //   pⱼ = bⱼ − a·c'ⱼ₋₁,  c'ⱼ = c/pⱼ
    // sub/super of A are purely imaginary: i·offIm (offIm = (dt/2)·H_OFF)
    const offIm = (DT / 2) * H_OFF;
    for (let j = 0; j < N; j++) {
      const isEdge = j === 0 || j === N - 1;
      const aIm = isEdge ? 0 : offIm;        // sub-diagonal of row j (identity on edges)
      const cUse = isEdge ? 0 : offIm;       // super-diagonal of row j

      let pr: number, pi: number;
      if (j === 0) {
        pr = diagRe.current[0];
        pi = diagIm.current[0];
      } else {
        // pⱼ = bⱼ − a·c'ⱼ₋₁  with a = 0 + i·aIm:
        //   (i·aIm)·(c'r + i·c'i) = −aIm·c'i + i·aIm·c'r
        const acRe = -aIm * cPrimeIm.current[j - 1];
        const acIm = aIm * cPrimeRe.current[j - 1];
        pr = diagRe.current[j] - acRe;
        pi = diagIm.current[j] - acIm;
      }
      pRe.current[j] = pr;
      pIm.current[j] = pi;

      if (j === N - 1) {
        cPrimeRe.current[j] = 0;
        cPrimeIm.current[j] = 0;
      } else {
        // c'ⱼ = c/pⱼ with c = 0 + i·cUse (purely imaginary):
        //   (i·cUse)/(pr + i·pi) = [cUse·pi + i·cUse·pr]/den
        const den = pr * pr + pi * pi;
        cPrimeRe.current[j] = (cUse * pi) / den;
        cPrimeIm.current[j] = (cUse * pr) / den;
      }
    }
  }, []);

  /* ---------- initial Gaussian packet ---------- */

  const resetSim = useCallback(() => {
    const k0 = Math.sqrt(2 * energyRef.current);
    let norm = 0;
    for (let j = 0; j < N; j++) {
      const x = X_MIN + (j + 0.5) * DX;
      const env = Math.exp(-((x - X0) * (x - X0)) / (4 * SIGMA * SIGMA));
      re.current[j] = env * Math.cos(k0 * x);
      im.current[j] = env * Math.sin(k0 * x);
      norm += (re.current[j] ** 2 + im.current[j] ** 2) * DX;
    }
    const f = 1 / Math.sqrt(norm);
    for (let j = 0; j < N; j++) {
      re.current[j] *= f;
      im.current[j] *= f;
    }
    tRef.current = 0;
    doneRef.current = false;
    yMaxRef.current = Math.max(0.12, (1 / (SIGMA * Math.sqrt(2 * Math.PI))) * 1.15);
  }, []);

  /* ---------- one Crank–Nicolson step ---------- */

  const step = useCallback(() => {
    const reA = re.current, imA = im.current;
    const vp = vPot.current, gm = gamma.current;
    const rRe = rhsRe.current, rIm = rhsIm.current;
    const dt2 = DT / 2;

    // rhs = ψⁿ − i·(dt/2)·Hψⁿ
    for (let j = 1; j < N - 1; j++) {
      // (Hψ)ⱼ = H_OFF·(ψⱼ₋₁ + ψⱼ₊₁) + (1/dx² + Vⱼ − iγⱼ)·ψⱼ
      const hr = H_OFF * (reA[j - 1] + reA[j + 1]) + (1 / (DX * DX) + vp[j]) * reA[j] + gm[j] * imA[j];
      const hi = H_OFF * (imA[j - 1] + imA[j + 1]) + (1 / (DX * DX) + vp[j]) * imA[j] - gm[j] * reA[j];
      // −i·(dt/2)·(hr + i·hi) = (dt/2)·hi − i·(dt/2)·hr
      rRe[j] = reA[j] + dt2 * hi;
      rIm[j] = imA[j] - dt2 * hr;
    }
    rRe[0] = 0; rIm[0] = 0;
    rRe[N - 1] = 0; rIm[N - 1] = 0;

    const offIm = dt2 * H_OFF;

    // forward: d'₀ = rhs₀/p₀;  d'ⱼ = (rhsⱼ − α·d'ⱼ₋₁)/pⱼ
    {
      const pr = pRe.current[0], pi = pIm.current[0];
      const den = pr * pr + pi * pi;
      dRe.current[0] = (rRe[0] * pr + rIm[0] * pi) / den;
      dIm.current[0] = (rIm[0] * pr - rRe[0] * pi) / den;
    }
    for (let j = 1; j < N; j++) {
      const pr = pRe.current[j], pi = pIm.current[j];
      // α·d'ⱼ₋₁ — α = i·offIm (purely imaginary): i·offIm·(dr + i·di) = −offIm·di + i·offIm·dr
      const aDr = -offIm * dIm.current[j - 1];
      const aDi = offIm * dRe.current[j - 1];
      const isLast = j === N - 1;
      const nr = rRe[j] - (isLast ? 0 : aDr);
      const ni = rIm[j] - (isLast ? 0 : aDi);
      const den = pr * pr + pi * pi;
      dRe.current[j] = (nr * pr + ni * pi) / den;
      dIm.current[j] = (ni * pr - nr * pi) / den;
    }

    // back-substitution: ψⱼ = d'ⱼ − c'ⱼ·ψⱼ₊₁
    reA[N - 1] = dRe.current[N - 1];
    imA[N - 1] = dIm.current[N - 1];
    for (let j = N - 2; j >= 1; j--) {
      const cr = cPrimeRe.current[j], ci = cPrimeIm.current[j];
      const xr = reA[j + 1], xi = imA[j + 1];
      reA[j] = dRe.current[j] - (cr * xr - ci * xi);
      imA[j] = dIm.current[j] - (cr * xi + ci * xr);
    }
    reA[0] = 0; imA[0] = 0;

    tRef.current += DT;
  }, []);

  /* ---------- measured quantities ---------- */

  const measure = useCallback(() => {
    let total = 0, left = 0, right = 0, xs = 0;
    const w = wRef.current;
    for (let j = 0; j < N; j++) {
      const p = (re.current[j] ** 2 + im.current[j] ** 2) * DX;
      total += p;
      const x = X_MIN + (j + 0.5) * DX;
      if (x < -(w / 2 + 1)) left += p;
      else if (x > w / 2 + 1) right += p;
      xs += x * p;
    }
    return { total, left, right, xMean: total > 1e-12 ? xs / total : 0 };
  }, []);

  /* ---------- drawing ---------- */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h, dpr } = sizeRef.current;
    if (!w || !h) return;

    const photon = hexToRgb(cssVar("--photon"));
    const nebula = hexToRgb(cssVar("--nebula"));
    const dust = hexToRgb(cssVar("--dust"));
    const bg = hexToRgb(cssVar("--background"));

    const ML = 46, MR = 14, MT = 18, MB = 34;
    const plotW = w - ML - MR;
    const plotH = h - MT - MB;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`;
    ctx.fillRect(0, 0, w, h);

    // dynamic y-scale (smoothed so tunneling tails stay visible)
    let frameMax = 0.02;
    for (let j = 0; j < N; j++) {
      const p = re.current[j] ** 2 + im.current[j] ** 2;
      if (p > frameMax) frameMax = p;
    }
    yMaxRef.current += (frameMax * 1.18 - yMaxRef.current) * 0.09;
    const yMax = Math.max(0.02, yMaxRef.current);

    const X = (x: number) => ML + ((x - X_MIN) / (X_MAX - X_MIN)) * plotW;
    const Y = (p: number) => MT + plotH * (1 - Math.min(1, p / yMax));

    // barrier band
    const wB = wRef.current;
    const bx0 = X(-wB / 2), bx1 = X(wB / 2);
    ctx.fillStyle = rgba(nebula, 0.1);
    ctx.fillRect(bx0, MT, bx1 - bx0, plotH);
    ctx.strokeStyle = rgba(nebula, 0.55);
    ctx.lineWidth = 1;
    ctx.strokeRect(bx0, MT, bx1 - bx0, plotH);
    ctx.fillStyle = rgba(nebula, 0.9);
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("V₀", (bx0 + bx1) / 2, MT + 12);

    // axes
    ctx.strokeStyle = rgba(dust, 0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ML, MT + plotH + 0.5);
    ctx.lineTo(ML + plotW, MT + plotH + 0.5);
    ctx.moveTo(ML + 0.5, MT);
    ctx.lineTo(ML + 0.5, MT + plotH);
    ctx.stroke();

    // x ticks
    ctx.fillStyle = rgba(dust, 0.85);
    ctx.textAlign = "center";
    for (const tx of [-20, -10, 0, 10, 20]) {
      const px = X(tx);
      ctx.beginPath();
      ctx.moveTo(px, MT + plotH);
      ctx.lineTo(px, MT + plotH + 4);
      ctx.strokeStyle = rgba(dust, 0.4);
      ctx.stroke();
      ctx.fillText(String(tx), px, MT + plotH + 16);
    }

    // y-axis label
    ctx.textAlign = "left";
    ctx.fillStyle = rgba(dust, 0.75);
    ctx.fillText("|ψ|²", 8, MT + 4);

    // energy annotation
    ctx.textAlign = "right";
    const E = energyRef.current, V0 = v0Ref.current;
    ctx.fillText(`E = ${E.toFixed(2)} · V₀ = ${V0.toFixed(2)} · E/V₀ = ${(E / Math.max(V0, 1e-9)).toFixed(2)}`, ML + plotW, MT - 6 + 10);

    // |ψ|² filled curve
    ctx.beginPath();
    ctx.moveTo(X(X_MIN), Y(0));
    for (let j = 0; j < N; j++) {
      const x = X_MIN + (j + 0.5) * DX;
      ctx.lineTo(X(x), Y(re.current[j] ** 2 + im.current[j] ** 2));
    }
    ctx.lineTo(X(X_MAX - DX / 2), Y(0));
    ctx.closePath();
    ctx.fillStyle = rgba(photon, 0.14);
    ctx.fill();

    ctx.beginPath();
    for (let j = 0; j < N; j++) {
      const x = X_MIN + (j + 0.5) * DX;
      const px = X(x), py = Y(re.current[j] ** 2 + im.current[j] ** 2);
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = rgba(photon, 0.92);
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Re ψ (thin) — only when visible against the scale
    const reMax = yMax * 0.04;
    let showRe = false;
    for (let j = 0; j < N; j++) if (Math.abs(re.current[j]) > reMax) { showRe = true; break; }
    if (showRe) {
      ctx.beginPath();
      for (let j = 0; j < N; j++) {
        const x = X_MIN + (j + 0.5) * DX;
        const py = MT + plotH * (1 - Math.max(-1, Math.min(1, (re.current[j] / Math.sqrt(yMax)) * 0.28)));
        if (j === 0) ctx.moveTo(X(x), py);
        else ctx.lineTo(X(x), py);
      }
      ctx.strokeStyle = rgba(dust, 0.5);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // done note
    if (doneRef.current) {
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(dust, 0.9);
      ctx.fillText("packet absorbed — press R to reset", ML + plotW / 2, MT + 16);
    }
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
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    buildSystem();
    resetSim();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    const io = new IntersectionObserver(
      (entries) => { visibleRef.current = entries[0]?.isIntersecting ?? true; },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    const onVisibility = () => { visibleRef.current = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVisibility);

    const mo = new MutationObserver(() => { /* redraw picks up new colours next frame */ });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let lastReadout = 0;
    let last = performance.now();
    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (playingRef.current && visibleRef.current) {
        const sub = speedRef.current;
        for (let i = 0; i < sub; i++) step();
        // auto-pause when the packet has been fully absorbed
        if (!doneRef.current) {
          const { total } = measure();
          if (total < 0.03) {
            doneRef.current = true;
            setPlayingOverride(false);
          }
        }
      }
      if (now - last > 8) {
        last = now;
        draw();
      }
      if (now - lastReadout > 250) {
        lastReadout = now;
        const m = measure();
        const Tpw = planeWaveT(energyRef.current, v0Ref.current, wRef.current);
        if (readout.current.t) readout.current.t.textContent = tRef.current.toFixed(1);
        if (readout.current.x) readout.current.x.textContent = m.xMean.toFixed(2);
        if (readout.current.R) readout.current.R.textContent = m.left.toFixed(3);
        if (readout.current.T) readout.current.T.textContent = `${m.right.toFixed(3)} · pw ${Tpw.toFixed(3)}`;
        if (readout.current.A) readout.current.A.textContent = Math.max(0, 1 - m.total).toFixed(3);
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
  }, [buildSystem, resetSim, step, draw, measure]);

  // mirror React state into refs
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { energyRef.current = energy; }, [energy]);
  useEffect(() => { v0Ref.current = barrierV; buildSystem(); }, [barrierV, buildSystem]);
  useEffect(() => { wRef.current = barrierW; buildSystem(); }, [barrierW, buildSystem]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const reset = () => {
    buildSystem(); // E change affects only γ and the packet — rebuild + reinit
    resetSim();
  };

  /* ---------- presets: parameters + refactored solver + fresh packet ---------- */

  const applyPreset = (preset: WavePreset) => {
    setEnergy(preset.energy);
    setBarrierV(preset.v0);
    setBarrierW(preset.w);
    // Write the refs directly so the rebuild below sees the new values
    // immediately (the state→ref mirrors only run after the next render).
    energyRef.current = preset.energy;
    v0Ref.current = preset.v0;
    wRef.current = preset.w;
    buildSystem();
    resetSim();
    // E applies to the packet on reset; V₀ and w refactorise the tridiagonal
    // solver — all done above. Run the experiment immediately unless the
    // visitor prefers calm, in which case it stays paused, matching the
    // instrument's initial reduced-motion state.
    if (!playing && !reduceMotion) setPlayingOverride(true);
  };

  const activePresetId =
    WAVE_PRESETS.find(
      (p) =>
        presetParamEq(p.energy, energy) &&
        presetParamEq(p.v0, barrierV) &&
        presetParamEq(p.w, barrierW)
    )?.id ?? null;

  // One builder feeds the per-bench share chip and the tour reporter,
  // so the two views of "this experiment" can never drift apart.
  const shareParams = useCallback(
    () => ({
      E: energy.toFixed(2),
      V: barrierV.toFixed(2),
      w: barrierW.toFixed(2),
    }),
    [energy, barrierV, barrierW]
  );

  useEffect(() => {
    onReport?.(shareParams(), activePresetId);
  }, [onReport, shareParams, activePresetId]);

  /* ---------- shared-link restore ---------- */

  useEffect(() => {
    const onRestore = (e: Event) => {
      const spec = (e as CustomEvent<ExperimentSpec>).detail;
      if (spec?.tab !== "wave") return;
      const E = restoreNumber(spec.params, "E", E_MIN, E_MAX, 1.4);
      const V = restoreNumber(spec.params, "V", V0_MIN, V0_MAX, 1.6);
      const wv = restoreNumber(spec.params, "w", W_MIN, W_MAX, 1.6);
      setEnergy(E);
      setBarrierV(V);
      setBarrierW(wv);
      // Write the refs directly so the rebuild below sees the new values
      // immediately (the state→ref mirrors only run after the next render).
      energyRef.current = E;
      v0Ref.current = V;
      wRef.current = wv;
      buildSystem();
      resetSim();
      if (!playing && !reduceMotion) setPlayingOverride(true);
    };
    window.addEventListener(EXPERIMENT_EVENT, onRestore);
    return () => window.removeEventListener(EXPERIMENT_EVENT, onRestore);
    // buildSystem/resetSim are re-created each render; the listener only
    // needs the latest versions at event time, so re-subscribe is fine.
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      setPlayingOverride(!playing);
    } else if (e.key.toLowerCase() === "r") {
      e.preventDefault();
      reset();
    }
  };

  const k0 = Math.sqrt(2 * energy);
  const lambda = (2 * Math.PI) / k0;

  return (
    <div data-print="hide" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <figure className="m-0">
        <div className="relative h-[380px] overflow-hidden rounded-lg border border-border bg-card sm:h-[460px] lg:h-[560px]">
          <canvas
            ref={canvasRef}
            className="h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
            tabIndex={0}
            role="application"
            aria-label="Quantum wave packet tunneling simulation. Probability density evolves toward a potential barrier. Press Space to play or pause, R to reset."
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
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 meta-sm text-muted-foreground">
          <span>Fig. L-3 · Wave packet · Crank–Nicolson</span>
          <span className="tabular-nums">ħ = m = 1 · dt = {DT}</span>
        </figcaption>
      </figure>

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="meta-sm text-muted-foreground">
            Controls
          </h3>

          <div className="mt-5 space-y-5">
            <PresetChips
              ariaLabel="Experiment presets for the quantum wave packet"
              presets={WAVE_PRESETS}
              activeId={activePresetId}
              onSelect={applyPreset}
            />

            <div>
              <ShareExperimentButton
                tab="wave"
                preset={activePresetId}
                instrument="the wave-packet bench"
                params={shareParams}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="packet-energy" className="text-sm">
                  Packet energy
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  E = {energy.toFixed(2)} · k₀ = {k0.toFixed(2)}
                </span>
              </div>
              <Slider
                id="packet-energy"
                aria-label="Packet kinetic energy"
                min={E_MIN}
                max={E_MAX}
                step={0.05}
                value={[energy]}
                onValueChange={([v]) => setEnergy(v)}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Applies on reset. Group velocity v = k₀; de Broglie wavelength
                λ = 2π/k₀ ≈ {lambda.toFixed(2)} here.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="barrier-height" className="text-sm">
                  Barrier height
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  V₀ = {barrierV.toFixed(2)}
                </span>
              </div>
              <Slider
                id="barrier-height"
                aria-label="Barrier height"
                min={V0_MIN}
                max={V0_MAX}
                step={0.05}
                value={[barrierV]}
                onValueChange={([v]) => setBarrierV(v)}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Live. E &lt; V₀ is classically forbidden — yet the packet leaks
                through.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="barrier-width" className="text-sm">
                  Barrier width
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  w = {barrierW.toFixed(2)}
                </span>
              </div>
              <Slider
                id="barrier-width"
                aria-label="Barrier width"
                min={W_MIN}
                max={W_MAX}
                step={0.05}
                value={[barrierW]}
                onValueChange={([v]) => setBarrierW(v)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="wave-speed" className="text-sm">
                  Simulation speed
                </Label>
                <span className="font-mono text-xs tabular-nums text-photon">
                  {speed}× dt
                </span>
              </div>
              <Slider
                id="wave-speed"
                aria-label="Simulation speed"
                min={1}
                max={10}
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
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="meta-sm text-muted-foreground">
            Readout
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs tabular-nums">
            <dt className="text-muted-foreground">time t</dt>
            <dd className="text-right" ref={(el) => { readout.current.t = el; }}>—</dd>
            <dt className="text-muted-foreground">⟨x⟩</dt>
            <dd className="text-right" ref={(el) => { readout.current.x = el; }}>—</dd>
            <dt className="text-muted-foreground">reflected R</dt>
            <dd className="text-right" ref={(el) => { readout.current.R = el; }}>—</dd>
            <dt className="text-muted-foreground">transmitted T</dt>
            <dd className="text-right text-photon" ref={(el) => { readout.current.T = el; }}>—</dd>
            <dt className="text-muted-foreground">absorbed</dt>
            <dd className="text-right" ref={(el) => { readout.current.A = el; }}>—</dd>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            T compares the measured packet transmission with the plane-wave
            value — a broad packet is a superposition of energies, so the two
            need not agree exactly. That gap is physics, not error.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="meta-sm text-muted-foreground">
            How it works
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            The wavefunction is advanced by the Crank–Nicolson method — an
            implicit, unitary integrator, so probability is conserved to
            round-off. Absorbing potentials at the domain edges remove
            outgoing waves as if the box were infinite. Watch the packet
            split at the barrier: part reflects, part tunnels — and the
            transmitted piece is slower and dimmer, having selected the lower
            energy components of the packet.
          </p>
        </div>
      </div>
    </div>
  );
}
