"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Tex } from "@/components/site/tex";
import { LensingSim } from "./lensing-sim";
import { OrbitsSim } from "./orbits-sim";

/**
 * INTERACTIVE PHYSICS LABORATORY
 * Two working instruments, not animations: deflection and orbits,
 * each paired with its governing equations and stated assumptions.
 */
export function PhysicsLab() {
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
          lede="Two working instruments — deflect starlight through a gravitational lens, or set a two-body system in motion, and watch the equations answer back."
        />

        <Reveal className="mt-12" delay={0.1}>
          <Tabs defaultValue="lensing" className="w-full">
            <TabsList className="mb-8 h-auto w-full max-w-md gap-0 bg-transparent p-0 sm:w-auto">
              <TabsTrigger
                value="lensing"
                className="rounded-l-md rounded-r-none border border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none font-mono text-[11px] uppercase tracking-[0.16em] sm:px-6"
              >
                Gravitational Lensing
              </TabsTrigger>
              <TabsTrigger
                value="orbits"
                className="rounded-l-none rounded-r-md border border-l-0 border-border data-[state=active]:border-photon/50 data-[state=active]:bg-photon/10 data-[state=active]:shadow-none font-mono text-[11px] uppercase tracking-[0.16em] sm:px-6"
              >
                Orbital Mechanics
              </TabsTrigger>
            </TabsList>

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
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
