import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRightIcon, BuildIcon, FlaskIcon } from '@/components/icons'
import { Link } from 'react-router-dom'

/** Section 3 — the two service pillars, one company (Brief §7). */
export const Pillars = () => (
  <Section surface="dream">
    <Reveal>
      <SectionHeading
        eyebrow="What we do"
        title="Two ways in. One result: a system you own."
        surface="dark"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 lg:grid-cols-2">
      <Reveal>
        <article className="group h-full rounded-card border border-violet-ray/30 bg-offwhite/5 p-8 transition-all duration-300 hover:border-violet-ray hover:shadow-glow-violet">
          <FlaskIcon className="h-9 w-9 text-violet-ray" aria-hidden />
          <h3 className="mt-5 font-heading text-xl font-semibold text-offwhite md:text-2xl">
            AI Product Engineering
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-offwhite/75">
            We find where AI genuinely earns its keep in your business, then design, build and
            deploy the product end to end.
          </p>
          <p className="mt-4 rounded-card bg-navy-deep/60 p-4 font-body text-sm leading-relaxed text-offwhite/70">
            <span className="font-medium text-offwhite">The kind of problem it solves:</span>{' '}
            "Customers ring after hours and we lose the job" becomes an assistant that answers,
            quotes and books while you sleep.
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-violet-ray transition-transform group-hover:translate-x-1"
          >
            Explore product engineering <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </Reveal>
      <Reveal delay={100}>
        <article className="group h-full rounded-card border border-offwhite/10 bg-offwhite/5 p-8 transition-all duration-300 hover:border-cyan-strong/60">
          <BuildIcon className="h-9 w-9 text-cyan-strong" aria-hidden />
          <h3 className="mt-5 font-heading text-xl font-semibold text-offwhite md:text-2xl">
            Automated Systems
          </h3>
          <p className="mt-3 font-body text-base leading-relaxed text-offwhite/75">
            We hunt down the bottleneck that costs you the most and replace it with a custom
            automation — always paired with a bespoke app your team actually understands.
          </p>
          <p className="mt-4 rounded-card bg-navy-deep/60 p-4 font-body text-sm leading-relaxed text-offwhite/70">
            <span className="font-medium text-offwhite">The kind of problem it solves:</span>{' '}
            "Friday afternoons disappear into timesheets and invoices" becomes a system that does
            both before lunch.
          </p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-cyan-strong transition-transform group-hover:translate-x-1"
          >
            Explore automated systems <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </Reveal>
    </div>
  </Section>
)
