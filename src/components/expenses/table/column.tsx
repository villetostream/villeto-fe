"use client";

import { Reimbursement } from "@/app/dashboard/expenses/page";
import { Badge } from "@/components/ui/badge";
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
import { Receipt, MoreHorizontal, Eye, Send, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

function ActionsCell({ row }: { row: any }) {
  const status = row.getValue("status") as string;
  const router = useRouter();
  const expense = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
          <Receipt className="w-4 h-4 text-dashboard-accent" />
        </div>
        <span className="font-medium">{row.getValue("description")}</span>
      </div>
    ),
  },
  {
    accessorKey: "employee",
    header: "Employee",
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
    accessorKey: "date",
    header: "Date",
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
    display: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
