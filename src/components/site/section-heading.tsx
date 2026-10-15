import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/**
 * Editorial section header — mono index, serif display, rule line.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
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
        <span aria-hidden="true" className="h-px w-8 bg-border" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-5 font-serif text-3xl leading-[1.08] tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
