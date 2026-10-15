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

---
Task ID: R3-a
Agent: subagent
Task: "Ask about this essay" — LLM-powered Socratic companion in the notebook
reading view (the site's first AI feature)

Work Log:
- Read skills/LLM/SKILL.md fully before any backend code; probed the SDK
  first with a one-off bun script confirming the exact call shape works:
  default import ZAI, `await ZAI.create()`, `zai.chat.completions.create({
  messages, thinking: { type: "disabled" } })`, answer at
  `completion.choices?.[0]?.message?.content`. The `system` role IS accepted
  (SDK ChatMessage type allows system|user|assistant), so the conversation is
  [{role:"system", …}, …history, {role:"user", question}] as specced.
- NEW src/app/api/ask/route.ts (POST only, `export const dynamic =
  "force-dynamic"` + Cache-Control: no-store on every response):
  · Zod validation matching the contact route's style: noteId non-empty;
    question trimmed 5–600; history array (default []) max 8 entries, each
    role enum "user"|"assistant" + content trimmed 1–2000. Failures → 400
    { error } with the first human-readable issue message.
  · Rate limit copied from the contact route: in-memory sliding window,
    12 requests / 10 min / IP (x-forwarded-for first hop, fallback "local")
    → 429 { error } ("That is a lot of questions for one sitting…").
  · Unknown noteId or note without essay → 404 { error: "Essay not found." }.
  · System prompt (honest + grounded): study companion for ONE essay, not
    its author; the essay's actual title, dek, every section heading +
    paragraphs with $…$/$$…$$ delimiters stripped but LaTeX source kept
    inline (math stays discussable), plus the essay's verbatim reference
    list; capped at 8000 chars with a graceful line-boundary cut + truncation
    note. Style rules: reader's language, ≤250 words, Socratic but direct
    (answer first, at most ONE closing probe, never a bare question), plain
    language/short paragraphs, LaTeX inside $…$ for the UI's <Prose>, NEVER
    invent citations/quotes/page numbers/historical claims, say so when
    unsure, flag answers that go beyond the essay.
  · SDK failure or empty completion → console.error (server log only) + 502
    { error: "The assistant is momentarily unavailable…" } — no stack leaks.
  · The SDK import lives ONLY in this route file (never client code).
- NEW src/components/site/ask-assistant.tsx ("use client", no SDK import):
  · Collapsed: full-width dashed mono uppercase toggle "ASK ABOUT THIS
    ESSAY — AI COMPANION" (Sparkles + rotating ChevronDown, aria-expanded/
    aria-controls, site dashed-affordance styling + focus-visible ring).
  · Expanded panel (rounded-lg border border-border bg-card/60): header row
    "Socratic companion" + "AI · can make mistakes" tag; one-line honest
    disclosure; message list (max-h-60, overflow-y-auto, aria-live=polite,
    auto-scrolls to newest) — user turns right-aligned bubbles, assistant
    turns with photon left rule rendered via existing <Prose> (answers with
    $math$ typeset; blank-line paragraphs preserved, single breaks kept);
    Loader2 + mono "Consulting the essay…" while loading.
  · Input row: shadcn Textarea rows=2 maxLength 600 with mono placeholder;
    Enter submits / Shift+Enter newline (keydown guard incl.
    nativeEvent.isComposing); send Button (sm, Send icon + "Ask") disabled
    while loading or <5 trimmed chars (client-side block). Character counter
    appears past 500, amber past 560 (contact-form pattern). Errors: inline
    mono aria-live line for well-formed server errors (400/404/429/502 — no
    toast); sonner toast ONLY for unexpected failures (network throw /
    unparseable body). Thread kept fully in state; displays last 12 turns
    with "…earlier turns kept brief" note; sends last 8 turns as history.
  · Two suggested-question chips (mono, dashed, fill input + focus it) shown
    only while the thread is empty.
- EDIT src/components/site/notebook.tsx only: ReadingView now mounts
  <AskAssistant note={note} /> inside .reading-measure after the References
  section, with the "Example essay · placeholder content…" footnote moved to
  remain the LAST element (DOM order verified: refs 6 → assistant 7 →
  footnote 8). Panel scrolls with the essay, not fixed. No other files
  touched (concurrent-agent ownership respected).

QA (curl + agent-browser --session r3a, isolated to avoid session clashes):
- curl matrix: valid ask → 200 {"answer": …} in ~1.7 s; question "hi" → 400;
  601 chars → 400; 9 history entries → 400; role "system" in history → 400;
  malformed JSON → 400; unknown + planned (essay-less) noteIds → 404
  "Essay not found.".
- Browser E2E: opened localhost:3000, location.hash="#note-spacetime-curved"
  → reading dialog; scrolled to toggle, clicked → panel expanded
  (aria-expanded=true, chips + textarea + disabled Ask visible). Chip click
  fills input. "hi" keeps Ask disabled (client-side block).
- Real conversation (3 exchanges, all POST /api/ask 200 in dev.log):
  · "In one sentence, what does the essay say curvature means?" → "…curvature
    means that distances and angles between events in spacetime refuse to
    follow the flat rulebook of Euclidean geometry, as measured by
    inhabitants within spacetime itself." + one Socratic probe. Grounded in
    §3 verbatim phrasing.
  · "Write the triangle-angle rule from section 3 as an equation…" →
    α+β+γ=π+A/R² rendered by KaTeX (5 .katex nodes, 0 .katex-error) + symbol
    glossary + probe — proves history/context passing and $…$ rendering.
  · "What about the rubber sheet?" → quoted the essay's actual line
    ("explains gravity by using gravity and so explains nothing…") + probe.
  · Post-error recovery question → "Light bending around the Sun." (§5).
