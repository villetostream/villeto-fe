import React, { useState } from 'react'
import { tableData } from './tableData';
import NewExpenseButtonTrigger from '../NewExpenseButtonTrigger';
import { columns } from './column';
import { DataTable } from '@/components/datatable';
import { reimbursements } from '@/app/dashboard/expenses/page';

const ExpenseTable = () => {

    const [filteredData, setFilteredData] = useState(reimbursements);
    const tableprops = tableData();
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
                actionButton: <><NewExpenseButtonTrigger /></>,
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
                        console.log("Filters applied:", filters);
                        // Handle client-side filtering for demo
                        let filtered = [...reimbursements];

                        if (filters['filters[status]']) {
                            filtered = filtered.filter(item => item.status === filters['filters[status]']);
                        }

                        if (filters['filters[category]']) {
                            filtered = filtered.filter(item => item.category === filters['filters[category]']);
                        }

                        setFilteredData(filtered);
                        tableprops.setTotalItems(filtered.length);
                    },
                },
                bulkActions: [
                    {
                        label: "Approve Selected",
                        onClick: () => {
                            console.log("Approving selected items:", Array.from(tableprops.selectedDataIds));
                        },
                    },
                    {
                        label: "Decline Selected",
                        onClick: () => {
                            console.log("Declining selected items:", Array.from(tableprops.selectedDataIds));
                        },
                    },
                ],

            }}
        />
    )
}

export default ExpenseTable