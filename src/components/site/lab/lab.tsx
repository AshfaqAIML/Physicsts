"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Tex } from "@/components/site/tex";
import {
  EXPERIMENT_EVENT,
  isExperimentHash,
  isLabTourHash,
  parseExperimentHash,
  parseLabTourHash,
  type ExperimentSpec,
} from "./experiment-link";
import { LensingSim } from "./lensing-sim";
import { OrbitsSim } from "./orbits-sim";
import { ShareLabTourButton, type ReportedBench } from "./share-lab-tour";
import { WaveSim } from "./wave-sim";

export type LabTab = "lensing" | "orbits" | "wave";

/**
 * INTERACTIVE PHYSICS LABORATORY
 * Three working instruments, not animations: light deflection,
 * orbits, and quantum tunneling — each paired with its governing
 * equations and stated assumptions. Every bench state is shareable:
 * #experiment=<instrument>?<params> restores it from a link, and
 * #lab-tour=<seg>|<seg>|<seg> restores the whole room at once.
 */
export function PhysicsLab() {
  const [tab, setTab] = useState<LabTab>("lensing");
  // Bumped on every parsed #experiment= or #lab-tour= so the delivery
  // effect re-runs even when the link targets the already-active bench.
  const [restoreTick, setRestoreTick] = useState(0);
  // Benches whose tour segment is still waiting to be visited — drives
  // the photon dot on the instrument tabs so a tour link reads as a
  // self-guided route, not an accident.
  const [tourPending, setTourPending] = useState<LabTab[]>([]);

  // A parsed #experiment= spec waiting for its instrument to mount.
  const pendingSpecRef = useRef<ExperimentSpec | null>(null);

  // A parsed #lab-tour= waiting bench by bench: each segment is delivered
  // when the visitor reaches that instrument (the tour is self-guided —
  // the first segment decides where it starts).
  const pendingTourRef = useRef<Map<LabTab, ExperimentSpec> | null>(null);
  const tourFirstDeliveryRef = useRef(true);

  // Last-known state of each bench, reported by the instruments as their
  // shareable state settles — one map feeds the whole-lab tour link, so
  // it captures benches the visitor has already left.
  const benchStatesRef = useRef<Partial<Record<LabTab, ReportedBench>>>({});

  const reportBench = useCallback(
    (
      bench: LabTab,
      params: Record<string, string | number | boolean>,
      preset: string | null
    ) => {
      benchStatesRef.current[bench] = { tab: bench, params, preset };
    },
    []
  );
  const reportLensing = useCallback(
    (params: Record<string, string | number | boolean>, preset: string | null) =>
      reportBench("lensing", params, preset),
    [reportBench]
  );
  const reportOrbits = useCallback(
    (params: Record<string, string | number | boolean>, preset: string | null) =>
      reportBench("orbits", params, preset),
    [reportBench]
  );
  const reportWave = useCallback(
    (params: Record<string, string | number | boolean>, preset: string | null) =>
      reportBench("wave", params, preset),
    [reportBench]
  );

  // The tour link serialises the lab as it was left: the bench the
  // visitor is on now leads; the others follow in canonical order.
  const collectBenches = useCallback((): ReportedBench[] => {
    const all: LabTab[] = [tab, "lensing", "orbits", "wave"];
    const order = all.filter((v, i) => all.indexOf(v) === i);
    const out: ReportedBench[] = [];
    for (const bench of order) {
      const state = benchStatesRef.current[bench];
      if (state) out.push(state);
    }
    return out;
  }, [tab]);

  // External control (command palette) — switch instruments on demand
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<LabTab>).detail;
      if (detail === "lensing" || detail === "orbits" || detail === "wave") {
        setTab(detail);
      }
    };
    window.addEventListener("phys:lab-tab", onOpen);
    return () => window.removeEventListener("phys:lab-tab", onOpen);
  }, []);

  // Shared-link restore: parse on mount and on every hashchange, then
  // hand the spec to whichever instrument the link names. Tour links
  // (#lab-tour=) deliver bench by bench as the visitor reaches them.
  useEffect(() => {
    const apply = () => {
      const tour = parseLabTourHash(window.location.hash);
      if (tour) {
        const segments = new Map<LabTab, ExperimentSpec>();
        for (const spec of tour.specs) segments.set(spec.tab, spec);
        pendingTourRef.current = segments;
        setTourPending(tour.specs.map((s) => s.tab));
        tourFirstDeliveryRef.current = true;
        setTab(tour.specs[0].tab);
        setRestoreTick((t) => t + 1);
        return;
      }
      const spec = parseExperimentHash(window.location.hash);
      if (!spec) return;
      pendingTourRef.current = null;
      setTourPending([]);
      pendingSpecRef.current = spec;
      setTab(spec.tab);
      setRestoreTick((t) => t + 1);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  // Once the requested tab is mounted (its own effects have run, so the
  // instrument has measured its canvas), deliver the spec and scroll the
  // visitor down to the bench. Deferred by a frame so a fresh mount can
  // settle; notebook deep-links are unaffected (different prefix). A
  // tour segment delivered on a later tab switch does not scroll again —
  // the visitor walked there themselves.
  //
  // The pending maps are mutated only INSIDE the timeout: if the effect
  // re-runs first (tab switch, restoreTick bump), the cleanup cancels
  // the pending delivery and the segment simply stays pending — it will
  // be delivered when its bench is (re)reached. Deleting at schedule
  // time instead would silently drop shared state whenever a timeout is
  // cancelled — exactly what happens on the first double-render after a
  // tour link loads (initial tab → parsed tab).
  useEffect(() => {
    const spec = pendingSpecRef.current;
    const tour = pendingTourRef.current;
    let deliver: ExperimentSpec | null = null;
    let fromTour = false;
    if (spec && spec.tab === tab) {
      deliver = spec;
    } else if (tour && tour.has(tab)) {
      deliver = tour.get(tab) ?? null;
      fromTour = true;
    }
    if (!deliver) return;
    const id = window.setTimeout(() => {
      // Claim the spec only now that the delivery is actually firing.
      if (!fromTour) {
        pendingSpecRef.current =
          pendingSpecRef.current === deliver ? null : pendingSpecRef.current;
      } else {
        const pending = pendingTourRef.current;
        pending?.delete(tab);
        setTourPending((prev) => prev.filter((t) => t !== tab));
        if (pending && pending.size === 0) {
          // Every bench on the tour has been visited — the URL no longer
          // needs to carry it; a refresh starts from a clean lab, honestly.
          pendingTourRef.current = null;
          if (isLabTourHash(window.location.hash)) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      }
      const isTourOpening = fromTour && tourFirstDeliveryRef.current;
      if (fromTour) tourFirstDeliveryRef.current = false;
      if (!fromTour || isTourOpening) {
        const calm =
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          window.localStorage.getItem("phys:motion-reduced") === "1";
        document
          .getElementById("lab")
          ?.scrollIntoView({ behavior: calm ? "auto" : "smooth" });
      }
      window.dispatchEvent(
        new CustomEvent<ExperimentSpec>(EXPERIMENT_EVENT, {
          detail: deliver,
        })
      );
      if (!fromTour) {
        toast.info("Experiment restored from a shared link.", {
          description: "The instrument was set up exactly as it was shared.",
        });
      } else if (isTourOpening) {
        toast.info("Lab tour restored from a shared link.", {
          description:
            "The benches are set as they were shared — hop between the instruments to see each one.",
        });
      } else {
        toast.info("Tour bench restored.", {
          description: "This instrument is set up as the tour link shared.",
        });
      }
    }, 80);
    return () => window.clearTimeout(id);
  }, [tab, restoreTick]);

  const switchTab = useCallback((v: string) => {
    if (v === "lensing" || v === "orbits" || v === "wave") {
      setTab(v);
      // A manual switch leaves the shared setup behind — keep the URL
      // honest by clearing the stale experiment hash (no history entry).
      if (isExperimentHash(window.location.hash)) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  return (
    <section
      id="lab"
      aria-labelledby="lab-heading"
      className="relative section-pad"
    >
      <div className="shell">
        <SectionHeading
          index="06"
          headingId="lab-heading"
          eyebrow="Interactive Laboratory"
          title="Touch the Mathematics."
          lede="Three working instruments — deflect starlight through a gravitational lens, set a two-body system in motion, or watch a quantum wave packet tunnel through a wall it classically cannot climb."
          meta="3 instruments · live"
        />

        <Reveal className="mt-12" delay={0.1}>
          {/* Print catalogue note — paper cannot run the instruments */}
          <p data-print="only" className="hidden font-mono text-[9.5pt] uppercase tracking-[0.14em] text-black/70">
            The three instruments — gravitational lensing, orbital mechanics,
            quantum wave-packet tunnelling — are live on the screen; paper
            cannot run simulations. This printed copy records their catalogue.
          </p>
          {/* Whole-lab tour share — the room-level companion to the
              per-bench share chips inside each instrument. It shares one
              control band with the instrument tabs: tabs left, tour
              right, wrapping beneath on narrow screens. */}
          <Tabs value={tab} onValueChange={switchTab} className="w-full">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <div className="w-full max-w-xl overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto sm:flex-1">
                <TabsList className="h-auto w-max gap-0 bg-transparent p-0 sm:w-auto">
                  <TabsTrigger
                    value="lensing"
                    className="rounded-l-md rounded-r-none border border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none eyebrow sm:px-6"
                  >
                    Gravitational Lensing
                    <TourDot pending={tourPending.includes("lensing")} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="orbits"
                    className="rounded-none border border-l-0 border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none eyebrow sm:px-6"
                  >
                    Orbital Mechanics
                    <TourDot pending={tourPending.includes("orbits")} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="wave"
                    className="rounded-l-none rounded-r-md border border-l-0 border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none eyebrow sm:px-6"
                  >
                    Wave Packet
                    <TourDot pending={tourPending.includes("wave")} />
                  </TabsTrigger>
                </TabsList>
              </div>
              <div data-print="hide" className="ml-auto flex justify-end">
                <ShareLabTourButton benches={collectBenches} />
              </div>
            </div>

            <TabsContent value="lensing" className="mt-0">
              <LensingSim onReport={reportLensing} />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h3 className="meta-sm text-muted-foreground">
                    Mathematics
                  </h3>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      A point mass deflects a light ray by an angle inversely
                      proportional to its impact parameter. The lens equation
                      maps where an image appears to where its light began:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="\boldsymbol{\beta} = \boldsymbol{\theta} - \frac{\theta_E^{2}}{|\boldsymbol{\theta}|^{2}}\,\boldsymbol{\theta}"
                        ariaLabel="beta equals theta minus theta-E squared over theta squared times theta"
                      />
                    </div>
                    <p>
                      The characteristic scale — the Einstein radius — is set
                      by the mass and the geometry of the source, lens, and
                      observer:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="\theta_E = \sqrt{\frac{4GM}{c^{2}}\;\frac{D_{LS}}{D_{L}\,D_{S}}}"
                        ariaLabel="theta-E equals the square root of four G M over c squared times D-L-S over D-L D-S"
                      />
                    </div>
                    <p>
                      When source, lens, and observer align, the image becomes
                      a ring of this radius — the signature the simulation
                      reproduces by construction.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h3 className="meta-sm text-muted-foreground">
                      What to try
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Drag the dark mass directly over a bright star and watch it split into two images, then merge into a ring.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Switch to the coordinate grid and slide the lens across it — the tangential stretching near θ_E is what “curvature of the image plane” looks like.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Raise the mass and watch the Einstein ring swallow the sky.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h3 className="meta-sm text-muted-foreground">
                      Assumptions
                    </h3>
                    <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground">
                      Thin-lens, point-mass, small-angle approximation. Rays are
                      traced through the lens equation, not integrated as null
                      geodesics of the full metric. An honest educational model
                      — not a complete theory.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orbits" className="mt-0">
              <OrbitsSim onReport={reportOrbits} />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h3 className="meta-sm text-muted-foreground">
                    Mathematics
                  </h3>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      The two-body problem reduces, in the relative
                      coordinate, to a single inverse-square law:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="\ddot{\mathbf{r}} = -\,\frac{GM}{r^{3}}\,\mathbf{r}"
                        ariaLabel="r double dot equals minus G M over r cubed times r"
                      />
                    </div>
                    <p>
                      Conservation of energy and angular momentum closes
                      the problem. The orbit is a conic section with the
                      primary at its focus:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="r(\theta) = \frac{p}{1 + e\cos(\theta - \theta_P)}\,,\quad p = \frac{h^{2}}{GM}"
                        ariaLabel="r of theta equals p over one plus e cosine of theta minus theta P, with p equals h squared over G M"
                      />
                    </div>
                    <p>
                      The vis-viva equation fixes the speed at any radius
                      along the conic, and the period closes Kepler’s
                      triad — in the simulation’s physical scaling (total
                      mass 1 M☉, distances in AU) it reads T[yr] = a[AU]³ᐟ²:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="v^{2} = GM\left(\frac{2}{r} - \frac{1}{a}\right)\,,\quad T = 2\pi\sqrt{\frac{a^{3}}{GM}}"
                        ariaLabel="v squared equals G M times two over r minus one over a, and T equals two pi times the square root of a cubed over G M"
                      />
                    </div>
                    <p>
                      The dashed curve is the exact conic from the launch
                      conditions; the glowing trail is the numerical
                      integration. Their agreement is the demonstration —
                      and the ΔE readout quantifies whatever disagreement
                      remains.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h3 className="meta-sm text-muted-foreground">
                      What to try
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Launch below circular speed (f &lt; 1) and the start becomes apoapsis; above it, periapsis. Past f = √2 ≈ 1.41 the conic opens into a hyperbola and the period readout gives way to v∞.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Keep f = 1 and raise the launch radius: still a perfect circle, but the period grows as r₀³ᐟ² — Kepler’s third law, live in the readout.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Drag the planet off-tangent and release — most real orbits are eccentric, and the photon ghost shows the conic you are building before you commit.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Watch the ΔE readout: it is the integrator’s honesty, not noise. Near periapsis the step sub-divides — the tightest arcs are where a fixed step is most stressed.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Raise the mass ratio and the “fixed” star begins to wobble about the barycentre — how we find exoplanets.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h3 className="meta-sm text-muted-foreground">
                      Assumptions
                    </h3>
                    <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground">
                      Newtonian point-mass gravity only — no relativistic
                      precession (Mercury’s famous 43″ per century is absent
                      by construction), no tides, no drag, no third bodies.
                      The mass-ratio slider is deliberately exaggerated:
                      real star–planet ratios run 10³–10⁶× smaller — shown
                      large so the barycentre wobble is visible at all.
                      Integration is fixed-step velocity Verlet with adaptive
                      sub-stepping near periapsis — symplectic in form, so
                      energy drift stays bounded (watch ΔE), not zero. An
                      honest educational model — not a complete theory, not
                      mission-grade ephemeris.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="wave" className="mt-0">
              <WaveSim onReport={reportWave} />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h3 className="meta-sm text-muted-foreground">
                    Mathematics
                  </h3>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      Everything here follows from one equation — the
                      time-dependent Schrödinger equation, here in natural
                      units where ħ = m = 1:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="i\,\frac{\partial \psi}{\partial t} = -\frac{1}{2}\frac{\partial^{2}\psi}{\partial x^{2}} + V(x)\,\psi"
                        ariaLabel="i times the partial derivative of psi with respect to t equals minus one half the second partial of psi with respect to x squared plus V of x times psi"
                      />
                    </div>
                    <p>
                      For a rectangular barrier, plane waves transmit with
                      the probability given by the tunneling coefficient —
                      exponentially small, but never zero:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="T = \frac{1}{1 + \dfrac{V_{0}^{2}\sinh^{2}(\kappa w)}{4E\,(V_{0}-E)}}\,,\quad \kappa = \sqrt{2(V_{0}-E)}"
                        ariaLabel="T equals one over one plus V-zero squared times sinh squared of kappa w, over four E times V-zero minus E, with kappa equals the square root of two times V-zero minus E"
                      />
                    </div>
                    <p>
                      The simulation advances ψ by the Crank–Nicolson method
                      — implicit and unitary — so the R and T readouts are
                      measured from the wavefunction, not assumed.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h3 className="meta-sm text-muted-foreground">
                      What to try
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Set E well below V₀ — classically forbidden, yet a
                        dim transmitted packet walks through the wall.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Raise the barrier width and watch T fall
                        exponentially — the signature of tunneling.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Watch the packet spread as it travels — dispersion is
                        the uncertainty principle in motion.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h3 className="meta-sm text-muted-foreground">
                      Assumptions
                    </h3>
                    <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground">
                      One non-relativistic particle in one dimension, static
                      barrier. The integration is unitary (Crank–Nicolson);
                      absorbing potentials at the edges stand in for an
                      infinite domain. An honest educational model — not a
                      complete theory.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * TOUR DOT — a photon pip on an instrument tab while a shared lab tour
 * still has a setup waiting on that bench. It answers "where does this
 * tour still lead?" at a glance, and it retires the moment the bench's
 * shared state has been visited.
 */
function TourDot({ pending }: { pending: boolean }) {
  if (!pending) return null;
  return (
    <>
      <span
        aria-hidden="true"
        className="ml-2 inline-block size-[5px] rounded-full bg-photon shadow-[0_0_6px_var(--color-photon)]"
      />
      <span className="sr-only">
        — a shared setup from the tour link is waiting on this bench
      </span>
    </>
  );
}
