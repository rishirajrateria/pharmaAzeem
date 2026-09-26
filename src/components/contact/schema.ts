import type { JsonLdObject } from '@/lib/seo'
import { absUrl } from '@/lib/utils'

/**
 * schema.org HowTo for the inquiry flow. Local helper (src/lib is shared and
 * owned by another agent – see docs/frontend-guide.md).
 */
export const howToJsonLd = (args: {
  path: string
  name: string
  description: string
  steps: { title: string; description: string }[]
}): JsonLdObject => ({
  '@type': 'HowTo',
  '@id': `${absUrl(args.path)}#howto`,
  name: args.name,
  description: args.description,
  totalTime: 'P1D',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: 0 },
  step: args.steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.description,
    url: `${absUrl(args.path)}#how-it-works`,
  })),
})