- Enter submits (press Enter AND synthetic keydown both proven); synthetic
  Shift+Enter keydown: defaultPrevented=false, no submission (agent-browser
  cross-CLI keydown/keyup doesn't hold modifiers — tool quirk noted in R2;
  handler verified via synthetic events instead).
- Error paths via network route mocks: well-formed {"error": …} → inline
  mono error, NO toast, input preserved for retry; unparseable body →
  inline fallback + sonner toast "The essay companion failed to answer.";
  after unroute, next real question answered normally.
- Rate limit: burned the sliding window with cheap 404 probes → HTTP 429
  {"error":"That is a lot of questions for one sitting — please try again
  in a few minutes."} logged in dev.log (took 16 total hits because early
  hits had already slid out of the 10-min window — sliding drain works).
- Counter: 520 → "520 / 600" muted; 570 → amber span verified; ≤500 hidden.
- No page errors / console errors during the whole session. Mount order
  refs→assistant→footnote verified in DOM. Mobile 375×812: no horizontal
  overflow (375=375), panel 293px wide inside viewport.
- Screenshots: qa/r3a-ask.jpeg (desktop, thread w/ user bubble + photon-rule
  answer + input row; VLM-verified: header+honesty tag+disclosure, cyan left
  rule, typeset math confirmed in the bottom-scrolled capture, no layout
  defects — the "cut-off" second question is the max-h-60 scroll boundary,
  by design) + qa/r3a-ask-mobile.jpeg (mobile).
- bun run lint: clean (exit 0). bunx tsc --noEmit: zero errors under src/
  (only pre-existing examples/ + skills/ errors, untouched).

Stage Summary:
- The notebook reading view now has an honest AI study companion: a dashed
  mono toggle expands a "Socratic companion" panel whose answers come from
  /api/ask — zod-validated, rate-limited (12/10 min/IP), grounded in the
  essay's real text (LaTeX source kept discussable, references included,
  8000-char cap), with an honesty header/disclosure and inline error
  handling. Answers quote the essay accurately, typeset $…$ math via the
  existing <Prose>, and end with a single probing question; multi-turn
  history works (last 8 sent, last 12 shown). Lint/tsc clean; verified
  end-to-end in-browser with real LLM answers, error paths, rate limiting,
  and mobile layout. No files outside the three owned ones were touched.
- Risks/notes: (1) rate-limit window was saturated by the 429 test — /api/ask
  returns 429 until roughly 10 minutes after the last probe (drains
  automatically; dev-server restart also clears the in-memory map);
  (2) in-memory rate limiting + no session persistence means reloads reset
  the visible thread (history lives only in component state, by design —
  no storage/tracking); (3) answer length/style depends on the model — the
  ≤250-word instruction is soft; (4) the essay prompt budget (8000 chars)
  will truncate future longer essays mid-text — the system prompt tells the
  model to treat post-truncation content as unavailable; (5) agent-browser
  keydown/keyup across CLI calls does not hold modifiers (Enter-to-submit
  proven via press + synthetic events; Shift+Enter via synthetic events).

---
Task ID: R3-a (subagent)
Agent: subagent
Task: "Ask about this essay" — LLM-powered Socratic companion

Work Log:
- Read skills/LLM/SKILL.md; built POST /api/ask (zod validation, 12/10-min/IP
  rate limit, 404 unknown notes, 502 on SDK failure, no-store). SDK lives
  only in the route (server-side).
- ask-assistant.tsx: collapsible dashed panel in the reading view —
  suggestion chips, Enter-submits/Shift+Enter-newline, char counter,
  loading dots, answers rendered through <Prose> (KaTeX math typesets),
  honest "AI · can make mistakes" disclosure, aria-live.
- notebook.tsx: panel mounted between References and the footnote.
- E2E verified with REAL answers (curvature summary, math follow-up with
  α+β+γ=π+A/R² typeset, verbatim §6 quote), full validation matrix
  (400/404/429 paths), mobile 375 no overflow, lint + tsc clean.
- Full details in this entry's own worklog section (appended by subagent).

Stage Summary:
- The site's first AI feature is live and honest: grounded answers about
  each readable essay, clearly labelled as AI, rate-limited, no fabricated
  citations.

---
Task ID: R3 (review round — main agent)
Agent: main-agent
Task: Status assessment, QA, mandated feature + styling expansion

Work Log:
- Baseline QA clean (200, no errors/warnings, no overflow 1440/375).
- NEW FEATURES:
  1. Site-level motion preference — "calm the universe"
     (lib/motion-preference.ts): localStorage override layered over the
     OS prefers-reduced-motion; explicit choice always wins.
     · providers.tsx rewritten: useSyncExternalStore-driven MotionConfig
       (reducedMotion "always" when calm) + context + <html>.motion-calm
       class hook (CSS: scroll-behavior auto + transition/animation kill,
       mirroring the media query). Lint-clean (no setState-in-effect).
     · motion-toggle.tsx: nav Zap/ZapOff button (aria-pressed, M
       shortcut, hydration-guarded icon), visible on mobile too.
     · M hotkey in shortcuts-help (+ manual row); "Calm the universe"
       action in ⌘K palette; palette goTo + ascend button now respect
       the preference for smooth scrolling.
     · Canvas wiring: black-hole + deep-field read the lib and react to
       phys:motion events live (cancel loop + static frame / restart);
       orbits + wave sims swapped their matchMedia helpers for the shared
       store — auto-pause under calm, auto-resume on restore (verified:
       Play overlay appears under calm, disappears on restore).
  2. LLM "Ask about this essay" companion — dispatched to subagent
     (R3-a above); re-verified myself post-restart: curl POST /api/ask
     → HTTP 200 with a real grounded answer; panel present in the
     reading view (DOM + screenshot).
