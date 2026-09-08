"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Loader2, Plus, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SuccessModal from "@/components/modals/SuccessModal";
import withPermissions from "@/components/permissions/permission-protected-routes";
import { RoleCapabilityEditor } from "@/components/dashboard/people/role/RoleCapabilityEditor";
import {
  capabilitiesEqual,
  capabilitiesFromRole,
  newlySelectedSensitiveCapabilities,
  normalizeCapabilities,
} from "@/features/auth/role-capability-form";
import { getApiErrorMessage } from "@/lib/types/api-error";
import { roleSchema } from "@/lib/schemas/schemas";
import { logger } from "@/lib/logger";
import { useCreateRoleApi } from "@/queries/role/create-role";
import { useGetARoleApi } from "@/queries/role/get-a-role";
import { useGetAllRoleCapabilitiesApi } from "@/queries/role/get-role-capabilities";
import type { CapabilityGroup, Role, RoleCapabilityInput } from "@/queries/role/get-all-roles";
import { useUpdateRoleApi } from "@/queries/role/update-role";
import { useUpdateRoleCapabilitiesApi } from "@/queries/role/update-role-capabilities";

interface RoleDetails {
  name: string;
  description: string;
  isActive: boolean;
}

const EMPTY_DETAILS: RoleDetails = { name: "", description: "", isActive: true };

