import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * On-demand ISR revalidation. Pages are statically generated and cached; whenever
 * content changes in the admin panel we purge the affected paths so the public site
 * updates within seconds without a redeploy.
 *
 * Safe to call outside of Next (e.g. from the seed script) – failures are swallowed.
 */
async function revalidate(paths: string[], layout = false) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const p of paths) revalidatePath(p, layout ? 'layout' : 'page')
    // Always refresh the machine-readable endpoints.
    revalidatePath('/sitemap.xml')
    revalidatePath('/llms.txt')
    revalidatePath('/llms-full.txt')
  } catch {
    // Not running inside Next.js (seed script / CLI) – nothing to do.
  }
}

type PathResolver = (doc: any, previousDoc?: any) => string[]

/** Collection hooks that revalidate the document's own pages plus listing pages. */
export const revalidateCollection = (resolve: PathResolver, layoutWide = false) => {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
    if (req.context?.disableRevalidate) return doc
    await revalidate(resolve(doc, previousDoc), layoutWide)
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc
    await revalidate(resolve(doc), layoutWide)
    return doc
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

/** Global hooks – globals (settings, page copy) affect every page, so purge the whole layout. */
export const revalidateGlobal = (paths: string[] = ['/']) => {
  const afterChange: GlobalAfterChangeHook = async ({ doc, req }) => {
    if (req.context?.disableRevalidate) return doc
    await revalidate(paths, true)
    return doc
  }
  return { afterChange: [afterChange] }
}
