"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { physicsHistory } from "@/content/site";

/**
 * THIS MONTH IN PHYSICS HISTORY — a footer almanac. Opens on the
 * current month's real milestone; the chevrons page through all
 * twelve. Every date is historical record, none invented.
 */
export function PhysicsHistory() {
  const [index, setIndex] = useState(() => {
    const now = new Date().getMonth();
    const found = physicsHistory.findIndex((m) => m.month === now);
    return found === -1 ? 0 : found;
  });

  const moment = physicsHistory[index]!;
  const monthName = new Date(2000, moment.month, 1).toLocaleString("en-GB", {
    month: "long",
  });

  const cycle = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + physicsHistory.length) % physicsHistory.length);

  return (
    <section
      aria-label="This month in physics history"
      className="border-t border-border"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:gap-8 sm:px-6 lg:px-8">
        <p className="flex shrink-0 items-center gap-2.5 meta-sm text-muted-foreground">
          <History className="size-3.5 text-photon" aria-hidden="true" />
          This month in physics history
        </p>

        <div
          aria-live="polite"
          className="min-w-0 flex-1 sm:border-l sm:border-border sm:pl-8"
        >
          <p className="eyebrow text-photon">
            {moment.date}
          </p>
          <p className="mt-1.5 font-serif text-base italic leading-relaxed text-muted-foreground sm:text-lg">
            {moment.event}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2" data-print="hide">
          <p className="meta-sm text-muted-foreground">
            {monthName} · {String(index + 1).padStart(2, "0")}/
            {String(physicsHistory.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => cycle(-1)}
              aria-label="Previous month in physics history"
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => cycle(1)}
              aria-label="Next month in physics history"
              className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-photon/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
