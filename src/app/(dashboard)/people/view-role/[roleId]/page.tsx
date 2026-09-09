"use client"

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Edit2, ShieldCheck, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useGetARoleApi } from "@/queries/role/get-a-role";
import { useGetAllDepartmentsApi } from "@/queries/departments/get-all-departments";
import type { Role, SelectedRoleCapability, ImpliedRoleCapability, CapabilityScopeType } from "@/queries/role/get-all-roles";
import { formatPermissionName, cn } from "@/lib/utils";
import withPermissions from "@/components/permissions/permission-protected-routes";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-stores";
import { Button } from "@/components/ui/button";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useDeleteRoleApi } from "@/queries/role/delete-role";
import { useGetAllRoleCapabilitiesApi } from "@/queries/role/get-role-capabilities";
import { useLegalEntities } from "@/queries/legal-entities";
import toast from "react-hot-toast";

const SCOPE_LABELS: Record<CapabilityScopeType, string> = {
  own: "Own",
  reporting_chain: "Reporting Chain",
  department: "Specific Departments",
  company: "Entire company",
};

const RISK_CONFIG = {
  standard: { color: "bg-slate-100 text-slate-700 border-slate-200", label: "Standard" },
  elevated: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Elevated" },
  sensitive: { color: "bg-red-100 text-red-700 border-red-200", label: "Sensitive" },
};

