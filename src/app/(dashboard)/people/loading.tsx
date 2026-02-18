import { PersonalExpensesSkeleton } from "@/components/expenses/PersonalExpensesSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* People Page Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-11 w-44 rounded-lg" />
      </div>

      <PersonalExpensesSkeleton statsCount={5} />
    </div>
  );
}
