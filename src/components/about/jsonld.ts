import type { JsonLdObject } from '@/lib/seo'
import { absUrl, mediaUrl, SITE_URL } from '@/lib/utils'
import type { AboutPage } from '@/payload-types'

const ORG_ID = `${SITE_URL}/#organization`

/** schema.org Person nodes for the leadership team, linked to the site Organization. */
export const leadershipJsonLd = (people: AboutPage['leadership']): JsonLdObject[] =>
  (people || []).map((p) => {
    const photo = mediaUrl(p.photo, 'card') || mediaUrl(p.photo)
    return {
      '@type': 'Person',
      '@id': `${absUrl('/about')}#person-${(p.id || p.name)
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}`,
      name: p.name,
      jobTitle: p.role,
      description: p.bio || undefined,
      image: photo ? absUrl(photo) : undefined,
      worksFor: { '@id': ORG_ID },
    }
  })

/** Reference to the Organization node emitted in the root layout. */
export const organizationRef = () => ({ '@id': ORG_ID })
