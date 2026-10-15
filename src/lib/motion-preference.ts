"use client";

/**
 * MOTION PREFERENCE — "calm the universe".
 * A site-level motion preference that layers on top of the OS-level
 * prefers-reduced-motion: an explicit visitor choice always wins,
 * otherwise the media query is the default. React reads it through
 * useSyncExternalStore; canvas components read getMotionReduced()
 * and subscribe to changes via subscribeMotion().
 */

const STORAGE_KEY = "phys:motion-reduced";
export const MOTION_EVENT = "phys:motion";

let cached: boolean | null = null;

function compute(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    // storage unavailable — fall through to the OS preference
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Current effective preference (site override, else OS default). */
export function getMotionReduced(): boolean {
  if (cached === null) cached = compute();
  return cached;
}

/** Explicitly set the preference (persists; notifies subscribers). */
export function setMotionReduced(next: boolean): void {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // ignore — the choice still applies for this session
  }
  window.dispatchEvent(new CustomEvent<boolean>(MOTION_EVENT, { detail: next }));
}

/** True once the visitor has made an explicit site-level choice. */
export function hasExplicitMotionChoice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * useSyncExternalStore subscription. Listens for explicit site changes
 * and — only while no explicit choice exists — OS-level changes.
 */
export function subscribeMotion(cb: () => void): () => void {
  const invalidate = () => {
    cached = null;
    cb();
  };
  const onSite = () => invalidate();
  const onOs = () => {
    if (!hasExplicitMotionChoice()) invalidate();
  };
  window.addEventListener(MOTION_EVENT, onSite);
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onOs);
  return () => {
    window.removeEventListener(MOTION_EVENT, onSite);
    mq.removeEventListener("change", onOs);
  };
}
