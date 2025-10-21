"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Receipt,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    MoreHorizontal
} from "lucide-react";
import { PageLoader } from "@/components/PageLoader/PageLoader";
import { DataTable } from "@/components/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "@/components/datatable/useDataTable";
import { useState } from "react";
import { Eye } from "iconsax-reactjs";
import { StatsCard } from "@/components/dashboard/landing/StatCard";
import Link from "next/link";
import ExpenseTable from "@/components/expenses/table/ExpenseTable";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import { PERMISSIONS } from "@/lib/permissions";
import ExpenseEmptyState from "@/components/expenses/EmptyState";


export const reimbursements = [
    {
        id: 1,
        description: "Client dinner at Restaurant ABC",
        amount: 145.50,
        date: "Nov 12, 2024",
        employee: "Sarah Chen",
        status: "pending",
        category: "Meals & Entertainment"
    },
    {
        id: 2,
        description: "Uber rides for business meetings",
        amount: 67.25,
        date: "Nov 10, 2024",
        employee: "Michael Rodriguez",
        status: "approved",
        category: "Transportation"
    },
    {
        id: 3,
        description: "Office supplies from Staples",
        amount: 89.99,
        date: "Nov 8, 2024",
        employee: "Emma Thompson",
        status: "declined",
        category: "Office Supplies"
    },
    {
        id: 4,
        description: "Hotel stay for conference",
        amount: 299.99,
        date: "Nov 5, 2024",
        employee: "John Smith",
        status: "approved",
        category: "Travel"
    },
    {
        id: 5,
        description: "Software license renewal",
        amount: 199.99,
        date: "Nov 3, 2024",
        employee: "Lisa Wang",
        status: "pending",
        category: "Software"
    },
    {
        id: 6,
        description: "Client dinner at Restaurant ABC",
        amount: 145.50,
        date: "Nov 12, 2024",
        employee: "Sarah Chen",
        status: "pending",
        category: "Meals & Entertainment"
    },
    {
        id: 7,
        description: "Uber rides for business meetings",
        amount: 67.25,
        date: "Nov 10, 2024",
        employee: "Michael Rodriguez",
        status: "approved",
        category: "Transportation"
    },
    {
        id: 8,
        description: "Office supplies from Staples",
        amount: 89.99,
        date: "Nov 8, 2024",
        employee: "Emma Thompson",
        status: "draft",
        category: "Office Supplies"
    },
    {
        id: 9,
        description: "Hotel stay for conference",
        amount: 299.99,
        date: "Nov 5, 2024",
        employee: "John Smith",
        status: "paid",
        category: "Travel"
    },
    {
        id: 10,
        description: "Software license renewal",
        amount: 199.99,
        date: "Nov 3, 2024",
        employee: "Lisa Wang",
        status: "pending",
        category: "Software"
    }
];

export type Reimbursement = typeof reimbursements[0];

export default function Reimbursements() {







    return (
        <>
            <PermissionGuard requiredPermissions={[PERMISSIONS.VIEW_EMPLOYEE_DASHBOARD]}>
                <ExpenseEmptyState />
            </PermissionGuard>

        </>


    );
}