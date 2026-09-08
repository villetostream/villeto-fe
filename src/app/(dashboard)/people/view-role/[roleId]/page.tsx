"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Edit2, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import { getApiErrorMessage } from "@/lib/types/api-error";
import { formatPermissionName } from "@/lib/utils";
import { useDeleteRoleApi } from "@/queries/role/delete-role";
import { useGetARoleApi } from "@/queries/role/get-a-role";
import { useGetAllRoleCapabilitiesApi } from "@/queries/role/get-role-capabilities";
import type { CapabilityScopeType } from "@/queries/role/get-all-roles";
import withPermissions from "@/components/permissions/permission-protected-routes";

const SCOPE_LABELS: Record<CapabilityScopeType, string> = {
  own: "Own records",
  reporting_chain: "Reporting chain",
  department: "Department",
  company: "Entire company",
};

function ViewRolePage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.roleId as string;
  const roleQuery = useGetARoleApi(roleId, { enabled: Boolean(roleId) });
  const catalogQuery = useGetAllRoleCapabilitiesApi(Boolean(roleId));
  const deleteRole = useDeleteRoleApi();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const role = roleQuery.data?.data;
  const catalogByKey = useMemo(
    () => new Map((catalogQuery.data ?? []).map((group) => [group.key, group])),
    [catalogQuery.data],
  );
  const selectedByModule = useMemo(() => {
    const modules = new Map<string, NonNullable<typeof role>["selectedCapabilities"]>();
    for (const capability of role?.selectedCapabilities ?? []) {
      modules.set(capability.module, [...(modules.get(capability.module) ?? []), capability]);
    }
    return Array.from(modules.entries()).sort(([left], [right]) => left.localeCompare(right));
  }, [role]);

  const handleDelete = async () => {
    try {
      await deleteRole.mutateAsync(roleId);
      toast.success("Role deleted successfully.");
      router.push("/people?tab=roles");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "This role could not be deleted."));
    } finally {
      setDeleteOpen(false);
    }
  };

  if (roleQuery.isLoading) {
    return <div className="m-24 h-8 w-8 animate-spin rounded-full border-b-2 border-[#0ea894]" />;
  }
  if (roleQuery.isError || !role) {
    return <div className="p-12 text-center text-sm text-slate-500">Role details could not be loaded.</div>;
  }

  const isActive = role.isActive === true || role.isActive === "Active";
  const roleName = role.name?.replace(/_/g, " ") || "Role";

  return (
    <div className="space-y-6 p-6 pt-0">
      <div className="sticky -top-5 z-50 -mx-6 -mt-5 flex items-center justify-between gap-4 bg-dashboard-background px-6 pb-4 pt-5">
        <h1 className="text-2xl font-semibold">Role details</h1>
        <div className="flex items-center gap-3">
          <PermissionGuard resource="role" action="manage">
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>Delete role</Button>
          </PermissionGuard>
          <PermissionGuard resource="role" action="manage">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sessionStorage.setItem("rolesReturnPath", `/people/view-role/${roleId}`);
                router.push(`/people/create-role?id=${roleId}`);
              }}
            >
              <Edit2 className="size-3.5" /> Edit role
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr]">
        <aside className="space-y-4 self-start md:sticky md:top-24">
          <div className="flex items-center justify-between rounded-[14px] border border-[#0ea894]/25 bg-[#e7f6f2]/30 p-4">
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="font-semibold capitalize text-[#087f70]">{roleName}</p>
                <Badge variant={isActive ? "active" : "inactive"}>{isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="text-[13px] text-[#66706b]">{role.description || "No description provided."}</p>
              <p className="mt-2 text-[11px] capitalize text-[#84908a]">
                {role.isDefault ? "Villeto default" : "Custom role"}{role.source ? ` · ${role.source.replace(/_/g, " ")}` : ""}
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-[#0ea894]" />
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-[13px] font-semibold">Assigned users <span className="text-[#087f70]">{role.totalAssignedUsers ?? 0}</span></p>
            <p className="mt-1 text-[11px] text-[#84908a]">Changes to this role affect every assigned user.</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4">
            <p className="text-[13px] font-semibold">Effective permissions <span className="text-[#087f70]">{role.effectivePermissions?.length ?? role.permissions?.length ?? 0}</span></p>
            <p className="mt-1 text-[11px] text-[#84908a]">Calculated by Villeto from selected and required capabilities.</p>
          </div>
        </aside>

        <main className="space-y-8">
          <section className="space-y-5">
            <div>
              <h2 className="text-[15px] font-semibold text-[#0b100e]">Selected capabilities</h2>
              <p className="mt-1 text-[12px] text-[#66706b]">Business workflows explicitly selected for this role.</p>
            </div>
            {selectedByModule.length ? selectedByModule.map(([module, capabilities]) => (
              <div key={module} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#84908a]">{formatPermissionName(module)}</h3>
                  <div className="h-px flex-1 bg-black/[0.06]" />
                </div>
                {capabilities?.map((capability) => {
                  const group = catalogByKey.get(capability.key);
                  const departmentCount = capability.scopeConfig?.departmentIds?.length ?? 0;
                  const entityCount = capability.scopeConfig?.legalEntityIds?.length ?? 0;
                  return (
                    <div key={capability.key} className="rounded-xl border border-black/[0.08] bg-white p-4">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><ShieldCheck className="size-4" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[13px] font-semibold">{capability.name}</p>
                            <Badge variant="outline" className="px-2 py-0.5">{SCOPE_LABELS[capability.scopeType]}</Badge>
                            <Badge variant="outline" className="px-2 py-0.5 capitalize">{capability.riskLevel}</Badge>
                          </div>
                          <p className="mt-1 text-[12px] text-[#66706b]">{group?.description}</p>
                          {(departmentCount > 0 || entityCount > 0) && (
                            <p className="mt-2 text-[11px] text-[#84908a]">
                              {departmentCount > 0 ? `${departmentCount} selected department${departmentCount === 1 ? "" : "s"}` : ""}
                              {departmentCount > 0 && entityCount > 0 ? " · " : ""}
                              {entityCount > 0 ? `${entityCount} selected legal entit${entityCount === 1 ? "y" : "ies"}` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-[13px] text-[#84908a]">No optional capabilities selected.</div>
            )}
          </section>

          {(role.impliedCapabilities?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-semibold"><GitBranch className="size-4 text-[#087f70]" /> Included dependencies</h2>
                <p className="mt-1 text-[12px] text-[#66706b]">Villeto adds these automatically so each selected workflow remains usable.</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {role.impliedCapabilities?.map((capability) => (
                  <div key={capability.key} className="flex items-center gap-3 rounded-xl border border-black/[0.08] bg-[#f9faf9] p-3">
                    <LockKeyhole className="size-4 shrink-0 text-[#84908a]" />
                    <div>
                      <p className="text-[12px] font-semibold">{capability.name}</p>
                      <p className="text-[11px] text-[#84908a]">{formatPermissionName(capability.module)} · {SCOPE_LABELS[capability.scopeType]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <ConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete role"
        description="This permanently deletes the role. Roles with assignment history must be deactivated instead."
        confirmLabel={deleteRole.isPending ? "Deleting…" : "Delete role"}
        destructive
      />
    </div>
  );
}

export default withPermissions(ViewRolePage, [
  { resource: "role", action: "manage" },
]);
