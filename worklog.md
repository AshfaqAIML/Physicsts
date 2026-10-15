# Project Worklog — The Physicist Portfolio

A cinematic, scientifically honest personal portfolio for a physicist /
scientific thinker. Single-page Next.js 16 App Router site on `/`.

---

Task ID: 1–3
Agent: main-agent
Task: Foundation — design system, content layer, shared components

Work Log:
- Installed `katex` (v0.19.0) for mathematical typesetting.
- Prisma schema: replaced scaffold models with `ContactMessage` (id, name, email,
  subject, message, read, createdAt) — pushed to SQLite successfully.
- `src/app/globals.css`: full design system. Dark "Deep Field" theme (default):
  obsidian #080A0F bg, midnight #0C1220 cards, soft white #F2F4F8, silver
  #A7B0C0, photon cyan #78DCE8, nebula violet #A99BFF. Light "Archival Journal"
  theme: paper #F5F3EE, ink #14161D, darker cyan #0E7C8C / violet #5D50D4.
  Utilities: bg-chart-grid, bg-plot-grid, grain, glass-panel, drop-cap,
  reading-measure, custom scrollbar, reduced-motion handling.
- `src/app/layout.tsx`: fonts Instrument_Serif (--font-instrument), Inter
  (--font-inter), IBM_Plex_Mono (--font-plex-mono); metadata (title template,
  OG, twitter, robots); Providers (next-themes defaultTheme=dark + framer
  MotionConfig reducedMotion="user"); katex css import; sonner Toaster.
- Content layer (typed, presentation-free):
  - `src/content/site.ts` — identity, nav, contact channels (null hrefs =
    honest "to be added" states)
  - `src/content/profile.ts` — about copy, placeholder facts, driving questions, approach
  - `src/content/research.ts` — 6 research areas w/ equations, concepts, real reading lists
  - `src/content/projects.ts` — 5 EXAMPLE projects (status:"example"), full structure
  - `src/content/publications.ts` — honest empty state config
  - `src/content/notes.ts` — 9 notes (1 full example essay w/ TOC sections,
    inline $math$, real references; 8 planned topics)
- Shared components: `tex.tsx` (Tex + Prose KaTeX renderers), `reveal.tsx`
  (reduced-motion-aware scroll reveal), `section-heading.tsx` (mono index +
  serif display), `theme-toggle.tsx`, `providers.tsx`.

Stage Summary:
- Design system live; content fully separated from presentation.
- All placeholders honestly labelled; nothing fabricated (no fake degrees,
  publications, or affiliations).
- Next: Task 4-a (Physics Lab sims via subagent) + Task 4-b (Navigation &
  cinematic Hero) in parallel.

---
Task ID: 4-a, 4-b, 5, 6, 7, 8, 9, 10, 11, 12
Agent: main-agent
Task: Full site implementation — hero, all sections, lab, contact, SEO, QA

Work Log:
- Physics Laboratory (src/components/site/lab/):
  · lensing-sim.tsx — REAL thin-lens ray-shooting: every pixel block traced
    backwards through β = θ − θ_E²·θ/|θ|²; conserved surface brightness;
    procedural star field (theme-aware "photographic plate" in light mode);
    coordinate-grid source plane mode; mass slider (θ_E 24–140 px); dashed
    Einstein-ring guide; drag-to-move lens (pointer + keyboard arrows, Shift
    fine control); live b/δθ readout; IntersectionObserver + dirty-flag
    rendering; DPR-aware.
  · orbits-sim.tsx — Newtonian two-body (GM=1 units), velocity Verlet dt
    0.002, substeps 1–15; mass-ratio slider (live barycentre shift), launch
    speed f∈[0.5,1.25]×v_circ (applies on reset), analytic conic overlay with
    P/A ticks, fading trails, Doppler-glowing bodies, velocity vector,
    live readouts (e, a, ε, T, ΔE drift); Space/R keyboard; reduced-motion
    starts paused via useSyncExternalStore (no setState-in-effect).
  · lab.tsx — tabs, figure captions, KaTeX mathematics panels, honest
    assumptions blocks.
