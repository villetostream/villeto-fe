import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface SplitEntry {
    department: string;
    amount: string;
    description: string;
}

interface ExpenseSummary {
    reportName: string;
    reportDate: string;
    totalAmount: string;
    category: string;
    vendor: string;
    transactionDate: string;
}

interface SplitExpenseTableProps {
    summary: ExpenseSummary;
    splits: SplitEntry[];
}

export function SplitExpenseTable({ summary, splits }: SplitExpenseTableProps) {
    return (
        <div className="space-y-6">
            {/* Summary Header */}
            <div className="bg-card rounded-lg border border-border p-6">
                <div className="grid grid-cols-6 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Name of Report</p>
                        <p className="text-sm font-medium text-foreground">{summary.reportName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Report Date</p>
                        <p className="text-sm font-medium text-foreground">{summary.reportDate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-sm font-medium text-foreground">{summary.totalAmount}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Expense Category</p>
                        <p className="text-sm font-medium text-foreground">{summary.category}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Vendor</p>
                        <p className="text-sm font-medium text-foreground">{summary.vendor}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Transaction Date</p>
                        <p className="text-sm font-medium text-foreground">{summary.transactionDate}</p>
                    </div>
                </div>
            </div>

            {/* Split Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">DEPARTMENT</TableHead>
                            <TableHead className="font-semibold">SPLIT AMOUNT</TableHead>
                            <TableHead className="font-semibold">DESCRIPTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {splits.map((split, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{split.department}</TableCell>
                                <TableCell>{split.amount}</TableCell>
                                <TableCell className="text-muted-foreground">{split.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}