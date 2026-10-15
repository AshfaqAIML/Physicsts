"use client";

/**
 * SHAREABLE EXPERIMENT LINKS
 *
 * Every lab instrument can serialize its parameters into the page URL:
 *
 *     #experiment=orbits?m=0.2&f=0.75&a=1&t=1&preset=ellipse
 *
 * Opening such a link switches the lab to that instrument, restores the
 * parameters, and scrolls the visitor down to the bench. The format is
 * deliberately human-readable — a physicist should be able to read a
 * shared orbit off the URL the way they read an experiment off a logbook.
 *
 * The `preset` key is informational: the numeric parameters always drive
 * the restore, so a link keeps working even if a preset is later renamed.
 */

export type ExperimentTab = "lensing" | "orbits" | "wave";

/**
 * Callback each instrument uses to report its shareable state upward, so
 * the lab can serialise the whole room (not just the visible bench) into
 * a tour link. Reported whenever the state settles — never mid-gesture.
 */
export type BenchReporter = (
  params: Record<string, string | number | boolean>,
  preset: string | null
) => void;

/** Window event that carries a parsed spec down to the matching instrument. */
export const EXPERIMENT_EVENT = "phys:restore-experiment";

const PREFIX = "#experiment=";

export type ExperimentSpec = {
  tab: ExperimentTab;
  /** Name of the preset the shared state matched, for labels/toasts. */
  preset?: string;
  /** String-valued parameters (already decoded). */
  params: Record<string, string>;
};

/** Serialize instrument state into an #experiment= hash. */
export function buildExperimentHash(
  tab: ExperimentTab,
  params: Record<string, string | number | boolean>,
  preset?: string | null
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) qs.set(key, String(value));
  if (preset) qs.set("preset", preset);
  const query = qs.toString();
  return query ? `${PREFIX}${tab}?${query}` : `${PREFIX}${tab}`;
}

/** Parse a location.hash into a spec; null unless it is an experiment link. */
export function parseExperimentHash(hash: string): ExperimentSpec | null {
  if (!hash.startsWith(PREFIX)) return null;
  const body = hash.slice(PREFIX.length);
  const qAt = body.indexOf("?");
  const tab = qAt === -1 ? body : body.slice(0, qAt);
  if (tab !== "lensing" && tab !== "orbits" && tab !== "wave") return null;

  const params: Record<string, string> = {};
  const query = qAt === -1 ? "" : body.slice(qAt + 1);
  if (query) {
    new URLSearchParams(query).forEach((value, key) => {
      params[key] = value;
    });
  }
  const preset = params["preset"];
  delete params["preset"];
  return { tab, preset, params };
}

/** True when the address bar currently holds an experiment link. */
export function isExperimentHash(hash: string): boolean {
  return hash.startsWith(PREFIX);
}

/* ------------------------------------------------------------------ *
 * LAB TOUR LINKS
 *
 * A tour serialises every bench the sharer actually left a state on:
 *
 *     #lab-tour=lensing?e=72&d=stars|orbits?m=0.20&f=0.75|wave?E=0.30
 *
 * The first segment names the bench the tour starts on; the visitor
 * then hops between instruments (tabs or arrow keys) and each bench
 * is restored as the sharer left it. A bench the sharer never touched
 * is simply absent — it stands at its defaults on arrival, which is
 * exactly what the sharer saw. Segments are joined with "|" and each
 * re-uses the single-experiment param format, so the two link species
 * stay one family.
 * ------------------------------------------------------------------ */

const TOUR_PREFIX = "#lab-tour=";
const TOUR_SEGMENT_SEP = "|";

/** A parsed lab-tour link: the benches to restore, in visit order. */
export type LabTourState = {
  /** Segments in visit order; [0] is the starting bench. */
  specs: ExperimentSpec[];
};

/** Serialize a whole lab tour into one #lab-tour= hash. */
export function buildLabTourHash(
  segments: Array<{
    tab: ExperimentTab;
    params: Record<string, string | number | boolean>;
    preset?: string | null;
  }>
): string {
  const parts = segments.map((s) => {
    const single = buildExperimentHash(s.tab, s.params, s.preset ?? undefined);
    return single.slice(PREFIX.length);
  });
  return TOUR_PREFIX + parts.join(TOUR_SEGMENT_SEP);
}

/** Parse a #lab-tour= hash; null unless it is a well-formed tour. */
export function parseLabTourHash(hash: string): LabTourState | null {
  if (!hash.startsWith(TOUR_PREFIX)) return null;
  const body = hash.slice(TOUR_PREFIX.length);
  if (!body) return null;
  const specs: ExperimentSpec[] = [];
  const seen = new Set<ExperimentTab>();
  for (const segment of body.split(TOUR_SEGMENT_SEP)) {
    // Re-use the single-experiment parser on a reconstructed hash so the
    // two formats can never drift apart.
    const spec = parseExperimentHash(`${PREFIX}${segment}`);
    if (!spec) continue; // a mangled segment is skipped, not fatal
    if (seen.has(spec.tab)) continue; // first state of a bench wins
    seen.add(spec.tab);
    specs.push(spec);
  }
  return specs.length > 0 ? { specs } : null;
}

/** True when the address bar holds a lab tour link. */
export function isLabTourHash(hash: string): boolean {
  return hash.startsWith(TOUR_PREFIX);
}

/**
 * Restore-side number parser: finite, clamped to the instrument's slider
 * range, falling back to the instrument's default when absent or invalid.
 * Links are untrusted input — nothing gets through unchecked.
 */
export function restoreNumber(
  params: Record<string, string>,
  key: string,
  min: number,
  max: number,
  fallback: number
): number {
  const raw = params[key];
  if (raw === undefined) return fallback;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

/** Boolean encoded as "1"/"0" (or any string — only "0" and "" are false). */
export function restoreFlag(
  params: Record<string, string>,
  key: string,
  fallback: boolean
): boolean {
  const raw = params[key];
  if (raw === undefined) return fallback;
  return raw !== "0" && raw !== "";
}
