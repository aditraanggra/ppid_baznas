import { Skeleton } from '@ppid/ui'

export default function PengumumanDetailLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Skeleton className="mb-4 h-10 w-3/4" />
      <div className="mb-8 flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <Skeleton className="mt-8 h-96 w-full" />
    </div>
  )
}
