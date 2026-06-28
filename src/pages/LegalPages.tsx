import type { ReactNode } from 'react'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Seo } from '@/lib/Seo'

/*
 * NOTE FOR KEVIN: standard GDPR-aware boilerplate for a UK Ltd collecting
 * marketing leads. Have a solicitor review before launch — especially the
 * data-retention period and the registered-company details, which are
 * placeholders until real company info is supplied.
 */

const Prose = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto max-w-3xl space-y-6 font-body text-base leading-relaxed text-navy-deep/85 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-deep [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
    {children}
  </div>
)

/** Privacy policy (Brief §5 — GDPR/legal). */
export const PrivacyPage = () => (
  <>
    <Seo
      title="Privacy Policy"
      description="How Digital Influx Dreamlabs Ltd collects, uses and protects your data on didreamlabs.com."
      path="/privacy"
    />
    <PageHero eyebrow="Legal" title="Privacy Policy" lede="Last updated: June 2026" />
    <Section surface="workshop">
      <Prose>
        <p>
          Digital Influx Dreamlabs Ltd ("Dreamlabs", "we") respects your privacy. This policy
          explains what we collect on didreamlabs.com, why, and your rights over it.
        </p>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Contact details you give us:</strong> name, email, company and industry when
            you request a free audit, use the Bottleneck Check, or join the newsletter.
          </li>
          <li>
            <strong>Bottleneck Check answers:</strong> the options you select, stored with your
            contact details so the audit conversation starts informed.
          </li>
          <li>
            <strong>Basic technical data:</strong> necessary logs (such as IP address) processed
            by our hosting provider, Cloudflare, to run and protect the site.
          </li>
        </ul>
        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell or rent your data to anyone.</li>
          <li>We do not use third-party advertising trackers.</li>
          <li>We only email you about the thing you asked about, unless you opt into more.</li>
        </ul>
        <h2>Legal basis and retention</h2>
        <p>
          We process lead data on the basis of legitimate interest (responding to your enquiry)
          or consent (newsletter). We keep lead records for up to 24 months after last contact,
          then delete them.
        </p>
        <h2>Where your data lives</h2>
        <p>
          Lead data is stored in our Supabase database (encrypted at rest) and processed via
          Cloudflare. Both providers maintain GDPR-compliant safeguards for any transfers outside
          the UK/EEA.
        </p>
        <h2>Your rights</h2>
        <p>
          You can request a copy of your data, ask us to correct or delete it, or object to
          processing at any time, email us and we will action it within 30 days. You can also
          complain to the ICO (ico.org.uk).
        </p>
        <h2>Contact</h2>
        <p>
          Digital Influx Dreamlabs Ltd, London, United Kingdom. Contact details are in the site
          footer.
        </p>
      </Prose>
    </Section>
  </>
)

/** Terms of use (Brief §5 — GDPR/legal). */
export const TermsPage = () => (
  <>
    <Seo
      title="Terms of Use"
      description="Terms of use for didreamlabs.com, operated by Digital Influx Dreamlabs Ltd."
      path="/terms"
    />
    <PageHero eyebrow="Legal" title="Terms of Use" lede="Last updated: June 2026" />
    <Section surface="workshop">
      <Prose>
        <h2>Using this site</h2>
        <p>
          didreamlabs.com is operated by Digital Influx Dreamlabs Ltd. By using the site you
          accept these terms. Content is provided for general information about our services.
        </p>
        <h2>The Bottleneck Check</h2>
        <p>
          Estimates from the Bottleneck Check are illustrative, based on typical figures for UK
          service SMEs. They are not financial advice and actual results vary, and the free audit
          exists precisely to replace estimates with your real numbers.
        </p>
        <h2>Intellectual property</h2>
        <p>
          The Dreamlabs name, logo, and site content belong to Digital Influx Dreamlabs Ltd.
          Client engagements are governed by their own written agreements, including the
          ownership handover and money-back guarantee terms described on this site.
        </p>
        <h2>Liability</h2>
        <p>
          We work hard to keep the site accurate and available but provide it "as is", without
          warranty. Nothing in these terms limits liability that cannot be limited under UK law.
        </p>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of England and Wales.</p>
      </Prose>
    </Section>
  </>
)
