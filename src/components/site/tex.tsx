import katex from "katex";
import { cn } from "@/lib/utils";

/**
 * KaTeX renderer.
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
  // Split into display blocks first, then inline math
  const displayParts = text.split(/(\$\$[^$]+\$\$)/g);

  return (
    <span className={className}>
      {displayParts.map((part, i) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          return <Tex key={i} math={part.slice(2, -2)} display ariaLabel="display equation" />;
        }
        return <InlineMath key={i} text={part} />;
      })}
    </span>
  );
}

function InlineMath({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return <Tex key={i} math={part.slice(1, -1)} ariaLabel="inline math" />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
