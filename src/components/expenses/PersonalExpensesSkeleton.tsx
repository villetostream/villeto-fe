"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PersonalExpensesSkeleton({ 
  statsCount = 4,
  showStats = true 
}: { 
  statsCount?: number;
  showStats?: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      {showStats && (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${statsCount} gap-1.5`}>
          {Array.from({ length: statsCount }).map((_, i) => (
            <div key={i} className="p-1 border border-muted rounded-xl bg-white space-y-1">
              <div className="flex items-center justify-between border border-muted rounded-lg p-3 pb-[.6rem]">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="p-2.5 px-3 border border-muted rounded">
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b p-4 flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <div key={rowIdx} className="border-b p-4 flex gap-4">
              {Array.from({ length: 6 }).map((_, colIdx) => (
                <Skeleton key={colIdx} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
