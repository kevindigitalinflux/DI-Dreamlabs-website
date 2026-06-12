# DI Dreamlabs — Marketing Website

## What This Is
The public, lead-generating marketing website for Digital Influx Dreamlabs Ltd — an AI product
engineering and automated systems agency for blue-collar and service SMEs. The site's job is to
build immediate credibility, communicate the brand's "dream → working system" positioning through
a signature scroll-driven hero, and convert visitors into free-audit bookings via clear CTAs and
an interactive bottleneck/ROI calculator.

**Master references:** `docs/DI-Dreamlabs-Website-Build-Brief.md` (full brief — single source of
truth) and `docs/superpowers/specs/2026-06-12-di-dreamlabs-website-design.md` (approved decisions).

---

## Tech Stack

| Layer | Default |
|---|---|
| Framework | React 18 + TypeScript (strict) + React Router v6 |
| Build/SSG | Vite 7 + **vite-react-ssg** (pre-renders every route to static HTML; hydrates to SPA) |
| Styling | Tailwind CSS v3 — utility classes only; brand tokens in `tailwind.config.ts` |
| Animation | GSAP + ScrollTrigger (hero), Lenis (smooth scroll), Framer Motion (micro-interactions) |
| Lead Capture | Cloudflare Pages Function (`functions/api/lead.ts`) → Supabase `leads` table (RLS) |
| Hosting | Cloudflare Pages (no remote/deploy configured yet) |
| Fonts | Montserrat + DM Sans self-hosted via @fontsource, critical weights preloaded |
| Tests | Vitest — calculator logic, particle engine, icon-mark graph (17 tests) |

