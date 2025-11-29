
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    CreditCard,
    Plus,
    Lock,
    Unlock,
    Eye,
    Settings,
    TrendingUp,
    DollarSign
} from "lucide-react";

const cards = [
    {
        id: 1,
        name: "Marketing Team Card",
        last4: "4521",
        holder: "Sarah Chen",
        department: "Marketing",
        limit: 5000,
        spent: 3450,
        status: "active"
    },
    {
        id: 2,
        name: "Engineering Card",
        last4: "8934",
        holder: "Michael Rodriguez",
        department: "Engineering",
        limit: 10000,
        spent: 7500,
        status: "active"
    },
    {
        id: 3,
        name: "Travel Card",
        last4: "2567",
        holder: "Emma Thompson",
        department: "Operations",
        limit: 15000,
        spent: 2100,
        status: "locked"
    }
];

export default function Cards() {
    const getUsagePercentage = (spent: number, limit: number) => {
        return Math.round((spent / limit) * 100);
    };

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return "text-status-error";
        if (percentage >= 70) return "text-status-warning";
        return "text-status-success";
    };

    return (

        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">Corporate Cards</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Manage company credit cards and spending limits
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Card Settings
                        </Button>
                        <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Issue New Card
                        </Button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Active Cards</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">12</p>
                                </div>
                                <CreditCard className="w-8 h-8 text-dashboard-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Total Limit</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$250K</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-status-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">This Month</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$45.2K</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-status-warning" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Available</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$204.8K</p>
                                </div>
                                <Unlock className="w-8 h-8 text-dashboard-text-secondary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cards List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cards.map((card) => {
                        const usagePercentage = getUsagePercentage(card.spent, card.limit);
                        return (
                            <Card key={card.id} className="bg-dashboard-card border-dashboard-border">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-dashboard-accent to-dashboard-accent/80 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-dashboard-text-primary">{card.name}</CardTitle>
                                                <p className="text-sm text-dashboard-text-secondary">
                                                    •••• •••• •••• {card.last4}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={card.status === 'active' ? 'default' : 'secondary'}
                                            className={card.status === 'active' ? 'bg-status-success text-white' : 'bg-status-error text-white'}
                                        >
                                            {card.status === 'active' ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                                            {card.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-dashboard-text-secondary">Cardholder</p>
                                            <p className="font-medium text-dashboard-text-primary">{card.holder}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-dashboard-text-secondary">Department</p>
                                            <p className="font-medium text-dashboard-text-primary">{card.department}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dashboard-text-secondary">Spending</span>
                                            <span className={`font-medium ${getUsageColor(usagePercentage)}`}>
                                                ${card.spent.toLocaleString()} / ${card.limit.toLocaleString()}
                                            </span>
                                        </div>
                                        <Progress
                                            value={usagePercentage}
                                            className="h-2"
                                        />
                                        <p className="text-xs text-dashboard-text-secondary">
                                            {usagePercentage}% of limit used
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`flex-1 ${card.status === 'active' ? 'text-status-error border-status-error hover:bg-status-error hover:text-white' : 'text-status-success border-status-success hover:bg-status-success hover:text-white'}`}
                                        >
                                            {card.status === 'active' ? (
                                                <>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Lock Card
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="w-4 h-4 mr-2" />
                                                    Unlock Card
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Plus className="w-6 h-6" />
                                <span className="text-sm">Issue New Card</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Settings className="w-6 h-6" />
                                <span className="text-sm">Manage Limits</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Lock className="w-6 h-6" />
                                <span className="text-sm">Freeze Cards</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <TrendingUp className="w-6 h-6" />
                                <span className="text-sm">Spending Report</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}