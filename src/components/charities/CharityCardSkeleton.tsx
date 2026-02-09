import { Skeleton } from "@/components/ui/skeleton";

export function CharityCardSkeleton() {
  return (
    <div className="h-full rounded-2xl p-5 relative overflow-hidden bg-white/15 backdrop-blur-xl border border-white/20">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-14 h-14 rounded-xl bg-white/20" />
        <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
      </div>

      <Skeleton className="h-5 w-3/4 rounded bg-white/20 mb-2" />

      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-5 w-24 rounded-full bg-white/20" />
      </div>

      <div className="flex items-center gap-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded bg-white/15" />
        ))}
        <Skeleton className="h-4 w-8 rounded bg-white/15 ml-1" />
      </div>

      <div className="mt-3 space-y-1.5">
        <Skeleton className="h-3.5 w-full rounded bg-white/15" />
        <Skeleton className="h-3.5 w-4/5 rounded bg-white/15" />
      </div>
    </div>
  );
}

export function CharityGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <CharityCardSkeleton key={i} />
      ))}
    </div>
  );
}
