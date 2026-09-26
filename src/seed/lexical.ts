/**
 * Tiny Markdown → Lexical converter for seed content.
 * Supports: "## Heading", "### Heading", "- bullet", "1. numbered", blank-line separated paragraphs, **bold**.
 */
type TextNode = {
  type: 'text'
  text: string
  format: number
  style: string
  mode: 'normal'
  detail: number
  version: 1
}
type Node = Record<string, unknown>

const text = (t: string, format = 0): TextNode => ({
  type: 'text',
  text: t,
  format,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const inline = (line: string): TextNode[] => {
  const parts = line.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).filter(Boolean)
  return parts.map((p) =>
    p.startsWith('**') && p.endsWith('**')
      ? text(p.slice(2, -2), 1)
      : p.length > 2 && p.startsWith('*') && p.endsWith('*')
        ? text(p.slice(1, -1), 2)
        : text(p),
  )
}

const block = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children,
  ...extra,
})

export const md = (source: string): any => {
  const lines = source.trim().split('\n')
  const children: Node[] = []
  let para: string[] = []
  let list: { type: 'bullet' | 'number'; items: string[] } | null = null

  const flushPara = () => {
    if (para.length) {
      children.push(block('paragraph', inline(para.join(' ')), { textFormat: 0, textStyle: '' }))
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      children.push(
        block(
          'list',
          list.items.map((it, i) => block('listitem', inline(it), { value: i + 1 })),
          { listType: list.type, tag: list.type === 'bullet' ? 'ul' : 'ol', start: 1 },
        ),
      )
      list = null
    }
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flushPara()
      flushList()
      continue
    }
    const h = /^(#{2,4})\s+(.*)$/.exec(line)
    if (h) {
      flushPara()
      flushList()
      children.push(block('heading', inline(h[2]), { tag: `h${h[1].length}` }))
      continue
    }
    const b = /^[-*]\s+(.*)$/.exec(line)
    if (b) {
      flushPara()
      if (!list || list.type !== 'bullet') {
        flushList()
        list = { type: 'bullet', items: [] }
      }
      list.items.push(b[1])
      continue
    }
    const n = /^\d+[.)]\s+(.*)$/.exec(line)
    if (n) {
      flushPara()
      if (!list || list.type !== 'number') {
        flushList()
        list = { type: 'number', items: [] }
      }
      list.items.push(n[1])
      continue
    }
    flushList()
    para.push(line)
  }
  flushPara()
  flushList()

  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}
