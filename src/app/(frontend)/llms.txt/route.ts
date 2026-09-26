import { buildLlmsIndex, loadLlmsData } from '@/components/seo/llms'

/**
 * /llms.txt – the llms.txt index (https://llmstxt.org).
 * A concise, link-rich Markdown summary of the company, its pages, categories,
 * products, markets and certifications for AI assistants and LLM crawlers.
 * Static (ISR) and purged by Payload hooks whenever content changes.
 */
export const revalidate = 3600
export const dynamic = 'force-static'

export async function GET() {
  const data = await loadLlmsData()
  const body = buildLlmsIndex(data)
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
