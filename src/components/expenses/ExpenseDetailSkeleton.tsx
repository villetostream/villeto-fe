"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-8 w-64 mb-4" />

          {/* Report Info */}
          <div className="flex items-center gap-6 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* View Split Expense Link */}
          <Skeleton className="h-4 w-48 mb-6" />
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <Skeleton className="h-4 w-24 mb-2 ml-auto" />
          <Skeleton className="h-8 w-32 ml-auto" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex gap-8 items-start">
        {/* Left Side - Expense Details */}
        <div className="flex-1 space-y-6">
          {/* Expense Information Cards */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`bg-gray-50 rounded-lg p-4 ${i === 4 ? "col-span-2" : ""}`}
              >
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>

          {/* Expense Timeline */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CO's Note */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        {/* Right Side - Receipt */}
        <div className="w-80 shrink-0">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
