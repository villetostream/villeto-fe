"use client"

import { reimbursements } from "@/app/dashboard/expenses/page";
import { useDataTable } from "@/components/datatable/useDataTable";

export const tableData = () => {

    return useDataTable({
        initialPage: 1,
        initialPageSize: 10,
        totalItems: reimbursements.length,
        manualSorting: false,
        manualFiltering: false,
        manualPagination: false,
    });
} 