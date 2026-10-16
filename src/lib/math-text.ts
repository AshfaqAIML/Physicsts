/**
 * Math-source segmentation — the shared parsing contract between the
 * SERVER-side typesetter (src/components/site/tex.tsx) and the CLIENT-side
 * one (src/components/site/assistant-prose.tsx).
 *
 * Splits a paragraph string into text and math segments:
 *   - `$$ … $$` → display mathematics
 *   - `$ … $`   → inline mathematics
 *
 * Framework-free and katex-free on purpose: both sides import THIS module,
 * and only the side that actually needs KaTeX pulls it in. The regular
 * expressions mirror the original two-pass parser exactly, including its
 * deliberate tolerance (an unpaired `$` stays plain text; a captured
 * `$…$` span is always treated as math).
 */

export type MathSegment =
  | { kind: "text"; value: string }
  | { kind: "inline"; value: string }
  | { kind: "display"; value: string };

export function splitMath(text: string): MathSegment[] {
  const segments: MathSegment[] = [];
  // Display blocks first, then inline math inside the remainders.
  for (const part of text.split(/(\$\$[^$]+\$\$)/g)) {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      segments.push({ kind: "display", value: part.slice(2, -2) });
      continue;
    }
    for (const piece of part.split(/(\$[^$]+\$)/g)) {
      if (piece.startsWith("$") && piece.endsWith("$") && piece.length > 2) {
        segments.push({ kind: "inline", value: piece.slice(1, -1) });
      } else if (piece.length > 0) {
        segments.push({ kind: "text", value: piece });
      }
    }
  }
  return segments;
}
