import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { Sparkles } from "lucide-react";

/**
 * ABOUT — an editorial spread: portrait plate on the left, the
 * person in words on the right, annotations in the margins.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="01"
          eyebrow="About"
          title={profile.headline}
          lede="The person behind the questions — honestly rendered, credentials still being earned."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-20">
          {/* Portrait plate */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <figure className="relative m-0">
              <div className="relative overflow-hidden rounded-lg border border-border">
                <Image
                  src="/portrait.jpg"
                  alt="Placeholder portrait — a figure beneath a night sky, to be replaced with a real photograph"
                  width={760}
                  height={950}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 60vw, 100vw"
                  priority={false}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Plate I · Portrait (placeholder)</span>
                <span>replace with your own</span>
              </figcaption>
            </figure>

            {/* Marginalia — a quiet scientific annotation */}
            <p
              aria-hidden="true"
              className="mt-6 hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/60 lg:block"
            >
              {site.observatoryNote}
            </p>
          </Reveal>

          {/* The words */}
          <div>
            <Reveal delay={0.05} className="space-y-6 text-base leading-[1.85] text-muted-foreground sm:text-lg">
              {profile.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "drop-cap text-foreground/90" : undefined}>
                  {p}
                </p>
              ))}
            </Reveal>

            {/* Facts — placeholders, honestly labelled */}
            <Reveal delay={0.1} className="mt-14">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Details
              </h3>
              <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
                {profile.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                    <dd className="flex items-center gap-2 text-sm text-foreground/90">
                      {fact.value}
                      {fact.placeholder && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                          <Sparkles className="size-2.5" aria-hidden="true" />
                          placeholder
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Driving questions */}
            <Reveal delay={0.15} className="mt-14">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                The questions that keep me curious
              </h3>
              <ol className="mt-4 space-y-0 divide-y divide-border border-y border-border">
                {profile.drivingQuestions.map((q, i) => (
                  <li key={i} className="flex items-baseline gap-5 py-4">
                    <span className="font-mono text-[11px] tabular-nums text-photon">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-lg leading-snug text-foreground/90 sm:text-xl">
                      {q}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Approach */}
            <Reveal delay={0.2} className="mt-14">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                How I work
              </h3>
              <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
                {profile.approach.map((a) => (
                  <div key={a.title} className="bg-card p-5 transition-colors hover:bg-accent/40">
                    <h4 className="font-serif text-lg text-foreground">{a.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
