import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { Homepage } from '@/payload-types'

import { FaqAccordion } from '../FaqAccordion'
import { Container, SectionHeading } from '../ui'
import { Reveal } from '../ui/Reveal'

/** FAQ section – the accordion emits FAQPage JSON-LD itself. */
export function HomeFaq({ faqs }: { faqs?: Homepage['faqs'] }) {
  if (!faqs?.length) return null
  return (
    <section aria-label="Frequently asked questions" className="relative pb-16 sm:pb-20 lg:pb-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow="FAQ"
                title="Frequently asked questions"
                description="Straight answers on export markets, minimum order quantities, registration support and how to get a quotation."
              />
              <p className="mt-6 text-sm text-ink-600">
                Can&apos;t find what you need?{' '}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline"
                >
                  Talk to our export team <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>
          <Reveal className="lg:col-span-7">
            <FaqAccordion faqs={faqs} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
