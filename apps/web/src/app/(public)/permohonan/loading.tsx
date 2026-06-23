import { Skeleton } from '@ppid/ui'

export default function PermohonanLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-80" />
        <Skeleton className="mx-auto h-5 w-96" />
      </div>
      <Skeleton className="mb-4 h-2 w-full" />
      <div className="rounded-lg border p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-6">
            <Skeleton className="mb-2 h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="mt-8 h-12 w-full" />
      </div>
    </div>
  )
}
