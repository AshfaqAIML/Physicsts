# The Physicist — A Cinematic Scientific Portfolio

**"Exploring the Universe, One Fundamental Question at a Time."**

A personal portfolio for a physicist, scientific thinker, and explorer of the
fundamental laws of nature — built as a single-page digital universe with a
procedural black-hole hero, real interactive physics simulations, KaTeX
typesetting, and an honest, content-integrity-first editorial voice.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Motion | Framer Motion (reduced-motion aware) |
| Mathematics | KaTeX |
| Database | Prisma ORM + SQLite (contact messages only) |
| Icons | Lucide |
| Fonts | Instrument Serif · Inter · IBM Plex Mono |

## Getting started

```bash
# 1. Install dependencies
bun install

# 2. Configure environment (see ".env.example")
cp .env.example .env

# 3. Push the database schema
bun run db:push

# 4. Run the development server
bun run dev          # → http://localhost:3000
```

Production build:

```bash
bun run build
bun start
```

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for SEO metadata, Open Graph, sitemap, and robots | `https://example.com` |
| `DATABASE_URL` | SQLite file for contact-form storage | `file:./db/custom.db` |

No secrets are required. The contact form's only dependency is the local
database; there is no third-party mail service by design — submissions are
validated, spam-checked (honeypot + rate limit), and stored privately.

## Editing your content

All copy lives in `src/content/` — presentation never hard-codes it:

| File | Controls |
| --- | --- |
| `site.ts` | Identity, navigation, contact channels |
| `profile.ts` | About-section biography, facts, questions, approach |
| `research.ts` | The six research-interest areas (equations, concepts, reading) |
| `projects.ts` | Project gallery entries |
| `publications.ts` | Publication list / empty state |
| `notes.ts` | Scientific-notebook entries and the example essay |

Placeholder values are wrapped in `[brackets]` or marked with a dashed
**placeholder** badge in the UI. Nothing on the site fabricates credentials,
publications, DOIs, or affiliations — replace placeholders with your real
details and they propagate everywhere.

