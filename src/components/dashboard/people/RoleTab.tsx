import { Search, Filter, RefreshCw, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const roles = [
    { name: "Finance Manager", description: "Oversees finance operations", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Active" },
    { name: "Employee", description: "Regular staff role", users: 50, createdBy: "Admin", dateCreated: "10 Sept 2025", status: "Active" },
    { name: "Controlling Officer", description: "Oversees all expenses and approvals.", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Active" },
    { name: "Department Manager", description: "Approves team expenses and tracks budgets.", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Active" },
    { name: "Auditor", description: "Oversees finance operations", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Inactive" },
    { name: "HR Manager", description: "Oversees expenses tied to specific projects.", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Active" },
    { name: "Finance Analyst", description: "Analyzes expense data and generates insights.", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Active" },
    { name: "Executive Assistant", description: "Creates expenses or reservations on behalf of executives.", users: 4, createdBy: "Admin", dateCreated: "15 Sept 2025", status: "Active" },
];

export const RolesTab = () => {
    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </Button>
                <Button variant="ghost" size="icon">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">ROLE</TableHead>
                            <TableHead className="font-semibold">DESCRIPTION</TableHead>
                            <TableHead className="font-semibold">USERS ASSIGNED</TableHead>
                            <TableHead className="font-semibold">CREATED BY</TableHead>
                            <TableHead className="font-semibold">DATE CREATED</TableHead>
                            <TableHead className="font-semibold">STATUS</TableHead>
                            <TableHead className="font-semibold text-right">ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell className="text-muted-foreground">{role.description}</TableCell>
                                <TableCell>{role.users}</TableCell>
                                <TableCell>{role.createdBy}</TableCell>
                                <TableCell>{role.dateCreated}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={role.status === "Active"
                                            ? "text-primary border-primary/20 bg-primary/10"
                                            : "text-muted-foreground border-border bg-muted"
                                        }
                                    >
                                        {role.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Showing 1-11 of 170 entries</span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="default" size="sm" className="bg-primary">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">4</Button>
                    <Button variant="outline" size="sm">5</Button>
                    <Button variant="outline" size="sm">6</Button>
                    <Button variant="outline" size="sm">7</Button>
                    <Button variant="outline" size="sm">8</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </div>
    );
};