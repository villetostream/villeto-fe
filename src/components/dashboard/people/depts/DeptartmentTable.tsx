import React, { useState } from 'react'
import { DataTable } from '@/components/datatable';
import { columns } from './column';
import { Department, useGetAllDepartmentsApi } from '@/actions/departments/get-all-departments';
import { useDataTable } from '@/components/datatable/useDataTable';

const DepartmentTable = () => {

    const depts = useGetAllDepartmentsApi()
    const tableprops = tableData(depts?.data?.data ?? []);
    return (
        <DataTable
            data={depts?.data?.data ?? []}
            isLoading={depts.isLoading}
            columns={columns}
            paginationProps={{ ...tableprops.paginationProps, total: depts?.data?.meta.totalCount ?? 0 }}
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
                    title: "Filter Departments",
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

export default DepartmentTable

export const tableData = (data: Department[]) => {

    return useDataTable({
        initialPage: 1,
        initialPageSize: 10,
        totalItems: data.length,
        manualSorting: false,
        manualFiltering: false,
        manualPagination: false,
    });
} 