import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { ContactForm } from '@/components/interactive/ContactForm'
import { CalInlineEmbed } from '@/components/interactive/CalInlineEmbed'
import { BOOKING_URL, CONTACT_ADDRESS, CONTACT_EMAIL } from '@/lib/config'
import { ScheduleIcon } from '@/components/icons'
import { Seo, breadcrumbs } from '@/lib/Seo'

/** Free-audit booking + contact form (Brief §5, P0). */
export const ContactPage = () => (
  <>
    <Seo
      title="Contact: Book Your Free Audit"
      description="Book a free, no-pressure audit for your business. Tell us what slows you down; we'll show you what it costs and how an AI-powered system would fix it."
      path="/contact"
      jsonLd={[breadcrumbs(['Contact', '/contact'])]}
    />
    <PageHero
      eyebrow="Contact"
      title="Book your free audit"
      lede="No pitch, no pressure, no invoice. Tell us what is slowing you down, and we will show you what it is costing, and what we would do about it."
    />

    <Section surface="workshop">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

        {/* Left — contact form */}
        <Reveal>
          <p className="mb-6 font-body text-sm font-semibold uppercase tracking-widest text-navy-deep/50">
            Send us a message
          </p>
          <ContactForm />
          <div className="mt-8 border-t border-navy-deep/10 pt-6">
            <ul className="space-y-1 font-body text-sm text-navy-deep/60">
              {CONTACT_EMAIL && (
                <li>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-violet-ray"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              )}
              {CONTACT_ADDRESS && <li>{CONTACT_ADDRESS}</li>}
            </ul>
          </div>
        </Reveal>

        {/* Right — Cal.com booking */}
        <Reveal delay={100}>
          <div className="rounded-card bg-navy-deep p-8">
            <div className="flex items-center gap-3">
              <ScheduleIcon className="h-6 w-6 text-cyan-strong" aria-hidden />
              <p className="font-body text-sm font-semibold uppercase tracking-widest text-offwhite/60">
                Book a time directly
              </p>
            </div>
            <h2 className="mt-3 font-heading text-xl font-semibold text-offwhite">
              Prefer to pick a slot right now?
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/70">
              Choose a time that suits you and we will come prepared with a first look at
              your bottleneck before we even speak.
            </p>

            <div className="mt-6">
              {BOOKING_URL ? (
                <CalInlineEmbed />
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-card border border-dashed border-offwhite/20 text-center">
                  <ScheduleIcon className="h-10 w-10 text-offwhite/20" aria-hidden />
                  <p className="font-body text-sm leading-relaxed text-offwhite/50">
                    Online booking coming soon.
                    <br />
                    Send the form and we will reply within one working day.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>

      </div>
    </Section>
  </>
)

/** React Router lazy-route entry. */
export const Component = ContactPage