// ── Capability Card (read-only) ──────────────────────────
function CapabilityCard({ 
  cap, 
  departmentsMap,
  legalEntitiesMap,
  descriptionMap,
  isImplied = false 
}: { 
  cap: SelectedRoleCapability | ImpliedRoleCapability | any;
  departmentsMap: Record<string, string>;
  legalEntitiesMap: Record<string, string>;
  descriptionMap?: Record<string, string>;
  isImplied?: boolean;
}) {
    const risk = "riskLevel" in cap ? (cap.riskLevel || "standard") : "standard";
    const riskStyles = RISK_CONFIG[risk as keyof typeof RISK_CONFIG] || RISK_CONFIG.standard;
    const hasDeptScope = cap.scopeType === "department" && cap.scopeConfig?.departmentIds?.length > 0;
    const hasEntityScope = cap.scopeConfig?.legalEntityIds?.length > 0;
    const description = cap.description || (descriptionMap && descriptionMap[cap.key]) || null;

    return (
        <div className="border border-black/[0.08] rounded-[12px] bg-white p-4">
            <div className="flex items-start gap-3">
                <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5", isImplied ? "bg-slate-100" : "bg-[#e7f6f2]")}>
                    <ShieldCheck className={cn("w-3.5 h-3.5", isImplied ? "text-slate-500" : "text-[#0ea894]")} />
                </div>
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn("text-[14px] font-semibold", isImplied ? "text-slate-600" : "text-[#0b100e]")}>
                            {cap.name}
                        </p>
                        
                        <Badge variant="outline" className="text-[11px] font-medium bg-[#f9faf9] px-2 py-0.5 text-[#505a55]">
                            {SCOPE_LABELS[cap.scopeType as CapabilityScopeType] || cap.scopeType}
                        </Badge>
                        
                        {isImplied ? (
                            <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 border-none px-2 py-0.5">
                                Auto-Granted
                            </Badge>
                        ) : (
                            <Badge className={cn("text-[10px] font-medium border px-2 py-0.5", riskStyles.color)} variant="outline">
                                {riskStyles.label}
                            </Badge>
                        )}
                    </div>
                    {description && (
                        <p className="text-[13px] text-[#66706b]">{description}</p>
                    )}
                    {hasDeptScope && (
                        <div className="flex gap-2 flex-wrap items-center mt-0.5">
                            {cap.scopeConfig?.departmentIds?.map((deptId: string) => (
                                <span key={deptId} className="text-[11px] text-[#505a55] bg-slate-100 px-2 py-0.5 rounded-md">
                                    {departmentsMap[deptId] || deptId}
                                </span>
                            ))}
                        </div>
                    )}
                    {hasEntityScope && (
                        <div className="flex gap-2 flex-wrap items-center mt-0.5">
                            {cap.scopeConfig?.legalEntityIds?.map((entityId: string) => (
                                <span key={entityId} className="text-[11px] text-[#087f70] bg-[#e7f6f2] px-2 py-0.5 rounded-md border border-[#0ea894]/20">
                                    {legalEntitiesMap[entityId] || entityId}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Module Section ─────────────────────────────────────────────────────────
function ModuleSection({ moduleName, items, title, departmentsMap, legalEntitiesMap, descriptionMap, isImplied }: { moduleName: string; items: any[]; title?: string; departmentsMap: Record<string, string>; legalEntitiesMap: Record<string, string>; descriptionMap?: Record<string, string>; isImplied?: boolean; }) {
    const [open, setOpen] = useState(true);
    const label = moduleName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 w-full text-left"
            >
                <span className="text-[11px] font-bold text-[#84908a] uppercase tracking-[0.1em]">
                    {title ? title : label}
                </span>
                <div className="flex-1 h-px bg-black/[0.06]" />
                {open ? <ChevronUp className="w-4 h-4 text-[#84908a]" /> : <ChevronDown className="w-4 h-4 text-[#84908a]" />}
            </button>
            {open && (
                <div className="space-y-2 pl-2">
                    {items.map(cap => (
                        <CapabilityCard key={cap.key} cap={cap} departmentsMap={departmentsMap} legalEntitiesMap={legalEntitiesMap} descriptionMap={descriptionMap} isImplied={isImplied} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── View Role Page ─────────────────────────────────────────────────────────
function ViewRolePage() {
    const params = useParams();
    const router = useRouter();
    const currentUser = useAuthStore(state => state.user);
    const roleId = params.roleId as string;
    const { data: roleData, isLoading: isRoleLoading } = useGetARoleApi(roleId, { enabled: !!roleId });
    const { data: departmentsData, isLoading: isDeptsLoading } = useGetAllDepartmentsApi();
    const { data: legalEntitiesData } = useLegalEntities({ enabled: true });
    const { data: capabilityCatalog } = useGetAllRoleCapabilitiesApi(!!roleId);
    const deleteRoleMutation = useDeleteRoleApi();
    const role = roleData?.data as Role | undefined;

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // Build description lookup from catalog
    const descriptionMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (capabilityCatalog) {
            for (const g of capabilityCatalog) {
                if (g.key && g.description) {
                    map[g.key] = g.description;
                }
            }
        }
        return map;
    }, [capabilityCatalog]);

    const departmentsMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const d of departmentsData?.data || []) {
            map[d.departmentId] = d.name;
        }
        return map;
    }, [departmentsData]);

    const legalEntitiesMap = useMemo(() => {
        const map: Record<string, string> = {};
        for (const e of legalEntitiesData?.data || []) {
            map[e.legalEntityId] = `${e.code} — ${e.legalName}`;
        }
        return map;
    }, [legalEntitiesData]);

    const handleDelete = async () => {
        try {
            await deleteRoleMutation.mutateAsync(roleId);
            toast.success("Role deleted successfully.");
            setDeleteModalOpen(false);
            router.push("/people?tab=roles");
        } catch (_error) {
            toast.error("Failed to delete the role.");
            setDeleteModalOpen(false);
        }
    };

    // Group selected capabilities by module
    const selectedByModule = useMemo(() => {
        const map: Record<string, SelectedRoleCapability[]> = {};
        if (role?.selectedCapabilities) {
            for (const cap of role.selectedCapabilities) {
                if (!map[cap.module]) map[cap.module] = [];
                map[cap.module].push(cap);
            }
        }
        return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
    }, [role?.selectedCapabilities]);

    // Group implied capabilities by module
    const impliedByModule = useMemo(() => {
        const map: Record<string, ImpliedRoleCapability[]> = {};
        if (role?.impliedCapabilities) {
            for (const cap of role.impliedCapabilities) {
                if (!map[cap.module]) map[cap.module] = [];
                map[cap.module].push(cap);
            }
        }
        return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
    }, [role?.impliedCapabilities]);

    const hasCapabilities = selectedByModule.length > 0 || impliedByModule.length > 0;

    if (isRoleLoading || isDeptsLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0ea894]" />
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="p-6 text-center text-slate-400 text-sm">Role not found.</div>
        );
    }

    const roleName = role.name?.replace(/_/g, ' ') || "Role";
    const totalUsers = role.totalAssignedUsers || 0;

    const isViewedRoleOwner = role.templateKey === "owner";
    const isCurrentUserOwner = (currentUser?.companyRole?.templateKey || (currentUser as any)?.villetoRole?.templateKey) === "owner";
    const isEditDisabled = isViewedRoleOwner && !isCurrentUserOwner;



    return (
        <div className="p-3 sm:p-5 lg:p-6 pt-0 sm:pt-0 lg:pt-0 space-y-6">
            <div className="flex items-center justify-between gap-4 sticky -top-3 sm:-top-5 lg:-top-6 z-50 bg-[#f4f7f5] -mt-3 sm:-mt-5 lg:-mt-6 pt-3 sm:pt-5 lg:pt-6 pb-4 -mx-3 sm:-mx-5 lg:-mx-6 px-3 sm:px-5 lg:px-6">
                <h1 className="text-2xl font-semibold">Role details</h1>
                
                <div className="flex items-center gap-3 shrink-0">
                    <PermissionGuard anyOf={["role.manage"]}>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={isEditDisabled}
                            className="gap-2 h-9 rounded-[8px] text-[13px] font-semibold"
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete Role
                        </Button>
                    </PermissionGuard>

                    <PermissionGuard anyOf={["role.manage"]}>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isEditDisabled}
                            onClick={() => {
                                sessionStorage.setItem("rolesReturnPath", `/people/view-role/${roleId}`);
                                router.push(`/people/create-role?id=${roleId}`);
                            }}
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Role
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
                <aside className="space-y-4 md:sticky md:top-24 self-start">
                    <div className="w-full flex items-center justify-between p-4 border border-[#0ea894]/25 rounded-[14px] bg-[#e7f6f2]/30">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-[#087f70] capitalize">{roleName}</p>
                                <Badge variant={role.isActive === true || role.isActive === "Active" ? "active" : "inactive"} className="text-xs">
                                    {role.isActive === true || role.isActive === "Active" ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <p className="text-[13px] text-[#66706b] first-letter:uppercase">
                                {role.description || "No description provided."}
                            </p>
                            {role.source && (
                                <p className="text-[11px] text-[#84908a] mt-1 capitalize">
                                    {role.isDefault ? "Default" : "Custom"} · {role.source.replace(/_/g, ' ')}
                                </p>
                            )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#0ea894] flex-shrink-0" />
                    </div>

                    <div className="border border-black/[0.08] rounded-[12px] p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-[#0b100e]">Assigned Users</span>
                            <span className="text-[13px] font-bold text-[#087f70]">{totalUsers}</span>
                        </div>
                        <p className="text-[12px] text-[#84908a]">Changes to this role affect every assigned user.</p>
                    </div>

                    <div className="border border-black/[0.08] rounded-[12px] p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-semibold text-[#0b100e]">Effective permissions</span>
                            <span className="text-[13px] font-bold text-[#087f70]">{role.effectivePermissions?.length || role.permissions?.length || 0}</span>
                        </div>
                        <p className="text-[12px] text-[#84908a]">Calculated by Villeto from selected and required capabilities.</p>
                    </div>
                </aside>

                <main className="space-y-12">
                    {hasCapabilities ? (
                        <>
                            {selectedByModule.length > 0 && (
                                <div className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-[18px] font-semibold text-[#0b100e]">Selected capabilities</h2>
                                        <p className="text-[13px] text-[#84908a] mt-1">Business workflows explicitly selected for this role.</p>
                                    </div>
                                    <div className="space-y-8">
                                        {selectedByModule.map(([moduleName, caps]) => (
                                            <ModuleSection key={moduleName} moduleName={moduleName} items={caps} departmentsMap={departmentsMap} legalEntitiesMap={legalEntitiesMap} descriptionMap={descriptionMap} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {impliedByModule.length > 0 && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 mb-4 pt-6 border-t border-black/[0.06]">
                                        <Lock className="w-4 h-4 text-[#84908a]" />
                                        <div>
                                            <h2 className="text-[18px] font-semibold text-[#0b100e]">Included dependencies</h2>
                                            <p className="text-[13px] text-[#84908a] mt-0.5">Villeto adds these automatically so each selected workflow remains usable.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {impliedByModule.flatMap(([, caps]) => caps).map(cap => {
                                            const moduleLabel = cap.module?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || '';
                                            return (
                                                <div key={cap.key} className="flex items-start gap-3 p-3.5 border border-black/[0.06] rounded-[10px] bg-white">
                                                    <div className="w-7 h-7 rounded-md flex items-center justify-center bg-slate-100 shrink-0 mt-0.5">
                                                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[13px] font-semibold text-[#0b100e] truncate">{cap.name}</p>
                                                        <p className="text-[11px] text-[#84908a] mt-0.5">
                                                            {moduleLabel} · {SCOPE_LABELS[cap.scopeType as CapabilityScopeType] || cap.scopeType}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="border border-dashed border-black/[0.08] rounded-[12px] p-10 text-center bg-white">
                            <p className="text-[13px] text-[#84908a] mb-4">No capabilities assigned to this role.</p>
                            <PermissionGuard anyOf={["role.manage"]}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isEditDisabled}
                                    className="border-[#0ea894]/30 text-[#087f70] hover:bg-[#e7f6f2] rounded-[8px] text-[13px] font-semibold"
                                    onClick={() => router.push(`/people/create-role?id=${roleId}`)}
                                >
                                    Assign Capabilities
                                </Button>
                            </PermissionGuard>
                        </div>
                    )}

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                        title="Delete Role"
                        description={
                            <>
                                Are you sure you want to delete <span className="font-semibold text-slate-900">{roleName}</span>?
                                Users assigned to this role might lose their access. This action cannot be undone.
                            </>
                        }
                    />
                </main>
            </div>
        </div>
    );
}

export default withPermissions(ViewRolePage, [{ resource: "user", action: "manage" }, { resource: "user", action: "read" }]);
