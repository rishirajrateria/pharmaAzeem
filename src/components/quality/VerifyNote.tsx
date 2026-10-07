import { ArrowRight, ShieldCheck } from 'lucide-react'

import { Button, Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { Certification } from '@/payload-types'

import { pad2 } from './certifications'

const STEPS = [
  {
    title: 'Note the certificate number and issuing body',
    text: 'Both are shown on every card above, together with the validity dates. Statutory licences come from drug regulators; certifications and accreditations from independent certification bodies.',
  },
  {
    title: 'Check with the issuer',
    text: 'Most regulators and certification bodies maintain a public register or answer verification requests by email when quoted the certificate number and holder name.',
  },
  {
    title: 'Ask us for a certified copy',
    text: 'For registration dossiers, tell us the products and destination country and we will supply certificate copies and the supporting documents your regulator asks for.',
  },
]

/** Product- and batch-level documents that are requested per shipment rather than listed as certificates. */
const REQUEST_DOCS = [
  'Product-specific export documents – on request',
  'Batch Certificates of Analysis – on request',
]

const MAX_CERT_DOCS = 4

/** Names the certificates that usually go into a dossier: featured licences/certifications first, then the rest. */
function dossierDocuments(certifications: Certification[]) {
  const ranked = certifications
    .filter((c) => c.type === 'license' || c.type === 'certification')
    .sort(
      (a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        (a.order ?? 0) - (b.order ?? 0),
    )
  const titles = [...new Set(ranked.map((c) => c.title.trim()).filter(Boolean))].slice(
    0,
    MAX_CERT_DOCS,
  )
  return [...titles, ...REQUEST_DOCS]
}

/** "How to verify" glass note with a three-step checklist and a dossier-documents aside (document names come from the CMS). */
export function VerifyNote({ certifications = [] }: { certifications?: Certification[] }) {
  const docs = dossierDocuments(certifications)
  return (
    <Section aria-labelledby="verify-title">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden glass-red glass-edge p-6 sm:p-10 lg:grid lg:grid-cols-12 lg:gap-14 lg:p-14">
            <div className="relative lg:col-span-7">
              <Eyebrow className="mb-4">Verification</Eyebrow>
              <h2 id="verify-title" className="heading-2">
                How to verify a certificate
              </h2>
              <p className="mt-4 max-w-2xl text-ink-600">
                Every document on this page names the body that issued it, so each one can be
                checked independently of us.
              </p>
              <ol className="mt-8 space-y-6" aria-label="Verification steps">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-brand-gradient text-xs font-semibold text-white shadow-glow">
                      {pad2(i + 1)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink-950">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <aside
              className="relative mt-10 glass-strong p-6 sm:p-8 lg:col-span-5 lg:mt-0"
              aria-labelledby="dossier-title"
            >
              <span className="flex h-11 w-11 items-center justify-center bg-brand-gradient text-white">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 id="dossier-title" className="mt-5 text-lg font-semibold text-ink-950">
                Documents for registration dossiers
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-ink-700" role="list">
                {docs.map((d) => (
                  <li key={d} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-500" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <Button href="/contact" className="mt-6 w-full sm:w-auto">
                Request certificate copies <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </aside>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
