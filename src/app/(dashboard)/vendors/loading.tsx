import { Skeleton } from "@/components/ui/skeleton";
import { PersonalExpensesSkeleton } from "@/components/expenses/PersonalExpensesSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <PersonalExpensesSkeleton statsCount={4} />

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-lg" />
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        {/* Table rows */}
        <div className="rounded-xl border border-border overflow-hidden">
          <Skeleton className="h-11 w-full rounded-none" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-none border-t border-border/40" />
          ))}
        </div>
      </div>
    </div>
  );
}