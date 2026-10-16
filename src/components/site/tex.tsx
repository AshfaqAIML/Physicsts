import katex from "katex";
import { splitMath } from "@/lib/math-text";
import { cn } from "@/lib/utils";

/**
 * SERVER-SIDE KaTeX renderer.
 *
 * ⚠️ SERVER COMPONENT ONLY — never import this module from a file marked
 * "use client": doing so ships KaTeX (~280 KB minified) to the browser.
 * All static mathematics on the site is rendered through <Tex>/<Prose> in
 * server components and passed down as ready-made React nodes; the only
 * client-side typesetting is the AI companions' runtime-generated answers
 * (src/components/site/assistant-prose.tsx), which loads KaTeX on demand.
 *
 * - <Tex> renders one expression.
 * - <Prose> renders a paragraph string with inline $ … $ math
 *   and standalone $$ … $$ display blocks.
 */

function render(math: string, display: boolean): string {
  return katex.renderToString(math, {
    displayMode: display,
    throwOnError: false,
    strict: false,
    trust: false,
    output: "html",
  });
}

export function Tex({
  math,
  display = false,
  className,
  ariaLabel,
}: {
  math: string;
  display?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <span
      role="math"
      aria-label={ariaLabel ?? math}
      className={cn(display ? "block" : "inline-block", className)}
      dangerouslySetInnerHTML={{ __html: render(math, display) }}
    />
  );
}

/**
 * Renders a string containing inline $math$ and display $$math$$
 * as typeset prose. Text outside math is rendered as plain text.
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {splitMath(text).map((segment, i) => {
        if (segment.kind === "display") {
          return <Tex key={i} math={segment.value} display ariaLabel="display equation" />;
        }
        if (segment.kind === "inline") {
          return <Tex key={i} math={segment.value} ariaLabel="inline math" />;
        }
        return <span key={i}>{segment.value}</span>;
      })}
    </span>
  );
}
