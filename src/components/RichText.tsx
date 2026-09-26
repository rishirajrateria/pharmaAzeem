import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

/** Renders Lexical rich text from the CMS with the site's typography. */
export function RichText({
  data,
  className,
}: {
  data?: SerializedEditorState | null | Record<string, unknown>
  className?: string
}) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      className={cn('prose-pharma', className)}
    />
  )
}
