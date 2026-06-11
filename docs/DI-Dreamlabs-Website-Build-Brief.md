# DI Dreamlabs — Flagship Website Build Brief
**For: Claude Fable 5 (Claude Code)**
**Prepared by: Director of UI/UX, Motion Design & Growth Marketing**
**Project: di-dreamlabs.com — Lead-generating marketing website**

---

## 0. How to Use This Brief

This document is the single source of truth for the build. Read it in full before writing any code.

1. **Brand Guidelines PDF** (`DI_Dreamlabs_Brand_Guidelines_v1.pdf`) is included in `/assets/brand/`. Use your vision capability to study pages 4–5 (logo lockups on all three backgrounds) and page 7–8 (colour swatches) directly — treat the PDF as the pixel-accurate reference for colour and logo treatment, not just the text extracted below.
2. Section 6 of the brand guidelines ("Do's & Don'ts") is a placeholder. Where it's silent, follow the **Voice Principles** and **Colour Usage Rules** in Section 2 of this brief — they are binding.
3. Work through **Section 16 (Build Plan)** phase by phase. Commit after each phase per AIXD discipline (small commits, `feat:`/`fix:`/`refactor:`/`chore:`).
4. Where this brief gives you a strong creative direction (Section 6, 8, 9), execute it with conviction — but where it says "TBD" or "Kevin to confirm," stub it cleanly rather than guessing.
5. At the end of each session, update the `CLAUDE.md` in Section 18 with current status.

---

## 1. The Brief in One Paragraph

DI Dreamlabs is an AI product engineering and automated systems agency built specifically for **blue-collar and service SMEs** — cleaning, facilities, maintenance, construction, trades, logistics — the businesses that build and run the physical world. The website's job is to make a busy SME owner stop scrolling, feel "this was built by people who actually get my business," and book a **free audit**. The site must look like it belongs in the same league as a Silicon Valley product studio, while the words inside it pass the **plumber test**: clear in two readings, no hype, no jargon for jargon's sake. The visual centrepiece is a scroll-driven hero sequence where **dream-like elements literally assemble into something real and technical** — the emotional metaphor for what Dreamlabs does: turns a business owner's vague "I wish someone could just sort this out" into a working, owned, AI-powered system.

---

## 2. Brand Foundations (condensed from Brand Guidelines v1.0)

### 2.1 Identity & Positioning
- **Who:** AI product engineering + automated systems agency, sister company to Digital Influx Academy (in-house talent pipeline → enterprise capability at SME pricing).
- **Two service pillars:** (1) AI Product Engineering — free audit, design, build, deploy. (2) Automated Systems — bottleneck-busting custom automation, always paired with a bespoke client-owned app.
- **Primary audience:** Blue-collar SMEs (construction, manufacturing, logistics, facilities, trades).
- **Secondary audience:** Startups and SMEs across all sectors.
- **Positioning line:** *"Enterprise capability. Human-scale pricing. Built for the businesses that build the world."*
- **Brand pillars:** Transformative (bottlenecks → breakthroughs, measurable results), Accessible (pricing is never the barrier), Inventive (built from the ground up for *your* problem, not a generic one).

### 2.2 Colour System

| Name | Hex | Role | Usage Rule |
|---|---|---|---|
| Violet Ray | `#8B32FF` | Primary — CTAs, key highlights, interactive states, logo primary | Lead accent on Deep Navy. On Off White, only for bold/large type or icons — never small body text. |
| Deep Navy | `#040F49` | Primary — backgrounds, body text on light surfaces, hero sections | Default background for hero/dark sections. Also the body-text colour on Off White (never grey). |
| Rebecca Purple | `#64378B` | Secondary — gradients, captions, dividers | Bridge colour between Violet Ray and Deep Navy. |
| Magenta Bloom | `#F0386B` | Tertiary/Accent — alerts, energy, contrast moments | **Use sparingly.** Never in the same element or adjacent elements as Strong Cyan. |
| Strong Cyan | `#00DFDF` | Tertiary/Accent — tech highlights, data, digital contexts | **Use sparingly.** Never in the same element or adjacent elements as Magenta Bloom. |
| Off White | `#F4F4F8` | Neutral — page backgrounds, card fills, breathing room | The *only* light background. |

