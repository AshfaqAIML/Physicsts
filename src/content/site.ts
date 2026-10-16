/**
 * SITE CONFIGURATION
 * ------------------------------------------------------------------
 * The single place to edit your identity, navigation, and contact
 * channels. Placeholder values are clearly marked — replace them
 * with your real details and they will propagate through the site.
 */

export const site = {
  /** Replace with your name — e.g. "Ada Lovelace" */
  name: "Your Name" as string,
  /** Short wordmark shown in the navigation */
  wordmark: "The Physicist",
  /** Role descriptor — adjust honestly to your situation */
  role: "Physics Enthusiast · Scientific Thinker",
  motto: "Exploring the Universe, One Fundamental Question at a Time.",
  /** Canonical URL — used for SEO metadata */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  /** Poetic coordinates of the Orion Nebula (M42) — a motif, not a location claim */
  observatoryNote: "M42 · RA 05h 35m 17s · DEC −05° 23′ 28″",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Notes", href: "#notes" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
];

export type ContactChannel = {
  id: string;
  label: string;
  /** Real URL once it exists. `null` renders an honest "to be added" state. */
  href: string | null;
  hint: string;
};

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    // PLACEHOLDER — replace with your real address
    href: null,
    hint: "your.email@example.com",
  },
  {
    id: "github",
    label: "GitHub",
    href: null,
    hint: "github.com/your-handle",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: null,
    hint: "linkedin.com/in/your-handle",
  },
  {
    id: "scholar",
    label: "Google Scholar",
    href: null,
    hint: "Added once there are verified papers to list",
  },
  {
    id: "orcid",
    label: "ORCID",
    href: null,
    hint: "Added once you register an iD",
  },
];

export const subjects = [
  "Collaboration enquiry",
  "Question about physics",
  "Discussion or feedback",
  "Other",
] as const;

/* ------------------------------------------------------------------
 * THIS MONTH IN PHYSICS HISTORY — twelve real, verifiable moments,
 * one per month. Dates follow the historical record; where an event
 * spans dates (conferences, eclipses) the opening day is used.
 * ------------------------------------------------------------------ */
export type PhysicsMoment = {
  /** 0-indexed month this entry represents */
  month: number;
  /** Short display date, e.g. "29 May 1919" */
  date: string;
  /** One-sentence description — factual, no embellishment */
  event: string;
};

export const physicsHistory: PhysicsMoment[] = [
  {
    month: 0,
    date: "7 January 1610",
    event:
      "Galileo Galilei points his telescope at Jupiter and records three faint stars — the Medicean moons, the first new worlds ever seen.",
  },
  {
    month: 1,
    date: "27 February 1932",
    event:
      "James Chadwick's Nature letter “Possible Existence of a Neutron” is published — a new particle quietly unlocks the atomic nucleus.",
  },
  {
    month: 2,
    date: "14 March 1879",
    event:
      "Albert Einstein is born in Ulm — the future author of special and general relativity, and this site's favourite equation.",
  },
  {
    month: 3,
    date: "26 April 1920",
    event:
      "The Great Debate between Harlow Shapley and Heber Curtis argues the scale of the Universe — is the Milky Way everything?",
  },
  {
    month: 4,
    date: "29 May 1919",
    event:
      "Eddington's eclipse expedition photographs starlight bending near the Sun's limb — Newton's absolute space yields to curved spacetime.",
  },
  {
    month: 5,
    date: "30 June 1905",
    event:
      "Einstein submits “Zur Elektrodynamik bewegter Körper” — special relativity arrives, and simultaneity is never absolute again.",
  },
  {
    month: 6,
    date: "4 July 2012",
    event:
      "CERN announces the observation of a Higgs-like boson — a field proposed in 1964 finally shows its face at 125 GeV.",
  },
  {
    month: 7,
    date: "29 August 1831",
    event:
      "Michael Faraday's notebook records the first successful electromagnetic induction — magnets and wires begin to make electricity move.",
  },
  {
    month: 8,
    date: "27 September 1905",
    event:
      "Einstein's three-page paper asks whether a body's inertia depends on its energy — and derives E = mc².",
  },
  {
    month: 9,
    date: "24 October 1927",
    event:
      "The fifth Solvay Conference gathers Einstein, Bohr, Curie, Heisenberg, and Schrödinger — quantum mechanics' founding generation in one photograph.",
  },
  {
    month: 10,
    date: "25 November 1915",
    event:
      "Einstein presents the final field equations of general relativity to the Prussian Academy — geometry becomes gravity.",
  },
  {
    month: 11,
    date: "14 December 1900",
    event:
      "Max Planck presents his quantum of action to the German Physical Society — physics divides into before and after.",
  },
];
