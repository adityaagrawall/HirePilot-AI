import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/60",
        className
      )}
    />
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Score cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>

      {/* Keywords */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Lists */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="flex items-start gap-2">
              <Skeleton className="h-4 w-4 mt-0.5 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
