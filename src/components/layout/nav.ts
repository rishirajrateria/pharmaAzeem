import type { CategoryNode } from '@/lib/data'

/** Slim, serialisable navigation tree passed to client components. */
export type NavCategory = {
  id: number
  title: string
  path: string
  icon?: string | null
  count: number
  description?: string | null
  children: NavCategory[]
}

export const toNav = (nodes: CategoryNode[], depth = 0): NavCategory[] =>
  nodes.map((n) => ({
    id: n.id,
    title: n.title,
    path: `/categories/${n.path}`,
    icon: n.icon,
    count: n.productCount,
    description: n.shortDescription,
    children: depth < 1 ? toNav(n.children, depth + 1) : [],
  }))

export const PRIMARY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'Quality', href: '/quality' },
  { label: 'Global presence', href: '/global-presence' },
  { label: 'Licenses', href: '/licenses' },
  { label: 'Contact', href: '/contact' },
]
