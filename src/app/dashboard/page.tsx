
// app/dashboard/page.tsx
"use client";


import { PERMISSIONS } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
    BarChart3,
    CreditCard,
    Users,
    DollarSign,
    TrendingUp,
    Calendar,
    AlertTriangle,
    Info,
    Search,
    Bell
} from 'lucide-react';
import { RoleBadge } from '@/components/role-badge';
import { useAuthStore } from '@/stores/auth-stores';
import { ProtectedComponent } from '@/components/Protected Component/ProtectedPage';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/landing/StatCard';
import { RecentActivity } from '@/components/dashboard/landing/RecentActivity';
import { ExpenseChart } from '@/components/dashboard/landing/ExpenseChart';
import { PolicyAlertsTable } from '@/components/dashboard/landing/PolicyAlertTable';
import { Input } from '@/components/ui/input';
import { ChartUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import PermissionGuard from '@/components/permissions/permission-protected-components';
import { reimbursements } from './expenses/page';
import ExpenseTable from '@/components/expenses/table/ExpenseTable';
import { Eye } from 'iconsax-reactjs';

export default function DashboardPage() {
    const user = useAuthStore(state => state.user);

    return (
        <>
            <PermissionGuard requiredPermissions={[PERMISSIONS.VIEW_ADMIN_DASHBOARD]}>

                <div className="p-5 space-y-5">
                    {/* Header */}
                    {/* Apply Banner */}
                    <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/50 !p-0">
                        <div className="p-5 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                                    i
                                </div>
                                <div>
                                    <h3 className="font-semibold">Apply for Villeto</h3>
                                    <p className="text-sm text-muted-foreground">This is a demo environment. Apply now to unlock your company's full environment.</p>
                                </div>
                            </div>
                            <Button size={"sm"} className='!h-10'>Apply Now</Button>
                        </div>
                    </Card>

                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Welcome Back, XYZ Corporation!</h2>
                            <p className="text-muted-foreground text-sm font-normal">Here's what's happening with your expenses today.</p>
                        </div>
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search by transaction etc" className="pl-9 h-12" />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[19.2px]">
                        <StatsCard
                            title="Total Spend"
                            value="$24,536.00"
                            subtitle={<>
                                This month you spent $3,000
                            </>
                            }
                            trend="up"
                            icon={
                                <div className="p-1 rounded bg-success/5 border-[0.5px] border-success text-success font-normal text-[8px] flex items-center justify-center gap-0.5">
                                    <div className="w-3 h-3  flex items-center justify-center">
                                        <HugeiconsIcon icon={ChartUpIcon} className="w-3 h-3 text-success" />
                                    </div>
                                    +10%
                                </div>
                            }
                        />
                        <StatsCard
                            title="Overall Budget Utilization"
                            value="40%"
                            subtitle={<span className=''>
                                Your budget utilization is <span className='text-success'>
                                    40%
                                </span>

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
                            subtitle={<>
                                You have 10 accounts to pay</>}
                        />
                        <StatsCard
                            title="Open Approvals"
                            value="20"
                            subtitle={<Link href="" className='text-success underline'>
                                Authorize Approvals
                            </Link>
                            }
                            trend="up"
                        />
                        <StatsCard
                            title="Critical Policy Alerts"
                            value="10"
                            subtitle={<Link href="" className='text-error underline'>
                                Authorize Policy Alerts
                            </Link>}
                            trend="down"
                        />
                    </div>

                    {/* Chart */}
                    <ExpenseChart />

                    {/* Table and Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <div className="lg:col-span-3   ">
                            <PolicyAlertsTable />
                        </div>
                        <div>
                            <RecentActivity />
                        </div>
                    </div>

                    {/* Owner Dashboard Section */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Owner Dashboard</h3>
                        <p className="text-sm text-muted-foreground mb-4">Special insights and controls for business owners</p>

                        <p className="mb-4">As an owner, you have access to all financial data and company settings.</p>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Company financial performance metrics
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Departmental spending breakdowns
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Executive reports and analytics
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Full administrative controls
                            </li>
                        </ul>
                    </Card>
                </div>
            </PermissionGuard>
            <PermissionGuard requiredPermissions={[PERMISSIONS.VIEW_EMPLOYEE_DASHBOARD]}>
                <div className="min-h-screen bg-dashboard-bg p-5">

                    <div className="bg-navy rounded-2xl p-3.5 px-11 mb-8 flex items-center justify-between">
                        <div className='flex flex-col justify-center'>
                            <h1 className="text-2xl leading-[150%] font-bold text-white mb-2">Good Morning, Goodness.</h1>
                            <p className="text-white/80 text-base leading-[150%]">Here is an overview of your dashboard</p>
                        </div>

                        <div style={{ backgroundImage: 'url("/images/card.jpg")' }} className=" bg-no-repeat bg-cover h-[156px] w-[278px]">
                            <div className="bg-primary/20 backdrop-blur-sm rounded-xl p-6 min-w-[240px] border border-primary/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-white/90 text-sm">Wallet Balance</span>
                                    <Eye size={16} className="text-white/80" />
                                </div>
                                <p className="text-3xl font-bold text-white">${reimbursements.reduce((sum, e) => sum + e.amount, 0).toFixed(3)}</p>
                            </div>
                        </div>
                    </div>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatsCard
                            title="Overall Budget Utilization"
                            value="40%"
                            subtitle="You have 10 accounts to pay"
                        />
                        <StatsCard
                            title="Total Accounts Payable"
                            value="$24,536.00"
                            subtitle={<>
                                You have 10 accounts to pay</>}
                        />
                        <StatsCard
                            title="Open Approvals"
                            value="20"
                            subtitle={<Link href="" className='text-success underline'>
                                Authorize Approvals
                            </Link>
                            }
                            trend="up"
                        />
                        <StatsCard
                            title="Critical Policy Alerts"
                            value="10"
                            subtitle={<Link href="" className='text-error underline'>
                                Authorize Policy Alerts
                            </Link>}
                            trend="down"
                        />
                    </div>
                    {/* <ExpenseEmptyState /> */}
                    {/* Reimbursements Table */}
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary">Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ExpenseTable />

                        </CardContent>
                    </Card>
                </div>
            </PermissionGuard >
        </>
    );
}