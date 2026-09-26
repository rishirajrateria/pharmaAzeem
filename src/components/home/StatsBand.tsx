import type { Homepage } from '@/payload-types'

import { Stats } from '../Stats'
import { Container } from '../ui'
import { Reveal } from '../ui/Reveal'

/** Key figures as a definition list – real numbers are server-rendered, the count-up is progressive. */
export function StatsBand({ stats }: { stats?: Homepage['stats'] }) {
  if (!stats?.length) return null
  return (
    <section aria-label="Key figures" className="relative -mt-2 pb-6 sm:-mt-6">
      <Container>
        <Reveal>
          <Stats stats={stats} />
        </Reveal>
      </Container>
    </section>
  )
}
