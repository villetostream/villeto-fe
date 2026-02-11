"use client";

import { useMemo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewExpenseButtonTrigger from "@/components/expenses/NewExpenseButtonTrigger";
import { StatsCard } from "@/components/dashboard/landing/StatCard";
import ExpenseTable from "@/components/expenses/table/ExpenseTable";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import {
  personalExpenseColumns,
  type PersonalExpenseRow,
} from "@/components/expenses/table/personalColumns";
import { useSearchParams, useRouter } from "next/navigation";
import ExpenseEmptyState from "@/components/expenses/EmptyState";
import { usePersonalExpenses } from "@/lib/react-query/expenses";
import { Loader2 } from "lucide-react";
import { PersonalExpensesSkeleton } from "@/components/expenses/PersonalExpensesSkeleton";

const statusMap: Record<string, string | null> = {
  all: null,
  draft: "draft",
  submitted: "pending",
  approved: "approved",
  rejected: "declined",
  pending: "pending",
  paid: "paid",
};

// Helper function to parse date strings and convert to Date object
const parseDate = (dateStr: string): Date => {
  // Handle formats like "Nov 12, 2024" and "15 Oct 2025"
  return new Date(dateStr);
};

const unsortedReimbursements = [
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
  // Batch expenses for Goodness Swift
  {
    id: 15,
    description: "Lunch with Clients",
    amount: 3000.0,
    date: "13 May 2025",
    employee: "Goodness Swift",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=goodness-swift",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "approved",
    category: "Meals & Entertainment",
    hasReceipt: true,
  },
  {
    id: 16,
    description: "Lunch with Clients",
    amount: 3000.0,
    date: "09 Sep 2025",
    employee: "Goodness Swift",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=goodness-swift",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "declined",
    category: "Meals & Entertainment",
    hasReceipt: true,
  },
  {
    id: 17,
    description: "Lunch with Clients",
    amount: 3000.0,
    date: "17 Jul 2025",
    employee: "Goodness Swift",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=goodness-swift",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "approved",
    category: "Meals & Entertainment",
    hasReceipt: true,
  },
  {
    id: 18,
    description: "Lunch with Clients",
    amount: 3000.0,
    date: "15 Oct 2025",
    employee: "Goodness Swift",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=goodness-swift",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "pending",
    category: "Meals & Entertainment",
    hasReceipt: true,
  },
  // Batch expenses for Sarah Chen
  {
    id: 19,
    description: "Trip to Abuja",
    amount: 1500.0,
    date: "20 Oct 2024",
    employee: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-chen",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "pending",
    category: "Travel",
    hasReceipt: true,
  },
  {
    id: 20,
    description: "Trip to Abuja",
    amount: 2400.0,
    date: "5 Jan 2026",
    employee: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-chen",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "approved",
    category: "Travel",
    hasReceipt: true,
  },
  {
    id: 21,
    description: "Trip to Abuja",
    amount: 2900.0,
    date: "21 Feb 2025",
    employee: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-chen",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "declined",
    category: "Travel",
    hasReceipt: true,
  },
  {
    id: 22,
    description: "Trip to Abuja",
    amount: 2500.0,
    date: "20 Oct 2025",
    employee: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-chen",
    department: { departmentName: "Sales", departmentId: 1 },
    status: "pending",
    category: "Travel",
    hasReceipt: true,
  },
  // Batch expenses for Michael Rodriguez
  {
    id: 23,
    description: "Software Subscription",
    amount: 1500.0,
    date: "27 Aug 2025",
    employee: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-rodriguez",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "approved",
    category: "Software Subscription",
    hasReceipt: true,
  },
  {
    id: 24,
    description: "Software Subscription",
    amount: 2000.0,
    date: "06 Jun 2025",
    employee: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-rodriguez",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "pending",
    category: "Software Subscription",
    hasReceipt: true,
  },
  {
    id: 25,
    description: "Software Subscription",
    amount: 4500.0,
    date: "10 Mar 2025",
    employee: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-rodriguez",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "approved",
    category: "Software Subscription",
    hasReceipt: true,
  },
  {
    id: 26,
    description: "Software Subscription",
    amount: 3300.0,
    date: "18 Oct 2025",
    employee: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael-rodriguez",
    department: { departmentName: "Marketing", departmentId: 2 },
    status: "declined",
    category: "Software Subscription",
    hasReceipt: true,
  },
  // Batch expenses for Emma Thompson
  {
    id: 27,
    description: "Conference Expenses",
    amount: 1500.0,
    date: "11 Dec 2025",
    employee: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-thompson",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "pending",
    category: "Travel",
    hasReceipt: true,
  },
  {
    id: 28,
    description: "Conference Expenses",
    amount: 2800.0,
    date: "2 Apr 2025",
    employee: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-thompson",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "approved",
    category: "Travel",
    hasReceipt: true,
  },
  {
    id: 29,
    description: "Conference Expenses",
    amount: 3000.0,
    date: "22 Oct 2025",
    employee: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma-thompson",
    department: { departmentName: "Operations", departmentId: 3 },
    status: "pending",
    category: "Travel",
    hasReceipt: true,
  },
];

// Sort reimbursements by date from most recent to oldest
export const reimbursements = unsortedReimbursements.sort((a, b) => {
  return parseDate(b.date).getTime() - parseDate(a.date).getTime();
});

export type Reimbursement = (typeof reimbursements)[0];

export default function Reimbursements() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOuterTab =
    searchParams.get("tab") === "personal-expenses"
      ? "personal-expenses"
      : "company-expenses";
  const [outerTab, setOuterTab] = useState(initialOuterTab);

  // Sync outerTab with URL parameter changes
  useEffect(() => {
    const tabFromUrl =
      searchParams.get("tab") === "personal-expenses"
        ? "personal-expenses"
        : "company-expenses";
    setOuterTab(tabFromUrl);
  }, [searchParams]);

  // Read initial page from URL for personal expenses (so back from edit/view/delete restores page)
  const pageParam = searchParams.get("page");
  const initialPage =
    pageParam && /^\d+$/.test(pageParam)
      ? Math.max(1, parseInt(pageParam, 10))
      : 1;

  // Update URL when tab changes (but not on initial mount to avoid conflicts)
  const handleTabChange = (value: string) => {
    setOuterTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    if (value === "personal-expenses" && page > 1) {
      params.set("page", String(page));
    } else if (value !== "personal-expenses") {
      params.delete("page");
    }
    router.replace(`/expenses?${params.toString()}`, { scroll: false });
  };

  const [activeTab, setActiveTab] = useState("all");
  const [expenseData, setExpenseData] = useState(reimbursements);
  const [filteredExpenseData, setFilteredExpenseData] =
    useState(reimbursements);
  const [personalExpenses, setPersonalExpenses] = useState<
    PersonalExpenseRow[]
  >([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(100); // High limit to fetch all data for accurate stats and client-side sorting/filtering

  // Persist current tab and page so back from edit/view/delete can restore
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("expensesReturnTab", outerTab);
    sessionStorage.setItem("expensesReturnPage", String(page));
  }, [outerTab, page]);

  // Sync page with URL when searchParams.page changes (e.g. user navigated back with ?page=2)
  useEffect(() => {
    const p = searchParams.get("page");
    if (p && /^\d+$/.test(p)) {
      const num = parseInt(p, 10);
      if (num >= 1 && num !== page) setPage(num);
    }
  }, [searchParams]);

  // Fetch personal expenses using React Query
  const { data: personalExpensesData, isLoading: isLoadingPersonalExpenses } =
    usePersonalExpenses(page, limit);

  // Helper function to format date to user-friendly format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Transform API data to PersonalExpenseRow format
  useEffect(() => {
    if (personalExpensesData?.reports) {
      // Sort reports by createdAt date in descending order (most recent first)
      const sortedReports = [...personalExpensesData.reports].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Most recent first
      });

      const transformedExpenses: PersonalExpenseRow[] = sortedReports.map(
        (report) => ({
          date: formatDate(report.createdAt),
          reportName: report.reportTitle,
          category:
            report.costCenter && report.costCenter.trim()
              ? report.costCenter
              : "Uncategorized", // Use costCenter if available, otherwise Uncategorized
          amount: report.totalAmount,
          status: report.status,
          reportId: report.reportId, // Use reportId for navigation to detail page
        }),
      );
      setPersonalExpenses(transformedExpenses);
    }
  }, [personalExpensesData]);

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
    setFilteredExpenseData(updatedReimbursements);
  }, []);

  // Calculate stats based on current data
  const calculateStats = (data: typeof reimbursements) => {
    const totalExpenses = data.length;
    const pendingApprovals = data.filter(
      (item) => item.status === "pending",
    ).length;
    const approvedExpenses = data.filter(
      (item) => item.status === "approved",
    ).length;
    const paidExpenses = data.filter((item) => item.status === "paid").length;

    return {
      totalExpenses,
      pendingApprovals,
      approvedExpenses,
      paidExpenses,
    };
  };

  // Use filtered data for stats if available, otherwise use all data
  const stats = calculateStats(filteredExpenseData);

  // Handle filtered data changes from ExpenseTable
  const handleFilteredDataChange = (filteredData: typeof reimbursements) => {
    setFilteredExpenseData(filteredData);
  };

  const personalStats = useMemo(() => {
    const counts = {
      draft: 0,
      approved: 0,
      paid: 0,
      rejected: 0,
    };

    for (const e of personalExpenses ?? []) {
      const status = e?.status;
      if (status === "draft") counts.draft += 1;
      if (status === "approved") counts.approved += 1;
      if (status === "paid") counts.paid += 1;
      if (status === "declined") counts.rejected += 1;
    }

    return counts;
  }, [personalExpenses]);

  return (
    <>
      <Tabs value={outerTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-10">
          <TabsList>
            <TabsTrigger value="company-expenses">Company Expenses</TabsTrigger>
            <TabsTrigger value="personal-expenses">Personal Expenses</TabsTrigger>
          </TabsList>
          {outerTab === "personal-expenses" && <NewExpenseButtonTrigger />}
        </div>
        <TabsContent value="personal-expenses">
          <PermissionGuard requiredPermissions={[]}>
            {isLoadingPersonalExpenses ? (
              <PersonalExpensesSkeleton />
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
                  <StatsCard
                    title="Draft"
                    value={personalStats.draft.toString()}
                    icon={
                      <>
                        <div className="p-1 mr-3 flex items-center justify-center bg-[#384A57] rounded-full">
                          <img
                            src={"/images/svgs/draft.svg"}
                            alt="draft icon"
                          />
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
                    value={personalStats.approved.toString()}
                    icon={
                      <>
                        <div className="p-1 mr-3 flex items-center justify-center bg-[#418341] rounded-full text-white">
                          <img
                            src={"/images/svgs/check.svg"}
                            alt="check icon"
                          />
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
                    title="Rejected"
                    value={personalStats.rejected.toString()}
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
                        View all items that have been Rejected.
                      </span>
                    }
                  />
                  <StatsCard
                    title="Paid"
                    value={personalStats.paid.toString()}
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
                {personalExpenses.length === 0 ? (
                  <ExpenseEmptyState />
                ) : (
                  <>
                    <Tabs defaultValue="all">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="paid">Paid</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all">
                        <ExpenseTable
                          statusFilter={null}
                          data={personalExpenses as any}
                          columnsOverride={personalExpenseColumns as any}
                          page={page}
                        />
                      </TabsContent>
                      <TabsContent value="draft">
                        <ExpenseTable
                          statusFilter={"draft"}
                          data={personalExpenses as any}
                          columnsOverride={personalExpenseColumns as any}
                          page={page}
                        />
                      </TabsContent>
                      <TabsContent value="pending">
                        <ExpenseTable
                          statusFilter={"pending"}
                          data={personalExpenses as any}
                          columnsOverride={personalExpenseColumns as any}
                          page={page}
                        />
                      </TabsContent>
                      {/* Keep other tabs for visual parity; personal data is draft/pending in this demo */}
                      <TabsContent value="approved">
                        <ExpenseTable
                          statusFilter={"approved"}
                          data={personalExpenses as any}
                          columnsOverride={personalExpenseColumns as any}
                          page={page}
                        />
                      </TabsContent>
                      <TabsContent value="rejected">
                        <ExpenseTable
                          statusFilter={"declined"}
                          data={personalExpenses as any}
                          columnsOverride={personalExpenseColumns as any}
                          page={page}
                        />
                      </TabsContent>
                      <TabsContent value="paid">
                        <ExpenseTable
                          statusFilter={"paid"}
                          data={personalExpenses as any}
                          columnsOverride={personalExpenseColumns as any}
                          page={page}
                        />
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </div>
            )}
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="company-expenses">
          <PermissionGuard requiredPermissions={[]}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
                <StatsCard
                  title="Total Expenses"
                  value={stats.totalExpenses.toString()}
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
                  value={stats.pendingApprovals.toString()}
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
                  value={stats.approvedExpenses.toString()}
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
                  value={stats.paidExpenses.toString()}
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
                    onFilteredDataChange={handleFilteredDataChange}
                  />
                </TabsContent>
                <TabsContent value="draft">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["draft"]}
                    data={expenseData}
                    onFilteredDataChange={handleFilteredDataChange}
                  />
                </TabsContent>
                <TabsContent value="approved">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["approved"]}
                    data={expenseData}
                    onFilteredDataChange={handleFilteredDataChange}
                  />
                </TabsContent>
                <TabsContent value="rejected">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["rejected"]}
                    data={expenseData}
                    onFilteredDataChange={handleFilteredDataChange}
                  />
                </TabsContent>
                <TabsContent value="pending">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["pending"]}
                    data={expenseData}
                    onFilteredDataChange={handleFilteredDataChange}
                  />
                </TabsContent>
                <TabsContent value="paid">
                  <ExpenseTable
                    actionButton={<></>}
                    statusFilter={statusMap["paid"]}
                    data={expenseData}
                    onFilteredDataChange={handleFilteredDataChange}
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