- STYLING DETAIL:
  · Research cards: photon-cyan top-edge line that sweeps in on hover
    (before: gradient, origin-left, 500ms). Projects cards: same in
    nebula violet (matching their example badges).
  · Publications empty state: faint "uncharted constellation" SVG
    (hairline connections + photon stars, aria-hidden, 16/22% opacity).
  · .link-quiet utility: animated underline that grows from the left —
    applied to footer index links.
  · aria-keyshortcuts on nav triggers (⌘K palette, L lexicon, M motion).
  · Print: almanac month pager hidden via data-print="hide".
- VERIFICATION:
  · Motion system: toggle click → html.motion-calm + localStorage "1" +
     aria-pressed true + label swap; M hotkey toggles both ways; palette
     action present; 3 rapid toggles → zero page errors; deep-field
     renders a static frame under calm (lit pixels verified); orbits
     auto-pause/auto-resume verified; fresh browser session → zero
     page errors.
  · Radix tabs note: synthetic eval clicks don't activate Radix tabs —
    real agent-browser clicks DO (verified switching works; not a bug).
  · Overflow: 1440=1440, 375=375. lint exit 0; tsc zero errors under
    src/. VLM review of ask-panel + publications constellation:
    9.5/10, zero defects.
  · Dev server died mid-round (post-subagent) — restarted detached,
    dev.log was truncated at some point during the subagent's run (its
    api/ask log lines lost), so I re-verified /api/ask live via curl.
- Cron task creation retried again this round — STILL "cron tool is not
  available for this request" (gateway limitation; same job definition
  preserved in R1-cron entry).

Stage Summary:
- The site now has: a genuinely accessible site-level motion preference
  wired through framer-motion AND all five canvas instruments, plus its
  first AI feature (grounded essay Q&A), plus a styling detail pass
  (card edges, constellation, link underlines, print polish).
- Known notes: (1) dev.log truncated once during R3-a — verify API
  health by curl, not only logs, after restarts; (2) motion preference
  is per-browser (localStorage) — first paint always animates until
  hydration reads the store; (3) ask-assistant thread is session-only
  by design.
- Next-phase candidates: lab instrument presets (one-tap experiments),
  LLM assistant for research areas (same pattern as essays), real
  content replacement (name/portrait/channels) when the owner is ready.

---
Task ID: R4-a
Agent: subagent
Task: One-tap experiment presets for the three lab instruments

Work Log:
- NEW src/components/site/lab/preset-chips.tsx — shared presentational
  component: "EXPERIMENTS" label (mono 10px, tracking 0.2em), chip row
  (role="group" + aria-label, flex-wrap gap-2, aria-pressed chips, spec'd
  chip classes incl. active border-photon/60 bg-photon/10), plus
  presetParamEq() float compare (tol 1e-6 — covers Radix float32 slider
  noise ~1e-7). Presets live INSIDE each sim's control panel; lab.tsx
  untouched (zero edits).
- lensing-sim.tsx (+3 chips): "Einstein ring" θ_E=110 · starfield · ring
  guide ON · lens reset to default plate position; "Double image" θ_E=70 ·
  starfield · guide ON · lens programmatically offset 0.35·θ_E (diagonal,
  magnitude 0.35θ_E — u=|β|/θ_E=0.35 → images at +1.190 θ_E and −0.840 θ_E,
  μ=2.99); "Caustic grid" θ_E=90 · coord-grid mode · guide ON · aligned.
  Lens position IS programmable (lensRef) → presets place it; new
  lensMoved state (set by pointerdown/drag/arrow-keys) participates in
  active-chip comparison so a hand-dragged lens clears the highlight.
  State+refs set together, dirtyRef flip → redraw (no play/pause concept
  in this instrument).
- orbits-sim.tsx (+4 chips): "Perfect circle" f=1.00, m₂/m₁=0.20, trails+
  analytic ON (ε=−0.500, e=0, T=2π); "Elliptical orbit" f=0.75 (ε=−0.719,
  e=0.438, launch at apoapsis, T=3.65); "Close escape" f=1.45 (ε=+0.051,
  e=1.103 — just past √2≈1.414; analytic toggle switched OFF because the
  dashed-conic renderer only supports bound orbits — switch state kept
  truthful); "Binary dance" m₂/m₁=0.50 max, f=1.00 (barycentre waltz at
  ⅓/⅔ separation). PHYSICS CORRECTION: the task brief claimed f=1.25 →
  e>1; actually ε=f²/2−1=−0.219 → e=0.5625 BOUND. Escape was unreachable
  (old slider max 1.25 < √2), so the launch-speed slider max was extended
  1.25 → 1.5 and the caption now states the f=√2 escape threshold. Preset
  apply = set all params + resetSim(f) (f only takes effect on reset) +
  auto-play iff !playing && !reduceMotion (calm keeps it paused, overlay
  play button intact; explicit user pause/play overrides respected).
