# DI Dreamlabs Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete DI Dreamlabs lead-generating marketing website (di-dreamlabs.com) per the build brief and approved spec — signature scroll-driven hero, full homepage narrative, ROI calculator with lead capture, secondary pages, SEO, and accessibility.

**Architecture:** React 18 SPA pre-rendered to static HTML per route via `vite-react-ssg` (SEO-safe), hosted on Cloudflare Pages with a Pages Function for lead capture into Supabase. GSAP ScrollTrigger drives the pinned hero "Dream Assembly" canvas sequence; Lenis provides smooth scroll; Framer Motion handles micro-interactions. All brand tokens come from the brand guidelines exactly.

**Tech Stack:** React 18, TypeScript (strict), Vite, vite-react-ssg, React Router v6, Tailwind CSS v3, GSAP + ScrollTrigger, Lenis, Framer Motion, @fontsource (Montserrat, DM Sans), Vitest (logic tests), Cloudflare Pages + Functions, Supabase (leads table).

**Master references:** `docs/DI-Dreamlabs-Website-Build-Brief.md` (brief), `docs/superpowers/specs/2026-06-12-di-dreamlabs-website-design.md` (spec). Brief sections cited as §N throughout.

**Working branch:** `feat/site-build` off `main`. Commit after every task (`feat:`/`fix:`/`chore:`). `main` is merged only after Kevin's review.

**Hard brand constraints (apply to every task):**
- Colours exactly: Violet Ray `#8B32FF`, Deep Navy `#040F49`, Rebecca Purple `#64378B`, Magenta Bloom `#F0386B`, Strong Cyan `#00DFDF`, Off White `#F4F4F8`.
- Cyan = data/results domain only. Magenta = alerts/urgency + the single hero spark only. Never adjacent to each other.
- Montserrat SemiBold+ for headings; DM Sans for body; min body 14px.
- Every piece of copy passes the Plumber Test (§2.5).
- All motion honours `prefers-reduced-motion`.
- Named exports only, TS strict (no `any`), components < 150 lines, JSDoc on exported functions.

---

## Phase 0 — Scaffold

### Task 0.1: Branch + Vite scaffold

**Files:** Create project via `npm create vite@latest`, then restructure.

