"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/datatable";
import { useDataTable } from "@/components/datatable/useDataTable";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

type OtherSourceBill = {
  invoiceId: string;
  vendor: string;
  source: string;
  billPurchase: string;
  amount: string;
  dueDate: string;
  status: string;
};

const mockOtherSources: OtherSourceBill[] = [
  { invoiceId: "INV-00041", vendor: "Acme Ltd", source: "Email", billPurchase: "Cloud Services", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Paid" },
  { invoiceId: "INV-00039", vendor: "Delta Services", source: "Manual", billPurchase: "Office Supplies", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Approved" },
  { invoiceId: "INV-00039", vendor: "Nova Tech", source: "Email", billPurchase: "Advisory Services", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Ready for Payment" },
  { invoiceId: "INV-00039", vendor: "Zenith Corp", source: "Manual", billPurchase: "Software Subscription", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Awaiting Approval" },
  { invoiceId: "INV-00039", vendor: "Delta Services", source: "Email", billPurchase: "Equipment Lease", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Approved" },
  { invoiceId: "INV-00039", vendor: "Pinnacle Ltd", source: "Manual", billPurchase: "Monthly Stationery", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Ready for Payment" },
  { invoiceId: "INV-00039", vendor: "Delta Services", source: "Email", billPurchase: "Software Subscription", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Approved" },
  { invoiceId: "INV-00039", vendor: "Atlas Partners", source: "Manual", billPurchase: "Equipment Lease", amount: "₦4,200,000.00", dueDate: "10 Sept 2025", status: "Paid" },
];

const columnHelper = createColumnHelper<OtherSourceBill>();

export function OtherSourcesTable() {
  const router = useRouter();
  const tableprops = useDataTable({
    initialPage: 1,
    totalItems: 0,
    manualSorting: false,
    manualFiltering: false,
    manualPagination: false,
  });

  const filteredSources = useMemo(() => {
    let result = mockOtherSources;
    if (tableprops.globalSearch) {
      const searchLower = tableprops.globalSearch.toLowerCase();
      result = result.filter(r => 
        r.invoiceId.toLowerCase().includes(searchLower) || 
        r.vendor.toLowerCase().includes(searchLower) ||
        r.billPurchase.toLowerCase().includes(searchLower) ||
        r.source.toLowerCase().includes(searchLower)
      );
    }
    return result;
  }, [tableprops.globalSearch]);

  useEffect(() => {
    tableprops.setTotalItems(filteredSources.length);
  }, [filteredSources.length, tableprops.setTotalItems]);

  const columns = useMemo(() => [
    columnHelper.accessor("invoiceId", {
      header: "INVOICE ID",
      cell: (info) => <p className="text-gray-500">{info.getValue()}</p>,
    }),
    columnHelper.accessor("vendor", {
      header: "VENDOR NAME",
      cell: (info) => <p className="font-bold text-gray-900">{info.getValue()}</p>,
    }),
    columnHelper.accessor("source", {
      header: "SOURCE",
      cell: (info) => <p className="text-gray-500">{info.getValue()}</p>,
    }),
    columnHelper.accessor("billPurchase", {
      header: "BILL / PURCHASE",
      cell: (info) => <p className="text-gray-500">{info.getValue()}</p>,
    }),
    columnHelper.accessor("amount", {
      header: "AMOUNT",
      cell: (info) => <p className="font-bold text-gray-900">{info.getValue()}</p>,
    }),
    columnHelper.accessor("dueDate", {
      header: "DUE DATE",
      cell: (info) => <p className="text-gray-500">{info.getValue()}</p>,
    }),
    columnHelper.accessor("status", {
      header: "STATUS",
      cell: (info) => {
        const status = info.getValue().toLowerCase();
        if (status === "awaiting approval") {
          return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50 font-normal">Awaiting Approval</Badge>;
        } else if (status === "approved") {
          return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-50 font-normal">Approved</Badge>;
        } else if (status === "paid") {
          return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-normal">Paid</Badge>;
        } else if (status === "ready for payment") {
          return <Badge variant="outline" className="bg-[#f0f4ff] text-[#4b7cf3] border-[#d8e2fd] hover:bg-[#f0f4ff] font-normal">Ready for Payment</Badge>;
        }
        return <Badge variant="outline">{info.getValue()}</Badge>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "ACTION",
      enableHiding: false,
      cell: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    }),
  ], []);

  return (
    <DataTable
      data={filteredSources}
      manualPagination={false}
      columns={columns as any}
      paginationProps={tableprops.paginationProps}
      enableRowSelection={false}
      enableColumnVisibility={false}
      selectedDataIds={tableprops.selectedDataIds}
      setSelectedDataIds={tableprops.setSelectedDataIds}
      onRowClick={(row) => router.push(`/bill-pay/invoice/${(row as OtherSourceBill).invoiceId}`)}
      tableHeader={{
        actionButton: <></>,
        isSearchable: true,
        isExportable: false,
        isFilter: true,
        enableColumnVisibility: false,
        search: tableprops.globalSearch,
        searchQuery: tableprops.setGlobalSearch,
        filterProps: {
          title: "Filter",
          filterData: [],
          onFilter: () => {
            tableprops.setPage(1);
          },
        },
        bulkActions: [],
      }}
    />
  );
}
