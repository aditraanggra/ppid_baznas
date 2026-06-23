import { Skeleton } from '@ppid/ui'

export default function InformasiPublikLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <Skeleton className="mb-3 h-12 w-96" />
        <Skeleton className="h-6 w-[32rem]" />
      </div>

      <div className="mb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <Skeleton className="mb-4 h-12 w-12 rounded-lg" />
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-full md:max-w-md" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-md" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-11 w-11 flex-shrink-0 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-5 w-3/4" />
              <Skeleton className="mb-3 h-4 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-10 w-10 flex-shrink-0 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
