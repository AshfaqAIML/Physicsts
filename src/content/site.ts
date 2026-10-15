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
