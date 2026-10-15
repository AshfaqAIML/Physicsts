"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Tex } from "@/components/site/tex";
import { LensingSim } from "./lensing-sim";
import { OrbitsSim } from "./orbits-sim";
import { WaveSim } from "./wave-sim";

export type LabTab = "lensing" | "orbits" | "wave";

/**
 * INTERACTIVE PHYSICS LABORATORY
 * Three working instruments, not animations: light deflection,
 * orbits, and quantum tunneling — each paired with its governing
 * equations and stated assumptions.
 */
export function PhysicsLab() {
  const [tab, setTab] = useState<LabTab>("lensing");

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

  const switchTab = useCallback((v: string) => {
    if (v === "lensing" || v === "orbits" || v === "wave") setTab(v);
  }, []);

  return (
    <section
      id="lab"
      aria-labelledby="lab-heading"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="06"
          eyebrow="Interactive Laboratory"
          title="Touch the Mathematics."
          lede="Three working instruments — deflect starlight through a gravitational lens, set a two-body system in motion, or watch a quantum wave packet tunnel through a wall it classically cannot climb."
        />

        <Reveal className="mt-12" delay={0.1}>
          <Tabs value={tab} onValueChange={switchTab} className="w-full">
            <div className="mb-8 w-full max-w-xl overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabsList className="h-auto w-max gap-0 bg-transparent p-0 sm:w-auto">
                <TabsTrigger
                  value="lensing"
                  className="rounded-l-md rounded-r-none border border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none font-mono text-[11px] uppercase tracking-[0.16em] sm:px-6"
                >
                  Gravitational Lensing
                </TabsTrigger>
                <TabsTrigger
                  value="orbits"
                  className="rounded-none border border-l-0 border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none font-mono text-[11px] uppercase tracking-[0.16em] sm:px-6"
                >
                  Orbital Mechanics
                </TabsTrigger>
                <TabsTrigger
                  value="wave"
                  className="rounded-l-none rounded-r-md border border-l-0 border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none font-mono text-[11px] uppercase tracking-[0.16em] sm:px-6"
                >
                  Wave Packet
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="lensing" className="mt-0">
              <LensingSim />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Mathematics
                  </h4>
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
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      What to try
                    </h4>
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
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Assumptions
                    </h4>
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
              <OrbitsSim />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Mathematics
                  </h4>
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
                      Conservation of energy and angular momentum closes the
                      problem — the vis-viva equation fixes the speed at any
                      radius along the conic:
                    </p>
                    <div className="overflow-x-auto py-1 text-foreground">
                      <Tex
                        display
                        math="v^{2} = GM\left(\frac{2}{r} - \frac{1}{a}\right)"
                        ariaLabel="v squared equals G M times two over r minus one over a"
                      />
                    </div>
                    <p>
                      The dashed curve is this exact solution; the glowing
                      trail is the numerical integration. Their agreement is
                      the demonstration.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      What to try
                    </h4>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Launch below circular speed (f &lt; 1) and the start becomes apoapsis; above it, periapsis.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Watch the ΔE readout: it is the integrator's honesty, not noise.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-photon" />
                        Raise the mass ratio and the “fixed” star begins to wobble — how we find exoplanets.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Assumptions
                    </h4>
                    <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground">
                      Newtonian gravity only — no relativistic precession, drag,
                      or third bodies. Fixed-step velocity Verlet (symplectic;
                      energy drift bounded, not zero). An honest educational
                      model — not a complete theory.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="wave" className="mt-0">
              <WaveSim />
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Mathematics
                  </h4>
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
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      What to try
                    </h4>
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
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Assumptions
                    </h4>
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
