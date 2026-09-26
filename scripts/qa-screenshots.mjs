// Visual QA: full-page screenshots of every key route at desktop + mobile widths.
// Usage: node scripts/qa-screenshots.mjs [baseUrl] [outDir]  (ROUTES=/a,/b to override)
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const base = process.argv[2] || 'http://localhost:3000'
const out = process.argv[3] || path.resolve('qa-shots')
fs.mkdirSync(out, { recursive: true })

const routes = process.env.ROUTES
  ? process.env.ROUTES.split(',')
  : [
      '/',
      '/products',
      '/categories',
      '/about',
      '/quality',
      '/manufacturing',
      '/global-presence',
      '/licenses',
      '/contact',
      '/inquiry',
    ]
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const results = []
for (const vp of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    deviceScaleFactor: vp.deviceScaleFactor || 1,
  })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  for (const r of routes) {
    const t0 = Date.now()
    const res = await page
      .goto(base + r, { waitUntil: 'networkidle', timeout: 60000 })
      .catch((e) => ({ status: () => `ERR ${e.message}` }))
    // Freeze scroll-reveal / entrance transitions so full-page captures show final layout.
    await page
      .addStyleTag({
        content:
          '.reveal{opacity:1!important;transform:none!important;transition:none!important} *{animation-play-state:paused!important}',
      })
      .catch(() => {})
    // Force lazy images to load so cards are not blank in the capture, then wait for them.
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager' })
      await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r })))
    }).catch(() => {})
    // trigger reveal animations by scrolling through the page
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(400)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    const h1s = await page.locator('h1').count()
    const file = `${vp.name}${r === '/' ? '-home' : r.replace(/[^a-z0-9]+/gi, '-')}.png`
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    if (height * (vp.deviceScaleFactor || 1) <= 16000) {
      await page.screenshot({ path: path.join(out, file), fullPage: true })
    } else {
      // Very tall pages exceed Chromium's capture limits → capture viewport tiles instead.
      const tiles = Math.ceil(height / vp.height)
      for (let t = 0; t < tiles; t++) {
        await page.evaluate((y) => window.scrollTo(0, y), t * vp.height)
        await page.waitForTimeout(150)
        await page.screenshot({ path: path.join(out, file.replace(/\.png$/, `-tile${String(t + 1).padStart(2, '0')}.png`)) })
      }
    }
    results.push({
      vp: vp.name,
      route: r,
      status: res.status(),
      ms: Date.now() - t0,
      overflow,
      h1s,
      errors: errors.splice(0),
    })
  }
  await ctx.close()
}
await browser.close()
console.table(
  results.map((r) => ({
    ...r,
    errors: r.errors.length ? r.errors.slice(0, 2).join(' | ').slice(0, 160) : '',
  })),
)
fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2))
