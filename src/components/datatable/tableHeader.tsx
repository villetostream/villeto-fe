import React, { JSX } from "react";

import { Filter, FilterData } from "./filter";
import { Download, SearchIcon } from "lucide-react";

export interface ITableHeader {
  isSearchable?: boolean;
  isExportable?: boolean;
  isFilter?: boolean;
  actionButton?: JSX.Element;
  downloadExportDataFunc?: () => Promise<Record<string, unknown>[]>;
  searchQuery?: (e: any) => void;
  search?: string;
  filterProps?: {
    title: string;
    filterData: FilterData[];
    onFilter: (data: Record<string, unknown>) => void;
  };
  bulkActions?: { label: string; onClick: () => void }[];
}

export function TableHeader({
  tableHeader,
  handleExport,
  selectedCount = 0,
  selectedData = [],
}: {
  tableHeader?: ITableHeader;
  handleExport: () => void;
  selectedCount?: number;
  selectedData?: any[];
}) {

  return (
    <div>
      {/* Bulk Actions Bar - Show when items are selected */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
              </span>
              <div className="flex space-x-2">
                {tableHeader?.bulkActions?.map((bulkAction) => (
                  <button
                    key={bulkAction.label}
                    onClick={bulkAction.onClick}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                  >
                    {bulkAction.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md mb-4 bg-white">
        {tableHeader?.isSearchable && (
          <div
            className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary w-full sm:w-4/5 my-1.5 mx-1`}
          >
            <span className="pl-3 text-gray-400 mt-2">
              <SearchIcon />
            </span>

            <input
              id="searchInput"
              type="text"
              placeholder="Search..."
              value={tableHeader.search}
              onChange={(e) => tableHeader.searchQuery?.(e.target.value)}
              className="px-1 py-2 !w-full !focus:outline-none bg-transparent !focus:ring-0 in-focus-visible:ring-0 border-0"
            />
          </div>
        )}

        <div className="flex sm:flex-row flex-col justify-end gap-4 w-full pr-1">
          <div className="flex gap-4">
            {tableHeader?.isFilter && (
              <>
                {tableHeader?.filterProps && (
                  <Filter filterProps={tableHeader.filterProps} />
                )}
              </>
            )}
            {tableHeader?.isExportable && (
              <div
                onClick={handleExport}
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                <Download />
              </div>
            )}
          </div>

          {tableHeader?.actionButton && <div>{tableHeader.actionButton}</div>}
        </div>
      </div>
    </div>
  );
}
