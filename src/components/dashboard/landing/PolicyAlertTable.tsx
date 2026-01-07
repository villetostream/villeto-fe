import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    SortingState,
    ColumnDef,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, MoreHorizontal, RefreshCw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type PolicyAlert = {
    id: string;
    name: string;
    department: string;
    alert: "High" | "Medium" | "Low";
    date: string;
};

const data: PolicyAlert[] = [
    { id: "0001", name: "Stephen Abubakar", department: "Design & Development", alert: "High", date: "26-09-2025" },
    { id: "0002", name: "Stephen Abubakar", department: "Design & Development", alert: "Medium", date: "26-09-2025" },
    { id: "0003", name: "Stephen Abubakar", department: "Design & Development", alert: "Medium", date: "26-09-2025" },
    { id: "0004", name: "Sarah Johnson", department: "Marketing", alert: "Low", date: "25-09-2025" },
    { id: "0005", name: "Mike Chen", department: "Engineering", alert: "High", date: "24-09-2025" },
];

export const PolicyAlertsTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<any>([]);

    const columns: ColumnDef<PolicyAlert>[] = [
        {
            id: "select",
            header: () => null,
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "id",
            header: () => "ID NO",
        },
        {
            accessorKey: "name",
            header: () => "NAME OF EMPLOYEE",
        },
        {
            accessorKey: "department",
            header: () => "DEPARTMENT",
        },
        {
            accessorKey: "alert",
            header: () => "POLICY ALERT",
            cell: ({ row }) => {
                const alert = row.getValue("alert") as string;
                return (
                    <div className="flex items-center gap-2">
                        <AlertTriangle
                            className={`w-4 h-4 ${alert === "High" ? "text-destructive" :
                                alert === "Medium" ? "text-warning" :
                                    "text-muted-foreground"
                                }`}
                        />
                        <span className={`text-sm ${alert === "High" ? "text-destructive" :
                            alert === "Medium" ? "text-warning" :
                                "text-muted-foreground"
                            }`}>
                            {alert}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "date",
            header: () => "DATE",
        },
        {
            id: "actions",
            header: "ACTION",
            cell: () => (
                <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            rowSelection,
            columnFilters,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <Card className="p-6 rounded-[14px] border">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold leading-[100%]">Policy Alerts</h3>
                    <p className="text-sm text-muted-foreground mt-2">Your latest policy alerts</p>
                </div>
                <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};