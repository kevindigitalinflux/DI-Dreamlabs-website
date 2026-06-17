import puppeteer from 'puppeteer-core'

const [url, outfile, ticks = '12', reduce = ''] = process.argv.slice(2)
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  if (reduce === 'reduce') {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  }
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 600))
  const n = Number(ticks)
  for (let i = 0; i < n; i++) {
    await page.mouse.wheel({ deltaY: 120 })
    await new Promise((r) => setTimeout(r, 60))
  }
  await new Promise((r) => setTimeout(r, 1400))
  await page.screenshot({ path: outfile })
  console.log(`Saved ${outfile} after ${n} wheel ticks`)
} finally {
  await browser.close()
}
