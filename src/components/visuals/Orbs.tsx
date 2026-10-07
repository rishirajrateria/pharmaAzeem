import { cn } from '@/lib/utils'

/**
 * Soft floating gradient orbs — the signature ambient background.
 * Pure CSS radial gradients (no blur filters) so they are cheap to composite.
 */
export function Orbs({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'intense' | 'subtle'
}) {
  const o = variant === 'intense' ? 1 : variant === 'subtle' ? 0.5 : 0.75
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div
        className="absolute -left-32 -top-40 h-[42rem] w-[42rem] animate-float-slow"
        style={{
          background: `radial-gradient(closest-side, rgb(255 102 117 / ${0.35 * o}), transparent 70%)`,
        }}
      />
      <div
        className="absolute -right-40 top-10 h-[36rem] w-[36rem] animate-float"
        style={{
          background: `radial-gradient(closest-side, rgb(225 29 46 / ${0.22 * o}), transparent 70%)`,
          animationDelay: '-4s',
        }}
      />
      <div
        className="absolute left-1/3 -bottom-48 h-[40rem] w-[40rem] animate-float-slow"
        style={{
          background: `radial-gradient(closest-side, rgb(255 199 205 / ${0.6 * o}), transparent 70%)`,
          animationDelay: '-8s',
        }}
      />
    </div>
  )
}
