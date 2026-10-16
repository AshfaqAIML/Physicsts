import type { ReactNode } from "react";
import { Tex } from "@/components/site/tex";

/**
 * SERVER-RENDERED mathematics for the laboratory benches.
 *
 * The equations and their surrounding prose are static, so they are
 * typeset on the server and handed to the (client) laboratory as React
 * nodes — KaTeX stays out of the client bundle, and the instruments
 * themselves remain the only interactive payload of the section.
 */

export type BenchKey = "lensing" | "orbits" | "wave";

export function buildLabMath(): Record<BenchKey, ReactNode> {
  return {
    lensing: (
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
    ),
    orbits: (
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
          along the conic, and the period closes Kepler&rsquo;s
          triad — in the simulation&rsquo;s physical scaling (total
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
    ),
    wave: (
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
    ),
  };
}
