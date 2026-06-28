import { Link } from 'react-router-dom'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  POSITIONING_LINE,
  SOCIAL_FACEBOOK,
  SOCIAL_INSTAGRAM,
  SOCIAL_LINKEDIN,
} from '@/lib/config'

const SocialLinkedIn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const SocialInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const SocialFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const SOCIAL_LINKS = [
  { href: SOCIAL_LINKEDIN, label: 'LinkedIn', Icon: SocialLinkedIn },
  { href: SOCIAL_INSTAGRAM, label: 'Instagram', Icon: SocialInstagram },
  { href: SOCIAL_FACEBOOK, label: 'Facebook', Icon: SocialFacebook },
] as const

const FOOTER_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/industries', label: 'Who We Serve' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/tools/bottleneck-check', label: 'Bottleneck Check' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
] as const

/** Site footer — navigation, contact details, newsletter, legal. */
export const SiteFooter = () => (
  <footer className="bg-navy-deep text-offwhite">
    <div className="mx-auto grid max-w-content gap-10 px-5 py-12 sm:px-6 md:gap-12 md:py-16 md:grid-cols-3">
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
          <li>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL ?? 'hello@di-dreamlabs.com'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-violet-text"
            >
              {CONTACT_EMAIL ?? 'hello@di-dreamlabs.com (TBC)'}
            </a>
          </li>
          {CONTACT_PHONE && <li>{CONTACT_PHONE}</li>}
          <li>{CONTACT_ADDRESS ?? 'London, United Kingdom'}</li>
        </ul>
        <div className="mt-5 flex gap-2.5">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`DI Dreamlabs on ${label}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-offwhite/20 text-offwhite/60 transition-all hover:border-violet-ray/60 hover:text-violet-text"
            >
              <Icon />
            </a>
          ))}
        </div>
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
