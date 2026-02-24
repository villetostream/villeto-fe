"use client"

import { useEffect, useState } from "react";
import { ChevronRight, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetARoleApi } from "@/actions/role/get-a-role";
import { groupPermissionsByResource, PermissionsGroup, formatPermissionName } from "@/lib/utils";
import withPermissions from "@/components/permissions/permission-protected-routes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";

function ViewRolePage() {
    const params = useParams();
    const roleId = params.roleId as string;
    const { data: roleData, isLoading } = useGetARoleApi(roleId, { enabled: !!roleId });
    const role = roleData?.data;

    const [permissionsGroups, setPermissionsGroups] = useState<PermissionsGroup[]>([]);

    useEffect(() => {
        if (role?.permissions) {
            const grouped = groupPermissionsByResource(role.permissions);
            setPermissionsGroups(grouped);
        }
    }, [role?.permissions]);

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-8">Role Details</h1>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    const roleName = role?.name?.replace(/_/g, ' ') || "Role";
    const roleDescription = role?.description || "";
    const totalUsers = role?.totalAssignedUsers || 0;

    // Generate placeholder user entries matching the total assigned users count
    // TODO: Replace with real user data when the API returns assigned users
    const assignedUsers = Array.from({ length: totalUsers }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@company.com`,
    }));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-8">Role Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-12">
                {/* Left Sidebar */}
                <aside className="space-y-4">
                    {/* Role Card */}
                    <div className="w-full flex items-center justify-between p-4 border-2 border-primary rounded-xl bg-white">
                        <div>
                            <p className="font-semibold text-primary capitalize">{roleName}</p>
                            <p className="text-sm text-slate-500 mt-0.5 first-letter:uppercase">{roleDescription}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
                    </div>

                    {/* Users List */}
                    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700">User(s)</span>
                            <span className="text-sm text-slate-500">{totalUsers}</span>
                        </div>
                        <div className="space-y-3">
                            {assignedUsers.map((user, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-700">{user.name}</span>
                                    <span className="text-sm text-slate-500">{user.email}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content - Right Side */}
                <main className="max-w-2xl">
                    <div className="space-y-8">
                        {/* Roles and Permissions Heading */}
                        <h2 className="text-xl font-semibold">Roles and Permissions</h2>

                        {/* Role Name Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                                Role Name<span className="text-destructive">*</span>
                            </Label>
                            <Input
                                value={roleName}
                                readOnly
                                className="h-12 border-slate-200 rounded-lg bg-slate-50 capitalize"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                                Description<span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                value={roleDescription}
                                readOnly
                                className="min-h-[80px] resize-none border-slate-200 rounded-lg bg-slate-50 first-letter:uppercase"
                            />
                        </div>

                        {/* Permissions Accordion */}
                        <Accordion type="single" collapsible defaultValue="permissions" className="w-full bg-slate-50/50 rounded-xl">
                            <AccordionItem value="permissions" className="border-none">
                                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                    <span className="text-lg font-medium">Permission</span>
                                    <ChevronUp className="w-5 h-5 transition-transform duration-200" />
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 border-t border-slate-100 mt-2 pt-6">
                                    <div className="space-y-10">
                                        {permissionsGroups.map((group) => (
                                            <div key={group.resource} className="space-y-6">
                                                <h3 className="text-base font-semibold text-slate-800">{formatPermissionName(group.resource)}</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                                    {group.permissions.map((permission) => (
                                                        <div key={permission.permissionId} className="flex items-center space-x-3">
                                                            <Checkbox
                                                                id={permission.permissionId}
                                                                checked={true}
                                                                disabled
                                                                className="w-5 h-5 border-2 border-primary rounded data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                            />
                                                            <label
                                                                htmlFor={permission.permissionId}
                                                                className="text-sm leading-none text-slate-600"
                                                            >
                                                                {formatPermissionName(permission.name)}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {permissionsGroups.length === 0 && (
                                            <p className="text-sm text-slate-400">No permissions assigned to this role.</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default withPermissions(ViewRolePage, ["read:roles"]);
