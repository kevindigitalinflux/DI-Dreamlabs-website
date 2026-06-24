import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MenuIcon, CloseIcon } from '@/components/icons'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/industries', label: 'Who We Serve' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
] as const

/** Dropdown panel slides down + fades in; each item staggers in from the left. */
const dropdownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.04, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.18, ease: 'easeOut' } },
}

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

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

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
        className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6"
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
          className="-mr-2 p-2 text-offwhite lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="block"
              >
                <CloseIcon className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="block"
              >
                <MenuIcon className="h-6 w-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border-t border-violet-ray/30 bg-navy-deep px-4 py-4 sm:px-6 lg:hidden"
          >
            {/* Violet accent line at the top of the dropdown */}
            <div aria-hidden className="mb-3 h-px bg-gradient-to-r from-violet-ray via-cyan-strong/60 to-transparent" />

            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <motion.li key={to} variants={itemVariants}>
                  <NavLink
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-card px-3 py-3 font-body text-base font-medium transition-colors ${
                        isActive
                          ? 'border-l-2 border-violet-ray pl-[10px] text-violet-text'
                          : 'text-offwhite hover:bg-violet-ray/[0.08] hover:text-violet-text'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li className="mt-2" variants={itemVariants}>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-card bg-violet-ray px-5 py-3.5 text-center font-body text-base font-bold text-offwhite transition-all hover:shadow-glow-violet active:scale-[0.98]"
                >
                  Get your free audit
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
