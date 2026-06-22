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
| Hosting | Cloudflare Pages (auto-deploys from GitHub `main`) |
| Fonts | Montserrat + DM Sans self-hosted via @fontsource, critical weights preloaded |
| Tests | Vitest — calculator logic, particle engine, icon-mark graph (28 tests) |

**Version pins that matter:** Vite is pinned to v7 and @vitejs/plugin-react to v5 because
vite-react-ssg (0.9.x) does not support Vite 8 yet. React pinned to 18 per Dreamlabs convention.

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Button, Card, Field (Input/TextArea/Select), Accordion,
│   │                        # SectionHeading, StatCounter, GlowOrb, LightBeamButton
│   ├── icons/               # Brand line-icon set (24px grid, 1.75 stroke)
│   ├── home/                # Homepage narrative sections 1–10
│   ├── interactive/
│   │   ├── hero/            # HeroAssembly + canvas particle engine + icon-mark node graph
│   │   ├── calculator/      # BottleneckCalculator wizard (16 industries, dual model)
│   │   └── atmosphere/      # BubblePitBackground, MethodBubbleBackground, bubblePhysics
│   ├── SiteNav.tsx / SiteFooter.tsx / Section.tsx / Reveal.tsx / PageHero.tsx
├── layouts/SiteLayout.tsx   # Skip link, nav, outlet, footer, Lenis init
├── pages/                   # One file per route; secondary pages are lazy route modules
├── lib/                     # config.ts (flags/stubs), calculator.ts, leads.ts, Seo.tsx,
│                            # faqContent.ts, lenis.ts
└── styles/index.css         # Tailwind + fonts + the few justified custom keyframes
functions/api/lead.ts        # Lead endpoint: validation, honeypot, rate limit, Supabase REST
scripts/                     # process-logos.mjs, generate-seo-assets.mjs, screenshot.mjs (QA)
assets/brand/                # Brand guidelines PDF + raw logo exports
docs/                        # Brief, spec, plan, supabase-leads.sql, security audit,
                             # automations-required.md
