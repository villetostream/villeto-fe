import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Settings,
    Plus,
    Download,
    FileText,
    Calculator,
    TrendingUp,
    BarChart3,
    PieChart,
    Calendar
} from "lucide-react";

const accountingData = {
    monthlyTotals: [
        { month: "October", income: 125000, expenses: 87500, profit: 37500 },
        { month: "November", income: 142000, expenses: 95200, profit: 46800 },
        { month: "December", income: 158000, expenses: 102300, profit: 55700 }
    ],
    categories: [
        { name: "Software & Subscriptions", amount: 25400, percentage: 26.7 },
        { name: "Office & Equipment", amount: 18200, percentage: 19.1 },
        { name: "Travel & Entertainment", amount: 15600, percentage: 16.4 },
        { name: "Professional Services", amount: 12800, percentage: 13.4 },
        { name: "Utilities & Rent", amount: 23200, percentage: 24.4 }
    ]
};

export default function Accounting() {
    return (
        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">Accounting</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Financial reporting and accounting integration
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Integrations
                        </Button>
                        <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                            <Download className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Monthly Revenue</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$158K</p>
                                    <p className="text-xs text-status-success">+12.3% from last month</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-status-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Total Expenses</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$102K</p>
                                    <p className="text-xs text-status-warning">+7.5% from last month</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-dashboard-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Net Profit</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$55.7K</p>
                                    <p className="text-xs text-status-success">+19.1% from last month</p>
                                </div>
                                <Calculator className="w-8 h-8 text-status-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Profit Margin</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">35.3%</p>
                                    <p className="text-xs text-status-success">+2.1% from last month</p>
                                </div>
                                <PieChart className="w-8 h-8 text-dashboard-text-secondary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Trends */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Monthly Financial Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accountingData.monthlyTotals.map((month) => (
                                <div key={month.month} className="p-4 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-dashboard-text-primary">{month.month} 2024</h3>
                                        <div className="flex gap-6 text-sm">
                                            <span className="text-status-success">
                                                Revenue: ${month.income.toLocaleString()}
                                            </span>
                                            <span className="text-dashboard-accent">
                                                Expenses: ${month.expenses.toLocaleString()}
                                            </span>
                                            <span className="text-dashboard-text-primary font-medium">
                                                Profit: ${month.profit.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={(month.profit / month.income) * 100}
                                        className="h-2"
                                    />
                                    <p className="text-xs text-dashboard-text-secondary mt-1">
                                        Profit margin: {((month.profit / month.income) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Expense Categories */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Expense Breakdown by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accountingData.categories.map((category) => (
                                <div key={category.name} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-dashboard-text-primary">
                                                {category.name}
                                            </span>
                                            <span className="text-sm text-dashboard-text-secondary">
                                                ${category.amount.toLocaleString()} ({category.percentage}%)
                                            </span>
                                        </div>
                                        <Progress value={category.percentage} className="h-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Reports & Integrations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary">Financial Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Profit & Loss Statement
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Expense Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calculator className="w-4 h-4 mr-2" />
                                    Tax Summary
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Monthly Statements
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary">Integrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-status-success/10 flex items-center justify-center">
                                            <Settings className="w-4 h-4 text-status-success" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-dashboard-text-primary">QuickBooks</p>
                                            <p className="text-xs text-dashboard-text-secondary">Connected</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-status-success text-white text-xs">Active</Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-dashboard-text-secondary/10 flex items-center justify-center">
                                            <Settings className="w-4 h-4 text-dashboard-text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-dashboard-text-primary">Xero</p>
                                            <p className="text-xs text-dashboard-text-secondary">Not connected</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline">Connect</Button>
                                </div>

                                <Button variant="outline" size="sm" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Integration
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}