- [ ] `git switch -c feat/site-build`
- [ ] Scaffold Vite React-TS app into a temp dir and merge into repo root (repo already has assets/docs): `npm create vite@latest . -- --template react-ts` equivalent — create `package.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `src/main.tsx` manually if the CLI refuses a non-empty dir.
- [ ] Install deps:
  `npm i react react-dom react-router-dom gsap lenis framer-motion @fontsource/montserrat @fontsource/dm-sans`
  `npm i -D typescript vite @vitejs/plugin-react vite-react-ssg tailwindcss@3 postcss autoprefixer vitest @types/react @types/react-dom sharp`
- [ ] Verify `vite-react-ssg` installs and its README pattern matches; **fallback if broken:** plain Vite SPA + `vite-prerender-plugin`; record choice in CLAUDE.md.
- [ ] `tsconfig.json`: `"strict": true`, `"noUncheckedIndexedAccess": true`, path alias `@/* → src/*`.
- [ ] Run: `npm run dev` → Vite serves; `npm run build` → succeeds.
- [ ] Commit: `chore: scaffold vite react-ts app with core dependencies`

### Task 0.2: Tailwind + design tokens + fonts

**Files:** Create `tailwind.config.ts`, `postcss.config.js`, `src/styles/index.css`.

- [ ] Tailwind config with exact brand tokens:

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        violet: { ray: '#8B32FF' },
        navy: { deep: '#040F49' },
        rebecca: '#64378B',
        magenta: { bloom: '#F0386B' },
        cyan: { strong: '#00DFDF' },
        offwhite: '#F4F4F8',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      maxWidth: { content: '72rem' },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] `src/styles/index.css`: `@tailwind base/components/utilities`; import fontsource weights (Montserrat 600/700/800, DM Sans 300/400/500); base rules: `body { @apply bg-offwhite text-navy-deep font-body; }`, selection colour Violet Ray, focus-visible ring Violet Ray, `@media (prefers-reduced-motion: reduce)` global animation kill switch.
- [ ] Type scale per §8.1 implemented as Tailwind utilities used directly in components (display: `text-4xl md:text-7xl font-heading font-extrabold leading-[1.05]` etc.) — document the mapping as comments in `src/styles/index.css`.
- [ ] Commit: `feat: tailwind design tokens, brand fonts, base styles`

### Task 0.3: Logo asset processing

**Files:** Create `scripts/process-logos.mjs`, output to `public/brand/`.

- [ ] Node script using `sharp`: for each solid-bg logo in `assets/brand/logo/`, flood-style background removal is risky around anti-aliased edges — instead, since logos only ever sit on the three approved colours, generate web-optimised PNGs (and resized variants: nav 360w, footer 480w, full 1200w) keeping solid-bg versions as-is, plus the already-transparent primary. Strip backgrounds only for the two icon marks (flat fills; use sharp's `removeAlpha→threshold` mask or simple per-pixel replace of the exact bg colour with tolerance ~12).
- [ ] Output: `public/brand/logo-primary-transparent.png`, `logo-primary-navy.png`, `logo-primary-violet.png`, `icon-transparent-for-navy.png` (white "a" + violet bubbles), `icon-transparent-for-light.png` (navy "a" + violet bubbles), each at sensible sizes; favicon set (`public/favicon.ico` + `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) from the icon mark.
- [ ] Run: `node scripts/process-logos.mjs` → verify outputs exist and look right (Read the PNGs to visually confirm clean edges).
- [ ] Commit: `chore: process logo assets and favicons`

### Task 0.4: Routing + layout skeleton + SSG

**Files:** Create `src/main.tsx`, `src/routes.tsx`, `src/layouts/SiteLayout.tsx`, `src/components/SiteNav.tsx`, `src/components/SiteFooter.tsx`, `src/lib/config.ts`, placeholder page components in `src/pages/` for every route in §5 (`HomePage.tsx`, `ServicesPage.tsx`, `IndustriesPage.tsx`, `HowItWorksPage.tsx`, `BottleneckCheckPage.tsx`, `AboutPage.tsx`, `FaqPage.tsx`, `ContactPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, `StyleGuidePage.tsx`, `NotFoundPage.tsx`, `resources/ResourcePage.tsx` scaffold).

- [ ] `src/lib/config.ts`:

```ts
/** Site-wide feature flags and stubbed external links. */
export const SHOW_PROOF = false
/** Cal.com booking URL — replace when Kevin supplies the real link. */
export const BOOKING_URL: string | null = null
export const SITE_URL = 'https://di-dreamlabs.com'
export const CONTACT_EMAIL: string | null = null // stub — Kevin to supply
```

- [ ] `vite-react-ssg` entry: `createRoot` replaced by `ViteReactSSG({ routes })` per its docs; routes array uses React Router v6 route objects with `SiteLayout` wrapping all pages; `/style-guide` included but excluded from sitemap later.
- [ ] `SiteLayout`: nav, `<main>`, footer, skip-to-content link, Lenis initialisation hook stub (real wiring in Phase 2).
- [ ] `SiteNav`: Deep Navy translucent backdrop-blur bar, primary logo (navy-bg transparent variant), links (Services, Industries, How It Works, About, FAQ), primary CTA button "Get your free audit" → `/contact`; mobile hamburger panel. `SiteFooter`: logo, nav links, newsletter form stub, NAP placeholders clearly marked, legal links.
- [ ] Run: `npm run build` → dist contains one `.html` per route with real content. `npm run dev` → all routes render.
- [ ] Commit: `feat: routing, SSG pre-rendering, nav and footer skeleton`

### Task 0.5: Reference screenshot (best-effort)

- [ ] Attempt headless capture of https://www.aura.build/templates/digitize-ventures-venture-capital-1 into `assets/reference/aura-digitize-hero.png` (use installed Chrome via `--headless=new --screenshot`). If it fails (auth wall/timeouts), note in CLAUDE.md and proceed — the brief's written description of its energy is sufficient.
- [ ] Commit if captured: `chore: add aura.build reference screenshot`

---

## Phase 1 — Design System (`/style-guide`)

### Task 1.1: Core UI components

**Files:** Create `src/components/ui/Button.tsx`, `Card.tsx`, `Input.tsx`, `TextArea.tsx`, `Select.tsx`, `Accordion.tsx`, `SectionHeading.tsx`, `StatCounter.tsx`, `GlowOrb.tsx`.

Component contracts (all named exports, typed props, < 150 lines each):

- `Button`: `variant: 'primary' | 'secondary'`, `surface: 'dark' | 'light'`, optional `href` (renders `<a>`/Link) else `<button>`. Primary = Violet Ray fill, Off White bold text ≥16px, hover scale 1.03 + soft violet glow shadow. Secondary = 1px outline (Violet Ray on light / Off White on dark), fill-on-hover. Focus ring Violet Ray. Height 56px (h-14), radius 12px.
- `Card`: `surface: 'dark' | 'light'` — dark: translucent Off White/5 with faint violet border-glow on hover; light: Off White fill, soft shadow, hover lift (`-translate-y-1`, shadow bloom). Transform/opacity transitions only.
- `Input`/`TextArea`/`Select`: 52px height, label + error slot; focus ring Violet Ray; error state Magenta Bloom text+border; `aria-invalid` + `aria-describedby` wiring.
- `Accordion`: keyboard-accessible disclosure list (`<button aria-expanded>` + height auto-animation via Framer Motion, respecting reduced motion).
- `SectionHeading`: eyebrow (Montserrat all-caps label, Rebecca Purple/Violet Ray), H2, optional lede paragraph; `surface` prop for colour handling.
- `StatCounter`: animates number on scroll-into-view (IntersectionObserver + Framer Motion), rendered in Strong Cyan (data domain), static final value when reduced motion.
- `GlowOrb`: absolutely-positioned radial-gradient div (Violet Ray / Rebecca Purple / faint Cyan variants) with blur — the soft volumetric glow primitive reused in dark sections.

- [ ] Build each component; compose all of them on `StyleGuidePage` with dark and light demo sections.
- [ ] Run dev server; visually verify at desktop + 375px mobile via headless screenshot if available.
- [ ] Commit: `feat: design system components and style-guide page`

### Task 1.2: Brand icon set

**Files:** Create `src/components/icons/index.tsx` — one file of small SVG icon components, consistent 1.75px stroke, rounded caps, 24px grid, extending the cloud/bubble/flask motif.

- [ ] Icons needed: MissedCall, Schedule, Visibility, Quote, Paperwork, Inventory (pain points §7.1); Audit, Build, Pilot, Own (method §7.2); Ownership, Guarantee, PilotFirst, Team, Delivery (USPs §7.4); Cleaning, Facilities, Maintenance, Construction, Trades, Logistics (industries §7.5); Flask, Bubble, Cloud (brand motifs); plus ChevronDown, ArrowRight, Menu, Close utility icons.
- [ ] Each icon accepts `className` (colour via `currentColor`).
- [ ] Add icon grid to style guide. Commit: `feat: brand line-icon set`

---

## Phase 2 — Signature Hero "Dream Assembly" (§6)

### Task 2.1: Icon-mark node graph extraction

**Files:** Create `src/components/interactive/hero/iconMarkGraph.ts`.

- [ ] Trace the icon mark (flask "a" + bubble trail) from `assets/brand/logo/icon-navy-bg.png` into a normalised node graph: ~60–90 points (0–1 coordinate space) along the "a" letterform outline, flask liquid line, and 3 bubble circles, plus an edge list connecting neighbouring nodes. Hand-author the coordinates by studying the image (Read tool) — accuracy to silhouette matters more than point count.
- [ ] Export `ICON_MARK_NODES: ReadonlyArray<{ x: number; y: number }>` and `ICON_MARK_EDGES: ReadonlyArray<[number, number]>` and `SPARK_NODE_INDEX` (the flask-liquid core node for the magenta spark).
- [ ] Vitest sanity test: all coords within [0,1], all edge indices valid, ≥60 nodes.
- [ ] Commit: `feat: icon-mark constellation node graph`

### Task 2.2: Canvas particle engine

**Files:** Create `src/components/interactive/hero/particleEngine.ts` + `particleEngine.test.ts`.

Pure-logic engine (no DOM): given `count`, seeded RNG, viewport ratio, and the icon-mark graph, precompute per-particle `{ startX, startY, startSize, startOpacity, endX, endY, endSize, endOpacity, hue: 'white' | 'violet' | 'cyan' }` where end positions are the constellation nodes (extra particles fade out). Expose `sampleFrame(progress: number): Frame` returning interpolated particle states + thread segments (edges draw via per-edge progress windows between 0.4–0.85, stroke-dash style). Deterministic given a seed.

- [ ] TDD: tests for determinism (same seed → same frames), progress 0 = scattered start states, progress 1 = all constellation nodes occupied exactly, edge visibility windows monotonic, cyan particles ≤ 15% of count.
- [ ] Implement; `npx vitest run` green.
- [ ] Commit: `feat: scroll-driven particle engine with constellation end state`

### Task 2.3: Hero component + scroll choreography

**Files:** Create `src/components/interactive/hero/HeroAssembly.tsx`, `HeroCanvas.tsx`, `useScrollProgress.ts`, `src/lib/lenis.ts`; modify `SiteLayout.tsx` (Lenis wiring), `HomePage.tsx`.

- [ ] `src/lib/lenis.ts`: Lenis singleton + GSAP ScrollTrigger integration (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add`), disabled under reduced motion.
- [ ] `HeroAssembly`: pinned container (GSAP ScrollTrigger `pin: true, scrub: true`, end `+=280%` desktop / `+=180%` < 768px). Headline/subhead/CTAs render immediately (server HTML — LCP-critical, no JS dependency); canvas mounts after first paint (`requestIdleCallback`/effect).
- [ ] Choreography per §6.2 table: headline scale/fade 15–40%, cloud silhouettes (3–5 SVG shapes, DOM layer) drift in 15–40%, threads 40–65%, constellation lock 65–85%, magenta spark pulse + handoff 85–100%. Cloud SVGs reuse the logo's cloud silhouette path. Supporting copy line fades in 65–85%.
- [ ] `HeroCanvas`: rAF-driven canvas drawing `sampleFrame(progress)`; devicePixelRatio aware; particle count 80 desktop / 30 mobile; soft glow via `shadowBlur` on a subset only (perf).
- [ ] Reduced-motion fallback: static ~100vh hero, fully-formed constellation as inline SVG (generated from the node graph) with one gentle opacity pulse, no pin.
- [ ] Headline copy (write 3–5 options per §14, pick best, leave others in a comment for Kevin):
  e.g. "Your biggest daily headache, turned into your sharpest advantage." + subhead naming audience + free audit CTA pair.