**Version pins that matter:** Vite is pinned to v7 and @vitejs/plugin-react to v5 because
vite-react-ssg (0.9.x) does not support Vite 8 yet. React pinned to 18 per Dreamlabs convention.

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Button, Card, Field (Input/TextArea/Select), Accordion,
│   │                        # SectionHeading, StatCounter, GlowOrb
│   ├── icons/               # Brand line-icon set (24px grid, 1.75 stroke)
│   ├── home/                # Homepage narrative sections 1–10
│   ├── interactive/
│   │   ├── hero/            # HeroAssembly + canvas particle engine + icon-mark node graph
│   │   └── calculator/      # BottleneckCalculator wizard
│   ├── SiteNav.tsx / SiteFooter.tsx / Section.tsx / Reveal.tsx / PageHero.tsx
├── layouts/SiteLayout.tsx   # Skip link, nav, outlet, footer, Lenis init
├── pages/                   # One file per route; secondary pages are lazy route modules
├── lib/                     # config.ts (flags/stubs), calculator.ts, leads.ts, Seo.tsx,
│                            # faqContent.ts, lenis.ts
└── styles/index.css         # Tailwind + fonts + the few justified custom keyframes
functions/api/lead.ts        # Lead endpoint: validation, honeypot, rate limit, Supabase REST
scripts/                     # process-logos.mjs, generate-seo-assets.mjs, screenshot.mjs (QA)
assets/brand/                # Brand guidelines PDF + raw logo exports
docs/                        # Brief, spec, plan, supabase-leads.sql, security audit
```

---

## Key Files
- `src/lib/config.ts` — **feature flags + stubs**: `SHOW_PROOF` (false until real case studies),
  `BOOKING_URL` (null until Cal.com link exists), contact details (null until supplied).
- `src/components/interactive/hero/iconMarkGraph.ts` — the icon mark as a node graph; the
  constellation the hero assembles into. `particleEngine.ts` — pure, seeded, fully tested.
- `src/lib/Seo.tsx` — per-route head tags + Organization/ProfessionalService JSON-LD.
- `docs/supabase-leads.sql` — run in Supabase SQL editor when wiring the lead pipeline.
- `scripts/screenshot.mjs` — QA tool: `node scripts/screenshot.mjs <url> <out> [w] [h] [scrollY] [reduce]`.

---

## Coding Conventions
- TypeScript strict, no `any`. Named exports only. Components < 150 lines (split otherwise).
- Tailwind utilities only; the only custom CSS is keyframes/grain in `styles/index.css`.
- Every interactive component handles loading/error/empty states.
- All motion respects `prefers-reduced-motion` (global kill switch + per-component checks).
- JSDoc on all exported functions.

### Colour rules (enforced in code)
- Exact brand hex values in `tailwind.config.ts` — never approximate.
- **Cyan = data domain** (counters, hero threads). **Magenta = alerts/urgency + the single hero
  spark**. Never adjacent. The calculator hides cyan counters while an error is displayed.
- **AA text tints (derived, text-only):** `violet-text` #A866FF for small violet text on Deep
  Navy (Violet Ray itself is only 3.42:1 there); `magenta-text` #D81B53 for error copy on light
  surfaces (Bloom is 3.83:1). Fills/CTAs/borders/spark still use the exact brand tokens.

---

## Current Status (2026-06-12, overnight build session)

**Working (all verified at localhost via build + screenshots):**
- Full site: home + 9 secondary pages + resources scaffold + branded 404, all pre-rendered to
  static HTML per route (SEO-safe SPA).
- Signature hero "Dream Assembly": pinned 280vh scroll (180vh mobile), canvas particles + cyan
  threads converging into the icon-mark constellation, magenta activation spark, cloud
  silhouettes, reduced-motion static fallback, mobile particle reduction. Verified at 5 scroll
  positions, mobile, and reduced-motion emulation.
- Bottleneck calculator: 4-step wizard, instant teaser, email gate, full £ breakdown; works on
  homepage embed and `/tools/bottleneck-check` (supports `?industry=` preselect). Logic TDD'd.
- Lead endpoint with validation, honeypot, naive rate limit, CORS allowlist; degrades gracefully
  (202) until Supabase creds exist.
- SEO: unique meta/canonical/OG per route, Organization + FAQPage + BreadcrumbList JSON-LD,
  sitemap.xml, robots.txt, branded OG image.
- Perf/a11y: Lighthouse a11y 100, CLS 0; route-level code splitting (secondary pages 1–2KB gz);
  font preloads; WCAG AA contrast audited and fixed via text tints; keyboard pass verified.
- Security audit passed — see `docs/security-audit-2026-06-12.md`.
- 17 unit tests green (`npm test`). `npm run typecheck` clean.

**In progress:** nothing — awaiting Kevin's review of the `feat/site-build` branch.

**Not yet done / needs Kevin:**
- GitHub remote + Cloudflare Pages project (auto-deploy from main).
- Cal.com booking link → `BOOKING_URL` in `src/lib/config.ts`.
- Real contact details (email/phone/address) → `src/lib/config.ts` (footer + schema pick them up).
- Supabase project: run `docs/supabase-leads.sql`, set env vars in Pages dashboard, add WAF
  rate-limit rule on `/api/lead` (30 req/min/IP) — see security audit deploy-time actions.
- Live test of `/api/lead` on a Pages preview deploy (vite preview can't run Pages Functions).
- Legal pages need a solicitor pass; company details are placeholders.
- DLabs short-logo exports (only if a future layout needs them).

**Known issues / notes:**
- Lighthouse perf ~0.63 on emulated slow-4G mobile against the *uncompressed* vite preview
  server; Cloudflare Brotli + CDN will materially improve lab and field numbers. Re-measure
  after first deploy before optimising further (next lever: client-only lazy hero motion).
- Industries photos are Unsplash placeholders, swap-ready (same filenames in
  `public/images/industries/`).
- Headline copy options (3 runners-up) are in a comment in `HeroAssembly.tsx`.

## Security
- Audit 2026-06-12: CLEAR TO SHIP (static site). Two deploy-time dashboard actions before the
  lead pipeline goes live (WAF rate rule + env vars). Full report:
  `docs/security-audit-2026-06-12.md`.

---

## Do Not Touch
- Brand colour tokens — exact hex values only. The two `*-text` tints are deliberate,
  documented AA accommodations; do not "simplify" them back to the raw tokens.
- Logo files and lockup/background pairings — only approved combinations.
- Hero "Assembly" choreography timings (Brief §6.2) — changes ripple across the homepage.
- The cyan/magenta functional separation rule.
- Vite 7 pin until vite-react-ssg supports Vite 8.
