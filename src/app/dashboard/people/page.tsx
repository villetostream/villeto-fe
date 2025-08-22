"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Users,
    Plus,
    Search,
    Filter,
    Mail,
    Phone,
    MapPin,
    Shield,
    CreditCard,
    Settings,
    MoreVertical,
    Eye,
    UserCog,
    ChevronUp,
    ChevronDown
} from "lucide-react";
import { InviteUser } from "@/components/dashboard/user/InviteUser";
import { UserProfile } from "@/components/dashboard/user/UserProfile";


const employees = [
    {
        id: 1,
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        department: "Marketing",
        role: "Marketing Manager",
        cardNumber: "4521",
        fullCardNumber: "••••••••••••4521",
        cardLimit: 5000,
        monthlySpend: 1250,
        status: "active",
        location: "San Francisco, CA",
        phone: "+1 (555) 123-4567"
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        email: "michael.r@company.com",
        department: "Engineering",
        role: "Senior Developer",
        cardNumber: "8934",
        fullCardNumber: "••••••••••••8934",
        cardLimit: 3000,
        monthlySpend: 890,
        status: "active",
        location: "Austin, TX",
        phone: "+1 (555) 234-5678"
    },
    {
        id: 3,
        name: "Emma Thompson",
        email: "emma.t@company.com",
        department: "Operations",
        role: "Operations Director",
        cardNumber: "2567",
        fullCardNumber: "••••••••••••2567",
        cardLimit: 8000,
        monthlySpend: 2100,
        status: "active",
        location: "New York, NY",
        phone: "+1 (555) 345-6789"
    },
    {
        id: 4,
        name: "David Kim",
        email: "david.kim@company.com",
        department: "Sales",
        role: "Sales Representative",
        cardNumber: "",
        fullCardNumber: "Not assigned",
        cardLimit: 0,
        monthlySpend: 0,
        status: "pending",
        location: "Chicago, IL",
        phone: "+1 (555) 456-7890"
    },
    {
        id: 5,
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        department: "Marketing",
        role: "Content Manager",
        cardNumber: "7829",
        fullCardNumber: "••••••••••••7829",
        cardLimit: 2500,
        monthlySpend: 450,
        status: "active",
        location: "Los Angeles, CA",
        phone: "+1 (555) 567-8901"
    },
    {
        id: 6,
        name: "James Wilson",
        email: "james.w@company.com",
        department: "Engineering",
        role: "Frontend Developer",
        cardNumber: "3456",
        fullCardNumber: "••••••••••••3456",
        cardLimit: 2000,
        monthlySpend: 320,
        status: "inactive",
        location: "Seattle, WA",
        phone: "+1 (555) 678-9012"
    }
];

