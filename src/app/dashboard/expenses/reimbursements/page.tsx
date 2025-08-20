import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Receipt,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign
} from "lucide-react";

const reimbursements = [
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
    }
];

export default function Reimbursements() {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-status-success" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-status-warning" />;
            case 'declined':
                return <XCircle className="w-4 h-4 text-status-error" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "text-xs font-medium";
        switch (status) {
            case 'approved':
                return `${baseClasses} bg-status-success text-white`;
            case 'pending':
                return `${baseClasses} bg-status-warning text-white`;
            case 'declined':
                return `${baseClasses} bg-status-error text-white`;
            default:
                return baseClasses;
        }
    };

    return (

        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">Reimbursements</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Submit and track employee expense reimbursements
                        </p>
                    </div>
                    <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Submit Reimbursement
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Pending</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">12</p>
                                </div>
                                <Clock className="w-8 h-8 text-status-warning" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Approved</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">45</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-status-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">This Month</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$3,245</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-dashboard-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Average</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$89</p>
                                </div>
                                <Receipt className="w-8 h-8 text-dashboard-text-secondary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary w-4 h-4" />
                        <Input placeholder="Search reimbursements..." className="pl-10" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>

                {/* Reimbursements List */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Recent Reimbursements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reimbursements.map((reimbursement) => (
                                <div key={reimbursement.id} className="flex items-center justify-between p-4 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                                            <Receipt className="w-5 h-5 text-dashboard-accent" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-dashboard-text-primary">
                                                {reimbursement.description}
                                            </h3>
                                            <p className="text-sm text-dashboard-text-secondary">
                                                {reimbursement.employee} • {reimbursement.date} • {reimbursement.category}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-semibold text-dashboard-text-primary">
                                                ${reimbursement.amount.toFixed(2)}
                                            </p>
                                            <Badge className={getStatusBadge(reimbursement.status)}>
                                                {getStatusIcon(reimbursement.status)}
                                                <span className="ml-1 capitalize">{reimbursement.status}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}