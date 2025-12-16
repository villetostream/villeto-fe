"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, Building2, UserCog, DollarSign } from "lucide-react";
import { DepartmentsTab } from "@/components/dashboard/people/depts/DepartmentTab";
import { AllUsersTab } from "@/components/dashboard/people/users/AllUsersTab";
import { RolesTab } from "@/components/dashboard/people/role/RoleTab";
import { useRouter, useSearchParams } from "next/navigation";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import withPermissions from "@/components/permissions/permission-protected-routes";

const statCards = [
    { icon: Users, label: "Total Users", value: "100", description: "This month you added 5 users" },
    { icon: CreditCard, label: "Active Cards", value: "70", description: "This month you spent extra $1,000" },
    { icon: Building2, label: "Departments", value: "15", description: "Manage Departments" },
    { icon: UserCog, label: "Roles", value: "5", description: "Manage Locations" },
    { icon: DollarSign, label: "Total Limits", value: "$24,536.00", description: "This month you spent extra $1,000" },
];

function People() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get initial tab from URL search params or default to "all-users"
    const initialTab = searchParams.get("tab") || "all-users";
    const [activeTab, setActiveTab] = useState(initialTab);

    // Update URL when activeTab changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", activeTab);
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [activeTab]);

    const handleCreateRole = () => {
        router.push("/people/create-role");
    };

    const handleCreateDepartment = () => {
        router.push("/people/add-department")
    };

    return (
        <div className=" bg-dashboard-bg">
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
                    <div className="flex gap-5">
                        {/* {activeTab === "all-users" && (
                            <>
                                <PermissionGuard requiredPermissions={[]}>


                                    <Button
                                        variant="outline"
                                        size={"md"}
                                        onClick={() => router.push("/people/bulk-invite")}


                                    >
                                        + Bulk Invite Users
                                    </Button>
                                </PermissionGuard>
                                <PermissionGuard requiredPermissions={["create:users"]}>


                                    <Button
                                        onClick={() => router.push("/people/add-user")}
                                        size={"md"}


                                    >
                                        + Add Single User
                                    </Button>
                                </PermissionGuard>
                            </>
                        )} */}
                        {activeTab === "roles" && (
                            <PermissionGuard requiredPermissions={["create:roles"]}>

                                <Button
                                    onClick={handleCreateRole}
                                    size={"md"}
                                    className="px-12"
                                >
                                    Create Role
                                </Button>
                            </PermissionGuard>
                        )}
                        {activeTab === "department" && (
                            <PermissionGuard requiredPermissions={["create:departments"]}>


                                <Button
                                    onClick={handleCreateDepartment}
                                    size={"md"}
                                    className=""

                                >
                                    Create Department
                                </Button>
                            </PermissionGuard>
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
                        <PermissionGuard requiredPermissions={["read:users"]}>

                            <TabsTrigger
                                value="all-users"
                                className="data-[state=active]:bg-background rounded-md px-6"
                            >
                                All Users
                            </TabsTrigger>
                        </PermissionGuard>
                        <PermissionGuard requiredPermissions={["read:roles"]}>

                            <TabsTrigger
                                value="roles"
                                className="data-[state=active]:bg-background rounded-md px-6"
                            >
                                Roles
                            </TabsTrigger>
                        </PermissionGuard>
                        <PermissionGuard requiredPermissions={["read:departments"]}>

                            <TabsTrigger
                                value="department"
                                className="data-[state=active]:bg-background rounded-md px-6"
                            >
                                Department
                            </TabsTrigger>
                        </PermissionGuard>

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

export default withPermissions(People, ["read:users", "read:roles", "read:departmets"])