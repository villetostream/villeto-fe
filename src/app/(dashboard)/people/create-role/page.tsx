"use client"


import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PermissionGroup } from "@/components/dashboard/people/PermissionGroup";
import { useRouter, useSearchParams } from "next/navigation";
import FormSectionHeader from "@/components/dashboard/people/FormSectionHeader";
import { Permission, useGetAllPermissionsApi } from "@/actions/auth/auth-permissions";
import { groupPermissionsByResource, PermissionsGroup } from "@/lib/utils";
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
    const roleData = useGetARoleApi(roleId ?? "", { enabled: isEditMode })
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

    const selectedPermissionIds = watch("permissionIds");
    const formValues = watch();

    useEffect(() => {
        if (allPermissions.data?.data) {
            const groupedPermissions = groupPermissionsByResource(allPermissions.data.data);

            // Initialize permissions with enabled state based on selectedPermissionIds
            const initializedPermissions = groupedPermissions.map(group => ({
                ...group,
                permissions: group.permissions.map(permission => ({
                    ...permission,
                    enabled: (selectedPermissionIds ?? []).includes(permission.permissionId)
                }))
            }));

            setPermissions(initializedPermissions);
        }
    }, [allPermissions.data, selectedPermissionIds]);

    // Fetch role data for editing (you'll need to implement this hook)
    useEffect(() => {
        if (roleData?.data && isEditMode) {
            reset({
                description: roleData.data.data.description ?? "",
                name: roleData?.data?.data.name ?? "",
                isActive: roleData?.data?.data.isActive,
                permissionIds: (roleData?.data?.data?.permissions ?? []).map((permission) => permission.permissionId)
            })
        }
    }, [roleData?.data]);

    const handlePermissionToggle = (groupIndex: number, permissionId: string) => {
        setPermissions(prev => {
            return prev.map((group, index) => {
                if (index !== groupIndex) return group;

                return {
                    ...group,
                    permissions: group.permissions.map(permission =>
                        permission.permissionId === permissionId
                            ? { ...permission, enabled: !permission.enabled }
                            : permission
                    )
                };
            });
        });

        // Update form value
        const currentPermissionIds = [...selectedPermissionIds ?? []];
        const permissionIndex = currentPermissionIds.indexOf(permissionId);

        if (permissionIndex > -1) {
            currentPermissionIds.splice(permissionIndex, 1);
        } else {
            currentPermissionIds.push(permissionId);
        }

        setValue("permissionIds", currentPermissionIds, { shouldValidate: true, shouldDirty: true });
    };

    const onSubmit = async (data: RoleFormData) => {
        try {
            if (isEditMode && roleId) {
                await updateRoleMutation.mutateAsync({ id: roleId, data });
                // Show success message
            } else {
                await createRoleMutation.mutateAsync(data);
                // Show success message
            }
            toast.success(`Role ${isEditMode ? "updated" : "created"}!`)

            setShowSuccessModal(true)
        } catch (error) {
            // Handle error (show toast, etc.)
            console.error("Error submitting role:", error);
        }
    };

    const isLoading = createRoleMutation.isPending || updateRoleMutation.isPending;

    const handleSuccessClose = async () => {
        setShowSuccessModal(false);
        await Promise.all([

            allRoles.refetch(),
            roleData.refetch()
        ])
        reset({})
        router.push("/people?tab=roles");
    };

    return (
        <div>
            <div className="">
                {/* Header */}
                <div className="mb-6">
                    <FormSectionHeader
                        title={isEditMode ? "Edit Role" : "Create New Role"}
                        description="This is to help you define a role for a new user"
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Role Name<span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g DEVELOPER"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isActive">
                                Status<span className="text-destructive">*</span>
                            </Label>
                            <select
                                id="isActive"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("isActive", { setValueAs: (value) => value === "true" })}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                            {errors.isActive && (
                                <p className="text-sm text-destructive">{errors.isActive.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Description (optional)"
                            className="min-h-[100px] resize-none"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Permissions */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium leading-[150%]">Permissions</h2>

                        {errors.permissionIds && (
                            <p className="text-sm text-destructive">{errors.permissionIds.message}</p>
                        )}

                        {permissions.map((group, index) => (
                            <PermissionGroup
                                key={group.resource}
                                name={group.resource}
                                permissions={group.permissions}
                                onPermissionToggle={(permId) => handlePermissionToggle(index, permId)}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-8 pt-4">
                        <Button
                            type="button"
                            size={"md"}
                            variant="outline"
                            onClick={() => router.push("/dashboard/people")}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size={"md"}
                            className="px-12!"
                            disabled={isLoading}
                        >
                            {isLoading ? isEditMode ? "Updating..." : "Creating..." : isEditMode ? "Update Role" : "Create Role"}
                        </Button>
                    </div>
                </form>
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
