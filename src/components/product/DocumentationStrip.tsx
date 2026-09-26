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

/** Dark glass band listing the regulatory documents available with the product. */
export function DocumentationStrip({ productTitle }: { productTitle: string }) {
  return (
    <Section className="!py-0" aria-labelledby="documentation-heading">
      <Container>
        <div className="mesh-bg-dark noise relative overflow-hidden rounded-[2rem] p-6 text-white sm:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute inset-0 grid-pattern opacity-30 fade-mask-y"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <Eyebrow className="!text-brand-300">Documentation available</Eyebrow>
              <h2 id="documentation-heading" className="heading-2 mt-3 !text-white">
                Everything your registration file needs
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
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
                  <div className="glass-dark flex h-full items-start gap-3 rounded-2xl p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)]">
                      <d.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{d.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-white/60">
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