To add a publication once one exists, append a typed entry in
`publications.ts`; the type/year filters activate automatically.

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # fonts, metadata, providers, theme
│   ├── page.tsx            # section assembly (single route)
│   ├── icon.svg            # custom favicon (orbit mark)
│   ├── robots.ts           # robots.txt (generated)
│   ├── sitemap.ts          # sitemap.xml (generated)
│   ├── globals.css         # design system (Deep Field / Archival Journal)
│   └── api/contact/route.ts  # validation + honeypot + rate limit + Prisma
├── components/site/
│   ├── navigation.tsx      # scroll-spy nav, glass on scroll, mobile sheet
│   ├── hero.tsx            # cinematic opening, parallax, field equation
│   ├── black-hole.tsx      # procedural accretion-disk canvas
│   ├── about.tsx           # editorial biography spread
│   ├── research.tsx        # interest grid + detail dialogs
│   ├── projects.tsx        # project gallery + brief dialogs
│   ├── publications.tsx    # honest empty state + dormant filters
│   ├── notebook.tsx        # journal ledger + full reading view
│   ├── lab/
│   │   ├── lab.tsx         # laboratory assembly (tabs, math, assumptions)
│   │   ├── lensing-sim.tsx # thin-lens ray-shooting simulation
│   │   └── orbits-sim.tsx  # two-body velocity-Verlet + analytic overlay
│   ├── contact.tsx         # channels + validated form
│   ├── footer.tsx          # colophon (sticky-bottom compliant)
│   ├── tex.tsx             # KaTeX renderers (Tex + Prose)
│   ├── reveal.tsx           # reduced-motion-aware scroll reveals
│   └── section-heading.tsx # editorial section headers
└── content/                # typed, presentation-free content layer
```

## The interactive laboratory

- **Gravitational lensing** — every pixel block is traced backwards through
  the point-mass thin-lens equation `β = θ − θ_E²θ/|θ|²`; surface brightness
  is conserved, so Einstein rings, arcs, and multiple images are consequences
  of the mapping, not drawings. Drag the mass (mouse/touch) or use arrow keys.
- **Orbital mechanics** — the Newtonian two-body problem integrated with
  symplectic velocity Verlet, overlaid with the exact analytic conic section.
  Live readouts of eccentricity, semi-major axis, energy, period, and energy
  drift. Space toggles play, R resets.

Both state their assumptions honestly and work with mouse, touch, and
keyboard.

## Accessibility & performance

- Semantic HTML, skip-link, ARIA-labelled interactive regions
- Keyboard-accessible navigation, dialogs, tabs, sliders, and canvases
- Visible focus indicators throughout
- `prefers-reduced-motion` respected everywhere (static renders, paused sims)
- Canvas simulations pause off-screen and on hidden tabs
- No horizontal overflow at any viewport; mobile-first responsive
- Honest empty states; no dead links; no fake functionality

## Performance & production readiness

- **KaTeX runs on the server.** All static equations (hero, research,
  projects, lexicon, notebook essays, lab panels) are typeset during
  SSR and passed to client components as ready-made nodes — the library
  never enters the browser bundle. The AI companions' runtime-generated
  answers are the one exception: they typeset via a lazily-loaded
  KaTeX chunk fetched only when an answer actually contains math.
- **The laboratory mounts on approach.** The three instruments are
  code-split behind a viewport gate (`BenchGate`) and wake within ~1.5
  screens of scrolling; shared links that target a sleeping bench
  scroll it awake, then deliver their state.
- **Above-the-fold visuals are eager** (the hero canvas and star field
  mount immediately); **below-fold imagery is lazy** (portrait ships
  AVIF/WebP through `next/image` with a blur LQIP and explicit
  dimensions — no layout shift).
- Canvas simulations pause off-screen, on hidden tabs, and under
  `prefers-reduced-motion`; animation is compositor-only
  (transform/opacity).
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, and a `frame-ancestors`/
  `base-uri`/`object-src` CSP) are set in `next.config.ts`.
- API routes validate every input server-side (zod), rate-limit per IP
  with swept in-memory windows, keep secrets server-side, and never
  leak internals in error responses. The contact form adds a honeypot.
- Type errors fail the build (`typescript.ignoreBuildErrors` removed);
  `reactStrictMode` is on.

## Deployment

Any Node/Bun host or platform with Next.js support (Vercel, Netlify,
self-hosted):

1. Copy `.env.example` to `.env` and set:
   - `NEXT_PUBLIC_SITE_URL` — the production origin (no trailing
     slash). It drives the canonical link, Open Graph URLs, sitemap,
     and robots.txt. Set it **before** building.
   - `DATABASE_URL` — SQLite path for the contact form
     (default: `file:/home/z/my-project/db/custom.db`).
   No secrets are required by the client bundle; `NEXT_PUBLIC_*`
   variables are public by design.
2. Provision the SQLite database (`bun run db:push`) — or point
   `DATABASE_URL` at your database if you swap providers.
3. `bun run build && bun start`. The build type-checks the whole app
   and emits a standalone server (`output: "standalone"` in
   `next.config.ts`) — behind any reverse proxy, forward to it and pass
   `x-forwarded-for` so the API rate limits see real client IPs.
4. After deploying, verify:
   - `curl -I https://your-domain/` → 200 + security headers present;
   - `/robots.txt` and `/sitemap.xml` resolve with your origin;
   - `og.jpg` preview renders in a social-share debugger;
   - the contact form round-trips (check the `ContactMessage` table).

**Known deployment limitations** (honest, not blockers):

- Rate limiting and the KaTeX-answer chunk are per-process / client
  side; a multi-instance deployment would need a shared store for
  limits (the API surface is one function in `src/lib/rate-limit.ts`).
- A full script-src CSP requires a nonce strategy through the Next.js
  document; the current CSP pins `frame-ancestors`, `base-uri`, and
  `object-src` only. Add the rest behind real-page testing on your
  host.
- `NEXT_PUBLIC_SITE_URL` defaults to `https://example.com` when unset
  — metadata URLs would point there until configured.

## Regenerating the imagery

The hero black hole, lensing star fields, and orbit diagrams are procedural
Canvas 2D code (no image assets). `public/og.jpg` is generated for social
sharing and can be regenerated freely:

```bash
z-ai image -p "..." -o ./public/og.jpg -s 1344x768
```

`public/portrait.jpg` is a real photograph (864×1080, 4:5). To swap it, drop
your own image in at the same filename and dimensions; the About plate picks
it up automatically. The dimensions declared in `src/components/site/about.tsx`
(`width`/`height`) must be updated in step with it to avoid layout shift, and
`PORTRAIT_BLUR` there is a base64 LQIP generated from the image — regenerate it
if you change the photo.