- Navigation: scroll-spy IntersectionObserver, glass panel after 24px
  scroll, mobile Sheet menu with serif items, ThemeToggle (Sun/Moon).
- Hero (hero.tsx + black-hole.tsx): procedural Gargantua-inspired black hole
  (1150 Keplerian particles, lensed far-side arc, secondary image, photon
  ring, Doppler beaming, star/nebula backdrop; ink-plate rendering in light
  theme); staggered entrance; parallax (content fade/rise, scene scale);
  Einstein field equation rendered by KaTeX with "1915" caption;
  "DESCEND INTO THE UNIVERSE" animated scroll indicator. Fixed after QA:
  scene moved to x=0.62 + left readability scrim (VLM-flagged text/disk
  overlap in light theme).
- About: editorial split layout, sticky portrait plate (generated
  silhouette-under-stars placeholder, labelled "Plate I · Portrait
  (placeholder)"), drop-cap first paragraph, facts table with dashed
  "placeholder" badges, driving questions ledger, approach grid,
  M42 marginalia.
- Research: 6 area cards w/ KaTeX equations + detail dialogs (concepts,
  reading lists); "interests not credentials" disclaimer.
- Projects: 5 example-concept cards (dashed violet badges), full brief
  dialogs (motivation → background → math → methodology → findings →
  limitations → references → honest repository placeholder).
- Publications: honest empty state "Research and writing in progress.",
  dormant filter rail (dashed, aria-disabled) + explanation.
- Notebook: category filter chips, 9-row ledger (1 full example essay
  w/ TOC sidebar, reading measure, drop cap, inline $math$, references;
  8 planned topics disabled with "Planned — not yet written" badges).
- Contact: channels list (null hrefs → "to be added" states), CV honesty
  panel, react-hook-form + zod form, honeypot field, aria-live status,
  sonner toasts.
- API /api/contact: zod validation, honeypot discard, in-memory rate limit
  (5/10min/IP), Prisma ContactMessage persistence.
- Footer: colophon grid, sticky-bottom compliant (mt-auto + safe-area
  padding), c² note.
- page.tsx: min-h-screen flex-col assembly + skip link.
- SEO: icon.svg favicon (orbit mark), robots.ts, sitemap.ts, OG image
  (generated 1344×768 black hole), full metadata in layout.
- Generated assets: public/portrait.jpg (864×1152), public/og.jpg.
- README.md: setup, env vars, content-editing guide, architecture,
  deployment. .env.example created.

QA (agent-browser + VLM verification, screenshots in qa/):
- Desktop 1440×900: hero, about, research grid + dialog, projects + dialog,
  publications, reading view, lab (lensing + orbits), contact — all verified
  visually via VLM; equations render properly (not raw LaTeX); no page
  errors; clean console after reload (one transient framer-motion warning
  from Fast Refresh only).
- Interactions verified: research dialog, project dialog, essay reading
  view, lab tab switch, mass slider, lens drag (lens displaced + distortion
  confirmed), Space/R keyboard on orbits (Play↔Pause toggled), theme toggle
  (dark↔light both verified visually), form validation errors (name/email/
  subject), successful submission → "Delivered. Thank you." → Prisma INSERT
  confirmed in DB.
- Mobile 375×812: no horizontal overflow (scrollWidth=clientWidth), hero
  readable, mobile sheet menu works, lab fits, footer correct.
- dev.log: all 200s, POST /api/contact 200, no runtime errors.
- bun run lint: clean.

Stage Summary:
- COMPLETE, browser-verified single-page site with all 8 sections, 2 working
  physics simulations, real backend for contact form, dark/light themes,
  SEO complete, honest content integrity throughout.
- Server running on :3000 (started detached; note: sandbox kills direct
  background children — must use double-fork: `( ( setsid bun run dev ... & ) & )`).
- Remaining known items: NEXT_PUBLIC_SITE_URL should be set to the real
  domain before deployment; placeholder content (name, facts, channels,
  portrait) awaits the owner's real details; publications empty by design.

---
Task ID: R1 (resume phase)
Agent: main-agent
Task: Status assessment, QA, bug fixes, and feature expansion

Work Log:
- Read prior worklog (tasks 1–12 complete); verified dev server healthy
  (GET / 200, clean logs), `bun run lint` clean, no horizontal overflow
  at 1440/375 px.
- QA via agent-browser (desktop 1440×900, mobile 375×812) + VLM checks.
- BUG FIXES:
  · lensing-sim.tsx draw(): `dark` was referenced outside its scope —
    every frame threw ReferenceError after the sky/ring/glow drew, so the
    lens mass glyph never rendered. Added local `const dark = ...` in
    draw(). Verified visually (glyph + photon rim now render).
  · orbits-sim.tsx: null-guarded `canvas` in resetSim; tuple-typed
    `star` ([number, number, number]).
  · lensing-sim.tsx: tuple-typed `star` (RGB).
  · ui/slider.tsx: Radix does NOT forward Root-level aria-label to the
    Thumb (role=slider); wrapper now extracts and forwards it. All lab
    sliders now have accessible names.
  · globals.css: `html, body { position: relative }` — silences
    framer-motion's dev-only scroll-offset warning (container was
    documentElement/body, both static). Verified: 0 warnings in a fresh
    browser session.
  · lab.tsx mobile: 3rd tab overflowed 375px (scrollWidth 418) — tabs
    now live in a horizontal-scroll wrapper (hidden scrollbar).
  · Fixed Crank–Nicolson sign bugs caught in self-review BEFORE ever
    running: A-diagonal real part 1 − (dt/2)·hIm; c′ complex division
    (i·c)/(p) = [c·pi + i·c·pr]/den; identity rows have zero super-diagonal.
  · planeWaveT E→V₀ limit corrected to 1/(1 + V₀w²/2).
