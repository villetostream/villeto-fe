
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
    AlertTriangle
} from 'lucide-react';
import { RoleBadge } from '@/components/role-badge';
import { useAuthStore } from '@/stores/auth-stores';
import { ProtectedComponent } from '@/components/Protected Component/ProtectedPage';

export default function DashboardPage() {
    const user = useAuthStore(state => state.user);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name}. Here's what's happening with your expenses today.
                </p>
            </div>

            <ProtectedComponent requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$24,563</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Card Transactions</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">142</div>
                            <p className="text-xs text-muted-foreground">
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                Requires your attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">
                                +2 since last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Expense Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-80 bg-muted/50 rounded-lg flex items-center justify-center">
                                <BarChart3 className="h-12 w-12 text-muted-foreground" />
                                <span className="ml-2 text-muted-foreground">Expense chart visualization</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Your latest expense submissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Expense #{item}</p>
                                            <p className="text-sm text-muted-foreground">
                                                ${(150 + item * 25).toFixed(2)} • 2 days ago
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">Pending</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Role-specific content */}
                {user?.role === 'owner' && (
                    <Card className="mt-6 border-l-4 border-l-purple-500">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                Owner Dashboard
                                <RoleBadge role="owner" className="ml-2" />
                            </CardTitle>
                            <CardDescription>
                                Special insights and controls for business owners
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>As an owner, you have access to all financial data and company settings.</p>
                            <ul className="mt-4 list-disc list-inside space-y-2">
                                <li>Company financial performance metrics</li>
                                <li>Departmental spending breakdowns</li>
                                <li>Executive reports and analytics</li>
                                <li>Full administrative controls</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {user?.role === 'admin' && (
                    <Card className="mt-6 border-l-4 border-l-red-500">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                Administrator Dashboard
                                <RoleBadge role="admin" className="ml-2" />
                            </CardTitle>
                            <CardDescription>
                                Administrative controls and system management
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>As an administrator, you can manage system settings and user accounts.</p>
                            <ul className="mt-4 list-disc list-inside space-y-2">
                                <li>User management and permissions</li>
                                <li>System configuration</li>
                                <li>Expense policy enforcement</li>
                                <li>Integration management</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {user?.role === 'manager' && (
                    <Card className="mt-6 border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                Manager Dashboard
                                <RoleBadge role="manager" className="ml-2" />
                            </CardTitle>
                            <CardDescription>
                                Team management and approval workflows
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>As a manager, you can oversee your team's expenses and approvals.</p>
                            <ul className="mt-4 list-disc list-inside space-y-2">
                                <li>Team expense approvals</li>
                                <li>Department budget tracking</li>
                                <li>Spending reports for your team</li>
                                <li>Expense policy enforcement for your team</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {user?.role === 'auditor' && (
                    <Card className="mt-6 border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                Auditor Dashboard
                                <RoleBadge role="auditor" className="ml-2" />
                            </CardTitle>
                            <CardDescription>
                                Financial review and compliance monitoring
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>As an auditor, you can review financial records for compliance.</p>
                            <ul className="mt-4 list-disc list-inside space-y-2">
                                <li>Expense compliance reports</li>
                                <li>Audit trail access</li>
                                <li>Policy violation detection</li>
                                <li>Financial record verification</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {user?.role === 'employee' && (
                    <Card className="mt-6 border-l-4 border-l-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                Employee Dashboard
                                <RoleBadge role="employee" className="ml-2" />
                            </CardTitle>
                            <CardDescription>
                                Personal expense tracking and submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>As an employee, you can manage your expenses and reimbursements.</p>
                            <ul className="mt-4 list-disc list-inside space-y-2">
                                <li>Expense submission</li>
                                <li>Reimbursement tracking</li>
                                <li>Personal spending reports</li>
                                <li>Company card transactions (if applicable)</li>
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </ProtectedComponent>
        </div>
    );
}