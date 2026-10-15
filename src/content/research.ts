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
      "Theoretical physics is the discipline of finding the smallest set of principles from which the largest portion of reality follows. What draws me in is the peculiar economy of it: Newton needed one law and an integral; Einstein needed a symmetry; Noether showed that every conservation law is secretly a symmetry of nature. I am interested in how theories are built, how they constrain one another, and what the next principle of this kind might look like.",
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
      "No theory has passed more experimental tests, and none has resisted intuition more stubbornly. I am fascinated by the foundations: what a quantum state actually is, what “measurement” does, and why the formalism keeps its silence on these questions while working flawlessly. Superposition, entanglement, and decoherence are, to me, the century's most important unfinished sentences.",
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
      "General relativity replaced a force with a curvature — one of the boldest moves in the history of thought. I study the geometric machinery: geodesics, curvature tensors, and the extraordinary leap by which gravity becomes the shape of space and time itself. Black holes and gravitational waves are where the theory stops being abstract and becomes audible, visible, and inescapable.",
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
    equation: "\\left(\\frac{\\dot{a}}{a}\\right)^{2} = \\frac{8\\pi G}{3}\\rho - \\frac{k c^{2}}{a^{2}}",
    equationLabel: "The Friedmann equation",
    summary:
      "The origin, evolution, and large-scale structure of the universe — a subject in which the observer is embedded in the experiment.",
    detail:
      "Cosmology asks the only questions that are literally universal: where did this come from, and where is it going? I follow the evidence — the expanding universe, the cosmic microwave background, the nucleosynthesis of the light elements — and the honest mysteries that come with it: dark matter, dark energy, and the striking fine-tuning of the constants that permit structure at all.",
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
    equation: "\\nabla_{\\mu} T^{\\mu\\nu} = 0 \\quad \\Longleftrightarrow \\quad \\text{symmetry} \\to \\text{conservation}",
    equationLabel: "Conservation from symmetry",
    summary:
      "The mathematical frameworks used to formulate and investigate physical theories — the language in which nature seems to be written.",
    detail:
      "Every major revolution in physics has arrived on the back of a new piece of mathematics: calculus for mechanics, geometry for gravitation, group theory for particles. I study the machinery itself — differential geometry, complex analysis, group theory, and the theory of differential equations — both for its beauty and because it is usually where the next physics is hiding.",
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
