import puppeteer from 'puppeteer-core'

const ticks = Number(process.argv[2] ?? 16)
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 600))
  for (let i = 0; i < ticks; i++) {
    await page.mouse.wheel({ deltaY: 120 })
    await new Promise((r) => setTimeout(r, 55))
  }
  await new Promise((r) => setTimeout(r, 1400))
  const data = await page.evaluate(() => {
    // Find a Sound Familiar card and a point near its bottom edge.
    const card = document.querySelector('#sound-familiar .relative.z-50 [class*="rounded"]')
    const describe = (el) => {
      if (!el) return null
      const chain = []
      let n = el
      for (let i = 0; i < 6 && n; i++) {
        const cs = getComputedStyle(n)
        chain.push({
          tag: n.tagName.toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.split(' ').slice(0, 2).join('.') : ''),
          position: cs.position,
          zIndex: cs.zIndex,
          transform: cs.transform === 'none' ? 'none' : 'set',
          willChange: cs.willChange,
        })
        n = n.parentElement
      }
      return chain
    }
    let hitInfo = null
    if (card) {
      const r = card.getBoundingClientRect()
      const px = r.left + r.width / 2
      const py = r.bottom - 6
      const hit = document.elementFromPoint(px, py)
      hitInfo = {
        point: [Math.round(px), Math.round(py)],
        hitTag: hit ? hit.tagName.toLowerCase() + (hit.className && typeof hit.className === 'string' ? '.' + hit.className.split(' ').slice(0, 2).join('.') : '') : null,
        hitIsInsideCard: card.contains(hit) || hit === card,
      }
    }
    return { cardFound: !!card, cardChain: describe(card), hit: hitInfo }
  })
  console.log(JSON.stringify(data, null, 2))
} finally {
  await browser.close()
}
