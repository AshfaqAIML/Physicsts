"use client";

import { cn } from "@/lib/utils";

/**
 * One-tap experiment presets, shared by the three lab instruments.
 *
 * Each instrument defines its own preset records (parameter values plus a
 * short `title` describing the regime); this component only renders the
 * chip row. The active chip is derived by the parent sim from its current
 * parameter values, so a manual slider change clears the highlight by
 * itself — no extra bookkeeping.
 */

export type Preset = {
  id: string;
  label: string;
  /** Hover/tooltip summary of the regime the preset produces. */
  title: string;
};

export function PresetChips<P extends Preset>({
  ariaLabel,
  presets,
  activeId,
  onSelect,
}: {
  /** Accessible name of the group, e.g. "Experiment presets for …". */
  ariaLabel: string;
  presets: readonly P[];
  /** id of the preset whose parameters are currently applied, if any. */
  activeId: string | null;
  onSelect: (preset: P) => void;
}) {
  return (
    <div className="space-y-2.5">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Experiments
      </span>
      <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const active = preset.id === activeId;
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.title}
              aria-pressed={active}
              onClick={() => onSelect(preset)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                active
                  ? "border-photon/60 bg-photon/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-photon/50 hover:text-foreground"
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Float comparison for active-preset detection (slider step tolerance). */
export function presetParamEq(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}
