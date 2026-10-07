'use client'

import { Pause, Play } from 'lucide-react'
import { useState } from 'react'

/** Pause/resume control for the auto-scrolling certification strip (WCAG 2.2.2). */
export function MarqueePause({ targetId }: { targetId: string }) {
  const [paused, setPaused] = useState(false)
  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-controls={targetId}
      onClick={() => {
        const next = !paused
        setPaused(next)
        document.getElementById(targetId)?.setAttribute('data-paused', String(next))
      }}
      className="inline-flex h-9 w-9 items-center justify-center glass text-ink-700 hover:text-brand-700"
      title={paused ? 'Resume scrolling' : 'Pause scrolling'}
    >
      {paused ? (
        <Play className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Pause className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">{paused ? 'Resume scrolling' : 'Pause scrolling'}</span>
    </button>
  )
}
