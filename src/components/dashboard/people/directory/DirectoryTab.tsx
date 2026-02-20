"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FolderX } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload04Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllUsersApi } from "@/actions/users/get-all-users";
import { AppUser } from "@/actions/departments/get-all-departments";
import { DataTable } from "@/components/datatable";
import { useDataTable } from "@/components/datatable/useDataTable";
import { directoryColumns } from "./directory-columns";

// Define getRowId outside the component to ensure referential stability and prevent infinite loops in DataTable
const getRowId = (row: AppUser) => row.userId;

export function DirectoryTab() {
    const usersApi = useGetAllUsersApi();
    const router = useRouter();

    const users: AppUser[] = usersApi?.data?.data ?? [];
    const isLoading = usersApi.isLoading;
    const totalCount = usersApi?.data?.meta?.totalCount ?? 0;

    const tableProps = useDataTable({
        initialPage: 1,
        initialPageSize: 10,
        totalItems: totalCount, // Use totalCount from API for server-side pagination awareness
        manualSorting: false,
        manualFiltering: false,
        manualPagination: false,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-md" />
                ))}
            </div>
        );
    }

    // Empty state
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-lg border">
                {/* Empty content */}
                <div className="flex flex-col items-center justify-center py-24 px-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                        <FolderX className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Organization Directory is Empty</h3>
                    <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
                        You haven&apos;t upload your directory, do that and invite you employees from it.
                    </p>
                    <Button
                        onClick={() => router.push("/people/invite/employees?step=upload")}
                        className="bg-primary hover:bg-primary/90 gap-2"
                    >
                        <HugeiconsIcon icon={Upload04Icon} className="h-4 w-4" />
                        Upload Directory
                    </Button>
                </div>
            </div>
        );
    }

    // Data state — uses DataTable matching AllUsersTab pattern
    return (
        <div className="space-y-4">
            <DataTable
                data={users}
                isLoading={isLoading}
                columns={directoryColumns}
                paginationProps={{ ...tableProps.paginationProps, total: totalCount }}
                enableRowSelection={true}
                enableColumnVisibility={true}
                selectedDataIds={tableProps.selectedDataIds}
                setSelectedDataIds={tableProps.setSelectedDataIds}
                getRowId={getRowId}
                tableHeader={{
                    actionButton: <></>,
                    isSearchable: true,
                    isExportable: false,
                    isFilter: true,
                    enableColumnVisibility: true,
                    search: tableProps.globalSearch,
                    searchQuery: tableProps.setGlobalSearch,
                    filterProps: {
                        title: "Filter Directory",
                        filterData: [
                            {
                                name: "status",
                                label: "Status",
                                type: "select",
                                options: [
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                ],
                            },
                        ],
                        onFilter: (filters) => {
                            console.log("Filters:", filters);
                        },
                    },
                    bulkActions: [],
                }}
            />
        </div>
    );
}