```

---

## Key Files
- `src/lib/config.ts` — **feature flags + stubs**: `SHOW_PROOF` (false until real case studies),
  `BOOKING_URL` (null until Cal.com link exists), `CONTACT_EMAIL` = kevindigitalinflux@gmail.com.
- `src/components/interactive/hero/iconMarkGraph.ts` — the icon mark as a node graph; the
  constellation the hero assembles into. `particleEngine.ts` — pure, seeded, fully tested.
- `src/components/interactive/atmosphere/BubblePitBackground.tsx` — reusable violet canvas
  bubble field (35 bubbles, cursor repulsion, ResizeObserver-aware). Used via Section `background`
  prop + `elevateContent`. Wrap heading in `bg-white/70 backdrop-blur-md` panel for legibility.
- `src/lib/Seo.tsx` — per-route head tags + Organization/ProfessionalService JSON-LD.
- `docs/supabase-leads.sql` — run in Supabase SQL editor when wiring the lead pipeline.
- `docs/automations-required.md` — n8n workflow specs for lead notify, Google Sheets, weekly
  follow-up sequence, and Cal.com booked hook.
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

## Current Status (2026-06-21)

**Working (all verified):**
- Full site: home + 9 secondary pages + resources scaffold + branded 404, all pre-rendered to
  static HTML per route (SEO-safe SPA). Auto-deploying from GitHub `main` to Cloudflare Pages.
- Signature hero "Dream Assembly": pinned 280vh scroll (180vh mobile), canvas particles + cyan
  threads converging into the icon-mark constellation, magenta activation spark, cloud
  silhouettes, reduced-motion static fallback, mobile particle reduction.
- Bottleneck calculator: 4-step wizard, 16 industries (8 blue-collar, 8 service), instant teaser,
  email gate, dual time + revenue breakdown with broad-estimate disclaimer. Logic TDD'd.
  `/tools/bottleneck-check` supports `?industry=` preselect.
- Lead endpoint with validation, honeypot, naive rate limit, CORS allowlist; degrades gracefully
  (202) until Supabase creds are set.
- SEO: unique meta/canonical/OG per route, Organization + FAQPage + BreadcrumbList JSON-LD,
  sitemap.xml, robots.txt, branded OG image.
- Perf/a11y: Lighthouse a11y 100, CLS 0; route-level code splitting; font preloads; WCAG AA
  contrast audited and fixed via text tints; keyboard pass verified.
- Security audit passed — see `docs/security-audit-2026-06-12.md`.
- 28 unit tests green (`npm test`). `npm run typecheck` clean.

**Homepage additions (sessions 2026-06-17 to 2026-06-21):**
- `GlowCard` directional violet border glow on Pain Points cards (pointer-tracking mask-image).
- `LightBeamButton` rotating conic-gradient beam border on "See how it works" hero CTA.
- Hero sub-headline: bold lead stat, broader ICP ("businesses that service and build the world").
  Eyebrow updated to "Built for Blue-Collar & Service Businesses".
- Bold key stats on hero, Method, and PainPoints sections.
- Bottleneck checker expanded to 16 industries; added revenue-at-risk model alongside time model.
- Home nav link added (first item, desktop + mobile).
- `CONTACT_EMAIL` = kevindigitalinflux@gmail.com — live in footer and contact page.
- AboutPage + ServicesPage copy updated to include service SMEs alongside blue-collar businesses.
- `docs/automations-required.md` created — specs for 4 n8n workflows.

**Secondary page hero treatment (2026-06-21) — Services, Industries, How It Works, About, FAQ:**
- `BubblePitBackground` canvas animation on every PageHero (violet bubbles, cursor repulsion).
- `PageHero` accepts optional `background` prop; treatment only activates when prop is set.
- Eyebrow wrapped in rotating beam pill (same `border-spin` conic-gradient as LightBeamButton,
  2.5s, `inset-[1.5px]` frosted fill with `backdrop-blur-sm`) — text is white (`text-offwhite`)
  for maximum contrast against both the navy background and the violet bubbles.
- Title gets `textShadow` so letters stay crisp if a bubble drifts directly behind them.
- Contact page hero intentionally left without bubbles (form-focused, less atmospheric).

**Services page (2026-06-21):**
- `HeroConstellationSvg` removed from all secondary page heroes — removed from `PageHero.tsx`.
- Real-life screenshots replace industry placeholders in each pillar frame:
  `automated-booking-system.png` (Pillar 1), `invoice-automation.png` (Pillar 2),
  `learning-platform.png` (Pillar 3) — stored in `public/images/services/`.
- Pillar images use the same violet colour grade as the Industries section:
  `bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply`
  + `bg-gradient-to-t from-navy-deep` bottom fade.
- Scroll-parallax baked into each pillar image via `PillarImage` component: `useScroll` +
  `useTransform` drives a `y` offset on the `motion.img` (`scale: 1.15` gives headroom);
  respects `prefers-reduced-motion`.
- Engagement section: scroll-driven horizontal connector line (Method div technique —
  `scaleX` from `origin-left` via `useSpring`). Icon circles now `bg-navy-deep` (solid,
  matches section background) + `relative z-10` so the violet line is hidden behind them.
- Example copy in all three pillar cards reworded to hypothetical scenarios
  ("Imagine…", "Picture…", "Think of…") rather than factual client statements.
- Em-dashes replaced with commas throughout the card copy.
- `MetricStat` component: count-up animation on scroll-into-view (`useInView` + rAF, cubic
  ease-out, 1400ms), direction-aware colour (up = violet-ray on light / cyan-strong on dark,
  down = magenta-bloom on both), sign prefix (+/-) rendered as static text alongside the
  animated integer. Metrics grid (2×2) added inside each "What this looks like" card, below a
  divider, showing the two most meaningful improvements that go up and two that go down per pillar.

- `MetricStat` extracted to `src/components/ui/MetricStat.tsx` (shared); `MetricEntry` type
  exported from there. ServicesPage now imports from the shared component.

**Industries page renamed to "Who We Serve" (2026-06-21):**
- Page eyebrow, SEO title, SEO description, and breadcrumb updated to "Who We Serve".
  URL stays `/industries` to preserve external links and SEO.
- Nav label ("Who We Serve") updated in SiteNav and SiteFooter.
- Hero lede updated: "blue-collar and service SMEs alike. Find yours below and see just some
  examples of what we could fix."
- Bottleneck label changed from "The bottleneck we see most" to
  "An example of a common bottleneck in this field" across all 16 industries.
- Cleaning fix: em-dash replaced with comma.
- Each of the 16 industry sections now shows a 2×2 `MetricStat` grid (2 up, 2 down),
  specific to that industry's bottleneck example, with a disclaimer note below each grid:
  "Based on general industry research. Figures are illustrative examples and should be
  taken as indicative only, not a guarantee of results."

- Page layout rebuilt: the 16 individual full-width sections replaced with two grouped
  sticky-scroll layouts. Each group starts with an intro SectionHeading (eyebrow + title + lede),
  then `StickyIndustryScroll` component: left panel pins at `top-28` while right-side images
  scroll; IntersectionObserver (rootMargin -25% top/bottom) detects which image is in the viewport
  centre. Text transitions use `AnimatePresence mode="wait"` (exit: y -12 + opacity in 0.22s,
  enter: y +16 + opacity in 0.22s). Active image gets a `border-violet-ray/80` highlight ring.
  Pill-dot navigation below left panel: active industry expands to `w-8` pill (violet-ray / 
  cyan-strong), inactive dots are `w-2`; clicking any dot calls `scrollIntoView({ block: 'center'
  })` on the corresponding image ref. "X of 8" counter below the dots. Mobile: full content
  stacked above each image, sticky panel and dots hidden.

**How It Works page (2026-06-21):**
- `StepsJourney` sub-component: same scroll-driven `scaleY` vertical line as the Method section
  (`useScroll` + `useSpring`, `origin-top`, `bg-violet-ray`). Icon circles extracted outside `Card`
  and set `relative z-10` so the animated line passes cleanly behind them.
- Step 1 audit text updated: online audit is completely free; in-person visit is available at an
  additional cost. Client keeps the written breakdown either way.
- Guarantee reworded: money back if we do not deliver what was agreed in writing — no metric
  promises or "hitting a bar" language removed to avoid risky commitments.
- Step 4 retainer: explicitly "always recommended, always your choice, never a condition". Client
  always owns the code, accounts, and data from day one.

**About page updates (2026-06-22):**
- `POSITIONING_LINE` in `config.ts` updated: "...build and service the world." (propagates to
  footer and About page).
- Story section: em-dashes restructured to "including ... and" in body copy; 2-col desktop
  layout with text on left, `StoryImage` parallax frame on right.
- `StoryImage` real photo: `public/images/about/story.png` (Kevin's SME photo, sourced from
  Downloads). Violet colour-grade overlay (same as ServicesPage pillars).
- `LetterBlur` component: per-letter fade-in + slide-up + de-blur animation (18ms stagger
  per character, 0.5s duration). `sr-only` sibling for screen reader accessibility.
- `PillarsPyramid`: scroll offset `['start 70%', 'center 55%']` — pyramid completes while
  the section is centred on screen. All three cards wrapped in `BeamCard`: rotating
  conic-gradient beam border (same `border-spin 2.5s` + `--gradient-angle` technique as
  `LightBeamButton`), `bg-white` inner fill at `inset-[1.5px]`, hover lift/shadow. Apex
  card (Transformative) grows from scale 0.8 → 1; base cards fan from x ±120, y -80.
- `LetterBlur`: words now wrapped in `display:inline-block; white-space:nowrap` so the
  browser can only line-break at spaces, never mid-word (fixes 'that' splitting across lines).
- Three Pillars section title: "Our three-pillar vision" (eyebrow unchanged: "What we stand on").
- How It Works page: em-dash replaced with comma in Step 1 text.

**SiteIntro (2026-06-22):**
- `src/components/SiteIntro.tsx` — full-screen `bg-violet-ray` overlay with centred logo on every
  initial page load. 500 ms display then 300 ms opacity fade-out via `AnimatePresence`. Logo
  animates in with opacity + scale (0.2 s). Mounted in `SiteLayout` above `<SiteNav>`. Covers
  hero video / canvas initialisation so the first impression is always clean.

**BeamCard improvements (2026-06-22):**
- `inset-[2.5px]` border (was 1.5 px) — beam visibly bold.
- Ambient glow: `box-shadow rgba(139,50,255,0.22)` at rest + `hover:shadow-glow-violet`.
- Inner fill: `from-white via-white to-offwhite` gradient.
- `hover:-translate-y-2` lift.
- Variable `speed` prop: apex card 3.5 s, left 2.5 s, right 2 s.
- Ghost pillar numbers (01/02/03) as absolute-positioned faded decorative text (top-right, `text-7xl text-navy-deep/[0.06]`).
- Violet accent line (`h-px w-10 bg-violet-ray/60`) beneath each pillar title.
- `num` field added to `PILLARS` constant.

**FAQ updates (2026-06-22):**
- "Do you only work with blue-collar businesses?" → "Do you only work with blue-collar and service businesses?" with updated answer covering both audiences.
- CRM answer: em-dash replaced with comma ("Good, we build around it.").

**Talent engine copy update (2026-06-22):**
- About page "The talent engine" lede updated: Dreamlabs is now a partner company to both
  Digital Influx Academy (London) and UX Tree (Dublin), described as two internationally
  established EdTech companies serving as the in-house talent engine. "Sister company"
  language removed; geographic context added for both partners.

**Session 2026-06-22 (continued — UX + frontend polish):**
- `SiteIntro.tsx` intro logo replaced with `public/brand/dreamlabs-intro-logo.png`; overlay
  background changed to `bg-violet-ray` (#8B32FF) so the logo's violet background blends
  seamlessly. Cinematic exit: scale 1.06 + opacity 0 over 0.55s.
- `HeroCloudWipe.tsx` cloud-flash-on-navigation fixed: wrapper div starts `opacity:0`;
  GSAP sets it to 1 only after positioning cloud layers off-screen, so clouds never flash.
- `SiteFooter.tsx` email now links to Gmail compose (`mail.google.com/?view=cm&fs=1&to=…`).
- Landing page background set to `#8B32FF` (violet-ray) — intro logo appears borderless.
- `CalInlineEmbed.tsx` created — inline Cal.com booking embed using official namespace/queue
  shim pattern, CDN `app.cal.com/embed/embed.js`, namespace `30min`, brand colours injected.
