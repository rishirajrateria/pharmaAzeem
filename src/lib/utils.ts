import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Media } from '@/payload-types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export const absUrl = (path = '/') => {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export type MediaSize = 'thumbnail' | 'card' | 'large' | 'og'

/** Returns the (relative) URL for a Payload media document at a given size, falling back to the original. */
export const mediaUrl = (media: Media | number | string | null | undefined, size?: MediaSize): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  if (size) {
    const s = media.sizes?.[size]
    if (s?.url) return s.url
  }
  return media.url ?? undefined
}

export const mediaAlt = (media: Media | number | string | null | undefined, fallback = ''): string =>
  media && typeof media === 'object' ? media.alt || fallback : fallback

export const mediaDims = (media: Media | number | string | null | undefined, size?: MediaSize) => {
  if (!media || typeof media !== 'object') return { width: undefined, height: undefined }
  if (size) {
    const s = media.sizes?.[size]
    if (s?.width && s?.height) return { width: s.width, height: s.height }
  }
  return { width: media.width ?? undefined, height: media.height ?? undefined }
}

export const truncate = (text: string | null | undefined, max = 160) => {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

/** Converts a Lexical rich text document into plain text (for meta descriptions, llms.txt, JSON-LD). */
export const richTextToPlain = (doc: unknown): string => {
  if (!doc || typeof doc !== 'object') return ''
  const out: string[] = []
  type LexNode = { text?: unknown; type?: unknown; children?: unknown }
  const walk = (node: LexNode | null | undefined) => {
    if (!node) return
    if (typeof node.text === 'string') out.push(node.text)
    if (Array.isArray(node.children)) {
      node.children.forEach((c) => walk(c as LexNode))
      if (typeof node.type === 'string' && ['paragraph', 'heading', 'listitem', 'quote'].includes(node.type)) out.push('\n')
    }
  }
  walk(((doc as { root?: LexNode }).root ?? doc) as LexNode)
  return out.join('').replace(/\n{2,}/g, '\n').trim()
}

export const formatDate = (value: string | null | undefined, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }) => {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('en-GB', opts).format(new Date(value))
  } catch {
    return ''
  }
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase())

/** Returns the id from a relationship value (populated doc or raw id). */
export const relId = (v: unknown): number | undefined => {
  if (v && typeof v === 'object' && 'id' in v && typeof (v as { id: unknown }).id === 'number') return (v as { id: number }).id
  if (typeof v === 'number') return v
  return undefined
}
