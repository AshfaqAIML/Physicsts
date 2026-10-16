/**
 * THE LEXICON — a field guide to the language of physics.
 * Twenty-four standard terms, each with a precise definition and,
 * where natural, the canonical formula. Nothing here is invented:
 * every statement is textbook physics, every constant value is the
 * CODATA/SI one.
 */

export type LexiconCategory =
  | "Classical Mechanics"
  | "Relativity"
  | "Quantum Theory"
  | "Statistical & Thermal"
  | "Fields & Particles"
  | "Mathematics"
  | "Cosmology";

export interface LexiconTerm {
  /** kebab-case identifier */
  id: string;
  /** Display name, e.g. "Lagrangian" */
  term: string;
  category: LexiconCategory;
  /** Optional KaTeX source for the canonical formula. */
  formula?: string;
  /** Short mono caption under the formula. */
  formulaLabel?: string;
  /** 1–2 precise sentences of real physics. */
  definition: string;
  /** ids of related terms */
  seeAlso?: string[];
}

export const lexiconCategories: LexiconCategory[] = [
  "Classical Mechanics",
  "Relativity",
  "Quantum Theory",
  "Statistical & Thermal",
  "Fields & Particles",
  "Mathematics",
  "Cosmology",
];

export const lexiconTerms: LexiconTerm[] = [
  // ------------------------------------------------------------------
  // Classical Mechanics
  // ------------------------------------------------------------------
  {
    id: "lagrangian",
    term: "Lagrangian",
    category: "Classical Mechanics",
    formula: "L = T - V",
    formulaLabel: "Natural systems",
    definition:
      "A function of generalized coordinates, velocities, and time that summarizes a system's dynamics through its kinetic and potential energies. The trajectory a system actually follows is the one that makes the action — the integral of the Lagrangian — stationary.",
    seeAlso: ["hamiltonian", "action", "euler-lagrange-equation"],
  },
  {
    id: "hamiltonian",
    term: "Hamiltonian",
    category: "Classical Mechanics",
    formula: "H(q, p, t) = \\sum_i p_i \\dot{q}_i - L",
    formulaLabel: "Legendre transform of L",
    definition:
      "The function of coordinates and momenta that generates a system's time evolution in Hamiltonian mechanics and, for many mechanical systems, equals the total energy T + V. It is the classical ancestor of the energy operator in quantum mechanics.",
    seeAlso: ["lagrangian", "schrodinger-equation"],
  },
  {
    id: "action",
    term: "Action",
    category: "Classical Mechanics",
    formula: "S[q] = \\int_{t_1}^{t_2} L(q, \\dot{q}, t)\\, dt",
    formulaLabel: "Action functional",
    definition:
      "The time integral of the Lagrangian along a candidate path between two events. Hamilton's principle of stationary action singles out the physically realized trajectory from all smooth alternatives.",
    seeAlso: ["lagrangian", "euler-lagrange-equation", "noether-theorem"],
  },
  {
    id: "euler-lagrange-equation",
    term: "Euler–Lagrange Equation",
    category: "Classical Mechanics",
    formula:
      "\\frac{d}{dt} \\left( \\frac{\\partial L}{\\partial \\dot{q}_i} \\right) - \\frac{\\partial L}{\\partial q_i} = 0",
    formulaLabel: "Stationary action",
    definition:
      "The condition every coordinate of a stationary-action path must satisfy. For systems with a standard Lagrangian it reproduces Newton's second law exactly, while extending it to arbitrary generalized coordinates.",
    seeAlso: ["lagrangian", "action"],
  },
  {
    id: "noether-theorem",
    term: "Noether's Theorem",
    category: "Classical Mechanics",
    formula: "Q = \\sum_i \\frac{\\partial L}{\\partial \\dot{q}_i}\\, \\delta q_i",
    formulaLabel: "Conserved charge",
    definition:
      "Proven by Emmy Noether in 1915–1918: every continuous symmetry of the action implies a conserved quantity. Time-translation invariance yields conservation of energy, spatial translations yield momentum, and rotations yield angular momentum.",
    seeAlso: ["lagrangian", "action", "gauge-symmetry"],
  },

  // ------------------------------------------------------------------
  // Relativity
  // ------------------------------------------------------------------
  {
    id: "metric-tensor",
    term: "Metric Tensor",
    category: "Relativity",
    formula: "ds^2 = g_{\\mu\\nu}\\, dx^\\mu\\, dx^\\nu",
    formulaLabel: "Line element",
    definition:
      "The field g_μν that assigns squared lengths to infinitesimal displacements, defining the geometry of spacetime at every point. Freely falling particles and light rays follow its geodesics.",
    seeAlso: ["spacetime-interval", "einstein-field-equations", "tensor"],
  },
  {
    id: "einstein-field-equations",
    term: "Einstein Field Equations",
    category: "Relativity",
    formula: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}\\, T_{\\mu\\nu}",
    formulaLabel: "1915 · with Λ",
    definition:
      "The field equations of general relativity, published by Einstein in 1915: the curvature of spacetime is sourced by its matter and energy content. They reduce to Newtonian gravity in the weak-field, slow-motion limit.",
    seeAlso: ["metric-tensor", "cosmological-constant", "schwarzschild-radius"],
  },
  {
    id: "schwarzschild-radius",
    term: "Schwarzschild Radius",
    category: "Relativity",
    formula: "r_s = \\frac{2GM}{c^2}",
    formulaLabel: "Event horizon",
    definition:
      "The radius that marks the event horizon of an uncharged, non-rotating black hole of mass M, found by Karl Schwarzschild in 1916 as the first exact solution of the Einstein equations. The Sun would need to be compressed to about three kilometres to fit inside its own.",
    seeAlso: ["einstein-field-equations", "metric-tensor"],
  },
  {
    id: "proper-time",
    term: "Proper Time",
    category: "Relativity",
    formula: "d\\tau = dt\\, \\sqrt{1 - \\frac{v^2}{c^2}}",
    formulaLabel: "Flat spacetime",
    definition:
      "The elapsed time shown by a clock carried along a specific worldline — the invariant length of that path through spacetime. Between the same two events, a moving clock records less proper time than one at rest, an effect confirmed by muon and atomic-clock experiments.",
    seeAlso: ["spacetime-interval", "metric-tensor"],
  },
  {
    id: "spacetime-interval",
    term: "Spacetime Interval",
    category: "Relativity",
    formula: "ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2",
    formulaLabel: "Minkowski metric",
    definition:
      "The invariant separation between two events, combining space and time components in a way all inertial observers agree upon. Its sign divides separations into timelike, lightlike, and spacelike — and only timelike- or lightlike-separated events can be causally connected; nothing links spacelike ones.",
    seeAlso: ["proper-time", "metric-tensor"],
  },

  // ------------------------------------------------------------------
  // Quantum Theory
  // ------------------------------------------------------------------
  {
    id: "wavefunction",
    term: "Wavefunction",
    category: "Quantum Theory",
    formula: "P(x, t)\\, dx = |\\psi(x, t)|^2\\, dx",
    formulaLabel: "Born rule",
    definition:
      "The complex amplitude ψ whose squared magnitude, by Max Born's rule, gives the probability density for finding a particle at a given position and time. It encodes the complete quantum state of a system.",
    seeAlso: ["schrodinger-equation", "uncertainty-principle"],
  },
  {
    id: "uncertainty-principle",
    term: "Uncertainty Principle",
    category: "Quantum Theory",
    formula: "\\Delta x\\, \\Delta p \\geq \\frac{\\hbar}{2}",
    formulaLabel: "Heisenberg, 1927",
    definition:
      "Position and momentum cannot both take arbitrarily sharp values in the same quantum state. It follows from the wave nature of quantum states and their Fourier relationship, not merely from the disturbance caused by measurement.",
    seeAlso: ["wavefunction", "schrodinger-equation"],
  },
  {
    id: "schrodinger-equation",
    term: "Schrödinger Equation",
    category: "Quantum Theory",
    formula: "i\\hbar\\, \\frac{\\partial \\psi}{\\partial t} = \\hat{H} \\psi",
    formulaLabel: "Time evolution",
    definition:
      "The evolution law of non-relativistic quantum mechanics, written by Erwin Schrödinger in 1926: the Hamiltonian operator generates the wavefunction's change in time. Its stationary form yields the discrete energy spectra of bound systems.",
    seeAlso: ["hamiltonian", "wavefunction", "quantum-tunneling"],
  },
  {
    id: "pauli-exclusion-principle",
    term: "Pauli Exclusion Principle",
    category: "Quantum Theory",
    formula: "\\psi(x_1, x_2) = -\\psi(x_2, x_1)",
    formulaLabel: "Fermionic antisymmetry",
    definition:
      "No two identical fermions can occupy the same quantum state, because their joint wavefunction changes sign under exchange — as formulated by Wolfgang Pauli in 1925. This rule underlies the periodic table, the structure of white dwarfs, and the stability of matter.",
    seeAlso: ["wavefunction", "schrodinger-equation"],
  },
  {
    id: "quantum-tunneling",
    term: "Quantum Tunneling",
    category: "Quantum Theory",
    formula: "T \\approx e^{-2\\kappa a}, \\qquad \\kappa = \\frac{\\sqrt{2m (V_0 - E)}}{\\hbar}",
    formulaLabel: "Wide-barrier (WKB) limit",
    definition:
      "A particle can traverse a potential barrier taller than its own energy, because its wavefunction decays inside the barrier rather than vanishing. The transmission probability falls exponentially with barrier width — the mechanism behind alpha decay and scanning tunneling microscopy.",
    seeAlso: ["schrodinger-equation", "wavefunction"],
  },

  // ------------------------------------------------------------------
  // Statistical & Thermal
  // ------------------------------------------------------------------
  {
    id: "entropy",
    term: "Entropy",
    category: "Statistical & Thermal",
    formula: "S = k_B \\ln W",
    formulaLabel: "Boltzmann's grave",
    definition:
      "In Boltzmann's formulation, the logarithm of the number W of microscopic arrangements consistent with a macrostate. It quantifies irreversibility, sets the arrow of time, and measures the energy unavailable for work.",
    seeAlso: ["boltzmann-constant", "canonical-ensemble"],
  },
  {
    id: "boltzmann-constant",
    term: "Boltzmann Constant",
    category: "Statistical & Thermal",
    formula: "k_B = 1.380\\,649 \\times 10^{-23}\\ \\mathrm{J\\,K^{-1}}",
    formulaLabel: "Exact SI value",
    definition:
      "The proportionality between temperature and thermal energy per degree of freedom, engraved on Ludwig Boltzmann's gravestone as S = k log W. Since the 2019 revision of the SI it has the exact value shown, fixing the definition of the kelvin.",
    seeAlso: ["entropy", "canonical-ensemble"],
  },
  {
    id: "canonical-ensemble",
    term: "Canonical Ensemble",
    category: "Statistical & Thermal",
    formula: "P_i = \\frac{e^{-E_i / k_B T}}{Z}, \\quad Z = \\sum_i e^{-E_i / k_B T}",
    formulaLabel: "Boltzmann weight · partition function",
    definition:
      "The equilibrium statistics of a system in thermal contact with a large heat bath at temperature T: microstates occur with probability proportional to the Boltzmann factor exp(−E/k_BT). The normalizing sum Z, the partition function, encodes all thermodynamic quantities.",
    seeAlso: ["entropy", "boltzmann-constant"],
  },

  // ------------------------------------------------------------------
  // Fields & Particles
  // ------------------------------------------------------------------
  {
    id: "electromagnetic-field-tensor",
    term: "Electromagnetic Field Tensor",
    category: "Fields & Particles",
    formula: "F_{\\mu\\nu} = \\partial_\\mu A_\\nu - \\partial_\\nu A_\\mu",
    formulaLabel: "From the 4-potential",
    definition:
      "The antisymmetric rank-2 tensor that gathers the electric and magnetic fields into a single spacetime object, built from the four-potential A. Written this way, Maxwell's four equations compress into two compact tensor equations.",
    seeAlso: ["gauge-symmetry", "tensor"],
  },
  {
    id: "gauge-symmetry",
    term: "Gauge Symmetry",
    category: "Fields & Particles",
    formula: "A_\\mu \\to A_\\mu + \\partial_\\mu \\lambda",
    formulaLabel: "U(1) transformation",
    definition:
      "A redundancy in the description of a field theory: shifting the four-potential by a gradient leaves the physical fields unchanged. Requiring such a symmetry to hold locally, with λ varying in spacetime, is what generates interacting gauge fields — the backbone of the Standard Model.",
    seeAlso: ["electromagnetic-field-tensor", "noether-theorem"],
  },
  {
    id: "renormalization",
    term: "Renormalization",
    category: "Fields & Particles",
    formula: "\\beta(g) = \\mu\\, \\frac{\\partial g}{\\partial \\mu}",
    formulaLabel: "Beta function",
    definition:
      "The framework that absorbs the divergences of quantum field theory into a finite number of measured parameters, such as charge and mass. Its flow equations describe how those couplings run with the energy scale of the probe.",
    seeAlso: ["gauge-symmetry", "electromagnetic-field-tensor"],
  },

  // ------------------------------------------------------------------
  // Mathematics
  // ------------------------------------------------------------------
  {
    id: "tensor",
    term: "Tensor",
    category: "Mathematics",
    formula:
      "T'^{\\mu\\nu} = \\frac{\\partial x'^{\\mu}}{\\partial x^{\\alpha}}\\, \\frac{\\partial x'^{\\nu}}{\\partial x^{\\beta}}\\, T^{\\alpha\\beta}",
    formulaLabel: "Rank-2 transformation law",
    definition:
      "A geometric quantity whose components transform in a prescribed linear way under changes of coordinates, so that it describes the underlying space rather than any particular chart. Vectors, the metric, and the curvature of spacetime are all tensors.",
    seeAlso: ["metric-tensor", "electromagnetic-field-tensor"],
  },

  // ------------------------------------------------------------------
  // Cosmology
  // ------------------------------------------------------------------
  {
    id: "cosmological-constant",
    term: "Cosmological Constant",
    category: "Cosmology",
    formula: "\\varepsilon_{\\Lambda} = \\frac{\\Lambda c^{4}}{8\\pi G}",
    formulaLabel: "Vacuum energy density",
    definition:
      "A constant term Λ that general covariance permits in the Einstein equations, acting as a uniform vacuum energy of density Λc⁴/8πG and negative pressure. Observations of the accelerating expansion of the universe since 1998 find it small but positive — the simplest reading of dark energy.",
    seeAlso: ["einstein-field-equations", "hubble-parameter"],
  },
  {
    id: "hubble-parameter",
    term: "Hubble Parameter",
    category: "Cosmology",
    formula: "H(t) = \\frac{\\dot{a}(t)}{a(t)}",
    formulaLabel: "Friedmann expansion",
    definition:
      "The fractional rate of expansion of the universe: the time derivative of the scale factor divided by the scale factor itself. Its present-day value H₀ sets the scale of cosmic distances, and its history encodes the universe's energy budget.",
    seeAlso: ["cosmological-constant", "einstein-field-equations"],
  },
];
