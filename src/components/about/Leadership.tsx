import { Media } from '@/components/Media'
import { Container, Section, SectionHeading } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import { mediaUrl } from '@/lib/utils'
import type { AboutPage } from '@/payload-types'

type Props = { leadership: AboutPage['leadership'] }

const initials = (name: string) =>
  name
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

/** Gradient monogram used when a leader has no photo uploaded. */
function Monogram({ name }: { name: string }) {
  return (
    <div
      className="relative flex bg-brand-50 aspect-[4/5] items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <span className="relative font-sans text-5xl font-semibold tracking-tight text-brand-700 sm:text-6xl">
        {initials(name)}
      </span>
    </div>
  )
}

/** Leadership cards: photo (or gradient monogram), name, role and short bio. */
export function Leadership({ leadership }: Props) {
  if (!leadership?.length) return null
  const cols =
    leadership.length >= 4
      ? 'lg:grid-cols-4'
      : leadership.length === 3
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-2'
  return (
    <Section className="!pt-0" aria-labelledby="about-leadership">
      <Container>
        <SectionHeading
          eyebrow="Leadership"
          title={<span id="about-leadership">The people behind the company</span>}
          description="The team responsible for the company's direction, operations, quality and partnerships."
        />
        <ul className={`mt-12 grid gap-5 sm:grid-cols-2 ${cols}`} role="list">
          {leadership.map((p, i) => {
            const hasPhoto = Boolean(mediaUrl(p.photo))
            return (
              <Reveal
                as="li"
                key={p.id || p.name}
                delay={i * 60}
                className="group glass-card glass-edge flex flex-col overflow-hidden !p-0"
              >
                <div className="relative m-2 overflow-hidden">
                  {hasPhoto ? (
                    <Media
                      media={p.photo}
                      size="card"
                      fill
                      alt={`${p.name}, ${p.role}`}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                      className="aspect-[4/5] bg-white"
                    />
                  ) : (
                    <Monogram name={p.name} />
                  )}
                </div>
                <div className="flex flex-1 flex-col px-5 pb-6 pt-3 sm:px-6">
                  <h3 className="text-lg font-semibold text-ink-950">{p.name}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-brand-600">
                    {p.role}
                  </p>
                  {p.bio && <p className="mt-3 text-sm leading-relaxed text-ink-600">{p.bio}</p>}
                </div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
