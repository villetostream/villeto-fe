"use client"


import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGroup } from "@/components/dashboard/people/PermissionGroup";
import { useRouter } from "next/navigation";

const permissionGroups = [
    {
        name: "User Management",
        permissions: [
            { id: "view-users", label: "View Users", enabled: true },
            { id: "create-user", label: "Create User", enabled: false },
            { id: "edit-user", label: "Edit User Details", enabled: true },
            { id: "deactivate-user", label: "Deactivate/Delete User", enabled: true },
            { id: "assign-roles", label: "Assign Roles & Permissions", enabled: false },
        ]
    },
    {
        name: "Department & Role Management",
        permissions: [
            { id: "create-dept", label: "Create Department", enabled: true },
            { id: "edit-dept", label: "Edit Department Info", enabled: false },
            { id: "assign-dept-head", label: "Assign Department Head", enabled: true },
            { id: "manage-hierarchy", label: "Manage Role Hierarchy", enabled: true },
            { id: "set-reporting", label: "Set Reporting Structure", enabled: false },
        ]
    },
    {
        name: "Resource & Asset Management",
        permissions: [
            { id: "add-asset", label: "Add New Asset", enabled: true },
            { id: "create-user-asset", label: "Create User", enabled: false },
            { id: "approve-asset", label: "Approve Asset Request", enabled: true },
            { id: "update-asset", label: "Update Asset Information", enabled: true },
            { id: "mark-asset", label: "Mark Asset as Returned or Lost", enabled: false },
        ]
    },
    {
        name: "Finance & Budget Control",
        permissions: [
            { id: "view-reports", label: "View Financial Reports", enabled: true },
            { id: "approve-expenses", label: "Approve Expense Requests", enabled: false },
            { id: "manage-budgets", label: "Manage Budgets", enabled: true },
            { id: "generate-invoices", label: "Generate Invoices or Payroll", enabled: true },
        ]
    },
    {
        name: "Performance & Reports",
        permissions: [
            { id: "view-dashboards", label: "View Performance Dashboards", enabled: true },
            { id: "generate-reports", label: "Generate Reports", enabled: false },
            { id: "export-data", label: "Export Data", enabled: true },
            { id: "submit-reviews", label: "Submit Performance Reviews", enabled: true },
        ]
    },
    {
        name: "Communication & Announcements",
        permissions: [
            { id: "send-announcements", label: "Send Announcements", enabled: true },
            { id: "manage-notifications", label: "Manage Notifications", enabled: false },
            { id: "create-events", label: "Create Event or Meeting", enabled: true },
            { id: "broadcast-messages", label: "Broadcast Messages", enabled: true },
        ]
    },
    {
        name: "System & Settings Control",
        permissions: [
            { id: "manage-config", label: "Manage System Configuration", enabled: true },
            { id: "manage-backups", label: "Manage Backups & Integrations", enabled: false },
            { id: "set-preferences", label: "Set Global Preferences", enabled: true },
            { id: "control-access", label: "Control Access Levels", enabled: true },
        ]
    },
];

export default function CreateRolePage() {
    const router = useRouter();
    const [permissions, setPermissions] = useState(permissionGroups);

    const handlePermissionToggle = (groupIndex: number, permissionId: string) => {
        setPermissions(prev => {
            const newPerms = [...prev];
            const group = newPerms[groupIndex];
            const permission = group.permissions.find(p => p.id === permissionId);
            if (permission) {
                permission.enabled = !permission.enabled;
            }
            return newPerms;
        });
    };

    return (
        <div>
            <div className="">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="gap-2 mb-4 -ml-2"
                        onClick={() => router.push("/dashboard/people")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    <h1 className="text-2xl font-semibold mb-1">Create New Role</h1>
                    <p className="text-sm text-muted-foreground">
                        This is to help you define a role for a new user
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role-name">
                                Role Name<span className="text-destructive">*</span>
                            </Label>
                            <Input id="role-name" placeholder="e.g DEVELOPER" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sign-off">
                                Sign-off<span className="text-destructive">*</span>
                            </Label>
                            <Input id="sign-off" placeholder="e.g SIG123" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description<span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Description (optional)"
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Permissions</h2>

                        {permissions.map((group, index) => (
                            <PermissionGroup
                                key={group.name}
                                name={group.name}
                                permissions={group.permissions}
                                onPermissionToggle={(permId) => handlePermissionToggle(index, permId)}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard/people")}
                        >
                            Cancel
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90">
                            Create Role
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}