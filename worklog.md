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

---
Task ID: R7-e
Agent: general-purpose
Task: Unify AskAssistant + ResearchAsk into one shared CompanionPanel

Work Log:
- Diffed ask-assistant.tsx against research-ask.tsx line by line to
  enumerate every behavioral difference before writing anything: the
  two files are byte-identical except for endpoint (/api/ask vs
  /api/ask-research), payload key (noteId vs areaId), root class
  ("mt-10" vs none), suggested questions, collapsed/header labels,
  honesty note, thread/input/send aria labels, loading text,
  placeholder, and the two toast strings. All limits and mechanics
  (QUESTION_MIN 5 / MAX 600, HISTORY_SENT 8, TURNS_SHOWN 12, counter
  at >500 amber >560, Enter-to-send with isComposing guard, inline
  vs toast error paths, focus-on-open, auto-scroll, AssistantMessage
  Prose rendering) are shared verbatim.
- Created src/components/site/companion-panel.tsx exporting
  CompanionPanel with props: endpoint, buildPayload(question, history)
  (history arrives pre-capped to HISTORY_SENT), collapsedLabel,
  headerLabel, honestyNote, threadAriaLabel, loadingText, inputLabel,
  placeholder, sendAriaLabel, suggestedQuestions, toastFailed,
  toastUnreachable, className. The fetch/JSON-parse/ok-check/error
  triage lives once in the shared panel; identical strings ("AI · can
  make mistakes", "…earlier turns kept brief", the inline unexpected/
  network error notes, and the unreachable toast description) are
  shared constants. "use client" first line, quiet physics-flavored
  comments, Tailwind 4 classes copied byte-identical.
- Rewrote ask-assistant.tsx (AskAssistant({ note })) and
  research-ask.tsx (ResearchAsk({ area })) as thin configuration
  wrappers — exact same exported names and prop signatures, so the
  notebook.tsx / research.tsx mount points are untouched. No edits to
  notebook.tsx, research.tsx, src/app/, src/components/ui/, or any API
  route.
- VERIFICATION: bun run lint exit 0; npx tsc --noEmit zero errors
  under src/ (4 pre-existing examples/skills errors ignored).
  agent-browser on localhost:3000: essay dialog #note-spacetime-curved
  opened, companion expanded — header "Socratic companion", honesty
  note, 2 chips, textarea with correct placeholder/sr-only label, Ask
  button; focus lands in textarea on open; typed "Why does gravity
  bend light here?" + Enter → user bubble + grounded assistant answer
  (geodesics) rendered, textarea cleared; 3 chars → Ask disabled,
  5 chars → enabled. Research area 01 dialog: same structural check
  plus "What is the central equation saying?" → real answer about
  δS=0 stationary action. Escape closed both dialogs; console clean
  (only the concurrent agent's Fast Refresh lines); 0 failed resource
  entries. VLM screenshot review of the expanded essay panel: header,
  honesty tag, dashed chips, textarea, Ask button all present, "no
  visual glitches, broken styling, or misaligned borders".

Stage Summary:
- The two AI study companions are now one circuit: companion-panel.tsx
  carries the entire behavior; ask-assistant.tsx and research-ask.tsx
  are ~45-line configuration wrappers with unchanged names, props, and
  mount points. Zero behavior change by construction — every differing
  string became a prop, every shared string a constant, all markup and
  limits copied verbatim from the originals.
- Risk noted: buildPayload returns Record<string, unknown> so the
  wrappers own their endpoint's payload shape (noteId / areaId) — a
  future third companion only needs a route plus one wrapper. The
  thread counter thresholds (500/560) are absolute lengths, not
  fractions of QUESTION_MAX, exactly as before.

---
Task ID: R7 (review round — main agent) + R7-e (subagent)
Agent: main-agent
Task: Status assessment, QA regression, mandated feature + styling expansion

Work Log:
- Baseline: dev server started detached (200). Full QA regression PASSED:
  page health (performance entries: 0 failed resources, clean console),
  hotkeys, #note- deep links (note: use REAL note ids — spacetime-curved,
  speed-of-light…; section ids like "chasing-a-beam" are in-essay anchors,
  not note ids), experiment deep-link restore (m=0.31/f=0.85 + toast),
  lab tab switching, footer almanac cycling, FAB fade zone, contact API
  zod validation, mobile 375 / desktop 1440 zero overflow, lint 0.
- TWO QA-METHOD FALSE ALARMS diagnosed (not site bugs): (1) Radix dialogs
  are position:fixed → offsetParent is always null; use checkVisibility()
  + getBoundingClientRect instead; (2) Radix Tabs respond to real pointer
  events, not JS element.click() — use agent-browser click <ref>.
- REAL BUG FIXED: global letter hotkeys (L/M/R/T) matched only lowercase
  e.key — Shift-held or CapsLock keypresses were dead. shortcuts-help.tsx
  now matches e.key.toLowerCase() ("?" stays case-exact).
- NEW FEATURE — First-sight keyboard hint (keyboard-hint.tsx, mounted in
  page.tsx): one-time chip, lower-left (2.2s rise delay), teaches ⌘K and
  ?; retires on use of any taught key (incl. via palette-opened manual),
  on X-dismiss, or after 30s; persisted in localStorage phys:hint-seen;
  mounted-gate via useSyncExternalStore (react-hooks/set-state-in-effect
  compliant); data-print="hide". Verified: appears → dismiss → never
  returns; ? key retires + opens manual.
- NEW FEATURE — Resume-reading row (notebook.tsx): dashed "Last read —
  <title>" row above the category filters, fed by the shared
  phys:recent-notes trail (ids[0]); click → openNote (pushState deep
  link); hidden while an essay is on stage; refreshes on the
  recent-notes-changed event. Verified round-trip + hash.
- NEW FEATURE — Print system, three parts:
  · globals.css @media print expanded: @page 14mm/16mm margins; hides
    nav/forms/tablists/dialogs/toasters (screen-only experiences) +
    [data-print="hide]; [data-print="only"] reveals the print masthead;
    body 11.5pt/1.55; orphans/widows 3; h2/h3 break-after avoid;
    figures+equation-plates+katex-display break-inside avoid; photon
    accents print in archival teal #0e7c8c (dark-cyan unreadable on
    white); underlined links with offset.
  · page.tsx print-only masthead ("The Physicist — Portfolio ·
    Physics · Mathematics · The Universe · Printed from the site").
  · lab.tsx print catalogue note (paper cannot run simulations);
    the three sims' roots (lensing/orbits/wave) carry data-print="hide"
    so the mathematics cards still print; [role=tablist] hidden in CSS.
  · Affordances: palette action "Print this page — an archival copy"
    (window.print) + footer colophon "Print / PDF" button via new
    print-button.tsx client island (footer stays server-rendered —
    an early direct onClick in the server footer produced a transient
    "Event handlers cannot be passed to Client Component props" HMR
    full-reload, fixed by the island).
  · Verified: print CSS rules present in served sheets, masthead
    display:none on screen, window.print stub invoked from both the
    palette item and footer button.
- R7-e (general-purpose subagent, parallel): AskAssistant + ResearchAsk
  unified into shared CompanionPanel (companion-panel.tsx, ~300 lines);
  both files are thin wrappers with unchanged exported names/props;
  verified by subagent: lint/tsc clean, both dialogs render + answer
  real questions, VLM pass. Main agent re-verified the essay companion
  post-notebook-edit (expand → ask → answer renders, no errors).
- STYLING DETAIL: text-pretty on SectionHeading ledes + hero intro
  (prevents typographic rivers); colophon buttons equalized at 160px
  (min-w-40 justify-center) after measuring VLM's claim (false positive:
  153 vs 138px, print was narrower — equalized anyway for panel rhythm);
  VLM 3-shot review otherwise clean (hint chip legible/aligned, resume
  row consistent, no overlap/clipping).
- TRANSIENT: dev server process died once mid-round (connection
  refused; log shows only the known EADDRINUSE noise + the footer HMR
  error above) — restarted with the double-fork command, 200, all
  features re-verified afterwards.
- Cron task creation retried (7th time) — still "cron tool is not
  available for this request" (gateway limitation; R1-cron spec stands).

Stage Summary:
- Discoverability + addressability improved: first-time visitors are
  taught the keyboard, returning readers resume their last essay in one
  click, and the whole portfolio now prints as a clean archival document
  (masthead, catalogue note for the lab, ink-conserving typography,
  teal photon accents, no dead UI). Hotkeys tolerate Shift/CapsLock,
  and the two AI companions share one implementation.
