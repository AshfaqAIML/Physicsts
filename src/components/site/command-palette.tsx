"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  Atom,
  BookMarked,
  BookOpen,
  FlaskConical,
  History,
  Home,
  Mail,
  Moon,
  NotebookPen,
  Orbit,
  Printer,
  Route,
  Shuffle,
  Star,
  Sun,
  Telescope,
  FolderGit2,
  Keyboard,
  Waves,
  Zap,
  ZapOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { navItems } from "@/content/site";
import { researchAreas } from "@/content/research";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";
import { getMotionReduced, setMotionReduced } from "@/lib/motion-preference";

/**
 * THE SPECTRAL CONSOLE (⌘K / Ctrl+K)
 * A command palette for the whole universe of this page — sections,
 * instruments, research areas, projects, and readable essays.
 * Items dispatch custom events that the owning sections listen for,
 * so the palette never reaches into their internals.
 */

const emptySubscribe = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

const sectionIcons = [Home, Atom, Telescope, FolderGit2, BookOpen, NotebookPen, FlaskConical, Mail];

/* Recently-read essays — read from localStorage, never a blocker if the
   storage is unavailable. Kept in sync with the notebook's recorder via a
   window event so the palette can refresh even while open. */
const RECENT_KEY = "phys:recent-notes";

function readRecentNoteIds(): string[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(stored)
      ? stored.filter((x): x is string => typeof x === "string").slice(0, 3)
      : [];
  } catch {
    return [];
  }
}

