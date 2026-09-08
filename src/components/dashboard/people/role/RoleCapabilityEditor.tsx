"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Info, LockKeyhole, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  changeCapabilityScope,
  removeCapability,
  selectCapability,
  toggleScopeResource,
} from "@/features/auth/role-capability-form";
import { formatPermissionName } from "@/lib/utils";
import { useGetAllDepartmentsApi } from "@/queries/departments/get-all-departments";
import { useLegalEntities } from "@/queries/legal-entities";
import type {
  CapabilityGroup,
  CapabilityRiskLevel,
  CapabilityScopeType,
  RoleCapabilityInput,
} from "@/queries/role/get-all-roles";
import { cn } from "@/lib/utils";

const SCOPE_LABELS: Record<CapabilityScopeType, string> = {
  own: "Own records",
  reporting_chain: "Reporting chain",
  department: "Department",
  company: "Entire company",
};

const SCOPE_DESCRIPTIONS: Record<CapabilityScopeType, string> = {
  own: "Only records created by or assigned to the role holder.",
  reporting_chain: "The role holder and people below them in the reporting line.",
  department: "The role holder's department, or only the departments selected below.",
  company: "All matching records in this Villeto company—not other customer companies.",
};

const RISK_STYLES: Record<CapabilityRiskLevel, string> = {
  standard: "border-slate-200 bg-slate-50 text-slate-600",
  elevated: "border-amber-200 bg-amber-50 text-amber-700",
  sensitive: "border-red-200 bg-red-50 text-red-700",
};

