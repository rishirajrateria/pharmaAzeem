/** Instant skeleton shown while a catalogue / product page streams in. Pure CSS shimmer, no JS. */
export default function Loading() {
  return (
    <div className="container-x pt-6 sm:pt-8 lg:pt-12" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading products…</span>
      <div className="skeleton h-3 w-40 rounded-full" />
      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton mt-5 h-10 w-4/5 rounded-2xl sm:h-12" />
          <div className="skeleton mt-3 h-10 w-3/5 rounded-2xl sm:h-12" />
          <div className="skeleton mt-6 h-4 w-full max-w-xl rounded-full" />
          <div className="skeleton mt-2 h-4 w-5/6 max-w-xl rounded-full" />
          <div className="mt-7 flex flex-wrap gap-2.5">
            <div className="skeleton h-9 w-32 rounded-full" />
            <div className="skeleton h-9 w-40 rounded-full" />
            <div className="skeleton h-9 w-28 rounded-full" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="skeleton aspect-[5/4] w-full rounded-[2rem]" />
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <div className="hidden lg:block">
          <div className="skeleton h-[32rem] rounded-3xl" />
        </div>
        <div>
          <div className="skeleton h-24 rounded-3xl" />
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="glass overflow-hidden rounded-3xl">
                <div className="skeleton aspect-square w-full" />
                <div className="space-y-2 p-4 sm:p-5">
                  <div className="skeleton h-3 w-1/3 rounded-full" />
                  <div className="skeleton h-4 w-3/4 rounded-full" />
                  <div className="skeleton h-3 w-1/2 rounded-full" />
                  <div className="flex justify-between pt-3">
                    <div className="skeleton h-3 w-1/3 rounded-full" />
                    <div className="skeleton h-9 w-9 rounded-full" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