**Functional separation rule (this brief's resolution of the Magenta/Cyan conflict):** to guarantee the two accents never collide in the UI, assign them fixed *jobs* rather than letting them roam:
- **Strong Cyan** = data/results highlight domain only (hero "tech" line-work, ROI calculator output numbers, animated stat counters).
- **Magenta Bloom** = alert/urgency domain only (form validation errors, scarcity/urgency messaging, the single hero "spark" moment).
- **Violet Ray** = all primary interactive states (buttons, links, active nav, focus rings).

This means cyan and magenta live in different parts of the experience by design and will never need to be balanced against each other on the same screen.

### 2.3 Typography
- **Montserrat** — headings, display text, logo wordmark. SemiBold or above for any heading/display use (never Regular weight in a heading context). All-caps permitted for Montserrat in logos, labels, section headers — never in body copy.
- **DM Sans** — body copy, captions, UI labels. Regular or Medium for body; Light reserved for captions/supporting labels only.
- Don't mix both fonts at the same visual weight in one element — Montserrat leads, DM Sans supports.
- Minimum body text: 14px on screen.
- Load both via Google Fonts (self-hosted/preloaded for performance — see Section 13).

### 2.4 Logo Rules
- Three lockups: **Primary Logo** (full "DreamLabs" wordmark), **Short Logo** ("DLabs"), **Icon Mark** (the "a" letterform as a flask with a rising bubble trail).
- Each exists on three approved backgrounds: Off White, Violet Ray, Deep Navy. **No other background combinations.**
- Off White background + Primary Logo = the default, always-correct choice when in doubt.
- Clearspace on all sides = height of the "D" in "DreamLabs."
- Never stretch, skew, rotate, recolour, or apply effects. Never place on a busy photographic background without a clean containing shape. Never use the icon mark and full wordmark at the same scale in one layout. The "Dream"/"Labs" two-tone split is fixed.
- **Icon mark contexts:** small sizes only — app icon, favicon, social avatar, watermark, and (critically for this build) **the visual seed for the hero's assembled "constellation" — see Section 6.**

### 2.5 Voice & Tone
> *"The brilliant friend who happens to know AI. They come to you, speak your language, and do not dazzle you with jargon — they just solve your problem and make you feel like you've got an unfair advantage."*

- Confident, not arrogant. Plain language first, technical only where it adds clarity.
- Industry-fluent (bottlenecks, leverage, deployment, automation) — used with purpose, never stacked.
- Warm and direct. Short sentences. Active voice.
- Optimistic without hype — demonstrate value, never promise magic.
- **Never:** corporate buzzword soup, condescension toward blue-collar clients, over-casual slang, hype/"magic" claims.
- **The Plumber Test:** every piece of copy must be graspable by a busy SME owner in two readings. If it fails, rewrite it.

---

## 3. Audience & Positioning for This Build

**Primary persona — "Dave the Ops Director":** Runs or manages a 15–80 person cleaning/facilities/trades business. Time-poor, sceptical of "AI" as a buzzword, has been burned by overpriced agencies before, makes decisions on ROI and risk (hence the money-back guarantee and pilot-before-retainer model matter enormously). Found the site via a Google search for something painfully specific ("scheduling software for cleaning company," "reduce missed call leads").

**Secondary persona — "Priya the Startup Founder":** Leaner, faster-moving, comfortable with tech, wants speed and a partner who can build a real product, not just consult.

**What the site must prove in under 10 seconds of scrolling:**
1. This is a serious, capable, modern engineering studio (the "wow").
2. They understand businesses like mine, not just "tech companies" (the relevance).
3. There's a free, no-risk way to start (the conversion).

---

## 4. Experience Goals — What "Wow" Means Here

- A **cinematic, scroll-driven hero** in the spirit of high-end venture/product template heroes (Kevin's reference: aura.build's "Digitize Ventures" template — drop a screenshot of this into `/assets/reference/` so you can study its composition, pacing, and use of glow/gradient elements with your vision capability). **Do not copy it.** Reinterpret its *energy* — confident, spacious, glowing — entirely through Dreamlabs' own cloud/bubble/flask/constellation visual language and colour system.
- The hero's signature move: **dream-like elements (clouds, bubbles, soft light) drift, converge, and assemble into something technical and structured** as the user scrolls — literalising "we turn your dream into a working system."
- One unforgettable signature moment, restrained motion everywhere else. Don't scatter "wow" — concentrate it.
- Feels premium and ambitious, but never cold or alienating — the Off White "workshop" sections ground the experience in practicality (process, guarantee, FAQ).
- Interactive tools that *demonstrate* value immediately (the bottleneck/ROI calculator), not just describe it.
- Fast, smooth, and genuinely excellent on mobile — most SME owners will land on this site from a phone.

**Creative direction name for this build: "Lucid-Tech."** Think: the moment between dreaming and waking, rendered with the precision of a product keynote. Deep Navy night-sky canvases, soft volumetric Violet Ray/Rebecca Purple glow, fine luminous Strong Cyan line-work suggesting circuitry/constellations, a tactile grain overlay to keep it warm rather than sterile, generous negative space, oversized confident Montserrat type, and rare, deliberate Magenta Bloom "spark" moments at points of action.

---

## 5. Site Map & Page Architecture

| Route | Purpose | Priority |
|---|---|---|
| `/` | Flagship scroll narrative — hero + full story + primary conversion | P0 |
| `/services` | Deep dive: AI Product Engineering vs Automated Systems | P1 |
| `/industries` | Blue-collar verticals served, each with its own bottleneck framing | P1 |
| `/how-it-works` | Process: Free Audit → Build → Pilot → Own & Scale, + money-back guarantee | P1 |
| `/tools/bottleneck-check` | Standalone version of the ROI/bottleneck calculator (SEO + shareable lead magnet) | P1 |
| `/about` | Brand story, Academy talent pipeline, why Dreamlabs exists | P2 |
| `/faq` | Objection-handling | P1 |
| `/contact` | Free audit booking + contact form | P0 |
| `/privacy`, `/terms` | GDPR/legal | P2 |
| `/resources/[slug]` | (Structure only, no content yet) Future content marketing — "bottleneck breakdowns" per industry | P3 (scaffold route only) |

All secondary pages share the homepage's design system and section-reveal motion language, but **only the homepage hero gets the full "Assembly" sequence.** Secondary pages get a simplified static or lightly-animated hero banner using the same visual vocabulary (frozen "constellation" + gradient glow), for performance and consistency.

---

## 6. The Signature Moment: Hero "Dream Assembly" Scroll Sequence

### 6.1 Concept

As the page loads, the user sees a vast Deep Navy night-sky canvas with soft glowing orbs and the headline. As they scroll, **cloud silhouettes (from the Dreamlabs cloud motif) and glowing bubble particles drift in from the edges, dissolve, multiply, and connect via fine luminous threads** — gradually resolving into a glowing constellation in the exact shape of the **Dreamlabs icon mark** (the "a" flask with its rising bubble trail). The dream (clouds, scattered light) literally becomes the brand (a structured, working system). When the constellation locks into place, a single Magenta Bloom "spark" pulses at its core — the moment of activation — before the page settles into the rest of the story.

### 6.2 Scroll Choreography

Pin the hero for **~280vh of scroll on desktop** (180vh on mobile — see 6.4). Drive everything from a single `scrollProgress` value (0 → 1).

| Progress | Visual State | Key Elements | Motion Notes |
|---|---|---|---|
| 0–15% | **Establishing shot.** Full-bleed Deep Navy + subtle grain. Headline, subhead, and primary/secondary CTAs centred and fully visible, static. | 3 large soft-focus gradient orbs (Violet Ray, Rebecca Purple, faint Cyan) | Orbs drift extremely slowly (parallax factor ~0.1–0.2). Scroll-cue (down chevron) gently pulses. |
| 15–40% | **The dream stirs.** Headline scales down slightly (1 → 0.85) and shifts toward the top third, fading to ~70% opacity to make room. | 3–5 cloud silhouettes fade in from viewport edges, drifting inward (factor 0.4–0.6). 15–30 bubble particles (sizes 4–40px; Off White, Violet Ray tints, occasional Cyan) appear, drifting upward (factor 0.5–0.8) | This is the "bubble trail" motif from the icon mark, multiplied across the whole canvas. |
| 40–65% | **Convergence begins.** Headline fully fades/shrinks into a small wordmark badge that will become the sticky nav logo. | Clouds dissolve into smaller bubbles as they near centre. Fine Cyan threads begin drawing between nearby bubbles (stroke-dashoffset animated by scroll progress), implying a forming network. | Density of bubbles/lines increases toward the centre of the viewport. |
| 65–85% | **The shape emerges.** A secondary line of supporting copy fades in beneath the forming shape. | Bubbles + threads converge into a recognisable outline: the icon mark's flask-and-bubble-trail silhouette, rendered as a glowing constellation (outline traced by connected nodes, density implying fill). Background orbs brighten slightly. | This is the emotional payoff — give it room to breathe; don't rush the lock-in. |
| 85–100% | **Activation.** | Constellation lines reach full opacity and "lock." A single Magenta Bloom spark pulses once at the flask's bubble core, then fades — a deliberate, singular use of the accent. Hero content fades/scales out as the next section's content fades up from below. | The assembled icon mark either dissolves into the sticky nav logo, or settles as a small persistent decorative mark in the corner — pick whichever reads cleaner once built; test both. |

### 6.3 Technical Approach

- **Pinning & scroll progress:** GSAP `ScrollTrigger` with `pin: true` and `scrub: true` on the hero container. Expose `scrollProgress` (0–1) to drive everything else.
- **Particles, bubbles, connecting threads:** render on `<canvas>` for performance (50–100 particles with soft glow/blur). Particle positions, sizes, opacities, and connections are all functions of `scrollProgress` — precompute "start" and "end" states per particle and interpolate.
- **Cloud silhouettes & headline/CTA:** DOM/SVG elements layered above the canvas via CSS, animated with GSAP timelines whose `.progress()` is set to `scrollProgress`.
- **Constellation "lock-in" shape:** rather than true SVG morphing (avoid paid MorphSVG plugins), build the icon-mark silhouette as a fixed arrangement of nodes/lines that the particle system's "end state" naturally resolves into — i.e., the particles' target positions *are* the icon mark, traced as a node graph.
- **Smooth scroll:** Lenis, globally, for the premium "weighted" feel — but ensure it doesn't fight `ScrollTrigger` (use GSAP's Lenis integration pattern).