- [ ] Verify: dev server scroll-through at 1440px and 375px (headless screenshots at progress points if possible), reduced-motion via emulation, no console errors, Lighthouse LCP element = headline text.
- [ ] Commit: `feat: hero Dream Assembly scroll sequence with fallbacks`

---

## Phase 3 — Homepage Narrative (§7)

### Task 3.1: Scroll-reveal utility + section shell

**Files:** Create `src/components/Reveal.tsx`, `src/components/Section.tsx`.

- [ ] `Reveal`: Framer Motion `whileInView` fade + translateY(24px), 0.6s ease-out, optional stagger context for children (80–120ms), `viewport={{ once: true, margin: '-10%' }}`, disabled under reduced motion.
- [ ] `Section`: `surface: 'dream' | 'workshop'` wrapper (Deep Navy w/ grain overlay + optional GlowOrbs vs Off White), consistent py-24/py-32, max-w-content centring.
- [ ] Commit: `feat: section shell and scroll-reveal primitives`

### Task 3.2–3.9: Homepage sections (one commit each)

**Files:** Create `src/components/home/PainPoints.tsx`, `Method.tsx`, `Pillars.tsx`, `WhyDreamlabs.tsx`, `Industries.tsx`, `CalculatorTeaser.tsx` (placeholder slot until Phase 4), `Proof.tsx` (behind `SHOW_PROOF`), `Faq.tsx`, `FinalCta.tsx`; assemble in `HomePage.tsx`.

