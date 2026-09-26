import { Container, Section, SectionHeading } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

import { CertificateCard } from './CertificateCard'
import { type CertGroup, pad2 } from './certifications'

/** Anchor chips that jump to each certificate group (no JS, no filters). */
export function GroupJumpNav({ groups, className }: { groups: CertGroup[]; className?: string }) {
  if (groups.length < 2) return null
  return (
    <nav aria-label="Certificate groups" className={className}>
      <ul className="flex flex-wrap gap-2" role="list">
        {groups.map((g) => (
          <li key={g.type}>
            <a href={`#${g.anchor}`} className="chip !py-1.5 hover:border-brand-400 hover:bg-white">
              <Icon name={g.icon} className="h-3.5 w-3.5" />
              {g.label}
              <span className="rounded-full bg-brand-600 px-1.5 font-mono text-[10px] leading-4 text-white">{g.items.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Grouped, filter-less certificate gallery: one section per certificate type with a responsive card grid. */
export function CertificateGallery({ groups }: { groups: CertGroup[] }) {
  if (!groups.length) {
    return (
      <Section className="!pt-0">
        <Container>
          <div className="glass-strong rounded-[2rem] p-8 text-center sm:p-12">
            <h2 className="heading-3">Certificate list being updated</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-600">Our current licences and certificates are available on request while this page is refreshed.</p>
          </div>
        </Container>
      </Section>
    )
  }
  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 -z-10 dots-pattern fade-mask-y opacity-40" aria-hidden="true" />
      {groups.map((g, gi) => (
        <section key={g.type} id={g.anchor} className="scroll-mt-24 py-10 sm:py-14" aria-labelledby={`${g.anchor}-title`}>
          <Container>
            <div className="flex items-start gap-5">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient font-mono text-sm font-semibold text-white shadow-glow sm:flex" aria-hidden="true">
                {pad2(gi + 1)}
              </span>
              <SectionHeading
                title={
                  <span id={`${g.anchor}-title`}>
                    {g.label}{' '}
                    <span className="align-middle font-mono text-sm font-medium tracking-[0.18em] text-brand-600">
                      {g.items.length} {g.items.length === 1 ? 'document' : 'documents'}
                    </span>
                  </span>
                }
                description={g.description}
                titleClassName="heading-3 sm:text-3xl"
              />
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="list">
              {g.items.map((cert, i) => (
                <Reveal key={cert.id} as="li" delay={(i % 3) * 60} className="h-full">
                  <CertificateCard cert={cert} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ))}
    </div>
  )
}
