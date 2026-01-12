import React, { ReactNode, useState, useEffect } from "react";
import { useDataTable } from "@/components/datatable/useDataTable";
import NewExpenseButtonTrigger from "../NewExpenseButtonTrigger";
import { columns } from "./column";
import { DataTable } from "@/components/datatable";
import { reimbursements } from "@/app/(dashboard)/expenses/page";

const ExpenseTable = ({
  actionButton = <></>,
  statusFilter = null,
}: {
  actionButton: React.ReactElement;
  statusFilter?: string | null;
}) => {
  const [filteredData, setFilteredData] = useState(reimbursements);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const tableprops = useDataTable({
    initialPage: 1,
    initialPageSize: 10,
    totalItems: reimbursements.length,
    manualSorting: false,
    manualFiltering: false,
    manualPagination: false,
  });
  const { globalSearch, setTotalItems } = tableprops;

  // Combine search and filter logic
  useEffect(() => {
    let filtered = [...reimbursements];

    // Apply status filter from tab
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply search filter
    if (globalSearch && globalSearch.trim() !== "") {
      const searchTerm = globalSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.description?.toLowerCase().includes(searchTerm) ||
          item.employee?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm) ||
          item.amount?.toString().includes(searchTerm) ||
          item.date?.toLowerCase().includes(searchTerm) ||
          item.status?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter from dropdown
    if (appliedFilters["filters[status]"]) {
      filtered = filtered.filter(
        (item) => item.status === appliedFilters["filters[status]"]
      );
    }

    // Apply category filter
    if (appliedFilters["filters[category]"]) {
      filtered = filtered.filter(
        (item) => item.category === appliedFilters["filters[category]"]
      );
    }

    setFilteredData(filtered);
    setTotalItems(filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalSearch, appliedFilters, statusFilter]);
  return (
    <DataTable
      data={filteredData}
      columns={columns}
      paginationProps={tableprops.paginationProps}
      enableRowSelection={true}
      enableColumnVisibility={true}
      selectedDataIds={tableprops.selectedDataIds}
      setSelectedDataIds={tableprops.setSelectedDataIds}
      tableHeader={{
        actionButton: actionButton,
        isSearchable: true,
        isExportable: false,
        isFilter: true,
        enableColumnVisibility: true,
        search: tableprops.globalSearch,
        searchQuery: tableprops.setGlobalSearch,
        filterProps: {
          title: "Reimbursements",
          filterData: [
            {
              name: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Declined", value: "declined" },
              ],
            },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: [
                {
                  label: "Meals & Entertainment",
                  value: "Meals & Entertainment",
                },
                { label: "Transportation", value: "Transportation" },
                { label: "Office Supplies", value: "Office Supplies" },
                { label: "Travel", value: "Travel" },
                { label: "Software", value: "Software" },
              ],
            },
          ],
          onFilter: (filters) => {
            console.log("Filters applied:", filters);
            setAppliedFilters(filters);
          },
        },
        bulkActions: [
          {
            label: "Approve Selected",
            onClick: () => {
              console.log(
                "Approving selected items:",
                Array.from(tableprops.selectedDataIds)
              );
            },
          },
          {
            label: "Decline Selected",
            onClick: () => {
              console.log(
                "Declining selected items:",
                Array.from(tableprops.selectedDataIds)
              );
            },
          },
        ],
      }}
    />
  );
};

export default ExpenseTable;
