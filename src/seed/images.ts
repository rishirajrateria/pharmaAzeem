/**
 * Generates branded placeholder imagery with sharp (no external assets needed):
 *  - product "pack shots" per dosage form
 *  - abstract hero / section visuals
 * Replace them from the admin panel with real photography whenever you like.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.resolve(process.cwd(), 'data/seed-images')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const defs = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff7f8"/><stop offset="1" stop-color="#ffe1e4"/></linearGradient>
  <linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bd1225"/><stop offset=".55" stop-color="#e11d2e"/><stop offset="1" stop-color="#ff6675"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>
  <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="orb1" cx=".2" cy=".1" r=".7"><stop offset="0" stop-color="#ff6675" stop-opacity=".45"/><stop offset="1" stop-color="#ff6675" stop-opacity="0"/></radialGradient>
  <radialGradient id="orb2" cx=".9" cy=".9" r=".7"><stop offset="0" stop-color="#e11d2e" stop-opacity=".3"/><stop offset="1" stop-color="#e11d2e" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#e11d2e" fill-opacity=".14"/></pattern>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#e11d2e" flood-opacity=".22"/></filter>
</defs>`

const backdrop = (w: number, h: number) => `
<rect width="${w}" height="${h}" fill="url(#bg)"/>
<rect width="${w}" height="${h}" fill="url(#orb1)"/>
<rect width="${w}" height="${h}" fill="url(#orb2)"/>
<rect width="${w}" height="${h}" fill="url(#dots)"/>`

const label = (x: number, y: number, w: number, brand: string, generic: string, strength: string, form: string) => `
<g>
  <rect x="${x}" y="${y}" width="${w}" height="150" rx="22" fill="url(#glass)" stroke="#fff" stroke-opacity=".9"/>
  <rect x="${x + 22}" y="${y + 22}" width="46" height="46" rx="12" fill="url(#red)"/>
  <rect x="${x + 33}" y="${y + 41}" width="24" height="8" rx="4" fill="#fff" transform="rotate(-45 ${x + 45} ${y + 45})"/>
  <text x="${x + 84}" y="${y + 44}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#16151d">${esc(brand)}</text>
  <text x="${x + 84}" y="${y + 72}" font-family="Helvetica, Arial, sans-serif" font-size="17" fill="#55545f">${esc(generic)}</text>
  <text x="${x + 22}" y="${y + 118}" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="700" fill="#e11d2e" letter-spacing="2">${esc(strength.toUpperCase())}  ·  ${esc(form.toUpperCase())}</text>
</g>`

/* --- dosage-form illustrations (drawn around centre 600,470) --- */
const artTablet = `
<g filter="url(#shadow)">
  <ellipse cx="520" cy="470" rx="150" ry="150" fill="#fff"/>
  <ellipse cx="520" cy="470" rx="150" ry="150" fill="url(#red)" fill-opacity=".08"/>
  <path d="M520 330 a140 140 0 0 1 140 140" fill="none" stroke="url(#red)" stroke-width="10" stroke-linecap="round" opacity=".7"/>
  <line x1="420" y1="470" x2="620" y2="470" stroke="#e11d2e" stroke-opacity=".25" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="740" cy="560" rx="92" ry="92" fill="#fff"/>
  <path d="M740 476 a86 86 0 0 1 86 86" fill="none" stroke="url(#red)" stroke-width="8" stroke-linecap="round" opacity=".7"/>
</g>`
const artCapsule = `
<g filter="url(#shadow)" transform="rotate(-35 600 470)">
  <rect x="400" y="400" width="400" height="140" rx="70" fill="#fff"/>
  <rect x="600" y="400" width="200" height="140" rx="70" fill="url(#red)"/>
  <rect x="600" y="400" width="70" height="140" fill="url(#red)"/>
  <rect x="420" y="420" width="360" height="30" rx="15" fill="url(#shine)"/>
</g>
<g filter="url(#shadow)" transform="rotate(20 780 640)">
  <rect x="690" y="610" width="180" height="60" rx="30" fill="#fff"/>
  <rect x="780" y="610" width="90" height="60" rx="30" fill="url(#red)"/>
  <rect x="780" y="610" width="30" height="60" fill="url(#red)"/>
</g>`
const artSyrup = `
<g filter="url(#shadow)">
  <rect x="470" y="220" width="120" height="70" rx="14" fill="url(#red)"/>
  <rect x="440" y="280" width="180" height="60" rx="14" fill="#fff"/>
  <path d="M440 330 h180 v300 a60 60 0 0 1 -60 60 h-60 a60 60 0 0 1 -60 -60 z" fill="#fff"/>
  <path d="M470 420 h120 v200 a30 30 0 0 1 -30 30 h-60 a30 30 0 0 1 -30 -30 z" fill="url(#red)" fill-opacity=".85"/>
  <rect x="455" y="350" width="18" height="250" rx="9" fill="url(#shine)"/>
  <rect x="690" y="470" width="130" height="160" rx="20" fill="#fff"/>
  <rect x="705" y="500" width="100" height="16" rx="8" fill="#e11d2e" fill-opacity=".25"/>
  <rect x="705" y="530" width="70" height="16" rx="8" fill="#e11d2e" fill-opacity=".25"/>
</g>`
const artInjection = `
<g filter="url(#shadow)">
  <rect x="470" y="200" width="80" height="34" rx="8" fill="url(#red)"/>
  <rect x="460" y="230" width="100" height="40" rx="10" fill="#fff"/>
  <rect x="440" y="270" width="140" height="330" rx="34" fill="#fff"/>
  <rect x="465" y="330" width="90" height="230" rx="20" fill="url(#red)" fill-opacity=".8"/>
  <rect x="455" y="290" width="16" height="280" rx="8" fill="url(#shine)"/>
  <g transform="rotate(-30 760 520)">
    <rect x="700" y="420" width="120" height="260" rx="20" fill="#fff"/>
    <rect x="720" y="470" width="80" height="150" rx="10" fill="url(#red)" fill-opacity=".85"/>
    <rect x="740" y="330" width="40" height="90" rx="6" fill="#fff"/>
    <rect x="757" y="240" width="6" height="90" fill="#9c1222"/>
    <rect x="680" y="670" width="160" height="30" rx="15" fill="#fff"/>
  </g>
</g>`
const artCream = `
<g filter="url(#shadow)">
  <rect x="500" y="200" width="70" height="60" rx="10" fill="url(#red)"/>
  <rect x="480" y="250" width="110" height="40" rx="12" fill="#fff"/>
  <path d="M480 290 h110 l120 340 a30 30 0 0 1 -30 30 h-290 a30 30 0 0 1 -30 -30 z" fill="#fff"/>
  <path d="M500 400 h70 l90 220 h-250 z" fill="url(#red)" fill-opacity=".8"/>
  <rect x="640" y="540" width="200" height="120" rx="24" fill="#fff"/>
  <ellipse cx="740" cy="540" rx="100" ry="30" fill="url(#red)" fill-opacity=".9"/>
</g>`
const artDrops = `
<g filter="url(#shadow)">
  <path d="M520 220 q80 130 80 200 a80 80 0 0 1 -160 0 q0 -70 80 -200z" fill="url(#red)"/>
  <path d="M470 380 q0 -40 30 -90" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="10" stroke-linecap="round"/>
  <rect x="560" y="420" width="120" height="60" rx="14" fill="url(#red)"/>
  <rect x="540" y="470" width="160" height="240" rx="40" fill="#fff"/>
  <rect x="565" y="520" width="110" height="140" rx="20" fill="url(#red)" fill-opacity=".8"/>
</g>`
const artSachet = `
<g filter="url(#shadow)" transform="rotate(-8 600 470)">
  <rect x="420" y="300" width="360" height="360" rx="26" fill="#fff"/>
  <rect x="420" y="300" width="360" height="40" fill="url(#red)" fill-opacity=".9"/>
  <rect x="420" y="620" width="360" height="40" fill="url(#red)" fill-opacity=".9"/>
  <rect x="460" y="380" width="280" height="200" rx="20" fill="url(#red)" fill-opacity=".12"/>
  <circle cx="600" cy="480" r="60" fill="url(#red)"/>
  <rect x="580" y="440" width="40" height="80" rx="20" fill="#fff" transform="rotate(-45 600 480)"/>
</g>`
const artInhaler = `
<g filter="url(#shadow)">
  <rect x="520" y="200" width="120" height="380" rx="30" fill="url(#red)"/>
  <rect x="540" y="230" width="20" height="300" rx="10" fill="url(#shine)"/>
  <rect x="470" y="560" width="260" height="120" rx="30" fill="#fff"/>
  <rect x="640" y="590" width="120" height="60" rx="20" fill="#fff"/>
  <rect x="490" y="600" width="140" height="40" rx="12" fill="url(#red)" fill-opacity=".2"/>
</g>`
const artBox = `
<g filter="url(#shadow)">
  <path d="M420 330 l180 -90 l180 90 v260 l-180 90 l-180 -90z" fill="#fff"/>
  <path d="M420 330 l180 90 l180 -90" fill="none" stroke="#e11d2e" stroke-opacity=".3" stroke-width="6"/>
  <path d="M600 420 v260" stroke="#e11d2e" stroke-opacity=".3" stroke-width="6"/>
  <path d="M600 420 l180 -90 v260 l-180 90z" fill="url(#red)" fill-opacity=".85"/>
  <path d="M420 330 l180 90 v260 l-180 -90z" fill="url(#red)" fill-opacity=".35"/>
</g>`