export default function People() {
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [showInvite, setShowInvite] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortField, setSortField] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const getStatusBadge = (status: string) => {
        const baseClasses = "text-xs font-medium";
        switch (status) {
            case 'active':
                return `${baseClasses} bg-status-success text-white`;
            case 'pending':
                return `${baseClasses} bg-status-warning text-white`;
            case 'inactive':
                return `${baseClasses} bg-dashboard-text-secondary text-white`;
            default:
                return baseClasses;
        }
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    const filteredEmployees = employees.filter(emp =>
        filterStatus === "all" || emp.status === filterStatus
    );

    const statusCounts = {
        all: employees.length,
        active: employees.filter(e => e.status === "active").length,
        pending: employees.filter(e => e.status === "pending").length,
        inactive: employees.filter(e => e.status === "inactive").length,
    };

    return (

        <div className="min-h-screen bg-dashboard-bg">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dashboard-text-primary">People</h1>
                        <p className="text-dashboard-text-secondary mt-1">
                            Manage team members and their spending permissions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Permissions
                        </Button>
                        <InviteUser open={showInvite} onOpenChange={setShowInvite}>
                            <Button className="bg-dashboard-accent hover:bg-dashboard-accent/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Invite Users
                            </Button>
                        </InviteUser>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Total Employees</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">{employees.length}</p>
                                </div>
                                <Users className="w-8 h-8 text-dashboard-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Active Cards</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">
                                        {employees.filter(e => e.cardNumber).length}
                                    </p>
                                </div>
                                <CreditCard className="w-8 h-8 text-status-success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Pending Setup</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">
                                        {statusCounts.pending}
                                    </p>
                                </div>
                                <Shield className="w-8 h-8 text-status-warning" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dashboard-card border-dashboard-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-dashboard-text-secondary text-sm">Total Limits</p>
                                    <p className="text-2xl font-bold text-dashboard-text-primary">
                                        ${employees.reduce((sum, e) => sum + e.cardLimit, 0).toLocaleString()}
                                    </p>
                                </div>
                                <Users className="w-8 h-8 text-dashboard-text-secondary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary w-4 h-4" />
                        <Input placeholder="Search team members..." className="pl-10" />
                    </div>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter by Department
                    </Button>
                </div>

                {/* Filter Tabs */}
                <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                    <TabsList className="grid w-full grid-cols-4 max-w-md">
                        <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                        <TabsTrigger value="active">Active ({statusCounts.active})</TabsTrigger>
                        <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive ({statusCounts.inactive})</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* People Table */}
                <Card className="bg-dashboard-card border-dashboard-border">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-dashboard-border">
                                <TableHead
                                    className="cursor-pointer hover:bg-dashboard-hover"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-2">
                                        Name {getSortIcon("name")}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-dashboard-hover"
                                    onClick={() => handleSort("email")}
                                >
                                    <div className="flex items-center gap-2">
                                        Email {getSortIcon("email")}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-dashboard-hover"
                                    onClick={() => handleSort("department")}
                                >
                                    <div className="flex items-center gap-2">
                                        Department {getSortIcon("department")}
                                    </div>
                                </TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Card Number</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-dashboard-hover"
                                    onClick={() => handleSort("cardLimit")}
                                >
                                    <div className="flex items-center gap-2">
                                        Card Limit {getSortIcon("cardLimit")}
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-dashboard-hover"
                                    onClick={() => handleSort("monthlySpend")}
                                >
                                    <div className="flex items-center gap-2">
                                        Monthly Spend {getSortIcon("monthlySpend")}
                                    </div>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.id} className="border-dashboard-border hover:bg-dashboard-hover">
                                    <TableCell className="font-medium text-dashboard-text-primary">
                                        {employee.name}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        {employee.email}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        {employee.department}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        {employee.role}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        {employee.fullCardNumber}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        ${employee.cardLimit.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        ${employee.monthlySpend.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(employee.status)}>
                                            {employee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        {employee.location}
                                    </TableCell>
                                    <TableCell className="text-dashboard-text-secondary">
                                        {employee.phone}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <UserProfile
                                                employee={employee}
                                                open={selectedEmployee?.id === employee.id}
                                                onOpenChange={(open) => setSelectedEmployee(open ? employee : null)}
                                            >
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View
                                                </Button>
                                            </UserProfile>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-dashboard-card border-dashboard-border">
                                                    <DropdownMenuItem className="text-dashboard-text-primary hover:bg-dashboard-hover">
                                                        <UserCog className="w-4 h-4 mr-2" />
                                                        Edit Permissions
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-dashboard-text-primary hover:bg-dashboard-hover">
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                        Manage Card
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-dashboard-text-primary hover:bg-dashboard-hover">
                                                        <Settings className="w-4 h-4 mr-2" />
                                                        Account Settings
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>

    );
}

//people should be a table with columns like name, email, department, role, card number, card limit, monthly spend, status, location and phone(sortable and filterable)
//each row should have a view profile button and an edit permissions button
//the card number should be masked with the last 4 digits visible
//the status should be a badge with different colors for active, pending and inactive
//with filter tabs
// each row should open a sheet showing details about the person with action buttons like edit
// invite users which will create a sheet to add user s with role with options to upload csv or excel file
//when inviting people important details to collect are email, location,department and option to issue a card also a preselect role (user must have selected a role before asking for these info)
