import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* ---------- Layout primitives ---------- */

export const Container = ({ className, ...p }: ComponentProps<'div'>) => (
  <div className={cn('container-x', className)} {...p} />
)

export const Section = ({ className, children, ...p }: ComponentProps<'section'>) => (
  <section className={cn('relative section-y', className)} {...p}>
    {children}
  </section>
)

export const Eyebrow = ({ className, children, ...p }: ComponentProps<'p'>) => (
  <p className={cn('eyebrow', className)} {...p}>
    {children}
  </p>
)

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
  titleClassName,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  titleClassName?: string
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <Eyebrow className={cn('mb-4', align === 'center' && 'justify-center')}>{eyebrow}</Eyebrow>
      )}
      <Tag className={cn(Tag === 'h1' ? 'display-2' : 'heading-2', titleClassName)}>{title}</Tag>
      {description && <p className="mt-4 lead">{description}</p>}
    </div>
  )
}

/* ---------- Glass card ---------- */

export const GlassCard = ({ className, ...p }: ComponentProps<'div'>) => (
  <div className={cn('glass-card p-6 sm:p-8', className)} {...p} />
)

/* ---------- Buttons ---------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'light' | 'outline-light'
const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  dark: 'btn-dark',
  /** White button for use on a solid brand-700 (or dark) band. */
  light: 'btn bg-white text-brand-700 hover:bg-ink-50',
  /** Outlined white button – secondary action on a solid brand-700 (or dark) band. */
  'outline-light': 'btn border border-white/60 text-white hover:bg-white/10',
}

type ButtonProps = {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
} & Omit<ComponentProps<'button'>, 'ref'>

const sizeClass = { sm: 'px-4 py-2 text-xs', md: '', lg: 'px-8 py-4 text-base' }

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  className,
  children,
  ...p
}: ButtonProps) {
  const cls = cn(variantClass[variant], sizeClass[size], className)
  if (href) {
    if (external || /^https?:|^mailto:|^tel:/.test(href)) {
      return (
        <a
          href={href}
          className={cls}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...p}>
      {children}
    </button>
  )
}

/* ---------- Badges / chips ---------- */

export const Chip = ({ className, ...p }: ComponentProps<'span'>) => (
  <span className={cn('chip', className)} {...p} />
)

export const Badge = ({
  className,
  tone = 'brand',
  ...p
}: ComponentProps<'span'> & { tone?: 'brand' | 'ink' | 'success' | 'glass' }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
      tone === 'brand' && 'bg-brand-gradient text-white',
      tone === 'ink' && 'bg-ink-950 text-white',
      tone === 'success' && 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
      tone === 'glass' && 'glass text-ink-800',
      className,
    )}
    {...p}
  />
)

/* ---------- Misc ---------- */

export const Hairline = ({ className }: { className?: string }) => (
  <div className={cn('hairline w-full', className)} aria-hidden="true" />
)

export const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="glass px-1.5 py-0.5 text-[10px] text-ink-500">{children}</kbd>
)
