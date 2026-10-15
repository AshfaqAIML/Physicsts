/**
 * SCIENTIFIC NOTEBOOK
 * ------------------------------------------------------------------
 * Notes are either full articles (rendered in the reading view)
 * or clearly-marked planned topics. The one full essay below is an
 * EXAMPLE — replace it with your own writing; every factual claim
 * and reference in it is checkable.
 */

export type NoteCategory =
  | "Physics Explained"
  | "Mathematical Intuition"
  | "Thought Experiments"
  | "Scientific History"
  | "Open Questions"
  | "Reading Notes"
  | "Research Journal";

export const noteCategories: NoteCategory[] = [
  "Physics Explained",
  "Mathematical Intuition",
  "Thought Experiments",
  "Scientific History",
  "Open Questions",
  "Reading Notes",
  "Research Journal",
];

export type EssaySection = {
  id: string;
  heading: string;
  /** Paragraphs support inline math between $ … $ */
  paragraphs: string[];
};

export type Essay = {
  title: string;
  dek: string;
  date: string;
  readingMinutes: number;
  sections: EssaySection[];
  references: string[];
};

export type Note = {
  id: string;
  title: string;
  category: NoteCategory;
  excerpt: string;
  status: "example" | "planned";
  readingMinutes?: number;
  essay?: Essay;
};

/* ------------------------------------------------------------------ */
/* The example essay                                                    */
/* ------------------------------------------------------------------ */

const curvatureEssay: Essay = {
  title: "What Does It Mean for Spacetime to Be Curved?",
  dek: "The most quoted and least understood phrase in physics, taken apart gently — from triangles on a sphere to the geometry of falling.",
  date: "Example draft",
  readingMinutes: 7,
  sections: [
    {
      id: "intuition-problem",
      heading: "1 · The intuition problem",
      paragraphs: [
        "Curved spacetime is the most quoted phrase in physics and the least understood. The difficulty is the word itself. Our intuition for curvature is borrowed from surfaces we can hold — ribbons, spheres, saddles — things that curve by bending inside a larger space. The mind naturally asks: if spacetime is curved, what is it curving into?",
        "The honest answer is: nothing, and it does not need to. Mathematical curvature is intrinsic. A surface's curvature is measurable by creatures who live on the surface, with no access to the space around it — a fact established by Gauss, who called it the theorema egregium, the remarkable theorem. Spacetime, whatever else it is, is at least like that: its curvature is a fact about its own geometry, detectable from within.",
      ],
    },
    {
      id: "force-to-geometry",
      heading: "2 · From force to geometry",
      paragraphs: [
        "Newton's gravity is a force: invisible, instantaneous, acting across empty space for no stated reason. Einstein's starting point was an oddity in the experience of falling. An astronaut drifting in a spacecraft in free fall feels no gravity at all — not less gravity, none. A person falling off a roof (ignoring the air) would feel weightless for the whole descent. Free fall is indistinguishable from floating in empty space.",
        "This is the equivalence principle, and it suggests a radical bookkeeping change. If falling bodies feel no force, perhaps they experience no force — perhaps they are simply doing what straight, unforced motion looks like in a place where straightness itself is compromised. In flat geometry, parallel lines stay parallel; two dropped objects, released from rest at different heights, both fall toward the centre of the Earth and therefore drift slowly toward each other. In Newton's language, the Earth's gravity pulls them. In Einstein's, they are each travelling as straight a path as spacetime permits — and those paths converge because spacetime itself is not flat.",
      ],
    },
    {
      id: "what-curved-means",
      heading: "3 · What “curved” actually means",
      paragraphs: [
        "On a flat sheet, the interior angles of a triangle sum to exactly 180 degrees. On a sphere, they sum to more — $\\alpha + \\beta + \\gamma = \\pi + A/R^{2}$, where $A$ is the triangle's area and $R$ the sphere's radius. A surveyor with careful instruments can therefore discover they live on a sphere without ever leaving it. This is the sense in which geometry can be curved: distances and angles refuse to follow the flat rulebook.",
        "General relativity locates curvature in how free-fall paths — geodesics — behave relative to each other. Two nearby geodesics, initially parallel, accelerate toward or away from one another by an amount fixed by the curvature between them, expressed in the geodesic deviation equation $D^{2}\\xi^{\\mu}/D\\tau^{2} = -R^{\\mu}{}_{\\nu\\alpha\\beta}\\, u^{\\nu} \\xi^{\\alpha} u^{\\beta}$. Two apples falling side by side drift together; two light rays grazing the Sun converge. Nothing pulls them. The geometry is simply not flat.",
      ],
    },
    {
      id: "gravity-as-geometry",
      heading: "4 · Gravity as geometry",
      paragraphs: [
        "Einstein's field equations are the statement that this geometry is not a free-for-all: it is fixed, point by point, by the matter and energy present.",
        "$$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^{4}}\\, T_{\\mu\\nu}$$",
        "The left side is geometry — the curvature of spacetime. The right side is contents — energy and momentum. John Archibald Wheeler compressed it into a sentence: spacetime tells matter how to move; matter tells spacetime how to curve. When you drop an apple, the apple is not being tugged. It is following the straightest available path through a region whose straightness the Earth has already compromised.",
      ],
    },
    {
      id: "how-we-know",
      heading: "5 · How we know",
      paragraphs: [
        "This is not a mood — it is the most precisely tested physical framework we have. Light from distant stars bends around the Sun by the amount the geometry predicts, first measured by Eddington's 1919 eclipse expedition. Clocks at different heights tick at measurably different rates; the satellite clocks of GPS would drift by tens of microseconds a day without the correction. Mercury's orbit precesses, gravitational redshift is observed, and in 2015 the LIGO interferometers directly measured gravitational waves — ripples in the geometry itself, from two black holes merging more than a billion years ago. In 2019 the Event Horizon Telescope imaged the shadow of the black hole in galaxy M87.",
        "Each of these is a measurement of geometry. None is a metaphor.",
      ],
    },
    {
      id: "what-it-does-not-mean",
      heading: "6 · What it does not mean",
      paragraphs: [
        "Curvature does not mean spacetime is embedded in a higher-dimensional space. Embedding diagrams — the famous rubber sheet, or Flamm's paraboloid — are visual aids drawn in an invented outside dimension for our benefit. The rubber sheet, in particular, explains gravity by using gravity and so explains nothing; it is a picture of the mathematics, not the physics.",
        "And “curved spacetime” does not mean vague or mystical. The metric — the rule assigning intervals between events — is measurable, and its curvature is a computable property of it. That is the real content of the phrase: the distances between the events of the world do not obey flat geometry, and the deviation from flatness is gravity. Everything else is a drawing to help us grieve for Euclid.",
      ],
    },
  ],
  references: [
    "Einstein, A. (1916). “Die Grundlage der allgemeinen Relativitätstheorie.” Annalen der Physik, 49, 769–822.",
    "Misner, C. W., Thorne, K. S., & Wheeler, J. A. (1973). Gravitation. W. H. Freeman.",
    "Rindler, W. (2006). Relativity: Special, General, and Cosmological (2nd ed.). Oxford University Press.",
    "Will, C. M. (2014). “The Confrontation between General Relativity and Experiment.” Living Reviews in Relativity, 17, 4.",
    "Wheeler, J. A. (1990). A Journey into Gravity and Spacetime. Scientific American Library.",
  ],
};

