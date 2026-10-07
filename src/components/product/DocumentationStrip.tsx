import {
  ArrowRight,
  FileBadge,
  FileCheck,
  FileText,
  FlaskConical,
  Palette,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'

import { Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'

const DOCS = [
  {
    icon: FileCheck,
    title: 'Certificate of Analysis (CoA)',
    text: 'Batch-specific test results against the release specification.',
  },
  {
    icon: FileBadge,
    title: 'Certificate of Pharmaceutical Product (CoPP)',
    text: 'WHO-format CoPP issued by the national regulatory authority.',
  },
  {
    icon: FlaskConical,
    title: 'Stability data',
    text: 'Real-time and accelerated studies for the relevant ICH climatic zones.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety data sheet (MSDS)',
    text: 'Handling, storage and transport safety information.',
  },
  {
    icon: Palette,
    title: 'Artwork & labelling',
    text: 'Print-ready artwork and labelling files; local-language versions on request.',
  },
  {
    icon: FileText,
    title: 'Dossier (CTD / ACTD)',
    text: 'Registration dossiers in CTD or ACTD format on request.',
  },
]

/** Bordered panel listing the regulatory documents available with the product. */
export function DocumentationStrip({ productTitle }: { productTitle: string }) {
  return (
    <Section className="!py-0" aria-labelledby="documentation-heading">
      <Container>
        <div className="border border-ink-200 bg-surface-2 p-6 sm:p-10 lg:p-12 rounded-xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <Eyebrow>Documentation available</Eyebrow>
              <h2 id="documentation-heading" className="heading-2 mt-3">
                Everything your registration file needs
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                Every shipment of {productTitle} can be accompanied by a complete regulatory
                document set. Tell us your market and we will prepare the right pack.
              </p>
              <Link href="/contact" className="btn-primary mt-6">
                Request documents <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8" role="list">
              {DOCS.map((d, i) => (
                <Reveal as="li" key={d.title} delay={i * 50}>
                  <div className="flex h-full items-start gap-3 glass p-4">
                    <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink-950">{d.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-600">
                        {d.text}
                      </span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
