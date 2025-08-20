import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Building,
    Plus,
    Search,
    Filter,
    Package,
    Truck,
    CheckCircle,
    Clock,
    FileText
} from "lucide-react";

const procurementItems = [
    {
        id: 1,
        item: "Office Furniture Set",
        vendor: "Office Solutions Inc.",
        requestedBy: "Sarah Chen",
        department: "HR",
        amount: 5600.00,
        status: "approved",
        requestDate: "Nov 10, 2024",
        category: "Office Supplies"
    },
    {
        id: 2,
        item: "Software Licenses (50 users)",
        vendor: "TechCorp",
        requestedBy: "Michael Rodriguez",
        department: "Engineering",
        amount: 12000.00,
        status: "pending",
        requestDate: "Nov 12, 2024",
        category: "Software"
    },
    {
        id: 3,
        item: "Marketing Materials",
        vendor: "Print Pro",
        requestedBy: "Emma Thompson",
        department: "Marketing",
        amount: 2500.00,
        status: "delivered",
        requestDate: "Nov 5, 2024",
        category: "Marketing"
    }
];

export default function Procurement() {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-status-success" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-status-warning" />;
            case 'delivered':
                return <Truck className="w-4 h-4 text-dashboard-accent" />;
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
            case 'delivered':
                return `${baseClasses} bg-dashboard-accent text-white`;
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
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">Procurement</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Manage purchase requests and vendor relationships
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Building className="w-4 h-4 mr-2" />
                            Vendor Directory
                        </Button>
                        <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            New Request
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Pending Requests</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">18</p>
                                </div>
                                <Clock className="w-8 h-8 text-status-warning" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">This Month</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">$85.4K</p>
                                </div>
                                <Package className="w-8 h-8 text-dashboard-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Active Vendors</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">47</p>
                                </div>
                                <Building className="w-8 h-8 text-status-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Avg Processing</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">3.2 days</p>
                                </div>
                                <Truck className="w-8 h-8 text-dashboard-text-secondary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary w-4 h-4" />
                        <Input placeholder="Search procurement..." className="pl-10" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>

                {/* Procurement Requests */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <CardHeader>
                        <CardTitle className="text-dashboard-text-primary">Recent Procurement Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {procurementItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-dashboard-hover rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-dashboard-accent/10 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-dashboard-accent" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-dashboard-text-primary">
                                                {item.item}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-dashboard-text-secondary mt-1">
                                                <span>Vendor: {item.vendor}</span>
                                                <span>•</span>
                                                <span>{item.requestedBy} ({item.department})</span>
                                                <span>•</span>
                                                <span>{item.requestDate}</span>
                                            </div>
                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-semibold text-dashboard-text-primary">
                                                ${item.amount.toLocaleString()}
                                            </p>
                                            <Badge className={getStatusBadge(item.status)}>
                                                {getStatusIcon(item.status)}
                                                <span className="ml-1 capitalize">{item.status}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary">Popular Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-dashboard-text-primary">Office Supplies</span>
                                    <span className="text-sm text-dashboard-text-secondary">24 requests</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-dashboard-text-primary">Software & Licenses</span>
                                    <span className="text-sm text-dashboard-text-secondary">18 requests</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-dashboard-text-primary">Equipment</span>
                                    <span className="text-sm text-dashboard-text-secondary">12 requests</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-dashboard-text-primary">Marketing Materials</span>
                                    <span className="text-sm text-dashboard-text-secondary">8 requests</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardHeader>
                            <CardTitle className="text-dashboard-text-primary">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-16 flex flex-col gap-1">
                                    <Plus className="w-5 h-5" />
                                    <span className="text-xs">New Request</span>
                                </Button>
                                <Button variant="outline" className="h-16 flex flex-col gap-1">
                                    <Building className="w-5 h-5" />
                                    <span className="text-xs">Add Vendor</span>
                                </Button>
                                <Button variant="outline" className="h-16 flex flex-col gap-1">
                                    <FileText className="w-5 h-5" />
                                    <span className="text-xs">Templates</span>
                                </Button>
                                <Button variant="outline" className="h-16 flex flex-col gap-1">
                                    <Truck className="w-5 h-5" />
                                    <span className="text-xs">Track Orders</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    );
}