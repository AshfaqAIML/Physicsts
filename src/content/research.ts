/**
 * RESEARCH INTERESTS
 * ------------------------------------------------------------------
 * A map of curiosity, not a claim of expertise. Each area is a
 * direction I read toward and think about — edit freely, delete
 * what does not resonate, and add what does.
 */

export type ReadingItem = {
  title: string;
  author: string;
  note: string;
};

export type ResearchArea = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  equation: string;
  equationLabel: string;
  summary: string;
  detail: string;
  /** What is settled, verified science in this area — stated as such. */
  established: string;
  /** Honest open research questions — the frontier, not the textbook. */
  openQuestions: string[];
  concepts: string[];
  reading: ReadingItem[];
};

export const researchAreas: ResearchArea[] = [
  {
    id: "theoretical",
    index: "01",
    title: "Theoretical Physics",
    tagline: "The search for the deepest rules",
    equation: "\\delta S = 0, \\qquad S = \\int_{t_1}^{t_2} L\\, dt",
    equationLabel: "The principle of stationary action",
    summary:
      "Fundamental laws, mathematical formulations, and the architecture of physical theories — the project of explaining the most with the least.",
    detail:
      "Theoretical physics is the discipline of finding the smallest set of principles from which the largest portion of reality follows. What draws me in is the peculiar economy of it: Newton needed one law and an integral; Einstein needed a symmetry; Noether proved that every continuous symmetry of the action implies an exactly conserved quantity — time translation gives energy, space translation gives momentum, rotation gives angular momentum. I am interested in how theories are built, how they constrain one another, and what the next principle of this kind might look like.",
    established:
      "The Lagrangian and Hamiltonian frameworks, Noether's theorem (proved 1915, published 1918), and the derivation of Newtonian mechanics from stationary action are settled mathematics, and every domain where they apply has verified them.",
    openQuestions: [
      "Why does the action principle work at all — is it deep structure, or compressed bookkeeping?",
      "What organising idea, if any, generalises symmetry once quantum field theory is left behind?",
      "How do the symmetries of spacetime and those of quantum theory reconcile — diffeomorphism invariance against unitarity?",
    ],
    concepts: [
      "Lagrangian & Hamiltonian mechanics",
      "Symmetries & Noether's theorem",
      "Unification",
      "Effective field theory",
      "Emergence",
    ],
    reading: [
      {
        title: "The Theoretical Minimum",
        author: "Leonard Susskind & George Hrabovsky",
        note: "The honest starting line for serious self-study.",
      },
      {
        title: "The Character of Physical Law",
        author: "Richard Feynman",
        note: "On what a physical law is — and what makes one beautiful.",
      },
      {
        title: "The Road to Reality",
        author: "Roger Penrose",
        note: "A panoramic, demanding map of mathematical physics.",
      },
    ],
  },
  {
    id: "quantum",
    index: "02",
    title: "Quantum Mechanics",
    tagline: "The strange rulebook beneath everything",
    equation: "i\\hbar \\frac{\\partial}{\\partial t}\\, \\Psi(\\mathbf{x}, t) = \\hat{H}\\Psi(\\mathbf{x}, t)",
    equationLabel: "The Schrödinger equation",
    summary:
      "Quantum states, measurement, superposition — the most precisely confirmed and least understood theory in the history of science.",
    detail:
      "No quantitative framework in science has been confirmed more precisely: quantum electrodynamics, the theory's field-theoretic core, predicts the electron's magnetic moment to about a part in a trillion, and experiment agrees. And no framework has resisted intuition more stubbornly. I am fascinated by the foundations: what a quantum state actually is, what “measurement” does, and why the formalism keeps its silence on these questions while working flawlessly. Superposition, entanglement, and decoherence are, to me, the century's most important unfinished sentences.",
    established:
      "The mathematical formalism — Hilbert-space states, unitary evolution, the Born rule — is experimentally unimpeachable, and its applications (from semiconductor physics to MRI) are engineering fact. Decoherence is well understood and observed in the laboratory.",
    openQuestions: [
      "The measurement problem: what, physically, marks an event as a measurement?",
      "What, if anything, does a quantum state describe — and do the interpretations differ observably?",
      "How does a classical world of definite outcomes emerge from amplitudes that never choose?",
    ],
    concepts: [
      "Superposition & interference",
      "The measurement problem",
      "Entanglement",
      "Decoherence",
      "Interpretations",
    ],
    reading: [
      {
        title: "The Principles of Quantum Mechanics",
        author: "P. A. M. Dirac",
        note: "The book that taught physics to speak its modern language.",
      },
      {
        title: "Quantum Mechanics: The Theoretical Minimum",
        author: "Susskind & Friedman",
        note: "Clear, unflinching, and built for self-study.",
      },
      {
        title: "Introduction to Quantum Mechanics",
        author: "Griffiths & Schroeter",
        note: "The standard first rigorous pass.",
      },
    ],
  },
  {
    id: "relativity",
    index: "03",
    title: "Relativity & Gravitation",
    tagline: "Geometry in place of force",
    equation: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^{4}}\\, T_{\\mu\\nu}",
    equationLabel: "Einstein's field equations",
    summary:
      "Spacetime geometry, gravitational phenomena, and the nature of gravity — matter tells spacetime how to curve; spacetime tells matter how to move.",
    detail:
      "General relativity replaced a force with a curvature — one of the boldest moves in the history of thought. I study the geometric machinery: geodesics, curvature tensors, and the extraordinary leap by which gravity becomes the shape of space and time itself. Black holes and gravitational waves are where the theory stops being abstract and becomes audible, visible, and inescapable — and both are now observation: LIGO's first direct gravitational-wave detection (GW150914, 2015) and the Event Horizon Telescope's image of the shadow of M87* (2019).",
    established:
      "General relativity has passed every precision test to date: Mercury's perihelion advance (43 arcseconds per century beyond Newtonian perturbation), the 1919 light deflection (1.75 arcseconds at the Sun's limb), gravitational redshift and time dilation, frame dragging, and direct gravitational-wave detections by LIGO/Virgo.",
    openQuestions: [
      "What does the geometry do at a black hole's centre — and does the singularity signal the theory's end?",
      "How does a quantum theory of gravity recover the Einstein equations in its classical limit?",
      "Is the cosmological constant truly constant — and why is it so small?",
    ],
    concepts: [
      "Spacetime geometry",
      "The equivalence principle",
      "Geodesics",
      "Black holes",
      "Gravitational waves",
    ],
    reading: [
      {
        title: "Relativity: The Special and General Theory",
        author: "Albert Einstein",
        note: "The author's own popular exposition — a primary source.",
      },
      {
        title: "Spacetime Physics",
        author: "Taylor & Wheeler",
        note: "Special relativity taught geometrically, from first principles.",
      },
      {
        title: "Gravity: An Introduction to Einstein's General Relativity",
        author: "James B. Hartle",
        note: "Physics before formalism — the ideal bridge.",
      },
    ],
  },
  {
    id: "cosmology",
    index: "04",
    title: "Cosmology & Astrophysics",
    tagline: "The universe as a single object",
    equation: "\\left(\\frac{\\dot{a}}{a}\\right)^{2} = \\frac{8\\pi G}{3}\\,\\rho - \\frac{k c^{2}}{a^{2}} + \\frac{\\Lambda c^{2}}{3}",
    equationLabel: "The first Friedmann equation (with Λ)",
    summary:
      "The origin, evolution, and large-scale structure of the universe — a subject in which the observer is embedded in the experiment.",
    detail:
      "Cosmology asks the only questions that are literally universal: where did this come from, and where is it going? I follow the evidence — the expanding universe, the cosmic microwave background, the nucleosynthesis of the light elements — and the honest mysteries that come with it: dark matter, dark energy, and the striking fine-tuning of the constants that permit structure at all.",
    established:
      "The expansion of the universe, the cosmic microwave background (a 2.725 K blackbody uniform to one part in a hundred thousand), and big-bang nucleosynthesis's account of the light elements are settled observation. Within the ΛCDM model the universe is 13.8 billion years old to within about half a per cent.",
    openQuestions: [
      "What is dark matter — an undetected particle, or a sign that gravity needs revision at low accelerations?",
      "What is dark energy — a true cosmological constant, or something that evolves with time?",
      "What set the initial conditions that inflation is invoked to explain — and can inflation's own be explained?",
    ],
    concepts: [
      "The expanding universe",
      "The cosmic microwave background",
      "Inflation",
      "Dark matter & dark energy",
      "Large-scale structure",
    ],
    reading: [
      {
        title: "Introduction to Cosmology",
        author: "Barbara Ryden",
        note: "The clearest modern entrance to the subject.",
      },
      {
        title: "The First Three Minutes",
        author: "Steven Weinberg",
        note: "A classic account of the early universe.",
      },
      {
        title: "The Cosmic Perspective",
        author: "Bennett, Donahue, Schneider & Voit",
        note: "Astronomy's big picture, taught humanely.",
      },
    ],
  },
  {
    id: "particles",
    index: "05",
    title: "Particle Physics",
    tagline: "Matter's smallest grammar",
    equation: "\\mathcal{L}_{\\text{QED}} = -\\tfrac{1}{4} F_{\\mu\\nu} F^{\\mu\\nu} + \\bar{\\psi}\\,(i\\gamma^{\\mu} D_{\\mu} - m)\\,\\psi",
    equationLabel: "The QED Lagrangian",
    summary:
      "Fundamental particles, interactions, and the structure of matter — nature reduced to fields, symmetries, and a short list of constants.",
    detail:
      "The Standard Model is an unfinished cathedral: staggeringly successful where tested, and silent about gravity, dark matter, and why the parameters are what they are. I want to understand how gauge symmetry builds the interactions, how the Higgs mechanism lends mass, and where the cracks are — because every crack in physics has historically been a door.",
    established:
      "The Standard Model's gauge structure SU(3) × SU(2) × U(1) is established, and the Higgs boson it requires was observed at CERN in 2012 with a mass of about 125 GeV. Neutrino oscillations — and therefore neutrino masses — are laboratory-established physics beyond the model's original form.",
    openQuestions: [
      "Why three generations of matter, and why the particular hierarchy of masses?",
      "What is the mechanism behind neutrino masses — Dirac or Majorana?",
      "What, if anything, resolves the hierarchy problem — or must the cosmos simply be fine-tuned?",
    ],
    concepts: [
      "The Standard Model",
      "Gauge symmetry",
      "The Higgs mechanism",
      "Quantum field theory",
      "Beyond the Standard Model",
    ],
    reading: [
      {
        title: "Introduction to Elementary Particles",
        author: "David J. Griffiths",
        note: "Rigorous, readable, and honest about what is assumed.",
      },
      {
        title: "The Particle at the End of the Universe",
        author: "Sean Carroll",
        note: "The Higgs search, told with context.",
      },
      {
        title: "QED: The Strange Theory of Light and Matter",
        author: "Richard Feynman",
        note: "Quantum electrodynamics for the persistent lay mind.",
      },
    ],
  },
  {
    id: "mathematical",
    index: "06",
    title: "Mathematical Physics",
    tagline: "The machinery beneath the physics",
    equation: "Q = \\sum_i \\frac{\\partial L}{\\partial \\dot{q}_i}\\,\\delta q_i, \\qquad \\frac{dQ}{dt} = 0",
    equationLabel: "Noether's theorem — a continuous symmetry implies a conserved charge",
    summary:
      "The mathematical frameworks used to formulate and investigate physical theories — the language in which nature seems to be written.",
    detail:
      "Every major revolution in physics has arrived on the back of a new piece of mathematics: calculus for mechanics, geometry for gravitation, group theory for particles. I study the machinery itself — differential geometry, complex analysis, group theory, and the theory of differential equations — both for its beauty and because it is usually where the next physics is hiding.",
    established:
      "The machinery — differential geometry, Lie theory, functional analysis — is established mathematics, and its physical application runs from Noether's theorem to the gauge theories of the Standard Model.",
    openQuestions: [
      "The Yang–Mills existence and mass-gap problem — making quantum field theory mathematically rigorous in four dimensions — is still an open Millennium Prize problem.",
      "Why does abstract mathematics so often anticipate physics it was not built for?",
      "Can quantum gravity be phrased in the mathematics we already have, or does it need mathematics not yet invented?",
    ],
    concepts: [
      "Differential geometry",
      "Lie groups & algebras",
      "Complex analysis",
      "Partial differential equations",
      "Topology in physics",
    ],
    reading: [
      {
        title: "Mathematical Methods in the Physical Sciences",
        author: "Mary L. Boas",
        note: "The Swiss-army knife — start here.",
      },
      {
        title: "Geometry, Topology and Physics",
        author: "Mikio Nakahara",
        note: "Where modern physics gets its geometry.",
      },
      {
        title: "Visual Complex Analysis",
        author: "Tristan Needham",
        note: "Mathematics you can see before you prove.",
      },
    ],
  },
];
