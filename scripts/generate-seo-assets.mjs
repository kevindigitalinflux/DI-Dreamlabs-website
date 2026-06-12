/**
 * Generates sitemap.xml and the branded OG image (1200×630, wordmark on Deep
 * Navy with violet glow — Brief §12). Run before deploy; idempotent.
 * Usage: node scripts/generate-seo-assets.mjs
 */
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'

const SITE_URL = 'https://di-dreamlabs.com'

/* — sitemap.xml — public, indexable routes only — */
const ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/services', priority: '0.9' },
  { path: '/industries', priority: '0.9' },
  { path: '/how-it-works', priority: '0.9' },
  { path: '/tools/bottleneck-check', priority: '0.8' },
  { path: '/about', priority: '0.6' },
  { path: '/faq', priority: '0.7' },
  { path: '/contact', priority: '0.9' },
  { path: '/privacy', priority: '0.2' },
  { path: '/terms', priority: '0.2' },
]

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  ({ path, priority }) => `  <url>
    <loc>${SITE_URL}${path === '/' ? '' : path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`,
).join('\n')}
</urlset>
`
await writeFile('public/sitemap.xml', sitemap)

/* — OG image: Deep Navy canvas, violet glow, wordmark, positioning line — */
const W = 1200
const H = 630
const glow = `<radialGradient id="g" cx="50%" cy="42%" r="55%">
  <stop offset="0%" stop-color="#8B32FF" stop-opacity="0.45"/>
  <stop offset="55%" stop-color="#64378B" stop-opacity="0.18"/>
  <stop offset="100%" stop-color="#040F49" stop-opacity="0"/>
</radialGradient>`

const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${glow}</defs>
  <rect width="${W}" height="${H}" fill="#040F49"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="600" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#F4F4F8" opacity="0.85">Enterprise capability. Human-scale pricing.</text>
  <text x="600" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#F4F4F8" opacity="0.85">Built for the businesses that build the world.</text>
</svg>`

await mkdir('public/og', { recursive: true })
const logo = await sharp('public/brand/logo-primary-on-dark.png')
  .resize({ width: 640 })
  .png()
  .toBuffer()
const logoMeta = await sharp(logo).metadata()

await sharp(Buffer.from(baseSvg))
  .composite([
    {
      input: logo,
      left: Math.round((W - (logoMeta.width ?? 640)) / 2),
      top: Math.round(180 - (logoMeta.height ?? 180) / 2 + 60),
    },
  ])
  .png()
  .toFile('public/og/default.png')

console.log('Generated public/sitemap.xml and public/og/default.png')
