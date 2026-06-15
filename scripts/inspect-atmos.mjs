import puppeteer from 'puppeteer-core'

const url = process.argv[2] ?? 'http://localhost:5173/'
const ticks = Number(process.argv[3] ?? 0)
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 600))
  for (let i = 0; i < ticks; i++) {
    await page.mouse.wheel({ deltaY: 120 })
    await new Promise((r) => setTimeout(r, 55))
  }
  await new Promise((r) => setTimeout(r, 1400))
  const data = await page.evaluate(() => {
    const root = document.querySelector('.fixed.z-40')
    const sf = document.querySelector('#sound-familiar')
    const method = document.querySelector('#dreamlabs-method')
    const layers = Array.from(document.querySelectorAll('.atmos-cloud-layer')).map((el) => ({
      depth: el.dataset.depth,
      opacity: Number(getComputedStyle(el).opacity).toFixed(2),
      top: Math.round(el.getBoundingClientRect().top),
    }))
    return {
      scrollY: window.scrollY,
      rootOpacity: root ? getComputedStyle(root).opacity : null,
      sfTop: sf ? Math.round(sf.getBoundingClientRect().top) : null,
      methodTop: method ? Math.round(method.getBoundingClientRect().top) : null,
      layers,
    }
  })
  console.log(JSON.stringify(data, null, 2))
} finally {
  await browser.close()
}
