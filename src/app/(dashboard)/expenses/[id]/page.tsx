"use client";

import { ExpenseDetailCard } from "@/components/expenses/ExpenseDetailCard";
import { ReceiptPreview } from "@/components/expenses/ReceiptPreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { reimbursements } from "../page";

const Page = () => {
  const params = useParams();
  const expenseId = Number(params.id);

  // Find the expense by ID
  const expenseData = reimbursements.find((r) => r.id === expenseId);

  if (!expenseData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Expense not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The expense you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Map reimbursement status to expense detail status
  const statusMap: Record<string, "approved" | "rejected" | "pending"> = {
    approved: "approved",
    declined: "rejected",
    rejected: "rejected",
    pending: "pending",
    draft: "pending",
    paid: "approved",
  };

  // Determine if expense has split expense capability
  // You can customize this logic based on your business rules
  // For example: expenses above a certain amount, specific categories, etc.
  const hasSplitExpense =
    expenseData.amount > 200 || expenseData.category === "Travel";

  // Map reimbursement data to expense detail format
  const expense = {
    id: expenseData.id.toString(),
    title: expenseData.description,
    department: "Marketing", // Default or from expense data if available
    dateSubmitted: expenseData.date,
    vendor: "Vendor", // Default or from expense data if available
    category: expenseData.category,
    amount: `$${expenseData.amount}`,
    paymentMethod: "Bank Account", // Default or from expense data if available
    policyCompliance:
      expenseData.amount > 200 ? ("exceeded" as const) : ("within" as const),
    currency: "USD",
    status: statusMap[expenseData.status] || "pending",
    description: expenseData.description,
    hasSplitExpense,
  };

  // Get employee initials from name
  const employeeInitials = expenseData.employee
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Expense Details
        </h1>
        <p className="text-muted-foreground mt-1">
          View a detailed breakdown of this expense, including receipts,
          history, and approval status.
        </p>
      </div>

      {/* User Info with Dynamic Link on Right */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {expenseData.avatar ? (
              <AvatarImage
                src={expenseData.avatar}
                alt={expenseData.employee}
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {employeeInitials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-foreground">
            {expenseData.employee}
          </span>
        </div>
        <div className="flex items-center">
          {hasSplitExpense ? (
            <Link
              href={`/expenses/${expense.id}/split-expense`}
              className="text-sm text-primary hover:underline font-medium"
            >
              View Split Expense
            </Link>
          ) : (
            <Link
              href={`/expenses/${expense.id}/audit-trail`}
              className="text-sm text-primary hover:underline font-medium"
            >
              View Audit Trail
            </Link>
          )}
        </div>
      </div>

      {/* Content - Expense Details on left, Receipt on right */}
      <div className="flex gap-8 items-start">
        {/* Expense Details - Left Side */}
        <div className="flex-1">
          <ExpenseDetailCard expense={expense} />
        </div>

        {/* Receipt Preview - Right Side */}
        <div className="shrink-0">
          <ReceiptPreview />
        </div>
      </div>
    </div>
  );
};

export default Page;