### 6.4 Reduced Motion & Mobile Fallback

- **`prefers-reduced-motion: reduce`:** skip the pinned sequence entirely. Render the *final assembled state* as a static SVG illustration (the constellation, fully formed, with a single subtle ambient glow animation only) behind the headline, in a normal ~100vh hero. No scroll-jacking.
- **Mobile:** shorten pinned scroll distance to ~180vh, reduce particle count to ~30, simplify thread connections (fewer, slightly thicker lines), and keep the headline static throughout (motion concentrated in the background only) for readability and performance.
- **Performance guardrail:** the hero's headline, subhead, and CTAs must be visible and interactive immediately on load — the canvas/particle system initialises after critical content paints (progressive enhancement, see Section 13).

---

## 7. Homepage Section-by-Section (after the hero)

| # | Section | Purpose | Content Direction | Motion |
|---|---|---|---|---|
| 1 | **"Sound Familiar?"** | Name the pain before pitching the solution | 4–6 bottleneck cards drawn from real blue-collar pain points: missed calls/leads, manual scheduling chaos, no real-time job visibility, slow quoting, paper-based admin, inventory/stock surprises | Deep Navy background. Cards stagger-reveal on scroll (fade + translateY 24px, ~0.6s, ease-out, 80–120ms stagger). Cyan/Violet line-icons per card. |
| 2 | **The Dreamlabs Method** | Show the low-risk path: Free Audit → Build → Pilot → Own & Scale | 4-step process, each step plainly explained in plumber-test language, with the money-back guarantee and "you own it outright" called out explicitly | Off White background. Vertical stepper with a connecting line that "draws" itself on scroll (echoes the hero's thread motif at small scale) |
| 3 | **Two Pillars** | Explain AI Product Engineering vs Automated Systems without sounding like two separate companies | Split-panel layout, each pillar expandable on hover/tap with a short example of the *kind* of problem it solves | Deep Navy. Violet Ray accents one panel, subtle Cyan data-line accents the other (functionally separated per Section 2.2) |
| 4 | **Why Dreamlabs (USPs)** | Build trust fast | Icon grid: "You own everything we build," "Money-back guarantee," "Pilot before any retainer," "Enterprise-grade team, SME-friendly pricing" (via the Academy talent pipeline), "2–8 week delivery" | Off White. Cards with subtle hover lift/tilt (transform + shadow only) |
| 5 | **Industries We Serve** | Relevance signal for the primary persona | Vertical cards: cleaning, facilities, maintenance, construction, trades, logistics — each with a custom line-icon extending the cloud/bubble/flask motif, and one bottleneck statement per industry | Deep Navy. Horizontal scroll-snap row on mobile, grid on desktop |
| 6 | **Bottleneck/ROI Calculator** | Interactive lead magnet — the "show, don't tell" moment | User picks their industry + answers 3–4 quick questions (team size, biggest bottleneck, current process) → instant estimate of hours/£ saved per month → progressive email capture to unlock the full breakdown → CTA to book free audit | Off White card on a Deep Navy section. Result numbers animate in via Strong Cyan counters (this is the "data highlight" use of Cyan). See Section 10. |
| 7 | **Results / Proof** | Social proof | Placeholder case-study cards, clearly structured for easy real-content swap later (image, client type, problem → result in one line, metric) | Off White. Mark clearly as `<!-- PLACEHOLDER: real case studies TBD -->` in code |
| 8 | **FAQ** | Objection handling | Accordion covering cost, ownership, timeline, "will this replace my staff," what happens if it doesn't work (guarantee) | Off White |
| 9 | **Final CTA — Book Your Free Audit** | Primary conversion | Full-width Deep Navy section, Violet Ray glow, headline reinforcing "no pitch, no pressure," booking embed placeholder + lightweight contact form | The one place a slightly larger Violet Ray glow/pulse on the CTA button is appropriate |
| 10 | **Footer** | Navigation, trust, compliance | Logo (Off White-background lockup), nav links, socials, London address/contact, newsletter signup, legal links | Static |

---

## 8. Design System Direction

### 8.1 Type Scale

| Role | Font | Weight | Size (desktop / mobile) | Line height |
|---|---|---|---|---|
| Display (hero headline) | Montserrat | ExtraBold | 64–88px / 36–44px | 1.05 |
| H1 | Montserrat | Bold | 48px / 32px | 1.1 |
| H2 | Montserrat | SemiBold | 32px / 24px | 1.2 |
| H3 | Montserrat | SemiBold | 22px / 18px | 1.3 |
| Body | DM Sans | Regular | 16–18px / 16px | 1.6 |
| Body Emphasis | DM Sans | Medium | 16–18px / 16px | 1.6 |
| Caption/Label | DM Sans | Light | 13–14px / 13px | 1.4 |

### 8.2 Section Rhythm

Alternate **Deep Navy "dream" sections** (hero, pain points, pillars, final CTA) with **Off White "workshop" sections** (method, USPs, industries-detail, FAQ) — the rhythm itself reinforces the brand story: dream → reality → dream → reality, resolving in the final CTA back in the "dream" register, now activated.

### 8.3 Components

- **Primary button:** Violet Ray fill, Off White text (verify contrast meets WCAG AA at the chosen weight/size — bold, ≥16px). Subtle scale (1 → 1.03) + soft glow on hover.
- **Secondary button:** Outline (1px Violet Ray or Off White depending on background), fill-on-hover.
- **Cards (dark sections):** Off White or translucent surfaces with a faint Violet Ray border-glow on hover.
- **Cards (light sections):** Off White fill, soft shadow, Deep Navy text, gentle lift on hover.
- **Form fields:** default border subtle, **focus ring = Violet Ray** (not Cyan — keeps Cyan reserved for data contexts), **error state = Magenta Bloom** (text + border only, never paired visually with a Cyan element in the same view).
- **Iconography:** custom line-icon set extending the cloud/bubble/flask motif — consistent stroke weight, rounded caps, used throughout pain-point, USP, and industry sections so the brand's visual language feels continuous from hero to footer.

---

## 9. Motion & Micro-Interaction Principles

- **One signature moment** (the hero), **restraint everywhere else.** Don't compete with the hero.
- Scroll reveals: fade + translateY(24px), ~0.6s ease-out, staggered 80–120ms between siblings.
- Hover: buttons get subtle scale/glow; cards get a gentle lift + shadow bloom — transform/opacity only (GPU-friendly, no layout thrash).
- Stat counters (calculator results, any "X weeks / Y% ROI" callouts) animate on scroll-into-view.
- Global smooth scroll via Lenis.
- Animated, subtle gradient/grain backgrounds on Deep Navy sections for depth — never busy enough to reduce text legibility.
- **`prefers-reduced-motion`** disables all non-essential motion site-wide, not just the hero.

---

## 10. Lead-Gen Mechanics (Conversion Architecture)

- **Primary CTA everywhere:** "Get Your Free Audit" → `/contact` or an in-page booking modal.
- **Booking:** stub a Calendly/Cal.com embed in `/contact` and the final CTA section — Kevin to supply the real booking link (see Section 15).
- **Bottleneck/ROI Calculator** (Section 7, item 6, and standalone at `/tools/bottleneck-check`):
  - Client-side logic only for v1 (industry + 3–4 questions → estimate via a simple lookup/formula).
  - Progressive disclosure: show a teaser result, require name + email to unlock the full breakdown.
  - On submit: send to a Cloudflare Pages Function → store in a Supabase `leads` table (RLS enabled, see security rules) and optionally trigger an email notification (e.g., via Resend).
- **General forms** (contact, newsletter): name/email (+ company/industry where relevant), client + server-side validation, honeypot field + basic rate limiting on the function endpoint.
- **Newsletter signup** in footer, same lead pipeline, tagged separately.

---

## 11. Tech Stack & Architecture

This is a **public, SEO-critical, animation-heavy marketing site** — a different category from an internal Dreamlabs app, so the recommendation below intentionally departs from the default React+Vite SPA stack used for client tools. Rationale and trade-off are flagged for Kevin in Section 17.

| Layer | Recommendation | Why |
|---|---|---|
| Framework | **Astro (latest)** with React islands | Near-zero JS by default, excellent SSG for SEO, islands architecture suits "one big animated hero + restrained interactivity elsewhere" |
| Styling | Tailwind CSS v3 | Consistent with Dreamlabs conventions, utility-first |
| Hero & scroll choreography | GSAP + ScrollTrigger | Industry-standard for pinned, scrubbed scroll sequences |
| Component-level motion | Framer Motion (within React islands) | Micro-interactions, reveals, calculator UI |
| Smooth scroll | Lenis | Premium scroll feel, integrates with GSAP |
| Lead capture backend | Cloudflare Pages Functions → Supabase `leads` table (RLS) | Serverless, fits existing Dreamlabs hosting |
| Hosting | Cloudflare Pages | Standard Dreamlabs hosting |
| Version control | GitHub | Standard |
| Fonts | Montserrat + DM Sans, self-hosted/preloaded, `font-display: swap` | Performance |
| Images | Astro's built-in image optimisation → AVIF/WebP | Performance + SEO |

### Project Structure

```
src/
├── components/
│   ├── ui/              # Buttons, cards, form fields, accordion
│   └── islands/          # Interactive React islands (hero canvas, ROI calculator)
├── layouts/              # Base layout, page layout
├── pages/                # Route-level Astro pages (/, /services, /industries, ...)
├── lib/                  # Utilities, lead-submission client, calculator logic
├── styles/               # Tailwind config, design tokens (colours, type scale)
└── assets/
    ├── brand/            # Brand Guidelines PDF, logo source files
    └── reference/         # Mood/reference screenshots (e.g. aura.build hero)
public/
functions/                # Cloudflare Pages Functions (lead capture endpoint)
CLAUDE.md
.env
```

---

## 12. SEO Strategy

- **Keyword themes:** "AI automation for [cleaning/facilities/trades] businesses UK," "automated systems for SMEs," "AI product engineering agency London," "reduce operational bottlenecks small business," "free AI audit for SMEs."
- **On-page:** unique `<title>`/meta description per page, single `<h1>` per page, logical H2/H3 hierarchy, internal linking between Home ↔ Services ↔ Industries ↔ How It Works.
- **Structured data (JSON-LD):** `Organization`, `ProfessionalService`/`LocalBusiness` (London), `FAQPage` on `/faq`, `BreadcrumbList` on secondary pages.
- **Technical:** `sitemap.xml`, `robots.txt`, canonical tags, Open Graph + Twitter card images (branded — wordmark on Deep Navy with glow).
- **Future-proofing:** `/resources/[slug]` route structure scaffolded now (no content) for a future content-marketing programme of "bottleneck breakdown" articles per industry.
- **Local SEO:** consistent NAP (Name/Address/Phone) in footer + schema, ready for Google Business Profile linkage.

---

## 13. Performance & Accessibility Targets

- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Hero headline, subhead, and CTAs render and become interactive immediately; the canvas particle system initialises after first paint (progressive enhancement — never block LCP on the animation).
- **WCAG 2.1 AA:** apply the colour rules in Section 2.2 strictly — Violet Ray text only at bold/large weights or on Deep Navy; check all text/background pairs.
- Full keyboard navigation, visible focus states (Violet Ray ring per Section 8.3).
- Alt text on all imagery/icons, `aria-label`s on interactive widgets (especially the calculator).
- `prefers-reduced-motion` honoured globally (Section 6.4 and 9).

---

## 14. Content & Copy Guidelines

- Apply the **Plumber Test** to every headline, subhead, and CTA (Section 2.5).
- **Hero headline direction** (not final copy — write 3–5 options): something that names the transformation from "vague problem" to "working system" — e.g. the idea of turning your business's biggest daily headache into its sharpest advantage.
- **CTA language:** "Get your free audit," "See what's possible," "Book a free audit — no pitch, no pressure."
- **Avoid:** "revolutionize," "game-changing," "synergy," "unlock the power of AI," and any stacked-jargon sentence a plumber wouldn't get in two reads.
- Every section needs a one-line "so what" for the SME owner — if a section doesn't answer "why should I care," cut or rewrite it.

---

## 15. Assets Provided / Needed

**Provided in this build:**
- `DI_Dreamlabs_Brand_Guidelines_v1.pdf` (place in `/assets/brand/`)
- Colour, type, logo, and tone specs in Section 2

**Needed from Kevin before/during build:**
- Logo files as proper **SVG/PNG exports** (all 3 lockups × 3 backgrounds = 9 files) — the brand PDF contains raster previews only; export clean files from Canva/Figma for production use.
- Booking link (Calendly/Cal.com or other) for `/contact` and final CTA.
- Real contact details (email, phone, London address) for footer + schema.
- Decision on Results/Proof section: launch with clearly-marked placeholders, or hide the section until real case studies exist.
- Supabase project credentials for the `leads` table — **provide via `.env`, never in chat** (per security rules).
- Confirmation: self-host Montserrat/DM Sans or load via Google Fonts CDN.

---

## 16. Build Plan — Phased Roadmap for Fable 5

1. **Phase 0 — Scaffold:** Astro + Tailwind + TS project, design tokens (colours, type scale) wired from Section 2/8, base layout, nav/footer skeleton, Cloudflare Pages deploy pipeline.
2. **Phase 1 — Design System:** Build the component library (buttons, cards, form fields, accordion, icon set skeleton) on an internal `/style-guide` page for review before it's used anywhere real.
3. **Phase 2 — Signature Hero:** Build "The Assembly" sequence in isolation (Section 6). Test scroll choreography at all breakpoints, plus the reduced-motion and mobile fallbacks, before integrating into the homepage.
4. **Phase 3 — Homepage Narrative:** Build sections 1–5 and 7–10 from Section 7, with scroll reveals.
5. **Phase 4 — Bottleneck/ROI Calculator:** Build the interactive tool + lead-capture pipeline (Section 10), as both the homepage embed and the `/tools/bottleneck-check` standalone page.
6. **Phase 5 — Secondary Pages:** `/services`, `/industries`, `/how-it-works`, `/about`, `/faq`, `/contact`, `/privacy`, `/terms`, plus the empty `/resources/[slug]` route scaffold.
7. **Phase 6 — SEO Pass:** Meta tags, JSON-LD schema, sitemap, robots.txt, OG images.
8. **Phase 7 — Performance & Accessibility Audit:** Lighthouse/Core Web Vitals pass, WCAG AA check, full reduced-motion QA.
9. **Phase 8 — Cross-device QA & Launch Checklist.**

**Before going live with a real lead pipeline,** run the `di-security-auditor` skill against the finished build (Protect-stage check on the lead-capture function and Supabase RLS).

---

## 17. Open Decisions for Kevin

- **Stack:** the standard Dreamlabs AIXD template defaults to React 18 + Vite + React Router + Supabase. This brief recommends **Astro + React islands** instead, specifically because this is an SEO-critical public marketing site (SSG/SSR matters here in a way it doesn't for internal tools). If you'd rather keep the canonical stack for consistency across all Dreamlabs projects, that's workable too, but you'd need an SSG layer regardless — flag your call to Fable 5 before Phase 0 starts.
- **Booking tool:** Calendly, Cal.com, or other?
- **Industries section imagery:** real photography (treated per the "no busy photographic background without a containing shape" rule) vs. illustration-only line-icons?
- **Results/Proof section:** placeholder-and-launch vs. hide-until-real-content?

---

## 18. Starter CLAUDE.md (paste into project root)

> Note: this is adapted from the standard DI AIXD Engineering template (`di-dreamlabs-md-for-engineering`). The Tech Stack and Project Structure sections reflect the **Astro recommendation from Section 11/17** — if Kevin chooses to keep the canonical React+Vite stack instead, update this table accordingly before starting Phase 0.

```markdown
# DI Dreamlabs — Marketing Website

## What This Is
The public, lead-generating marketing website for Digital Influx Dreamlabs Ltd — an AI product
engineering and automated systems agency for blue-collar and service SMEs. The site's job is to
build immediate credibility, communicate the brand's "dream → working system" positioning through
a signature scroll-driven hero, and convert visitors into free-audit bookings via clear CTAs and
an interactive bottleneck/ROI calculator.

---

## Tech Stack

| Layer | Default |
|---|---|
| Framework | Astro (latest) with React islands |
| Build Tool | Astro built-in (Vite under the hood) |
| Styling | Tailwind CSS v3 — utility classes only, no custom CSS unless absolutely necessary |
| Animation | GSAP + ScrollTrigger (hero), Framer Motion (component-level), Lenis (smooth scroll) |
| Lead Capture | Cloudflare Pages Functions → Supabase (RLS enabled) |
| Hosting | Cloudflare Pages (auto-deploy from GitHub main) |
| Version Control | GitHub |
| AI Dev Environment | Claude Code |

---

## Project Structure

  src/
├── components/
│   ├── ui/              # Buttons, cards, form fields, accordion
│   └── islands/          # Interactive React islands (hero canvas, ROI calculator)
├── layouts/              # Base layout, page layout
├── pages/                # Route-level Astro pages
├── lib/                  # Utilities, lead-submission client, calculator logic
├── styles/               # Tailwind config, design tokens
└── assets/
    ├── brand/            # Brand Guidelines PDF, logo source files
    └── reference/         # Mood/reference screenshots
public/
functions/                # Cloudflare Pages Functions (lead capture)
CLAUDE.md
.env
.gitignore
package.json

---

## Coding Conventions

- Use **TypeScript strict mode** throughout — no `any`, cast to `unknown` first if needed
- **Components in PascalCase** (e.g. `HeroAssembly.tsx`)
- **Utility functions in camelCase**
- **Named exports only** — no default exports
- Style exclusively with **Tailwind utility classes** — no custom CSS or inline styles, except where GSAP/canvas requires direct style manipulation
- Every interactive component must handle **loading, error, and empty states**
- Keep components **under 150 lines** — extract sub-components if needed
- Add **JSDoc comments** to all exported functions
- File extensions: `.ts` for logic, `.tsx`/`.astro` for components/pages
- All motion must respect `prefers-reduced-motion`

---

## AIXD Engineering Rules

### Prompting
- Always break large tasks into smaller focused steps before starting
- One task per prompt — complete and commit before moving to the next
- Give full context in every prompt: file path, component name, expected behaviour, screen size if relevant
- If a prompt was wrong, edit the original — do not send a follow-up correction

### Development Loop
1. Write a focused prompt for one specific task
2. Let Claude Code build it
3. Read the diff — understand every change before accepting
4. Test in the browser at localhost
5. Commit if it works, revert if it does not
6. Move to the next task

### Git Discipline
- Always start from a clean `git status` before new work
- Commit after every meaningful piece of work — small commits, easy rollbacks
- Never auto-accept changes without reviewing the diff
- Commit message format: `feat:`, `fix:`, `refactor:`, `chore:`

### Security (Non-Negotiable)
- Secrets live in `.env` only — never in code, never in a chat, never in a document
- `.env` is in `.gitignore` before the first commit
- If a secret has been committed, treat it as compromised and rotate immediately
- Reference env vars as `import.meta.env.PUBLIC_*` (Astro) or server-side only for private keys
- RLS is enabled on the Supabase `leads` table without exception
- All Supabase queries that return user data must filter by `auth.uid()` or be server-side only
- Never use sequential integer IDs in URLs for private resources — use UUIDs
- CORS whitelisted to the production domain only — never wildcard `*`
- Rate limiting + honeypot fields on all lead-capture and contact endpoints

### CLAUDE.md
- Update this file at the end of every session
- Document current state: what works, what doesn't, known issues
- Record stack/architecture decisions made during the session
- Prompt to trigger: `Update CLAUDE.md to reflect today's work`

---

## Environment Variables

| Variable | Source |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` (server-side only, Pages Function) | Supabase → Project Settings → API |
| `RESEND_API_KEY` (if email notifications used) | Resend dashboard |
| [Booking tool key, if needed] | TBD — Kevin to confirm tool |

---

## Key Files
[List the most important files and what they do as you build them out.]

---

## Current Status
**Working:** nothing
**In progress:** setup
**Not yet started:** all
**Known issues:** none

---

## Do Not Touch
- Brand colour tokens (Section 2.2 of build brief) — exact hex values, not approximations
- Logo files and lockup/background pairings — only the 9 approved combinations
- Hero "Assembly" scroll choreography timings, once approved in Phase 2 — changes here ripple across the whole homepage
```
