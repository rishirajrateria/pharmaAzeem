'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export type InquiryFormState = { ok: boolean; message?: string; errors?: Record<string, string> }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Creates an Inquiry document from the inquiry page, product page or contact form.
 * Runs on the server only – no API keys or DB access are exposed to the browser.
 */
export async function submitInquiry(_prev: InquiryFormState, formData: FormData): Promise<InquiryFormState> {
  // Honeypot – bots fill every field.
  if (formData.get('website')) return { ok: true, message: 'Thank you!' }

  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const company = String(formData.get('company') || '').trim()
  const country = String(formData.get('country') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const source = (String(formData.get('source') || 'inquiry-list') as 'inquiry-list' | 'product-page' | 'contact-form')
  const pageUrl = String(formData.get('pageUrl') || '').slice(0, 500)

  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (message.length > 4000) errors.message = 'Message is too long.'

  let items: { product?: number; productName?: string; quantity?: number }[] = []
  try {
    const raw = String(formData.get('items') || '[]')
    const parsed = JSON.parse(raw) as { id?: number; title?: string; quantity?: number }[]
    if (Array.isArray(parsed)) {
      items = parsed.slice(0, 100).map((i) => ({
        product: typeof i.id === 'number' ? i.id : undefined,
        productName: String(i.title || '').slice(0, 200),
        quantity: Math.max(1, Math.min(1_000_000, Number(i.quantity) || 1)),
      }))
    }
  } catch {
    items = []
  }

  if (source !== 'contact-form' && items.length === 0 && message.length < 5) {
    errors.message = 'Tell us which products you are interested in.'
  }
  if (Object.keys(errors).length) return { ok: false, errors, message: 'Please fix the highlighted fields.' }

  try {
    const payload = await getPayloadClient()
    const h = await headers()
    await payload.create({
      collection: 'inquiries',
      data: { name, email, phone, company, country, message, source, items, pageUrl: pageUrl || h.get('referer') || '' },
      overrideAccess: true,
    })
    return { ok: true }
  } catch (err) {
    console.error('submitInquiry failed', err)
    return { ok: false, message: 'Something went wrong while sending your inquiry. Please try again or email us directly.' }
  }
}
