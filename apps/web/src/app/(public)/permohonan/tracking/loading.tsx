import { Skeleton } from '@ppid/ui'

export default function TrackingLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-80" />
        <Skeleton className="mx-auto h-5 w-96" />
      </div>
      <div className="rounded-lg border p-8">
        <Skeleton className="mb-4 h-12 w-full max-w-md mx-auto" />
        <Skeleton className="h-10 w-full max-w-md mx-auto" />
      </div>
    </div>
  )
}