- NEW FEATURES (this phase):
  1. Quantum Wave Packet simulation (wave-sim.tsx) — third lab
     instrument: 1D TDSE solved by Crank–Nicolson (unitary, unconditionally
     stable) with complex Thomas-algorithm factorisation precomputed per
     parameter change; N=768 grid, dt=0.005, natural units; Gaussian
     packet, square barrier; complex absorbing potential (CAP) at edges;
     live R/T/absorbed/⟨x⟩/t readouts + plane-wave T comparison; E, V₀, w,
     speed sliders; Space/R keyboard; reduced-motion starts paused;
     theme-aware canvas; auto-pause when absorbed. lab.tsx: 3rd tab +
     mathematics panel (TDSE + tunneling coefficient) + what-to-try +
     assumptions. Physics verified in-browser: E=1.4 < V₀=1.6 tunnels
     (T≈0.33 measured vs 0.235 plane-wave — consistent with packet energy
     spread), R+T+absorbed ≈ 1.
  2. Command palette ⌘K (command-palette.tsx) — 6 groups: Navigate (8),
     Laboratory (3, incl. direct tab switching), Research Areas (6, opens
     detail dialogs), Projects (5, opens briefs), Notebook essays,
     Actions (theme). Custom events (phys:open-palette, phys:lab-tab,
     phys:open-research, phys:open-project, phys:open-note) decouple it
     from section internals; research/projects/notebook/lab listen and
     open. Nav-bar trigger + mobile-sheet trigger. Verified: search,
     empty state ("Nothing found in this light cone"), deep links into
     Cosmology dialog + speed-of-light essay.
  3. Reading progress hairline (reading-progress.tsx) — top photon bar,
    scaleX via rAF, direct DOM writes.
  4. Constellation nav (constellation-nav.tsx) — desktop-only right-rail
     section dots, scroll-spy IntersectionObserver, labels on hover.
  5. Ascend button (ascend-button.tsx) — appears past 90vh, smooth
     scrollTo top. Verified click → scrollY 0.
  6. Deep-field ambience (deep-field.tsx) — fixed -z-10 canvas: ~110
     twinkling stars (dark) / faint paper dust (light), 3% parallax,
     theme-aware via MutationObserver, reduced-motion → static render.
  7. Custom 404 (app/not-found.tsx) — "outside the light cone" page.
  8. Second full essay in notes.ts — "Why Is the Speed of Light So
     Fundamental?" (6 sections, inline $math$ + display velocity-addition
     formula, 5 real references incl. Einstein 1905, Taylor & Wheeler,
     BIPM SI brochure). Notebook now has 2 readable example essays.
  9. Contact form polish — message character counter (x / 4000, amber
     past 3600), maxLength; verified live.
  10. Print stylesheet (@media print) — chrome/canvas hidden, ink-on-
      white, grid/glass/blur removed, KaTeX overflow visible.
