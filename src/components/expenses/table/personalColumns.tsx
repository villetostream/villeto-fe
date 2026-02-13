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
];