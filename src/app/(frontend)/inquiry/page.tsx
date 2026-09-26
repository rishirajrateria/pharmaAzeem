import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { CtaBand } from '@/components/contact/CtaBand'
import { ContactHero } from '@/components/contact/ContactHero'
import { HOW_IT_WORKS_STEPS, HowItWorks, ReassuranceChips } from '@/components/contact/HowItWorks'
import { InquiryListReview } from '@/components/contact/InquiryListReview'
import { InquiryVisual } from '@/components/contact/InquiryVisual'
import { PageSections } from '@/components/contact/PageSections'
import { howToJsonLd } from '@/components/contact/schema'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { Container, Eyebrow } from '@/components/ui'
import { getCommerceLabels } from '@/lib/commerce'
import { getPageGlobal, getSiteSettings } from '@/lib/data'
import { buildMetadata, graph, siteName, webPageJsonLd } from '@/lib/seo'
import { mediaUrl, richTextToPlain, truncate } from '@/lib/utils'

export const revalidate = 3600

const PATH = '/inquiry'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageGlobal('inquiry-page')])
  return buildMetadata({
    settings,
    path: PATH,
    title: page.hero?.title || 'Request a quotation',
    description: page.hero?.subtitle || truncate(richTextToPlain(page.intro), 160),
    image: page.hero?.image,
    meta: page.meta,
    modifiedTime: page.updatedAt,
  })
}

export default async function InquiryPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageGlobal('inquiry-page')])
  const labels = getCommerceLabels(settings)
  const name = siteName(settings)
  const listName = labels.listName
  const lower = listName.toLowerCase()
  const title = page.hero?.title || 'Request a quotation'
  const summary =
    page.hero?.subtitle ||
    `Send your ${lower} to ${name} and receive a quotation with pricing, minimum order quantities and lead times for your market.`

  return (
    <>
      <JsonLd
        data={graph(
          webPageJsonLd({
            path: PATH,
            name: title,
            description: summary,
            type: 'WebPage',
            image: mediaUrl(page.hero?.image, 'large'),
            dateModified: page.updatedAt,
          }),
          howToJsonLd({
            path: PATH,
            name: `How to request a pharmaceutical quotation from ${name}`,
            description: `Add products to your ${lower}, send it with your contact details and receive a quotation with pricing, MOQs and lead times for your market.`,
            steps: HOW_IT_WORKS_STEPS.map(({ title: t, description }) => ({
              title: t,
              description,
            })),
          }),
        )}
      />

      <ContactHero
        crumbs={[{ name: title, path: PATH }]}
        eyebrow={page.hero?.eyebrow || 'Inquiry'}
        title={title}
        subtitle={summary}
        intro={page.intro}
        image={page.hero?.image}
        badge={{ title: 'One quotation for your whole list', subtitle: 'No payment required' }}
        visual={<InquiryVisual listName={listName} />}
      >
        <ReassuranceChips className="mt-7" />
      </ContactHero>

      {/* List review + form */}
      <section className="relative py-8 sm:py-12 lg:py-14" aria-labelledby="inquiry-list-heading">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-3">Step 1 · Review</Eyebrow>
              <h2 id="inquiry-list-heading" className="heading-3">
                Your {lower}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
                Check the products and quantities below. You can adjust anything before sending –
                one inquiry covers your whole list.
              </p>
              <InquiryListReview listName={listName} addLabel={labels.addLabel} className="mt-6" />
            </div>

            <div className="lg:col-span-5">
              <div
                id="inquiry-form"
                className="glass-strong glass-edge scroll-mt-28 rounded-3xl p-6 sm:p-8 lg:sticky lg:top-28"
              >
                <Eyebrow className="mb-3">Step 2 · Your details</Eyebrow>
                <h2 className="heading-3">Where should we send the quotation?</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Include your target market and any registration or packaging requirements so we
                  can quote accurately.
                </p>
                <InquiryForm
                  source="inquiry-list"
                  includeList
                  successMessage={page.formSuccessMessage ?? undefined}
                  submitLabel={labels.ctaLabel}
                  className="mt-6"
                  compact
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative scroll-mt-28 py-16 sm:py-20"
        aria-labelledby="how-it-works-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 hairline" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 dots-pattern opacity-40 fade-mask-y"
          aria-hidden="true"
        />
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="mb-4 justify-center">How it works</Eyebrow>
            <h2 id="how-it-works-heading" className="heading-2">
              From product list to quotation in three steps
            </h2>
            <p className="lead mt-4">
              No online payment, no account needed. Your inquiry goes straight to our export team,
              who confirm availability and pricing for your market.
            </p>
          </div>
          <HowItWorks className="mt-12" />
        </Container>
      </section>

      <PageSections sections={page.sections} idPrefix="inquiry-section" />

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="relative py-16 sm:py-20" aria-labelledby="inquiry-faq-heading">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 hairline"
            aria-hidden="true"
          />
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Eyebrow className="mb-4">FAQ</Eyebrow>
                <h2 id="inquiry-faq-heading" className="heading-2">
                  Questions about quotations
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-600">
                  Everything you need to know before you send your first inquiry.
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
        id="inquiry-help-cta"
        eyebrow="Need help first?"
        title="Not sure what to add? Talk to our export team."
        description="Tell us your therapeutic areas, target countries and volumes – we will suggest matching products, registration pathways and documentation."
        primary={{ label: 'Contact us', href: '/contact' }}
        secondary={{ label: 'Browse products', href: '/products' }}
      />
    </>
  )
}
