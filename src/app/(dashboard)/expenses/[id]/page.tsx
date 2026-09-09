"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const expenseId = params.id;

  // Real API integration pending.
  // Previously relied on mock-data and localStorage.

  return (
    <div className="w-full space-y-6 p-6">
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Expense not found
        </h1>
        <p className="text-muted-foreground mb-4">
          The expense you&apos;re looking for doesn&apos;t exist or could not be loaded.
        </p>
      </div>
    </div>
  );
};

export default Page;
