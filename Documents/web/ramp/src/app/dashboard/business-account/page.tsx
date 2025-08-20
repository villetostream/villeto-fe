import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Building,
    Plus,
    CreditCard,
    Banknote,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Settings,
    Shield
} from "lucide-react";

const accountData = {
    balance: 452062.97,
    pendingBalance: 1681.22,
    accounts: [
        {
            name: "Primary Business Checking",
            type: "Checking",
            balance: 452062.97,
            accountNumber: "••••4521",
            status: "active"
        },
        {
            name: "Business Savings",
            type: "Savings",
            balance: 125000.00,
            accountNumber: "••••7890",
            status: "active"
        },
        {
            name: "Payroll Account",
            type: "Checking",
            balance: 75000.00,
            accountNumber: "••••3456",
            status: "active"
        }
    ],
    recentTransactions: [
        {
            id: 1,
            description: "Salary Payment - November",
            amount: -125000.00,
            date: "Nov 15, 2024",
            type: "debit",
            category: "Payroll"
        },
        {
            id: 2,
            description: "Client Payment - ABC Corp",
            amount: 50000.00,
            date: "Nov 14, 2024",
            type: "credit",
            category: "Revenue"
        },
        {
            id: 3,
            description: "Office Rent",
            amount: -8500.00,
            date: "Nov 1, 2024",
            type: "debit",
            category: "Office Expenses"
        }
    ]
};

export default function BusinessAccount() {
    return (

        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-dashboard-text-primary">Business Account</h1>
                            <Badge className="bg-dashboard-accent text-white">New</Badge>
                        </div>
                        <p className="text-dashboard-text-secondary mt-1">
                            Manage your business banking and cash flow
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Account Settings
                        </Button>
                        <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Transfer Funds
                        </Button>
                    </div>
                </div>

                {/* Account Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Total Balance</p>
                                    <p className="text-4xl font-bold text-dashboard-text-primary">
                                        ${accountData.balance.toLocaleString()}
                                    </p>
                                    <p className="text-dashboard-text-secondary text-sm mt-1">
                                        Pending: ${accountData.pendingBalance.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-status-success mb-2">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span className="text-sm">+5.2% this month</span>
                                    </div>
                                    <Badge className="bg-status-success text-white">
                                        <Shield className="w-3 h-3 mr-1" />
                                        FDIC Insured
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashboard-border">
                                <div>
                                    <p className="text-xs text-dashboard-text-secondary">Available</p>
                                    <p className="font-semibold text-dashboard-text-primary">
                                        ${(accountData.balance - accountData.pendingBalance).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-dashboard-text-secondary">This Month</p>
                                    <p className="font-semibold text-status-success">+$125K</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dashboard-text-secondary">Last Month</p>
                                    <p className="font-semibold text-dashboard-text-primary">$427K</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90">
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                Send Payment
                            </Button>
                            <Button variant="outline" className="w-full">
                                <ArrowDownRight className="w-4 h-4 mr-2" />
                                Request Payment
                            </Button>
                            <Button variant="outline" className="w-full">
                                <CreditCard className="w-4 h-4 mr-2" />
                                View Cards
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Banknote className="w-4 h-4 mr-2" />
                                Wire Transfer
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Account List */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">All Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accountData.accounts.map((account, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                                            <Building className="w-5 h-5 text-dashboard-accent" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-dashboard-text-primary">
                                                {account.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-dashboard-text-secondary">
                                                <span>{account.type}</span>
                                                <span>•</span>
                                                <span>{account.accountNumber}</span>
                                                <Badge className="bg-status-success text-white text-xs">
                                                    {account.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-dashboard-text-primary">
                                            ${account.balance.toLocaleString()}
                                        </p>
                                        <Button variant="ghost" size="sm" className="text-dashboard-accent">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-dashboard-text-primary">Recent Transactions</CardTitle>
                            <Button variant="outline" size="sm">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {accountData.recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-3 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${transaction.type === 'credit'
                                            ? 'bg-status-success/10'
                                            : 'bg-status-error/10'
                                            }`}>
                                            {transaction.type === 'credit' ? (
                                                <ArrowUpRight className="w-4 h-4 text-status-success" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4 text-status-error" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-dashboard-text-primary">
                                                {transaction.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-dashboard-text-secondary">
                                                <span>{transaction.date}</span>
                                                <span>•</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {transaction.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${transaction.type === 'credit'
                                            ? 'text-status-success'
                                            : 'text-dashboard-text-primary'
                                            }`}>
                                            {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Banking Services */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary text-lg">Lending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-dashboard-text-secondary mb-4">
                                Access business credit lines and loans
                            </p>
                            <Button variant="outline" className="w-full">
                                Learn More
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary text-lg">Merchant Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-dashboard-text-secondary mb-4">
                                Accept payments from customers
                            </p>
                            <Button variant="outline" className="w-full">
                                Get Started
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary text-lg">Payroll</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-dashboard-text-secondary mb-4">
                                Streamline employee payments
                            </p>
                            <Button variant="outline" className="w-full">
                                Set Up Payroll
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}