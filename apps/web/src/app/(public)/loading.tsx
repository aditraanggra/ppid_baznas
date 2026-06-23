import { Skeleton } from '@ppid/ui'

export default function PublicLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-20">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-12 w-3/4 md:h-16 lg:h-20" />
          <Skeleton className="h-6 w-2/3 md:h-7" />
        </div>
      </div>
      <div className="mb-20">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
