/**
 * MOTION TOKENS — the site's shared choreography vocabulary.
 *
 * One easing family, fixed durations, and the editorial stagger
 * cadence. Every effect is transform/opacity only: compositor-
 * friendly, no layout shifts, no repaint storms. Components consume
 * these tokens so the whole universe moves with a single accent.
 */

/** The site ease — a long ease-out that arrives softly and settles. */
export const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Masked reveals — typography rising out of its own line box. */
export const EASE_MASK = [0.16, 1, 0.3, 1] as const;

/** Durations, in seconds. */
export const DUR = {
  /** Micro feedback — ticks, icon nudges */
  micro: 0.24,
  /** Standard interface transition (hovers, chips) */
  base: 0.4,
  /** Scroll-reveal entrances */
  entrance: 0.9,
  /** Hero-grade cinematic entrances */
  cinematic: 1.05,
} as const;

/** The editorial stagger — the breath between sibling reveals. */
export const STAGGER = 0.12;

/** The shared whileInView viewport contract — reveal once, just
    before the element is fully on stage. */
export const VIEW_ONCE = { once: true, margin: "-72px" } as const;