- Known notes: (1) VLM width claims must be DOM-measured (false
  positive again this round); (2) agent-browser `press T` sends
  uppercase 'T' — lowercase `press t` for letter hotkeys; (3) the hint
  chip appears once per browser (by design) — QA browsers can clear
  phys:hint-seen to re-test; (4) cron gateway still unavailable.
- Next-phase candidates: reading-view "share this essay" with selected
  text quote; a cross-instrument "lab tour" link (serialize all three
  benches); print expansion for the reading view (currently dialogs are
  hidden from print by policy); real content replacement
  (name/portrait/channels/CV) when the owner is ready.

---
Task ID: R8
Agent: main-agent
Task: Status assessment, QA regression, mandated feature + styling expansion

Work Log:
- Baseline: dev server started detached (200). Full QA regression PASSED:
  page health (0 failed resources), L/T/M/? hotkeys (note: `press t` must
  be lowercase; a `press t` issued while a dialog is still exiting gets
  swallowed by design), #note- deep links, #experiment= restore
  (m=0.31/f=0.85 exact), reading % counter (051 @ 40%), next-note card,
  lab tabs + Wave Packet canvas, footer almanac (Nov→Dec), contact API,
  mobile 375 / desktop 1440 zero overflow, KaTeX no mobile overflow,
  FAB, keyboard hint lifecycle. lint 0, tsc clean, dev.log clean.
- VLM 8.2/10 review triaged by DOM measurement — five of its claims were
  false positives (nav icon centers both 32px; grid gap 20==20 H==V;
  Explore links use mt-auto with constant pt-6; about-list radius
  10px == research card 10px; placeholder chips full-opacity
  muted-foreground). ONE real finding: stock shadcn slider thumbs.
- BUG FIXES (real):
  · keyboard-hint.tsx: the retired chip (opacity-0) stayed in the DOM
    WITHOUT inert/aria-hidden — the invisible dismiss X remained Tab-
    focusable. Now aria-hidden={!shown} + inert={!shown} on the aside.
    Verified: after retirement aria-hidden=true + inert=true.
  · contact route: zod type-level messages for absent keys leaked raw
    English ("Invalid input: expected string, received undefined") to
    hand-crafted payloads. All four fields now carry z.string({error:
    "…"}) / z.email({error: …}) type messages identical to their min
    messages. Verified via curl: every missing-key/empty case returns
    the friendly sentence.
