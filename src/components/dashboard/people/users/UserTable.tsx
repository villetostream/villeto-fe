import React, { useState } from 'react'
import { DataTable } from '@/components/datatable';
import { columns } from './column';
import { useDataTable } from '@/components/datatable/useDataTable';
import { Role, useGetAllRolesApi } from '@/actions/role/get-all-roles';
import { useGetAllUsersApi } from '@/actions/users/get-all-users';
import { AppUser } from '@/actions/departments/get-all-departments';

const UsersTable = () => {

    const users = useGetAllUsersApi()
    const tableprops = tableData(users?.data?.data ?? []);

    return (
        <DataTable
            data={users?.data?.data ?? []}
            isLoading={users.isLoading}
            columns={columns}
            paginationProps={{ ...tableprops.paginationProps, total: users?.data?.meta.totalCount ?? 0 }}
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
                                { label: "Meals & Entertainment", value: "Meals & Entertainment" },
                                { label: "Transportation", value: "Transportation" },
                                { label: "Office Supplies", value: "Office Supplies" },
                                { label: "Travel", value: "Travel" },
                                { label: "Software", value: "Software" },
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

export default UsersTable

export const tableData = (data: AppUser[]) => {

    return useDataTable({
        initialPage: 1,
        initialPageSize: 10,
        totalItems: data.length,
        manualSorting: false,
        manualFiltering: false,
        manualPagination: false,
    });
} 