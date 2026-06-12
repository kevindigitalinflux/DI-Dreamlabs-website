import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { ContactForm } from '@/components/interactive/ContactForm'
import { BOOKING_URL, CONTACT_ADDRESS, CONTACT_EMAIL } from '@/lib/config'
import { ScheduleIcon } from '@/components/icons'
import { Seo, breadcrumbs } from '@/lib/Seo'

/** Free-audit booking + contact form (Brief §5, P0). */
export const ContactPage = () => (
  <>
    <Seo
      title="Contact — Book Your Free Audit"
      description="Book a free, no-pressure audit for your business. Tell us what slows you down; we'll show you what it costs and how an AI-powered system would fix it."
      path="/contact"
      jsonLd={[breadcrumbs(['Contact', '/contact'])]}
    />
    <PageHero
      eyebrow="Contact"
      title="Book your free audit"
      lede="No pitch, no pressure, no invoice. Tell us what is slowing you down, and we will show you what it is costing — and what we would do about it."
    />
    <Section surface="workshop">
      <div className="grid gap-10 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <ContactForm />
        </Reveal>
        <Reveal delay={100} className="lg:col-span-2">
          <div className="rounded-card bg-navy-deep p-8">
            <ScheduleIcon className="h-8 w-8 text-cyan-strong" aria-hidden />
            <h2 className="mt-4 font-heading text-lg font-semibold text-offwhite">
              Prefer to pick a time right now?
            </h2>
            {BOOKING_URL ? (
              /* Cal.com inline embed — activates when the booking link is configured */
              <iframe
                src={BOOKING_URL}
                title="Book your free audit"
                className="mt-4 h-[480px] w-full rounded-card border-0 bg-white"
              />
            ) : (
              <p className="mt-3 font-body text-sm leading-relaxed text-offwhite/75">
                Online booking is nearly ready. For now, send the form and we will reply within
                one working day with times that suit you.
              </p>
            )}
            <hr className="my-6 border-offwhite/10" />
            <ul className="space-y-2 font-body text-sm text-offwhite/80">
              <li>{CONTACT_EMAIL ?? 'hello@di-dreamlabs.com (TBC)'}</li>
              <li>{CONTACT_ADDRESS ?? 'London, United Kingdom'}</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  </>
)
