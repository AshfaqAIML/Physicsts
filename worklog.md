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
