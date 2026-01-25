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
import { Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export type PersonalExpenseStatus =
  | "draft"
  | "pending"
  | "approved"
  | "declined"
  | "rejected"
  | "paid";

export type PersonalExpenseRow = {
  id: number;
  date: string;
  vendor: string;
  category: string; // This is the costCenter from API
  amount: number;
  hasReceipt: boolean;
  status: PersonalExpenseStatus;
  reportName?: string;
  description?: string;
  groupId?: string; // For grouping multiple expenses with same report name
  isGrouped?: boolean; // True if this is a grouped entry
  groupedExpenses?: PersonalExpenseRow[]; // Array of individual expenses in the group
  totalAmount?: number; // Total amount for grouped expenses
  reportId?: string; // Report ID from API for fetching details
  costCenter?: string; // Cost center from API response
  restResult?: {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    reportId: string;
    reportTitle: string;
  }; // Full API response structure for reference
};

function ReceiptCell({ hasReceipt }: { hasReceipt: boolean }) {
  return <span className="text-sm">{hasReceipt ? "Yes" : "No"}</span>;
}

function ActionsCell({ row }: { row: any }) {
  const status = row.getValue("status") as PersonalExpenseStatus;
  const expense = row.original as PersonalExpenseRow;
  const router = useRouter();

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
          <DropdownMenuItem
            onClick={() => console.log("Delete", expense.reportId)}
          >
            <Trash className="size-5" />
            Delete
          </DropdownMenuItem>
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
    accessorKey: "hasReceipt",
    header: "RECEIPT",
    cell: ({ row }) => (
      <ReceiptCell hasReceipt={Boolean(row.getValue("hasReceipt"))} />
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
