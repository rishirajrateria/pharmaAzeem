import { Plus } from 'lucide-react'

import { faqJsonLd } from '@/lib/seo'
import { cn } from '@/lib/utils'

import { JsonLd } from './seo/JsonLd'

type Faq = { question: string; answer: string; id?: string | null }

/**
 * Native <details> accordion (no JS, crawlable, accessible) + FAQPage JSON-LD.
 */
export function FaqAccordion({
  faqs,
  className,
  withJsonLd = true,
}: {
  faqs?: Faq[] | null
  className?: string
  withJsonLd?: boolean
}) {
  if (!faqs?.length) return null
  const ld = withJsonLd ? faqJsonLd(faqs) : null
  return (
    <div className={cn('space-y-3', className)}>
      {ld && <JsonLd data={{ '@context': 'https://schema.org', ...ld }} />}
      {faqs.map((f, i) => (
        <details key={f.id || i} className="group glass open:glass-strong" name="faq">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink-950 sm:px-6">
            <span>{f.question}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-brand-200 bg-white text-brand-600 transition-transform duration-300 group-open:rotate-45">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-ink-600 sm:px-6">{f.answer}</div>
        </details>
      ))}
    </div>
  )
}
