"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, Building2, UserCog, DollarSign, Plus, ChevronDown, PlusCircle } from "lucide-react";
import { DepartmentsTab } from "@/components/dashboard/people/depts/DepartmentTab";
import { AllUsersTab } from "@/components/dashboard/people/users/AllUsersTab";
import { RolesTab } from "@/components/dashboard/people/role/RoleTab";
import { useRouter, useSearchParams } from "next/navigation";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import withPermissions from "@/components/permissions/permission-protected-routes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatsCard } from "@/components/dashboard/landing/StatCard";
import { InviteEmployeesWarningModal } from "@/components/dashboard/people/modals/InviteEmployeesWarningModal";

const statCards = [
    { 
        icon: Users, 
        label: "Total Users", 
        value: "100", 
        description: "This month you added 5 users",
        bgColor: "#384A57",
        iconSrc: "/images/svgs/draft.svg"
    },
    { 
        icon: CreditCard, 
        label: "Active Cards", 
        value: "70", 
        description: "This month you spent extra $1,000",
        bgColor: "#F45B69",
        iconSrc: "/images/receipt-pending.png"
    },
    { 
        icon: Building2, 
        label: "Departments", 
        value: "15", 
        description: "View Departments",
        bgColor: "#5A67D8",
        iconSrc: "/images/svgs/submitted.svg"
    },
    { 
        icon: UserCog, 
        label: "Roles", 
        value: "5", 
        description: "View Roles",
        bgColor: "#418341",
        iconSrc: "/images/svgs/check.svg"
    },
    { 
        icon: DollarSign, 
        label: "Total Limits", 
        value: "$24,536.00", 
        description: "This month you spent extra $1,000",
        bgColor: "#38B2AC",
        iconSrc: "/images/svgs/money.svg"
    },
];

function People() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get initial tab from URL search params or default to "all-users"
    const initialTab = searchParams.get("tab") || "all-users";
    const [activeTab, setActiveTab] = useState(initialTab);

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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
                        {activeTab === "all-users" && (
                            <PermissionGuard requiredPermissions={["create:users"]}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="md" className="bg-[#0FA68E] hover:bg-[#0d9178]">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Invite people
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-60">
                                        <DropdownMenuItem 
                                            className="cursor-pointer py-2.5"
                                            onClick={() => setIsInviteModalOpen(true)}
                                        >
                                            <div className="flex items-center">
                                                <PlusCircle className="mr-2 h-4 w-4 text-[#0FA68E]" />
                                                <span>Invite Employees</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="cursor-pointer py-2.5"
                                            onClick={() => router.push("/people/invite/leadership")}
                                        >
                                            <div className="flex items-center">
                                                <PlusCircle className="mr-2 h-4 w-4 text-[#0FA68E]" />
                                                <span>Invite Leadership & Admin</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </PermissionGuard>
                        )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1.5">
                    {statCards.map((stat) => (
                        <StatsCard
                            key={stat.label}
                            title={stat.label}
                            value={stat.value}
                            icon={
                                <>
                                    <div className="p-2 mr-3 flex items-center justify-center rounded-full text-white" style={{ backgroundColor: stat.bgColor }}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                </>
                            }
                            subtitle={
                                <span className="text-xs leading-[125%]">
                                    {stat.description}
                                </span>
                            }
                        />
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
                                Departments
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

            <InviteEmployeesWarningModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInviteLeaders={() => {
                    setIsInviteModalOpen(false);
                    router.push("/people/invite/leadership");
                }}
                onContinue={() => {
                    setIsInviteModalOpen(false);
                    router.push("/people/invite/employees");
                }}
            />
        </div>
    );
}

export default withPermissions(People, ["read:users", "read:roles", "read:departmets"])