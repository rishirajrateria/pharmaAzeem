'use client'

import { Check, Plus } from 'lucide-react'
import { useState } from 'react'

import { useHasMounted } from '@/hooks/useHasMounted'
import { useInquiry, type InquiryItem } from '@/store/inquiry'
import { cn } from '@/lib/utils'

type Props = {
  product: Omit<InquiryItem, 'quantity' | 'addedAt'>
  label: string
  addedLabel: string
  variant?: 'icon' | 'full'
  quantity?: number
  className?: string
}

/** "Add to inquiry list" (a.k.a. add to cart). Same component powers cards and the product page. */
export function AddToInquiryButton({
  product,
  label,
  addedLabel,
  variant = 'full',
  quantity = 1,
  className,
}: Props) {
  const add = useInquiry((s) => s.add)
  const inList = useInquiry((s) => s.items.some((i) => i.id === product.id))
  const mounted = useHasMounted()
  const [justAdded, setJustAdded] = useState(false)
  const added = mounted && (inList || justAdded)

  const onClick = () => {
    add({ ...product, quantity })
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1800)
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300',
          added
            ? 'bg-emerald-500 text-white shadow-[0_8px_20px_-8px_rgb(16_185_129_/_0.8)]'
            : 'bg-brand-gradient text-white shadow-[0_8px_20px_-8px_rgb(225_29_46_/_0.8)] hover:scale-105',
          className,
        )}
        aria-label={added ? addedLabel : `${label}: ${product.title}`}
        title={added ? addedLabel : label}
      >
        {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(added ? 'btn-secondary' : 'btn-primary', 'w-full sm:w-auto', className)}
      aria-live="polite"
    >
      {added ? <Check className="h-4 w-4 text-emerald-600" /> : <Plus className="h-4 w-4" />}
      {added ? addedLabel : label}
    </button>
  )
}
