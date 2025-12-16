import { SplitExpenseTable } from '@/components/expenses/split/SplitExpenseTable'
import React from 'react'
const summary = {
    reportName: "Exp Lunch 2020",
    reportDate: "12/08/2025",
    totalAmount: "$7,500",
    category: "Software Subscription",
    vendor: "Atlassian",
    transactionDate: "12/08/2025",
};

const splits = [
    { department: "Marketing", amount: "$7,500", description: "Attended meeting" },
    { department: "Operations", amount: "$2,500", description: "Attended meeting" },
    { department: "HR", amount: "$1,500", description: "Attended meeting" },
];
const Page = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Split Expense -By Department</h1>
                <p className="text-muted-foreground mt-1">
                    Review policy compliance across departments
                </p>
            </div>

            {/* Content */}
            <SplitExpenseTable summary={summary} splits={splits} />
        </div>
    )
}

export default Page