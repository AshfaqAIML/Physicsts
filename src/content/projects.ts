/**
 * PROJECTS
 * ------------------------------------------------------------------
 * These are EXAMPLE concepts demonstrating the intended structure
 * — clearly marked as such until replaced with real work. Never
 * present these as completed research; each carries a status flag
 * you should update honestly.
 */

export type ProjectStatus = "example" | "planned" | "in-progress" | "complete";

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
  findings: string;
  limitations: string;
  references: string[];
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
    findings:
      "Illustrative — as an example concept, the demonstration shows the intended method: geometry-driven, parameterised, and reproducible from the metric tensor.",
    limitations:
      "An embedding diagram shows spatial curvature only; it cannot show the mixing of space and time that produces most of the Newtonian-limit bending. The full treatment requires the 4-dimensional geometry.",
    references: [
      "Flamm (1916), “Beiträge zur Einsteinschen Gravitationstheorie”",
      "Misner, Thorne & Wheeler, Gravitation, §23.8",
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
    equationLabel: "The orbit equation of the two-body problem",
    methodology:
      "An interactive two-body integrator (velocity-Verlet) compared against the exact analytic orbit; users vary mass ratio, energy, and angular momentum and watch eccentricity, semi-major axis, and period update in real time.",
    findings:
      "Illustrative — the intended demonstration is the agreement between numerical and analytic solutions, and the visual link between initial conditions and orbital shape.",
    limitations:
      "Newtonian gravity only: no relativistic precession, tidal forces, drag, or third bodies. The integrator conserves energy to numerical, not machine, precision.",
    references: [
      "Newton, Principia, Book I",
      "Landau & Lifshitz, Mechanics, §15",
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
    findings:
      "Illustrative — the demonstration targets are energy-drift curves and the exponential divergence of nearby trajectories in the chaotic regime (Lyapunov behaviour).",
    limitations:
      "Fixed step sizes; no adaptive integration or symplectic splitting of higher order. Chaos diagnostics are qualitative rather than rigorous.",
    references: [
      "Hairer, Lubich & Wanner, Geometric Numerical Integration",
      "Press et al., Numerical Recipes, Ch. 17",
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
    equationLabel: "A qubit state and the Born rule",
    methodology:
      "Canvas visualisations: phasor addition of amplitudes, a double-slit intensity simulation via path-integral-style phase accumulation, and an interactive Bloch-sphere-style state explorer.",
    findings:
      "Illustrative — the goal is that “amplitudes add before probabilities are taken” becomes something seen, not memorised.",
    limitations:
      "A pedagogical model of non-relativistic quantum mechanics only: no measurement-theoretic claims, no relativistic or field-theoretic effects.",
    references: [
      "Feynman, Leighton & Sands, The Feynman Lectures on Physics, Vol. III",
      "Susskind & Friedman, Quantum Mechanics: The Theoretical Minimum",
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
      "Gravitational lensing was the first test Einstein's theory passed that Newton's could not attempt. This project implements lensing as an interactive computation: photons, deflection, and the Einstein radius as quantities you can touch.",
    background:
      "In the thin-lens approximation, a point mass deflects light by an angle inversely proportional to the impact parameter; solving the lens equation yields the Einstein radius — the characteristic angular scale of rings and arcs.",
    equation: "\\hat{\\alpha} = \\frac{4GM}{c^{2}\\,b}, \\qquad \\theta_{E} = \\sqrt{\\frac{4GM}{c^{2}}\\,\\frac{D_{LS}}{D_{L}\\,D_{S}}}",
    equationLabel: "Point-mass deflection and the Einstein radius",
    methodology:
      "Ray-shooting through the lens equation: every screen pixel is mapped back to the source plane, producing genuine arcs, rings, and multiple images rather than painted decoration.",
    findings:
      "Illustrative — the live laboratory version of this idea is running in the Physics Laboratory section of this very site.",
    limitations:
      "Thin-lens, point-mass, small-angle approximations; no full null-geodesic integration through the Kerr or Schwarzschild metric, no relativistic aberration.",
    references: [
      "Einstein (1936), “Lens-Like Action of a Star by the Deviation of Light in the Gravitational Field”",
      "Schneider, Ehlers & Falco, Gravitational Lenses",
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