- page.tsx: mounts DeepField, ReadingProgress, ConstellationNav,
  AscendButton, CommandPalette alongside existing sections.
- lab.tsx tabs now controlled (value/onValueChange) + listens for
  phys:lab-tab events from the palette.
- Full regression QA after changes: desktop + mobile overflow (375=375
  ✓), theme toggle both directions, palette open/close/deep-links,
  wave sim run + readouts, lensing glyph, essay reading view (TOC +
  KaTeX display math verified by VLM), form validation + full submission
  (Prisma INSERT logged, "Delivered. Thank you." status), mobile menu,
  mobile wave sim (341px canvas, running).
- bun run lint: clean. tsc --noEmit: zero errors under src/.

Stage Summary:
- Site now has THREE physics instruments (lensing, orbits, quantum
  tunneling), a ⌘K command palette with deep links into every section's
  dialogs, reading progress, constellation nav, ascend control, ambient
  starfield, custom 404, second example essay, contact counter, print
  styles. All QA-verified desktop + mobile, both themes.
- Known non-blocking dev-mode noise: one React 19 hydration attribute
  warning (Radix aria-controls useId shift on the mobile Sheet trigger).
  Present in the ORIGINAL committed code too (2 occurrences); does not
  affect functionality (sheet opens/closes correctly); treated as
  dev-mode noise, documented here for honesty.
- dev server CSS chunk occasionally serves stale content in this
  sandbox until a further edit + reload (Turbopack HMR quirk); a
  no-op edit + reload refreshes it.
- Next-phase candidates: real content replacement (name, portrait,
  channels, CV), analytic orbit preview thumbnail regeneration, optional
  LLM-powered "ask about this essay" feature, publication list when real.

---
Task ID: R1-cron
Agent: main-agent
Task: Create 15-minute webDevReview scheduled task (final mandatory step)

Work Log:
- Attempted to create the recurring cron job (*/15 * * * * *, kind
  webDevReview, Asia/Calcutta) via the cron tool — both `create` and
  `list` returned "cron tool is not available for this request" in this
  session (gateway limitation).
- The intended job definition is preserved above and in this entry:
  every 15 minutes, webDevReview kind, message: review the site on
  :3000, read latest dev.log entries, run bun run lint, verify the
  three lab simulations, check accessibility/responsive behavior and all
  sections, fix issues found, append findings to worklog.md.

Stage Summary:
- Cron creation BLOCKED by tool availability in this session — retry
  the exact job definition from this entry when the cron tool is
  available again (highest-priority carry-over item).

---
Task ID: R2-a
Agent: subagent
Task: Notebook essay deep-links (#note-<noteId>) + Copy-link button in reading view

Work Log:
- Only file modified: src/components/site/notebook.tsx (no other files touched).
- Deep-link helpers at module scope: NOTE_HASH_PREFIX = "#note-", noteHash(note),
  readableNoteFromHash(hash) (requires the note to have an essay; planned/unknown
  ids resolve to null).
- Notebook component:
  · openNote(note) — user-initiated opens (ledger row click, phys:open-note
    command-palette event): setOpen + history.pushState("#note-<id>") when the
    hash isn't already exactly that. pushState changes the hash with no scroll
    jump and no hashchange echo; Back therefore closes the essay.
  · hashchange listener + initial-load call (syncFromHash): #note-<id> → open
    that essay (never touches history — initial load and back/forward stay
    history-neutral); non-#note- hash → close the reading view (Back/Forward
    away from a deep link); #note-<planned/unknown> → ignored.
  · TOC-anchor immunity: the reading view's contents links (href="#<section-id>")
    would otherwise look like "moved away" and close the dialog. ReadingView now
    reports the hash it is about to navigate to via onContentsNavigate; the
    parent stores it in contentsHash ref and the hashchange handler ignores
    exactly that hash. (Expected-hash matching, not a bare flag, so a stale
    expectation never misclassifies a real Back/Forward.)
  · Manual close (Dialog onOpenChange false): if the hash points at THIS essay
    (its #note- hash, or a stale in-dialog #<section-id> anchor of this essay —
    small extension so the URL never keeps a dangling section fragment), clear
    it via history.replaceState(null, "", pathname + search) — no history entry.
    All window access lives in effects/handlers only (SSR-safe).
