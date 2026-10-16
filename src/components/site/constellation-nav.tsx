"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * CONSTELLATION NAV — a quiet vertical star-chart of the page's sections,
 * desktop-only. Each section is a point of light; the active one glows
 * photon-bright. Labels surface on hover / focus.
 */
export function ConstellationNav() {
  const [active, setActive] = useState("#home");

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
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="group flex flex-col items-end gap-4">
        {navItems.map((item) => {
          const isActive = active === item.href;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className="flex items-center gap-3 rounded-sm py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span
                  className="meta-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 [.group:focus-within_&]:opacity-100"
                  style={{ opacity: isActive ? 1 : undefined }}
                >
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block rounded-full transition-all duration-500",
                    isActive
                      ? "size-[7px] bg-photon shadow-[0_0_10px_2px_var(--glow-a)]"
                      : "size-[5px] bg-muted-foreground/50 hover:bg-muted-foreground/80"
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
