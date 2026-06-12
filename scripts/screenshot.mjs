/**
 * QA screenshot tool — drives the installed Chrome via puppeteer-core.
 * Usage: node scripts/screenshot.mjs <url> <outfile> [width] [height] [scrollY] [reducedMotion]
 * e.g.:  node scripts/screenshot.mjs http://localhost:4173/ qa/home-desktop.png 1440 900
 */
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const [url, outfile, width = '1440', height = '900', scrollY = '0', reducedMotion = ''] =
  process.argv.slice(2)

if (!url || !outfile) {
  console.error('Usage: node scripts/screenshot.mjs <url> <outfile> [width] [height] [scrollY] [reducedMotion]')
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: Number(width), height: Number(height) })
  if (reducedMotion === 'reduce') {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  if (Number(scrollY) > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY))
    await new Promise((r) => setTimeout(r, 1200))
  }
  await new Promise((r) => setTimeout(r, 500))
  await mkdir(dirname(outfile), { recursive: true })
  await page.screenshot({ path: outfile })
  console.log(`Saved ${outfile}`)
} finally {
  await browser.close()
}