const ART: Record<string, string> = {
  Tablet: artTablet,
  Capsule: artCapsule,
  'Oral Suspension / Syrup': artSyrup,
  'Oral Solution / Drops': artDrops,
  Injection: artInjection,
  Infusion: artInjection,
  'Ointment / Cream / Gel': artCream,
  'Eye / Ear Drops': artDrops,
  'Sachet / Powder': artSachet,
  Inhaler: artInhaler,
  'Nasal Spray': artDrops,
  Suppository: artCapsule,
  Other: artBox,
}

export async function productImage(file: string, opts: { brand: string; generic: string; strength: string; form: string }) {
  fs.mkdirSync(OUT, { recursive: true })
  const out = path.join(OUT, file)
  if (fs.existsSync(out)) return out
  const w = 1200
  const h = 1200
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${backdrop(w, h)}
  ${ART[opts.form] || artBox}
  ${label(120, 900, 960, opts.brand, opts.generic, opts.strength, opts.form)}
  </svg>`
  await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(out)
  return out
}

/** Abstract branded visuals for hero / section images. */
export async function abstractImage(file: string, variant: 'facility' | 'lab' | 'globe' | 'quality' | 'team' | 'warehouse' | 'hero') {
  fs.mkdirSync(OUT, { recursive: true })
  const out = path.join(OUT, file)
  if (fs.existsSync(out)) return out
  const w = 1600
  const h = 1000
  const shapes: Record<string, string> = {
    facility: `
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${200 + i * 200}" y="${420 - (i % 2) * 60}" width="150" height="${380 + (i % 2) * 60}" rx="22" fill="#fff" fill-opacity=".85" filter="url(#shadow)"/>`).join('')}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${230 + i * 200}" y="${470 - (i % 2) * 60}" width="90" height="12" rx="6" fill="url(#red)" fill-opacity=".8"/><rect x="${230 + i * 200}" y="${500 - (i % 2) * 60}" width="60" height="12" rx="6" fill="#e11d2e" fill-opacity=".25"/>`).join('')}
      <rect x="120" y="800" width="1360" height="6" rx="3" fill="url(#red)" fill-opacity=".5"/>`,
    lab: `
      <g filter="url(#shadow)">
        <path d="M600 220 h120 v220 l160 300 a40 40 0 0 1 -36 60 h-408 a40 40 0 0 1 -36 -60 l160 -300 z" fill="#fff" fill-opacity=".9"/>
        <path d="M640 520 h40 l120 230 h-280 z" fill="url(#red)" fill-opacity=".8"/>
        <circle cx="1100" cy="380" r="120" fill="#fff" fill-opacity=".9"/><circle cx="1100" cy="380" r="70" fill="url(#red)" fill-opacity=".7"/>
        <circle cx="1250" cy="620" r="70" fill="#fff" fill-opacity=".9"/><circle cx="1250" cy="620" r="36" fill="url(#red)" fill-opacity=".7"/>
        <line x1="1100" y1="380" x2="1250" y2="620" stroke="#e11d2e" stroke-opacity=".4" stroke-width="6" stroke-dasharray="14 14"/>
      </g>`,
    globe: `
      <g filter="url(#shadow)">
        <circle cx="800" cy="500" r="300" fill="#fff" fill-opacity=".85"/>
        <ellipse cx="800" cy="500" rx="300" ry="110" fill="none" stroke="#e11d2e" stroke-opacity=".35" stroke-width="4"/>
        <ellipse cx="800" cy="500" rx="110" ry="300" fill="none" stroke="#e11d2e" stroke-opacity=".35" stroke-width="4"/>
        <circle cx="800" cy="500" r="300" fill="none" stroke="url(#red)" stroke-width="8"/>
        ${[[650, 420], [900, 380], [760, 620], [960, 560], [700, 520]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="url(#red)"/><circle cx="${x}" cy="${y}" r="28" fill="none" stroke="#e11d2e" stroke-opacity=".35" stroke-width="3"/>`).join('')}
      </g>`,
    quality: `
      <g filter="url(#shadow)">
        <path d="M800 200 l260 100 v220 c0 180 -120 300 -260 360 c-140 -60 -260 -180 -260 -360 v-220 z" fill="#fff" fill-opacity=".92"/>
        <path d="M800 260 l200 78 v182 c0 140 -95 240 -200 290 c-105 -50 -200 -150 -200 -290 v-182 z" fill="url(#red)" fill-opacity=".85"/>
        <path d="M700 520 l70 70 l150 -170" fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`,
    team: `
      ${[0, 1, 2, 3].map((i) => `<g filter="url(#shadow)"><circle cx="${420 + i * 260}" cy="${400 - (i % 2) * 40}" r="90" fill="#fff" fill-opacity=".9"/><circle cx="${420 + i * 260}" cy="${380 - (i % 2) * 40}" r="34" fill="url(#red)" fill-opacity=".8"/><path d="M${360 + i * 260} ${470 - (i % 2) * 40} a60 45 0 0 1 120 0z" fill="url(#red)" fill-opacity=".8"/></g>`).join('')}
      <rect x="300" y="620" width="1000" height="160" rx="30" fill="#fff" fill-opacity=".75"/>
      <rect x="340" y="660" width="500" height="18" rx="9" fill="#e11d2e" fill-opacity=".25"/><rect x="340" y="700" width="700" height="18" rx="9" fill="#e11d2e" fill-opacity=".18"/>`,
    warehouse: `
      ${[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${300 + c * 210}" y="${300 + r * 170}" width="170" height="130" rx="18" fill="#fff" fill-opacity=".9" filter="url(#shadow)"/><rect x="${330 + c * 210}" y="${340 + r * 170}" width="110" height="14" rx="7" fill="url(#red)" fill-opacity="${0.35 + ((r + c) % 3) * 0.2}"/>`).join('')).join('')}`,
    hero: `
      <g filter="url(#shadow)" transform="rotate(-30 800 500)">
        <rect x="500" y="400" width="600" height="200" rx="100" fill="#fff" fill-opacity=".95"/>
        <rect x="800" y="400" width="300" height="200" rx="100" fill="url(#red)"/>
        <rect x="800" y="400" width="100" height="200" fill="url(#red)"/>
        <rect x="530" y="430" width="540" height="40" rx="20" fill="url(#shine)"/>
      </g>
      <circle cx="380" cy="300" r="80" fill="#fff" fill-opacity=".85" filter="url(#shadow)"/>
      <circle cx="1240" cy="760" r="110" fill="#fff" fill-opacity=".85" filter="url(#shadow)"/>
      <path d="M1240 650 a110 110 0 0 1 110 110" fill="none" stroke="url(#red)" stroke-width="10" stroke-linecap="round"/>`,
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${backdrop(w, h)}${shapes[variant]}</svg>`
  await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(out)
  return out
}

/** Certificate / logo tile. */
export async function badgeImage(file: string, title: string, issuer: string) {
  fs.mkdirSync(OUT, { recursive: true })
  const out = path.join(OUT, file)
  if (fs.existsSync(out)) return out
  const w = 800
  const h = 600
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${backdrop(w, h)}
  <rect x="60" y="60" width="680" height="480" rx="32" fill="url(#glass)" stroke="#fff" filter="url(#shadow)"/>
  <circle cx="400" cy="230" r="90" fill="url(#red)"/>
  <path d="M355 235 l30 30 l65 -75" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="400" y="380" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#16151d">${esc(title)}</text>
  <text x="400" y="430" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#55545f">${esc(issuer)}</text>
  <text x="400" y="490" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#e11d2e" letter-spacing="4">SAMPLE CERTIFICATE ARTWORK</text>
  </svg>`
  await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(out)
  return out
}
