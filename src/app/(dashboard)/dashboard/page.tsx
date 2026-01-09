"use client";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useAuthStore } from "@/stores/auth-stores";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/landing/StatCard";
import { RecentActivity } from "@/components/dashboard/landing/RecentActivity";
import { ExpenseChart } from "@/components/dashboard/landing/ExpenseChart";
import { PolicyAlertsTable } from "@/components/dashboard/landing/PolicyAlertTable";
import { Input } from "@/components/ui/input";
import { ChartUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import { reimbursements } from "../expenses/page";
import { useAxios } from "@/hooks/useAxios";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const total = reimbursements.reduce((sum, e) => sum + e.amount, 0).toFixed(3);
  const [integer, decimal] = total.split(".");
  const axios = useAxios();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.userId) {
        setCompanyLoading(false);
        return;
      }

      setCompanyLoading(true);
      let fetched = false;

      if (user.companyId) {
        try {
          const response = await axios.get(`/companies/${user.companyId}`);
          const companyData = response?.data?.data || response?.data;
          if (companyData?.companyName || companyData?.businessName) {
            setCompanyName(companyData.companyName || companyData.businessName);
            fetched = true;
          }
        } catch (error) {
          console.error("Primary company fetch failed:", error);
        }
      }

      if (!fetched) {
        try {
          const userResponse = await axios.get("/users/me");
          const userData = userResponse?.data?.data || userResponse?.data;
          const company = userData?.company;
          if (company?.companyName || company?.businessName) {
            setCompanyName(company.companyName || company.businessName);
          }
        } catch (userError) {
          console.error("Fallback /users/me fetch failed:", userError);
        }
      }

      setCompanyLoading(false);
    };

    fetchCompanyData();
  }, [user?.userId, user?.companyId, axios]);

  return (
    <>
      <PermissionGuard requiredPermissions={[]}>
        <div className="space-y-5">
          {/* Apply Banner */}
          <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/50 !p-0">
            <div className="p-5 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                  i
                </div>
                <div>
                  <h3 className="font-semibold">Apply for Villeto</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a demo environment. Apply now to unlock your
                    company&apos;s full environment.
                  </p>
                </div>
              </div>
              <Button size={"sm"} className="!h-10">
                Apply Now
              </Button>
            </div>
          </Card>

          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Welcome Back,
                {companyLoading ? (
                  <Skeleton className="h-7 w-64 inline-block" />
                ) : (
                  <span>{companyName || "XYZ Corporation"}!</span>
                )}
              </h2>
              <p className="text-muted-foreground text-sm font-normal">
                Here&apos;s what&apos;s happening with your expenses today.
              </p>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction etc"
                className="pl-9 h-12"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[1rem]">
            <StatsCard
              title="Total Spend"
              value="$24,536.00"
              subtitle={<>This month you spent $3,000</>}
              trend="up"
              icon={
                <div className="p-1 rounded bg-success/5 border-[0.5px] border-success text-success font-normal text-[.5rem] flex items-center justify-center gap-0.5 mr-2">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={ChartUpIcon}
                      className="w-3 h-3 text-success"
                    />
                  </div>
                  +10%
                </div>
              }
            />
            <StatsCard
              title="Overall Budget Utilization"
              value="40%"
              subtitle={
                <span className="">
                  Your budget utilization is{" "}
                  <span className="text-success">40%</span>
                </span>
              }
              trend="neutral"
            />
            <StatsCard
              title="Overall Budget Utilization"
              value="40%"
              subtitle="You have 10 accounts to pay"
            />
            <StatsCard
              title="Total Accounts Payable"
              value="$24,536.00"
              subtitle={<>You have 10 accounts to pay</>}
            />
            <StatsCard
              title="Open Approvals"
              value="20"
              subtitle={
                <Link href="" className="text-success underline">
                  Authorize Approvals
                </Link>
              }
              trend="up"
            />
            <StatsCard
              title="Critical Policy Alerts"
              value="10"
              subtitle={
                <Link href="" className="text-error underline">
                  Authorize Policy Alerts
                </Link>
              }
              trend="down"
            />
          </div>

          {/* Chart */}
          <ExpenseChart />

          {/* Table and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3">
              <PolicyAlertsTable />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>

          {/* Owner Dashboard Section */}
          <Card className="p-6 gap-1.5">
            <h3 className="text-lg font-semibold">Owner Dashboard</h3>
            <p className="text-sm text-muted-foreground pb-4 border-b-2 border-muted">
              Special insights and controls for business owners
            </p>
            <p className="mt-4 mb-4">
              As an owner, you have access to all financial data and company
              settings.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Company financial performance metrics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Departmental spending breakdowns
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Executive reports and analytics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Full administrative controls
              </li>
            </ul>
          </Card>
        </div>
      </PermissionGuard>
    </>
  );
}