- wave-sim.tsx (+3 chips): "Textbook tunneling" E=1.40, V₀=1.60, w=2.0
  (plane-wave T=0.141; measured packet T plateau ≈0.29 — broad-packet
  energy spread, as the instrument's own note explains); "Over the wall"
  E=2.20 (T_pw=0.757; measured ≈0.59–0.63 at plateau, visible reflection
  ripple); "Thin barrier" E=1.00, w=0.8 (T_pw=0.487; measured ≈0.48 —
  nearly half the packet through a wall it cannot climb). Preset apply
  writes energyRef/v0Ref/wRef DIRECTLY (state→ref mirrors only run
  post-render), then buildSystem() + resetSim() + auto-play rule as
  orbits. Redundant post-render buildSystem from the mirror effects is
  idempotent. Active comparison covers E/V₀/w only — sim-speed slider is
  a view param, presets don't own it (same for orbits).
- NUMERICAL VERIFICATION (offline bun replica of each sim's exact internal
  math + live browser cross-check):
  · orbits: circle e=0.0000, ΔE drift −0.000%, r≡1.000; ellipse e=0.4375,
    r∈[0.391,1.000], drift 0.000%; escape e=1.1025, ε=+0.0513, r→12.7 at
    t=20, drift +0.001%; binary = circle + ratio display. LIVE readouts
    matched: 0.437/0.696/−0.719/3.6τ, 1.103/—/+0.051/unbound, 0.000/1.000/
    −0.500/6.3τ.
  · wave: browser readout "pw" values 0.141/0.757/0.487 match formula
    exactly; measured packet R/T/A at matched simulated times agree with
    the offline replica to ~0.01 (e.g. Over-the-wall at t=17.9: browser
    R=0.363 T=0.514 A=0.121 vs replica t=18: 0.363/0.510/0.125).
  · lensing: mapping round-trip β=θ−θ_E²/θ returns exactly 0.350000 for
    both image positions ±(1.190, −0.840)·θ_E.
- QA (agent-browser --session r4a, 1440×900 + 375×812):
  · Every chip on every instrument: params verified via aria-valuenow +
    readouts (lensing 110/70/90 + grid radio; orbits f/mass + live e-ε-T;
    wave E/V₀/w + pw), active chip aria-pressed=true with photon classes,
    one-at-a-time exclusivity.
  · Manual slider change clears highlight on all three (lensing θ_E
    110→112; orbits mass 0.5→0.49; wave E 1.0→1.05). Lens drag clears via
    lensMoved (code path exercised by pointer handlers).
  · Auto-play after preset (default session) and calm-mode (localStorage
    phys:motion-reduced=1 → html.motion-calm): orbits + wave presets apply
    params + reset but STAY PAUSED (play overlay visible); calm cleared
    afterwards (verified motion-calm=false after reload).
  · Mobile 375: scrollWidth=375=clientWidth (no overflow); chips wrap
    2+1 (lensing, wave) and 2+2 (orbits). Bonus qa/r4a-mobile-375.jpeg.
  · Zero page errors / console errors throughout; dev.log clean.
  · Screenshots: qa/r4a-lensing.jpeg (Einstein ring applied, θ_E=110,
    ring distortion + dashed guide), qa/r4a-orbits.jpeg (ellipse applied:
    trail + dashed analytic conic + P/A ticks), qa/r4a-wave.jpeg (mid-
    tunneling t=10.3: packet straddling barrier, R=0.359/T=0.264). VLM
    review of all three (qa/vlm-r4a-*.json): chips present + correct chip
    highlighted + correct physics visible + correct readouts; no layout
    defects (one pre-existing nav-tracking nit "NOTESLAB" noted by VLM —
    nav design, unrelated to this task).
- bun run lint: exit 0. bunx tsc --noEmit: zero errors under src/ (only
  pre-existing examples/ + skills/ errors). git status: only the 3 sim
  files modified + preset-chips.tsx added; lab.tsx/notebook.tsx untouched.

Stage Summary:
- Each lab instrument now has a one-tap EXPERIMENTS row (3/4/3 chips) that
  sets every parameter, places/resets the state the way the phenomenon
  needs, and plays it (unless the visitor prefers calm) — with the active
  experiment highlighted and manual tweaks honestly clearing it. All
  preset physics was verified numerically against the sims' internal math
  (analytic values + an exact offline replica + live browser readouts).
- The escape preset exposed and fixed a real instrument limitation: the
  launch-speed slider could never reach escape speed (√2); range now
  0.5–1.5 with the threshold documented in the caption.
- Risks/notes: (1) lensing lens placement resets to the default position
  on window resize (existing behavior for dragged lenses too) — the chip
  highlight can outlive that reset; harmless, rare. (2) wave R/T readouts
  are instantaneous values that decay as the caps absorb the outgoing
  packets (existing semantics) — quoted plateau numbers are the honest
  measurement window (t≈10–20), before wall-bounce scrambling; auto-pause
  (total<0.03) takes minutes because cap absorption is gradual — also
  pre-existing. (3) "Close escape" turns the analytic overlay off (the
  dashed-conic renderer is bound-only by design); a future enhancement
  could draw the hyperbola branch. (4) Sim-speed sliders are deliberately
  outside preset comparison (view params); changing them keeps the chip
  lit. (5) Tab switches remount sims (Radix default), so preset state
  resets between instruments — existing behavior, matches everything else.

---
Task ID: R4-a (subagent)
Agent: subagent
Task: One-tap experiment presets for the three lab instruments

Work Log:
- New shared preset-chips.tsx (PresetChips component + param comparator);
  preset rows added inside each sim's control panel (lab.tsx untouched).
- Lensing: Einstein ring / Double image / Caustic grid (lens position
  programmatically placed; u=0.35 offset verified: images at ±1.19/−0.84 θ_E,
  magnification 2.99). Orbits: Perfect circle / Elliptical / Close escape /
  Binary dance — PHYSICS CORRECTION: escape needs f > √2, so launch slider
  max extended 1.25 → 1.5 and escape preset uses f=1.45 (verified live by
  main agent: e=1.103, ε=+0.051, "unbound"). Wave: Textbook tunneling /
  Over the wall / Thin barrier (T values verified against an offline CN
  solver replica). Full details in the subagent's own entry above.

Stage Summary:
- All three instruments now teach through one tap; active preset chips
  highlight and clear on manual parameter change. Reduced-motion-safe.

---
Task ID: R4 (review round — main agent)
Agent: main-agent
Task: Status assessment, QA, mandated feature + styling expansion

Work Log:
- Baseline QA fully stable (200, zero errors, clean console, no overflow
  at 1440/375, dev.log clean).
- NEW FEATURES:
  1. Reading-view TOC scroll-spy (notebook.tsx): IntersectionObserver
     (root = the scrollable article, band -15%/-70%) tracks the section
     currently under the eye; contents rail updates on scroll AND clicks.
     Verified both directions (section 4 → 04 active, back to 2 → 02).
  2. Lab experiment presets — dispatched to subagent (R4-a above);
     independently re-verified: all 3 groups present (3/4/3 chips),
     Thin-barrier preset sets E=1.0/V₀=1.6/w=0.8 + highlights, manual
     E nudge clears highlight, Close-escape sets f=1.45 (slider max now
     1.5) with live e=1.103 readout.
- STYLING DETAIL:
  · Notebook ledger rows: hover/focus-visible background tint
    (hover:bg-muted/40) for clearer affordance.
  · Contact channels: per-channel lucide glyphs (Mail, Github, Linkedin,
    GraduationCap, Fingerprint) — quiet scanning anchors; 5 render.
  · Hero primary CTA: photon-tinted hover glow in dark theme
    (dark:hover:shadow-photon/25) + lift.
  · Removed the temporary CSS refresh marker after the Turbopack
    staleness remedy.
- VERIFICATION:
  · TOC scroll-spy both directions ✓; preset matrix ✓ (params, highlight,
    manual clear, escape physics); channel icons ✓ (5 svg); mobile 375
    no overflow including preset chip rows ✓; fresh desktop console
    clean ✓; lint exit 0; tsc zero new errors under src/ ✓.
  · Investigated a headless-only false negative: Tailwind hover variants
    are @media (hover: hover)-gated; this headless Chromium reports
    hover:none, so hover styles CANNOT render in QA screenshots —
    verified the generated CSS rules + selector matching are correct.
    Real pointer devices will show the tints. (Documented so future
    rounds don't chase it.)
  · VLM review: labs 9.5/10 ×2 (chip styling praised, active state
    clearly differentiated). Two flags investigated and disproven:
    "nav overlaps text" = intentional glass-panel scroll-under;
    "low contrast heading" = measured #F2F4F8 on #080A0F ≈ 17:1.
- Cron task creation retried — still "cron tool is not available for
  this request" (job definition preserved in R1-cron entry).

Stage Summary:
- The lab now teaches through one-tap experiments (with a genuine
  physics correction: escape trajectories finally reachable), the essay
  reading view tracks your position in the contents rail, and another
  styling detail pass landed (ledger tints, channel glyphs, CTA glow).
- Known notes: (1) hover styles unverifiable in headless QA (media-gated)
    — verify via generated CSS, not screenshots; (2) lensing lens
    position resets on window resize (pre-existing, harmless);
    (3) wave R/T readouts are instantaneous snapshots by design.
- Next-phase candidates: research-area AI companion (same pattern as
  essays), hyperbola overlay for the escape regime, real content
  replacement when the owner is ready.

---
Task ID: R5-a
Agent: subagent
Task: Research-area AI study companion ("Ask about this area")

Work Log:
- Read worklog R3-a entry + all reference files (api/ask/route.ts,
  ask-assistant.tsx, content/research.ts, skills/LLM/SKILL.md) before
  writing anything; mirrored the essay-companion pattern deliberately.
- NEW src/app/api/ask-research/route.ts (POST, force-dynamic, no-store on
  every response):
  · Zod schema: areaId non-empty; question trimmed 5–600; history
    (default []) max 8 entries, role enum user|assistant, content
    trimmed 1–2000. First flattened zod message → 400 { error }.
  · Own in-memory sliding-window rate limit (12 req / 10 min / IP,
    x-forwarded-for first hop, fallback "local") → 429 friendly message;
    separate Map from /api/ask.
  · Unknown areaId → 404 "Research area not found."; malformed JSON →
    400 "Malformed request body.".
  · Grounded system prompt from the area's REAL content: title, tagline,
    equation LaTeX kept inline as $…$ (not stripped), equationLabel,
    summary, detail, concepts, verbatim reading list — 4000-char cap
    with graceful line-boundary clamp + truncation note (same algorithm
    as the essay route, smaller budget since areas are compact).
  · Honesty rules baked in: areas are "directions of study and
    fascination — not claimed specialisations"; owner is a learner, not
    an established expert; the AI never claims to be author/owner;
    credentials questions get "interests being earned, not credentials
    claimed"; never invent citations/quotes; beyond-page answers allowed
    from general physics but must be flagged; reader's language, ≤~250
    words, answer first + at most ONE closing probe, LaTeX in $…$.
  · SDK call identical to /api/ask (ZAI.create → chat.completions.create,
    thinking disabled); empty/failing completion → console.error
    "[ask-research]" server-side only + 502 generic message.
- NEW src/components/site/research-ask.tsx ("use client", standalone
  copy-adapt of ask-assistant.tsx — no refactor of the original):
  · Exported ResearchAsk({ area }) — collapsed full-width dashed mono
  toggle "ASK ABOUT THIS AREA — AI COMPANION" (aria-expanded/controls,
  Sparkles + rotating chevron), expanded panel with header "Ask about
  this area" + "AI · can make mistakes" tag + subline "A study
  companion grounded in this page — ask it anything about the area."
  · Thread in component state (last 12 shown, "…earlier turns kept
  brief" note; last 8 sent as history), user bubbles right-aligned,
  assistant turns photon left-rule via <Prose> ($…$ typesets), Loader2 +
  "Consulting this area…" while loading, aria-live=polite + auto-scroll.
  · Input: Textarea rows=2 maxLength 600, Enter submits /
  Shift+Enter newline (isComposing-guarded), counter past 500 (amber
  past 560), inline mono error for well-formed server errors, sonner
  toast only for unexpected failures. Two suggested chips while the
  thread is empty: "Explain the central equation in plain words." /
  "What should I read first, and why?" POSTs
  { areaId, question, history } to /api/ask-research.
- EDIT src/components/site/research.tsx only: import + mount
  <ResearchAsk key={openArea.id} area={openArea} /> as the last child of
  the dialog's space-y-8 container, after "On the shelf" (key isolates
  thread state if the palette ever swaps areas while the dialog is
  open). Diff = exactly 3 added lines; everything else identical.
- QA (curl + agent-browser --session r5a, isolated):
  · curl matrix: valid theoretical ask → 200 {"answer":…} (answer
    restates the page's own $\\delta S = 0$ and integral); 3-char
    question → 400; 700-char → 400; unknown areaId → 404; history role
    "system" → 400; 9 history entries → 400; malformed JSON → 400.
  · Rate limit: burned the window with 8 schema-valid 404 probes →
    13th request (valid) → 429 "That is a lot of questions for one
    sitting…".
  · Desktop E2E: real click on the 01 Theoretical Physics card opened
    the Radix dialog; scrolled to the toggle, clicked → expanded
    (aria-expanded=true, chips + textarea + disabled Ask). Chip click
    filled the input; Ask submitted; real answer appeared (19 .katex
    nodes, 0 .katex-error). Follow-up via Enter ("Is the action always
    a minimum…?") → grounded multi-turn answer quoting the page's own
    "Newton needed one law and an integral" + Susskind reading item +
    ONE closing probe (20 .katex, 0 errors) — history passing works.
  · agent-browser errors: zero page errors desktop AND mobile; console
    clean (only React DevTools info + HMR).
  · Mobile 375×812: dialog opens, panel expands (2 chips), zero
    horizontal overflow (scrollWidth=375=clientWidth, dialog 343px
    wide), textarea + Ask button present. Screenshots:
    qa/r5a-research-ask.jpeg (desktop, thread with 2 exchanges) +
    qa/r5a-research-ask-mobile.jpeg.
  · bun run lint: exit 0. bunx tsc --noEmit: zero errors under src/
    (only pre-existing examples/ + skills/). git status: only my three
    files + qa screenshots (main agent's concurrent qa-r5-*.png files
    untouched).

Stage Summary:
- Every research-area dialog now ends with an honest AI study companion:
  zod-validated, independently rate-limited (12/10 min/IP), grounded in
  the area's real page content (equation LaTeX kept discussable,
  concepts + reading list included, 4000-char cap), with the site's
  learner-not-expert honesty enforced in the prompt. Answers verified
  end-to-end in-browser: real LLM answers, multi-turn history, KaTeX
  typesetting (19–20 nodes, 0 errors), inline error handling, mobile
  layout clean.
- Risks/notes: (1) the 429 test saturated the /api/ask-research window
  — it returns 429 for roughly 10 minutes after the last probe (drains
  automatically; dev-server restart also clears the in-memory map);
  (2) research-ask.tsx deliberately duplicates ask-assistant.tsx per
  the brief — a future round could extract a shared companion if a
  third variant appears; (3) answer length/style is model-dependent
  (≤250 words is a soft instruction); (4) if a future area's content
  grows past 4000 chars, the clamp cuts on a line boundary and the
  prompt tells the model post-cut content is unavailable.

---
Task ID: R5 (review round — main agent)
Agent: main-agent
Task: Status assessment, QA, mandated feature + styling expansion

Work Log:
- Baseline QA (default agent-browser session, desktop 1440×900 + mobile
  375×812): fully stable — 200, zero page/console errors, no overflow at
  either width, dev.log clean. Regression-verified the whole R2–R4
  surface: essay deep-link (#note-spacetime-curved) + TOC + copy-link +
  assistant, L/T/M/? hotkeys, lexicon, lab tab switching (real clicks —
  synthetic eval clicks don't activate Radix, known quirk), orbits
  "Elliptical orbit" preset applies + highlights (aria-pressed=true,
  f=0.75), footer almanac, FAB.
- Dev server died once mid-round (during my notebook.tsx edit window —
  HMR served the transient TDZ state); restarted detached, fresh
  sessions confirm zero errors (the 8-9 EMPTY ✗ entries in the old
  default session are stale connection-refused marks from the downtime
  window, not real page errors — verified via an isolated session and
  performance.getEntriesByType: no failed resources, nav 200).
- NEW FEATURES:
  1. Reading progress bar + header depth shadow (notebook.tsx,
     globals.css): a 2px photon hairline ("the reading measure") sticky
     at the top edge of the reading pane, filled via direct
     style.transform=scaleX writes in the article's onScroll (zero
     re-renders); data-scrolled attribute (>8px) reveals a 14px
     gradient fade (.reading-head::after) under the pinned header.
     Reset effect zeroes scroll + bar on note change. Verified: 0 →
     scaleX(0.174) @500px → scaleX(1) @bottom, mobile 0.073 @400px;
     VLM: "thin, bright cyan progress line … clearly present".
  2. Random page (notebook.tsx + command-palette.tsx +
     shortcuts-help.tsx): dashed "RANDOM PAGE" chip (Shuffle icon,
     ml-auto only sm+, left-aligned on mobile after VLM nit) picks
     from the filtered readable essays (falls back to all readable);
     opens via the deep-link path. Also a palette action ("Open a
     random page — let fate choose") and a global R hotkey.
  3. R hotkey guard: R conflicts with the lab instruments' own
     R-reset — isLaboratoryTarget() (closest("canvas, section#lab"))
     makes the global R stand aside while an instrument holds focus
     (verified: canvas-focused R → no dialog/hash, sim keeps its key;
     body-focused R → essay opens). Manual row added: "R — Open a
     random notebook page — outside the laboratory".
  4. Recently Read trail (notebook.tsx + command-palette.tsx): every
     essay open (ledger/palette/deep-link/random) records
     phys:recent-notes in localStorage (cap 3, dedup, most-recent-
     first); the palette shows a "Recently Read" group at the very top
     with History icons + RESUME kbd; refreshes on palette open and on
     the phys:recent-notes-changed event.
  5. Research-area AI companion — dispatched to subagent R5-a (its own
     entry above: /api/ask-research + research-ask.tsx + research.tsx
     mount); I spot-verified: dialog opens, toggle expands, 2 chips +
     textarea present, VLM "highly coherent with the lab-notebook
     aesthetic".
- STYLING DETAIL:
  · Lexicon search-match highlighting: <mark> glow (photon 26% tint,
    2px radius) on matched words (≥2 chars) in term titles +
    definitions, via a case-insensitive alternation split with capture
    group (odd parts = matches); defensive try/catch on RegExp.
    Verified: "energy" → 12 marks; VLM: "tasteful and professional".
  · Photon caret: input/textarea/select caret-color = var(--photon).
  · Equation plates wake on hover: border tints photon 35% and both
    register ticks brighten to solid photon (300ms transitions).
  · Print: equation-plate register ticks + reading-head fade hidden
    (screen furniture, ink conserved).
- Fixed a real ordering bug in my own edit before it could ship:
  filtered useMemo was declared after openRandomNote used it (TS2448
  + react-hooks/immutability lint error) — moved the memo above; lint
  exit 0, tsc zero errors under src/ since.
- VERIFICATION: all new features E2E'd in-browser (values above);
  mobile 375 no overflow anywhere incl. reading view + filter row;
  hotkey suite + contact API 200 re-verified post-changes; bun run
  lint exit 0; bunx tsc --noEmit zero errors under src/; VLM reviews:
  progress bar ✓ visible & correct, lexicon highlights ✓ tasteful,
  research panel ✓ coherent, mobile filter row ✓ (nit fixed).
- Cron task creation retried (5th time across rounds) — still "cron
  tool is not available for this request" (gateway limitation; job
  definition preserved in R1-cron entry).

Stage Summary:
- The reading experience gained an instrument-grade progress measure,
  fate became a navigation method (Random page: button, palette, R
  hotkey — laboratory-aware), the palette remembers the last three
  essays read, and the lexicon now glows where it matches. Plus the
  research dialogs gained an honest AI study companion (R5-a).
- Known notes: (1) agent-browser `errors` retains stale empty marks
  from any server downtime — always confirm with a fresh session or
  performance entries; (2) recently-read is per-browser by design;
  (3) /api/ask-research rate window was saturated by R5-a's 429 test —
  drains within 10 min or on dev-server restart; (4) hover styles
  remain unverifiable in headless QA (hover:none media gate) —
  documented in R4.
- Next-phase candidates: unify the two AI companions into one shared
  component (deliberate duplication this round), hyperbola overlay for
  the escape regime, "share this experiment" deep links for lab
  presets, real content replacement (name/portrait/channels/CV) when
  the owner is ready.

---
Task ID: R6 (review round — main agent)
Agent: main-agent
Task: Status assessment, QA regression, mandated feature + styling expansion

Work Log:
- Baseline: dev server started detached (200). dev.log clean apart from the
  known duplicate-start EADDRINUSE noise.
- SOLVED the "9 empty ✗ errors" mystery from earlier rounds: agent-browser
  `errors --json` reveals they are NOT empty — they are 9 historical
  entries (7× "Cannot access 'filtered' before initialization" at Notebook
  + 1× turbopack CSS chunk reload error) from R5's HMR edit window, with
  performReactRefresh/scheduleRefresh stack frames. The `errors --clear`
  flag is a no-op in this CLI build (buffer never clears), so the marks
  persist forever. Proof they are stale: identical fingerprint (line
  numbers 123/124/11298/11446/11467/11516/1800/11516) across reloads,
  while performance.getEntriesByType shows 0 failed resources, nav 200,
  and console is clean. Current source has `filtered` (l.87) correctly
  before `openRandomNote` (l.105). QA PROCEDURE UPDATE: always verify page
  health via performance entries + fresh console, ignore the sticky ✗.
- Full regression suite PASSED: L/T/M/R/? hotkeys (M toggles
  phys:motion-reduced in localStorage — earlier checks looked for the
  wrong signal), #note- deep links, lab tab switching + Elliptical preset
  (aria-pressed=true), footer almanac cycling (Oct→Nov→Dec), FAB visible,
  contact API 200 + proper zod field errors, mobile 375 no overflow
  (top/notebook/reading), desktop 1440 no overflow.
- QA red herring diagnosed: my own wildcard `document.querySelector('button').click()`
  had opened a research-area dialog which then "covered" the lab tabs —
  Playwright's covered-element error exposed it. Not a site bug.
- VLM 4-shot review: 8.5/10. Claims verified with DOM measurements before
  acting: hero "equation/CTA overlap" = FALSE POSITIVE (measured 16px
  gap); drop-cap optical misalignment = CONFIRMED on zoomed crop → fixed.
- NEW FEATURE — Shareable experiment deep-links (#experiment=):
  · experiment-link.ts: buildExperimentHash/parseExperimentHash
    (#experiment=<tab>?<k>=<v>&…&preset=<id>), restoreNumber/restoreFlag
    (finite, clamped, fallback — links are untrusted input). `preset` key
    is informational; numeric params always drive the restore.
  · share-experiment.tsx: "Share experiment" dashed chip (Share2→Check,
    clipboard + execCommand fallback + sonner, identical to Copy link).
    params prop is a () => Record function so ref-held lens position is
    read at click time (react-hooks/refs compliant).
  · lab.tsx: parses hash on mount + hashchange → setTab + restoreTick
    bump; deferred 80ms delivery dispatches phys:restore-experiment once
    the target instrument has mounted and measured its canvas; scrolls to
    #lab (calm-aware behavior); toast "Experiment restored from a shared
    link."; manual tab switch clears a stale experiment hash via
    replaceState.
  · Each sim: restore listener effect (lensing: θ_E/mode/ring +
    canvas-normalized lens x/y + lensMoved; orbits: m/f/a/t + resetSim(f)
    + auto-run; wave: E/V/w + buildSystem + resetSim + auto-run).
- NEW FEATURE — Reading measure % readout: 3-digit padded counter
  (000–100%) in the sticky reading header, written by direct textContent
  in the existing onScroll handler (zero re-renders), photon-tinted,
  aria-hidden with sr-only label, reset to 000 on essay change.
- NEW FEATURE — "Next in the notebook" hand-off card at essay end:
  cycles the readable essays (nextNoteOf), styled like a ledger row,
  opens via openNote (pushState → Back returns), resets scroll/counter.
- STYLING DETAIL:
  · Drop cap optical fix: line-height 0.82→0.78, padding-top
    0.06em→0.02em (cap sits on cap height), padding-right 0.12em→0.16em
    (air). VLM re-judgement: PASS.
  · Reading pane: 6px slim scrollbar (Firefox thin + webkit), photon
    thumb on hover; scroll-behavior: smooth for TOC navigation while the
    note-change reset jumps via scrollTo({behavior:"instant"}).
  · TOC active item: 2px photon inset tick via .reading-toc
    a[aria-current="true"].
- Lint friction fixed: react-hooks/refs (new compiler-era rule) flagged
  ref reads during render — resolved via function-prop params +
  effect-scoped restore handlers (wave listener re-subscribes every
  render by design, documented in code).
- VERIFICATION: orbits custom restore (m=0.31/f=0.85 readouts correct);
  lensing preset restore (θ_E=90, Caustic grid aria-pressed=true, grid
  mode); wave restore (E=1.00, Thin barrier pressed); share button
  round-trips exactly `#experiment=orbits?m=0.31&f=0.85&a=1&t=1`;
  graceful error toast when clipboard blocked; hash cleared on manual
  switch; % counter 000→007(400px)→100(bottom); next-card click swaps
  essay + resets; lint exit 0; tsc zero errors under src/; dev.log clean.
- Cron task creation retried (6th time) — still "cron tool is not
  available for this request" (gateway limitation; job definition in
  R1-cron entry remains the spec).

Stage Summary:
- The laboratory is now addressable: any bench state — preset or
  hand-tuned, lens dragged anywhere — serializes into a human-readable
  URL and replays exactly for whoever opens it. The reading view gained
  an instrument-grade position counter and a hand-off to the next essay,
  and the drop cap finally sits on the cap line.
- Known notes: (1) agent-browser `errors --clear` is a no-op — use
  performance entries for health checks; (2) headless clipboard needs a
  stub to verify URL construction (real browsers work via the Copy link
  code path); (3) wave restore listener re-subscribes per render
  (harmless, documented); (4) experiment links are per-instrument — a
  cross-instrument "lab tour" link could come later.
- Next-phase candidates: unify ask-assistant + research-ask into one
  shared companion component; hyperbola overlay for the escape regime;
  real content replacement (name/portrait/channels/CV) when the owner is
  ready; print stylesheet expansion; "open a shared experiment" toast
  deep-links back to the lab after navigation away.