function RoleEditorForm({
  roleId,
  role,
  catalog,
}: {
  roleId: string | null;
  role?: Role;
  catalog: CapabilityGroup[];
}) {
  const router = useRouter();
  const isEditMode = Boolean(roleId);
  const [initialDetails] = useState<RoleDetails>(() => role
    ? {
        name: role.name ?? "",
        description: role.description ?? "",
        isActive: role.isActive === true || role.isActive === "Active",
      }
    : EMPTY_DETAILS);
  const [initialCapabilities] = useState<RoleCapabilityInput[]>(() =>
    capabilitiesFromRole(role?.selectedCapabilities, catalog),
  );
  const [details, setDetails] = useState<RoleDetails>(initialDetails);
  const [capabilities, setCapabilities] = useState<RoleCapabilityInput[]>(initialCapabilities);
  const [confirmedSensitiveAccess, setConfirmedSensitiveAccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const createRole = useCreateRoleApi();
  const updateRole = useUpdateRoleApi();
  const updateCapabilities = useUpdateRoleCapabilitiesApi();

  const metadataChanged = JSON.stringify(details) !== JSON.stringify(initialDetails);
  const capabilitiesChanged = !capabilitiesEqual(capabilities, initialCapabilities);
  const hasChanges = !isEditMode || metadataChanged || capabilitiesChanged;
  const newlySensitiveKeys = useMemo(
    () => newlySelectedSensitiveCapabilities(initialCapabilities, capabilities, catalog),
    [capabilities, catalog, initialCapabilities],
  );
  const isSaving = createRole.isPending || updateRole.isPending || updateCapabilities.isPending;

  const handleCancel = () => {
    const returnPath = sessionStorage.getItem("rolesReturnPath");
    sessionStorage.removeItem("rolesReturnPath");
    router.push(returnPath || "/people?tab=roles");
  };

  const handleSubmit = async () => {
    const validation = roleSchema.safeParse(details);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Please review the role details.");
      return;
    }
    if (newlySensitiveKeys.length && !confirmedSensitiveAccess) {
      toast.error("Confirm the sensitive capabilities before saving this role.");
      return;
    }

    try {
      if (roleId) {
        if (metadataChanged) {
          await updateRole.mutateAsync({ id: roleId, data: details });
        }
        if (capabilitiesChanged) {
          await updateCapabilities.mutateAsync({
            roleId,
            capabilities: normalizeCapabilities(capabilities),
          });
        }
      } else {
        await createRole.mutateAsync({
          name: details.name.trim(),
          description: details.description.trim() || undefined,
          capabilities: normalizeCapabilities(capabilities),
        });
      }
      setShowSuccessModal(true);
    } catch (error: unknown) {
      logger.error("Error saving role", error);
      toast.error(getApiErrorMessage(error, "The role could not be saved. Please try again."));
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[300px_1fr]">
        <aside className="sticky top-6 h-fit space-y-8">
          <h1 className="text-[24px] font-bold text-[#0b100e]">Roles and access</h1>
          <div className="flex w-full items-center justify-between rounded-[14px] border border-[#0ea894]/25 bg-[#e7f6f2]/30 p-4 text-[#087f70]">
            <div className="flex items-center gap-3">
              <Plus className="size-5" />
              <span className="text-[15px] font-semibold">{isEditMode ? "Edit role" : "Add new role"}</span>
            </div>
            <ChevronRight className="size-5" />
          </div>
          <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-[12px] text-[#66706b]">
            <p className="font-semibold text-[#303834]">How access works</p>
            <p className="mt-1">Capabilities describe a job outcome. Scope controls which company records the role can reach. Backend authorization remains the final enforcement point.</p>
          </div>
        </aside>

        <main className="max-w-3xl space-y-8">
          <section className="space-y-5">
            <h2 className="text-[20px] font-bold text-[#0b100e]">{isEditMode ? "Role details" : "Describe the new role"}</h2>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[13px] font-semibold">Role name<span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={details.name}
                onChange={(event) => setDetails((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. Procurement Manager"
                className="h-[46px] rounded-[10px] border-black/[0.1] text-[13px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[13px] font-semibold">Description</Label>
              <Textarea
                id="description"
                value={details.description}
                onChange={(event) => setDetails((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe who should receive this role"
                className="min-h-[96px] resize-none rounded-[10px] border-black/[0.1] text-[13px]"
              />
            </div>
            {isEditMode && (
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/[0.08] bg-white p-4">
                <Checkbox
                  checked={details.isActive}
                  onCheckedChange={(checked) => setDetails((current) => ({ ...current, isActive: checked === true }))}
                />
                <span>
                  <span className="block text-[13px] font-semibold text-[#303834]">Role is active</span>
                  <span className="block text-[11px] text-[#66706b]">Inactive roles cannot remain the only active role for an assigned user.</span>
                </span>
              </label>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#0b100e]">Assign capabilities</h2>
              <p className="mt-1 text-[12px] text-[#66706b]">Select complete workflows and choose the narrowest scope the role needs.</p>
            </div>
            <RoleCapabilityEditor
              catalog={catalog}
              value={capabilities}
              onChange={(next) => {
                setCapabilities(next);
                setConfirmedSensitiveAccess(false);
              }}
            />
          </section>

          {newlySensitiveKeys.length > 0 && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <ShieldAlert className="size-4" />
              <AlertTitle>Sensitive access is being added</AlertTitle>
              <AlertDescription>
                <p>Review the scope carefully for: {newlySensitiveKeys.map((key) => catalog.find((group) => group.key === key)?.name ?? key).join(", ")}.</p>
                <label className="mt-3 flex cursor-pointer items-start gap-2 font-medium text-red-900">
                  <Checkbox checked={confirmedSensitiveAccess} onCheckedChange={(checked) => setConfirmedSensitiveAccess(checked === true)} />
                  <span>I confirm this role needs the selected sensitive access.</span>
                </label>
              </AlertDescription>
            </Alert>
          )}

          <div className="sticky bottom-0 z-20 flex justify-end gap-4 border-t border-black/[0.08] bg-[#f4f7f5] py-5">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
            <Button
              type="button"
              className="min-w-36 bg-[#0ea894] text-white hover:bg-[#0c9785]"
              disabled={isSaving || !hasChanges}
              onClick={handleSubmit}
            >
              {isSaving ? "Saving…" : isEditMode ? "Update role" : "Create role"}
            </Button>
          </div>
        </main>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCancel}
        title={`Role ${isEditMode ? "Updated" : "Created"} Successfully`}
        description={details.name}
      />
    </div>
  );
}

function CreateRolePage() {
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEditMode = Boolean(roleId);
  const capabilityCatalog = useGetAllRoleCapabilitiesApi(true);
  const roleQuery = useGetARoleApi(roleId ?? "", { enabled: isEditMode });

  if (capabilityCatalog.isLoading || (isEditMode && roleQuery.isLoading)) {
    return (
      <div className="flex items-center justify-center gap-3 p-24 text-[#84908a]">
        <Loader2 className="size-7 animate-spin text-[#0ea894]" />
        <span className="text-sm font-medium">Loading role configuration…</span>
      </div>
    );
  }

  if (capabilityCatalog.isError || (isEditMode && (roleQuery.isError || !roleQuery.data?.data))) {
    return (
      <div className="p-12">
        <Alert variant="destructive" className="mx-auto max-w-xl">
          <ShieldAlert className="size-4" />
          <AlertTitle>Role configuration unavailable</AlertTitle>
          <AlertDescription>Refresh the page or try again after the role service is available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <RoleEditorForm
      key={roleId ?? "new-role"}
      roleId={roleId}
      role={roleQuery.data?.data}
      catalog={capabilityCatalog.data ?? []}
    />
  );
}

export default withPermissions(CreateRolePage, [{ resource: "role", action: "manage" }]);
