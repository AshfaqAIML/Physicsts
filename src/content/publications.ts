/**
 * PUBLICATIONS
 * ------------------------------------------------------------------
 * CONTENT INTEGRITY: this portfolio fabricates nothing. There are
 * no publications to list yet, so the site shows an honest "in
 * progress" state. When real work exists, add typed entries here
 * with verified bibliographic data only.
 */

export type PublicationType =
  | "Journal article"
  | "Preprint"
  | "Conference paper"
  | "Poster"
  | "Thesis"
  | "Technical report"
  | "Essay";

export const publicationTypes: PublicationType[] = [
  "Journal article",
  "Preprint",
  "Conference paper",
  "Poster",
  "Thesis",
  "Technical report",
  "Essay",
];

export const publicationsEmptyState = {
  headline: "Research and writing in progress.",
  body: [
    "This section is reserved for verified work — journal articles, preprints, conference papers, posters, theses, technical reports, and essays.",
    "Nothing is listed until it exists. No entries, citations, or identifiers on this site are invented.",
  ],
  note: "Filters for type and year will activate once the first entry is added.",
} as const;
