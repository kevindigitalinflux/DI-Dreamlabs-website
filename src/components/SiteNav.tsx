import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MenuIcon, CloseIcon } from '@/components/icons'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/industries', label: 'Who We Serve' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
] as const

/**
 * Fixed site navigation — Deep Navy glass bar with animated logo bubbles.
 * Transparent over the homepage hero's video (only at the very top of the
 * page, before any scroll); solid everywhere else, matching every other
 * route's normal behaviour.
 */
export const SiteNav = () => {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const [transparent, setTransparent] = useState(pathname === '/')

  useEffect(() => {
    if (pathname !== '/') {
      setTransparent(false)
      return
    }
    const onScroll = () => setTransparent(window.scrollY < 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] border-b transition-colors duration-300 ${
        transparent
          ? 'border-transparent bg-transparent'
          : 'border-offwhite/10 bg-navy-deep/80 backdrop-blur-md'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-content items-center justify-between px-6"
      >
        <Link to="/" className="flex items-center gap-2" aria-label="DI Dreamlabs home">
          <span className="relative">
            <img
              src="/brand/logo-primary-on-dark.png"
              alt="DreamLabs"
              className="h-8 w-auto"
              width={142}
              height={40}
            />
            {/* Ambient bubble drift — motion-safe only */}
            <span aria-hidden className="nav-bubbles motion-reduce:hidden">
              <span className="nav-bubble nav-bubble-1" />
              <span className="nav-bubble nav-bubble-2" />
              <span className="nav-bubble nav-bubble-3" />
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-body text-sm font-medium transition-colors hover:text-violet-text ${
                  isActive ? 'text-violet-text' : 'text-offwhite'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="rounded-card bg-violet-ray px-5 py-2.5 font-body text-sm font-bold text-offwhite transition-all hover:scale-[1.03] hover:shadow-glow-violet"
          >
            Get your free audit
          </Link>
        </div>

        <button
          type="button"
          className="text-offwhite lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-offwhite/10 bg-navy-deep px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className="block rounded-card px-3 py-3 font-body text-base font-medium text-offwhite hover:bg-offwhite/5"
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-card bg-violet-ray px-5 py-3.5 text-center font-body text-base font-bold text-offwhite"
              >
                Get your free audit
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