Per-section requirements (content + motion per §7 table; copy passes Plumber Test; each section uses `Section` + `Reveal` + design-system components):

- [ ] **PainPoints** (dream): 6 bottleneck cards (missed calls, scheduling chaos, no job visibility, slow quoting, paper admin, stock surprises), line icons, stagger reveal. Commit `feat: pain points section`.
- [ ] **Method** (workshop): 4-step vertical stepper, connecting line draws on scroll (SVG line, `pathLength` via Framer Motion `useScroll`), money-back guarantee + "you own it outright" callouts. Commit `feat: method section`.
- [ ] **Pillars** (dream): split panels — AI Product Engineering (Violet Ray accent) vs Automated Systems (Cyan data-line accent), expand on hover/tap with example problems. Commit `feat: two pillars section`.
- [ ] **WhyDreamlabs** (workshop): 5 USP cards w/ icons, hover lift. Commit `feat: USP section`.
- [ ] **Industries** (dream): 6 cards — duotone-treated photo (navy→violet gradient overlay, rounded shape) + icon badge + one bottleneck line each; grid desktop, scroll-snap row mobile. Placeholder images from Unsplash source URLs downloaded into `public/images/industries/` at build (or curated free files); mark swap-ready. Commit `feat: industries section with duotone photography`.
- [ ] **Proof** (workshop, flagged off): 3 case-study card skeletons with structured fields, wrapped in `{SHOW_PROOF && ...}`. Commit `feat: proof section behind feature flag`.
- [ ] **Faq** (workshop): Accordion, 6 questions (cost, ownership, timeline, staff replacement, guarantee, data safety). Commit `feat: homepage FAQ section`.
- [ ] **FinalCta** (dream): full-width, violet glow orbs, "no pitch, no pressure" headline, booking embed slot (Cal.com stub component showing graceful "booking link coming soon" + contact form link when `BOOKING_URL` null), lightweight name/email form posting to lead endpoint. Commit `feat: final CTA section`.
- [ ] Assemble homepage in order; verify full-page scroll on desktop + mobile; check section rhythm dream/workshop alternation. Commit `feat: homepage assembly`.

