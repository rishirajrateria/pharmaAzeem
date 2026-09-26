'use client'

import { CircleCheck, Loader2, Send } from 'lucide-react'
import { useActionState, useEffect } from 'react'

import { submitInquiry, type InquiryFormState } from '@/app/actions/inquiry'
import { useHasMounted } from '@/hooks/useHasMounted'
import { useInquiry } from '@/store/inquiry'
import { cn } from '@/lib/utils'

type Props = {
  source?: 'inquiry-list' | 'product-page' | 'contact-form'
  /** Attach the visitor's inquiry list (from the store) to the submission. */
  includeList?: boolean
  /** A single product to inquire about (product page). */
  product?: { id: number; title: string }
  successMessage?: string
  submitLabel?: string
  className?: string
  compact?: boolean
}

const initial: InquiryFormState = { ok: false }

/**
 * Inquiry / contact form. Progressive enhancement: works without JS (server action),
 * shows inline validation with JS. Clears the inquiry list on success.
 */
export function InquiryForm({
  source = 'inquiry-list',
  includeList = true,
  product,
  successMessage,
  submitLabel = 'Send inquiry',
  className,
  compact,
}: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const items = useInquiry((s) => s.items)
  const clear = useInquiry((s) => s.clear)
  const mounted = useHasMounted()

  useEffect(() => {
    if (state.ok && includeList) clear()
  }, [state.ok, includeList, clear])

  if (state.ok) {
    return (
      <div
        className={cn('glass-red rounded-3xl p-8 text-center', className)}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-600 shadow">
          <CircleCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-ink-950">Inquiry sent</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-700">
          {successMessage || 'Thank you! Our team will get back to you within one business day.'}
        </p>
      </div>
    )
  }

  const listPayload = product
    ? [{ id: product.id, title: product.title, quantity: 1 }]
    : includeList && mounted
      ? items.map((i) => ({ id: i.id, title: i.title, quantity: i.quantity }))
      : []
  const err = state.errors || {}

  return (
    <form action={action} className={cn('space-y-4', className)} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="items" value={JSON.stringify(listPayload)} />
      <input type="hidden" name="pageUrl" value={mounted ? window.location.href : ''} />

      <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
        <Field label="Full name" name="name" required error={err.name} autoComplete="name" />
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          error={err.email}
          autoComplete="email"
        />
        <Field label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" />
        <Field label="Company" name="company" autoComplete="organization" />
        <Field
          label="Country"
          name="country"
          autoComplete="country-name"
          className={compact ? '' : 'sm:col-span-2'}
        />
      </div>
      <div>
        <label htmlFor="inq-message" className="mb-1.5 block text-xs font-medium text-ink-700">
          Message {product ? `about ${product.title}` : ''}
        </label>
        <textarea
          id="inq-message"
          name="message"
          rows={compact ? 3 : 5}
          className={cn('input-glass resize-y', err.message && 'border-brand-500')}
          placeholder="Quantities, target markets, packaging requirements, registration needs…"
          aria-invalid={Boolean(err.message)}
          aria-describedby={err.message ? 'inq-message-err' : undefined}
        />
        {err.message && (
          <p id="inq-message-err" className="mt-1 text-xs text-brand-700">
            {err.message}
          </p>
        )}
      </div>
      {state.message && !state.ok && (
        <p
          className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-800"
          role="alert"
        >
          {state.message}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-ink-500">
          By submitting you agree to be contacted about your inquiry. We never share your details.
        </p>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {pending ? 'Sending…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  error,
  className,
  autoComplete,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  className?: string
  autoComplete?: string
}) {
  const id = `inq-${name}`
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink-700">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={cn('input-glass', error && 'border-brand-500')}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs text-brand-700">
          {error}
        </p>
      )}
    </div>
  )
}
