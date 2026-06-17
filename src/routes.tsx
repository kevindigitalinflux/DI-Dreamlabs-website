import type { RouteRecord } from 'vite-react-ssg'
import { SiteLayout } from '@/layouts/SiteLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Site map per Brief §5. Every concrete route is pre-rendered to static HTML
 * at build time by vite-react-ssg. Secondary pages are lazy route modules so
 * visitors only download the JS for the page they are on; the homepage stays
 * eager because its hero is the LCP-critical entry experience.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', lazy: () => import('@/pages/ServicesPage') },
      { path: 'industries', lazy: () => import('@/pages/IndustriesPage') },
      { path: 'how-it-works', lazy: () => import('@/pages/HowItWorksPage') },
      { path: 'tools/bottleneck-check', lazy: () => import('@/pages/BottleneckCheckPage') },
      { path: 'about', lazy: () => import('@/pages/AboutPage') },
      { path: 'faq', lazy: () => import('@/pages/FaqPage') },
      { path: 'contact', lazy: () => import('@/pages/ContactPage') },
      { path: 'privacy', lazy: () => import('@/pages/LegalPages').then((m) => ({ Component: m.PrivacyPage })) },
      { path: 'terms', lazy: () => import('@/pages/LegalPages').then((m) => ({ Component: m.TermsPage })) },
      { path: 'resources/:slug', lazy: () => import('@/pages/ResourcePage') },
      { path: 'style-guide', lazy: () => import('@/pages/StyleGuidePage') },
      { path: 'atmosphere-preview', lazy: () => import('@/pages/AtmospherePreviewPage') },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
