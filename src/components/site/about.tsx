import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { Sparkles } from "lucide-react";

/** 16-px LQIP — generated from public/portrait.jpg (see README). */
const PORTRAIT_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDABQODxIPDRQSERIXFhQYHzMhHxwcHz8tLyUzSkFOTUlBSEZSXHZkUldvWEZIZoxob3p9hIWET2ORm4+AmnaBhH//2wBDARYXFx8bHzwhITx/VEhUf39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3//wAARCAAUABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCMxotuS+cY4CnBJx0qJdktsjLIJPl5IPP41larJuvCvZAo+nFRabIVvFwMK2UP5Uh3E1A/6dL9c/oKXS1BuST/AAqSPr0oopiP/9k=";

/**
 * ABOUT — an editorial spread: portrait plate on the left, the
 * person in words on the right, annotations in the margins.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative section-pad"
    >
      <div className="shell">
        <SectionHeading
          index="01"
          headingId="about-heading"
          eyebrow="About"
          title={profile.headline}
          lede="The person behind the questions — honestly rendered, credentials still being earned."
          meta="Personal account · 1 plate"
        />

        <div className="section-flow grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-20">
          {/* Portrait plate */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <figure className="group relative m-0">
              <div className="relative overflow-hidden rounded-lg border border-border">
                <Image
                  src="/portrait.jpg"
                  alt="Portrait plate — the site's author, photographed in a black suit against a studio backdrop"
                  width={864}
                  height={1080}
                  className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 60vw, 100vw"
                  placeholder="blur"
                  blurDataURL={PORTRAIT_BLUR}
                  priority={false}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between meta-sm text-muted-foreground">
                <span>Plate I · Portrait</span>
                <span>Studio plate · 4:5</span>
              </figcaption>
            </figure>

            {/* Marginalia — a quiet scientific annotation */}
            <p
              aria-hidden="true"
              className="mt-6 hidden meta-sm text-muted-foreground lg:block"
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
              <h3 className="meta-sm text-muted-foreground">
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
                        <span className="tag tag--dashed gap-1">
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
              <h3 className="meta-sm text-muted-foreground">
                The questions that keep me curious
              </h3>
              <ol className="mt-4 space-y-0 divide-y divide-border border-y border-border">
                {profile.drivingQuestions.map((q, i) => (
                  <li key={i} className="flex items-baseline gap-5 py-4">
                    <span className="meta-num text-photon">
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
              <h3 className="meta-sm text-muted-foreground">
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