- ReadingView: new toolbar row under the dek in the sticky DialogHeader — mono
  "N min read · date" metadata (now visible on mobile where the TOC aside is
  hidden) on the left, CopyLinkButton on the right.
- CopyLinkButton (new): site-language button (rounded-md border, font-mono
  10px uppercase tracking-[0.18em], hover:border-photon/50, focus-visible ring),
  aria-label="Copy a link to this essay". onClick copies
  `${origin}${pathname}#note-<id>` via navigator.clipboard.writeText; on
  unavailability/failure falls back to a hidden textarea +
  document.execCommand("copy") (try/catch/finally, always removes the scratch
  node). Success → toast.success("Link copied — share this essay.", { description:
  "The URL now points directly to this essay." }) + label/icon swap to
  Check/"Copied" for 2 s (timeout cleaned up on unmount); failure →
  toast.error("Could not copy the link.").
- bun run lint: clean. bunx tsc --noEmit: zero errors under src/ (only
  pre-existing examples/ + skills/ errors outside the app tree).

QA (agent-browser, isolated --session r2a to avoid clashing with a concurrent
agent sharing the default browser session — a Lexicon dialog was found open in
it mid-test):
- window.location.hash = "#note-spacetime-curved" → curvature reading dialog
  opens, Copy-link button present. Hash set to "#note-speed-of-light" while
  open → dialog swaps essays. "#note-qm-tells-us" (planned, no essay) →
  ignored, dialog unchanged.