---

## Phase 4 — Bottleneck/ROI Calculator + Lead Capture (§10)

### Task 4.1: Calculator logic (TDD)

**Files:** Create `src/lib/calculator.ts`, `src/lib/calculator.test.ts`.

- [ ] Model: `industry` (6 options) + `teamSize` (bands: 1–5, 6–15, 16–40, 41–80, 80+) + `bottleneck` (the 6 pain points) + `currentProcess` ('paper', 'spreadsheets', 'some-software', 'mostly-automated'). Output `{ hoursPerMonth: number, poundsPerMonth: number, confidence: 'low' | 'typical' | 'high' }` from a transparent lookup table (base hours per bottleneck × team-size multiplier × process multiplier; £ = hours × £22 blended ops rate). Constants exported for display ("how we estimate this").
- [ ] Tests first: known input → known output, monotonic in team size, all enum combos return finite positives, process 'mostly-automated' lowest multiplier. `npx vitest run` green after implementing.
- [ ] Commit: `feat: bottleneck calculator estimation logic (TDD)`

### Task 4.2: Lead capture Pages Function

**Files:** Create `functions/api/lead.ts`, `src/lib/leads.ts` (client), `.env.example`.

- [ ] `functions/api/lead.ts` (Cloudflare Pages Function): POST only; JSON body `{ name, email, company?, industry?, source: 'calculator' | 'contact' | 'newsletter', payload? }`; validate (email regex, lengths), reject honeypot field `website` non-empty with fake 200, naive rate limit (IP + 1-min window via in-memory Map best effort + `cf-connecting-ip`), insert into Supabase via REST (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env — server-side only), CORS restricted to production origin + localhost. If env vars absent (Kevin hasn't supplied creds), log + return `202 { queued: false }` so the UI still works.
- [ ] `src/lib/leads.ts`: typed `submitLead()` client with loading/error handling.
- [ ] `.env.example` documenting `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` (optional, unused v1).
- [ ] SQL for the `leads` table + RLS (service-role-only writes, no anon access) saved to `docs/supabase-leads.sql` for Kevin to run when ready.
- [ ] Commit: `feat: lead capture endpoint with honeypot, rate limit, supabase stub`

### Task 4.3: Calculator UI + standalone page

**Files:** Create `src/components/interactive/BottleneckCalculator.tsx` (+ small step subcomponents), wire into `CalculatorTeaser` slot on homepage and `BottleneckCheckPage`.

- [ ] 4-step wizard (industry → team size → bottleneck → process), Framer Motion step transitions, instant teaser result (hours range) with Strong Cyan `StatCounter`s, then name+email gate (posts `source: 'calculator'` with answers payload) unlocking full breakdown (£/month, "how we estimate this" expandable, CTA to book audit). Error states Magenta Bloom (no cyan in the same view as error display — errors swap the cyan counters out).
- [ ] Keyboard navigable; `aria-live` on results.
- [ ] Verify both placements at mobile + desktop; test submit with endpoint absent (graceful).
- [ ] Commit: `feat: bottleneck calculator wizard with progressive lead capture`

---

## Phase 5 — Secondary Pages

All share: simplified static hero banner (frozen constellation SVG from Task 2.3's fallback + gradient glow, ~40vh), section-reveal motion language, cross-links per §12.

- [ ] **ServicesPage**: two pillars deep-dive — what you get, example problem→system narratives, engagement shape, CTA. Commit `feat: services page`.
- [ ] **IndustriesPage**: 6 industry blocks with bottleneck framing + duotone images, each linking to calculator with industry preselected (`?industry=` param). Commit `feat: industries page`.
- [ ] **HowItWorksPage**: expanded 4-step method, guarantee section, "what a pilot looks like" timeline, FAQ subset, CTA. Commit `feat: how-it-works page`.
- [ ] **AboutPage**: brand story (the dream → working systems), Academy talent-pipeline explanation (enterprise team, SME pricing), positioning line, values from brand pillars. Commit `feat: about page`.
- [ ] **FaqPage**: full accordion (10–12 questions superset of homepage), grouped. Commit `feat: faq page`.
- [ ] **ContactPage**: contact form (name, email, company, industry select, message) → lead endpoint `source: 'contact'`; Cal.com embed slot (stub message until `BOOKING_URL` set); NAP placeholders. Commit `feat: contact page`.
- [ ] **PrivacyPage / TermsPage**: standard GDPR-aware boilerplate for a UK Ltd marketing site collecting leads (clearly marked for legal review), DM Sans prose styling. Commit `feat: legal pages`.
- [ ] **Resources scaffold**: `/resources/:slug` route rendering a clean "coming soon" shell, excluded from sitemap. **NotFoundPage**: branded 404 with constellation mark + home link. Commit `feat: resources scaffold and 404`.

---

## Phase 6 — SEO Pass (§12)

**Files:** Create `src/lib/seo.tsx` (Head component per route via vite-react-ssg's head support), `public/robots.txt`, sitemap generation, `public/og/` images, `scripts/generate-og.mjs`.

- [ ] Per-route unique `<title>` + meta description + canonical + OG/Twitter tags; single H1 per page (audit all pages).
- [ ] JSON-LD: `Organization` + `ProfessionalService` (site-wide, NAP placeholders flagged), `FAQPage` on `/faq`, `BreadcrumbList` on secondary pages.
- [ ] `robots.txt` (allow all, sitemap pointer, disallow `/style-guide`); `sitemap.xml` generated at build from the routes array (exclude style-guide, resources, 404).
- [ ] OG image: branded 1200×630 (wordmark on Deep Navy + glow) generated via sharp script from logo assets.
- [ ] Verify: `npm run build`, inspect 3 sample dist HTML files for correct tags; validate JSON-LD syntax.
- [ ] Commit: `feat: seo meta, structured data, sitemap, og images`

---

## Phase 7 — Performance & Accessibility Audit (§13)

- [ ] Build + preview server; Lighthouse run (headless Chrome) on `/`, `/contact`, `/tools/bottleneck-check` — targets LCP < 2.5s, CLS < 0.1, a11y ≥ 95. Fix findings (font preload `<link rel="preload">` for the two critical weights, image `loading="lazy"` + dimensions, code-split GSAP hero via dynamic import so secondary pages don't pay for it).
- [ ] Contrast audit of every text/background pair (script or accesslint MCP contrast tool): especially Violet Ray on Off White (large/bold only), Off White on Violet Ray buttons, Cyan on Deep Navy.
- [ ] Keyboard pass: tab order, focus visibility, accordion/calculator/nav operable; skip link works.
- [ ] Reduced-motion pass: emulate, confirm no pinning, static hero, no reveals jumping.
- [ ] Commit: `fix: performance and accessibility audit findings`

---

## Phase 8 — QA, Security, Handover

- [ ] Cross-viewport QA: screenshot key pages at 375 / 768 / 1440 wide; fix layout breaks.
- [ ] Run **di-security-auditor** skill against the build (lead endpoint, env handling, headers). Address findings. Add `public/_headers` with CSP, X-Frame-Options, Referrer-Policy etc. for Cloudflare Pages.
- [ ] Write project `CLAUDE.md` (brief §18 starter, tech-stack table updated to React+Vite+vite-react-ssg, Current Status filled honestly: what works, what's stubbed, known issues).
- [ ] Final commit; leave `feat/site-build` pushed-ready (no GitHub remote yet — Kevin creates repo or supplies remote in the morning).
- [ ] Morning report for Kevin: what's built, how to run it (`npm run dev`), what needs his input (booking link, contact details, Supabase creds, remote/deploy), and suggested review path.

---

## Self-Review Notes

- Spec coverage: all §17 decisions implemented (Tasks 0.1/0.4 stack+SSG, 4.2–4.3 Cal.com stub + lead pipeline, 3.2 Industries hybrid imagery, 3.2 Proof flag). Hero §6 fully covered incl. fallbacks (Phase 2). Animated bubbles: hero particle language (2.2/2.3) + nav logo ambient bubble drift — **add to Task 0.4**: nav logo gets 3 tiny CSS-animated bubble dots, reduced-motion aware. SEO §12 (Phase 6), perf/a11y §13 (Phase 7), security (Phase 8).
- Types consistent: `sampleFrame(progress)` naming used in 2.2/2.3; `SHOW_PROOF`/`BOOKING_URL` from `config.ts` used in 3.2/4.3/5.
- Known scope adaptation: presentational sections specify contracts + content rather than full JSX listings; logic modules (calculator, particle engine, node graph, lead endpoint) are TDD with tests written first. This is deliberate — visual quality is verified by rendering + screenshots, not unit tests.
