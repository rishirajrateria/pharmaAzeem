'use client'

import { ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

/**
 * Route-level error boundary for the public site. Renders inside the root layout
 * (header/footer stay visible) and offers a retry that re-renders the segment.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-[70vh] items-center section-y" aria-labelledby="error-title">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Something went wrong</p>
          <h1 id="error-title" className="display-2 mt-4">
            We hit an unexpected error
          </h1>
          <p className="lead mx-auto mt-4 max-w-xl">
            This is on our side, not yours. Please try again in a moment – if it keeps happening,
            our team is one message away and will help you find the product or information you need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={reset} className="btn-primary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
            </button>
            <Link href="/" className="btn-secondary">
              Back to home <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Contact support
            </Link>
          </div>
          {error.digest && (
            <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink-400">
              Reference <span className="text-ink-600">{error.digest}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
