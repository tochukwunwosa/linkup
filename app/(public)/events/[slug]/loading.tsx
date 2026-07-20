import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f5f4f2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Skeleton className="h-4 w-36 mb-6" />

        {/* Gradient banner skeleton */}
        <Skeleton className="w-full h-44 rounded-2xl mb-6" />

        {/* Two-column grid */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6 lg:items-start">
          {/* Sidebar skeleton */}
          <div className="mb-6 lg:mb-0 lg:col-start-2 lg:row-start-1">
            <div className="rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <Skeleton className="h-1.5 w-full rounded-none" />
              <div className="p-5 flex flex-col gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-2.5 w-12 mb-1.5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="h-px bg-[rgba(0,0,0,0.06)]" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Description skeleton */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6 sm:p-8">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Share row skeleton */}
        <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.07)] flex gap-3">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-10 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>
    </main>
  );
}
