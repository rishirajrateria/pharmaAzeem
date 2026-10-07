import { Clock, Mail, MessageCircle, Phone } from 'lucide-react'

import { InquiryForm } from '@/components/forms/InquiryForm'
import { Container, Eyebrow, Section } from '@/components/ui'
import type { SiteSetting } from '@/payload-types'

type Props = {
  product: { id: number; title: string }
  contact?: SiteSetting['contact']
}

const INCLUDE = [
  'Target market and required registrations',
  'Estimated annual quantities',
  'Preferred pack size, artwork or private label',
  'Incoterms and delivery port',
] as const

/** #inquire – product-specific quotation form with contact details alongside. */
export function InquireSection({ product, contact }: Props) {
  const phone = contact?.phone || undefined
  const email = contact?.email || undefined
  const whatsapp = contact?.whatsapp?.replace(/\D/g, '') || undefined
  return (
    <Section id="inquire" aria-labelledby="inquire-heading" className="scroll-mt-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Eyebrow className="mb-4">Request a quotation</Eyebrow>
            <h2 id="inquire-heading" className="heading-2">
              Inquire about <span className="text-brand-700">{product.title}</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-600">
              Share your quantities and destination and our export desk will reply with pricing,
              lead time and the documents your regulator expects.
            </p>

            <h3 className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-500">
              Helpful to include
            </h3>
            <ul className="mt-3 space-y-2" role="list">
              {INCLUDE.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand-700" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>

            {(email || phone || whatsapp) && (
              <div className="mt-8 border border-ink-200 bg-surface-2 p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-500">
                  Prefer to talk?
                </p>
                <ul className="mt-3 space-y-2 text-sm" role="list">
                  {email && (
                    <li>
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center gap-2 text-ink-800 hover:text-brand-700"
                      >
                        <Mail className="h-4 w-4 text-brand-600" aria-hidden="true" /> {email}
                      </a>
                    </li>
                  )}
                  {phone && (
                    <li>
                      <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-2 text-ink-800 hover:text-brand-700"
                      >
                        <Phone className="h-4 w-4 text-brand-600" aria-hidden="true" /> {phone}
                      </a>
                    </li>
                  )}
                  {whatsapp && (
                    <li>
                      <a
                        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello, I would like a quotation for ${product.title}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-ink-800 hover:text-brand-700"
                      >
                        <MessageCircle className="h-4 w-4 text-brand-600" aria-hidden="true" />{' '}
                        WhatsApp our export desk
                      </a>
                    </li>
                  )}
                  {contact?.businessHours && (
                    <li className="inline-flex items-center gap-2 text-ink-600">
                      <Clock className="h-4 w-4 text-brand-600" aria-hidden="true" />{' '}
                      {contact.businessHours}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="border border-ink-200 bg-white p-5 sm:p-8">
            <h3 className="text-lg font-semibold text-ink-950">Send your inquiry</h3>
            <p className="mt-1 text-sm text-ink-600">
              {product.title} will be attached automatically. No account needed.
            </p>
            <InquiryForm
              source="product-page"
              includeList={false}
              product={product}
              submitLabel="Send inquiry"
              compact
              className="mt-6"
              successMessage={`Thank you – we have received your inquiry about ${product.title}. Our export desk will get back to you shortly.`}
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
