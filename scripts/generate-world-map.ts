/**
 * Generates a lightweight dotted world map (public/world-dots.svg) plus the
 * projection metadata (src/data/world-map.json) used to place country pins.
 *
 * Run: pnpm map:generate
 */
import DottedMap from 'dotted-map'
import fs from 'node:fs'
import path from 'node:path'

const REGION = { lat: { min: -56, max: 80 }, lng: { min: -170, max: 180 } }
const HEIGHT = 62

const map = new DottedMap({
  height: HEIGHT,
  grid: 'diagonal',
  region: REGION,
  projection: { name: 'equirectangular' },
})

const points = map.getPoints()
const { width, height } = map.image

// Encode every dot as a zero-length stroke with round caps inside ONE path:
// "M x y h0" per dot → ~10 bytes each instead of ~60 for a <circle>.
const d = points.map((p) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)}h0`).join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet"><path fill="none" stroke="#e11d2e" stroke-opacity="0.3" stroke-width="0.62" stroke-linecap="round" d="${d}"/></svg>`

fs.writeFileSync(path.resolve('public/world-dots.svg'), svg)

// Sanity-check that a linear equirectangular formula reproduces the library's pin projection.
const probe = map.getPin({ lat: 28.6139, lng: 77.209 })!
const lin = {
  x: ((77.209 - REGION.lng.min) / (REGION.lng.max - REGION.lng.min)) * width,
  y: ((REGION.lat.max - 28.6139) / (REGION.lat.max - REGION.lat.min)) * height,
}
const meta = { width, height, region: REGION, points: points.length, probe, linear: lin }
fs.writeFileSync(
  path.resolve('src/data/world-map.json'),
  JSON.stringify({ width, height, region: REGION }, null, 2),
)
console.log(JSON.stringify(meta, null, 2))
console.log(`SVG size: ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`)
