import React, { useState } from 'react'
import { DataTable } from '@/components/datatable';
import { columns } from './column';
import { useDataTable } from '@/components/datatable/useDataTable';
import { Role, useGetAllRolesApi } from '@/actions/role/get-all-roles';

const RoleTable = () => {

    const depts = useGetAllRolesApi()
    const tableprops = tableData(depts?.data?.data ?? []);
    console.log({ depts })
    return (
        <DataTable
            data={depts?.data?.data ?? []}
            isLoading={depts.isLoading}
            columns={columns}
            paginationProps={{ ...tableprops.paginationProps, total: depts?.data?.meta?.totalCount ?? 0 }}
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
                    onFilter: (filters) => {

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