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

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle colour theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 text-muted-foreground transition-colors hover:text-foreground"
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