function goTo(hash: string) {
  document
    .querySelector(hash)
    ?.scrollIntoView({ behavior: getMotionReduced() ? "auto" : "smooth" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const mounted = useSyncExternalStore(emptySubscribe, getMounted, getServerMounted);
  const { resolvedTheme, setTheme } = useTheme();

  const readableNotes = useMemo(() => notes.filter((n) => n.essay), []);
  const recentNotes = useMemo(
    () =>
      recentIds
        .map((id) => readableNotes.find((n) => n.id === id))
        .filter((n): n is (typeof readableNotes)[number] => Boolean(n)),
    [recentIds, readableNotes]
  );

  // ⌘K / Ctrl+K anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // External openers (the nav button)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("phys:open-palette", onOpen);
    return () => window.removeEventListener("phys:open-palette", onOpen);
  }, []);

  // The reading trail refreshes whenever an essay is opened, and the
  // palette re-reads it each time it takes the stage.
  useEffect(() => {
    const refresh = () => setRecentIds(readRecentNoteIds());
    refresh();
    window.addEventListener("phys:recent-notes-changed", refresh);
    return () => window.removeEventListener("phys:recent-notes-changed", refresh);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setRecentIds(readRecentNoteIds());
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    // Let the overlay close before scrolling / opening the next view
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }, []);

  if (!mounted) return null;

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Command palette"
      description="Search sections, instruments, research areas, projects, and essays"
      className="border-border bg-card/95 backdrop-blur-xl sm:max-w-xl [&_[cmdk-item][data-selected=true]]:bg-photon/10 [&_[cmdk-item][data-selected=true]]:text-foreground"
    >
      <CommandInput placeholder="Search the universe — sections, research, instruments…" />
      <CommandList className="max-h-[min(24rem,60vh)]">
        <CommandEmpty className="py-10 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Nothing found in this light cone.
        </CommandEmpty>

        {recentNotes.length > 0 && (
          <>
            <CommandGroup heading={<GroupLabel>Recently Read</GroupLabel>}>
              {recentNotes.map((note, i) => (
                <CommandItem
                  key={`recent-${note.id}`}
                  value={`recent resume ${note.title} ${note.category}`}
                  onSelect={() =>
                    run(() => {
                      goTo("#notes");
                      window.dispatchEvent(new CustomEvent("phys:open-note", { detail: note.id }));
                    })
                  }
                >
                  <History className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="flex-1">{note.title}</span>
                  <Kbd>RESUME</Kbd>
                  <span aria-hidden="true" className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading={<GroupLabel>Navigate</GroupLabel>}>
          {navItems.map((item, i) => {
            const Icon = sectionIcons[i] ?? Home;
            return (
              <CommandItem
                key={item.href}
                value={`navigate ${item.label}`}
                onSelect={() => run(() => goTo(item.href))}
              >
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                <span aria-hidden="true" className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={<GroupLabel>Laboratory</GroupLabel>}>
          <CommandItem value="lab gravitational lensing" onSelect={() => run(() => { goTo("#lab"); window.dispatchEvent(new CustomEvent("phys:lab-tab", { detail: "lensing" })); })}>
            <Star className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Gravitational Lensing</span>
            <Kbd>L-1</Kbd>
          </CommandItem>
          <CommandItem value="lab orbital mechanics" onSelect={() => run(() => { goTo("#lab"); window.dispatchEvent(new CustomEvent("phys:lab-tab", { detail: "orbits" })); })}>
            <Orbit className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Orbital Mechanics</span>
            <Kbd>L-2</Kbd>
          </CommandItem>
          <CommandItem value="lab quantum wave packet tunneling" onSelect={() => run(() => { goTo("#lab"); window.dispatchEvent(new CustomEvent("phys:lab-tab", { detail: "wave" })); })}>
            <Waves className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Wave Packet Tunneling</span>
            <Kbd>L-3</Kbd>
          </CommandItem>
          <CommandItem value="lab share tour link all benches" onSelect={() => run(() => { window.dispatchEvent(new Event("phys:share-lab-tour")); })}>
            <Route className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Share the whole lab — copy a tour link</span>
            <span aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">3 benches</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={<GroupLabel>Research Areas</GroupLabel>}>
          {researchAreas.map((area) => (
            <CommandItem
              key={area.id}
              value={`research ${area.title} ${area.tagline}`}
              onSelect={() =>
                run(() => {
                  goTo("#research");
                  window.dispatchEvent(new CustomEvent("phys:open-research", { detail: area.id }));
                })
              }
            >
              <Telescope className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{area.title}</span>
              <span aria-hidden="true" className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {area.index}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={<GroupLabel>Projects · Example Concepts</GroupLabel>}>
          {projects.map((p, i) => (
            <CommandItem
              key={p.id}
              value={`project ${p.title}`}
              onSelect={() =>
                run(() => {
                  goTo("#projects");
                  window.dispatchEvent(new CustomEvent("phys:open-project", { detail: p.id }));
                })
              }
            >
              <FolderGit2 className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{p.title}</span>
              <span aria-hidden="true" className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={<GroupLabel>Notebook · Readable Essays</GroupLabel>}>
          {readableNotes.map((note) => (
            <CommandItem
              key={note.id}
              value={`note essay ${note.title} ${note.category}`}
              onSelect={() =>
                run(() => {
                  goTo("#notes");
                  window.dispatchEvent(new CustomEvent("phys:open-note", { detail: note.id }));
                })
              }
            >
              <NotebookPen className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{note.title}</span>
              <Kbd>ESSAY</Kbd>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={<GroupLabel>Reference</GroupLabel>}>
          <CommandItem
            value="lexicon glossary dictionary terms reference"
            onSelect={() => run(() => window.dispatchEvent(new Event("phys:open-lexicon")))}
          >
            <BookMarked className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Open the lexicon — physics glossary</span>
            <Kbd>L</Kbd>
          </CommandItem>
          <CommandItem
            value="keyboard shortcuts help keys hotkeys operating manual"
            onSelect={() => run(() => window.dispatchEvent(new Event("phys:open-shortcuts")))}
          >
            <Keyboard className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Keyboard shortcuts — the operating manual</span>
            <Kbd>?</Kbd>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={<GroupLabel>Actions</GroupLabel>}>
          <CommandItem
            value="action random page essay shuffle fate dice surprise read"
            onSelect={() => run(() => window.dispatchEvent(new Event("phys:open-random-note")))}
          >
            <Shuffle className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Open a random page — let fate choose</span>
            <Kbd>R</Kbd>
          </CommandItem>
          <CommandItem
            value="action calm universe reduce motion animation accessibility calm still"
            onSelect={() => run(() => setMotionReduced(!getMotionReduced()))}
          >
            {getMotionReduced() ? (
              <Zap className="size-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ZapOff className="size-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="flex-1">
              {getMotionReduced()
                ? "Restore motion — let the universe move"
                : "Calm the universe — reduce motion"}
            </span>
            <Kbd>M</Kbd>
          </CommandItem>
          <CommandItem
            value="action print page paper archival copy pdf save export"
            onSelect={() => run(() => window.print())}
          >
            <Printer className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">Print this page — an archival copy</span>
            <Kbd>PDF</Kbd>
          </CommandItem>
          <CommandItem
            value="action toggle theme dark light"
            onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="flex-1">
              Switch to {resolvedTheme === "dark" ? "Archival Journal (light)" : "Deep Field (dark)"}
            </span>
            <Kbd>T</Kbd>
          </CommandItem>
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        <span>↑↓ traverse · ↵ engage · esc close · ? manual</span>
        <span aria-hidden="true">⌘K</span>
      </div>
    </CommandDialog>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/80">
      {children}
    </span>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/80"
    >
      {children}
    </span>
  );
}
