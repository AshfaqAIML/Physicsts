import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * Editorial section header — mono index, serif display, rule line.
 * The optional `meta` prints a journal running-head: a flexible
 * hairline and a right-aligned micro caption on the eyebrow line,
 * so every spread carries the same folio furniture.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  meta,
  align = "left",
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  meta?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <div
        className={cn(
          "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground",
          align === "center" && "justify-center"
        )}
      >
        <span className="text-photon">{index}</span>
        <span aria-hidden="true" className="h-px w-8 shrink-0 bg-border" />
        <span className="min-w-0">{eyebrow}</span>
        {meta ? (
          <>
            <span
              aria-hidden="true"
              className="hidden h-px max-w-24 flex-1 bg-gradient-to-r from-border to-transparent lg:block"
            />
            <span className="hidden text-[9.5px] tracking-[0.22em] text-muted-foreground/55 lg:block">
              {meta}
            </span>
          </>
        ) : null}
      </div>
      <h2 className="mt-5 font-serif text-3xl leading-[1.08] tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
