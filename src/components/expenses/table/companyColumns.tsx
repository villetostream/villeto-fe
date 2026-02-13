"use client";

import { CompanyExpenseReport } from "@/lib/react-query/expenses";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getStatusIcon } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Helper for initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper for formatted date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

function ActionsCell({ row }: { row: any }) {
  const expense = row.original as CompanyExpenseReport;
  const router = useRouter();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="cursor-pointer"
      onClick={() => router.push(`/expenses/company/${expense.reportId}`)}
    >
      <Eye className="w-4 h-4 text-muted-foreground" />
    </Button>
  );
}

export const companyColumns: ColumnDef<CompanyExpenseReport>[] = [
  {
    accessorKey: "employee",
    header: "REQUESTED BY",
    cell: ({ row }) => {
      const report = row.original;
      // API currently doesn't return avatar, so we use fallback
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(report.reportedBy)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{report.reportedBy}</div>
            <div className="text-sm text-muted-foreground">
              {report.reportTitle}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "costCenter",
    header: "COST CENTER",
    cell: ({ row }) => {
      const costCenter = row.getValue("costCenter") as string;
      return <span>{costCenter || "Uncategorized"}</span>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "AMOUNT",
    cell: ({ row }) => {
        const amount = row.getValue("totalAmount") as number;
        return <span className="font-semibold">${amount.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
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
    accessorKey: "updatedAt",
    header: "MODIFIED DATE",
    cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string;
        // Fallback to createdAt if updatedAt is same as createdAt or missing (though API guarantees it)
        return <span>{formatDate(updatedAt)}</span>;
    }
  },
  {
    accessorKey: "createdAt",
    header: "CREATED DATE",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <span>{formatDate(createdAt)}</span>;
    },
    enableHiding: true, // Allow this column to be hidden
  },

];