- STYLING DETAIL — laboratory sliders became instruments (globals.css,
  scoped to #lab [data-slot=…]): photon-mixed thumb border + double
  photon halo (22%/30% at rest, 32%/48% on hover/focus), energised
  range fill (photon 55% over muted), hairline track (24%). VLM visual
  pass: "resemble scientific instrumentation… readout gauge".
- NEW FEATURE — "Quote this passage" (src/components/site/quote-copy.tsx,
  mounted inside the reading article, which gained `relative`):
  selecting ≥12 chars of essay prose (pointerup/touchend/shift-keyup
  gated so it never flickers mid-drag; selectionchange only ever hides)
  raises a photon-bordered pill beneath the selection (center-clamped
  to the pane, repositioned live on pane scroll, guarded against
  input/textarea/button selections, Escape dismisses, resets on note
  change). Click copies «quote (280-char cap with …)» + em-dash essay
  title + deep-link URL — clipboard API with execCommand fallback,
  success toast, chip folds on success while the selection itself is
  left intact. Verified end-to-end with a navigator.clipboard stub:
  402-char payload exactly as designed; real-browser copy path is the
  same code as the proven Copy link button.
- NEW FEATURE — "Print this essay" (print-essay.tsx button in the
  reading header next to Copy link + full essay-print print-mode CSS):
  clicking stamps html.essay-printing, fills a provenance slot
  ([data-essay-print="url"]) with the essay's deep link, calls
  window.print(), cleans up on afterprint or a 1.2s safety timer.
  In print the whole site steps aside (body > :not([role=dialog])
  display:none), the dialog un-cinemas (static position, un-clipped,
  TOC rail / companion / hand-off card / close X / progress measure /
  % counter all data-essay-print="hide"), a provenance line inks
  ("The Physicist's Notebook · an essay printed from the companion
  site · URL"), minutes·date stay, and the drop cap flattens (float
  first-letters double-render in print engines). The honest
  "Example essay · placeholder content" disclosure prints by policy.
  VERIFIED via agent-browser pdf (print media): 4-page offprint,
  VLM-confirmed black ink, provenance line, serif title, italic dek,
  complete words, no X button, no counter, "professionally typeset".
- THREE deep engineering findings this round (all documented in CSS
  comments):
  (1) TURBOPACK CSS STALENESS: after the first globals.css edit of a
      session, HMR stops serving subsequent edits (the dev.log "No link
      element found for chunk [root-of-the-server]__d9e95593._.css" is
      this wedge). Full pkill + rm -rf .next + double-fork restart is
      the only reliable recovery; happened 3× this round.
  (2) LIGHTNING CSS FOLDS translate/scale/rotate: none into the
      `transform` shorthand (for older browser targets) — so plain
      `translate: none !important` never survives the pipeline
      (verified in served chunk; separate rules get re-merged).
      Workaround: reset the Tailwind variables the utilities consume
      (--tw-translate-x/y/z: 0, --tw-scale-x/y/z: 1) — custom
      properties are minifier-proof. Tailwind 4 centres Radix dialogs
      via the individual `translate: var(--tw-translate-x)
      var(--tw-translate-y)` property, which transform:none cannot
      reset — this was the offprint sliding off the page (left-edge
      clipping + header above page 1).
  (3) DARK-THEME PRINT INK: body { color:#000 } does not cascade past
      explicit Tailwind colour utilities, so the offprint printed in
      washed-out pale greys. Fixed with the same variable trick at the
      dialog scope: --foreground: #14161d; --muted-foreground: #3d4350
      — the whole subtree re-inks while photon accents keep their
      archival teal.
- Final verification: lint exit 0; tsc zero errors under src/; contact
  API all-friendly messages; experiment restore still exact; hint chip
  inert when retired; mobile 375 no overflow; VLM final review of the
  essay view (buttons aligned, chip cleanly positioned, no glitches).
- Cron task creation retried (8th time) — still "cron tool is not
  available for this request" (gateway limitation; R1-cron spec stands).

Stage Summary:
- The notebook gained two research-desk powers: any passage of any
  essay is now quotable with one click (a citation that carries its own
  address), and any essay prints as a clean archival offprint — site
  chrome gone, provenance inked, typography re-set for paper. The lab
  sliders finally look like the instruments they are. Two small real
  bugs fixed (retired hint chip stayed Tab-focusable; raw zod type
  errors on malformed contact payloads).
- Critical pipeline knowledge banked (in CSS comments + this log):
  turbopack CSS HMR wedges after first edit (restart + rm .next);
  Lightning CSS folds individual transform properties — reset Tailwind
  variables instead; dark-theme text re-inks via variable overrides at
  the dialog scope.
- Known notes: (1) essay-print CSS lives inside @media print so the
  class is screen-inert by construction; (2) the quote chip's copy in
  headless QA requires the clipboard stub (same as Copy link); (3) the
  pdftotext plain extraction of the offprint is fragmentary (font
  subsetting) — use pdftotext -layout or VLM on rasterized pages.
- Next-phase candidates: cross-instrument "lab tour" share link
  (serialize all three benches in one hash); reading-view "print
  selection" merging the quote + offprint ideas; an "offprint" preset
  for the research-area dialogs (same machinery, different content);
  real content replacement (name/portrait/channels/CV) when the owner
  is ready; a11y pass on the quote chip for switch/voice users
  (currently pointer-centric discovery).

---
Task ID: R9
Agent: main-agent
Task: Status assessment, QA regression, mandated feature + styling expansion

Work Log:
- Baseline: dev server verified up (200; EADDRINUSE noise = duplicate
  start attempt only). Full QA regression PASSED: page health (0 failed
  resources, clean console), T theme round-trip, L lexicon, ? manual,
  #note- deep link, #experiment= restores (lensing e/d/r/x/y + toast;
  orbits m/f), lab tab keyboard nav (Radix arrows WRAP from last tab
  to first), contact API friendly zod messages, footer almanac
  October→November, mobile 375 / desktop 1440 zero overflow, lint 0,
  tsc 0 under src/.
- TWO QA-METHOD FALSE ALARMS diagnosed (documented for future rounds):
  (1) EXPERIMENT HASH PARAM NAMES: lensing uses e/d/r/x/y/m (m=lens-
      moved flag), orbits uses m/f/a/t (m=mass) — testing lensing with
      orbits-style params "fails" by design; format is
      #experiment=lensing?e=110&d=grid (a ? separates tab from params).
  (2) THE DISPLAY LAYER SWALLOWS "[m" (ANSI reset CSI) in bash tool
      output: `rg grid-cols` showed `grid-cols-inmax(...)` for a file
      that od -c proved contains `grid-cols-[minmax(...)]` — byte-
      level checks (od -c) are the only truth for class names
      containing [m. THREE identical "corrupted" classes in the sims
      were ALL display artifacts, zero real bugs.
- REAL BUG FIXED (found while testing my own new code): the tour
  delivery effect deleted segments from the pending map at SCHEDULE
  time, so a canceled timeout (the first double-render after a tour
  link loads: initial tab → parsed tab) silently dropped that bench's
  shared state and consumed the "tour opening" flag. Fix: mutate the
  pending map only INSIDE the fired timeout (delivery-time claim);
  canceled segments stay pending and deliver when their bench is
  (re)reached. Verified: full 3-bench tour restores every segment.
- DEBUGGING METHODOLOGY LESSON: a 90-minute quote-copy "failure" was
  my own probe regex — I tested aria-label for "quote this passage"
  while the real label is "Copy the selected passage as a quote"
  (the visible TEXT is "Quote this passage"). The feature worked the
  whole time, including the new settle path. Probe selectors must be
  copied from the source verbatim. Also: agent-browser console output
  is a CUMULATIVE session buffer — old parse errors persist across
  navigations and look live; only logs with new timestamps count.
- TURBOPACK HMR WEDGE struck again (3× this round): after the first
  file edit following a server start, subsequent edits stop being
  served (stale parse errors, probes never appear). Recovery remains
  pkill + rm -rf .next + double-fork restart. Rule of thumb: verify
  ANY behavioral anomaly survives a clean restart before debugging
  the code.
- NEW FEATURE — Assistive-tech quote selection (quote-copy.tsx):
  selections created by voice control or screen-reader cursors
  announce themselves ONLY via selectionchange (no pointerup/keyup),
  so the chip never rose for them. Now a non-collapsed selectionchange
  with no pointer held arms a 350ms settle timer → evaluate → chip.
  Pointer drags are excluded via a pointerdown/up tracker (the
  never-flicker-mid-drag rule is preserved); Escape/hide cancel the
  timer. Verified end-to-end: pure setBaseAndExtent selection (no
  pointer, no keys) → chip rises → click → «quote»+title+deep-link
  payload copied, chip folds, toast shown.
- NEW FEATURE — "Share lab tour" (cross-instrument room link):
  · experiment-link.ts: #lab-tour=<seg>|<seg>|<seg> codec — segments
    re-use the single-experiment parser (one family, no drift);
    buildLabTourHash/parseLabTourHash/isLabTourHash.
  · Each sim reports its shareable state upward via a new onReport
    prop (BenchReporter): one shareParams builder per sim now feeds
    BOTH the per-bench share chip and the tour reporter (dedupe);
    lensing also reports on figure pointerup (lens drags mutate refs
    without re-rendering). Untouched benches are omitted from the
    link — honest: they stood at defaults when shared.
  · lab.tsx: benchStatesRef tracks last-known bench states; the
    active bench leads the tour, others follow in canonical order;
    delivery is self-guided — each segment restores when the visitor
    reaches its bench (opening delivery scrolls + full toast; later
    benches get a quiet toast, no scroll); the tour hash clears via
    replaceState once every segment has been visited.
  · share-lab-tour.tsx: dashed utility chip (matches Share experiment
    language), clipboard + execCommand fallback, honest toast counts
    benches ("2 of 3 benches shared — the rest stand at their
    defaults"), listens for phys:share-lab-tour.
  · Command palette: "Share the whole lab — copy a tour link" action
    (Route icon) dispatches the event.
- STYLING DETAIL — lab control band unified (VLM-verified): the share
  chip previously floated right on its own row above the tabs
  ("independent coordinate systems" per VLM). Now ONE flex band:
  tabs left, tour chip right (items-center, same row on desktop;
  wraps beneath with ml-auto right-alignment on mobile — verified
  chipRight 359/375, no overflow). VLM final pass: "visually unified,
  aligned, and balanced."
- STYLING DETAIL — tour dots: while a tour has unvisited benches,
  their tabs carry a 5px photon dot with a soft glow (shadow keyed to
  --color-photon) + sr-only "a shared setup from the tour link is
  waiting on this bench"; dots retire as each bench is visited
  (tourPending state). The self-guided tour now reads as a route.
- VLM 4-shot defect review triaged by DOM measurement: ALL FOUR
  claims were false positives (hero buttons both exactly 48px/same
  baseline; publications FILTER label and pills share optical center
  6110.5; notebook tags all px14/py6/h29). Only the control-band
  finding was real (fixed above). The standing rule holds: VLM
  claims need DOM verification.
- Final verification: lint exit 0, tsc 0 under src/, mobile 375 no
  overflow, 0 failed resources, full tour lifecycle (share → open →
  hop ×2 → hash clear) + AT-selection quote round trip re-verified
  on the final clean build; dev.log clean.
- Cron task creation retried (9th time) — still "cron tool is not
  available for this request" (gateway limitation; R1-cron spec stands).

Stage Summary:
- The lab is now shareable as a ROOM: one link carries every bench
  the sharer actually left state on, restores each as the visitor
  hops between instruments, marks the route with photon dots, and
  cleans the URL when the tour completes. The quote chip now answers
  assistive technology, closing R8's known a11y gap; the shortcuts
  manual teaches the selection gesture.
- Critical bug fixed in delivery claiming (schedule-time vs
  delivery-time mutation) — the pattern is documented in the effect
  comment for future companions.
- Known notes: (1) agent-browser console is cumulative — stale
  errors mislead; (2) bash tool output swallows "[m" — use od -c;
  (3) probe selectors must be copied verbatim from source; (4) the
  turbopack HMR wedge recurs after the first edit per server start —
  clean-restart before debugging anomalies; (5) Radix tabs arrow
  keys wrap last→first.
- Next-phase candidates: "print selection" offprint (merge quote +
  essay-print); offprint preset for research-area dialogs; an
  almanac "on this day" deep-link; real content replacement
  (name/portrait/channels/CV) when the owner is ready.

---
Task ID: R10 (review round — main agent)
Agent: main agent (autonomous cron review)
Task: R10 of the recurring review loop — full QA regression, then the mandatory style refinement + new feature round. Trace 1a13ff1b9f673871-web-cron-review-202610160526.

Work Log:
- Baseline: server up (200), dev.log clean (only duplicate-start EADDRINUSE noise).
- FULL regression PASSED at open: page health (0 failed resources, clean console), T theme round-trip, L lexicon, ? manual, #note-spacetime-curved deep link (opens + hash clears on close), #experiment=lensing?e=110&d=grid restore, #lab-tour= hand-built link lifecycle (opening delivery + toast → photon dot on unvisited bench → REAL tab click → segment delivery + quiet toast → hash cleared via replaceState), lab tab keyboard nav with wrap, contact API friendly zod messages + happy path, footer almanac (Oct 1927 Solvay), mobile 375 + desktop 1440 zero real overflows, lint 0, tsc 0 under src/.
- THREE QA-METHOD false alarms diagnosed (documented for future rounds):
  (1) Synthetic keydown events dispatched on window NEVER reach document — global
      shortcuts (L/?) listen on window so they fire, but Radix Escape handling
      listens on document and stays deaf. Use real `press Escape` for Radix.
  (2) eval `.click()` on Radix tab triggers does not switch tabs; use real
      agent-browser click on the @ref. Also `.click()` is not a trusted gesture —
      execCommand('copy') fails under it; quote-copy verified fine via real click.
  (3) Probe selectors must match real DOM: tour dots are dynamic spans (find via
      the sr-only text), not .tour-dot; ledger buttons were always rendered —
      a slice(0,8) probe hid them.
- NEW FEATURE — Excerpt Offprint (R9's top candidate, quote × essay-print merge):
  · quote-copy.tsx: the chip is now a two-deed pill — "Quote this passage"
    (unchanged copy) + "Print excerpt" (new). New hidden excerpt plate renders
    inside the reading pane whenever a selection is live: masthead ("OFFPRINT ·
    EXCERPT — THE PHYSICIST'S NOTEBOOK" + thick rule + "selected by the reader,
    printed by request"), essay title, category·time·date line, the passage in
    guillemets on a serif blockquote measure, provenance deep link. Handler inks
    slots, stamps html.excerpt-printing, prints, cleans on afterprint + safety
    timer. Excerpt cap 640 chars (paper carries more than a clipboard's 280).
  · MAX chars + PrintEssayButton pattern reused (PRINT_CLEANUP_MS).
- NEW FEATURE — Research-Area Offprint: research dialog gains a desk line
  ("N related concepts · N on the shelf" — honest counts) with a Print chip;
  printing typesets kicker, equation (KaTeX prints), brief, concepts, and the
  reading shelf, with a print-only provenance line. The interactive
  ResearchAsk is wrapped data-print="hide" (stays on screen).
- REAL BUG FOUND & FIXED during verification — stacked-dialog leak: with an
  essay open, the palette can open a research area ON TOP (both [role=dialog]
  stay mounted as body children); the print modes displayed ALL dialogs, so an
  area offprint printed the whole essay underneath. Fix: every print handler
  (essay/excerpt/area) marks its OWN dialog with .print-target via
  closest('[role="dialog"]') from a chip ref; CSS hides ALL body children then
  shows only body > .print-target; dialog un-cinema rules now target
  [role="dialog"].print-target (specificity: unsuffixed [role=dialog] rules
  would have re-shown stacked dialogs — (0,0,2,1) beats body>* (0,0,1,2)).
  Verified by PDF text extraction in stacked state: essay prints alone, area
  prints alone, excerpt prints alone — zero cross-leak in all three modes.
- REAL BUG FOUND & FIXED — chip clamp vs wide pill: place() clamped the old
  170px chip with fixed 84px margins; the two-action pill is 331px wide — on a
  341px mobile pane it overflowed. Fixes: (1) clamp by measured pill width
  (chipRef.offsetWidth, estimate 300 before mount) with same-value bailout so
  the layout-effect re-place converges instead of looping; (2) responsive pill:
  flex-col below sm (buttons stacked, horizontal divider via max-sm utilities,
  rounded-xl) → 185px wide at 375; sm:flex-row rounded-full → 331px on desktop;
  (3) window resize listener re-places the pill while a selection lives.
  Verified: 375 column no overflow, 1440 row no overflow, survives resize.
- STYLING: offprint print typography across three modes (masthead line, thick
  rule, guillemet blockquote at 12.5pt/1.75, 8.5–9.5pt mono caps provenance);
  two-action pill with photon divider + focus-visible inner rings
  (-outline-offset-4 inside the rounded container); research desk line.
- Shortcuts manual line updated: the selection note now teaches both deeds
  ("quote the passage or print it as an excerpt").
- VLM review unavailable this round (z-ai vision CLI 401 "missing X-Token" —
  env token lost after session restart); DOM/PDF-text verification used
  instead, which has been the more reliable arbiter anyway per standing rule.
- Turbopack HMR wedge hit TWICE this round (stale CSS: browser saw 2 of 14
  excerpt-printing rule mentions). Recovery both times: pkill + rm -rf .next +
  double-fork restart. Standing rule reaffirmed: after ANY edit round, verify
  served CSS rule counts before believing "missing" styles are code bugs.
- Final verification: page health clean, 0 console errors, 375/1440 zero real
  overflows, all three print modes PDF-verified incl. stacked state, copy +
  excerpt flows real-click verified, lint 0, tsc 0 under src/, dev.log clean.

Stage Summary:
- The site now has a complete OFFPRINT SYSTEM: whole essay (existing), selected
  passage (new), research area (new) — each typeset for paper with its own
  masthead and provenance, each printing only its own dialog even when dialogs
  are stacked, each honest about what it is.
- The quote chip grew a second deed without losing its manners: responsive
  stacking on narrow panes, measured-width clamping, resize-aware placement,
  same-value-bailout convergence.
- Key patterns for future rounds: .print-target dialog marking (any new print
  mode must adopt it), measured-width clamp + bailout in place(), and the
  specificity lesson (attr-selector rules can out-rank body>* hiders — suffix
  the mode rules with the marker class).
- Known notes: (1) VLM CLI auth lost this round — retry next round, else keep
  DOM/PDF arbiter; (2) HMR wedge now 5× lifetime — clean-restart after every
  edit round is cheap insurance; (3) synth events on window don't reach
  document listeners (Radix) and synth clicks aren't trusted gestures
  (execCommand) — always re-verify with real agent-browser interactions.
- Next-phase candidates: almanac "on this day" deep-links (milestone → related
  lexicon term or lab bench); a fourth lab instrument; real content
  replacement (name/portrait/channels/CV) when the owner is ready.

---
Task ID: R11 (art-direction round — main agent)
Agent: main agent (user-directed art direction)
Task: R11 — a pure ART-DIRECTION round per the owner's brief: "act as an award-winning digital art director and senior creative frontend engineer… elevate visual quality… replace generic card grids with varied editorial layouts… prioritise visual quality over adding unnecessary new features." No new features were added on purpose; every change below is visual/compositional. Trace 1a13ff1b9f673871-web-cron-review-202610160526.

Work Log:
- Baseline: server up (200), full regression PASSED at open (carried over from
  R10: page health, hotkeys, deep links, print modes, lint 0, tsc 0).
- AUDIT: VLM CLI auth restored this round (was 401 in R10). Full-page + per-
  section viewport screenshots (1440) + art-director VLM critiques. Verdict:
  hero/lab/contact strong; WEAKEST = (1) Research "3-col uniform card grid —
  SaaS pricing page", (2) Projects "cards on a dark grid, nothing breaks out",
  (3) Publications "centered empty-state cop-out, hourglass on-the-nose",
  (4) hero CTA "standard SaaS landing button", (5) no shared folio furniture.
- SectionHeading: new optional `meta` prop prints a journal running-head —
  flexible hairline + right micro caption on the eyebrow line (lg only).
  All 7 sections wired: "Personal account · 1 plate", "Index · 6 directions",
  "Briefs · 5 figures · examples", "Ledger · empty by design", "Essays · 9
  in progress", "3 instruments · live", "Correspondence · open".
- RESEARCH (02) REDESIGNED: uniform 3-col cards → journal table-of-contents
  index rows. Full-width entries: large serif folio numeral / title+tagline+
  summary / equation set on its own hairline plot-grid plate / arrow cue;
  hairline dividers; hover wash (accent/30) + numeral turns photon + plate
  border warms; focus-visible with negative offset; active state added.
- PROJECTS (03) REDESIGNED: project 01 promoted to a full-width FEATURE
  PLATE — words left (5 cols), mathematics set LARGE on an instrument plate
  right (7 cols, plot-grid, register corner ticks that brighten on hover,
  KaTeX at 1.28em) — then FIG. 02–05 in a mirrored asymmetric 7/5 + 5/7
  spread on a 12-col grid. Every card numbered "Fig. NN".
- PUBLICATIONS (04) REDESIGNED: centered empty-state box → asymmetric two-
  leaf LEDGER. Left: philosophy of the section (status dot with restrained
  ping, serif headline, copy, note) with the uncharted-constellation SVG
  behind. Right: "Index of contributions" — 7 contribution types as ledger
  rows with dotted leaders and honest "000" counts, footer line "Counts move
  when verified work exists — never before". Hourglass icon removed.
- HERO REFINED: primary CTA restyled as a labelled instrument key (mono
  uppercase label + arrow compartment separated by an inner hairline;
  rounded-sm; proper active state). Secondary CTA demoted to a quiet
  editorial link (link-quiet underline + arrow-down). New right-edge
  observatory annotation (xl only, aria-hidden, print-hidden): photon dot,
  fading hairline, vertical mono caption "FIG. 00 · GRAVITATIONAL LENSING —
  COMPUTED LIVE" (binds the render to the page furniture; honest).
- BUG FOUND & FIXED during mobile audit: the running-head eyebrow span was
  given `shrink-0`, forcing single-line max-content width → 75px horizontal
  overflow at 375px on long eyebrows ("Research & Scientific Projects").
  Fix: `min-w-0` (text may wrap inside the span). Verified 0 overflow after.
- Publications "000" count contrast raised (muted-foreground/45 → /70) after
  VLM flagged WCAG legibility on dark.
- VLM false positives DISPROVEN by DOM probes (standing rule re-confirmed):
  mobile claims of "clipped tagline text" (string not in DOM), "truncated
  featured quote" (scrollWidth == clientWidth), "equation overflow"
  (scrollWidth 309 == clientWidth 309) — all hallucinated from screenshots.
  KaTeX sub-pixel internal spans report tiny scroll deltas; not real clipping.
- VERIFIED after all edits: lint 0, tsc 0 under src/, desktop 1440 overflow 0,
  mobile 375 overflow 0, research row click → dialog, featured plate click →
  dialog, hero CTA anchors navigate, L lexicon opens, T theme round-trip,
  #note-spacetime-curved deep link opens + hash clears on close, contact form
  happy path (subject select → toast "Delivered. Thank you."), 0 failed
  resources, console clean, dev.log clean. VLM grades on the redesigned
  sections: Research A, Projects A+, Publications ledger praised in light
  mode ("intentional, no visual bugs"), Hero A-. Light-mode render of the
  new sections verified.

Stage Summary:
- The card-grid era is over: Research is a journal index, Projects is a
  monograph spread with a feature plate + mirrored asymmetric grid,
  Publications is an honest ledger. The site now reads as one art-directed
  editorial object rather than sections of cards.
- New shared furniture: running-head meta line on every SectionHeading;
  "Fig. NN" numbering in projects; instrument-key CTA language in the hero;
  vertical observatory annotation.
- Patterns for future rounds: (1) SectionHeading `meta` prop is available for
  any new section; (2) never use shrink-0 on text-bearing eyebrow spans —
  use min-w-0; (3) the feature-plate pattern (5/7 words/math split with
  register ticks) is reusable for e.g. a future "selected publication" hero.
- Known notes: VLM hallucination rate on mobile screenshots remains high —
  always DOM-verify; agent-browser eval vars persist between calls (wrap in
  IIFE); SVG child getBoundingClientRect reports viewBox units (false
  overflow positives — only trust documentElement.scrollWidth deltas).
- Next-phase candidates: almanac "on this day" deep-links; a fourth lab
  instrument; apply the feature-plate pattern to one notebook essay;
  real content replacement (name/portrait/channels/CV) when owner is ready.

---
Task ID: R12 (design-system round — main agent)
Agent: main agent (user-directed design-system architecture)
Task: R12 — "act as a principal UI designer and design-system architect… create a coherent, reusable design system throughout the application." Delivered as implemented tokens + a ~270-replacement refactor across every component, not a written spec. Trace 1a14422da35a4f11.

Work Log:
- AUDIT (numbers that justified the system): 6 arbitrary micro sizes
  (8/9/9.5/10/11/15px, 156 uses), 10 distinct tracking values, 9
  muted-foreground opacity tiers, 3 heading→content spacings (mt-12/14/16),
  per-component button/pill/plate class strings.
- TOKENS — new "DESIGN SYSTEM" section in globals.css @layer utilities:
  · TYPE (fluid clamp serif): .type-display (2.6→4.5rem) .type-h2
    (1.875→3rem) .type-h3-feature (1.75→2.35rem) .type-h3 (1.4→1.7rem)
    .type-folio (2→2.6rem) .type-leaf (15px/1.75)
  · META (mono): .eyebrow (11px/0.26em) .eyebrow-wide (11px/0.32em —
    ceremonial: hero kicker + scroll cue ONLY) .meta-sm (10px/0.2em)
    .meta-xs (9px/0.16em) .meta-num (10px tabular) .kbd (keycap)
  · LAYOUT: .shell (max-w-7xl + responsive px) .section-pad (scroll-mt +
    py 6/8rem) .section-flow (mt 3.5/4rem)
  · ACTION: .btn-key (+ -label/-glyph, the ONE primary key) .chip-btn
    (+ --dashed --block) .tag (+ --dashed status pills)
  · PLATES: .plate-strip (card equation band) .plate-box (row equation
    plate) — both print-neutralised.
  Documented conventions in the CSS header comment: focus offsets
  (2 compact / 4 surfaces), opacity tiers (/50 ghost /60 soft /70
  standard /80 strong).
- SWEEP: two python regex passes (~270 replacements) mapping every
  hand-assembled mono string to role classes; px anomalies normalised
  (8px→9px meta-xs a11y bump; 9.5px→9; 11px sans smallprint→text-xs;
  15px→type-leaf). Keycaps unified to .kbd (4 spots). Layout strings
  → .shell (7) .section-pad (7) .section-flow (5: about/research/
  projects/publications/contact).
- HAND-EDITS: hero (type-display + btn-key markup + eyebrow-wide cue);
  section-heading (type-h2, meta-xs running-head, eyebrow at 0.26em);
  research (folio/type-h3/plate-box/type-h3-feature dialog title);
  projects (feature+card titles, plate-strip, status pills → .tag,
  repo link → chip-btn); publications (feature headline); navigation
  (eyebrow nav links, chip-btn--dashed--block sheet buttons, .kbd ⌘K);
  about/notebook tags (placeholder pill, category chip, random-essay
  pill → chip-btn--dashed rounded-full).
- OPACITY TIER consolidation: /30/35/40/45→/50 (8), /55→/60, /85→/80.
  Final inventory EXACTLY 4 tiers: /50 ×13, /60 ×14, /70 ×29, /80 ×11.
- Deliberate exceptions (documented): companion-panel chat transcript
  mono voice, research-dialog concept chips (sentence case), contact
  channel values, print-only pt sizes. shadcn Button continues to own
  toggles + form submit (theme controls unchanged, next-themes persists).
- VERIFIED: lint 0, tsc 0 under src/, DOM audit — 7 .type-h2, 10
  .type-h3, 2 feature, 6 folio, 23 eyebrow + 1 wide, 73 meta-sm,
  23 meta-xs, 30 meta-num, 3 kbd, 7 shell/pad, 5 flow, 22 tags,
  4 strips, 6 boxes; 0 overflow at 1440 AND at 375 (every section
  probed individually); fluid floors confirmed (h1 41.6px, h2 30px at
  375); interactions green (research row + chip dialog, project dialog,
  L lexicon, T theme round-trip, #note- deep link open + hash clear,
  contact happy path → toast, mobile sheet opens with chip buttons);
  0 failed resources, console clean, dev.log clean.
- VLM: real hero (after catching that my "hero" screenshot was actually
  contact/footer from stale scroll — re-took at scrollTop 0) graded
  A+/A/A-; dark research A; light-mode plates/ledger/tags "no critical
  contrast bugs". VLM claims of misaligned ledger counters DISPROVEN by
  DOM: all 7 "000" spans share right edge 1295px (shared flex end).
  Standing rule holds: VLM needs DOM + scroll-position verification.

Stage Summary:
- The design system is real and enforced: one fluid type scale, three
  meta roles + one ceremonial variant, one layout grammar, one primary
  key + one chip + one tag, two plate types, four opacity tiers. New
  sections/components should consume these classes and nothing else.
- The system is discoverable: the CSS header comment is the spec;
  role-class counts in the DOM are the audit (documented counts above).
- Patterns for future rounds: (1) any new mono text = .eyebrow/.meta-sm/
  .meta-xs/.meta-num — never hand-assemble size+tracking; (2) any new
  secondary action = .chip-btn; (3) any new equation surface =
  .plate-strip (inline) or .plate-box (row) or .equation-plate (display);
  (4) headings = .type-* — no more sm:/lg: font-size stacking.
- Known notes: companion-panel + concept chips keep their own mono
  voice by design; VLM screenshot audits must set scroll position first.
- Next-phase candidates: notebook essay "selected work" feature plate
  using the 5/7 pattern; almanac "on this day" deep links; a fourth
  lab instrument; real content replacement when the owner is ready.

---
Task ID: R13 (interactive physics laboratory — orbital mechanics v2)
Agent: main agent (user-directed: computational physicist / scientific visualisation engineer)
Task: "Implement one polished, genuinely functional interactive physics laboratory" — the two-body orbital-mechanics simulator, chosen over lensing (already strong) as the definitive instrument. Trace 1a144361ee9cd015.

Work Log:
- AUDIT of the existing orbits bench against the brief: no orbital-radius
  parameter, launch speed applied only on reset (no immediate response),
  natural units only (no physical units), no conic classification, no
  canvas interaction, assumptions thin. Lensing bench already excellent —
  orbits was the right upgrade target.
- PHYSICS UPGRADE (orbits-sim.tsx, full rewrite ~1340 lines):
  · Generalised launch: r₀ ∈ [0.4, 1.6] AU slider + tangential speed
    f ∈ [0.55, 1.45]; derived ε = (f²−2)/(2r₀), e = |1−f²|, a = r₀/(2−f²).
  · Eccentricity VECTOR e = (v×h)/GM − r̂ now fixes conic orientation, so
    arbitrary-direction drag launches use the same closed-form machinery;
    analytic overlay stays the LAUNCH conic (drift stays visible).
  · Physical units layer: M = 1 M☉ total, lengths in AU ⇒ τ = yr/2π ≈
    58.13 d, v in √(GM☉/AU) = 29.78 km/s; Kepler III reads T[yr] = a[AU]³ᐟ²
    exactly. Every readout now carries units (AU, km/s, yr, d).
  · Integrator: velocity Verlet, fixed dt = 2×10⁻³ τ, with adaptive
    sub-stepping near periapsis (n = ceil(0.3/r), cap 12) and a r < 0.03
    impact halt with canvas banner + reactive state.
  · Frame-rate-independent stepping (accumulator over real elapsed time,
    lag-clamped) — 60 Hz and 144 Hz advance identically.
- INTERACTION UPGRADE:
  · Drag-to-launch: pointerdown within 30 px of the secondary (mouse or
    touch; canvas touch-action: pan-y keeps vertical swipes scrolling),
    photon-dashed ghost conic + arrow + live v₀ km/s label while aiming,
    release relaunches; speed clamped to slider range so sliders/state can
    never disagree; sliders snap to equivalent tangential config.
  · Slider ghosts: launch-radius/launch-speed show the predicted conic
    live while sliding, auto-relaunch on onValueCommit (pointer release or
    keyup); mass ratio + toggles stay live.
  · Play/Pause overlay reduced to a compact floating key (was full-canvas
    dim) so paused canvas stays draggable; grab ring + "drag to launch"
    hint when paused.
- READOUT PANEL v2 (meta-num, units everywhere): classification tag
  (circle/ellipse/radial fall/parabola/hyperbola/impact, aria-live), e,
  a, apses r_p→r_a, r, v (km/s), T or "unbound", v∞ for unbound, elapsed
  t, ε, ΔE; plain-language gloss line that changes with regime; units
  footnote deriving the scaling. Classification + gloss mutate only on
  change (aria-live safe).
- VISUALS: AU rings (0.5/1/1.5/2/3) with "1 AU" label, scale bar (auto
  AU value), apse P/A ticks, velocity arrow (relative v), impact banner.
  Drag hint moved to lower-right diagonal after VLM caught a real
  collision with the "1 AU" ring label (canvas text — DOM-invisible).
- LAB.TSX panels upgraded: Mathematics now EoM + conic r(θ) + vis-viva/
  Kepler III with units sentence; "What to try" 5 experiments incl. drag,
  Kepler III, v∞; Assumptions strengthened (Mercury 43″ absent by
  construction, mass-ratio slider exaggerated 10³–10⁶× vs real star–planet
  ratios, sub-stepping note, "not mission-grade ephemeris").
- BUGS FIXED DURING BUILD: template-literal paren imbalance (parse error);
  setPointerCapture wrapped in try/catch (synthetic/vanished pointers);
  useCallback-stabilised conicPath/dragVelocity/secondaryScreen (would
  have re-run the lifecycle effect every render); impacted state made
  reactive for the overlay.
- VERIFIED (agent-browser, desktop 1440×900 + mobile 375×812):
  · Presets vs closed form, all exact: circle (e=0, T=1 yr, v=29.8 km/s),
    ellipse (e=0.437, T=0.58 yr), comet (e=0.640, apses 0.35→1.60 AU,
    T=0.96 yr), Kepler III (T=2.02 yr = 1.6³ᐟ²), escape (e=1.103, ε=+0.051,
    v∞=9.5 km/s, hyperbola tag), binary (relative orbit invariant).
  · Sliders: keyboard arrows change values, commit relaunches (T=a³ᐟ²
    held), 4 sliders + 6 presets + share present.
  · Drag-to-launch: cursor grabbing, ghost + arrow + "v₀ 26.1 km/s" label
    (VLM-confirmed; matches hand calc 0.882×29.78=26.2), released into
    e=0.824 custom orbit (hand-calc 0.833 ✓).
  · ΔE honesty: −0.513 % after 3.35 yr (≈8 orbits) of a 0.04→1.07 AU
    plunge ellipse — bounded symplectic drift under extreme stress.
  · Impact edge case: near-zero drag → radial plunge lasting t=0.18 yr
    vs analytic free-fall π/(2√2)≈0.177 yr, banner + gloss + halted loop;
    R recovers.
  · Keyboard Space/R on canvas (global R shortcut already lab-guarded);
  theme round-trip re-paints canvas (pixel-verified), sim state survives;
  share link #experiment=orbits?m&f&r&a&t restores + survives reload;
  tour link with new r param restores + tour dot on pending benches;
  reduced-motion (phys:motion-reduced=1) auto-pauses, restore does not
  auto-play; IntersectionObserver halts off-screen stepping (caught by
  my own test forgetting to scroll — feature working as designed).
  · Mobile: 1-column stack, canvas 341×378, pan-y, 0 overflow at 375;
  full-page sweep 0 overflow; console + dev.log clean; lint 0; tsc 0
  under src/. VLM: default A (one clipped-text claim DISPROVEN by DOM
  scrollWidth==clientWidth), light-mode pass, drag-ghost pass, impact
  banner pass.

Stage Summary:
- The orbital-mechanics bench is now the portfolio's flagship instrument:
  full two-body Kepler problem with physical units, drag-to-launch with
  live ghost prediction, six verified presets, adaptive-substep symplectic
  integration with honest ΔE, impact/radial/escape edge handling, and a
  readout panel that teaches (classification + gloss + units derivation).
- Every quantity the UI shows was verified against closed-form orbital
  mechanics during QA (e, a, T, v, v∞, free-fall time — six independent
  checks, all exact to displayed precision).
- Patterns for future rounds: conicFrom(r, v) is the single source of
  osculating truth (readouts AND overlays derive from it); canvas text
  collisions are VLM-only-detectable (DOM blind) — keep hint labels on
  fixed diagonals; the accumulator stepping pattern fixes frame-rate
  dependence for any future instrument.
- Known notes: ΔE ≈ −0.5 % on extreme plunge orbits is honest and bounded
  (sub-stepping already at cap); slider min f=0.55 means sub-circular
  tangential launches below 0.55 are drag-only (by design, documented).
- Next-phase candidates: osculating-elements graph (a, e vs t) under the
  readout; recorded "annotated tours" of preset experiments; apply the
  units-layer pattern to lensing (θ_E in arcsec) and wave (Å scale).

---
Task ID: R12
Agent: Z.ai Code (responsive-design + accessibility specialist round)
Task: Full responsive + accessibility audit at 360/390/768/1024/1440/1920 — fix horizontal overflow, contrast, ARIA, touch targets, theme/reduced-motion defects at the layout root cause.

Work Log:
- AUDIT (agent-browser + axe-core 4.12 + pixel forensics, both themes):
  · Overflow: documentElement.scrollWidth−clientWidth = 0 at ALL six widths.
    Remaining "offenders" were false positives (SVG viewBox internals in
    DeepField, the Lab tab strip's intentional overflow-x-auto, sr-only
    honeypot at −9999px).
  · HERO DISC COLLISION (the round's major find): in light mode the
    near-black shadow disc (cx=0.62w, cy=0.45h) sat behind dark text at
    360–1024 — measured 2.9:1 on the paragraph (360), 95.3% dark pixels
    over the "About the physicist" link zone (768), h1+para intrusion
    (1024). Dark mode was always fine (light text on dark disc ≈ 8:1+).
    Root cause: fixed-percentage scrim (38%/62%) tuned for ≥1280 columns.
  · axe light: 35 contrast violations (photon #0e7c8c = 4.42:1 on paper;
    text-muted-foreground/50–70 = 2.15–3.13:1), heading-order (lab h4s),
    dangling aria-labelledby (all 7 sections pointed at non-existent
    heading IDs → sections not named regions), aria-label on generic
    spans (publications "000"), sr-only DialogHeader outside landmarks.
  · Nav at 360/390: gap 0 between wordmark and toolbar — subtitle wrapped
    to 2 lines; all 5 icon buttons 36px touch targets. Contact submit
    36px. VLM "hyphenation" and "equation overflow" claims DISPROVEN by
    DOM (KaTeX scrollWidth < container at 360; no hyphens CSS).
  · Keyboard/sheet/palette: skip link, focus-visible outlines, Escape+
    focus-return, tab trap, theme round-trip repaint — all already good.
- FIXES (root causes, no overflow-hiding):
  1. globals.css: light --photon/--ring #0e7c8c → #0d7887 (4.67:1 paper,
     5.0:1 card); new .hit-target utility (::after inset −5px → 46px hit
     for 36px visual keys, 4px gaps prevent neighbour overlap).
  2. black-hole.tsx: below 1180px in LIGHT mode the shadow disc renders
     as a watermark — 10% ink fill + 0.28-alpha engraved outline; photon
     ring unchanged; dark mode untouched. Measured after: 0% dark pixels
     behind paragraph bands at 360/768/1024; text-over-disc ≈ 4.6:1;
     canvas pixel probe shows fill = 222 luminance (exact 10% ink).
  3. navigation.tsx: search + lexicon buttons hidden below sm (both live
     in the sheet menu chips), wordmark subtitle hidden below sm, ⌘K kbd
     badge deferred to xl (frees ~40px at 1024), hit-target on all icon
     keys. Result: 94px gap at 360 (was 0).
  4. SectionHeading: new headingId prop → <h2 id>; threaded through all
     7 sections (about/research/projects/publications/notes/lab/contact).
     All 7 IDs now exist; sections are named regions; axe
     aria-valid-attr-value + aria-prohibited-attr cleared.
  5. ui/command.tsx (stock shadcn bug): sr-only DialogHeader moved INSIDE
     DialogContent — was an unportaled always-in-DOM child of Dialog,
     sitting outside every landmark. Palette re-verified: opens, input
     autofocuses, role=dialog present, header inside content.
  6. Lab panel headings: all 16 h4 → h3 (h2 → h3 → … order restored).
  7. publications.tsx: aria-label spans → aria-hidden "000" + sr-only
     "0 entries" text (announced properly, no prohibited attr).
  8. Contact submit: h-11 (44px touch target).
  9. Contrast sweep: every informative text-muted-foreground/50–80 →
     full muted-foreground (~45 sites across 14 files: projects,
     publications, notebook, research, about, hero figcaption, footer,
     physics-history, lexicon incl. placeholder, companion-panel,
     command-palette footer, shortcuts-help, keyboard-hint, orbits-sim,
     not-found). Decorative aria-hidden elements (hero Fig. 00 annotation,
     arrows, lexicon search glyph) intentionally kept as whispers.
- VERIFIED after fixes:
  · axe-core: LIGHT 0 violations, DARK 0 violations (was 3+3 serious).
  · Overflow 0 at 360/390/768/1024/1440/1920; dev.log + console clean.
  · Hero: 768 link-zone dark 95.3% → 0.0%; watermark disc + 55%-teal
    ring pixel-confirmed; theme round-trip repaints canvas instantly.
  · Keyboard: skip link reveals, tabs flow, :focus-visible 2px outlines;
    sheet Escape + focus return; lab tabs (role=tab/tablist, arrow keys
    via Radix) + last tab scroll-reachable at 360.
  · Form: empty submit → 4 role=alert errors, aria-describedby +
    aria-invalid wired; submit now 44px; sheet search/lexicon chips OK.
  · lint 0; tsc 0 in src/ (examples/skills pre-existing only).

Stage Summary:
- The portfolio now passes WCAG 2 AA (axe) in BOTH themes and holds 0
  horizontal overflow at all six audited widths, with root-cause fixes
  (no overflow-hidden concealment anywhere).
- Signature pattern added: theme-aware canvas ink (watermark mode) —
  reuse for any future hero instrument that must coexist with text.
- Known/accepted: axe "region" on portaled role=dialog is resolved via
  the command.tsx structural fix; muted whispers remain only on
  aria-hidden decorative glyphs; ΔE note for orbits unchanged.
- Next-phase candidates: design-system token audit for AA-large text
  on accent backgrounds; tab-strip edge fade affordance at mobile;
  osculating-elements graph under the orbits readout (from R11 notes).

---
Task ID: R13
Agent: science-editor (main session)
Task: Academic science-editor + physicist review of ALL portfolio content — scientific clarity, accuracy, credibility, consistency; fix errors, add explicit assumptions/established/open-question distinctions, verify external references, normalise SI notation, de-market language. Strict no-fabrication rules.

Work Log:
- AUDIT: read profile/site/research/projects/publications/notes/lexicon content + all renderers (research, projects, notebook, hero, footer, lab assumption plates, both ask-API system prompts).
- REFERENCE VERIFICATION (13 checks via web-search + curl):
  Einstein 1916 DOI 10.1002/andp.19163540702 (Wiley: Ann. Phys. 354, 769–822) · Einstein 1905
  DOI 10.1002/andp.19053221004 (322, 891–921) · Einstein 1936 Science DOI 10.1126/science.84.2188.506 ·
  GW150914 DOI 10.1103/PhysRevLett.116.061102 · EHT M87* DOI 10.3847/2041-8213/ab0ec7 ·
  Chadwick Nature DOI 10.1038/129312a0 · Will 2014 DOI 10.12942/lrr-2014-4 · Dyson/Eddington 1920
  DOI 10.1098/rsta.1920.0009 (resolves → Royal Society) · Feynman Lectures caltech domain ·
  einstein-online.info 200 · NIST SP330 200 · BIPM SI brochure 200. All DOIs resolve 302 → publisher.
  QED precision claim verified (electron g-factor ~1 part in 10¹², Odom 2006/Hanneke 2008).
- SCIENCE FIXES (root-cause accuracy, not style):
  1. LEP electron speed WRONG by 10× in the speed-of-light essay: 0.9999999999987 → 0.999999999988
     (verified from first principles: γ = 104.5 GeV/0.511 MeV ≈ 204 500 → 1−v/c = 1.2×10⁻¹¹; also
     confirms "bicycle pace" ≈ 3 m/s LEP↔LHC difference). Recomputed in python, cross-checked web.
  2. Lexicon spacetime-interval: "only timelike-separated events can be causally connected" was WRONG
     (lightlike = light signals!). Fixed: timelike OR lightlike; nothing links spacelike.
  3. Lexicon cosmological-constant: ρ_Λ = Λc²/8πG labelled "vacuum energy density" was ambiguous
     (that's a mass density). Now ε_Λ = Λc⁴/8πG, labelled energy density, plus negative pressure.
  4. Research (mathematical-physics area): removed mathematically sloppy pseudo-equation
     "∇_μT^{μν} = 0 ⟺ symmetry → conservation"; replaced with the actual Noether charge
     Q = Σ ∂L/∂q̇ᵢ δqᵢ, dQ/dt = 0 with honest label.
  5. Research (cosmology): Friedmann equation was missing the Λ term; now full first Friedmann
     equation with +Λc²/3, label "(with Λ)".
  6. Research (theoretical): Noether sentence had direction reversed ("every conservation law is
     secretly a symmetry"); now correct implication + the three classic examples.
  7. Research (quantum): vague "No theory has passed more experimental tests" replaced with the
     precise claim (QED electron magnetic moment, ~part in a trillion, experiment agrees).
  8. Projects (curved-spacetime): limitations claim "most of the Newtonian-limit bending" from
     time curvature replaced with the precise statement (light bending: HALF from time curvature,
     HALF from space in the weak-field limit).
  9. Projects (gravitational-phenomena): "first test Einstein's theory passed" was false (Mercury's
     perihelion, 1915, came first); rewritten as the factor-of-two Newton-vs-Einstein deflection
     story, "most famous early test".
  10. Projects (superposition): equation label "A qubit state and the Born rule" conflated
      normalisation with Born rule; relabelled precisely.
  11. site.ts Chadwick history entry: paper title was wrong ("The Existence of a Neutron" was the
      later Proc. Roy. Soc. paper; the Nature letter of 27 Feb 1932 is "Possible Existence of a
      Neutron"); now correctly titled and phrased "published" not "received".
  12. Notes (curvature essay "How we know"): vague claims made quantitative — 1.75″ at limb (2×
      Newton), 43″/century Mercury residual, ~38 μs/day GPS drift, GW150914 ~1.3 billion ly,
      M87* naming.
- STRUCTURAL ADDITIONS (content system, architecture preserved):
  · research.ts: new `established` + `openQuestions` fields on all 6 areas — explicit separation of
    settled science from open research questions (incl. Yang–Mills Millennium problem, measurement
    problem, dark matter/energy, hierarchy problem).
  · research.tsx dialog: "What is settled" (solid plate) / "Open questions" (dashed plate, matching
    the site's placeholder semantics) — verified balanced, stacks at 390px, 0 overflow.
  · projects.ts: new `assumptions: string[]` per project (3 explicit assumptions each) + rendered
    "Assumptions" section in the brief dialog (Methodology → Assumptions → Findings).
  · projects.ts + notes.ts references upgraded from string[] to {citation/text, url?} objects with
    VERIFIED links only (DOIs + Caltech Feynman Lectures); books cited without links by policy;
    honest micro-caption "Links are added only to records verified to resolve".
  · notes.ts: essays get `furtherReading` field (Dyson–Eddington 1920, GW150914 PRL, Einstein
    Online; NIST SP 330, BIPM) — rendered as a distinct "Further reading" section with arrow glyphs.
  · External links render with ArrowUpRight affordance icon, target=_blank, rel noopener,
    focus-visible outlines (notebook + projects).
  · SI normalisation: c now "299 792 458 m/s" (thin-space grouping) everywhere in essays, matching
    the footer + lexicon's existing convention (was comma-grouped "299,792,458").
  · Citations updated to publisher's own numbering (Ann. Phys. 354/322) to match linked DOIs.
  · Both LLM companions upgraded: research-ask prompt now includes the area's established/open
    distinction + a rule to never blur settled results with open questions; essay-ask prompt
    receives further-reading list too.
- DE-MARKETING: hero paragraph replaced ("I explore the ideas…smallest scales to largest
  structures" → specific: notes rebuilding from first principles + live-computed simulations with
  assumptions stated); hero equation caption now informative ("geometry on the left, matter and
  energy on the right").
- NOT CHANGED (deliberately): portrait/imagery remain honest placeholders (no external scientific
  imagery introduced — none could be license-verified; all visuals remain original procedural
  work, which the colophon already states); publications empty state kept; profile placeholders kept.
- QA (agent-browser): hero copy + caption render ✓; research dialog headings [What is settled,
  Open questions, Related concepts, On the shelf] ✓; Friedmann Λ term renders (572px in 620px
  plate) ✓; project brief now 8 sections incl. Assumptions ✓; DOI links present as anchors ✓;
  essay LEP fix + SI normalisation + Further reading section ✓ (4 links + 4 arrow glyphs);
  lexicon fixes both verified via search ✓; command palette still opens ✓; mobile 390px stacked
  grid 0 overflow ✓; light + dark heroes fine (VLM "void" claim DISPROVEN by DOM: hero 822px,
  all 8 sections present with healthy heights). VLM display-equation check flaked once (HTML
  boilerplate) → DOM-verified mfrac + overflow 0 instead.
- lint 0 errors · tsc 0 errors (src/) · dev.log clean · all GETs 200.

Stage Summary:
- Every quantitative claim on the site has been checked; 12 substantive science errors fixed
  (worst: LEP speed off by an order of magnitude; causal claim excluding lightlike events).
- The site now explicitly distinguishes established results / simplified educational models /
  open research questions in three systems: research areas (settled+open plates), projects
  (assumptions section), lab (existing assumption plates) — plus LLM companions instructed to
  respect the distinction.
- 13 external references verified and linked (DOIs resolve); no citation or DOI was added
  without verification. Strict no-fabrication rules maintained throughout.
- Next-phase candidates: physics-lab round (trace 1a144361ee9cd015, still pending); design-system
  token audit; possibly a third example essay (QM formalism) following the new editorial standard.

---
Task ID: R14
Agent: motion-designer (main session)
Task: Motion-design round (trace 1a1453069a481fb1) — award-winning motion designer + senior creative frontend engineer: restrained, sophisticated motion system supporting the scientific narrative. Subtle hero depth/parallax, restrained section entrances, refined navigation transitions, timed typography reveals, elegant hovers, gentle diagram animations, purposeful theme transitions. Rules: no forced intro waits, not every element animated, no aggressive zooms/particles/cursor-following, no layout shifts, respect prefers-reduced-motion, disable expensive effects on weak devices, navigation/content accessible during animation, NO new animation library (framer-motion 12 already in place).

Work Log:
- AUDIT: inventoried the existing motion system — motion-preference lib (site "calm the universe" toggle layering OS prefers-reduced-motion), Reveal component, hero parallax (content -18%/scene scale 1.08), black-hole + deep-field canvases, nav scroll-spy underline, theme/motion toggles, reading progress, constellation nav. Foundations strong; gaps in coherence + choreography polish.
- NEW src/lib/motion-tokens.ts — shared vocabulary: EASE [0.21,0.47,0.32,0.98], EASE_MASK [0.16,1,0.3,1], DUR {micro .24 / base .4 / entrance .9 / cinematic 1.05}, STAGGER .12, VIEW_ONCE viewport contract. All effects transform/opacity only.
- Reveal.tsx: now consumes useMotionPreference (site toggle aware, was OS-only via useReducedMotion) — calm mode renders truly static, consistent with canvases.
- HERO (hero.tsx): (1) display title split at rhetorical seam into two masked lines ("The Universe Is a" / "Question Worth a Lifetime.") rising out of overflow-hidden line boxes, pb/-mb 0.26em pair reserves serif descender room (VLM-verified no clipping, dark+light+390px); (2) two-plane parallax deepened — scene now also drifts +9% against content -18% + scale 1.08; (3) eyebrow hairline grows scaleX; (4) field-equation left rule replaced by motion span that draws itself (scaleY, origin-top, 1.1s); timing retimed eyebrow .15 → lines .3/.42 → lede .56 → keys .72 → equation 1.0. Calm/reduced → everything static (initial={false}).
- SectionHeading: rewritten as choreographed client component — eyebrow fades (y10) with hairline growing scaleX .08s, title rises y22 .08s, lede y16 .18s, all whileInView once. Rise helper renders a PLAIN static branch when calmed (bug found in QA: initial={false} does NOT clear mount-time inline opacity:0 styles — below-fold h2s were stuck at opacity 0 in calm mode; static-branch swap fixes it; verified all 7 sections opacity 1 in calm).
- Navigation: entrance + underline now driven by useMotionPreference; active underline origin-left with site bezier 500ms.
- THEME CROSS-FADE: theme-toggle dispatches html.theme-x-fade for 650ms around the switch; globals.css adds a colour-property transition list under that class (no !important so the reduce-motion kill-switches outrank it; JS also skips it when calmed/reduced). Lifecycle verified: dark → dark+fade → light+fade → light.
- SCIENTIFIC DIAGRAM: publications constellation stars now breathe — @keyframes twinkle (opacity var(--tw-min)→1), per-star --tw-del/--tw-dur/--tw-min inline phases; frozen to 0.01ms by both kill-switches (verified). Portrait plate gains a 1.02 hover scale (2s ease).
- HOVERS: research index rows — photon rule grows at left edge (before: scaleY, site bezier 500ms) on hover/focus-visible + folio numeral nudges translate-x-1 and holds transition-all; project cards (FIG.01 + 02–05) — 2px lift hover:-translate-y-0.5 + depth shadow, transition-[border-color,translate,box-shadow] (BUG FOUND: Tailwind 4 translate utilities set the separate `translate` property, not `transform` — an initial transition-[...,transform,...] would have snapped; verified via compiled CSS, switched to translate, and confirmed transition-transform covers transform,translate,scale,rotate).
- PERF GUARDS: black-hole particle budget scales with painted area (<0.5Mpx→560, <1.1Mpx→900, else 1150); both canvas MutationObservers now only rebuild on genuine dark-class change (were re-seeding on every html class flip incl. motion-calm/theme-x-fade).
- QA (agent-browser): hero DOM (2 masked lines, overlap math correct, 0 overflow) + VLM dark/light/mobile ✓; twinkle animationName live w/ varied per-star opacities ✓ frozen in calm (1e-05s) ✓; OS-level reduced-motion emulation (set media reduced-motion) → static hero, frozen twinkle ✓; calm toggle → all 7 section h2s opacity 1 (post-fix) ✓ restored ✓; research + project dialogs intact (settled/open questions + Motivation/Assumptions/Limitations/References) ✓; notebook deep link #note-speed-of-light opens essay ✓; contact happy path → success toast ✓; 390px overflow 0 ✓; console 0 errors; lint 0; tsc src/ 0.
- ENVIRONMENT NOTES for future rounds: (1) headless agent-browser reports (hover:hover)=false → ALL Tailwind 4 hover variants gated off in QA (pre-existing, site-wide, not a bug) — hover chain verified instead via injected media-independent override (accent line scale animated 0→1 mid-flight, transition verified); (2) Turbopack dev CSS chunks can lag one edit behind — a "missing rule" grep result must be re-verified after a reload before concluding it was dropped (twinkle was falsely reported dropped by a stale chunk).

Stage Summary:
- The site now has a single motion accent: one easing family + fixed durations + one stagger cadence, consumed by hero, headings, reveals, hovers, and the theme cross-fade.
- Signature moments: the two-line masked title rise, the self-drawing equation rule, the breathing publications constellation, and the Deep Field ↔ Archival Journal dissolve.
- Motion honesty: every effect has a static path — OS reduce, site "calm the universe" toggle, and print all receive fully-rendered content; canvases carry an area-based particle budget.
- No new animation library; framer-motion 12 + CSS transitions only; all effects transform/opacity (compositor-only).
- Next-phase candidates (queue from worklog): responsive/a11y audit round (trace 1a144585c9e1f0e1), physics-lab round (trace 1a144361ee9cd015 — orbits sim first choice), design-system token audit. Suggested motion follow-ups: notebook ledger row accent (deferred for variety), essay reading-view section entrances (radix handles current), lab slider micro-motion already instrument-grade.
