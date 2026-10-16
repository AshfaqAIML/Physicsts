"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import {
  EXPERIMENT_EVENT,
  isExperimentHash,
  isLabTourHash,
  parseExperimentHash,
  parseLabTourHash,
  type ExperimentSpec,
} from "./experiment-link";
import { ShareLabTourButton, type ReportedBench } from "./share-lab-tour";

// The three instruments are heavy interactive code (canvas, integrators,
// control bands). They are code-split and mounted only when the visitor
// approaches the laboratory — the mathematics around them is already
// server-rendered, so nothing is lost to no-JS readers or crawlers.
const LensingSim = dynamic(() => import("./lensing-sim").then((m) => ({ default: m.LensingSim })), { ssr: false });
const OrbitsSim = dynamic(() => import("./orbits-sim").then((m) => ({ default: m.OrbitsSim })), { ssr: false });
const WaveSim = dynamic(() => import("./wave-sim").then((m) => ({ default: m.WaveSim })), { ssr: false });

export type LabTab = "lensing" | "orbits" | "wave";

/**
 * INTERACTIVE PHYSICS LABORATORY
 * Three working instruments, not animations: light deflection,
 * orbits, and quantum tunneling — each paired with its governing
 * equations and stated assumptions. Every bench state is shareable:
 * #experiment=<instrument>?<params> restores it from a link, and
 * #lab-tour=<seg>|<seg>|<seg> restores the whole room at once.
 *
 * The instruments mount lazily (BenchGate below) and the mathematics
 * arrives pre-rendered from the server via the `math` prop — the lab
 * keeps its interactivity without paying for it at page load.
 */
export function PhysicsLab({ math }: { math: Record<LabTab, ReactNode> }) {
  const [tab, setTab] = useState<LabTab>("lensing");
  // Which instruments have woken up (mounted and listening). A shared
  // link that targets a still-sleeping bench scrolls it into the wake
  // margin first, then delivers once the instrument reports ready.
  const [benchReady, setBenchReady] = useState<Record<LabTab, boolean>>({
    lensing: false,
    orbits: false,
    wave: false,
  });
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

  const markBenchReady = useCallback((bench: LabTab) => {
    setBenchReady((prev) => (prev[bench] ? prev : { ...prev, [bench]: true }));
  }, []);

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
    // The instrument is still sleeping (lazy bench mount). Bring the
    // laboratory into the wake margin so the bench mounts, then let the
    // readiness flip re-run this effect and deliver to a listener that
    // actually exists.
    if (!benchReady[tab]) {
      const calm =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.localStorage.getItem("phys:motion-reduced") === "1";
      document
        .getElementById("lab")
        ?.scrollIntoView({ behavior: calm ? "auto" : "smooth" });
      return;
    }
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
  }, [tab, restoreTick, benchReady]);

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
              <BenchGate bench="lensing" onReady={markBenchReady}>
                <LensingSim onReport={reportLensing} />
              </BenchGate>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h3 className="meta-sm text-muted-foreground">
                    Mathematics
                  </h3>
                  {math.lensing}
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
              <BenchGate bench="orbits" onReady={markBenchReady}>
                <OrbitsSim onReport={reportOrbits} />
              </BenchGate>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h3 className="meta-sm text-muted-foreground">
                    Mathematics
                  </h3>
                  {math.orbits}
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
              <BenchGate bench="wave" onReady={markBenchReady}>
                <WaveSim onReport={reportWave} />
              </BenchGate>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h3 className="meta-sm text-muted-foreground">
                    Mathematics
                  </h3>
                  {math.wave}
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

/**
 * BENCH GATE — the laboratory's lazy threshold. Each instrument is heavy
 * interactive code; this gate keeps it out of the page entirely until the
 * visitor comes within the wake margin (~1.5 screens), then mounts it
 * once and for all. The placeholder reserves comparable vertical space
 * so the section's rhythm holds while the bench sleeps, and the whole
 * laboratory is still printed, searched, and screen-read through its
 * server-rendered mathematics and prose. `onReady` fires after the
 * instrument's own effects have attached — the signal the shared-link
 * delivery above waits for.
 */
function BenchGate({
  bench,
  onReady,
  children,
}: {
  bench: LabTab;
  onReady: (bench: LabTab) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true);
      },
      { rootMargin: "1200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    // Children's effects run before this parent effect, so the instrument
    // is mounted and listening; the settle matches the delivery timeout.
    // Cleanup-managed, so the signal fires exactly once even under
    // double-invoked dev effects.
    const id = window.setTimeout(() => onReady(bench), 140);
    return () => window.clearTimeout(id);
  }, [visible, bench, onReady]);

  return (
    <div ref={ref}>
      {visible ? (
        children
      ) : (
        <div
          aria-hidden="true"
          className="flex min-h-[380px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/30 sm:min-h-[460px]"
        >
          <span className="meta-sm text-muted-foreground/50">
            Instrument sleeping — it wakes as you approach.
          </span>
        </div>
      )}
    </div>
  );
}