- `ContactPage.tsx` restructured: two-column grid (form left, Cal.com calendar right).
  Booking card padding `p-6 md:p-8` (mobile-safe). `BOOKING_URL` set to live Cal.com link.
- ContactForm label updated: "What are your biggest bottlenecks slowing you down or making
  you lose money?"
- `TalentPartnerCard` (About page) partner institution cards added: Influx Academy + UX Tree.
  3D mouse-tracking tilt, BeamCard border, hover glow. Country pills changed from hover-only
  (AnimatePresence) to always-visible `whileInView` animation — touch-device fix.
- `BOOKING_URL` activated in `src/lib/config.ts`: `'kevin-zamora-saenz-a1nikc/30min'`.

**Session 2026-06-23 — Supabase + Cloudflare deployment:**
- Supabase MCP server added to project (`.mcp.json`): project ref `dbkxlmvblsqwpsqamwwj`.
- Supabase agent skills installed (`npx skills add supabase/agent-skills`) — 2 skills:
  "Supabase" and "Postgres Best Practices" in `.agents/skills/`.
- `leads` table created via MCP migration on Supabase project `dbkxlmvblsqwpsqamwwj`.
  RLS enabled, zero policies — service-role key only. Matches `docs/supabase-leads.sql`.
- Supabase project URL: `https://dbkxlmvblsqwpsqamwwj.supabase.co`
- Cloudflare Pages project created: `di-dreamlabs-website` (account: kevindigitalinflux@gmail.com).
- First production deployment via `wrangler pages deploy dist` — 148 files uploaded, Pages
  Function (`functions/api/lead.ts`) detected and deployed (`uses_functions: true`).
