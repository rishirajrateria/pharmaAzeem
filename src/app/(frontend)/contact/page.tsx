import type { Metadata } from 'next'
import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

import { FaqAccordion } from '@/components/FaqAccordion'
import { CtaBand } from '@/components/contact/CtaBand'
import {
  DepartmentsCard,
  HeadOfficeCard,
  ReachUsCard,
  SocialLinks,
  telHref,
  whatsappHref,
} from '@/components/contact/ContactCards'
import { ContactHero } from '@/components/contact/ContactHero'
import { MapEmbed } from '@/components/contact/MapEmbed'
import { PageSections } from '@/components/contact/PageSections'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Eyebrow } from '@/components/ui'
import { Reveal } from '@/components/ui/Reveal'
import type { ContactPage as ContactPageDoc } from '@/payload-types'
import { getCommerceLabels } from '@/lib/commerce'
import { getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, siteName, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/contact'

/** Narrows a CMS CTA group to a usable {label,url} pair (both required). */
const cta = (c?: ContactPageDoc['hero']['primaryCta']) =>
  c?.label && c.url ? { label: c.label, url: c.url } : null

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageGlobal('contact-page')])
  const name = siteName(settings)
  return buildMetadata({
    settings,
    path: PATH,
    title: page.hero?.title || `Contact ${name}`,
    description: page.hero?.subtitle || truncate(richTextToPlain(page.intro), 160),
    image: page.hero?.image,
    meta: page.meta,
    modifiedTime: page.updatedAt,
  })
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageGlobal('contact-page')])
  const labels = getCommerceLabels(settings)
  const name = siteName(settings)
  const contact = settings.contact
  const title = page.hero?.title || `Contact ${name}`
  const summary =
    page.hero?.subtitle ||
    `Contact ${name} for product quotations, registrations and partnership inquiries.`
  const primaryCta = cta(page.hero?.primaryCta)
  const secondaryCta = cta(page.hero?.secondaryCta)
  const whatsapp = contact?.whatsapp
    ? whatsappHref(contact.whatsapp, `Hello ${name}, I would like to inquire about your products.`)
    : null

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({
            path: PATH,
            name: title,
            description: summary,
            type: 'ContactPage',
            image: mediaUrl(page.hero?.image, 'large'),
            dateModified: page.updatedAt,
          }),
        )}
      />

      <ContactHero
        crumbs={[{ name: 'Contact', path: PATH }]}
        eyebrow={page.hero?.eyebrow || 'Contact'}
        title={title}
        subtitle={summary}
        intro={page.intro}
        image={page.hero?.image}
        badge={{ title: 'Direct reply from our team', subtitle: contact?.businessHours }}
      >
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta && (
              <Link href={primaryCta.url} className="btn-primary">
                {primaryCta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.url} className="btn-secondary">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
        {(contact?.email || contact?.phone || whatsapp) && (
          <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Quick contact options">
            {contact?.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="chip !px-4 !py-2 text-sm shadow-soft transition hover:border-brand-400 hover:bg-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            )}
            {contact?.phone && (
              <li>
                <a
                  href={telHref(contact.phone)}
                  className="chip !px-4 !py-2 text-sm shadow-soft transition hover:border-brand-400 hover:bg-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip !px-4 !py-2 text-sm shadow-soft transition hover:border-brand-400 hover:bg-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        )}
      </ContactHero>

      {/* Form + contact details */}
      <section className="relative py-10 sm:py-14 lg:py-16" aria-labelledby="contact-form-heading">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div
                id="contact-form"
                className="glass-strong glass-edge scroll-mt-28 rounded-3xl p-6 sm:p-8 lg:p-10"
              >
                <Eyebrow className="mb-3">Message us</Eyebrow>
                <h2 id="contact-form-heading" className="heading-3">
                  Send us a message
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
                  Tell us which products, quantities and markets you have in mind – or ask about
                  private label, contract manufacturing or a facility audit. The right team replies
                  directly.
                </p>
                <InquiryForm
                  source="contact-form"
                  includeList={false}
                  successMessage={page.formSuccessMessage ?? undefined}
                  submitLabel="Send message"
                  className="mt-7"
                />
              </div>
            </div>

            <aside className="lg:col-span-5" aria-labelledby="contact-details-heading">
              <h2 id="contact-details-heading" className="sr-only">
                Contact details
              </h2>
              <div className="space-y-4 sm:space-y-5">
                <HeadOfficeCard contact={contact} />
                <ReachUsCard contact={contact} siteName={name} delay={80} />
                <DepartmentsCard departments={page.departments} delay={160} />
                <SocialLinks socials={contact?.socials} delay={240} />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Map */}
      {contact?.mapEmbedUrl && (
        <section className="relative py-6 sm:py-10" aria-labelledby="map-heading">
          <Container>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow className="mb-3">Find us</Eyebrow>
                <h2 id="map-heading" className="heading-3">
                  Visit our head office
                </h2>
              </div>
              {contact?.businessHours && (
                <p className="text-sm text-ink-500">{contact.businessHours}</p>
              )}
            </div>
            <Reveal>
              <MapEmbed src={contact.mapEmbedUrl} title={`Map showing the location of ${name}`} />
            </Reveal>
          </Container>
        </section>
      )}

      <PageSections sections={page.sections} idPrefix="contact-section" />

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="relative py-16 sm:py-20" aria-labelledby="contact-faq-heading">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 hairline"
            aria-hidden="true"
          />
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Eyebrow className="mb-4">FAQ</Eyebrow>
                <h2 id="contact-faq-heading" className="heading-2">
                  Before you write to us
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-600">
                  Quick answers to the questions our export team hears most often. Can’t find yours?
                  Ask in the form above.
                </p>
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faqs={page.faqs} />
              </div>
            </div>
          </Container>
        </section>
      )}

      <CtaBand
        id="contact-inquiry-cta"
        eyebrow="Prefer to send a product list?"
        title="Build your inquiry list and get one quotation for everything."
        description={`Add products from the catalogue to your ${labels.listName.toLowerCase()}, then send it with your details – no payment, no commitment. We reply with pricing, MOQs and lead times.`}
        primary={{ label: labels.ctaLabel, href: '/inquiry' }}
        secondary={{ label: 'Browse products', href: '/products' }}
      />
    </>
  )
}
