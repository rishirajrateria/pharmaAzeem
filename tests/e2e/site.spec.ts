import { expect, test } from '@playwright/test'

const pages = [
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

for (const path of pages) {
  test(`renders ${path} with a single h1, metadata and JSON-LD`, async ({ page }) => {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//)
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(ld.length).toBeGreaterThan(0)
    for (const json of ld) expect(() => JSON.parse(json)).not.toThrow()
    // No horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(overflow).toBeFalsy()
  })
}

test('product page exposes Product/Drug structured data and the inquiry flow works', async ({
  page,
}) => {
  await page.goto('/products')
  const first = page.locator('article a[href^="/products/"]').first()
  const href = await first.getAttribute('href')
  expect(href).toBeTruthy()
  await page.goto(href!)
  await expect(page.locator('h1')).toHaveCount(1)
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n')
  expect(ld).toContain('"Drug"')
  expect(ld).toContain('BreadcrumbList')
  // Add to inquiry list → drawer opens
  await page
    .getByRole('button', { name: /add to inquiry list/i })
    .first()
    .click()
  await expect(page.getByRole('dialog', { name: /inquiry list/i })).toBeVisible()
  await page
    .getByRole('link', { name: /inquire now/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/inquiry/)
})

test('category filters work via URL params', async ({ page }) => {
  await page.goto('/categories')
  const link = page.locator('a[href^="/categories/"]').first()
  await link.click()
  await expect(page).toHaveURL(/\/categories\//)
  await expect(page.locator('h1')).toHaveCount(1)
  await page.goto('/products?form=Tablet')
  await expect(page.locator('article').first()).toBeVisible()
})

test('machine-readable endpoints exist', async ({ request }) => {
  for (const path of [
    '/sitemap.xml',
    '/robots.txt',
    '/llms.txt',
    '/llms-full.txt',
    '/manifest.webmanifest',
  ]) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
  }
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toMatch(/GPTBot/i)
  expect(robots).toMatch(/sitemap/i)
})

test('unknown product returns 404', async ({ page }) => {
  const res = await page.goto('/products/does-not-exist-xyz')
  expect(res?.status()).toBe(404)
})
