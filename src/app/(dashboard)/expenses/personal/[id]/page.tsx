"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getStatusIcon } from "@/lib/helper";
import { NoReceiptUploaded } from "@/components/expenses/NoReceiptUploaded";
import { ExpenseTimeline } from "@/components/expenses/personal/ExpenseTimeline";
import { CONote } from "@/components/expenses/personal/CONote";
import type { PersonalExpenseStatus } from "@/components/expenses/table/personalColumns";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  usePersonalExpenseDetail,
  type ExpenseItem,
} from "@/lib/react-query/expenses";
import { ExpenseDetailSkeleton } from "@/components/expenses/ExpenseDetailSkeleton";

const getStatusBadgeVariant = (status: PersonalExpenseStatus) => {
  switch (status) {
    case "paid":
      return "paid";
    case "approved":
      return "approved";
    case "pending":
      return "pending";
    case "draft":
      return "draft";
    case "rejected":
    case "declined":
      return "rejected";
    default:
      return "pending";
  }
};

const getStatusColor = (status: PersonalExpenseStatus) => {
  switch (status) {
    case "paid":
      return "bg-[#38B2AC] text-white border-0";
    case "approved":
      return "bg-purple-100 text-purple-700 border-0";
    case "pending":
      return "bg-orange-100 text-orange-700 border-0";
    case "draft":
      return "bg-gray-200 text-gray-700 border-0";
    case "rejected":
    case "declined":
      return "bg-red-100 text-red-700 border-0";
    default:
      return "bg-gray-200 text-gray-700 border-0";
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function PersonalExpenseDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  // Fetch expense detail from API using React Query
  const {
    data: expenseDetail,
    isLoading,
    error,
  } = usePersonalExpenseDetail(reportId);

  if (isLoading) {
    return <ExpenseDetailSkeleton />;
  }

  if (error || !expenseDetail) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Expense not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The expense you&apos;re looking for doesn&apos;t exist or failed to
            load.
          </p>
        </div>
      </div>
    );
  }

  const reportName = expenseDetail.reportTitle;
  const reportDate = formatDate(expenseDetail.createdAt);
  const expenses = expenseDetail.expenses || [];

  // Check if we have any expenses
  if (expenses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            No expenses found
          </h1>
          <p className="text-muted-foreground mb-4">
            This report doesn&apos;t contain any expense items.
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0,
  );
  const isMultipleExpenses = expenses.length > 1;

  // Get the overall report status from the detail response, with fallbacks
  const reportStatus = (expenseDetail.status ||
    expenses[0]?.status ||
    "draft") as PersonalExpenseStatus;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            {isMultipleExpenses
              ? "Multiple Expenses Details"
              : "Expense Details"}
          </h1>

          {/* Report Info */}
          <div className="flex items-center gap-6 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">
                {reportName}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">
                {reportDate}
              </span>
            </div>
            <div>
              <Badge
                variant={getStatusBadgeVariant(reportStatus)}
                className={getStatusColor(reportStatus)}
              >
                {getStatusIcon(reportStatus)}
                <span className="ml-1 capitalize">
                  {reportStatus === "declined"
                    ? "Rejected"
                    : reportStatus === "paid"
                      ? "Paid Out"
                      : reportStatus}
                </span>
              </Badge>
            </div>
          </div>

          {/* View Split Expense Link */}
          <div className="mb-6">
            <Link
              href={`/expenses/personal/${reportId}/split-expense`}
              className="text-sm text-primary hover:underline font-medium"
            >
              View Split Expense Details
            </Link>
          </div>
        </div>

        {/* Total Amount - Top Right */}
        {isMultipleExpenses && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-semibold text-foreground">
              $
              {totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      {isMultipleExpenses ? (
        /* Accordion for Multiple Expenses */
        <div className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={["expense-0"]}
            className="w-full"
          >
            {expenses.map((expense, index) => (
              <AccordionItem key={expense.expenseId} value={`expense-${index}`}>
                <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-md text-left">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {expense.title || `Expense ${index + 1}`}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-3">
                        <span>{expense.merchantName}</span>
                        <span>•</span>
                        <span>
                          $
                          {parseFloat(expense.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ExpenseDetailContent
                    expense={expense}
                    reportStatus={reportStatus}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        /* Single Expense View */
        <ExpenseDetailContent
          expense={expenses[0]}
          reportStatus={reportStatus}
        />
      )}
    </div>
  );
}

// Component to render individual expense details
function ExpenseDetailContent({
  expense,
  reportStatus,
}: {
  expense: ExpenseItem;
  reportStatus: PersonalExpenseStatus;
}) {
  return (
    <div className="flex gap-8 items-start">
      {/* Left Side - Expense Details */}
      <div className="flex-1 space-y-6">
        {/* Expense Information Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <p className="text-base font-semibold text-foreground">
              $
              {parseFloat(expense.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Merchant</p>
            <p className="text-base text-foreground">
              {expense.merchantName || "N/A"}
            </p>
          </div>
          <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Category</p>
            <p className="text-base text-foreground">
              {expense.categoryName || "Uncategorized"}
            </p>
          </div>
          <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Transaction Date
            </p>
            <p className="text-base text-foreground">
              {formatDate(expense.createdAt)}
            </p>
          </div>
          <div className="bg-[#7FE3DB]/10 rounded-lg p-4 col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Title</p>
            <p className="text-base text-foreground">
              {expense.title || "No title provided"}
            </p>
          </div>
          <div className="bg-[#7FE3DB]/10 rounded-lg p-4 col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-base text-foreground">
              {expense.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Expense Timeline */}
        <ExpenseTimeline
          status={reportStatus}
          submissionDate={formatDate(expense.createdAt)}
        />

        {/* CO's Note - Only show if not draft */}
        {reportStatus !== "draft" && <CONote status={reportStatus} />}
      </div>

      {/* Right Side - Receipt */}
      <div className="w-80 shrink-0">
        {expense.receiptUrl ? (
          <div className="bg-white rounded-lg border border-border p-3">
            <img
              src={expense.receiptUrl}
              alt="Receipt"
              className="w-full h-auto object-contain rounded"
            />
          </div>
        ) : (
          <NoReceiptUploaded />
        )}
      </div>
    </div>
  );
}
