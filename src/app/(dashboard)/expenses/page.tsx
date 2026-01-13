"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewExpenseButtonTrigger from "@/components/expenses/NewExpenseButtonTrigger";
import { StatsCard } from "@/components/dashboard/landing/StatCard";
import ExpenseTable from "@/components/expenses/table/ExpenseTable";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import ExpenseEmptyState from "@/components/expenses/EmptyState";

const statusMap: Record<string, string | null> = {
  all: null,
  draft: "draft",
  submitted: "pending",
  approved: "approved",
  rejected: "declined",
  pending: "pending",
  paid: "paid",
};

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
    hasReceipt: true,
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
    hasReceipt: true,
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
    hasReceipt: false,
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
    hasReceipt: true,
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
    hasReceipt: true,
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
    hasReceipt: true,
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
    hasReceipt: true,
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
    hasReceipt: false,
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
    hasReceipt: true,
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
    hasReceipt: true,
  },
  {
    id: 11,
    description: "Flight and accommodation for client visit",
    amount: 2450.75,
    date: "Nov 15, 2024",
    employee: "David Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david-martinez",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "approved",
    category: "Travel",
    hasReceipt: true,
  },
  {
    id: 12,
    description: "Annual team retreat accommodation",
    amount: 3200.0,
    date: "Nov 20, 2024",
    employee: "Jessica Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica-lee",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "pending",
    category: "Travel",
    hasReceipt: false,
  },
  {
    id: 13,
    description: "Enterprise software platform subscription",
    amount: 5999.99,
    date: "Nov 18, 2024",
    employee: "Robert Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert-taylor",
    department: { departmentName: "IT", departmentId: 5 },
    status: "approved",
    category: "Software",
    hasReceipt: true,
  },
  {
    id: 14,
    description: "Office furniture and equipment setup",
    amount: 8500.0,
    date: "Nov 22, 2024",
    employee: "Amanda White",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amanda-white",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "pending",
    category: "Office Equipment",
    hasReceipt: true,
  },
];

export type Reimbursement = (typeof reimbursements)[0];

export default function Reimbursements() {
  const [activeTab, setActiveTab] = useState("all");
  const [expenseData, setExpenseData] = useState(reimbursements);

  // Load updated statuses from localStorage on component mount
  useEffect(() => {
    const updatedReimbursements = reimbursements.map((expense) => {
      const savedStatus = localStorage.getItem(`expense-status-${expense.id}`);
      if (savedStatus) {
        return { ...expense, status: savedStatus };
      }
      return expense;
    });
    setExpenseData(updatedReimbursements);
  }, []);

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
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
              >
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
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["all"]}
                    data={expenseData}
                  />
                </TabsContent>
                <TabsContent value="draft">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["draft"]}
                    data={expenseData}
                  />
                </TabsContent>
                <TabsContent value="submitted">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["submitted"]}
                    data={expenseData}
                  />
                </TabsContent>
                <TabsContent value="approved">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["approved"]}
                    data={expenseData}
                  />
                </TabsContent>
                <TabsContent value="rejected">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["rejected"]}
                    data={expenseData}
                  />
                </TabsContent>
                <TabsContent value="pending">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["pending"]}
                    data={expenseData}
                  />
                </TabsContent>
                <TabsContent value="paid">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["paid"]}
                    data={expenseData}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </>
  );
}
