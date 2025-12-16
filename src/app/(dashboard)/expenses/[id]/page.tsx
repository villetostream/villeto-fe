import { ExpenseAccordion } from '@/components/expenses/ExpenseAccordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

const expenses = [
    {
        id: "1",
        title: "Lunch with Clients",
        department: "Marketing",
        dateSubmitted: "15 Oct 2025",
        vendor: "Atlassian",
        category: "Software Subscription",
        amount: "$3000",
        paymentMethod: "Bank Account",
        policyCompliance: "within" as const,
        currency: "USD",
        status: "approved" as const,
        description: "Engineering department share of Jira/Confluence subscription.",
        hasSplitExpense: false,
    },
    {
        id: "2",
        title: "Lunch with Clients",
        department: "Marketing",
        dateSubmitted: "15 Oct 2025",
        vendor: "Atlassian",
        category: "Software Subscription",
        amount: "$3000",
        paymentMethod: "Bank Account",
        policyCompliance: "exceeded" as const,
        currency: "USD",
        status: "rejected" as const,
        description: "Engineering department share of Jira/Confluence subscription.",
        hasSplitExpense: false,
    },
    {
        id: "3",
        title: "Lunch with Clients",
        department: "Marketing",
        dateSubmitted: "15 Oct 2025",
        vendor: "Atlassian",
        category: "Software Subscription",
        amount: "$3000",
        paymentMethod: "Bank Account",
        policyCompliance: "within" as const,
        currency: "USD",
        status: "pending" as const,
        description: "Engineering department share of Jira/Confluence subscription.",
        hasSplitExpense: true,
    },
];
const Page = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Expense Details</h1>
                <p className="text-muted-foreground mt-1">
                    View a detailed breakdown of this expense, including receipts, history, and approval status.
                </p>
            </div>

            {/* User Info with Split Link */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary">GS</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">Goodness Swift</span>
                </div>
                <Link
                    href="/expenses/1/split-expense"
                    className="text-sm text-primary hover:underline font-medium"
                >
                    View Split Expense
                </Link>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {expenses.map((expense, index) => (
                    <ExpenseAccordion
                        key={expense.id}
                        expense={expense}
                        defaultOpen={index === 0}
                    />
                ))}
            </div>

            {/* Audit Trail Link */}
            <div className="pt-4">
                <Link
                    href="/expenses/1/audit-trail"
                    className="text-sm text-primary hover:underline font-medium"
                >
                    View Audit Trail →
                </Link>
            </div>
        </div>

    )
}

export default Page