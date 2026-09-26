import { ArrowRight, ShieldCheck } from 'lucide-react'

import { Button, Container, Eyebrow, Section } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'

import { pad2 } from './certifications'

const STEPS = [
  {
    title: 'Note the certificate number and issuing body',
    text: 'Both are printed on every card above. Statutory licences are issued by drug regulators; ISO and system certificates by accredited certification bodies.',
  },
  {
    title: 'Check with the issuer',
    text: 'Most regulators and certification bodies maintain a public register or answer verification requests by email when quoted the certificate number and holder name.',
  },
  {
    title: 'Ask us for a certified copy',
    text: 'For registration dossiers we provide notarised or apostilled copies, product-specific CoPPs, Free Sale Certificates and batch Certificates of Analysis.',
  },
]

const DOSSIER_DOCS = ['WHO-GMP certificate', 'Manufacturing licence', 'Certificate of Pharmaceutical Product (CoPP)', 'Free Sale Certificate', 'Certificate of Analysis (per batch)', 'Stability summary & site master file']

/** "How to verify" glass note with a three-step checklist and a dossier-documents aside. */
export function VerifyNote() {
  return (
    <Section aria-labelledby="verify-title">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] glass-red glass-edge p-6 sm:p-10 lg:grid lg:grid-cols-12 lg:gap-14 lg:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_102_117_/_0.22),transparent)]" aria-hidden="true" />
            <div className="relative lg:col-span-7">
              <Eyebrow className="mb-4">Verification</Eyebrow>
              <h2 id="verify-title" className="heading-2">
                How to verify a certificate
              </h2>
              <p className="mt-4 max-w-2xl text-ink-600">
                Every document on this page is issued by a statutory regulator or an accredited certification body, and each can be checked independently of us.
              </p>
              <ol className="mt-8 space-y-6" aria-label="Verification steps">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-mono text-xs font-semibold text-white shadow-glow">{pad2(i + 1)}</span>
                    <div>
                      <h3 className="font-semibold text-ink-950">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <aside className="relative mt-10 rounded-3xl glass-strong p-6 sm:p-8 lg:col-span-5 lg:mt-0" aria-labelledby="dossier-title">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgb(225_29_46_/_0.8)]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 id="dossier-title" className="mt-5 text-lg font-semibold text-ink-950">
                Documents we supply for registration dossiers
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-ink-700" role="list">
                {DOSSIER_DOCS.map((d) => (
                  <li key={d} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
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