/* ------------------------------------------------------------------ */
/* The notebook                                                         */
/* ------------------------------------------------------------------ */

export const notes: Note[] = [
  {
    id: "spacetime-curved",
    title: "What Does It Mean for Spacetime to Be Curved?",
    category: "Physics Explained",
    excerpt:
      "From triangles on a sphere to falling apples — what curvature of a four-dimensional geometry actually claims, and how we know it is true.",
    status: "example",
    readingMinutes: curvatureEssay.readingMinutes,
    essay: curvatureEssay,
  },
  {
    id: "speed-of-light",
    title: "Why Is the Speed of Light So Fundamental?",
    category: "Open Questions",
    excerpt: "Not why is it 299,792,458 m/s — but why is there a convertible speed at all, and what does that buy the universe?",
    status: "planned",
  },
  {
    id: "qm-tells-us",
    title: "What Quantum Mechanics Actually Tells Us",
    category: "Physics Explained",
    excerpt: "Separating the formalism from its interpretations: what the theory says, what it refuses to say, and what we smuggle in.",
    status: "planned",
  },
  {
    id: "math-describes-world",
    title: "How Mathematics Describes the Physical World",
    category: "Mathematical Intuition",
    excerpt: "Wigner's “unreasonable effectiveness” — is mathematics discovered, invented, or something stranger than both?",
    status: "planned",
  },
  {
    id: "black-holes-known-unknown",
    title: "What We Know — and Do Not Know — About Black Holes",
    category: "Open Questions",
    excerpt: "From the Schwarzschild radius to the information paradox: an honest inventory of the certainties and the open ledgers.",
    status: "planned",
  },
  {
    id: "double-pendulum",
    title: "The Double Pendulum: A First Encounter with Chaos",
    category: "Thought Experiments",
    excerpt: "Two rods, four variables, and the end of predictability — deterministic does not mean forecastable.",
    status: "planned",
  },
  {
    id: "eotvos",
    title: "Eötvös, Equivalence, and the Weight of Being Certain",
    category: "Scientific History",
    excerpt: "How a torsion balance turned an old philosophical hunch into the most precisely tested principle in physics.",
    status: "planned",
  },
  {
    id: "reading-landau",
    title: "Reading Notes: Landau & Lifshitz, Mechanics",
    category: "Reading Notes",
    excerpt: "Marginalia from the most compressed physics book ever written — what it teaches about economy in theory-building.",
    status: "planned",
  },
  {
    id: "journal-lensing-sim",
    title: "Research Journal: Building a Lensing Simulator",
    category: "Research Journal",
    excerpt: "Design notes from implementing ray-shooting through the thin-lens equation — the version running in this site's laboratory.",
    status: "planned",
  },
];
