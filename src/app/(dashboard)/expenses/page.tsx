"use client";

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
  MoreHorizontal,
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

import ExpenseEmptyState from "@/components/expenses/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewExpenseButtonTrigger from "@/components/expenses/NewExpenseButtonTrigger";

export const reimbursements = [
  {
    id: 1,
    description: "Client dinner at Restaurant ABC",
    amount: 145.5,
    date: "Nov 12, 2024",
    employee: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-chen",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "pending",
    category: "Meals & Entertainment",
  },
  {
    id: 2,
    description: "Uber rides for business meetings",
    amount: 67.25,
    date: "Nov 10, 2024",
    employee: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-rodriguez",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "approved",
    category: "Transportation",
  },
  {
    id: 3,
    description: "Office supplies from Staples",
    amount: 89.99,
    date: "Nov 8, 2024",
    employee: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-thompson",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "declined",
    category: "Office Supplies",
  },
  {
    id: 4,
    description: "Hotel stay for conference",
    amount: 299.99,
    date: "Nov 5, 2024",
    employee: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john-smith",
    department: { departmentName: "Finance", departmentId: 4 },
    status: "approved",
    category: "Travel",
  },
  {
    id: 5,
    description: "Software license renewal",
    amount: 199.99,
    date: "Nov 3, 2024",
    employee: "Lisa Wang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-wang",
    department: { departmentName: "IT", departmentId: 5 },
    status: "pending",
    category: "Software",
  },
  {
    id: 6,
    description: "Client dinner at Restaurant ABC",
    amount: 145.5,
    date: "Nov 12, 2024",
    employee: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-chen",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "pending",
    category: "Meals & Entertainment",
  },
  {
    id: 7,
    description: "Uber rides for business meetings",
    amount: 67.25,
    date: "Nov 10, 2024",
    employee: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-rodriguez",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "approved",
    category: "Transportation",
  },
  {
    id: 8,
    description: "Office supplies from Staples",
    amount: 89.99,
    date: "Nov 8, 2024",
    employee: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-thompson",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "draft",
    category: "Office Supplies",
  },
  {
    id: 9,
    description: "Hotel stay for conference",
    amount: 299.99,
    date: "Nov 5, 2024",
    employee: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john-smith",
    department: { departmentName: "Finance", departmentId: 4 },
    status: "paid",
    category: "Travel",
  },
  {
    id: 10,
    description: "Software license renewal",
    amount: 199.99,
    date: "Nov 3, 2024",
    employee: "Lisa Wang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-wang",
    department: { departmentName: "IT", departmentId: 5 },
    status: "pending",
    category: "Software",
  },
];

export type Reimbursement = (typeof reimbursements)[0];

export default function Reimbursements() {
  return (
    <>
      <Tabs defaultValue="company-expenses">
        <TabsList className="mb-10">
          <TabsTrigger value="company-expenses">Company Expenses</TabsTrigger>
          <TabsTrigger value="personal-expenses">Personal Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="personal-expenses">
          <PermissionGuard requiredPermissions={[]}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
                <StatsCard
                  title="Draft"
                  value="4"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#384A57] rounded-full">
                        <img src={"/images/svgs/draft.svg"} alt="draft icon" />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      Manage your saved items
                    </span>
                  }
                />
                <StatsCard
                  title="Approved"
                  value="10"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#418341] rounded-full text-white">
                        <img src={"/images/svgs/check.svg"} alt="check icon" />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      View all items that have been reviewed.
                    </span>
                  }
                />
                <StatsCard
                  title="Submitted"
                  value="6"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#5A67D8] rounded-full">
                        <img
                          src={"/images/svgs/submitted.svg"}
                          alt="submitted icon"
                        />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      Track entries that have been sent for review
                    </span>
                  }
                  trend="up"
                />
                <StatsCard
                  title="Paid"
                  value="10"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#38B2AC] rounded-full text-white">
                        <img
                          src={"/images/svgs/money.svg"}
                          alt="money icon"
                          className="text-white"
                        />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      Access records of completed payments.
                    </span>
                  }
                />
              </div>
              <ExpenseEmptyState />
            </div>
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="company-expenses">
          <PermissionGuard requiredPermissions={[]}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
                <StatsCard
                  title="Total Expenses"
                  value="4"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#384A57] rounded-full">
                        <img src={"/images/svgs/draft.svg"} alt="draft icon" />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      All expenses submitted this month
                    </span>
                  }
                />
                <StatsCard
                  title="Pending Approvals"
                  value="10"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#F45B69] rounded-full text-white">
                        <img
                          src={"/images/receipt-pending.png"}
                          alt="pending icon"
                        />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      Awaiting review.
                    </span>
                  }
                />
                <StatsCard
                  title="Approved Expenses"
                  value="6"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#5A67D8] rounded-full">
                        <img
                          src={"/images/svgs/submitted.svg"}
                          alt="submitted icon"
                        />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      Cleared and ready for payment
                    </span>
                  }
                  trend="up"
                />
                <StatsCard
                  title="Paid"
                  value="10"
                  icon={
                    <>
                      <div className="p-1 mr-3 flex items-center justify-center bg-[#38B2AC] rounded-full text-white">
                        <img
                          src={"/images/svgs/money.svg"}
                          alt="money icon"
                          className="text-white"
                        />
                      </div>
                    </>
                  }
                  subtitle={
                    <span className="text-xs leading-[125%]">
                      Completed & reimbursed transactions
                    </span>
                  }
                />
              </div>
              {/* <ExpenseTable actionButton={<><NewExpenseButtonTrigger /></>} /> */}
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
                <TabsContent value="draft">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
                <TabsContent value="submitted">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
                <TabsContent value="approved">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
                <TabsContent value="rejected">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
                <TabsContent value="pending">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
                <TabsContent value="paid">
                  <ExpenseTable actionButton={<></>} />
                </TabsContent>
              </Tabs>
            </div>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </>
  );
}
