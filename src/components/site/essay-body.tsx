import { ArrowUpRight } from "lucide-react";
import { Prose } from "@/components/site/tex";
import type { Note } from "@/content/notes";
import { cn } from "@/lib/utils";

/**
 * ESSAY BODY — server-rendered essay content for the notebook's reading
 * view. The sections, mathematics, references, and further reading are
 * static prose, so they are typeset on the server and passed into the
 * (client) notebook as a ready-made React node: KaTeX stays out of the
 * client bundle, and the interactive parts of the reading view (progress,
 * quote chip, companion, hand-off) remain the only client payload.
 */
export function EssayBody({ note }: { note: Note }) {
  const essay = note.essay!;

  return (
    <>
      {essay.sections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={cn("scroll-mt-24", i > 0 && "mt-12", i === 0 && "first:mt-0")}
          aria-labelledby={`${s.id}-h`}
        >
          <h2
            id={`${s.id}-h`}
            className="font-serif text-xl leading-snug text-foreground sm:text-2xl"
          >
            {s.heading}
          </h2>
          <div className="mt-5 space-y-5">
            {s.paragraphs.map((p, j) => (
              <p
                key={j}
                className={cn(
                  "text-[1.05rem] leading-[1.85] text-muted-foreground",
                  i === 0 && j === 0 && "drop-cap text-foreground/90"
                )}
              >
                <Prose text={p} />
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* References — linked only where the record was verified */}
      <section className="mt-16 border-t border-border pt-8" aria-labelledby="refs-h">
        <h2 id="refs-h" className="meta-sm text-muted-foreground">
          References
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {essay.references.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs text-photon">[{i + 1}]</span>
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet inline-flex items-baseline gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {r.text}
                  <ArrowUpRight className="size-3 shrink-0 self-center text-muted-foreground/50" aria-hidden="true" />
                </a>
              ) : (
                <span>{r.text}</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Further reading — accessible next steps, all links verified */}
      {essay.furtherReading && essay.furtherReading.length > 0 && (
        <section className="mt-10" aria-labelledby="further-h">
          <h2 id="further-h" className="meta-sm text-muted-foreground">
            Further reading
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {essay.furtherReading.map((r) => (
              <li key={r.text} className="flex gap-3">
                <span aria-hidden="true" className="font-mono text-xs text-nebula">→</span>
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-quiet inline-flex items-baseline gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {r.text}
                    <ArrowUpRight className="size-3 shrink-0 self-center text-muted-foreground/50" aria-hidden="true" />
                  </a>
                ) : (
                  <span>{r.text}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
