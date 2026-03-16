"use client";

import { useState, useMemo } from "react";
import { X, Plus, ChevronDown, ChevronUp, Loader2, UserCircle } from "lucide-react";
import { useGetAllRolesApi } from "@/actions/role/get-all-roles";
import { useGetDirectoryUsersApi } from "@/actions/users/get-all-users";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

/* ─── NEW: exported so PoliciesPage can type the callback data ─── */
export interface CreatedPolicyData {
  name: string;
  category: string;
  appliedTo: string;
  dailyLimit: string;
  receiptAbove: string;
  approvers: string[];
}

/* ─── Shared Dropdown ─────────────────────────────────────── */

interface DropdownOption {
  label: string;
  subLabel?: string;
  value: string;
}

function SelectDropdown({ 
  placeholder, 
  value, 
  onChange, 
  options, 
  renderExtra,
  isLoading = false 
}: { 
  placeholder: string, 
  value: string, 
  onChange: (val: string) => void, 
  options: DropdownOption[], 
  renderExtra?: (close: () => void) => React.ReactNode,
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-[54px] rounded-xl border border-border bg-white px-4 flex items-center justify-between text-sm cursor-pointer focus:outline-none focus:border-primary/60 hover:border-primary/40 transition-all disabled:opacity-50"
        disabled={isLoading}
      >
        <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
          {isLoading ? "Loading..." : (selectedOption?.label || placeholder)}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-border rounded-[1.25rem] shadow-xl z-50 p-2 max-h-[280px] overflow-y-auto custom-scrollbar">
            {options.length > 0 ? options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex flex-col gap-0.5 mb-1 last:mb-0 cursor-pointer ${
                  value === opt.value
                    ? "bg-primary/10 text-foreground"
                    : "text-foreground hover:bg-primary/5"
                }`}
              >
                <span className="text-sm font-medium tracking-tight">{opt.label}</span>
                {opt.subLabel && (
                  <span className="text-xs text-muted-foreground">{opt.subLabel}</span>
                )}
              </button>
            )) : (
              <div className="px-3.5 py-4 text-sm text-muted-foreground italic text-center">No options found</div>
            )}
            {renderExtra?.(() => setOpen(false))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Multi-Select Dropdown ───────────────────────────────── */

function MultiSelectDropdown({
  placeholder,
  values,
  onToggle,
  options,
  renderExtra,
  isLoading = false,
}: {
  placeholder: string;
  values: string[];
  onToggle: (val: string) => void;
  options: DropdownOption[];
  renderExtra?: (close: () => void) => React.ReactNode;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-[54px] rounded-xl border border-border bg-white px-4 flex items-center justify-between text-sm cursor-pointer focus:outline-none focus:border-primary/60 hover:border-primary/40 transition-all disabled:opacity-50"
        disabled={isLoading}
      >
        <span className="text-muted-foreground">
          {isLoading ? "Loading..." : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-border rounded-[1.25rem] shadow-xl z-50 p-2 max-h-[280px] overflow-y-auto custom-scrollbar">
            {options.filter((opt) => !values.includes(opt.value)).length > 0
              ? options
                  .filter((opt) => !values.includes(opt.value))
                  .map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onToggle(opt.value); setOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between gap-2 mb-1 last:mb-0 cursor-pointer text-foreground hover:bg-primary/5"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium tracking-tight">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-xs text-muted-foreground">{opt.subLabel}</span>
                    )}
                  </div>
                </button>
              ))
              : (
              <div className="px-3.5 py-4 text-sm text-muted-foreground italic text-center">No options found</div>
            )}
            {renderExtra?.(() => setOpen(false))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Warning Select ──────────────────────────────────────── */

function WarningSelect({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const opts = ["Hard block", "Soft warning"];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-[52px] rounded-xl border border-border bg-white px-4 flex items-center justify-between text-sm cursor-pointer focus:outline-none focus:border-primary transition-colors"
      >
        <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
          {value || "Select"}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-border rounded-xl shadow-lg z-50 p-1.5">
            {opts.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full text-left px-3.5 py-3 rounded-lg text-sm cursor-pointer transition-colors block ${
                  value === o
                    ? "bg-primary/5 text-foreground font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Number Input ────────────────────────────────────────── */

function NumberInput({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm pointer-events-none select-none">
        $
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full h-[52px] rounded-xl border border-border bg-white pl-7 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-medium tabular-nums"
      />
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => onChange(String((parseFloat(value || "0") + 1).toFixed(2)))}
          className="text-muted-foreground hover:text-foreground transition-colors leading-none p-0.5"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onChange(String(Math.max(0, parseFloat(value || "0") - 1).toFixed(2)))}
          className="text-muted-foreground hover:text-foreground transition-colors leading-none p-0.5"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Main Modal ──────────────────────────────────────────── */

export default function PolicyCreationModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: CreatedPolicyData) => void;
}) {
  const [step, setStep] = useState(1);
  const [policyName, setPolicyName] = useState("");

  // Step 2 State
  // ── CHANGED: expenseType (string) → expenseTypes (string[]) ──
  const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
  const [applyTo, setApplyTo] = useState("all");
  const [selectedRole, setSelectedRole] = useState("");
  const [locations, setLocations] = useState(["Global"]);
  const [addingLocation, setAddingLocation] = useState(false);
  const [newLocName, setNewLocName] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Step 3 State
  const [dailyLimit, setDailyLimit] = useState("");
  const [limitWarning, setLimitWarning] = useState("");
  const [receiptAbove, setReceiptAbove] = useState("");
  const [receiptWarning, setReceiptWarning] = useState("");

  // Step 4 State
  const [approvers, setApprovers] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);

  // API Hooks
  const rolesApi = useGetAllRolesApi({ enabled: open });
  const directoryApi = useGetDirectoryUsersApi({ enabled: open });

  const dummyExpenseOptions: DropdownOption[] = [
    { value: "Meals", label: "Meals", subLabel: "Food & beverage expenses" },
    { value: "Transportation", label: "Transportation", subLabel: "Travel & commute costs" },
    { value: "Vacation", label: "Vacation", subLabel: "Holiday & leave expenses" },
  ];

  const roleOptions = useMemo<DropdownOption[]>(() => {
    const roles = rolesApi.data?.data ?? [];
    return roles
      .map((r: any) => {
        const formattedName = r.name
          ? r.name.replace(/_/g, " ").charAt(0).toUpperCase() + r.name.replace(/_/g, " ").slice(1).toLowerCase()
          : "";
        return {
          label: formattedName,
          value: r.name,
        };
      });
  }, [rolesApi.data?.data]);

  const adminOptions = useMemo<DropdownOption[]>(() => {
    const users = directoryApi.data?.data ?? [];
    return users
      .filter((u: any) => !u.role?.name?.toLowerCase().includes("employee"))
      .map((u: any) => ({
        label: `${u.firstName} ${u.lastName}`,
        value: `${u.firstName} ${u.lastName} (${u.role?.name || "Admin"})`,
        subLabel: u.role?.name || "Administrator"
      }));
  }, [directoryApi.data?.data]);

  // ── CHANGED: toggle helper for multi-select ──
  const toggleExpenseType = (val: string) => {
    setExpenseTypes((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const reset = () => {
    setStep(1); setPolicyName("");
    // ── CHANGED: reset to empty array ──
    setExpenseTypes([]);
    setApplyTo("all"); setSelectedRole(""); setDailyLimit("");
    setLimitWarning(""); setReceiptAbove(""); setReceiptWarning("");
    setApprovers([""]);
    setLocations(["Global"]);
    setAddingLocation(false);
    setNewLocName("");
  };

  const handleClose = () => { onOpenChange?.(false); reset(); };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      onSuccess?.({
        name: policyName,
        // ── CHANGED: join array for the callback ──
        category: expenseTypes.length > 0 ? expenseTypes.join(", ") : "General",
        appliedTo: applyTo === "all" ? "Employee" : (selectedRole || "Employee"),
        dailyLimit,
        receiptAbove,
        approvers: approvers.filter(Boolean),
      });
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = () => {
    if (newLocName.trim()) {
      setLocations([...locations, newLocName.trim()]);
      setNewLocName("");
      setAddingLocation(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div
          className={`relative bg-white rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-300 w-full ${
            step === 1 ? "max-w-[500px]" : "max-w-[620px]"
          }`}
        >
          <div className="flex flex-col max-h-[90vh]">
            {/* ══════════════ STEP 1 ══════════════ */}
            {step === 1 && (
              <div className="p-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-5">Policy Name</h2>
                <div className="h-px bg-border w-full mb-7" />
                <input
                  autoFocus
                  placeholder="e.g Travel for employees"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && policyName.trim() && setStep(2)}
                  className="w-full h-14 rounded-xl border border-border px-4 text-sm text-gray-800 font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-8"
                />
                <div className="flex items-center justify-end gap-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => policyName.trim() && setStep(2)}
                    disabled={!policyName.trim()}
                    className="h-12 px-10 rounded-xl bg-[#03C3A6] hover:bg-[#03C3A6]/95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium text-sm min-w-[140px] transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════ STEPS 2–5 ══════════════ */}
            {step >= 2 && (
              <>
                {/* Fixed Header */}
                <div className="p-10 pb-0 shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Policy Creation</h2>
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        {policyName || "Meal for employees"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/80 flex items-center justify-center transition-all shrink-0 ml-4 border border-border/50"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="h-px bg-border w-full my-6 opacity-60" />
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-6">
                  {/* ── STEP 2 content ── */}
                  {step === 2 && (
                    <div className="space-y-7">

                      {/* ── CHANGED: multi-select expense dropdown + chips ── */}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                          Which type of expense should this policy apply to?
                        </label>
                        <MultiSelectDropdown
                          placeholder="Select expense"
                          values={expenseTypes}
                          onToggle={toggleExpenseType}
                          options={dummyExpenseOptions}
                          renderExtra={(close) => (
                            <>
                              <div className="h-px bg-border my-2 mx-2" />
                              <button
                                type="button"
                                onClick={() => { close(); setIsAddCategoryOpen(true); }}
                                className="w-[calc(100%-16px)] mx-2 text-left px-3 py-3 rounded-lg text-sm font-medium text-[#03C3A6] flex items-center gap-2 hover:bg-[#03C3A6]/5 transition-all cursor-pointer"
                              >
                                <Plus className="w-4 h-4" strokeWidth={3} /> Add Category
                              </button>
                            </>
                          )}
                        />
                        {/* Selected chips */}
                        {expenseTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {expenseTypes.map((type) => (
                              <div
                                key={type}
                                className="h-8 pl-3.5 pr-2.5 rounded-full border border-border bg-white flex items-center gap-2 text-sm font-medium text-gray-700"
                              >
                                {type}
                                <button
                                  type="button"
                                  onClick={() => toggleExpenseType(type)}
                                  className="w-4 h-4 rounded-full flex items-center justify-center bg-muted/50 hover:bg-red-50 hover:text-red-500 transition-all border border-border/50"
                                >
                                  <X className="w-2.5 h-2.5" strokeWidth={3} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ── CHANGED: radio button style apply-to ── */}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                          Who should this policy apply to?
                        </label>
                        <div className="space-y-2">
                          {[
                            { val: "all", label: "All Employees" },
                            { val: "role", label: "Specific role" },
                          ].map(({ val, label }) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setApplyTo(val)}
                              className="flex items-center gap-3 cursor-pointer py-1.5 group w-fit"
                            >
                              {/* Outer ring */}
                              <span
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  applyTo === val
                                    ? "border-[#03C3A6]"
                                    : "border-gray-300 group-hover:border-[#03C3A6]/50"
                                }`}
                              >
                                {/* Inner filled dot */}
                                <span
                                  className={`rounded-full bg-[#03C3A6] transition-all duration-150 ${
                                    applyTo === val ? "w-2.5 h-2.5" : "w-0 h-0"
                                  }`}
                                />
                              </span>
                              <span className={`text-sm font-medium transition-colors ${applyTo === val ? "text-gray-900" : "text-gray-600"}`}>
                                {label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {applyTo === "role" && (
                        <div className="space-y-3 mt-4">
                          <label className="text-xs font-medium text-gray-500 block uppercase tracking-wider">Role</label>
                          <SelectDropdown
                            placeholder="Select role"
                            value={selectedRole}
                            onChange={setSelectedRole}
                            options={roleOptions}
                            isLoading={rolesApi.isLoading}
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                          Location Filter (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2.5 mb-2">
                          {locations.map((loc, i) => (
                            <div
                              key={i}
                              className="h-10 px-4 rounded-full border border-border bg-white flex items-center text-sm font-medium text-gray-700 group transition-all"
                            >
                              {loc}
                              <button 
                                onClick={() => setLocations(locations.filter((_, idx) => idx !== i))}
                                className="ml-2.5 w-4 h-4 rounded-full flex items-center justify-center bg-muted/50 hover:bg-red-50 hover:text-red-500 transition-all border border-border/50"
                              >
                                <X className="w-2.5 h-2.5" strokeWidth={3} />
                              </button>
                            </div>
                          ))}
                        </div>
                        {addingLocation ? (
                          <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-xl border border-border/50">
                            <input 
                              autoFocus
                              placeholder="Type location..."
                              value={newLocName}
                              onChange={(e) => setNewLocName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addLocation()}
                              className="h-10 px-3 rounded-lg border border-border text-sm font-medium focus:outline-none focus:border-primary flex-1"
                            />
                            <button 
                              onClick={addLocation}
                              className="h-10 px-5 bg-[#03C3A6] text-white rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
                            >
                              Add
                            </button>
                            <button 
                              onClick={() => { setAddingLocation(false); setNewLocName(""); }}
                              className="h-10 px-4 bg-white border border-border text-muted-foreground rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAddingLocation(true)}
                            className="text-[#03C3A6] text-sm font-medium flex items-center gap-1.5 hover:underline transition-all cursor-pointer mt-1"
                          >
                            <Plus className="w-4 h-4" strokeWidth={3} /> Add Locations
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3 content ── */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="rounded-[1.5rem] border border-border/60 bg-white shadow-sm p-6 space-y-5">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">Spend Limits</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground font-bold uppercase tracking-wider block ml-1">Daily limit</label>
                            <NumberInput value={dailyLimit} onChange={setDailyLimit} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground font-bold uppercase tracking-wider block ml-1">Warning</label>
                            <WarningSelect value={limitWarning} onChange={setLimitWarning} />
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[1.5rem] border border-border/60 bg-white shadow-sm p-6 space-y-5">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">Receipt Requirements</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground font-bold uppercase tracking-wider block ml-1">Required above</label>
                            <NumberInput value={receiptAbove} onChange={setReceiptAbove} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground font-bold uppercase tracking-wider block ml-1">Warning</label>
                            <WarningSelect value={receiptWarning} onChange={setReceiptWarning} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4 content ── */}
                  {step === 4 && (
                    <div className="space-y-6 min-h-[300px]">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">Approver(s)</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                          For transparency and record-keeping, policies can be reviewed by another administrator before becoming active.
                        </p>
                      </div>
                      <div className="space-y-4">
                        {approvers.map((val, i) => (
                          <div key={i} className="flex gap-3 items-center group animate-in slide-in-from-left-2 duration-200">
                            <div className="flex-1">
                              <SelectDropdown
                                placeholder="Select Admin"
                                value={val}
                                onChange={(v) => {
                                  const next = [...approvers];
                                  next[i] = v;
                                  setApprovers(next);
                                }}
                                options={adminOptions}
                                isLoading={directoryApi.isLoading}
                              />
                            </div>
                            {approvers.length > 1 && (
                              <button 
                                onClick={() => setApprovers(approvers.filter((_, idx) => idx !== i))}
                                className="w-12 h-[54px] flex items-center justify-center rounded-xl bg-red-50/50 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border border-red-100"
                              >
                                <X className="w-5 h-5" strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setApprovers([...approvers, ""])}
                          className="text-[#03C3A6] text-sm font-medium flex items-center gap-2 hover:underline transition-all cursor-pointer mt-2 bg-[#03C3A6]/5 px-4 py-2 rounded-lg w-fit"
                        >
                          <Plus className="w-4 h-4" strokeWidth={3} /> Add Another Approver
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 5 content ── */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800">Policy Summary</h3>
                      <div className="rounded-[2rem] border-[#03C3A6]/20 bg-[#03C3A6]/5 shadow-sm p-8 space-y-7">
                        <div className="grid grid-cols-2 gap-y-8">
                          <div>
                            <p className="text-xs font-bold text-[#03C3A6] uppercase tracking-widest mb-2">Policy Name</p>
                            <p className="text-base font-semibold text-gray-800">{policyName || "Untitled Policy"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#03C3A6] uppercase tracking-widest mb-2">Expense Category</p>
                            {/* ── CHANGED: show all selected types ── */}
                            <p className="text-base font-semibold text-gray-800 capitalize">
                              {expenseTypes.length > 0 ? expenseTypes.join(", ") : "General"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#03C3A6] uppercase tracking-widest mb-2">Location</p>
                            <p className="text-base font-semibold text-gray-800">{locations.length > 0 ? locations.join(", ") : "Universal"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#03C3A6] uppercase tracking-widest mb-2">Rules</p>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                Daily Limit: {dailyLimit ? `$${dailyLimit}` : "None"} 
                                {limitWarning && <span className="text-[#03C3A6]/70 ml-1">({limitWarning})</span>}
                              </p>
                              <p className="text-sm font-medium text-foreground">
                                Receipt: {receiptAbove ? `Above $${receiptAbove}` : "Always"}
                                {receiptWarning && <span className="text-[#03C3A6]/70 ml-1">({receiptWarning})</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="h-px bg-primary/20 w-full" />
                        <div>
                          <p className="text-xs font-bold text-[#03C3A6] uppercase tracking-widest mb-2">Approver(s)</p>
                          <div className="flex flex-wrap gap-2">
                            {approvers.filter(Boolean).length > 0 ? (
                              approvers.filter(Boolean).map((app, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-primary/10 text-sm font-medium text-foreground">
                                  <UserCircle className="w-4 h-4 text-[#03C3A6] opacity-60" />
                                  {app}
                                </div>
                              ))
                            ) : (
                              <p className="text-base font-semibold text-muted-foreground italic">No approvers selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fixed Footer */}
                <div className="p-10 pt-5 border-t border-border/40 shrink-0">
                  <div className="flex items-center justify-center sm:justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 2) setStep(1);
                        else if (step === 3) setStep(2);
                        else if (step === 4) setStep(3);
                        else if (step === 5) setStep(4);
                      }}
                      className="h-13 px-10 rounded-[18px] border border-gray-900 text-gray-900 font-medium text-sm min-w-[150px] hover:bg-gray-50 transition-all flex items-center justify-center"
                    >
                      {step === 2 ? "Back" : "Save as Draft"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 2) setStep(3);
                        else if (step === 3) setStep(4);
                        else if (step === 4) setStep(5);
                        else if (step === 5) handleConfirm();
                      }}
                      // ── CHANGED: disabled check uses expenseTypes.length ──
                      disabled={isLoading || (step === 2 && (expenseTypes.length === 0 || (applyTo === "role" && !selectedRole))) || (step === 4 && approvers.filter(Boolean).length === 0)}
                      className="h-13 px-12 rounded-[18px] bg-[#03C3A6] hover:bg-[#03C3A6]/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-primary-foreground font-medium text-sm min-w-[160px] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#03C3A6]/20"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : step === 5 ? (
                        "Confirm"
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AddCategoryModal 
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSkip={() => setIsAddCategoryOpen(false)}
        onSuccess={() => setIsAddCategoryOpen(false)}
      />
    </>
  );
}