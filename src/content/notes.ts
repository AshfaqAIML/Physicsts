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
/* The second example essay — the speed of light                       */
/* ------------------------------------------------------------------ */

const lightSpeedEssay: Essay = {
  title: "Why Is the Speed of Light So Fundamental?",
  dek: "Not why it equals 299,792,458 m/s — but why there is a speed woven into the geometry of cause and effect at all.",
  date: "Example draft",
  readingMinutes: 8,
  sections: [
    {
      id: "strange-postulate",
      heading: "1 · The strange postulate",
      paragraphs: [
        "In 1905 Albert Einstein opened his paper on what we now call special relativity with an assumption that sounds almost casual: light in vacuum propagates at a speed $c$ that is independent of the motion of its source. It sounds like a modest claim about light. It is not. It is a claim about the arena in which everything happens — a statement that space and time are so constituted that one particular speed is agreed upon by every observer who is not accelerating.",
        "Notice what the postulate does not say. It does not say light is special, and it does not say $c$ is the speed of light. It says there is a universal, invariant speed — a conversion factor between measuring rods and clocks — and that, as it happens, light travels at it. The distinction matters, and it is where most of the mystery dissolves.",
      ],
    },
    {
      id: "chasing-a-beam",
      heading: "2 · Chasing a beam of light",
      paragraphs: [
        "Einstein said he was sixteen when he first ran the thought experiment: if you could pursue a beam of light at $c$, you should see an electromagnetic field frozen in space — a stationary ripple. But James Clerk Maxwell's equations, the most solidly confirmed physics of the era, admit no such thing. A frozen wave is not a solution; the equations demand that electromagnetic fields propagate, always, at $c$.",
        "The collision between Galileo's old rule for combining speeds and Maxwell's new electrodynamics could not be patched. Galileo says a rider at speed $v$ beside a beam should measure the beam's speed as $c - v$. Maxwell says every observer measures $c$. Einstein's move was to trust neither the rider's space nor the rider's time as absolute — to let the measuring instruments themselves carry the correction.",
      ],
    },
    {
      id: "arithmetic-that-protects-c",
      heading: "3 · The arithmetic that protects c",
      paragraphs: [
        "The rule that replaces Galilean addition is one line of algebra. If something moves at speed $u'$ inside a frame that itself moves at $v$, the combined speed is not $u' + v$ but",
        "$$u = \\frac{u' + v}{1 + u'v/c^{2}}$$",
        "The denominator is the whole story. Try to stack speeds toward $c$ and the denominator grows exactly as fast as the numerator: set $u' = v = 0.99c$ and the result is $0.99995c$ — not $1.98c$. You can pass any speed below $c$, from any direction, and the answer stays below $c$. The constant is not a wall you can chip at; it is a boundary the arithmetic itself enforces.",
        "This is not a rule added to physics to protect the speed limit. It is a theorem that follows once simultaneity is allowed to be relative — once the synchronization of distant clocks is recognised as a convention with consequences rather than a fact of nature.",
      ],
    },
    {
      id: "c-is-not-about-light",
      heading: "4 · c is not about light",
      paragraphs: [
        "Strip the units away and special relativity is the statement that the interval between two events — $ds^{2} = -c^{2}dt^{2} + dx^{2} + dy^{2} + dz^{2}$ — is the same for every inertial observer, even though they disagree about the $t$'s and the $x$'s separately. In this geometry, $c$ is the exchange rate between the time axis and the space axes. It appears in the metric the way a conversion factor appears between miles and kilometres — except that here the two things being related are duration and distance, which we had always assumed were incommensurable.",
        "Light travels at $c$ for a reason that has nothing to do with light: photons are massless. Any massless particle — the gluon, the (hypothetical) graviton — must move at exactly $c$; any massive particle must move below it. The universal speed is a property of spacetime's causal structure, and massless things are simply the only things light enough to ride it exactly.",
        "This is why physicists increasingly call $c$ the speed of causality. It is the maximum speed at which influence — any influence — can propagate. The theory of relativity is more honestly the theory of the causal structure of the universe, with light as its most visible courier.",
      ],
    },
    {
      id: "price-of-the-last-decimal",
      heading: "5 · The price of the last decimal",
      paragraphs: [
        "Why can nothing be accelerated to $c$? Because the energy required diverges. The kinetic energy of a particle of mass $m$ at speed $v$ is $E_{k} = (\\gamma - 1)mc^{2}$, where $\\gamma = 1/\\sqrt{1 - v^{2}/c^{2}}$ grows without bound as $v$ approaches $c$. Every nine you add to the speed costs more energy than all the nines before it.",
        "Particle accelerators are the practical proof. The Large Electron–Positron collider pushed electrons to $0.9999999999987\\,c$ — and the electrons at LEP and the protons at the LHC differ in speed by less than a bicycle's pace, while differing in energy by factors of hundreds. The boundary is not merely respected; it is where the machine stops, no matter how hard it pushes.",
      ],
    },
    {
      id: "what-remains-open",
      heading: "6 · What remains open",
      paragraphs: [
        "One honest footnote: since 1983, the metre itself has been defined so that $c$ is exactly 299,792,458 of them per second. Asking why $c$ has that value is now a question about our units, not about nature — the deep question is why there is a finite invariant speed at all, rather than infinity, the value Newton's physics silently assumed. A universe with $c = \\infty$ would have absolute simultaneity, no magnetic fields as we know them, no relativity of any kind. A finite $c$ is the price of electromagnetism working — and it is a price the universe seems content to pay.",
        "What we do not have is a derivation of that structure from anything deeper. Quantum gravity, whatever it turns out to be, must reproduce an exact finite $c$ in its classical limit — and no candidate theory yet explains why the causal cone has the opening angle it does. That is an open question, and it is honest to leave it open.",
      ],
    },
  ],
  references: [
    "Einstein, A. (1905). “Zur Elektrodynamik bewegter Körper.” Annalen der Physik, 17, 891–921.",
    "Einstein, A. (1916). Relativity: The Special and General Theory. Methuen (English translation).",
    "Taylor, E. F., & Wheeler, J. A. (1992). Spacetime Physics (2nd ed.). W. H. Freeman.",
    "Mermin, N. D. (2005). It's About Time: Understanding Einstein's Relativity. Princeton University Press.",
    "Bureau International des Poids et Mesures (2019). The International System of Units (SI), 9th edition.",
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
    status: "example",
    readingMinutes: lightSpeedEssay.readingMinutes,
    essay: lightSpeedEssay,
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
