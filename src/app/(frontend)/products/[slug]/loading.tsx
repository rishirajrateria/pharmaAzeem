/** Instant skeleton for a product page. Mirrors the hero layout so nothing jumps when data streams in. */
export default function Loading() {
  return (
    <div className="container-x pt-6 sm:pt-8 lg:pt-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading product…</span>
      <div className="skeleton h-3 w-56 rounded-full" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <div className="skeleton aspect-square w-full rounded-[2rem]" />
          <div className="mt-4 flex gap-3" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 w-20 rounded-2xl" />
            ))}
          </div>
        </div>
        <div>
          <div className="flex gap-2">
            <div className="skeleton h-3 w-28 rounded-full" />
            <div className="skeleton h-5 w-10 rounded-full" />
          </div>
          <div className="skeleton mt-5 h-10 w-4/5 rounded-2xl sm:h-12" />
          <div className="skeleton mt-3 h-7 w-3/5 rounded-2xl" />
          <div className="skeleton mt-6 h-4 w-full max-w-xl rounded-full" />
          <div className="skeleton mt-2 h-4 w-5/6 max-w-xl rounded-full" />
          <div className="mt-5 flex flex-wrap gap-2" aria-hidden="true">
            <div className="skeleton h-8 w-24 rounded-full" />
            <div className="skeleton h-8 w-20 rounded-full" />
            <div className="skeleton h-8 w-28 rounded-full" />
          </div>
          <div className="glass mt-7 rounded-3xl p-5 sm:p-6">
            <div className="skeleton h-3 w-16 rounded-full" />
            <div className="skeleton mt-2 h-7 w-40 rounded-xl" />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="skeleton h-12 w-40 rounded-full" />
              <div className="skeleton h-12 flex-1 rounded-full" />
            </div>
            <div className="skeleton mt-3 h-12 w-full rounded-full" />
          </div>
          <div className="skeleton mt-8 h-3 w-24 rounded-full" />
          <div
            className="mt-3 grid gap-px overflow-hidden rounded-3xl sm:grid-cols-2"
            aria-hidden="true"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-16" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-20">
        <div className="skeleton h-3 w-32 rounded-full" />
        <div className="skeleton mt-4 h-9 w-2/3 max-w-lg rounded-2xl" />
        <div className="glass mt-8 rounded-[2rem]">
          <div className="flex gap-2 border-b border-ink-100 px-5 pt-3" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton mb-3 h-6 w-28 rounded-full" />
            ))}
          </div>
          <div className="space-y-3 p-5 sm:p-8">
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-11/12 rounded-full" />
            <div className="skeleton h-4 w-4/5 rounded-full" />
            <div className="skeleton h-4 w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
