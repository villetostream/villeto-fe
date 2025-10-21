import { useReducer, useMemo } from "react";

export interface SortState {
  id: string;
  desc: boolean;
}

export interface UseDataTableOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: SortState[];
  initialSearch?: string;
  initialFilterBy?: Record<string, string>;
  totalItems?: number;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
}

interface DataTableState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sortBy: SortState[];
  globalSearch: string;
  filterBy: Record<string, string>;
  selectedDataIds: Set<string>;
}

type DataTableAction =
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_PAGE_SIZE"; pageSize: number }
  | { type: "SET_TOTAL_ITEMS"; totalItems: number }
  | { type: "SET_SORT_BY"; sort: SortState[] }
  | { type: "SET_GLOBAL_SEARCH"; search: string }
  | { type: "SET_FILTER_BY"; filter: Record<string, string> }
  | { type: "RESET_TABLE"; options: UseDataTableOptions }
  | { type: "SET_SELECTED_DATA_IDS"; selectedIds: Set<string> };

function dataTableReducer(
  state: DataTableState,
  action: DataTableAction
): DataTableState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.pageSize };
    case "SET_TOTAL_ITEMS":
      return {
        ...state,
        totalItems: action.totalItems,
        totalPages: Math.max(1, Math.ceil(action.totalItems / state.pageSize)),
      };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.sort };
    case "SET_GLOBAL_SEARCH":
      return { ...state, globalSearch: action.search };
    case "SET_FILTER_BY":
      return { ...state, filterBy: action.filter };
    case "SET_SELECTED_DATA_IDS":
      return { ...state, selectedDataIds: action.selectedIds };
    case "RESET_TABLE": {
      const {
        initialPage = 1,
        initialPageSize = 10,
        initialSortBy = [],
        initialSearch = "",
        initialFilterBy = {},
        totalItems = 0,
      } = action.options || {};
      return {
        page: initialPage,
        pageSize: initialPageSize,
        totalPages: Math.max(1, Math.ceil(totalItems / initialPageSize)),
        totalItems,
        sortBy: initialSortBy,
        globalSearch: initialSearch,
        filterBy: initialFilterBy,
        selectedDataIds: new Set<string>(),
      };
    }
    default:
      return state;
  }
}

export function useDataTable(options?: UseDataTableOptions) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSortBy = [],
    initialSearch = "",
    initialFilterBy = {},
    totalItems = 0,
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,
  } = options || {};

  const [state, dispatch] = useReducer(dataTableReducer, {
    page: initialPage,
    pageSize: initialPageSize,
    totalPages: Math.max(1, Math.ceil(totalItems / initialPageSize)),
    totalItems,
    sortBy: initialSortBy,
    globalSearch: initialSearch,
    filterBy: initialFilterBy,
    selectedDataIds: new Set<string>(),
  });

  // Memoize paginationProps for use in DataTable
  const paginationProps = useMemo(
    () => ({
      page: state.page,
      pageSize: state.pageSize,
      total: state.totalItems,
      setPage: (page: number) => dispatch({ type: "SET_PAGE", page }),
      setPageSize: (size: number) =>
        dispatch({ type: "SET_PAGE_SIZE", pageSize: size }),
    }),
    [state.page, state.pageSize, state.totalItems]
  );

  // Expose all state and actions
  return {
    ...state,
    setPage: (page: number) => dispatch({ type: "SET_PAGE", page }),
    setPageSize: (size: number) =>
      dispatch({ type: "SET_PAGE_SIZE", pageSize: size }),
    setTotalItems: (total: number) =>
      dispatch({ type: "SET_TOTAL_ITEMS", totalItems: total }),
    setSortBy: (sort: SortState[]) => dispatch({ type: "SET_SORT_BY", sort }),
    setGlobalSearch: (search: string) =>
      dispatch({ type: "SET_GLOBAL_SEARCH", search }),
    setFilterBy: (filter: Record<string, string>) =>
      dispatch({ type: "SET_FILTER_BY", filter }),
    setSelectedDataIds: (selectedIds: Set<string>) =>
      dispatch({ type: "SET_SELECTED_DATA_IDS", selectedIds }),
    resetTable: () => dispatch({ type: "RESET_TABLE", options: options || {} }),
    paginationProps,
    manualSorting,
    manualFiltering,
    manualPagination,
  };
}
