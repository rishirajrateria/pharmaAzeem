import Link from 'next/link'
import { useId } from 'react'

import { cn } from '@/lib/utils'

/** Brand mark: a glass capsule with a red gradient — SVG so it is crisp at any size and needs no image request. */
export function LogoMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const a = `lg-a-${uid}`
  const b = `lg-b-${uid}`
  return (
    <svg viewBox="0 0 40 40" className={cn('h-9 w-9', className)} aria-hidden="true">
      <defs>
        <linearGradient id={a} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bd1225" />
          <stop offset="55%" stopColor="#e11d2e" />
          <stop offset="100%" stopColor="#ff6675" />
        </linearGradient>
        <linearGradient id={b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill={`url(#${a})`} />
      <rect x="2.5" y="2.5" width="35" height="17" rx="10" fill={`url(#${b})`} opacity="0.35" />
      <g transform="rotate(-45 20 20)">
        <rect x="8" y="14.5" width="24" height="11" rx="5.5" fill="#fff" />
        <rect x="8" y="14.5" width="12" height="11" rx="5.5" fill="#fff" opacity="0.5" />
        <line
          x1="20"
          y1="14.5"
          x2="20"
          y2="25.5"
          stroke="#e11d2e"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  )
}

export function Logo({
  siteName,
  tagline,
  logo,
  className,
  invert,
}: {
  siteName: string
  tagline?: string | null
  logo?: string
  className?: string
  invert?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-3', className)}
      aria-label={`${siteName} – home`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={siteName} className="h-9 w-auto" width={120} height={36} />
      ) : (
        <LogoMark className="transition-transform duration-500 group-hover:rotate-[-8deg]" />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'whitespace-nowrap text-[15px] font-semibold tracking-tight sm:text-[17px]',
            invert ? 'text-white' : 'text-ink-950',
          )}
        >
          {siteName}
        </span>
        {tagline && (
          <span
            className={cn(
              'mt-1 hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] sm:block',
              invert ? 'text-white/60' : 'text-ink-500',
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
