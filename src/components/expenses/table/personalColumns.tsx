"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusIcon } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export type PersonalExpenseStatus =
  | "draft"
  | "pending"
  | "approved"
  | "declined"
  | "rejected"
  | "paid"
  | "flagged";

export type PersonalExpenseRow = {
  date: string; // Maps to createdAt from API
  reportName: string; // Maps to reportTitle from API
  category: string; // Maps to costCenter from API
  amount: number; // Maps to totalAmount from API (now a number)
  status: PersonalExpenseStatus; // Status is now required
  reportId: string; // Maps to reportId from API (string, not number)
  // Removed unused fields: id (unused), vendor (unused, replaced by reportName), hasReceipt (unused in columns, not in list API), description (unused), groupId (unused), isGrouped (unused), groupedExpenses (unused), totalAmount (use amount instead), costCenter (use category instead), restResult (removed from API)
};

function ActionsCell({ row }: { row: any }) {
  const status = row.getValue("status") as PersonalExpenseStatus;
  const expense = row.original as PersonalExpenseRow;
  const router = useRouter();

  const handleEdit = () => {
    // Navigate to edit page with reportId
    // The edit page will fetch the report details and populate the form
    router.push(`/expenses/personal/${expense.reportId}/edit`);
  };

  const handleDelete = () => {
    router.push(`/expenses/personal/${expense.reportId}/delete`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/expenses/personal/${expense.reportId}`)}
        >
          <Eye className="size-5" />
          View Details
        </DropdownMenuItem>
        {status === "draft" && (
          <>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="size-5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="size-5" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const personalExpenseColumns: ColumnDef<PersonalExpenseRow>[] = [
  { accessorKey: "date", header: "DATE" },
  { accessorKey: "reportName", header: "REPORT NAME" },
  { accessorKey: "category", header: "COST CENTER" },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => (
      <span className="font-semibold">
        ${Number(row.getValue("amount") ?? 0).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status") as PersonalExpenseStatus;
      return (
        <Badge
          variant={
            status as
              | "draft"
              | "rejected"
              | "approved"
              | "paid"
              | "pending"
              | "declined"
          }
        >
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status}</span>
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];