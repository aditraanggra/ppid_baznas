import { Skeleton } from '@ppid/ui'

export default function DownloadLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="mb-8">
        <Skeleton className="mb-4 h-10 w-full max-w-sm" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  )
}
