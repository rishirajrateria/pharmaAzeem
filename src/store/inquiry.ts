'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * The inquiry list (a.k.a. cart). Stored in localStorage so it survives reloads.
 * The shape mirrors a shopping cart line item so a future checkout can reuse it as-is.
 */
export type InquiryItem = {
  id: number
  slug: string
  title: string
  genericName?: string
  strength?: string
  dosageForm?: string
  image?: string
  quantity: number
  addedAt: number
}

type InquiryState = {
  items: InquiryItem[]
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  add: (item: Omit<InquiryItem, 'quantity' | 'addedAt'> & { quantity?: number }) => void
  remove: (id: number) => void
  setQuantity: (id: number, quantity: number) => void
  clear: () => void
  has: (id: number) => boolean
}

export const useInquiry = create<InquiryState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i,
              ),
              isOpen: true,
            }
          }
          return {
            items: [...s.items, { ...item, quantity: item.quantity ?? 1, addedAt: Date.now() }],
            isOpen: true,
          }
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, Math.floor(quantity) || 1) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'pharmadent-inquiry-list',
      version: 1,
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

/** Total number of line items. */
export const useInquiryCount = () => useInquiry((s) => s.items.length)
