import { Outlet, ScrollRestoration } from 'react-router-dom'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

/** Root layout: skip link, fixed nav, routed page content, footer. */
export const SiteLayout = () => (
  <>
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-violet-ray focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:font-bold focus:text-offwhite"
    >
      Skip to content
    </a>
    <SiteNav />
    <main id="main">
      <Outlet />
    </main>
    <SiteFooter />
    <ScrollRestoration />
  </>
)
