import { Container, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { AboutPage } from '@/payload-types'

type Props = { values: AboutPage['values'] }

/** Grid of glass cards, one per core value, with a gradient icon tile. */
export function CoreValues({ values }: Props) {
  if (!values?.length) return null
  return (
    <Section className="!pt-0" aria-labelledby="about-values">
      <Container>
        <SectionHeading
          eyebrow="Core values"
          title={<span id="about-values">The principles behind every batch</span>}
          description={`${values.length === 6 ? 'Six' : values.length} values shape how we develop, manufacture and deliver medicines – and how we treat the partners who rely on them.`}
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {values.map((v, i) => (
            <Reveal
              as="li"
              key={v.id || v.title}
              delay={i * 60}
              className="group glass-card glass-edge relative overflow-hidden p-6 sm:p-7"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-100/60 blur-2xl transition-transform duration-700 group-hover:scale-150"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgb(225_29_46_/_0.8)]">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.2em] text-ink-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-ink-950">{v.title}</h3>
              {v.description && (
                <p className="relative mt-2 text-sm leading-relaxed text-ink-600">
                  {v.description}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
