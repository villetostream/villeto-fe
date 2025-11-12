"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {

    Users, CreditCard, Building2, UserCog, DollarSign
} from "lucide-react";
import { InviteUser } from "@/components/dashboard/user/InviteUser";
import { UserProfile } from "@/components/dashboard/user/UserProfile";
import { DepartmentsTab } from "@/components/dashboard/people/DepartmentTab";
import { AllUsersTab } from "@/components/dashboard/people/AllUsersTab";
import { RolesTab } from "@/components/dashboard/people/RoleTab";
import { useRouter } from "next/navigation";


const statCards = [
    { icon: Users, label: "Total Users", value: "100", description: "This month you added 5 users" },
    { icon: CreditCard, label: "Active Cards", value: "70", description: "This month you spent extra $1,000" },
    { icon: Building2, label: "Departments", value: "15", description: "Manage Departments" },
    { icon: UserCog, label: "Roles", value: "5", description: "Manage Locations" },
    { icon: DollarSign, label: "Total Limits", value: "$24,536.00", description: "This month you spent extra $1,000" },
];

export default function People() {
    const [activeTab, setActiveTab] = useState("all-users");
    const router = useRouter()
    const handleCreateRole = () => {
        router.push("/dashboard/people/create-role");
    };

    const handleCreateDepartment = () => {
        // Navigate to create department page (to be implemented)
    };
    return (

        <div className="min-h-screen bg-dashboard-bg">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">

                            <h1 className="text-2xl font-semibold">People</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Manage team members and their spending permissions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {activeTab === "all-users" && (
                            <>
                                <Button
                                    variant="outline"
                                    size={"md"}
                                    onClick={() => router.push("/dashboard/people/bulk-invite")}
                                >
                                    + Bulk Invite Users
                                </Button>
                                <Button
                                    onClick={() => router.push("/dashboard/people/add-user")}
                                    size={"md"}

                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    + Add Single User
                                </Button>
                            </>
                        )}
                        {activeTab === "roles" && (
                            <Button
                                onClick={handleCreateRole}
                                size={"md"}

                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Create Role
                            </Button>
                        )}
                        {activeTab === "department" && (
                            <Button
                                onClick={handleCreateDepartment}
                                size={"md"}

                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Create Department
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-sm text-muted-foreground">{stat.label}</span>
                                <stat.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-muted/50 p-1 h-auto rounded-lg">
                        <TabsTrigger
                            value="all-users"
                            className="data-[state=active]:bg-background rounded-md px-6"
                        >
                            All Users
                        </TabsTrigger>
                        <TabsTrigger
                            value="roles"
                            className="data-[state=active]:bg-background rounded-md px-6"
                        >
                            Roles
                        </TabsTrigger>
                        <TabsTrigger
                            value="department"
                            className="data-[state=active]:bg-background rounded-md px-6"
                        >
                            Department
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all-users" className="mt-6">
                        <AllUsersTab />
                    </TabsContent>

                    <TabsContent value="roles" className="mt-6">
                        <RolesTab />
                    </TabsContent>

                    <TabsContent value="department" className="mt-6">
                        <DepartmentsTab />
                    </TabsContent>
                </Tabs>
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
