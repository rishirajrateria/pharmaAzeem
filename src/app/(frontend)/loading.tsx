/**
 * Instant route-level skeleton shown while a page streams in.
 * Pure CSS shimmer (`skeleton` utility) – no JavaScript, no layout shift once content lands.
 */
export default function Loading() {
  return (
    <div className="container-x pt-6 sm:pt-8 lg:pt-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* Breadcrumb */}
      <div className="skeleton h-3 w-44 rounded-full" />

      {/* Hero */}
      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton mt-6 h-10 w-11/12 rounded-2xl sm:h-12 lg:h-14" />
          <div className="skeleton mt-3 h-10 w-3/4 rounded-2xl sm:h-12 lg:h-14" />
          <div className="skeleton mt-7 h-4 w-full max-w-2xl rounded-full" />
          <div className="skeleton mt-2.5 h-4 w-11/12 max-w-2xl rounded-full" />
          <div className="skeleton mt-2.5 h-4 w-2/3 max-w-2xl rounded-full" />
          <div className="mt-9 flex flex-wrap gap-3">
            <div className="skeleton h-11 w-40 rounded-full" />
            <div className="skeleton h-11 w-36 rounded-full" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="glass rounded-[2rem] p-3">
            <div className="skeleton aspect-[4/3] w-full rounded-[1.5rem]" />
          </div>
          <div className="glass absolute -bottom-4 left-4 h-14 w-40 rounded-2xl" aria-hidden="true" />
        </div>
      </div>

      {/* Stat chips */}
      <div className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-3xl px-5 py-6">
            <div className="skeleton h-8 w-20 rounded-xl" />
            <div className="skeleton mt-3 h-3 w-28 rounded-full" />
          </div>
        ))}
      </div>

      {/* Card grid */}
      <div className="mt-20 pb-24">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton mt-4 h-8 w-72 max-w-full rounded-2xl" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass overflow-hidden rounded-3xl">
              <div className="skeleton aspect-[16/10] w-full" />
              <div className="space-y-2.5 p-5">
                <div className="skeleton h-3 w-1/3 rounded-full" />
                <div className="skeleton h-4 w-3/4 rounded-full" />
                <div className="skeleton h-3 w-full rounded-full" />
                <div className="skeleton h-3 w-5/6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
