import { ArrowRight, Factory, FileCheck2, Globe, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Container } from '../ui'

const TILES: { icon: LucideIcon; title: string; text: string; href: string; cta: string }[] = [
  {
    icon: Factory,
    title: 'Private label & contract manufacturing',
    text: 'Your brand, made in our WHO-GMP plants – artwork, packaging and stability studies included.',
    href: '/manufacturing',
    cta: 'Manufacturing services',
  },
  {
    icon: Globe,
    title: 'Bulk export orders',
    text: 'Registration support, export documentation and sea or air freight to your country.',
    href: '/global-presence',
    cta: 'Markets we serve',
  },
  {
    icon: FileCheck2,
    title: 'Licences & certificates',
    text: 'Download-ready GMP, ISO and CoPP certificates for tenders and product registration.',
    href: '/licenses',
    cta: 'View certificates',
  },
]

/** Three service tiles that lead buyers from the shop to the B2B services. */
export function ServiceTiles() {
  return (
    <section className="py-12 sm:py-14" aria-label="Services for buyers">
      <Container>
        <ul className="grid gap-4 md:grid-cols-3">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="glass-card group flex h-full flex-col p-6">
                <t.icon className="h-8 w-8 text-brand-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-ink-950">{t.title}</h2>
                <p className="mt-2 flex-1 text-sm text-ink-600">{t.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:underline">
                  {t.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
