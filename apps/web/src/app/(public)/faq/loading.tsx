import { Skeleton } from '@ppid/ui'

export default function FaqLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-80" />
        <Skeleton className="mx-auto h-5 w-96" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
