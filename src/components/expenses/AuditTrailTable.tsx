import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AuditEntry {
    step: number;
    action: string;
    user: string;
    role: string;
    timestamp: string;
    note: string;
}

interface AuditTrailTableProps {
    expenseId: string;
    status: string;
    entries: AuditEntry[];
}

export function AuditTrailTable({ expenseId, status, entries }: AuditTrailTableProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        Audit Trail for Expense #{expenseId}({status})
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track every action taken on this expense for transparency and compliance.
                    </p>
                </div>
                <Button className="gap-2">
                    <Download size={16} />
                    Download Audit Log
                </Button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">STEP</TableHead>
                            <TableHead className="font-semibold">ACTION</TableHead>
                            <TableHead className="font-semibold">USER</TableHead>
                            <TableHead className="font-semibold">ROLE</TableHead>
                            <TableHead className="font-semibold">TIMESTAMP</TableHead>
                            <TableHead className="font-semibold">NOTE</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.step}>
                                <TableCell className="font-medium">{entry.step}</TableCell>
                                <TableCell>{entry.action}</TableCell>
                                <TableCell>{entry.user}</TableCell>
                                <TableCell>{entry.role}</TableCell>
                                <TableCell className="text-muted-foreground">{entry.timestamp}</TableCell>
                                <TableCell className="text-muted-foreground">{entry.note}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}