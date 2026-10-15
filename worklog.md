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
