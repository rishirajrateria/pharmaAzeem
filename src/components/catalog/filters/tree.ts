import type { CategoryNode } from '@/lib/data'

/** Depth-first lookup of a node in the category tree. */
export function findNode(nodes: CategoryNode[], id: number): CategoryNode | null {
  for (const n of nodes) {
    if (n.id === id) return n
    const hit = findNode(n.children, id)
    if (hit) return hit
  }
  return null
}

/** Total nodes below the roots (every sub-category, at any depth). */
export function countDescendants(nodes: CategoryNode[]): number {
  return nodes.reduce((sum, n) => sum + n.children.length + countDescendants(n.children), 0)
}

/** Flattens the tree in display order. */
export function flatten(nodes: CategoryNode[], depth = 0): (CategoryNode & { depth: number })[] {
  return nodes.flatMap((n) => [{ ...n, depth }, ...flatten(n.children, depth + 1)])
}

/** Joins a list in prose: "tablets, capsules and syrups". */
export function joinProse(items: string[], max = 4) {
  const list = items.slice(0, max)
  if (list.length <= 1) return list.join('')
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}
