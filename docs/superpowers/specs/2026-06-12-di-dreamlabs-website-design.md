# DI Dreamlabs Website — Design Spec

**Date:** 2026-06-12
**Status:** Approved by Kevin (pending written-spec review)
**Master reference:** `docs/DI-Dreamlabs-Website-Build-Brief.md` — the full build brief is the
single source of truth for brand, content, hero choreography, page architecture, SEO, and the
phased build plan. This spec records the decisions that resolve the brief's open questions
(Section 17) and the resulting architecture deltas. Where this spec is silent, the brief governs.

---

## 1. Resolved Decisions

| Open question (Brief §17) | Decision | Decided by |
|---|---|---|
| Stack: Astro vs canonical React+Vite | **React 18 + Vite SPA** with build-time static pre-rendering (see §2) | Kevin |
| Booking tool | **Cal.com** — embed stubbed until account + link supplied | Kevin |
| Industries imagery | **Hybrid** — line-icon system sitewide + treated photography on Industries cards (see §3) | Kevin |
| Results/Proof section | **Build fully, hide behind feature flag** until real case studies exist (see §4) | Kevin |

## 2. Stack & Architecture

- **React 18 + TypeScript (strict) + Vite + React Router v6 + Tailwind CSS v3** — the canonical
  Dreamlabs stack, consistent with other DI projects.
- **SEO mitigation for the SPA choice:** `vite-react-ssg` pre-renders every route to a real HTML
  file at build time; the app hydrates client-side into a normal SPA. This satisfies the brief's
  requirement that an SSG layer exist regardless of framework choice. Each route gets unique
  title/meta/JSON-LD rendered into its static HTML.
- **Animation:** GSAP + ScrollTrigger (hero "Dream Assembly", pinned/scrubbed), Lenis smooth
  scroll (GSAP integration pattern), Framer Motion for component-level micro-interactions and
  the calculator UI. All motion respects `prefers-reduced-motion` per Brief §6.4/§9.
- **Lead capture:** Cloudflare Pages Functions → Supabase `leads` table (RLS enabled), honeypot
  field + rate limiting. Client never writes to Supabase directly.
- **Hosting:** Cloudflare Pages, auto-deploy from GitHub `main`. Development happens on feature
  branches, tested at localhost, merged to `main` when approved (Kevin's standing workflow).
- **Project structure:** as Brief §11, with `src/pages/` as routed page components and
  `src/components/islands/` renamed to `src/components/interactive/` (no islands architecture in
  an SPA; the name should not imply Astro).

## 3. Hybrid Imagery (Industries section)

- Custom **line-icon set** extending the cloud/bubble/flask motif remains the primary visual
  system across pain points, USPs, process, and industries.
- Industries cards additionally use **real photography** treated to stay on-brand:
  - Photo sits inside a clean rounded containing shape (satisfies the "no busy photographic
    background without a containing shape" logo rule and general brand hygiene).
  - **Deep Navy → Violet Ray duotone/gradient overlay** so photography reads "Lucid-Tech",
    never raw stock-photo.
  - Industry line-icon badge overlaid on each card.
- Launch with curated free placeholders (Unsplash/Pexels), structured for easy swap.

## 4. Proof Section Feature Flag

- Section 7 (Results/Proof) is built completely per the brief but gated behind
  `SHOW_PROOF = false` in `src/lib/config.ts`. Flipping the flag is the only change needed when
  real case studies arrive. Nothing placeholder-looking ships to production.

## 5. Logo Asset Inventory

Available in `assets/brand/logo/` (6 of 9 approved lockups):

| File | Lockup | Background |
|---|---|---|
| `primary-transparent.png` | Primary wordmark | Transparent (for Off White) |
| `primary-violet-bg.png` | Primary wordmark | Violet Ray |
| `primary-navy-bg.png` | Primary wordmark | Deep Navy |
| `icon-white-bg.png` | Icon mark | White |
| `icon-violet-bg.png` | Icon mark | Violet Ray |
| `icon-navy-bg.png` | Icon mark | Deep Navy |

- Solid backgrounds are flat colour — strip programmatically in Phase 0 to produce transparent
  per-context variants. Logos still only ever appear over the three approved background colours.
- **DLabs short logo (×3) not supplied** — it is a space-constrained fallback only; not needed
  for launch. Request from Kevin if a future layout genuinely requires it.
- The icon mark on navy is the geometry source for the hero constellation's node-graph end state
  (Brief §6.3).
- **Animated bubbles requirement (Kevin):** the logo's rising bubble trail is the hero's particle
  language, and the nav/footer logo gets a subtle ambient bubble-drift animation (GSAP/CSS,
  reduced-motion aware).

## 6. Reference Material

- aura.build "Digitize Ventures" hero is the energy reference (confident, spacious, glowing) —
  **reinterpret, never copy** (Brief §4). Page is JS-rendered; capture a screenshot into
  `assets/reference/` via headless browser during Phase 0 (or Kevin drops one in).

## 7. Outstanding Inputs from Kevin (stubbed until supplied)

- Cal.com booking link.
- Real contact details: email, phone, London address (footer + `LocalBusiness` JSON-LD).
- Supabase project credentials — via `.env` only, never in chat.
- (Optional, later) DLabs short-logo exports; real case-study content.

## 8. Build Plan

Phases 0–8 exactly as Brief §16, with the di-security-auditor Protect-stage check before the
lead pipeline goes live. Commit after each phase (`feat:`/`fix:`/`refactor:`/`chore:`).
