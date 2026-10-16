/**
 * In-memory sliding-window rate limiter.
 *
 * Deliberately local (single-process): the site's deployment story is a
 * single Node/Bun server, so a Map is honest infrastructure, not a
 * shortcut. Two hardening details matter:
 *
 * 1. Stale keys are swept whenever the map grows past a sane ceiling, so
 *    a botnet spraying unique IPs cannot grow memory without bound.
 * 2. The limiter is per-construct, so each route keeps its own budget
 *    (contact ≠ ask ≠ ask-research).
 */

export type RateLimiter = (key: string) => boolean;

const SWEEP_THRESHOLD = 256;

export function createRateLimiter({
  windowMs,
  max,
}: {
  windowMs: number;
  max: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();

  function sweep(now: number) {
    for (const [key, timestamps] of hits) {
      if (timestamps.every((t) => now - t >= windowMs)) {
        hits.delete(key);
      }
    }
  }

  return function limited(key: string): boolean {
    const now = Date.now();
    if (hits.size > SWEEP_THRESHOLD) sweep(now);

    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    return false;
  };
}
