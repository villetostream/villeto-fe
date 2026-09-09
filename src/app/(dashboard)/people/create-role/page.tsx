"use client"

import { useEffect, useState, useMemo } from "react";
import { logger } from "@/lib/logger";
import { asRecord, getApiErrorMessage, getOptionalString, isRecord } from "@/lib/types/api-error";
import { Plus, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useSearchParams } from "next/navigation";
import { roleSchema, type RoleFormData } from "@/lib/schemas/schemas";
import type { z } from "zod";
import { useCreateRoleApi } from "@/queries/role/create-role";
import { useUpdateRoleApi } from "@/queries/role/update-role";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/lib/query/keys";
import { useUpdateRoleCapabilitiesApi } from "@/queries/role/update-role-capabilities";
import { useGetAllRoleCapabilitiesApi } from "@/queries/role/get-role-capabilities";
import { useLegalEntities } from "@/queries/legal-entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useGetARoleApi } from "@/queries/role/get-a-role";
import { useGetAllRolesApi, type RoleCapabilityInput } from "@/queries/role/get-all-roles";
import { useGetAllDepartmentsApi } from "@/queries/departments/get-all-departments";
import toast from "react-hot-toast";
import withPermissions from "@/components/permissions/permission-protected-routes";
import SuccessModal from "@/components/modals/SuccessModal";
import { useAuthStore } from "@/stores/auth-stores";
import { RoleCapabilityEditor } from "@/components/dashboard/people/role/RoleCapabilityEditor";
import { capabilitiesFromRole, capabilitiesEqual } from "@/features/auth/role-capability-form";

function CreateRolePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleId = searchParams.get("id");
    const isEditMode = Boolean(roleId);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const [selectedCapabilities, setSelectedCapabilities] = useState<RoleCapabilityInput[]>([]);
    const [initialCapabilities, setInitialCapabilities] = useState<RoleCapabilityInput[]>([]);

    const { user } = useAuthStore();
    const isCurrentUserOwner = (user?.companyRole?.templateKey || (user as any)?.villetoRole?.templateKey) === "owner";
    const queryClient = useQueryClient();

    // Data fetching
    const { data: allCapabilities, isLoading: capabilitiesLoading } = useGetAllRoleCapabilitiesApi(true);
    const { data: departmentsData } = useGetAllDepartmentsApi();
    const { data: legalEntitiesData } = useLegalEntities({ enabled: true });
    
    const departments = useMemo(() => departmentsData?.data || [], [departmentsData]);
    const legalEntities = useMemo(() => legalEntitiesData?.data || [], [legalEntitiesData]);

    const createRoleMutation = useCreateRoleApi();
    const updateRoleMutation = useUpdateRoleApi();
    const updateCapabilitiesMutation = useUpdateRoleCapabilitiesApi();
    const roleData = useGetARoleApi(roleId ?? "", { enabled: isEditMode });

    // Form
    const {
        register,
        formState: { errors, isDirty },
        getValues,
        reset,
        control,
    } = useForm<z.input<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        defaultValues: { name: "", description: "", isActive: true },
    });

    const formValues = useWatch({ control });
    
    // Unsaved changes guard
    const hasUnsavedChanges = isDirty || !capabilitiesEqual(selectedCapabilities, initialCapabilities);
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Pre-fill form in edit mode
    useEffect(() => {
        if (roleData?.data && isEditMode && allCapabilities) {
            const r = roleData.data.data;
            reset({
                description: r.description ?? "",
                name: r.name ?? "",
                isActive: r.isActive === true || r.isActive === "Active",
            });
            const loadedCapabilities = capabilitiesFromRole(r.selectedCapabilities, allCapabilities);
            queueMicrotask(() => {
                setSelectedCapabilities(loadedCapabilities);
                setInitialCapabilities(loadedCapabilities);
            });
        }
    }, [roleData?.data, isEditMode, reset, allCapabilities]);

    const handleDirectSubmit = async () => {
        const data = getValues();
        if (!data.name?.trim()) { toast.error("Role name is required."); return; }

        try {
            if (isEditMode && roleId) {
                if (isDirty) {
                    await updateRoleMutation.mutateAsync({
                        id: roleId,
                        data: {
                            name: data.name,
                            isActive: data.isActive,
                            description: data.description,
                        }
                    });
                }
                if (!capabilitiesEqual(selectedCapabilities, initialCapabilities)) {
                    await updateCapabilitiesMutation.mutateAsync({
                        roleId,
                        capabilities: selectedCapabilities,
                    });
                }
            } else {
                const res = await createRoleMutation.mutateAsync({ 
                    name: data.name,
                    description: data.description,
                    capabilities: selectedCapabilities,
                });
                const savedRoleId = getOptionalString(asRecord(isRecord(res) ? res.data : res).roleId) ?? null;
                // create role mutation already sends capabilities, no need to update if it succeeded
            }
            
            // reset pristine state so beforeunload guard passes
            reset(getValues());
            setInitialCapabilities(selectedCapabilities);
            
            toast.success(`Role ${isEditMode ? "updated" : "created"}!`);
            setShowSuccessModal(true);
        } catch (error: unknown) {
            logger.error("Error submitting role:", error);
            toast.error(getApiErrorMessage(error, "Something went wrong. Please try again."));
        }
    };

    const isLoading =
        createRoleMutation.isPending ||
        updateRoleMutation.isPending ||
        updateCapabilitiesMutation.isPending;

    const handleCancel = () => {
        if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
            return;
        }
        
        const returnPath = sessionStorage.getItem("rolesReturnPath");
        if (returnPath) {
            sessionStorage.removeItem("rolesReturnPath");
            router.push(returnPath);
        } else {
            router.push("/people?tab=roles");
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.people.roles });
        if (roleId) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.people.role(roleId) });
        }
        
        if (!isEditMode) {
            reset({});
            handleCancel();
        }
    };

    if (isEditMode && roleData.isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-[24px] font-bold text-[#0b100e] mb-8">Roles and Permissions</h1>
                <div className="flex items-center justify-center py-32 text-[#84908a] gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0ea894]" />
                    <span className="text-[13px] font-medium">Loading role details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-start">
                <aside className="sticky top-6 space-y-8 h-fit">
                    <h1 className="text-[24px] font-bold text-[#0b100e]">Roles and Permissions</h1>
                    <button
                        className="w-full flex items-center justify-between p-4 border border-[#0ea894]/25 rounded-[14px] text-[#087f70] bg-[#e7f6f2]/30 hover:bg-[#e7f6f2]/50 transition-colors"
                        type="button"
                    >
                        <div className="flex items-center gap-3">
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold text-[15px]">{isEditMode ? "Edit Role" : "Add New Role"}</span>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="bg-white rounded-[16px] border border-black/[0.06] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <h3 className="text-[13px] font-bold text-[#0b100e] mb-2">How access works</h3>
                        <p className="text-[12.5px] text-[#68726d] leading-relaxed">
                            Each capability describes what someone can do (e.g. view invoices, approve purchases). The scope controls whose data they can see — just their own, their team&apos;s, or the entire company.
                        </p>
                    </div>
                </aside>

                <main className="max-w-2xl">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                        <section className="space-y-6">
                            <h2 className="text-[20px] font-bold text-[#0b100e]">Describe {isEditMode ? "" : "New "}Role</h2>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[13px] font-semibold text-[#0b100e]">
                                    Role Name<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter role name"
                                    className="h-[46px] border-black/[0.1] rounded-[10px] text-[13px] focus-visible:ring-[#0ea894] placeholder:text-[#84908a]"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-[12px] text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[13px] font-semibold text-[#0b100e]">
                                    Description<span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe role"
                                    className="min-h-[100px] resize-none border-black/[0.1] rounded-[10px] text-[13px] focus-visible:ring-[#0ea894] placeholder:text-[#84908a]"
                                    {...register("description")}
                                />
                                {errors.description && <p className="text-[12px] text-red-500">{errors.description.message}</p>}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-bold text-[#0b100e]">Choose what this role can do</h2>
                            
                            {capabilitiesLoading ? (
                                <div className="flex items-center justify-center py-12 gap-2 text-slate-400 border border-dashed border-black/[0.1] rounded-xl">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading capabilities…</span>
                                </div>
                            ) : (
                                <RoleCapabilityEditor
                                    catalog={allCapabilities || []}
                                    value={selectedCapabilities}
                                    onChange={setSelectedCapabilities}
                                    departments={departments}
                                    legalEntities={legalEntities}
                                    isEditDisabled={isEditMode && roleData?.data?.data?.templateKey === "owner" && !isCurrentUserOwner}
                                />
                            )}
                        </section>

                        <div className="sticky bottom-0 pb-6 pt-4 mt-8 bg-[#f4f7f5] border-t border-black/[0.08] flex justify-end gap-4 z-20 after:absolute after:top-full after:left-0 after:right-0 after:h-[100px] after:bg-[#f4f7f5]">
                            <Button
                                type="button"
                                variant="outline"
                                className="px-8 h-[46px] rounded-[10px] text-[13px] font-semibold border-black/[0.1] text-[#303834] hover:bg-[#f5f7f6]"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            
                            {(() => {
                                const isTargetOwner = roleData?.data?.data?.templateKey === "owner";
                                const blockedFromEditing = isTargetOwner && !isCurrentUserOwner;
                                
                                if (blockedFromEditing) {
                                    return (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-red-500 font-medium">Only Owners can modify this role</span>
                                            <Button
                                                type="button"
                                                disabled
                                                className="px-12 h-[46px] rounded-[10px] text-[13px] font-semibold bg-[#0ea894] hover:bg-[#0c9785] text-white opacity-50"
                                            >
                                                Update Role
                                            </Button>
                                        </div>
                                    );
                                }

                                return (
                                    <Button
                                        type="button"
                                        className="px-12 h-[46px] rounded-[10px] text-[13px] font-semibold bg-[#0ea894] hover:bg-[#0c9785] text-white shadow-[0_8px_20px_-10px_rgba(14,168,148,0.7)] hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                                        disabled={isLoading || !hasUnsavedChanges}
                                        onClick={handleDirectSubmit}
                                    >
                                        {isLoading
                                            ? (isEditMode ? "Updating…" : "Creating…")
                                            : (isEditMode ? "Update Role" : "Create Role")
                                        }
                                    </Button>
                                );
                            })()}
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

export default withPermissions(CreateRolePage, [{ resource: "user", action: "manage" }]);