function CapabilityCard({
  group,
  capability,
  value,
  catalogByKey,
  onChange,
}: {
  group: CapabilityGroup;
  capability?: RoleCapabilityInput;
  value: RoleCapabilityInput[];
  catalogByKey: Map<string, CapabilityGroup>;
  onChange: (next: RoleCapabilityInput[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const selected = group.isBaseCapability || Boolean(capability);
  const scopeType = capability?.scopeType ?? group.defaultScope;
  const supportsLegalEntityRestriction = group.key.startsWith("purchase_request_");
  const needsDepartments = Boolean(capability && scopeType === "department");
  const needsLegalEntities = Boolean(capability && supportsLegalEntityRestriction);
  const departments = useGetAllDepartmentsApi({ enabled: needsDepartments });
  const legalEntities = useLegalEntities({ enabled: needsLegalEntities });

  const updateSelected = (update: (current: RoleCapabilityInput[]) => RoleCapabilityInput[]) => {
    onChange(update(value));
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white transition-colors",
        selected ? "border-[#0ea894]/40 bg-[#e7f6f2]/15" : "border-black/[0.08]",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <Checkbox
          id={`capability-${group.key}`}
          checked={selected}
          disabled={group.isBaseCapability}
          onCheckedChange={() =>
            updateSelected((current) =>
              capability
                ? removeCapability(current, group.key)
                : selectCapability(current, group),
            )
          }
          className="mt-0.5 shrink-0 border-2 border-[#84908a] data-[state=checked]:border-[#0ea894] data-[state=checked]:bg-[#0ea894]"
        />
        <label htmlFor={`capability-${group.key}`} className="min-w-0 flex-1 cursor-pointer">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold text-[#0b100e]">{group.name}</span>
            <Badge variant="outline" className={cn("px-2 py-0.5 capitalize", RISK_STYLES[group.riskLevel])}>
              {group.riskLevel}
            </Badge>
            {group.isBaseCapability && (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
                <LockKeyhole className="size-3" /> Always included
              </Badge>
            )}
          </span>
          <span className="mt-1 block text-[12px] text-[#66706b]">{group.description}</span>
        </label>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex shrink-0 items-center gap-1 text-[11px] text-[#84908a] hover:text-[#303834]"
          aria-expanded={expanded}
        >
          Details
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>

      {selected && capability && (
        <div className="space-y-4 border-t border-black/[0.06] bg-[#fbfcfb] px-4 py-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[#303834]">Access scope</label>
            <Select
              value={scopeType}
              onValueChange={(scope) =>
                updateSelected((current) =>
                  changeCapabilityScope(current, group.key, scope as CapabilityScopeType),
                )
              }
            >
              <SelectTrigger className="h-10 w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(group.supportedScopes ?? [group.defaultScope]).map((scope) => (
                  <SelectItem key={scope} value={scope}>{SCOPE_LABELS[scope]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-[#66706b]">{SCOPE_DESCRIPTIONS[scopeType]}</p>
          </div>

          {scopeType === "department" && (
            <ResourceChecklist
              title="Restrict to specific departments (optional)"
              description="Leave blank to use each role holder's own department."
              loading={departments.isLoading}
              options={(departments.data?.data ?? []).map((department) => ({
                id: department.departmentId,
                label: department.name || department.departmentName || "Unnamed department",
              }))}
              selectedIds={capability.scopeConfig?.departmentIds ?? []}
              onToggle={(id) =>
                updateSelected((current) =>
                  toggleScopeResource(current, group.key, "departmentIds", id),
                )
              }
            />
          )}

          {supportsLegalEntityRestriction && (
            <ResourceChecklist
              title="Restrict to legal entities (optional)"
              description="Leave blank to allow matching records across all legal entities in this company."
              loading={legalEntities.isLoading}
              options={(legalEntities.data?.data ?? []).map((entity) => ({
                id: entity.legalEntityId,
                label: `${entity.code} — ${entity.legalName}`,
              }))}
              selectedIds={capability.scopeConfig?.legalEntityIds ?? []}
              onToggle={(id) =>
                updateSelected((current) =>
                  toggleScopeResource(current, group.key, "legalEntityIds", id),
                )
              }
            />
          )}
        </div>
      )}

      {expanded && (
        <div className="space-y-3 border-t border-black/[0.06] bg-[#f7f9f8] px-4 py-3">
          {group.requiredCapabilityKeys.length > 0 && (
            <p className="text-[11px] text-[#66706b]">
              Requires: {group.requiredCapabilityKeys
                .map((key) => catalogByKey.get(key)?.name ?? formatPermissionName(key))
                .join(", ")}. Dependencies are included automatically.
            </p>
          )}
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#84908a]">
              Bundled access at {SCOPE_LABELS[scopeType].toLowerCase()} scope
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(group.scopePermissions?.[scopeType] ?? group.permissions.map((item) => item.name)).map((name) => (
                <span key={name} className="rounded-md border border-black/[0.06] bg-white px-2 py-1 text-[11px] text-[#66706b]">
                  {formatPermissionName(name)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceChecklist({
  title,
  description,
  loading,
  options,
  selectedIds,
  onToggle,
}: {
  title: string;
  description: string;
  loading: boolean;
  options: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-black/[0.06] bg-white p-3">
      <div>
        <p className="text-[12px] font-semibold text-[#303834]">{title}</p>
        <p className="text-[11px] text-[#66706b]">{description}</p>
      </div>
      {loading ? (
        <p className="text-[11px] text-[#84908a]">Loading options…</p>
      ) : options.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 text-[12px] text-[#303834]">
              <Checkbox checked={selectedIds.includes(option.id)} onCheckedChange={() => onToggle(option.id)} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-[#84908a]">No options are available.</p>
      )}
    </div>
  );
}

export function RoleCapabilityEditor({
  catalog,
  value,
  onChange,
}: {
  catalog: CapabilityGroup[];
  value: RoleCapabilityInput[];
  onChange: (next: RoleCapabilityInput[]) => void;
}) {
  const catalogByKey = useMemo(() => new Map(catalog.map((group) => [group.key, group])), [catalog]);
  const capabilitiesByModule = useMemo(() => {
    const modules = new Map<string, CapabilityGroup[]>();
    for (const group of catalog) {
      modules.set(group.module, [...(modules.get(group.module) ?? []), group]);
    }
    return Array.from(modules.entries()).map(([module, groups]) => ({
      module,
      groups: groups.sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)),
    }));
  }, [catalog]);

  const selectedByKey = new Map(value.map((capability) => [capability.key, capability]));

  return (
    <div className="space-y-6">
      <Alert className="border-[#0ea894]/20 bg-[#e7f6f2]/30 text-[#164c44]">
        <Info className="size-4" />
        <AlertTitle>Capabilities are scoped within this company</AlertTitle>
        <AlertDescription>
          Choose the business outcome and its data scope. Villeto adds required permissions and dependencies automatically.
        </AlertDescription>
      </Alert>

      {capabilitiesByModule.map(({ module, groups }) => (
        <section key={module} className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#84908a]">
              {formatPermissionName(module)}
            </h3>
            <div className="h-px flex-1 bg-black/[0.06]" />
          </div>
          {groups.map((group) => (
            <CapabilityCard
              key={group.capabilityGroupId}
              group={group}
              capability={selectedByKey.get(group.key)}
              value={value}
              catalogByKey={catalogByKey}
              onChange={onChange}
            />
          ))}
        </section>
      ))}

      {!catalog.length && (
        <Alert variant="destructive">
          <ShieldAlert className="size-4" />
          <AlertTitle>No capabilities available</AlertTitle>
          <AlertDescription>The capability catalog could not be loaded or has not been seeded.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
