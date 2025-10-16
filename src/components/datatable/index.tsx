"use client";

import React, { useMemo, useCallback, useState, type JSX } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type TableOptions,
  type PaginationState,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
// import MyLoader from "../loader-components";
import exportCSV from "@/lib/exportCSV";
import { ITableHeader, TableHeader } from "./tableHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const PAGE_SIZE_OPTIONS = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
];

export type DataTableProps<Data extends object, Value = unknown> = {
  data: Data[];
  columns: ColumnDef<Data, Value>[];
  paginationProps?: {
    page: number;
    pageSize: number;
    total: number;
    setPage: (e: number) => void;
    setPageSize: (e: number) => void;
  };
  tableProps?: Partial<TableOptions<Data>>;
  isLoading?: boolean;
  manualPagination?: boolean;
  initialSorting?: SortingState;
  height?: string | number;
  tableHeader?: ITableHeader;
  selectedDataIds?: Set<string>;
  setSelectedDataIds?: (selection: Set<string>) => void;
  enableRowSelection?: boolean;
  getRowId?: (row: Data) => string;
};

function DataTable<Data extends object, Value = unknown>(
  props: DataTableProps<Data, Value> & {
    onSearch?: (query: string) => void;
    onFilter?: (filters: Record<string, any>) => void;
    showCreateBulkButton?: boolean;
    onCreateBulk?: () => void;
  }
): JSX.Element {
  const {
    data,
    columns,
    paginationProps,
    tableProps,
    isLoading,
    manualPagination = false,
    height = "400px",
    initialSorting = [],
    tableHeader,
    selectedDataIds = new Set(),
    setSelectedDataIds,
    enableRowSelection = false,
    getRowId = (row: any) => row.id || row._id,
  } = props;

  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: paginationProps ? paginationProps.page - 1 : 0,
      pageSize: paginationProps?.pageSize || 10,
    }),
    [paginationProps?.page, paginationProps?.pageSize]
  );

  const table = useReactTable({
    columns: memoizedColumns,
    data: memoizedData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, pagination },
    manualPagination,
    onSortingChange: setSorting,
    enableRowSelection: false, // We'll handle this manually
    pageCount: paginationProps
      ? Math.ceil(paginationProps.total / pagination.pageSize)
      : -1,
    ...tableProps,
  });

  const rowModel = table.getRowModel();

  // Get selected data for bulk actions
  const selectedData = useMemo(() => {
    return data.filter((row) => selectedDataIds.has(getRowId(row)));
  }, [data, selectedDataIds, getRowId]);

  const handleRowChange = useCallback(
    (e: { value: string[] }) => {
      paginationProps?.setPageSize?.(Number(e.value[0]));
    },
    [paginationProps]
  );

  const handleExport = async () => {
    if (tableHeader?.downloadExportDataFunc) {
      const exportData = await tableHeader.downloadExportDataFunc();
      exportCSV(exportData, "exported-data");
      return;
    }
    exportCSV(data, "exported-data");
  };

  //  pagination helpers here
  const currentPage = paginationProps?.page ?? 1;
  const pageSize = paginationProps?.pageSize ?? 10;
  const total = paginationProps?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const getPageNumbers = (current: number, total: number) => {
    const delta = 2; // how many pages before/after current
    const pages: number[] = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col w-full border">
      <TableHeader
        tableHeader={tableHeader}
        handleExport={handleExport}
        selectedCount={selectedDataIds.size}
        selectedData={selectedData}
      />
      <div
        className="overflow-x-auto rounded-md border bg-white h-full "

      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={`px-4 py-3 text-center text-xs font-semibold text-gray-700  tracking-wider cursor-${canSort ? "pointer" : "default"
                        } select-none`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSorted && (
                          <span className="ml-1">
                            {isSorted === "asc" ? <FaSortUp /> : <FaSortDown />}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!isLoading ? (
              rowModel.rows.length > 0 ? (
                rowModel.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 whitespace-nowrap text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={memoizedColumns.length}
                    className="text-center py-20 text-lg"
                  >
                    Oops, No data available!!!
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td
                  colSpan={memoizedColumns.length}
                  className="text-center py-20"
                >
                  <p>Loading...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {paginationProps?.total ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 py-2 px-4 rounded-b-md w-full mt-[-6px]">
            <div className="w-full md:w-auto mb-2 md:mb-0">
              <Select
                value={String(paginationProps.pageSize)}
                onValueChange={(value) => { handleRowChange({ value: [value] }); paginationProps.setPage(1) }}
              >
                <SelectTrigger className="w-fit min-w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full md:w-auto justify-end gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        paginationProps.setPage(Math.max(1, paginationProps.page - 1))
                      }}
                      href="#"
                      isDisabled={currentPage === 1}
                      isActive={currentPage > 1} size={"sm"} />
                  </PaginationItem>
                  {/* First page + Ellipsis */}
                  {pageNumbers[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          onClick={(e) => {
                            e.preventDefault();
                            paginationProps.setPage(1)

                          }}
                          href="#"

                          isActive={1 === paginationProps.page} size={"sm"}                  >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {pageNumbers[0] > 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}
                  <div className="hidden md:flex ">

                    {/* Visible page numbers */}
                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          className={`${paginationProps.page !== page ? "text-muted-foreground" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            paginationProps.setPage(page)
                          }}
                          href="#"

                          isActive={page === paginationProps.page} size={"sm"}                >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Ellipsis + Last page */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <PaginationItem><PaginationEllipsis /></PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            size="sm"
                            isActive={totalPages === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              paginationProps?.setPage(totalPages);
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                  </div>
                  <div className="md:hidden block">
                    {/* Current Page - always visible */}
                    <PaginationItem>
                      <PaginationLink
                        isActive
                        size="sm" href={""}                >
                        {paginationProps.page}
                      </PaginationLink>
                    </PaginationItem>
                  </div>
                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        paginationProps.setPage(paginationProps.page + 1)
                      }}
                      href="#"
                      size={"sm"}
                      isActive={paginationProps.page < totalPages}
                      isDisabled={paginationProps.page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

            </div>
          </div>

        </>

      ) : null}
    </div>
  );
}

export { DataTable };
