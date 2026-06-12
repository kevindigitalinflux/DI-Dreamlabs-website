import type { RouteRecord } from 'vite-react-ssg'
import { SiteLayout } from '@/layouts/SiteLayout'
import { PageStub } from '@/pages/PageStub'
import { StyleGuidePage } from '@/pages/StyleGuidePage'
import { HomePage } from '@/pages/HomePage'

/**
 * Site map per Brief §5. Every route here is pre-rendered to static HTML
 * at build time by vite-react-ssg. Lazy imports keep route chunks small.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <PageStub title="Services" /> },
      { path: 'industries', element: <PageStub title="Industries" /> },
      { path: 'how-it-works', element: <PageStub title="How It Works" /> },
      { path: 'tools/bottleneck-check', element: <PageStub title="Bottleneck Check" /> },
      { path: 'about', element: <PageStub title="About" /> },
      { path: 'faq', element: <PageStub title="FAQ" /> },
      { path: 'contact', element: <PageStub title="Contact" /> },
      { path: 'privacy', element: <PageStub title="Privacy Policy" /> },
      { path: 'terms', element: <PageStub title="Terms" /> },
      { path: 'resources/:slug', element: <PageStub title="Resources — coming soon" /> },
      { path: 'style-guide', element: <StyleGuidePage /> },
      { path: '*', element: <PageStub title="Page not found" /> },
    ],
  },
]
