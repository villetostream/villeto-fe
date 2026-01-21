"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getStatusIcon } from "@/lib/helper";
import { ReceiptPreview } from "@/components/expenses/ReceiptPreview";
import { NoReceiptUploaded } from "@/components/expenses/NoReceiptUploaded";
import { ExpenseTimeline } from "@/components/expenses/personal/ExpenseTimeline";
import { CONote } from "@/components/expenses/personal/CONote";
import type { PersonalExpenseRow, PersonalExpenseStatus } from "@/components/expenses/table/personalColumns";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function readPersonalExpenses(): PersonalExpenseRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("personal-expenses");
    const parsed = raw ? (JSON.parse(raw) as PersonalExpenseRow[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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

export default function PersonalExpenseDetailPage() {
  const params = useParams();
  const expenseId = Number(params.id);
  const [expense, setExpense] = useState<PersonalExpenseRow | null>(null);
  const [groupedExpenses, setGroupedExpenses] = useState<PersonalExpenseRow[]>([]);
  const [reportName, setReportName] = useState("Exp Lunch 2020");
  const [reportDate, setReportDate] = useState("12/08/2025");

  useEffect(() => {
    const expenses = readPersonalExpenses();
    const found = expenses.find((e) => e.id === expenseId);
    if (found) {
      setExpense(found);
      // Try to get report name and date from sessionStorage or use defaults
      const storedName = sessionStorage.getItem(`expense-report-name-${expenseId}`);
      const storedDate = sessionStorage.getItem(`expense-report-date-${expenseId}`);
      if (storedName) setReportName(storedName);
      if (storedDate) setReportDate(storedDate);

      // If this is a grouped expense, load the individual expenses
      if (found.isGrouped && found.groupId) {
        try {
          const storedGroup = sessionStorage.getItem(`expense-group-${found.groupId}`);
          if (storedGroup) {
            const parsed = JSON.parse(storedGroup) as PersonalExpenseRow[];
            setGroupedExpenses(parsed);
          } else if (found.groupedExpenses) {
            setGroupedExpenses(found.groupedExpenses);
          }
        } catch (error) {
          console.error("Error loading grouped expenses:", error);
        }
      }
    }
  }, [expenseId]);

  if (!expense) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Expense not found
          </h1>
          <p className="text-muted-foreground mb-4">
            The expense you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const isGrouped = expense.isGrouped && groupedExpenses.length > 0;
  const expensesToDisplay = isGrouped ? groupedExpenses : [expense];
  const totalAmount = isGrouped && expense.totalAmount ? expense.totalAmount : expense.amount;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            {isGrouped ? "Multiple Expenses Details" : "Expense Details"}
          </h1>
          
          {/* Report Info */}
          <div className="flex items-center gap-6 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">{reportName}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">{reportDate}</span>
            </div>
            <div>
              <Badge
                variant={getStatusBadgeVariant(expense.status)}
                className={getStatusColor(expense.status)}
              >
                {getStatusIcon(expense.status)}
                <span className="ml-1 capitalize">{expense.status === "declined" ? "Rejected" : expense.status === "paid" ? "Paid Out" : expense.status}</span>
              </Badge>
            </div>
          </div>

          {/* View Split Expense Link */}
          <div className="mb-6">
            <Link
              href={`/expenses/personal/${expenseId}/split-expense`}
              className="text-sm text-primary hover:underline font-medium"
            >
              View Split Expense Details
            </Link>
          </div>
        </div>
        
        {/* Total Amount - Top Right */}
        {isGrouped && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-2xl font-semibold text-foreground">
              ${totalAmount.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      {isGrouped ? (
        /* Accordion for Multiple Expenses */
        <div className="space-y-6">
          <Accordion
            type="multiple"
            defaultValue={[`expense-0`]}
            className="w-full"
          >
            {expensesToDisplay.map((exp, index) => (
              <AccordionItem key={exp.id} value={`expense-${index}`}>
                <AccordionTrigger className="px-4 py-3 bg-gray-50 rounded-md text-left">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Expense {index + 1}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-3">
                        <span>{exp.category}</span>
                        <span>•</span>
                        <span>${Number(exp.amount).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-8 items-start pt-4">
                    {/* Left Side - Expense Details */}
                    <div className="flex-1 space-y-6">
                      {/* Expense Information Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Amount</p>
                          <p className="text-base font-semibold text-foreground">
                            ${exp.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Expense Category</p>
                          <p className="text-base text-foreground">{exp.category}</p>
                        </div>
                        <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Merchant</p>
                          <p className="text-base text-foreground">{exp.vendor || "N/A"}</p>
                        </div>
                        <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Transaction Date</p>
                          <p className="text-base text-foreground">{exp.date}</p>
                        </div>
                        <div className="bg-[#7FE3DB]/10 rounded-lg p-4 col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">Description</p>
                          <p className="text-base text-foreground">{exp.description || "No description provided"}</p>
                        </div>
                      </div>

                      {/* Expense Timeline */}
                      <ExpenseTimeline status={exp.status} />

                      {/* CO's Note */}
                      <CONote status={exp.status} />
                    </div>

                    {/* Right Side - Receipt */}
                    <div className="w-80 shrink-0">
                      {exp.receiptImage ? (
                        <div className="bg-white rounded-lg border border-border p-3">
                          <img
                            src={exp.receiptImage}
                            alt="Receipt"
                            className="w-full h-auto object-contain rounded"
                          />
                        </div>
                      ) : (
                        <NoReceiptUploaded />
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        /* Single Expense View */
        <div className="flex gap-8 items-start">
          {/* Left Side - Expense Details */}
          <div className="flex-1 space-y-6">
            {/* Expense Information Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="text-base font-semibold text-foreground">
                  ${expense.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Expense Category</p>
                <p className="text-base text-foreground">{expense.category}</p>
              </div>
              <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Merchant</p>
                <p className="text-base text-foreground">{expense.vendor || "N/A"}</p>
              </div>
              <div className="bg-[#7FE3DB]/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Transaction Date</p>
                <p className="text-base text-foreground">{expense.date}</p>
              </div>
              <div className="bg-[#7FE3DB]/10 rounded-lg p-4 col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-base text-foreground">{expense.description || "No description provided"}</p>
              </div>
            </div>

            {/* Expense Timeline */}
            <ExpenseTimeline status={expense.status} />

            {/* CO's Note */}
            <CONote status={expense.status} />
          </div>

          {/* Right Side - Receipt */}
          <div className="w-80 shrink-0">
            {expense.receiptImage ? (
              <div className="bg-white rounded-lg border border-border p-3">
                <img
                  src={expense.receiptImage}
                  alt="Receipt"
                  className="w-full h-auto object-contain rounded"
                />
              </div>
            ) : (
              <NoReceiptUploaded />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
