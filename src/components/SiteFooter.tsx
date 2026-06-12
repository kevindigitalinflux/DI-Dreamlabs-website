import { Link } from 'react-router-dom'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, POSITIONING_LINE } from '@/lib/config'

const FOOTER_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/industries', label: 'Industries' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/tools/bottleneck-check', label: 'Bottleneck Check' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
] as const

/** Site footer — navigation, contact details, newsletter, legal. */
export const SiteFooter = () => (
  <footer className="bg-navy-deep text-offwhite">
    <div className="mx-auto grid max-w-content gap-12 px-6 py-16 md:grid-cols-3">
      <div>
        <img
          src="/brand/logo-primary-on-dark.png"
          alt="DreamLabs"
          className="h-10 w-auto"
          width={178}
          height={50}
          loading="lazy"
        />
        <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-offwhite/70">
          {POSITIONING_LINE}
        </p>
      </div>

      <nav aria-label="Footer">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-offwhite/60">
          Explore
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {FOOTER_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="font-body text-sm text-offwhite/80 transition-colors hover:text-violet-text"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-offwhite/60">
          Get in touch
        </h2>
        <ul className="mt-4 space-y-2 font-body text-sm text-offwhite/80">
          <li>{CONTACT_EMAIL ?? 'hello@di-dreamlabs.com (TBC)'}</li>
          {CONTACT_PHONE && <li>{CONTACT_PHONE}</li>}
          <li>{CONTACT_ADDRESS ?? 'London, United Kingdom'}</li>
        </ul>
      </div>
    </div>

    <div className="border-t border-offwhite/10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-6 py-6 md:flex-row">
        <p className="font-body text-xs font-light text-offwhite/60">
          © {new Date().getFullYear()} Digital Influx Dreamlabs Ltd. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/privacy" className="font-body text-xs text-offwhite/60 hover:text-violet-text">
            Privacy
          </Link>
          <Link to="/terms" className="font-body text-xs text-offwhite/60 hover:text-violet-text">
            Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
)
