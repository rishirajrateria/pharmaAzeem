import type { GlobalPresencePage } from '@/payload-types'

import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

type Service = NonNullable<GlobalPresencePage['exportServices']>[number]

const DEFAULT_SERVICES: Service[] = [
  {
    title: 'Product registration',
    icon: 'file-check',
    description:
      'CTD / eCTD dossiers, stability data, CoPPs, samples and regulator query responses.',
  },
  {
    title: 'Tender supply',
    icon: 'clipboard-list',
    description:
      'Government and institutional tenders with pre-shipment inspection and full documentation.',
  },
  {
    title: 'Private label',
    icon: 'package',
    description:
      'Your brand, our formulations – artwork in local languages and market-specific packs.',
  },
  {
    title: 'Logistics',
    icon: 'ship',
    description:
      'FCL, LCL and air freight with cold-chain options and the Incoterms of your choice.',
  },
  {
    title: 'Local-language support',
    icon: 'globe',
    description:
      'Artwork, leaflets and documentation prepared in the languages your market requires.',
  },
  {
    title: 'After-sales',
    icon: 'headset',
    description: 'Dedicated account managers, pharmacovigilance support and complaint handling.',
  },
]

/** Icon grid of export services. Falls back to sensible defaults when the CMS list is empty. */
export function ExportServices({ services }: { services?: Service[] | null }) {
  const list = services?.length ? services : DEFAULT_SERVICES
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
      {list.map((s, i) => (
        <Reveal as="li" key={s.id || s.title} delay={i * 60} className="h-full">
          <article className="glass-card group flex h-full flex-col p-6">
            <span className="flex h-12 w-12 items-center justify-center bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgb(225_29_46_/_0.8)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ink-950">{s.title}</h3>
            {s.description && (
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.description}</p>
            )}
          </article>
        </Reveal>
      ))}
    </ul>
  )
}
