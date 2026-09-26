/**
 * Wraps the `highlight` substring of a heading in a red gradient span.
 * Case-insensitive; falls back to plain text when the substring is not found.
 */
export function Highlight({ text, highlight }: { text: string; highlight?: string | null }) {
  const needle = highlight?.trim()
  if (!needle) return <>{text}</>
  const idx = text.toLowerCase().indexOf(needle.toLowerCase())
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-gradient">{text.slice(idx, idx + needle.length)}</span>
      {text.slice(idx + needle.length)}
    </>
  )
}
