/**
 * PROJECTS
 * ------------------------------------------------------------------
 * These are EXAMPLE concepts demonstrating the intended structure
 * — clearly marked as such until replaced with real work. Never
 * present these as completed research; each carries a status flag
 * you should update honestly.
 */

export type ProjectStatus = "example" | "planned" | "in-progress" | "complete";

/** A reference with an optional verified link — DOI or publisher URL.
 *  URLs are only added after checking they resolve to the cited work. */
export type ProjectReference = {
  citation: string;
  url?: string;
};

export type Project = {
  id: string;
  title: string;
  shortTitle: string;
  status: ProjectStatus;
  year: string;
  discipline: string;
  question: string;
  motivation: string;
  background: string;
  equation: string;
  equationLabel: string;
  methodology: string;
  assumptions: string[];
  findings: string;
  limitations: string;
  references: ProjectReference[];
  /** Set to a real repository URL when it exists */
  repository: string | null;
};

export const projects: Project[] = [
  {
    id: "curved-spacetime",
    title: "Visualising Curved Spacetime",
    shortTitle: "Curved Spacetime",
    status: "example",
    year: "—",
    discipline: "General Relativity · Visualisation",
    question: "Can the geometry of a curved spacetime be made visible and intuitive without losing scientific honesty?",
    motivation:
      "Embedding diagrams are the standard bridge between the mathematics of general relativity and human intuition. This project explores how far procedural visualisation can go in making curvature feel immediate — not as decoration, but as a geometric statement of the physics.",
    background:
      "The Schwarzschild solution describes spacetime around a static, spherical mass. Its spatial geometry can be represented by Flamm's paraboloid: the surface obtained by rotating a parabola, which preserves proper radial distances from the equatorial plane of the metric.",
    equation: "z(r) = 2\\sqrt{r_{s}\\,(r - r_{s})}, \\qquad r_{s} = \\frac{2GM}{c^{2}}",
    equationLabel: "Flamm's paraboloid for the Schwarzschild geometry",
    methodology:
      "A procedural canvas/WebGL renderer samples the embedding surface, overlays null geodesics of light rays, and lets the observer change the mass parameter — every visual quantity derived directly from the metric rather than hand-drawn.",
    assumptions: [
      "Static, spherically symmetric, non-rotating mass — the Schwarzschild vacuum solution.",
      "The surface is the equatorial spatial slice at one instant of coordinate time: an isometric embedding of two-dimensional spatial geometry, not the four-dimensional spacetime.",
      "Light paths are computed in the weak-field limit of the full metric; the paraboloid is a geometry exhibit, not a surface light travels on.",
    ],
    findings:
      "Illustrative — as an example concept, the demonstration shows the intended method: geometry-driven, parameterised, and reproducible from the metric tensor.",
    limitations:
      "An embedding diagram shows spatial curvature only. In the weak-field limit, light bending receives equal contributions from the curvature of time and the curvature of space — the full statement requires the four-dimensional geometry, which no single embedding can display.",
    references: [
      {
        citation:
          "Flamm, L. (1916). “Beiträge zur Einsteinschen Gravitationstheorie.” Physikalische Zeitschrift, 17, 448–454.",
      },
      {
        citation:
          "Einstein, A. (1916). “Die Grundlage der allgemeinen Relativitätstheorie.” Annalen der Physik, 354, 769–822.",
        url: "https://doi.org/10.1002/andp.19163540702",
      },
      {
        citation: "Misner, C. W., Thorne, K. S., & Wheeler, J. A. (1973). Gravitation. W. H. Freeman. §23.8.",
      },
    ],
    repository: null,
  },
  {
    id: "orbital-mechanics",
    title: "Exploring the Mathematics of Orbital Mechanics",
    shortTitle: "Orbital Mechanics",
    status: "example",
    year: "—",
    discipline: "Classical Mechanics · Computation",
    question: "How do conic sections, conservation laws, and numerical integration together explain the shape of an orbit?",
    motivation:
      "Orbits are the oldest solved problem in physics and still the best classroom for the interplay of geometry, conservation, and computation. This project builds that classroom as code: every conic section, from circle to hyperbola, from first principles.",
    background:
      "The Kepler problem reduces to a one-dimensional radial equation under conservation of energy and angular momentum. The solution is the conic section, with eccentricity set by the initial conditions.",
    equation: "r(\\theta) = \\frac{p}{1 + e\\cos\\theta}, \\qquad p = \\frac{L^{2}}{G M m^{2}}",
    equationLabel: "The orbit equation of the two-body problem (test-particle limit)",
    methodology:
      "An interactive two-body integrator (velocity-Verlet) compared against the exact analytic orbit; users vary mass ratio, energy, and angular momentum and watch eccentricity, semi-major axis, and period update in real time.",
    assumptions: [
      "Newtonian inverse-square gravity between point masses — no relativistic correction.",
      "The closed-form orbit equation assumes the test-particle limit m ≪ M; the integrator relaxes this when the mass-ratio mode is active.",
      "No tides, drag, radiation, or third bodies; energy and angular momentum are exactly conserved only in the underlying equations, not in the discretisation.",
    ],
    findings:
      "Illustrative — the intended demonstration is the agreement between numerical and analytic solutions, and the visual link between initial conditions and orbital shape.",
    limitations:
      "Newtonian gravity only: no relativistic precession, tidal forces, drag, or third bodies. The integrator conserves energy to numerical, not machine, precision.",
    references: [
      { citation: "Newton, I. (1687). Philosophiæ Naturalis Principia Mathematica. Book I." },
      { citation: "Landau, L. D., & Lifshitz, E. M. (1976). Mechanics (3rd ed.). Pergamon Press. §15." },
    ],
    repository: null,
  },
  {
    id: "numerical-simulations",
    title: "Numerical Simulations of Physical Systems",
    shortTitle: "Numerical Simulations",
    status: "example",
    year: "—",
    discipline: "Computational Physics",
    question: "What can numerical experiments reveal about systems that paper mathematics cannot close?",
    motivation:
      "The pendulum is solvable; the double pendulum is chaos. Between them lies most of the universe. This project is a small laboratory of integrators — studying how discrete steps approximate continuous truth, and where that approximation breaks.",
    background:
      "Symplectic integrators like velocity-Verlet preserve the geometric structure of Hamiltonian flows, making them dramatically more stable than naive Euler schemes over long times.",
    equation: "\\ddot{\\theta} + \\frac{g}{\\ell}\\sin\\theta = 0 \\quad \\xrightarrow{\\;\\text{small } \\theta\\;} \\quad \\ddot{\\theta} + \\omega^{2}\\theta = 0",
    equationLabel: "The pendulum, exact and linearised",
    methodology:
      "A comparison suite: Euler, RK4, and velocity-Verlet applied to the pendulum, double pendulum, and N-body systems — with convergence plots, energy-drift diagnostics, and phase-space portraits.",
    assumptions: [
      "Fixed-step integration (with sub-stepping where noted); no adaptive error control.",
      "Systems treated as conservative and frictionless — autonomous Hamiltonians.",
      "Chaos is diagnosed by the divergence of nearby trajectories, not by rigorous Lyapunov-exponent estimation.",
    ],
    findings:
      "Illustrative — the demonstration targets are energy-drift curves and the exponential divergence of nearby trajectories in the chaotic regime (Lyapunov behaviour).",
    limitations:
      "Fixed step sizes; no adaptive integration or symplectic splitting of higher order. Chaos diagnostics are qualitative rather than rigorous.",
    references: [
      {
        citation:
          "Hairer, E., Lubich, C., & Wanner, G. (2006). Geometric Numerical Integration (2nd ed.). Springer.",
      },
      { citation: "Press, W. H., et al. (2007). Numerical Recipes (3rd ed.). Cambridge University Press. Ch. 17." },
    ],
    repository: null,
  },
  {
    id: "quantum-superposition",
    title: "A Visual Introduction to Quantum Superposition",
    shortTitle: "Superposition",
    status: "example",
    year: "—",
    discipline: "Quantum Mechanics · Pedagogy",
    question: "Can interference — the physical heart of superposition — be shown directly rather than asserted?",
    motivation:
      "Superposition is usually taught as a statement about amplitudes and then immediately buried in formalism. This project leads with the wave behaviour itself: phasors, interference, and the double-slit pattern as the visible signature of amplitudes adding.",
    background:
      "A quantum state is a vector in Hilbert space; the Born rule makes the squared magnitude of the amplitude a probability. When amplitudes overlap, they add — and probabilities acquire interference terms.",
    equation: "|\\psi\\rangle = \\alpha\\,|0\\rangle + \\beta\\,|1\\rangle, \\qquad |\\alpha|^{2} + |\\beta|^{2} = 1",
    equationLabel: "A normalised qubit state; the Born rule assigns outcome probabilities |α|² and |β|²",
    methodology:
      "Canvas visualisations: phasor addition of amplitudes, a double-slit intensity simulation via path-integral-style phase accumulation, and an interactive Bloch-sphere-style state explorer.",
    assumptions: [
      "Non-relativistic, closed quantum system — no environment and no decoherence model.",
      "The double-slit intensity is computed from accumulated phase differences, not from a solved time-dependent wave equation.",
      "Measurement is represented by the Born rule alone; no collapse dynamics is modelled.",
    ],
    findings:
      "Illustrative — the goal is that “amplitudes add before probabilities are taken” becomes something seen, not memorised.",
    limitations:
      "A pedagogical model of non-relativistic quantum mechanics only: no measurement-theoretic claims, no relativistic or field-theoretic effects.",
    references: [
      {
        citation:
          "Feynman, R. P., Leighton, R. B., & Sands, M. (1965). The Feynman Lectures on Physics, Vol. III. Addison-Wesley. (Free online edition, Caltech.)",
        url: "https://www.feynmanlectures.caltech.edu/",
      },
      {
        citation:
          "Susskind, L., & Friedman, A. (2014). Quantum Mechanics: The Theoretical Minimum. Basic Books.",
      },
    ],
    repository: null,
  },
  {
    id: "gravitational-phenomena",
    title: "Computational Models of Gravitational Phenomena",
    shortTitle: "Gravitational Models",
    status: "example",
    year: "—",
    discipline: "General Relativity · Computation",
    question: "How does light behave near a compact mass — and can a browser show it correctly?",
    motivation:
      "Newton's corpuscular gravity predicts about half of light's measured deflection near the Sun; Einstein's geometry predicts all of it. That factor of two, confirmed by the eclipse expeditions of 1919, was general relativity's most famous early test. This project implements lensing as an interactive computation: photons, deflection, and the Einstein radius as quantities you can touch.",
    background:
      "In the thin-lens approximation, a point mass deflects light by an angle inversely proportional to the impact parameter; solving the lens equation yields the Einstein radius — the characteristic angular scale of rings and arcs.",
    equation: "\\hat{\\alpha} = \\frac{4GM}{c^{2}\\,b}, \\qquad \\theta_{E} = \\sqrt{\\frac{4GM}{c^{2}}\\,\\frac{D_{LS}}{D_{L}\\,D_{S}}}",
    equationLabel: "Point-mass deflection and the Einstein radius",
    methodology:
      "Ray-shooting through the lens equation: every screen pixel is mapped back to the source plane, producing genuine arcs, rings, and multiple images rather than painted decoration.",
    assumptions: [
      "Thin-lens approximation — all deflection happens in a single plane transverse to the line of sight.",
      "Point-mass lens; source and lens treated as static during the light's transit.",
      "Small angles throughout; relativistic aberration and finite-propagation effects are neglected.",
    ],
    findings:
      "Illustrative — the live laboratory version of this idea is running in the Physics Laboratory section of this very site.",
    limitations:
      "Thin-lens, point-mass, small-angle approximations; no full null-geodesic integration through the Kerr or Schwarzschild metric, no relativistic aberration.",
    references: [
      {
        citation:
          "Einstein, A. (1936). “Lens-Like Action of a Star by the Deviation of Light in the Gravitational Field.” Science, 84, 506–507.",
        url: "https://doi.org/10.1126/science.84.2188.506",
      },
      {
        citation:
          "Schneider, P., Ehlers, J., & Falco, E. E. (1992). Gravitational Lenses. Springer.",
      },
      {
        citation:
          "Dyson, F. W., Eddington, A. S., & Davidson, C. (1920). “A Determination of the Deflection of Light by the Sun's Gravitational Field...” Philosophical Transactions of the Royal Society A, 220, 291–333.",
        url: "https://doi.org/10.1098/rsta.1920.0009",
      },
    ],
    repository: null,
  },
];

export const projectStatusCopy: Record<ProjectStatus, { label: string; meaning: string }> = {
  example: {
    label: "Example concept",
    meaning: "A placeholder demonstrating the intended structure — replace with your actual work.",
  },
  planned: { label: "Planned", meaning: "Defined and not yet started." },
  "in-progress": { label: "In progress", meaning: "Work currently under way." },
  complete: { label: "Complete", meaning: "Finished and documented here." },
};
