import React, { useState, useMemo } from 'react'
import { DataTable } from '@/components/datatable';
import { columns } from './column';
import { useDataTable } from '@/components/datatable/useDataTable';
import { Role, useGetAllRolesApi } from '@/actions/role/get-all-roles';

const RoleTable = () => {

    const depts = useGetAllRolesApi()
    
    const roles: Role[] = depts?.data?.data ?? [];
    
    // We create tableProps outside useMemo but passing initial length. 
    // Wait, the hook `tableData(data)` creates it.
    // However, length might change so we override total later.
    const tableprops = tableData(roles);

    const filteredRoles = useMemo(() => {
        let result = roles;

        if (tableprops.globalSearch) {
            const searchLower = tableprops.globalSearch.toLowerCase();
            result = result.filter(r => {
                const nameMatch = (r.name || "").toLowerCase().includes(searchLower);
                const descMatch = (r.description || "").toLowerCase().includes(searchLower);
                return nameMatch || descMatch;
            });
        }

        const filters = tableprops.filterBy || {};
        if (filters.status && filters.status !== "all") {
            const isActiveFilter = filters.status.toLowerCase() === "active";
            // Check status against boolean isActive
            result = result.filter(r => {
                const isActive = r.isActive === true;
                return isActive === isActiveFilter;
            });
        }

        return result;
    }, [roles, tableprops.globalSearch, tableprops.filterBy]);

    // Track totalItems
    useMemo(() => {
        tableprops.setTotalItems(filteredRoles.length);
    }, [filteredRoles.length]);

    return (
        <DataTable
            data={filteredRoles}
            isLoading={depts.isLoading}
            columns={columns}
            paginationProps={{ ...tableprops.paginationProps, total: filteredRoles.length }}
            enableRowSelection={true}
            enableColumnVisibility={true}
            selectedDataIds={tableprops.selectedDataIds}
            setSelectedDataIds={tableprops.setSelectedDataIds}
            tableHeader={{
                actionButton: <></>,
                isSearchable: true,
                isExportable: false,
                isFilter: true,
                enableColumnVisibility: true,
                search: tableprops.globalSearch,
                searchQuery: tableprops.setGlobalSearch,
                filterProps: {
                    title: "Filter Roles",
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
                    onFilter: (filters: Record<string, any>) => {
                        const unwrapped: Record<string, any> = {};
                        Object.entries(filters).forEach(([key, value]) => {
                            const match = key.match(/filters\[(.*?)\]/);
                            if (match) unwrapped[match[1]] = value;
                            else unwrapped[key] = value;
                        });
                        tableprops.setFilterBy(unwrapped);
                        tableprops.setPage(1);
                    },
                },
                bulkActions: [

                ],

            }}
        />
    )
}

export default RoleTable

export const tableData = (data: Role[]) => {

    return useDataTable({
        initialPage: 1,
        initialPageSize: 10,
        totalItems: data.length,
        manualSorting: false,
        manualFiltering: false,
        manualPagination: false,
    });
} 