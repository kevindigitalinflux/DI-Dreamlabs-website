import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRightIcon, BuildIcon, FlaskIcon, LayersIcon } from '@/components/icons'
import { Link } from 'react-router-dom'

/** Section 3 — the three service pillars (Brief §7). */
export const Pillars = () => (
  <Section surface="dream">
    <Reveal>
      <SectionHeading
        eyebrow="What we do"
        title="We fix what's costing you the most. Here's how."
        lede="Whether the problem is in your product, your ops, or your admin, we build the system that removes it. You own it outright."
        surface="dark"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      <Reveal>
        <article className="group flex h-full flex-col rounded-card border border-violet-ray/30 bg-offwhite/5 p-6 md:p-8transition-all duration-300 hover:border-violet-ray hover:shadow-glow-violet">
          <FlaskIcon className="h-9 w-9 text-violet-ray" aria-hidden />
          <h3 className="mt-5 font-heading text-xl font-semibold text-offwhite md:text-2xl">
            AI Product Engineering
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-offwhite/75">
            For owners who know there's a smarter way to run their business but don't have the
            time or team to build it. We design and deploy the AI product that closes the gap,
            from first call to live system.
          </p>
          <p className="mt-4 rounded-card bg-navy-deep/60 p-4 font-body text-sm leading-relaxed text-offwhite/70">
            <span className="font-medium text-offwhite">A typical win:</span>{' '}
            "Customers ring after hours and we lose the job" becomes an AI assistant that answers,
            quotes from your own price list, and books the job while you sleep.
          </p>
          <div className="relative mt-6 overflow-hidden rounded-card border border-violet-ray/30 bg-offwhite/95 transition-colors duration-300 group-hover:border-violet-ray/80">
            <div className="aspect-[4/3]">
              <img
                src="/images/services/ai-product-engineering.jpg"
                alt="AI product engineering"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-violet-ray/10 to-transparent" />
          </div>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-violet-text transition-transform group-hover:translate-x-1"
          >
            Explore product engineering <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </Reveal>
      <Reveal delay={100}>
        <article className="group flex h-full flex-col rounded-card border border-cyan-strong/30 bg-offwhite/5 p-6 md:p-8transition-all duration-300 hover:border-cyan-strong hover:shadow-glow-cyan">
          <BuildIcon className="h-9 w-9 text-cyan-strong" aria-hidden />
          <h3 className="mt-5 font-heading text-xl font-semibold text-offwhite md:text-2xl">
            Automated Systems
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-offwhite/75">
            For teams where the work gets done, but the hours before and after it eat your week.
            We find the biggest drain, build an automation that removes it, and give your team a
            simple app to run it.
          </p>
          <p className="mt-4 rounded-card bg-navy-deep/60 p-4 font-body text-sm leading-relaxed text-offwhite/70">
            <span className="font-medium text-offwhite">A typical win:</span>{' '}
            "Friday afternoons disappear into timesheets and invoices" becomes a system that
            handles both before lunch, automatically.
          </p>
          <div className="relative mt-6 overflow-hidden rounded-card border border-cyan-strong/30 bg-offwhite/95 transition-colors duration-300 group-hover:border-cyan-strong/80">
            <div className="aspect-[4/3]">
              <img
                src="/images/services/automated-systems.jpg"
                alt="Automated systems"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cyan-strong/10 to-transparent" />
          </div>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-cyan-strong transition-transform group-hover:translate-x-1"
          >
            Explore automated systems <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </Reveal>
      <Reveal delay={200}>
        <article className="group flex h-full flex-col rounded-card border border-magenta-bloom/30 bg-offwhite/5 p-6 md:p-8transition-all duration-300 hover:border-magenta-bloom hover:shadow-glow-magenta">
          <LayersIcon className="h-9 w-9 text-magenta-bloom" aria-hidden />
          <h3 className="mt-5 font-heading text-xl font-semibold text-offwhite md:text-2xl">
            End-to-End Product Development
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-offwhite/75">
            For businesses that need a complete digital product built right, from the first user
            insight to a live, polished app. We cover the full lifecycle: UX research, product
            design, and engineering for apps, websites, and online courses.
          </p>
          <p className="mt-4 rounded-card bg-navy-deep/60 p-4 font-body text-sm leading-relaxed text-offwhite/70">
            <span className="font-medium text-offwhite">A typical win:</span>{' '}
            "We have an idea but no idea how to build it" becomes a fully designed, tested, and
            deployed product your team owns outright.
          </p>
          <div className="relative mt-6 overflow-hidden rounded-card border border-magenta-bloom/30 bg-offwhite/95 transition-colors duration-300 group-hover:border-magenta-bloom/80">
            <div className="aspect-[4/3]">
              <img
                src="/images/services/end-to-end-product-dev.jpg"
                alt="End-to-end product development"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-magenta-bloom/10 to-transparent" />
          </div>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-magenta-bloom transition-transform group-hover:translate-x-1"
          >
            Explore product development <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </Reveal>
    </div>
  </Section>
)
