/**
 * Processes raw brand logo exports into web-ready assets in public/brand/.
 * - Strips flat backgrounds from the icon marks (per-pixel match against the
 *   corner-sampled background colour) so they can sit on any approved surface.
 * - Emits resized, optimised variants for nav/footer/hero use.
 * - Generates the favicon set from the icon mark.
 *
 * Run: node scripts/process-logos.mjs
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'assets/brand/logo'
const OUT = 'public/brand'

/** Removes a flat background colour (sampled from the top-left corner). */
async function removeFlatBackground(srcPath, outPath, { tolerance = 18, maxWidth = 1024 } = {}) {
  const { data, info } = await sharp(srcPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const bg = [data[0], data[1], data[2]]
  // Feathered alpha: fully transparent within `tolerance`, smooth ramp to fully
  // opaque at 3x tolerance — kills the dark anti-aliased fringe left by a hard cut.
  const featherEnd = tolerance * 3
  for (let i = 0; i < width * height; i++) {
    const o = i * channels
    const dr = data[o] - bg[0]
    const dg = data[o + 1] - bg[1]
    const db = data[o + 2] - bg[2]
    const d = Math.sqrt(dr * dr + dg * dg + db * db)
    if (d <= tolerance) {
      data[o + 3] = 0
    } else if (d < featherEnd) {
      const t = (d - tolerance) / (featherEnd - tolerance)
      data[o + 3] = Math.round(data[o + 3] * t * t * (3 - 2 * t))
    }
  }
  await sharp(data, { raw: { width, height, channels } }).png({ compressionLevel: 9 }).toFile(outPath)
}

/** Resizes and optimises a logo without altering colours. */
async function optimise(srcPath, outPath, width) {
  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
}

await mkdir(OUT, { recursive: true })

// Primary wordmark
await optimise(`${SRC}/primary-transparent.png`, `${OUT}/logo-primary-transparent.png`, 1200)
await optimise(`${SRC}/primary-transparent.png`, `${OUT}/logo-primary-transparent-360.png`, 360)
await optimise(`${SRC}/primary-navy-bg.png`, `${OUT}/logo-primary-navy.png`, 800)
await optimise(`${SRC}/primary-violet-bg.png`, `${OUT}/logo-primary-violet.png`, 800)
// Wordmark for dark surfaces, background stripped (navy-bg version: violet cloud + white "Labs")
await removeFlatBackground(`${SRC}/primary-navy-bg.png`, `${OUT}/logo-primary-on-dark.png`, {
  maxWidth: 1200,
})

// Icon marks, background stripped per surface family
await removeFlatBackground(`${SRC}/icon-navy-bg.png`, `${OUT}/icon-on-dark.png`, { maxWidth: 512 })
await removeFlatBackground(`${SRC}/icon-white-bg.png`, `${OUT}/icon-on-light.png`, { maxWidth: 512 })

// Favicons from the violet-background icon (solid bg reads best at small sizes)
for (const [name, size] of [
  ['icon-512.png', 512],
  ['icon-192.png', 192],
  ['apple-touch-icon.png', 180],
  ['favicon-32.png', 32],
  ['favicon-16.png', 16],
]) {
  await sharp(`${SRC}/icon-violet-bg.png`).resize(size, size).png().toFile(`public/${name}`)
}

console.log('Logo assets processed into public/brand and public/.')
