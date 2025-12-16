"use client"

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ExpenseDetailCard } from "./ExpenseDetailCard";
import { ReceiptPreview } from "./ReceiptPreview";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface ExpenseData {
    id: string;
    title: string;
    department: string;
    dateSubmitted: string;
    vendor: string;
    category: string;
    amount: string;
    paymentMethod: string;
    policyCompliance: "within" | "exceeded";
    currency: string;
    status: "approved" | "rejected" | "pending";
    description: string;
    hasSplitExpense?: boolean;
}

interface ExpenseAccordionProps {
    expense: ExpenseData;
    defaultOpen?: boolean;
}

export function ExpenseAccordion({ expense, defaultOpen = false }: ExpenseAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{expense.title}</span>
                    <Badge variant={expense.status} />
                </div>
                {isOpen ? (
                    <ChevronUp size={20} className="text-muted-foreground" />
                ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                )}
            </button>

            {/* Content */}
            {isOpen && (
                <div className="p-6 animate-fade-in">
                    <div className="flex gap-8">
                        {/* Expense Details */}
                        <div className="flex-1">
                            <ExpenseDetailCard expense={expense} />
                        </div>

                        {/* Receipt */}
                        <div className="shrink-0">
                            <ReceiptPreview />
                        </div>
                    </div>

                    {/* Split Expense Link */}
                    {expense.hasSplitExpense && (
                        <div className="mt-4 text-right">
                            <Link
                                href={`/expenses/${expense.id}/split-expense`}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                View Split Expense
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}