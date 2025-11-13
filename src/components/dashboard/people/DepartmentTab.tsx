import { Search, Filter, RefreshCw, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const departments = [
    { name: "Finance", code: "FIN", description: "Manages budgets, invoices, and reimbursements.", head: "Finance Manager", reportsTo: "CO", dateCreated: "15 Sept 2025" },
    { name: "Marketing", code: "MKT", description: "Oversees campaigns, branding, and promotions.", head: "Marketing Lead", reportsTo: "Dept. Manager", dateCreated: "15 Sept 2025" },
    { name: "Engineering", code: "ENG", description: "Develops and maintains technical systems.", head: "Tech Lead", reportsTo: "CO", dateCreated: "12 Oct 2025" },
    { name: "Human Resources", code: "HR", description: "Recruitment, onboarding, and employee relations.", head: "HR Manager", reportsTo: "CO", dateCreated: "15 Sept 2025" },
    { name: "Procurement", code: "FIN", description: "Manages budgets, invoices, and reimbursements.", head: "Procurement Officer", reportsTo: "CO", dateCreated: "15 Sept 2025" },
    { name: "Operations", code: "OPS", description: "Logistics, processes, and facility management.", head: "Operations Lead", reportsTo: "Fin. Manager", dateCreated: "15 Sept 2025" },
    { name: "Compliance", code: "CMP", description: "Ensures adherence to company & financial policies.", head: "Compliance Officer", reportsTo: "CO", dateCreated: "15 Sept 2025" },
    { name: "Customer Support", code: "SUP", description: "Manages client inquiries and resolutions.", head: "Support Lead", reportsTo: "Operations Lead", dateCreated: "15 Sept 2025" },
];

export const DepartmentsTab = () => {
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
                            <TableHead className="font-semibold">DEPARTMENT</TableHead>
                            <TableHead className="font-semibold">DEPT CODE</TableHead>
                            <TableHead className="font-semibold">DESCRIPTION</TableHead>
                            <TableHead className="font-semibold">DEPT HEAD</TableHead>
                            <TableHead className="font-semibold">REPORTS TO</TableHead>
                            <TableHead className="font-semibold">DATE CREATED</TableHead>
                            <TableHead className="font-semibold text-right">ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((dept, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{dept.name}</TableCell>
                                <TableCell>{dept.code}</TableCell>
                                <TableCell className="max-w-xs text-muted-foreground">{dept.description}</TableCell>
                                <TableCell>{dept.head}</TableCell>
                                <TableCell>{dept.reportsTo}</TableCell>
                                <TableCell>{dept.dateCreated}</TableCell>
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