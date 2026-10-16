import type { ReactNode } from "react";

import { AscendButton } from "@/components/site/ascend-button";
import { CommandPalette } from "@/components/site/command-palette";
import { ConstellationNav } from "@/components/site/constellation-nav";
import { DeepField } from "@/components/site/deep-field";
import { EssayBody } from "@/components/site/essay-body";
import { KeyboardHint } from "@/components/site/keyboard-hint";
import { Lexicon } from "@/components/site/lexicon";
import { ReadingProgress } from "@/components/site/reading-progress";
import { ShortcutsHelp } from "@/components/site/shortcuts-help";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { PhysicsLab } from "@/components/site/lab/lab";
import { buildLabMath } from "@/components/site/lab/lab-math";
import { Navigation } from "@/components/site/navigation";
import { Notebook } from "@/components/site/notebook";
import { Projects } from "@/components/site/projects";
import { Publications } from "@/components/site/publications";
import { ResearchInterests } from "@/components/site/research";
import { Tex } from "@/components/site/tex";
import { lexiconTerms } from "@/content/lexicon";
import { notes } from "@/content/notes";
import { projects } from "@/content/projects";
import { researchAreas } from "@/content/research";

/**
 * THE PHYSICIST — a single-page digital universe.
 * Home · About · Research · Projects · Publications · Notes · Lab · Contact
 *
 * This is a SERVER component: every static equation on the page is
 * typeset here (KaTeX runs on the server, never in the browser) and
 * handed to the interactive sections as ready-made React nodes. The
 * client bundle carries interactivity only.
 */

/* ---- Server-rendered mathematics, keyed by content id ---------------- */

const researchEquations: Record<string, ReactNode> = Object.fromEntries(
  researchAreas.map((area) => [
    area.id,
    <Tex key={area.id} math={area.equation} ariaLabel={area.equationLabel} />,
  ])
);

const researchPlates: Record<string, ReactNode> = Object.fromEntries(
  researchAreas.map((area) => [
    area.id,
    <Tex key={area.id} display math={area.equation} ariaLabel={area.equationLabel} />,
  ])
);

const projectEquations: Record<string, ReactNode> = Object.fromEntries(
  projects.map((p) => [
    p.id,
    <Tex key={p.id} math={p.equation} ariaLabel={p.equationLabel} />,
  ])
);

const projectPlates: Record<string, ReactNode> = Object.fromEntries(
  projects.map((p) => [
    p.id,
    <Tex key={p.id} display math={p.equation} ariaLabel={p.equationLabel} />,
  ])
);

const lexiconFormulas: Record<string, ReactNode> = Object.fromEntries(
  lexiconTerms
    .filter((term) => term.formula)
    .map((term) => [
      term.id,
      <Tex
        key={term.id}
        math={term.formula!}
        display
        ariaLabel={term.formulaLabel ?? term.term}
      />,
    ])
);

const essayBodies: Record<string, ReactNode> = {};
for (const note of notes) {
  if (note.essay) {
    essayBodies[note.id] = <EssayBody key={note.id} note={note} />;
  }
}

const labMath = buildLabMath();

const heroEquation = (
  <Tex
    display
    math="G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^{4}}\, T_{\mu\nu}"
    ariaLabel="Einstein's field equations: G mu nu plus Lambda g mu nu equals 8 pi G over c to the fourth, times T mu nu"
  />
);

/* ---- Structured data — facts only, nothing invented ------------------ */

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Physicist",
  description:
    "A personal portfolio of a physics enthusiast and scientific thinker: research interests, scientific projects, notes, and an interactive physics laboratory exploring spacetime, quantum mechanics, and the cosmos.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  inLanguage: "en",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <DeepField />
      <ReadingProgress />
      <Navigation />
      <ConstellationNav />
      <AscendButton />
      <CommandPalette />
      <Lexicon formulas={lexiconFormulas} />
      <ShortcutsHelp />
      <KeyboardHint />

      <main className="flex-1">
        {/* Print masthead — the archival copy introduces itself properly.
            Screen visitors never see it; paper always does. */}
        <div data-print="only" className="hidden border-b border-black/70 pb-3">
          <p className="font-serif text-2xl leading-tight text-black">
            The Physicist — Portfolio
          </p>
          <p className="mt-1 meta-sm text-black/70">
            Physics · Mathematics · The Universe · Printed from the site
          </p>
        </div>
        <Hero equation={heroEquation} />
        <About />
        <ResearchInterests equations={researchEquations} plates={researchPlates} />
        <Projects equations={projectEquations} plates={projectPlates} />
        <Publications />
        <Notebook essayBodies={essayBodies} />
        <PhysicsLab math={labMath} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