- **Live at: https://di-dreamlabs-website.pages.dev**
- `SUPABASE_URL` already set as env var in both production and preview environments.
- To redeploy: `npm run build && npx wrangler pages deploy dist --project-name di-dreamlabs-website`
  (wrangler is now authenticated on this machine).

**In progress:** Nothing.

**Not yet done / needs Kevin:**
- **Add `SUPABASE_SERVICE_ROLE_KEY` to Cloudflare Pages** — Pages dashboard → di-dreamlabs-website
  → Settings → Environment Variables. Get value from: Supabase Dashboard → Project Settings →
  API → `service_role` key (the long secret one — never commit it). Until set, the contact form
  returns 202 (success UI shown to user) but leads are not stored.
- **WAF rate-limit rule** on `/api/lead` (30 req/min/IP) — Cloudflare dashboard, see `docs/security-audit-2026-06-12.md`.
- **Custom domain** (di-dreamlabs.com) — Cloudflare Pages → di-dreamlabs-website → Custom domains.
- Phone and address → `src/lib/config.ts` (footer + JSON-LD schema).
- Legal pages need a solicitor pass; company details are placeholders.
- n8n automations in `docs/automations-required.md` — not yet built.

**Known issues / notes:**
- Lighthouse perf ~0.63 on emulated slow-4G mobile against the *uncompressed* vite preview
  server; Cloudflare Brotli + CDN will materially improve these numbers. Re-measure after
  first Cloudflare deploy before optimising further.
- Industries photos are Unsplash placeholders, swap-ready (same filenames in
  `public/images/industries/`).
- Headline copy runners-up are in a comment in `HeroAssembly.tsx`.

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