- TOC anchor click (#force-to-geometry): hash becomes #force-to-geometry,
  dialog STAYS open, active TOC item updates. Back → #note-spacetime-curved,
  dialog still open; Back again → #notes, dialog closed; Forward →
  #note-spacetime-curved, dialog re-opens.
- Escape close with #note-… hash → dialog closed, URL cleared to "/" via
  replaceState (no history entry). Same with a stale #strange-postulate
  section hash (speed-of-light essay) → cleared to "/".
- Ledger click on "Why Is the Speed of Light…" → URL
  /#note-speed-of-light (pushState) → Back → dialog closed, URL "/".
- phys:open-note CustomEvent (palette path) → dialog opens with
  /#note-spacetime-curved.
- Full page load at http://localhost:3000#note-spacetime-curved → dialog opens
  on mount with no history manipulation.
- Copy button click → sonner success toast (title + description verified in
  [data-sonner-toast]), label swapped to "Copied", reset to "Copy link" after
  ~2 s. clipboard.readText denied by headless permissions (expected), but the
  success toast proves the write path resolved.
- Mobile 375×812: no horizontal overflow (375=375), button wraps under the
  dek, visible at x=41 y=287. No console errors, no page errors.
- Screenshot: qa/r2a-notebook.jpeg (1440×900, real JPEG). VLM check: COPY LINK
  button with icon on the right of the metadata line, cleanly styled, no
  overlap; dialog/TOC/essay render correct.

Stage Summary:
- Notebook essays are now fully deep-linkable and shareable: #note-<id> works
  on load, back/forward, and in-dialog essay swaps; Back reliably closes an
  essay opened by click; manual close leaves a clean URL. Reading view has a
  subtle, accessible Copy-link affordance with clipboard fallback + toast
  feedback. Lint/tsc clean; browser-verified desktop + mobile.
- Risks/notes: (1) hashchange-driven close triggers on ANY non-#note- hash
  change not caused by an in-dialog contents click (nav anchors can't be
  clicked while the modal is open, so this is back/forward in practice);
  (2) browser Forward onto an old in-dialog section fragment (after
  contents-click + Back) keeps the dialog open and scrolls — deliberately
  lenient; (3) a #note-<planned-id> URL is silently ignored rather than
  opening an empty state (matches spec "only open notes with an essay").

---
Task ID: R2-b
Agent: subagent
Task: "The Lexicon" — searchable physics glossary dialog, site-wide

Work Log:
- Read worklog + reference components (command-palette, notebook ledger/chips,
  dialog, tex, section-heading) before writing anything.
- NEW src/content/lexicon.ts: typed content layer (LexiconCategory union of 7
  ordered categories, LexiconTerm interface with id/term/category/formula/
  formulaLabel/definition/seeAlso) + 24 real, verified terms — Classical
  Mechanics (Lagrangian, Hamiltonian, Action, Euler–Lagrange Equation,
  Noether's Theorem), Relativity (Metric Tensor, Einstein Field Equations,
  Schwarzschild Radius, Proper Time, Spacetime Interval), Quantum Theory
  (Wavefunction, Uncertainty Principle, Schrödinger Equation, Pauli Exclusion
  Principle, Quantum Tunneling), Statistical & Thermal (Entropy, Boltzmann
  Constant, Canonical Ensemble), Fields & Particles (Electromagnetic Field
  Tensor, Gauge Symmetry, Renormalization), Mathematics (Tensor), Cosmology
  (Cosmological Constant, Hubble Parameter). Every formula is canonical and
  KaTeX-escaped correctly in TS source (double backslashes); every claim is
  textbook physics (Boltzmann's k_B exact 2019 SI value, Schwarzschild 1916,
  Pauli 1925, Heisenberg 1927, Schrödinger 1926, accelerating expansion 1998);
  cross-referenced seeAlso ids all validated at render.
- NEW src/components/site/lexicon.tsx ("use client"): Dialog listening for
  window event `phys:open-lexicon` (palette/nav/mobile decoupling pattern),
  internal open state + query/category reset on each open. DialogContent
  sm:max-w-2xl, border-border bg-card/95 backdrop-blur-xl, flex-col with
  max-h-[85vh]; header (photon mono eyebrow "THE LEXICON — 24 TERMS" with live
  count, visible DialogTitle "A Field Guide to the Language.", DialogDescription
  lede), Search-icon mono input (aria-label, focus-visible ring, autofocus via
  30ms timer after Radix mounts), notebook-style category chips (aria-pressed,
  active border-photon/60 bg-photon/10), scrollable ledger
  (divide-y divide-border border-y) with mono 01… index, serif term
  (hover:text-photon), category pill, definition, centered KaTeX formula plate
  (w-fit max-w-full overflow-x-auto border-border/70 bg-background/60 +
  mono formulaLabel), and "→ See also:" photon buttons that set the search to
  the target term + reset category to All + refocus input. Multi-word
  case-insensitive AND search over term+definition+category+formulaLabel+
  formula. Empty state "No terms in this light cone." (role=status). Footer
  microcopy "Definitions are standard physics — see the notebook essays for
  worked ideas." No framer-motion; CSS transitions only.
- EDIT src/components/site/navigation.tsx: BookMarked icon button (h-9,
  aria-label "Open the physics lexicon") next to the ⌘K trigger; mobile Sheet
  "The Lexicon" dashed-border button after "Search everything" (closes sheet,
  dispatches event). Minimal diffs; untouched everything else.
- EDIT src/components/site/command-palette.tsx: new "Reference" CommandGroup
  between Notebook and Actions — "Open the lexicon — physics glossary" item
  (BookMarked icon, value "lexicon glossary dictionary terms reference",
  run() → dispatch phys:open-lexicon). Existing groups untouched.
- EDIT src/app/page.tsx: <Lexicon /> mounted right after <CommandPalette />.
- Did NOT touch notebook.tsx / research.tsx / projects.tsx / footer.tsx /
  globals.css (concurrent agent owns notebook.tsx).

QA (agent-browser, default session; desktop 1440×900 + mobile 375×812):
- Nav button click → dialog opens: 24 term rows, 24/24 KaTeX expressions
  rendered with 0 .katex-error nodes, eyebrow/footer/count correct, focus
  lands in the search input.
- Search "entropy" → exactly 1 row (Entropy). Nonsense query → aria-live
  "No terms in this light cone." visible, 0 rows.
- Category chip "Cosmology" (aria-pressed=true, others false) → exactly
  Cosmological Constant + Hubble Parameter.
- seeAlso click ("Einstein Field Equations") → query set to that term,
  category reset to All, exactly 1 matching row, focus back in input.
- ⌘K path: Ctrl+K → typed "lexicon" → single "Open the lexicon — physics
  glossary" option selected → Enter → palette closes, lexicon opens with 24
  terms + focused empty search.
- Mobile: sheet menu shows SEARCH EVERYTHING + THE LEXICON; lexicon button →
  sheet unmounts, dialog opens (343px wide), dialog height exactly 690px =
  85vh, inner ledger scrolls (scrollTop 600 verified), no horizontal overflow.
- Light "Archival Journal" theme verified (ink-on-paper, cyan accents legible).
- VLM review of qa/r2b-lexicon.jpeg: PASS on composition, typeset formulas
  (no raw LaTeX), no overflow/clipping, ledger consistency, dark scientific
  aesthetic — zero defects. VLM on mobile+light flagged "missing formula/
  truncated definition" for the Action row — disproven via DOM (plate visible
  198px, full 197-char definition present); artifact of the mid-scroll crop.
