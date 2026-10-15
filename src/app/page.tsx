import { AscendButton } from "@/components/site/ascend-button";
import { CommandPalette } from "@/components/site/command-palette";
import { ConstellationNav } from "@/components/site/constellation-nav";
import { DeepField } from "@/components/site/deep-field";
import { ReadingProgress } from "@/components/site/reading-progress";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { PhysicsLab } from "@/components/site/lab/lab";
import { Navigation } from "@/components/site/navigation";
import { Notebook } from "@/components/site/notebook";
import { Projects } from "@/components/site/projects";
import { Publications } from "@/components/site/publications";
import { ResearchInterests } from "@/components/site/research";

/**
 * THE PHYSICIST — a single-page digital universe.
 * Home · About · Research · Projects · Publications · Notes · Lab · Contact
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
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

      <main className="flex-1">
        <Hero />
        <About />
        <ResearchInterests />
        <Projects />
        <Publications />
        <Notebook />
        <PhysicsLab />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
