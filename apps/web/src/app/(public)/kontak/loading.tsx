import { Skeleton } from '@ppid/ui'

export default function KontakLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-80" />
        <Skeleton className="mx-auto h-5 w-96" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Skeleton className="mb-4 h-8 w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="mb-3 h-16 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
