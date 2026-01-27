"use client";

import type { PersonalExpenseStatus } from "@/components/expenses/table/personalColumns";

interface CONoteProps {
  status: PersonalExpenseStatus;
}

const getNoteContent = (status: PersonalExpenseStatus): string => {
  switch (status) {
    case "approved":
    case "paid":
      return "Reviewed and confirmed that the expense aligns with company policy and budget allocation. Approved for processing.";
    case "rejected":
    case "declined":
      return "Reviewed and confirmed that the expense do not align with company policy and budget allocation. Rejected for processing.";
    case "pending":
      return "Expense is currently under review by the management team.";
    case "draft":
      return "No note available.";
    default:
      return "No note available.";
  }
};

export function CONote({ status }: CONoteProps) {
  // Don't render CO's Note for draft status
  if (status === "draft") {
    return null;
  }

  const noteContent = getNoteContent(status);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">CO&apos;s Note</h2>
      <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
        <p className="text-sm text-foreground">{noteContent}</p>
      </div>
    </div>
  );
}
