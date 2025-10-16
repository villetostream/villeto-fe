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
import { AlertTriangle, MoreHorizontal, RefreshCw, ArrowUpDown, ChevronDown } from "lucide-react";
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
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2"
                    >
                        ID NO
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2"
                    >
                        NAME OF EMPLOYEE
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "department",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2"
                    >
                        DEPARTMENT
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "alert",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2"
                    >
                        POLICY ALERT
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                );
            },
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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2"
                    >
                        DATE
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                );
            },
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
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Policy Alerts</h3>
                    <p className="text-sm text-muted-foreground">Your latest policy alerts</p>
                </div>
                <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {/* <div className="mb-4 flex items-center gap-2">
                <Input
                    placeholder="Search by name, department, or ID..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Filter by Alert <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                            checked={!table.getColumn("alert")?.getFilterValue()}
                            onCheckedChange={() => table.getColumn("alert")?.setFilterValue(undefined)}
                        >
                            All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={table.getColumn("alert")?.getFilterValue() === "High"}
                            onCheckedChange={(checked) =>
                                table.getColumn("alert")?.setFilterValue(checked ? "High" : undefined)
                            }
                        >
                            High
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={table.getColumn("alert")?.getFilterValue() === "Medium"}
                            onCheckedChange={(checked) =>
                                table.getColumn("alert")?.setFilterValue(checked ? "Medium" : undefined)
                            }
                        >
                            Medium
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={table.getColumn("alert")?.getFilterValue() === "Low"}
                            onCheckedChange={(checked) =>
                                table.getColumn("alert")?.setFilterValue(checked ? "Low" : undefined)
                            }
                        >
                            Low
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {Object.keys(rowSelection).length > 0 && (
                    <span className="text-sm text-muted-foreground">
                        {Object.keys(rowSelection).length} row(s) selected
                    </span>
                )}
            </div> */}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
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