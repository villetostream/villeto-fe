"use client";

import { Reimbursement, reimbursements } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getStatusIcon } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { CloseCircle, MessageEdit } from "iconsax-reactjs";
import { Receipt, MoreHorizontal, Eye, Send, Trash, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

function ActionsCell({ row }: { row: any }) {
  const status = row.getValue("status") as string;
  const router = useRouter();
  const expense = row.original;

  // Check if employee has multiple expenses
  const employeeExpenseCount = reimbursements.filter(
    (r) => r.employee === expense.employee
  ).length;
  const hasMultipleExpenses = employeeExpenseCount > 1;

  // Create URL-friendly employee name for batch route
  const employeeSlug = expense.employee.toLowerCase().replace(/\s+/g, "-");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {hasMultipleExpenses && (
          <DropdownMenuItem
            onClick={() => {
              // Store current expenses page state before navigating to batch
              const currentTab = new URLSearchParams(window.location.search).get("tab") || "company-expenses";
              sessionStorage.setItem("expensesTab", currentTab);
              
              // Store any filters
              const urlParams = new URLSearchParams(window.location.search);
              const filters: Record<string, string> = {};
              urlParams.forEach((value, key) => {
                if (key !== "tab") {
                  filters[key] = value;
                }
              });
              if (Object.keys(filters).length > 0) {
                sessionStorage.setItem("expensesFilters", JSON.stringify(filters));
              }
              
              router.push(`/expenses/batch/${employeeSlug}`);
            }}
          >
            <Layers className="size-5" />
            View Batch Details
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => router.push(`/expenses/${expense.id}`)}
        >
          <Eye className="size-5" />
          View Details
        </DropdownMenuItem>
        {status === "pending" && (
          <DropdownMenuItem>
            <CloseCircle className="size-5" />
            Cancel Submission
          </DropdownMenuItem>
        )}
        {status === "draft" && (
          <DropdownMenuItem>
            <MessageEdit className="size-5" />
            Edit Expense
          </DropdownMenuItem>
        )}
        {status === "declined" && (
          <DropdownMenuItem>
            <Send className="size-5" />
            Submit New Report
          </DropdownMenuItem>
        )}
        {(status === "draft" || status === "declined") && (
          <DropdownMenuItem>
            <Trash className="size-5" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Reimbursement>[] = [
  {
    accessorKey: "employee",
    header: "Requested By",
    cell: ({ row }) => {
      const emp = row.original as any;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            {emp.avatar ? (
              <AvatarImage src={emp.avatar} alt={emp.employee} />
            ) : (
              <AvatarImage
                src="/images/avatars/default.jpg"
                alt={emp.employee}
              />
            )}
          </Avatar>
          <div>
            <div className="font-medium">{emp.employee}</div>
            <div className="text-sm text-muted-foreground">
              {emp.description}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const dept = row.original?.department;
      return <span>{dept?.departmentName ?? String(dept ?? "")}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold">${row.getValue("amount")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status as "draft" | "rejected" | "approved" | "paid" | "pending"
          }
        >
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    display: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
