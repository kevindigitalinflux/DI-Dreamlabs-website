import type { RouteRecord } from 'vite-react-ssg'
import { SiteLayout } from '@/layouts/SiteLayout'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { IndustriesPage } from '@/pages/IndustriesPage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { BottleneckCheckPage } from '@/pages/BottleneckCheckPage'
import { AboutPage } from '@/pages/AboutPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { PrivacyPage, TermsPage } from '@/pages/LegalPages'
import { ResourcePage } from '@/pages/ResourcePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { StyleGuidePage } from '@/pages/StyleGuidePage'

/**
 * Site map per Brief §5. Every concrete route is pre-rendered to static HTML
 * at build time by vite-react-ssg.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'industries', element: <IndustriesPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'tools/bottleneck-check', element: <BottleneckCheckPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'resources/:slug', element: <ResourcePage /> },
      { path: 'style-guide', element: <StyleGuidePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
