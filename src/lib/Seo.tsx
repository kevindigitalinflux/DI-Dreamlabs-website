import { Head } from 'vite-react-ssg'
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, SITE_URL } from '@/lib/config'

type SeoProps = {
  title: string
  description: string
  /** Route path beginning with '/', used for canonical + OG URLs. */
  path: string
  /** Extra JSON-LD blocks (FAQPage, BreadcrumbList, …). */
  jsonLd?: ReadonlyArray<Record<string, unknown>>
  /** Set true on pages that should not be indexed (style guide, 404). */
  noIndex?: boolean
}

/**
 * Per-route head tags (Brief §12): unique title/description, canonical,
 * Open Graph/Twitter cards, plus Organization + ProfessionalService
 * structured data site-wide. Rendered into the static HTML at build time.
 */
export const Seo = ({ title, description, path, jsonLd = [], noIndex = false }: SeoProps) => {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  const fullTitle = path === '/' ? `${SITE_NAME} — AI Systems for the Businesses That Build the World` : `${title} | ${SITE_NAME}`

  const organization = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    name: 'Digital Influx Dreamlabs Ltd',
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    description:
      'AI product engineering and automated systems agency for blue-collar and service SMEs. Free audit, pilot before retainer, you own everything we build.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
    ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
    ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
    areaServed: 'GB',
  }

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE_URL}/og/default.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}/og/default.png`} />
      <script type="application/ld+json">{JSON.stringify(organization)}</script>
      {jsonLd.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', ...block })}
        </script>
      ))}
    </Head>
  )
}

/** BreadcrumbList JSON-LD helper for secondary pages. */
export const breadcrumbs = (...trail: Array<[name: string, path: string]>) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as [string, string], ...trail].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${SITE_URL}${path === '/' ? '' : path}`,
  })),
})
