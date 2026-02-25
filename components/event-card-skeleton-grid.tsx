import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonCard = () => (
  <div className="relative flex flex-col h-full rounded-xl border border-[rgba(0,0,0,0.07)] bg-white overflow-hidden">
    {/* Header band skeleton */}
    <div className="h-10 bg-slate-100 flex items-center justify-between px-3 flex-shrink-0">
      <Skeleton className="h-5 w-10 rounded-full bg-slate-200" />
      <Skeleton className="h-5 w-14 rounded-full bg-slate-200" />
    </div>

    {/* Body skeleton */}
    <div className="flex-1 p-4 pl-5 flex flex-col gap-2.5 min-h-[140px]">
      {/* Category pill */}
      <Skeleton className="h-5 w-20 rounded-full bg-muted" />

      {/* Two-line title */}
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-3/4 bg-muted" />
      </div>

      {/* Detail rows */}
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-sm bg-muted" />
          <Skeleton className="h-3 w-36 bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-sm bg-muted" />
          <Skeleton className="h-3 w-24 bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 9 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
