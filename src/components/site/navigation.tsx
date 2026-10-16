"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, Menu, Orbit, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MotionToggle } from "@/components/site/motion-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { navItems, site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Minimal navigation — transparent over the hero, a glass panel
 * once scrolled. Desktop: inline links with scroll-spy highlighting.
 * Mobile: an accessible sheet menu.
 */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy — the section occupying the viewport middle wins
  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "glass-panel border-b border-border"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-500 sm:px-6 lg:px-8",
          scrolled ? "h-16" : "h-20"
        )}
      >
        {/* Wordmark */}
        <Link
          href="#home"
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="Back to top — home"
        >
          <span
            aria-hidden="true"
            className="relative flex size-8 items-center justify-center rounded-full border border-border text-photon transition-colors duration-500 group-hover:border-photon/50"
          >
            <Orbit className="size-4 transition-transform duration-700 ease-out group-hover:rotate-180" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-tight">{site.wordmark}</span>
            <span className="mt-1 hidden meta-xs text-muted-foreground sm:block">
              Physics · Mathematics
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-2 eyebrow transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  active === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-px bg-photon transition-transform duration-300",
                    active === item.href ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Narrow screens keep only the motion, theme, and menu keys in
            the bar — search and the lexicon live inside the sheet menu, so
            the wordmark never has to fight the toolbar for space. */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("phys:open-palette"))}
            className="hit-target hidden h-9 items-center gap-2 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
            aria-label="Open command palette (search the whole page)"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <Search className="size-4" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="hidden kbd xl:inline-block"
            >
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("phys:open-lexicon"))}
            className="hit-target hidden h-9 items-center gap-2 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
            aria-label="Open the physics lexicon"
            aria-keyshortcuts="L"
          >
            <BookMarked className="size-4" aria-hidden="true" />
          </button>

          <MotionToggle />

          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="hit-target inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="glass-panel w-72 border-border bg-background/95"
            >
              <SheetHeader className="border-b border-border pb-4 text-left">
                <SheetTitle className="font-serif text-lg">
                  {site.wordmark}
                </SheetTitle>
                <SheetDescription className="eyebrow text-muted-foreground">
                  {site.observatoryNote}
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="px-1">
                <ul className="flex flex-col">
                  {navItems.map((item, i) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-baseline gap-4 border-b border-border/60 py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          active === item.href
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="meta-num text-photon">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-xl">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new Event("phys:open-palette"));
                }}
                className="chip-btn chip-btn--dashed chip-btn--block mt-6"
              >
                <span className="flex items-center gap-2">
                  <Search className="size-3.5" aria-hidden="true" />
                  Search everything
                </span>
                <span aria-hidden="true">⌘K</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new Event("phys:open-lexicon"));
                }}
                className="chip-btn chip-btn--dashed chip-btn--block mt-2"
              >
                <span className="flex items-center gap-2">
                  <BookMarked className="size-3.5" aria-hidden="true" />
                  The Lexicon
                </span>
                <span aria-hidden="true">A–Z</span>
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
