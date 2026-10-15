"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * THE OPERATING MANUAL (?) — a quiet card listing every keyboard
 * shortcut on the page, and the single owner of the global letter
 * hotkeys (L for lexicon, T for theme). Letter hotkeys stay silent
 * while typing or while any dialog or palette holds the stage.
 */

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function isStageHeld(target: EventTarget | null): boolean {
  // Any open dialog, command palette, or focus-guard swallows letters.
  return target instanceof HTMLElement
    ? target.closest('[role="dialog"], [cmdk-root]') !== null
    : false;
}

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // External openers (command palette action)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("phys:open-shortcuts", onOpen);
    return () => window.removeEventListener("phys:open-shortcuts", onOpen);
  }, []);

  // Global hotkeys — ?, L, T (silent while typing or on a dialog stage)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target) || isStageHeld(e.target)) return;

      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "l") {
        e.preventDefault();
        window.dispatchEvent(new Event("phys:open-lexicon"));
        return;
      }
      if (e.key === "t") {
        e.preventDefault();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resolvedTheme, setTheme]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-border bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader className="text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-photon">
            Operating manual
          </p>
          <DialogTitle className="mt-2 font-serif text-2xl leading-tight">
            The Keyboard, a Quiet Instrument.
          </DialogTitle>
          <DialogDescription className="font-serif text-sm italic leading-relaxed">
            Every control on this page can be reached without a mouse —
            these are the keys that matter.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <ShortcutGroup label="Everywhere">
            <ShortcutRow keys={["⌘", "K"]} note="Command palette — Ctrl K on Windows and Linux" />
            <ShortcutRow keys={["?"]} note="This operating manual" />
            <ShortcutRow keys={["L"]} note="Open the physics lexicon" />
            <ShortcutRow keys={["T"]} note="Switch Deep Field (dark) ↔ Archival Journal (light)" />
          </ShortcutGroup>

          <ShortcutGroup label="Laboratory — while an instrument is focused">
            <ShortcutRow keys={["Space"]} note="Play / pause the running simulation" />
            <ShortcutRow keys={["R"]} note="Reset the instrument to its initial state" />
            <ShortcutRow keys={["← ↑ ↓ →"]} note="Move the lens (L-1) · hold Shift for fine control" />
          </ShortcutGroup>

          <ShortcutGroup label="Dialogues & reading">
            <ShortcutRow keys={["Esc"]} note="Close any open view" />
            <ShortcutRow keys={["Tab"]} note="Step through controls in order" />
          </ShortcutGroup>
        </div>

        <p className="mt-2 border-t border-border pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/70">
          Letter shortcuts stay silent while you are typing or when a
          dialogue is open — the stage is theirs.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section aria-label={label}>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </h3>
      <ul className="mt-3 space-y-2.5">{children}</ul>
    </section>
  );
}

function ShortcutRow({ keys, note }: { keys: string[]; note: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span className="flex flex-wrap items-center gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="rounded border border-border bg-background/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground/90"
          >
            {k}
          </kbd>
        ))}
      </span>
      <span className="text-right text-xs leading-relaxed text-muted-foreground">
        {note}
      </span>
    </li>
  );
}
