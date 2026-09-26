import { buildLlmsFull, loadLlmsData } from '@/components/seo/llms'

/**
 * /llms-full.txt – the complete public content of the site in Markdown:
 * every product (key-facts table, description, indications, FAQs), category,
 * market, certification, facility and company page. Regenerated on content changes.
 */
export const revalidate = 3600
export const dynamic = 'force-static'

export async function GET() {
  const data = await loadLlmsData()
  const body = buildLlmsFull(data)
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