- Screenshots: qa/r2b-lexicon.jpeg (desktop dark), qa/r2b-lexicon-mobile.jpeg,
  qa/r2b-lexicon-light.jpeg; VLM JSONs qa/vlm-r2b-lexicon.json,
  qa/vlm-r2b-mobile-light.json.
- bun run lint: clean (exit 0). bunx tsc --noEmit: zero errors under src/
  (only pre-existing examples/ + skills/ errors outside app tree). dev.log:
  clean compiles, all GET / 200.

Stage Summary:
- The Lexicon is live site-wide: 24 accurate physics terms with correct
  KaTeX formulas, reachable from the nav bar, the mobile sheet menu, and the
  ⌘K palette (Reference group), all through the phys:open-lexicon event.
  Search + category filtering + see-also cross-links + empty state verified
  in-browser on desktop and mobile, dark and light themes; lint and tsc
  clean. Fully decoupled from section internals; notebook.tsx untouched.
- Risks/notes: (1) seeAlso sets the search to the target's full term name —
  multi-word terms match any term containing all those words (by design, the
  target is always included); (2) the dialog renders all 24 rows at once —
  fine at this scale, would need virtualization if the glossary grew past
  ~200 terms; (3) "N terms" eyebrow count is derived from data, so it stays
  honest if terms are added later.

---
Task ID: R2 (review round — main agent)
Agent: main-agent
Task: Status assessment, QA, bug fixes, mandated styling detail + feature expansion

Work Log:
- Baseline assessment: dev server healthy (GET / 200), console clean, no page
  errors, no horizontal overflow (1440 & 375). VLM baseline review 7/10 —
  flagged items were intentional honest placeholders or screenshot-scroll
  artifacts; two actionable nits (low-contrast floating control, hover label
  never showing) fixed below.
- Dispatched two parallel subagents (see R2-a / R2-b entries):
  · R2-a: notebook essay deep-links (#note-<id> — initial load, back/forward,
    TOC-anchor immunity, hash cleanup on close) + "Copy link" button with
    sonner toast. Browser-verified by subagent; re-verified in regression.
  · R2-b: The Lexicon — 24-term searchable physics glossary dialog (search +
    category chips + KaTeX formula plates + see-also links), reachable from
    nav bar, mobile sheet, and ⌘K palette Reference group.
