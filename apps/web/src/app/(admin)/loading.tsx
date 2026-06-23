import { Skeleton } from '@ppid/ui'

export default function AdminLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
