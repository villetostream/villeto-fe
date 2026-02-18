"use client"

import { useEffect, useState } from "react";
import { Plus, ChevronRight, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllPermissionsApi } from "@/actions/auth/auth-permissions";
import { groupPermissionsByResource, PermissionsGroup, cn } from "@/lib/utils";
import { RoleFormData, roleSchema } from "@/lib/schemas/schemas";
import { useCreateRoleApi } from "@/actions/role/create-role";
import { useUpdateRoleApi } from "@/actions/role/update-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useGetARoleApi } from "@/actions/role/get-a-role";
import { useGetAllRolesApi } from "@/actions/role/get-all-roles";
import toast from "react-hot-toast";
import withPermissions from "@/components/permissions/permission-protected-routes";
import SuccessModal from "@/components/modals/SuccessModal";

function CreateRolePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleId = searchParams.get("id");
    const isEditMode = Boolean(roleId);

    const [permissions, setPermissions] = useState<PermissionsGroup[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const allPermissions = useGetAllPermissionsApi();
    const createRoleMutation = useCreateRoleApi();
    const updateRoleMutation = useUpdateRoleApi();
    const roleData = useGetARoleApi(roleId ?? "", { enabled: isEditMode });
    const allRoles = useGetAllRolesApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
            permissionIds: [],
        },
    });

    const selectedPermissionIds = watch("permissionIds") || [];
    const formValues = watch();

    useEffect(() => {
        if (allPermissions.data?.data) {
            const groupedPermissions = groupPermissionsByResource(allPermissions.data.data);
            setPermissions(groupedPermissions);
        }
    }, [allPermissions.data]);

    useEffect(() => {
        if (roleData?.data && isEditMode) {
            reset({
                description: roleData.data.data.description ?? "",
                name: roleData?.data?.data.name ?? "",
                isActive: roleData?.data?.data.isActive,
                permissionIds: (roleData?.data?.data?.permissions ?? []).map((permission) => permission.permissionId)
            });
        }
    }, [roleData?.data, isEditMode, reset]);

    const handlePermissionToggle = (permissionId: string) => {
        const currentIds = [...selectedPermissionIds];
        const index = currentIds.indexOf(permissionId);
        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            currentIds.push(permissionId);
        }
        setValue("permissionIds", currentIds, { shouldValidate: true, shouldDirty: true });
    };

    const onSubmit = async (data: RoleFormData) => {
        try {
            if (isEditMode && roleId) {
                await updateRoleMutation.mutateAsync({ id: roleId, data });
            } else {
                await createRoleMutation.mutateAsync(data);
            }
            toast.success(`Role ${isEditMode ? "updated" : "created"}!`);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error submitting role:", error);
        }
    };

    const isLoading = createRoleMutation.isPending || updateRoleMutation.isPending;

    const handleSuccessClose = async () => {
        setShowSuccessModal(false);
        await Promise.all([
            allRoles.refetch(),
            roleData.refetch()
        ]);
        reset({});
        router.push("/people?tab=roles");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">Roles and Permissions</h1>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
                {/* Sidebar */}
                <aside className="space-y-4">
                    <button 
                        className="w-full flex items-center justify-between p-4 border-2 border-primary rounded-xl text-primary bg-white hover:bg-primary/5 transition-colors"
                        type="button"
                    >
                        <div className="flex items-center gap-3">
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold">Add New Role</span>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </aside>

                {/* Main Content */}
                <main className="max-w-2xl">
                    <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-8">
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold">Describe New Role</h2>
                            
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold">
                                    Role Name<span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter role name"
                                    className="h-12 border-gray-200 rounded-lg focus-visible:ring-primary"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold">
                                    Description<span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe role"
                                    className="min-h-[140px] resize-none border-gray-200 rounded-lg focus-visible:ring-primary"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description.message}</p>
                                )}
                            </div>
                        </section>

                        <Accordion type="single" collapsible className="w-full bg-slate-50/50 rounded-xl">
                            <AccordionItem value="permissions" className="border-none">
                                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                                    <span className="text-lg font-semibold">Permission</span>
                                    <ChevronDown className="w-5 h-5 transition-transform duration-200" />
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 border-t border-slate-100 mt-2 pt-6">
                                    <div className="space-y-10">
                                        {permissions.map((group) => (
                                            <div key={group.resource} className="space-y-6">
                                                <h3 className="text-lg font-bold text-slate-800">{group.resource}</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                                    {group.permissions.map((permission) => (
                                                        <div key={permission.permissionId} className="flex items-center space-x-3">
                                                            <Checkbox
                                                                id={permission.permissionId}
                                                                checked={selectedPermissionIds.includes(permission.permissionId)}
                                                                onCheckedChange={() => handlePermissionToggle(permission.permissionId)}
                                                                className="w-5 h-5 border-2 border-slate-300 rounded data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                                            />
                                                            <label
                                                                htmlFor={permission.permissionId}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                                                            >
                                                                {permission.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-8 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                className="px-8 h-12 rounded-xl text-slate-700 border-slate-200 hover:bg-slate-50"
                                onClick={() => router.push("/people?tab=roles")}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="px-12 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Role" : "Create Role")}
                            </Button>
                        </div>
                    </form>
                </main>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                title={`Role ${isEditMode ? 'Updated' : 'Created'} Successfully`}
                description={formValues.name || "Role"}
            />
        </div>
    );
}

export default withPermissions(CreateRolePage, ["create:roles", "read:role"])
