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
import { usePersonalExpenses, useCompanyExpenses, CompanyExpenseReport } from "@/lib/react-query/expenses";
import { Loader2 } from "lucide-react";
import { PersonalExpensesSkeleton } from "@/components/expenses/PersonalExpensesSkeleton";
import { companyColumns } from "@/components/expenses/table/companyColumns";

const statusMap: Record<string, string | null> = {
  all: null,
  draft: "draft",
  submitted: "pending",
  approved: "approved",
  rejected: "declined",
  pending: "pending",
  paid: "paid",
};



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
  
  // Company Expenses State
  const [companyExpenses, setCompanyExpenses] = useState<CompanyExpenseReport[]>([]);
  const [filteredCompanyExpenses, setFilteredCompanyExpenses] = useState<CompanyExpenseReport[]>([]);

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

  // Fetch company expenses using React Query
  const { data: companyExpensesData, isLoading: isLoadingCompanyExpenses } =
    useCompanyExpenses(page, limit);

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
      // Helper function to get the most recent date between createdAt and updatedAt
      const getMostRecentDate = (report: any): number => {
        const createdAt = new Date(report.createdAt).getTime();
        const updatedAt = new Date(report.updatedAt).getTime();
        return Math.max(createdAt, updatedAt);
      };

      // Sort reports by the most recent date (comparing both createdAt and updatedAt)
      const sortedReports = [...personalExpensesData.reports].sort((a, b) => {
        return getMostRecentDate(b) - getMostRecentDate(a); // Most recent first
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

  // Transform/Load Company Expenses
  useEffect(() => {
    if (companyExpensesData?.reports) {
      // Helper function to get the most recent date
      const getMostRecentDate = (report: CompanyExpenseReport): number => {
        const createdAt = new Date(report.createdAt).getTime();
        const updatedAt = new Date(report.updatedAt).getTime();
        return Math.max(createdAt, updatedAt);
      };

      // Sort reports by the most recent date
      const sortedReports = [...companyExpensesData.reports].sort((a, b) => {
        return getMostRecentDate(b) - getMostRecentDate(a);
      });

      setCompanyExpenses(sortedReports);
      setFilteredCompanyExpenses(sortedReports);
    }
  }, [companyExpensesData]);

  // Calculate stats based on current data
  const calculateStats = (data: CompanyExpenseReport[]) => {
    const totalExpenses = data.length;
    const pendingApprovals = data.filter(
      (item) => item.status === "pending",
    ).length;
    const approvedExpenses = data.filter(
      (item) => item.status === "approved" || item.status === "paid",
    ).length;
    const paidExpenses = data.filter((item) => item.status === "paid").length;

    return {
      totalExpenses,
      pendingApprovals,
      approvedExpenses,
      paidExpenses,
    };
  };

  // Use filtered data for stats
  const stats = calculateStats(filteredCompanyExpenses as any);

  // Handle filtered data changes for Company Expenses
  const handleFilteredCompanyDataChange = (filteredData: any) => {
    setFilteredCompanyExpenses(filteredData);
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
            <TabsTrigger value="company-expenses" className="cursor-pointer">Company Expenses</TabsTrigger>
            <TabsTrigger value="personal-expenses" className="cursor-pointer">Personal Expenses</TabsTrigger>
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
              
              {isLoadingCompanyExpenses || (companyExpensesData?.reports && companyExpensesData.reports.length > 0 && companyExpenses.length === 0) ? (
                <PersonalExpensesSkeleton />
              ) : (
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
                      data={companyExpenses as any}
                      columnsOverride={companyColumns as any}
                      onFilteredDataChange={handleFilteredCompanyDataChange}
                    />
                  </TabsContent>
                  <TabsContent value="draft">
                    <ExpenseTable
                      actionButton={<></>}
                      statusFilter={statusMap["draft"]}
                      data={companyExpenses as any}
                      columnsOverride={companyColumns as any}
                      onFilteredDataChange={handleFilteredCompanyDataChange}
                    />
                  </TabsContent>
                  <TabsContent value="approved">
                    <ExpenseTable
                      actionButton={<></>}
                      statusFilter={statusMap["approved"]}
                      data={companyExpenses as any}
                      columnsOverride={companyColumns as any}
                      onFilteredDataChange={handleFilteredCompanyDataChange}
                    />
                  </TabsContent>
                  <TabsContent value="rejected">
                    <ExpenseTable
                      actionButton={<></>}
                      statusFilter={statusMap["rejected"]}
                      data={companyExpenses as any}
                      columnsOverride={companyColumns as any}
                      onFilteredDataChange={handleFilteredCompanyDataChange}
                    />
                  </TabsContent>
                  <TabsContent value="pending">
                    <ExpenseTable
                      actionButton={<></>}
                      statusFilter={statusMap["pending"]}
                      data={companyExpenses as any}
                      columnsOverride={companyColumns as any}
                      onFilteredDataChange={handleFilteredCompanyDataChange}
                    />
                  </TabsContent>
                  <TabsContent value="paid">
                    <ExpenseTable
                      actionButton={<></>}
                      statusFilter={statusMap["paid"]}
                      data={companyExpenses as any}
                      columnsOverride={companyColumns as any}
                      onFilteredDataChange={handleFilteredCompanyDataChange}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </>
  );
}