- NEW FEATURES (built by main agent this round):
  1. Keyboard shortcuts help ("The Keyboard, a Quiet Instrument.") — ?
     opens an operating-manual dialog (shortcuts-help.tsx). Component also
     owns the new global letter hotkeys: L → lexicon, T → theme toggle —
     all guarded against typing contexts and against any open dialog/palette
     stage. Palette Reference group gained "Keyboard shortcuts — the
     operating manual" item; palette footer hint now reads "...esc close · ?
     manual".
  2. "This month in physics history" footer almanac (physics-history.tsx +
     physicsHistory content in site.ts) — 12 real, verifiable milestones
     (Galileo's moons 1610, Chadwick's neutron 1932, Einstein's birth/1905
     papers/1915 field equations, Great Debate 1920, Eddington 1919, Higgs
     2012, Faraday 1831, Solvay 1927, Planck 1900). Opens on the current
     month (October → Solvay 1927 verified), chevrons page all 12 with
     aria-live announcement + month counter; footer restructured so the
     strip is a full-bleed section between colophon grid and bottom bar.
- STYLING DETAIL polish (mandated):
  · .equation-plate utility (globals.css) — display equations framed as
    instrument plates: fine plotting grid, hairline border, photon-cyan
    register-mark corner ticks. Applied to research + projects dialog
    equations (replacing plain bordered blocks); print rule added.
  · Research & projects card equation strips now carry bg-plot-grid texture.
  · Ascend button: group class added so the "ASCEND" hover label finally
    shows (was dead code); icon lifts on hover; bg contrast raised
    (bg-card/90); near page bottom it now fades out (footer's own "Back to
    orbit" takes over) — fixes VLM-flagged FAB/copyright crowding on mobile.
  · Nav + footer wordmark orbit icon spins 180° on hover (700ms ease-out).
  · A11y: mobile Sheet gained SheetDescription (observatory note) — kills
    the last Radix "Missing Description" console warning.
- VERIFICATION (agent-browser desktop 1440×900 + mobile 375×812):
  · Hotkeys: synthetic keydown "?" opens manual (headless Chromium cannot
    synthesise "?" via press — handler proven via KeyboardEvent); L opens
    lexicon; T toggles dark↔light (class swap verified both ways).
  · Almanac: October shown on load, next → November 1915 EFE entry,
    prev/next buttons present, mobile stacked layout 9/10 per VLM.
  · Equation plate present in research dialog (DOM + screenshot; VLM 9/10).
  · Shortcuts dialog VLM 9/10 (kbd styling, alignment, contrast praised).
  · Regression: essay deep-link opens + copy-link button present + Escape
    clears hash; mobile sheet contains "Search everything" + "The Lexicon"
    and the lexicon opens from it; FAB opacity 0 at bottom, 1 mid-scroll;
    scrollWidth=clientWidth at 1440 and 375; zero page errors; console
    clean after reload + sheet open.
  · bun run lint: clean (exit 0). bunx tsc --noEmit: zero errors under src/
    (pre-existing examples/ + skills/ errors only). dev.log: GET / 200s,
    no runtime errors ("Failed to start server" line is from a harmless
    duplicate EADDRINUSE dev-server attempt, not the running instance).

Stage Summary:
- Site now additionally has: essay deep-linking + copy-link, a 24-term
  searchable lexicon, global hotkeys with an operating-manual dialog, and a
  physics-history almanac — plus equation-plate framing and micro-polish
  across cards, buttons, wordmark, and mobile sheet. All QA-verified desktop
  + mobile, both themes, lint + tsc clean.
- Known non-blocking notes: agent-browser `keyboard type` dispatches no
  page key events (tool quirk; hotkeys verified via synthetic
  KeyboardEvents); Radix aria-controls useId hydration warning on the
  mobile sheet trigger remains dev-mode noise (pre-existing, functional).
- Cron task creation retried twice this round — cron tool still returns
  "not available for this request" (gateway limitation). The intended job:
  every 15 min (0 */15 * * * *), kind webDevReview, tz Asia/Calcutta,
  message as recorded in the R1-cron entry. REMAINING CARRY-OVER.
- Next-phase candidates: real content replacement (name, portrait,
  channels, CV) still awaits the owner; optional LLM-powered "ask about
  this essay" assistant; publication list when real; analytics-free
  performance pass (canvas frame budgets) if ever needed.
