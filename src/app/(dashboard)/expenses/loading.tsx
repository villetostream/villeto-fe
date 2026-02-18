import { PersonalExpensesSkeleton } from "@/components/expenses/PersonalExpensesSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Outer Tabs Shell Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="flex bg-muted/50 p-1 h-11 rounded-lg w-fit gap-1">
          <Skeleton className="h-full w-44 rounded-md" />
          <Skeleton className="h-full w-44 rounded-md" />
        </div>
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>

      <PersonalExpensesSkeleton />
    </div>
  );
}
