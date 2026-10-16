"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

/**
 * Theme switch — dark ("Deep Field") ↔ light ("Archival Journal").
 * `mounted` is false during SSR/hydration so the icons render a
 * stable placeholder before the resolved theme is known.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  /** Theme cross-fade — while the observatory lights change, every
      colour on the page is given a brief transition. The class is a
      passing state, never a permanent style; calm-motion visitors
      and reduced-motion OS settings switch instantly instead (the
      kill-switch outranks this rule). */
  const switchTheme = () => {
    const root = document.documentElement;
    const calm =
      root.classList.contains("motion-calm") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm) {
      root.classList.add("theme-x-fade");
      window.setTimeout(
        () => root.classList.remove("theme-x-fade"),
        650
      );
    }
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle colour theme"}
      onClick={switchTheme}
      className="hit-target relative h-9 w-9 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Sun
        className={`h-[18px] w-[18px] transition-all duration-500 ${
          mounted && isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
        } absolute`}
        aria-hidden="true"
      />
      <Moon
        className={`h-[18px] w-[18px] transition-all duration-500 ${
          mounted && !isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"
        } absolute`}
        aria-hidden="true"
      />
    </Button>
  );
}
