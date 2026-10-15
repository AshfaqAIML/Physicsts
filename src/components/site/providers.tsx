"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import {
  getMotionReduced,
  setMotionReduced,
  subscribeMotion,
} from "@/lib/motion-preference";

/**
 * PROVIDERS — theme (Deep Field / Archival Journal) and the site-level
 * motion preference ("calm the universe"), which feeds framer-motion's
 * MotionConfig, the <html> class hook, and every canvas instrument.
 */

type MotionPreference = {
  /** Effective preference — true means animation is reduced */
  reduced: boolean;
  /** True once hydrated from storage / media query (prevents icon flicker) */
  ready: boolean;
  /** Flip the preference (explicit site-level choice, persisted) */
  toggle: () => void;
};

const MotionContext = createContext<MotionPreference>({
  reduced: false,
  ready: false,
  toggle: () => {},
});

export function useMotionPreference(): MotionPreference {
  return useContext(MotionContext);
}

const emptySubscribe = () => () => {};
const getMounted = () => true;
const getServerSnapshot = () => false;

export function Providers({ children }: { children: ReactNode }) {
  // External-store pattern: server renders the animated default, the
  // client snapshot (storage or OS preference) takes over after hydration.
  const reduced = useSyncExternalStore(
    subscribeMotion,
    getMotionReduced,
    getServerSnapshot
  );
  const ready = useSyncExternalStore(emptySubscribe, getMounted, getServerSnapshot);

  const toggle = useCallback(() => setMotionReduced(!getMotionReduced()), []);

  // Reflect the preference onto <html> for CSS (smooth scroll, transitions)
  useEffect(() => {
    document.documentElement.classList.toggle("motion-calm", reduced);
  }, [reduced]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <MotionContext.Provider value={{ reduced, ready, toggle }}>
        <MotionConfig reducedMotion={reduced ? "always" : "user"}>
          {children}
        </MotionConfig>
      </MotionContext.Provider>
    </ThemeProvider>
  );
}
