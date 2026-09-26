import type { MetadataRoute } from 'next'

import { absUrl, SITE_URL } from '@/lib/utils'

/**
 * /robots.txt – open to every crawler, with explicit groups for AI / LLM crawlers
 * so they are never caught by a future generic restriction. The admin panel and
 * API are excluded, except the media endpoint (product images must stay crawlable
 * for Google Images and social previews). Static assets under /_next are left
 * open on purpose: Google renders pages and needs the CSS/JS to index correctly.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Claude-SearchBot',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
  'Bytespider',
  'DuckAssistBot',
  'Amazonbot',
  'meta-externalagent',
  'Meta-ExternalFetcher',
  'MistralAI-User',
  'YouBot',
]

const DISALLOW = ['/admin', '/api/']
const ALLOW = ['/', '/api/media/file/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ALLOW, disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: ALLOW, disallow: DISALLOW })),
    ],
    sitemap: absUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
