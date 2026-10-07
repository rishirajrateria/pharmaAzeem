import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

/** Bundled brand lockup ("R" mark + wordmark), transparent PNG at 960×252. */
const BRAND_LOGO = { red: '/brand/pharmadent-logo.png', white: '/brand/pharmadent-logo-white.png' }
const RATIO = 960 / 252

/**
 * Site logo. Uses the logo uploaded in Site Settings when there is one, otherwise the bundled
 * Pharmadent Remedies lockup. `invert` switches to the white version for dark backgrounds.
 */
export function Logo({
  siteName,
  logo,
  className,
  invert,
  imgClassName = 'h-10',
}: {
  siteName: string
  /** Kept for API compatibility – the lockup already carries the brand name. */
  tagline?: string | null
  logo?: string
  className?: string
  invert?: boolean
  /** Height utility for the image, e.g. `h-9 lg:h-12`; width follows the aspect ratio. */
  imgClassName?: string
}) {
  const src = logo || (invert ? BRAND_LOGO.white : BRAND_LOGO.red)
  return (
    <Link
      href="/"
      className={cn('flex shrink-0 items-center', className)}
      aria-label={`${siteName} – home`}
    >
      <Image
        src={src}
        alt={siteName}
        width={Math.round(48 * RATIO)}
        height={48}
        priority
        unoptimized={Boolean(logo)}
        className={cn('w-auto', imgClassName)}
      />
    </Link>
  )
}
