"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Orbit, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
            <Orbit className="size-4" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-tight">{site.wordmark}</span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
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
                  "relative rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
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

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("phys:open-palette"))}
            className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label="Open command palette (search the whole page)"
          >
            <Search className="size-4" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="hidden rounded border border-border bg-background/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] sm:inline-block"
            >
              ⌘K
            </span>
          </button>

          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
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
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {site.observatoryNote}
                </p>
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
                        <span className="font-mono text-[10px] text-photon">
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
                className="mt-6 flex w-full items-center justify-between rounded-md border border-dashed border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="flex items-center gap-2">
                  <Search className="size-3.5" aria-hidden="true" />
                  Search everything
                </span>
                <span aria-hidden="true">⌘K</span>
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
