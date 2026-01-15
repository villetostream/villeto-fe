"use client";

import { useState, useEffect, useMemo } from "react";
import { ExpenseAccordion } from "@/components/expenses/ExpenseAccordion";
import { ApprovalModal } from "@/components/expenses/ApprovalModal";
import { RejectionModal } from "@/components/expenses/RejectionModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { reimbursements } from "../../page";

const Page = () => {
  const params = useParams();
  const employeeId = params.employeeId as string;
  const [expenseStatuses, setExpenseStatuses] = useState<Record<number, "approved" | "rejected" | "pending">>({});
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [batchApprovalOpen, setBatchApprovalOpen] = useState(false);
  const [batchRejectionOpen, setBatchRejectionOpen] = useState(false);

  // Find all expenses for this employee
  const employeeExpenses = useMemo(() => {
    return reimbursements.filter((r) => {
      // Match by employee name (normalized)
      // Convert URL slug back to name: "goodness-swift" -> "Goodness Swift"
      const employeeNameFromSlug = employeeId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      // Try exact match first, then case-insensitive
      return r.employee.toLowerCase() === employeeNameFromSlug.toLowerCase();
    });
  }, [employeeId]);

  // Store current state when batch page loads (for back navigation)
  useEffect(() => {
    // Store that we're on a batch page
    sessionStorage.setItem("batchEmployeeSlug", employeeId);
    
    // Store current expenses page state if available
    const currentTab = new URLSearchParams(window.location.search).get("tab") || "company-expenses";
    sessionStorage.setItem("expensesTab", currentTab);
    
    // Store any filters if they exist
    const urlParams = new URLSearchParams(window.location.search);
    const filters: Record<string, string> = {};
    urlParams.forEach((value, key) => {
      if (key !== "tab") {
        filters[key] = value;
      }
    });
    if (Object.keys(filters).length > 0) {
      sessionStorage.setItem("expensesFilters", JSON.stringify(filters));
    }
  }, [employeeId]);

  // Load statuses from localStorage on mount
  useEffect(() => {
    const statuses: Record<number, "approved" | "rejected" | "pending"> = {};
    employeeExpenses.forEach((expense) => {
      const savedStatus = localStorage.getItem(`expense-status-${expense.id}`);
      if (savedStatus) {
        statuses[expense.id] = savedStatus as "approved" | "rejected" | "pending";
      }
    });
    setExpenseStatuses(statuses);
  }, [employeeExpenses]);

  if (employeeExpenses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            No expenses found
          </h1>
          <p className="text-muted-foreground mb-4">
            No expenses found for this employee.
          </p>
        </div>
      </div>
    );
  }

  // Get employee info from first expense
  const employeeInfo = employeeExpenses[0];
  const employeeInitials = employeeInfo.employee
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Map reimbursement status to expense detail status
  const statusMap: Record<string, "approved" | "rejected" | "pending"> = {
    approved: "approved",
    declined: "rejected",
    rejected: "rejected",
    pending: "pending",
    draft: "pending",
    paid: "approved",
  };

  // Calculate total payable amount
  const totalPayable = useMemo(() => {
    return employeeExpenses.reduce((sum, expense) => {
      const status = expenseStatuses[expense.id] || statusMap[expense.status] || "pending";
      // Only count approved and pending expenses
      if (status === "approved" || status === "pending") {
        return sum + expense.amount;
      }
      return sum;
    }, 0);
  }, [employeeExpenses, expenseStatuses]);

  // Get pending expenses for batch operations
  const pendingExpenses = useMemo(() => {
    return employeeExpenses.filter((expense) => {
      const status = expenseStatuses[expense.id] || statusMap[expense.status] || "pending";
      return status === "pending";
    });
  }, [employeeExpenses, expenseStatuses]);

  // Map expenses to accordion format
  const accordionExpenses = employeeExpenses.map((expenseData) => {
    const currentStatus = expenseStatuses[expenseData.id] || statusMap[expenseData.status] || "pending";
    const hasSplitExpense = expenseData.amount > 200 || expenseData.category === "Travel";

    // Use description for accordion header, but for detail card use a more specific title
    // For "Lunch with Clients" expenses, show "Trip to Abuja" in detail card to match screenshot
    const detailTitle = expenseData.description === "Lunch with Clients" 
      ? "Trip to Abuja" 
      : expenseData.description;

    return {
      id: expenseData.id.toString(),
      title: detailTitle, // This is for the detail card
      accordionTitle: expenseData.description, // This is for the accordion header
      department: expenseData.department.departmentName,
      dateSubmitted: expenseData.date,
      vendor: "Atlassian", // Default vendor
      category: expenseData.category,
      amount: `$${expenseData.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      paymentMethod: "Bank Account",
      policyCompliance: expenseData.amount > 200 ? ("exceeded" as const) : ("within" as const),
      currency: "USD",
      status: currentStatus,
      description: "Engineering department share of Jira/Confluence subscription.",
      hasSplitExpense,
      originalExpense: expenseData,
    };
  });

  const handleApprove = (expenseId: number, note: string) => {
    setExpenseStatuses((prev) => ({ ...prev, [expenseId]: "approved" }));
    localStorage.setItem(`expense-status-${expenseId}`, "approved");
    setApprovalOpen(false);
    setSelectedExpenseId(null);
    console.log("Approved expense", expenseId, "with note:", note);
  };

  const handleReject = (expenseId: number, reason: string) => {
    setExpenseStatuses((prev) => ({ ...prev, [expenseId]: "rejected" }));
    localStorage.setItem(`expense-status-${expenseId}`, "rejected");
    setRejectionOpen(false);
    setSelectedExpenseId(null);
    console.log("Rejected expense", expenseId, "with reason:", reason);
  };

  const handleBatchApprove = (note: string) => {
    pendingExpenses.forEach((expense) => {
      setExpenseStatuses((prev) => ({ ...prev, [expense.id]: "approved" }));
      localStorage.setItem(`expense-status-${expense.id}`, "approved");
    });
    setBatchApprovalOpen(false);
    console.log("Batch approved expenses with note:", note);
  };

  const handleBatchReject = (reason: string) => {
    pendingExpenses.forEach((expense) => {
      setExpenseStatuses((prev) => ({ ...prev, [expense.id]: "rejected" }));
      localStorage.setItem(`expense-status-${expense.id}`, "rejected");
    });
    setBatchRejectionOpen(false);
    console.log("Batch rejected expenses with reason:", reason);
  };

  const openApprovalModal = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setApprovalOpen(true);
  };

  const openRejectionModal = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setRejectionOpen(true);
  };

  const selectedExpense = selectedExpenseId
    ? accordionExpenses.find((e) => e.id === selectedExpenseId.toString())
    : null;

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Expense Details (Multiple)
          </h1>
          <p className="text-muted-foreground mt-1">
            View a detailed breakdown of this expense, including receipts, history, and approval status.
          </p>
          <div className="mt-4">
            <p className="text-3xl font-bold text-primary">
              ${totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Payable Amount</p>
          </div>
        </div>

        {/* User Info and Batch Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {employeeInfo.avatar ? (
                <AvatarImage
                  src={employeeInfo.avatar}
                  alt={employeeInfo.employee}
                />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {employeeInitials}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="font-medium text-foreground">
              {employeeInfo.employee}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setBatchApprovalOpen(true)}
              disabled={pendingExpenses.length === 0}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Batch Approve
            </Button>
            <Button
              onClick={() => setBatchRejectionOpen(true)}
              disabled={pendingExpenses.length === 0}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              Batch Reject
            </Button>
          </div>
        </div>

        {/* Expense Accordions */}
        <div className="space-y-4">
          {accordionExpenses.map((expense, index) => (
            <ExpenseAccordion
              key={expense.id}
              expense={expense}
              defaultOpen={index === 0}
              onApprove={() => openApprovalModal(Number(expense.id))}
              onReject={() => openRejectionModal(Number(expense.id))}
              previousPage="batch"
            />
          ))}
        </div>
      </div>

      {/* Individual Approval Modal */}
      {selectedExpense && (
        <>
          <ApprovalModal
            open={approvalOpen}
            onOpenChange={setApprovalOpen}
            onApprove={(note) => handleApprove(Number(selectedExpense.id), note)}
            expenseTitle={selectedExpense.title}
            expenseAmount={selectedExpense.amount}
          />

          <RejectionModal
            open={rejectionOpen}
            onOpenChange={setRejectionOpen}
            onReject={(reason) => handleReject(Number(selectedExpense.id), reason)}
            expenseTitle={selectedExpense.title}
            expenseAmount={selectedExpense.amount}
          />
        </>
      )}

      {/* Batch Approval Modal */}
      <ApprovalModal
        open={batchApprovalOpen}
        onOpenChange={setBatchApprovalOpen}
        onApprove={handleBatchApprove}
        expenseTitle={`${pendingExpenses.length} Expenses`}
        expenseAmount={`$${pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      />

      {/* Batch Rejection Modal */}
      <RejectionModal
        open={batchRejectionOpen}
        onOpenChange={setBatchRejectionOpen}
        onReject={handleBatchReject}
        expenseTitle={`${pendingExpenses.length} Expenses`}
        expenseAmount={`$${pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      />
    </>
  );
};

export default Page;
