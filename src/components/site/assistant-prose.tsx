"use client";

import { useEffect, useState } from "react";
import { splitMath } from "@/lib/math-text";

/**
 * CLIENT-SIDE math for the AI companions' answers — the only runtime-
 * dynamic mathematics on the site. The assistant's replies arrive as
 * plain text with $…$ / $$…$$ LaTeX, so their typesetting cannot be
 * pre-rendered. KaTeX is therefore loaded ON DEMAND, in its own lazy
 * chunk, the first time an answer actually contains mathematics —
 * visitors who never open a companion never download a byte of it.
 */

let katexLoader: Promise<typeof import("katex")> | null = null;
function loadKatex() {
  katexLoader ??= import("katex");
  return katexLoader;
}

function AssistantMath({
  math,
  display,
  label,
}: {
  math: string;
  display: boolean;
  label: string;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadKatex()
      .then((katex) => {
        const rendered = katex.default.renderToString(math, {
          displayMode: display,
          throwOnError: false,
          strict: false,
          trust: false,
          output: "html",
        });
        if (!cancelled) setHtml(rendered);
      })
      .catch(() => {
        // Offline or blocked — the honest raw source stays below.
      });
    return () => {
      cancelled = true;
    };
  }, [math, display]);

  if (html === null) {
    // Transient state while the math engine loads (once per visitor,
    // then cached): the raw source, quietly styled, still labelled.
    return (
      <span
        role="math"
        aria-label={label}
        className="font-mono text-[0.92em] text-muted-foreground"
      >
        {`$${math}$`}
      </span>
    );
  }
  return (
    <span role="math" aria-label={label} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/**
 * The client-side counterpart of the server's <Prose>: same segmentation
 * contract (src/lib/math-text), KaTeX loaded lazily instead of bundled.
 */
export function AssistantProse({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {splitMath(text).map((segment, i) => {
        if (segment.kind === "text") {
          return <span key={i}>{segment.value}</span>;
        }
        return (
          <AssistantMath
            key={i}
            math={segment.value}
            display={segment.kind === "display"}
            label={segment.kind === "display" ? "display equation" : "inline math"}
          />
        );
      })}
    </span>
  );
}
