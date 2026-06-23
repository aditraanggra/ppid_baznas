import { Skeleton } from '@ppid/ui'

export default function ProfilLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-4 h-8 w-64" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
