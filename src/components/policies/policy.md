"use client";

import { useState, useMemo, useRef, useLayoutEffect } from "react";
import {
  X, Plus, ChevronDown, ChevronUp, Loader2, UserCircle, Check,
  MapPin, Users, Building2, Tag, ShieldCheck, Receipt, Wallet,
} from "lucide-react";
import { useGetAllRolesApi } from "@/actions/role/get-all-roles";
import { useGetDirectoryUsersApi } from "@/actions/users/get-all-users";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

/* ─── Types ───────────────────────────────────────────────── */
export interface CreatedPolicyData {
  name: string;
  category: string;
  appliedTo: string;
  departmentScope: string;
  selectedDepartments: string[];
  locations: string[];
  dailyLimit: string;
  receiptAbove: string;
  approvers: string[];
}

interface DropdownOption {
  label: string;
  subLabel?: string;
  value: string;
}

/*
  STEPS
  1 = Name
  2 = Scope   (Category · Who · Departments · Location)
  3 = Rules   (Spend limits · Receipt)
  4 = Approvers
  5 = Preview
*/

/* ─────────────────────────────────────────────────────────────
   PortalDropdown
   Renders at position:fixed using getBoundingClientRect so it
   always escapes overflow:hidden / overflow:auto parents.
───────────────────────────────────────────────────────────── */
function PortalDropdown({
  triggerRef, open, onClose, children,
}: {
  triggerRef: React.RefObject<HTMLButtonElement>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const POPOVER_MAX_H = 300;
    const GAP = 6;
    const spaceBelow = window.innerHeight - r.bottom - GAP;
    // If not enough space below, anchor to the top of the trigger and go upward
    const top = spaceBelow >= POPOVER_MAX_H
      ? r.bottom + GAP                          // open downward
      : Math.max(8, r.top - POPOVER_MAX_H - GAP); // open upward
    setCoords({ top, left: r.left, width: r.width });
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div
        className="fixed z-[61] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
        style={{ top: coords.top, left: coords.left, width: coords.width }}
      >
        {children}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DropdownList
   overflow-y: auto  →  scrollbar only appears when content
   actually exceeds maxHeight. For 2-item lists (≤ 96px) the
   container shrinks to fit and NO scrollbar is shown.
───────────────────────────────────────────────────────────── */
function DropdownList({
  options, selectedValues, multiSelect, onSelect, footer, isLoading,
}: {
  options: DropdownOption[];
  selectedValues: string[];
  multiSelect: boolean;
  onSelect: (v: string) => void;
  footer?: React.ReactNode;
  isLoading?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [faded, setFaded] = useState(false);

  const checkFade = () => {
    const el = scrollRef.current;
    if (el) setFaded(el.scrollHeight - el.scrollTop > el.clientHeight + 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-5 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkFade}
          style={{
            /* auto → no scrollbar for short lists, scrollbar only when overflowing */
            maxHeight: 288,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#03C3A6 #f0fdf9",
          } as React.CSSProperties}
        >
          <style>{`.dp-i::-webkit-scrollbar{width:5px}.dp-i::-webkit-scrollbar-track{background:#f0fdf9;border-radius:99px}.dp-i::-webkit-scrollbar-thumb{background:#03C3A6;border-radius:99px}`}</style>
          <div className="dp-i p-1.5">
            {options.length > 0 ? options.map((opt) => {
              const sel = selectedValues.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSelect(opt.value)}
                  style={{ minHeight: 48 }}
                  className={`w-full flex items-center justify-between gap-3 px-3 rounded-xl text-left transition-colors ${
                    sel ? "bg-[#03C3A6]/10" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-sm font-medium text-gray-800 text-left leading-snug truncate">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-xs text-gray-400 text-left leading-snug truncate">{opt.subLabel}</span>
                    )}
                  </div>
                  {multiSelect ? (
                    <span className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      sel ? "bg-[#03C3A6] border-[#03C3A6]" : "border-gray-300"
                    }`}>
                      {sel && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </span>
                  ) : (
                    sel && <Check className="w-4 h-4 text-[#03C3A6] shrink-0" strokeWidth={2.5} />
                  )}
                </button>
              );
            }) : (
              <div className="py-5 text-sm text-center text-muted-foreground italic">No options available</div>
            )}
          </div>
        </div>
        {faded && (
          <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none rounded-b-2xl"
            style={{ background: "linear-gradient(to bottom, transparent, white 90%)" }} />
        )}
      </div>
      {footer && <div className="border-t border-gray-100">{footer}</div>}
    </div>
  );
}

/* ─── Single dropdown ─────────────────────────────────────── */
function SimpleDropdown({ placeholder, value, onChange, options, footer, isLoading = false }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  options: DropdownOption[]; footer?: React.ReactNode; isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const sel = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button ref={ref} type="button" onClick={() => setOpen((p) => !p)} disabled={isLoading}
        className="w-full h-12 rounded-xl border border-border bg-white px-4 flex items-center justify-between gap-3 text-sm transition-colors hover:border-[#03C3A6]/50 focus:outline-none focus:border-[#03C3A6] disabled:opacity-50">
        <span className={`text-left truncate ${sel ? "text-gray-900 font-medium" : "text-muted-foreground"}`}>
          {isLoading ? "Loading…" : sel?.label ?? placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <PortalDropdown triggerRef={ref} open={open} onClose={() => setOpen(false)}>
        <DropdownList options={options} selectedValues={value ? [value] : []} multiSelect={false}
          onSelect={(v) => { onChange(v); setOpen(false); }} footer={footer} isLoading={isLoading} />
      </PortalDropdown>
    </div>
  );
}

/* ─── Multi dropdown ──────────────────────────────────────── */
function MultiDropdown({ placeholder, values, onToggle, options, footer, isLoading = false }: {
  placeholder: string; values: string[]; onToggle: (v: string) => void;
  options: DropdownOption[]; footer?: React.ReactNode; isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative">
      <button ref={ref} type="button" onClick={() => setOpen((p) => !p)} disabled={isLoading}
        className="w-full h-12 rounded-xl border border-border bg-white px-4 flex items-center justify-between gap-3 text-sm transition-colors hover:border-[#03C3A6]/50 focus:outline-none focus:border-[#03C3A6] disabled:opacity-50">
        <span className="text-muted-foreground text-left truncate">
          {isLoading ? "Loading…" : placeholder}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {values.length > 0 && (
            <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#03C3A6] text-white text-[11px] font-bold flex items-center justify-center">
              {values.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <PortalDropdown triggerRef={ref} open={open} onClose={() => setOpen(false)}>
        <DropdownList options={options} selectedValues={values} multiSelect={true}
          onSelect={onToggle} footer={footer} isLoading={isLoading} />
      </PortalDropdown>
    </div>
  );
}

/* ─── Small reusable bits ─────────────────────────────────── */
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full border border-border bg-white text-xs font-medium text-gray-700">
      {label}
      <button type="button" onClick={onRemove}
        className="w-3.5 h-3.5 rounded-full bg-muted/60 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-colors">
        <X className="w-2 h-2" strokeWidth={3} />
      </button>
    </span>
  );
}

function RadioRow({ value, label, subLabel, checked, onChange }: {
  value: string; label: string; subLabel?: string; checked: boolean; onChange: (v: string) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(value)} className="flex items-start gap-3 py-1 w-full text-left group">
      <span className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked ? "border-[#03C3A6]" : "border-gray-300 group-hover:border-[#03C3A6]/40"
      }`}>
        <span className={`rounded-full bg-[#03C3A6] transition-all ${checked ? "w-2 h-2" : "w-0 h-0"}`} />
      </span>
      <div className="text-left">
        <p className={`text-sm font-medium leading-snug ${checked ? "text-gray-900" : "text-gray-600"}`}>{label}</p>
        {subLabel && <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>}
      </div>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{children}</p>;
}

function NumberInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0.00"
        className="w-full h-12 rounded-xl border border-border bg-white pl-7 pr-8 text-sm font-medium text-gray-800 placeholder:text-muted-foreground focus:outline-none focus:border-[#03C3A6] transition-colors tabular-nums" />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
        <button type="button" onClick={() => onChange(String((parseFloat(value || "0") + 1).toFixed(2)))}
          className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronUp className="w-3 h-3" /></button>
        <button type="button" onClick={() => onChange(String(Math.max(0, parseFloat(value || "0") - 1).toFixed(2)))}
          className="text-gray-400 hover:text-gray-600 p-0.5"><ChevronDown className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

/* ─── 3-step bar ──────────────────────────────────────────── */
function ThreeStepBar({ current }: { current: 1 | 2 | 3 }) {
  const steps = [{ n: 1, label: "Scope" }, { n: 2, label: "Rules" }, { n: 3, label: "Approvers" }] as const;
  return (
    <div className="flex items-center">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              n < current ? "bg-[#03C3A6] text-white" :
              n === current ? "bg-[#03C3A6] text-white ring-[3px] ring-[#03C3A6]/20" :
              "bg-gray-100 text-gray-400"
            }`}>
              {n < current ? <Check className="w-3 h-3" strokeWidth={3} /> : n}
            </div>
            <span className={`text-xs font-medium ${n === current ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < 2 && <div className={`w-10 h-px mx-2 ${n < current ? "bg-[#03C3A6]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

/* ─── Preview card ────────────────────────────────────────── */
function PreviewCard({
  policyName, expenseTypes, applyTo, selectedRoles, roleOptions,
  deptScope, selectedDepts, locations, dailyLimit, limitWarn,
  receiptAbove, receiptWarn, approvers,
}: {
  policyName: string; expenseTypes: string[]; applyTo: string;
  selectedRoles: string[]; roleOptions: DropdownOption[];
  deptScope: string; selectedDepts: string[]; locations: string[];
  dailyLimit: string; limitWarn: string; receiptAbove: string;
  receiptWarn: string; approvers: string[];
}) {
  const scopeText = applyTo === "all"
    ? "All Employees"
    : selectedRoles.map((r) => roleOptions.find((o) => o.value === r)?.label ?? r).join(", ");
  const deptText = deptScope === "all" ? "All Departments" : selectedDepts.join(", ");
  const locText = locations.join(", ");

  return (
    <div className="space-y-4">
      {/* Policy identity card */}
      <div className="rounded-2xl border border-[#03C3A6]/20 bg-gradient-to-br from-[#03C3A6]/5 to-white p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] font-semibold text-[#03C3A6] uppercase tracking-widest mb-1">Policy</p>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{policyName}</h3>
          </div>
          {/* Category badges */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {expenseTypes.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#03C3A6]/10 text-[#03C3A6] text-[11px] font-semibold">
                <Tag className="w-2.5 h-2.5" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scope row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <Users className="w-3 h-3" /> Who
            </div>
            <p className="text-xs font-medium text-gray-700 leading-snug">{scopeText}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <Building2 className="w-3 h-3" /> Dept
            </div>
            <p className="text-xs font-medium text-gray-700 leading-snug">{deptText}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <MapPin className="w-3 h-3" /> Location
            </div>
            <p className="text-xs font-medium text-gray-700 leading-snug">{locText}</p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-2 gap-3">
        {/* Spend limit card */}
        <div className="rounded-2xl border border-border bg-white p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Spend limit</p>
          </div>
          <p className="text-xl font-bold text-gray-900 tabular-nums">
            {dailyLimit ? `$${dailyLimit}` : <span className="text-gray-300">—</span>}
          </p>
          <p className="text-xs text-gray-400">per day</p>
          {limitWarn && (
            <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-semibold ${
              limitWarn === "Hard block" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
            }`}>
              {limitWarn}
            </span>
          )}
        </div>

        {/* Receipt card */}
        <div className="rounded-2xl border border-border bg-white p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Receipt required</p>
          </div>
          <p className="text-xl font-bold text-gray-900 tabular-nums">
            {receiptAbove ? `> $${receiptAbove}` : <span className="text-gray-300 text-base font-semibold">Always</span>}
          </p>
          <p className="text-xs text-gray-400">threshold</p>
          {receiptWarn && (
            <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-semibold ${
              receiptWarn === "Hard block" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
            }`}>
              {receiptWarn}
            </span>
          )}
        </div>
      </div>

      {/* Approvers */}
      {approvers.filter(Boolean).length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Approvers</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {approvers.filter(Boolean).map((a, i) => (
              <div key={i} className="flex items-center gap-2 h-8 pl-2 pr-3 rounded-full bg-gray-50 border border-gray-100">
                <div className="w-5 h-5 rounded-full bg-[#03C3A6]/15 flex items-center justify-center">
                  <UserCircle className="w-3.5 h-3.5 text-[#03C3A6]" />
                </div>
                <span className="text-xs font-medium text-gray-700">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Static data ─────────────────────────────────────────── */
const EXPENSE_OPTIONS: DropdownOption[] = [
  { value: "Meals",           label: "Meals",                  subLabel: "Food & beverage" },
  { value: "Travel",          label: "Travel",                 subLabel: "Flights, hotels & transport" },
  { value: "Software",        label: "Software Subscriptions", subLabel: "SaaS & cloud licences" },
  { value: "Office Supplies", label: "Office Supplies",        subLabel: "Equipment & stationery" },
  { value: "Training",        label: "Training & Development", subLabel: "Courses & certifications" },
  { value: "Entertainment",   label: "Client Entertainment",   subLabel: "Client-facing meals & events" },
];

const DEPARTMENT_OPTIONS: DropdownOption[] = [
  { value: "Engineering",  label: "Engineering",  subLabel: "Product & technology" },
  { value: "Finance",      label: "Finance",      subLabel: "Accounting & treasury" },
  { value: "Sales",        label: "Sales",        subLabel: "Revenue & accounts" },
  { value: "Marketing",    label: "Marketing",    subLabel: "Brand & growth" },
  { value: "HR",           label: "HR",           subLabel: "People & culture" },
  { value: "Operations",   label: "Operations",   subLabel: "Logistics & facilities" },
  { value: "Legal",        label: "Legal",        subLabel: "Compliance & contracts" },
  { value: "Product",      label: "Product",      subLabel: "Design & strategy" },
];

const WARNING_OPTIONS: DropdownOption[] = [
  { value: "Hard block",   label: "Hard block",   subLabel: "Transaction is declined" },
  { value: "Soft warning", label: "Soft warning", subLabel: "User sees a caution prompt" },
];

/* ═══════════════════════════════════════════════════════════
   MAIN MODAL
═══════════════════════════════════════════════════════════ */
export default function PolicyCreationModal({
  open, onOpenChange, onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: CreatedPolicyData) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [policyName,      setPolicyName]      = useState("");
  const [expenseTypes,    setExpenseTypes]    = useState<string[]>([]);
  const [applyTo,         setApplyTo]         = useState<"all" | "role">("all");
  const [selectedRoles,   setSelectedRoles]   = useState<string[]>([]);
  const [deptScope,       setDeptScope]       = useState<"all" | "specific">("all");
  const [selectedDepts,   setSelectedDepts]   = useState<string[]>([]);
  const [locations,       setLocations]       = useState<string[]>(["Global"]);
  const [addingLoc,       setAddingLoc]       = useState(false);
  const [newLoc,          setNewLoc]          = useState("");
  const [isAddCatOpen,    setIsAddCatOpen]    = useState(false);
  const [dailyLimit,      setDailyLimit]      = useState("");
  const [limitWarn,       setLimitWarn]       = useState("");
  const [receiptAbove,    setReceiptAbove]    = useState("");
  const [receiptWarn,     setReceiptWarn]     = useState("");
  const [approvers,       setApprovers]       = useState([""]);
  const [isLoading,       setIsLoading]       = useState(false);

  const rolesApi     = useGetAllRolesApi({ enabled: open });
  const directoryApi = useGetDirectoryUsersApi({ enabled: open });

  const roleOptions = useMemo<DropdownOption[]>(() =>
    (rolesApi.data?.data ?? []).map((r: any) => {
      const n = (r.name ?? "").replace(/_/g, " ");
      return { label: n.charAt(0).toUpperCase() + n.slice(1).toLowerCase(), value: r.name };
    }), [rolesApi.data?.data]);

  const adminOptions = useMemo<DropdownOption[]>(() =>
    (directoryApi.data?.data ?? [])
      .filter((u: any) => !u.role?.name?.toLowerCase().includes("employee"))
      .map((u: any) => ({
        label: `${u.firstName} ${u.lastName}`,
        value: `${u.firstName} ${u.lastName} (${u.role?.name || "Admin"})`,
        subLabel: u.role?.name || "Administrator",
      })), [directoryApi.data?.data]);

  /*
    Approver is REQUIRED unless there are literally no other admins
    in the system (the creating user is the only one).
  */
  const approverRequired = adminOptions.length > 0;
  const approverFilled   = approvers.filter(Boolean).length > 0;

  const tog = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (v: string) => setter((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const addLocation = () => {
    if (newLoc.trim()) { setLocations((l) => [...l, newLoc.trim()]); setNewLoc(""); setAddingLoc(false); }
  };

  const reset = () => {
    setStep(1); setPolicyName(""); setExpenseTypes([]); setApplyTo("all");
    setSelectedRoles([]); setDeptScope("all"); setSelectedDepts([]);
    setLocations(["Global"]); setAddingLoc(false); setNewLoc("");
    setDailyLimit(""); setLimitWarn(""); setReceiptAbove(""); setReceiptWarn("");
    setApprovers([""]);
  };

  const handleClose   = () => { onOpenChange(false); reset(); };
  const handleBack    = () => setStep((s) => (s > 1 ? (s - 1) as 1|2|3|4|5 : s));
  const handleForward = () => {
    if (step < 5) setStep((s) => (s + 1) as 1|2|3|4|5);
    else handleConfirm();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      onSuccess?.({
        name: policyName,
        category: expenseTypes.join(", ") || "General",
        appliedTo: applyTo === "all" ? "All Employees" : selectedRoles.join(", "),
        departmentScope: deptScope,
        selectedDepartments: selectedDepts,
        locations, dailyLimit, receiptAbove,
        approvers: approvers.filter(Boolean),
      });
      handleClose();
    } finally { setIsLoading(false); }
  };

  const scopeValid =
    expenseTypes.length > 0 &&
    (applyTo === "all" || selectedRoles.length > 0) &&
    (deptScope === "all" || selectedDepts.length > 0);

  const continueDisabled =
    isLoading ||
    (step === 1 && !policyName.trim()) ||
    (step === 2 && !scopeValid) ||
    (step === 4 && approverRequired && !approverFilled);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={handleClose} />

        <div className={`relative bg-white rounded-[1.75rem] shadow-2xl w-full flex flex-col ${
          step === 1 ? "max-w-[460px]" : step === 5 ? "max-w-[560px]" : "max-w-[540px]"
        }`} style={{ maxHeight: "92vh" }}>

          {/* ════ STEP 1 — Name ════════════════════════════════ */}
          {step === 1 && (
            <div className="p-9">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-5">New Policy</p>
              <h2 className="text-[22px] font-semibold text-gray-900 mb-1">
                What would you like to name this policy?
              </h2>
              <p className="text-sm text-gray-400 mb-7">
                Give it a clear name so your team knows what it covers.
              </p>
              <input autoFocus
                placeholder="e.g. Sales Team Travel Policy"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && policyName.trim() && setStep(2)}
                className="w-full h-12 rounded-xl border border-border px-4 text-sm font-medium text-gray-900 placeholder:text-muted-foreground focus:outline-none focus:border-[#03C3A6] transition-colors mb-8"
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleClose}
                  className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={() => policyName.trim() && setStep(2)} disabled={!policyName.trim()}
                  className="h-11 px-8 rounded-xl bg-[#03C3A6] text-white text-sm font-semibold disabled:opacity-40 hover:bg-[#03C3A6]/90 transition-all shadow-sm shadow-[#03C3A6]/20">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ════ STEPS 2–5 ════════════════════════════════════ */}
          {step >= 2 && (
            <>
              {/* Header */}
              <div className="px-8 pt-7 pb-5 shrink-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 pr-3">
                    <p className="text-xs text-gray-400 font-medium truncate mb-0.5">{policyName}</p>
                    <h2 className="text-[20px] font-semibold text-gray-900 leading-tight">
                      {step === 2 && "Scope"}
                      {step === 3 && "Rules"}
                      {step === 4 && "Approvers"}
                      {step === 5 && "Review & confirm"}
                    </h2>
                  </div>
                  <button onClick={handleClose}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {step <= 4 && (
                  <div className="mt-5"><ThreeStepBar current={step === 2 ? 1 : step === 3 ? 2 : 3} /></div>
                )}
              </div>

              <div className="h-px bg-gray-100 shrink-0" />

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 min-h-0">

                {/* ══ STEP 2 — Scope ══════════════════════════ */}
                {step === 2 && (
                  <>
                    <div>
                      <SectionLabel>Expense category</SectionLabel>
                      <MultiDropdown placeholder="Select categories" values={expenseTypes}
                        onToggle={tog(setExpenseTypes)} options={EXPENSE_OPTIONS}
                        footer={
                          <button type="button" onClick={() => setIsAddCatOpen(true)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#03C3A6] hover:bg-gray-50 transition-colors text-left">
                            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add custom category
                          </button>
                        }
                      />
                      {expenseTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {expenseTypes.map((t) => (
                            <Chip key={t} label={EXPENSE_OPTIONS.find((o) => o.value === t)?.label ?? t}
                              onRemove={() => tog(setExpenseTypes)(t)} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <SectionLabel>Who should this apply to?</SectionLabel>
                      <div className="space-y-2">
                        <RadioRow value="all"  label="All Employees" subLabel="Every employee in the company"
                          checked={applyTo === "all"}  onChange={(v) => setApplyTo(v as "all"|"role")} />
                        <RadioRow value="role" label="Specific Role" subLabel="Only employees with a particular job title"
                          checked={applyTo === "role"} onChange={(v) => setApplyTo(v as "all"|"role")} />
                      </div>
                      {applyTo === "role" && (
                        <div className="mt-3 ml-7 space-y-2">
                          <MultiDropdown placeholder="Select role(s)" values={selectedRoles}
                            onToggle={tog(setSelectedRoles)} options={roleOptions} isLoading={rolesApi.isLoading} />
                          {selectedRoles.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {selectedRoles.map((r) => (
                                <Chip key={r} label={roleOptions.find((o) => o.value === r)?.label ?? r}
                                  onRemove={() => tog(setSelectedRoles)(r)} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <SectionLabel>Department scope</SectionLabel>
                      <div className="space-y-2">
                        <RadioRow value="all" label="All Departments" subLabel="Policy reaches every department"
                          checked={deptScope === "all"} onChange={(v) => { setDeptScope(v as "all"|"specific"); if (v==="all") setSelectedDepts([]); }} />
                        <RadioRow value="specific" label="Specific Department(s)" subLabel="Restrict to one or more departments"
                          checked={deptScope === "specific"} onChange={(v) => { setDeptScope(v as "all"|"specific"); if (v==="all") setSelectedDepts([]); }} />
                      </div>
                      {deptScope === "specific" && (
                        <div className="mt-3 ml-7 space-y-2">
                          <MultiDropdown placeholder="Select department(s)" values={selectedDepts}
                            onToggle={tog(setSelectedDepts)} options={DEPARTMENT_OPTIONS} />
                          {selectedDepts.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {selectedDepts.map((d) => (
                                <Chip key={d} label={d} onRemove={() => tog(setSelectedDepts)(d)} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <SectionLabel>Location <span className="normal-case font-normal text-gray-400">(optional)</span></SectionLabel>
                      {locations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {locations.map((loc, i) => (
                            <Chip key={i} label={loc} onRemove={() => setLocations(locations.filter((_, j) => j !== i))} />
                          ))}
                        </div>
                      )}
                      {addingLoc ? (
                        <div className="flex gap-2">
                          <input autoFocus value={newLoc} onChange={(e) => setNewLoc(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addLocation()} placeholder="Office name…"
                            className="flex-1 h-10 px-3 rounded-xl border border-border text-sm focus:outline-none focus:border-[#03C3A6]" />
                          <button onClick={addLocation} className="h-10 px-4 rounded-xl bg-[#03C3A6] text-white text-sm font-medium hover:bg-[#03C3A6]/90 transition-colors">Add</button>
                          <button onClick={() => { setAddingLoc(false); setNewLoc(""); }} className="h-10 px-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setAddingLoc(true)}
                          className="flex items-center gap-1.5 text-sm font-medium text-[#03C3A6] hover:underline">
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add location
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* ══ STEP 3 — Rules ══════════════════════════ */}
                {step === 3 && (
                  <>
                    <div className="rounded-2xl border border-border p-5 space-y-4">
                      <p className="text-sm font-semibold text-gray-800">Spend limits</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <SectionLabel>Daily limit</SectionLabel>
                          <NumberInput value={dailyLimit} onChange={setDailyLimit} />
                        </div>
                        <div>
                          <SectionLabel>Enforcement</SectionLabel>
                          <SimpleDropdown placeholder="Select" value={limitWarn}
                            onChange={setLimitWarn} options={WARNING_OPTIONS} />
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border p-5 space-y-4">
                      <p className="text-sm font-semibold text-gray-800">Receipt requirements</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <SectionLabel>Required above</SectionLabel>
                          <NumberInput value={receiptAbove} onChange={setReceiptAbove} />
                        </div>
                        <div>
                          <SectionLabel>Enforcement</SectionLabel>
                          <SimpleDropdown placeholder="Select" value={receiptWarn}
                            onChange={setReceiptWarn} options={WARNING_OPTIONS} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ══ STEP 4 — Approvers ══════════════════════ */}
                {step === 4 && (
                  <div className="space-y-4">
                    {approverRequired ? (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Assign an administrator to review this policy before it goes live.
                      </p>
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                        <p className="text-sm text-amber-700 font-medium">No other admins found</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          You appear to be the only admin. This policy will activate without a secondary review.
                        </p>
                      </div>
                    )}

                    {approverRequired && approvers.map((val, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <SimpleDropdown placeholder="Select admin" value={val}
                            onChange={(v) => { const n = [...approvers]; n[i] = v; setApprovers(n); }}
                            options={adminOptions} isLoading={directoryApi.isLoading} />
                        </div>
                        {approvers.length > 1 && (
                          <button onClick={() => setApprovers(approvers.filter((_, j) => j !== i))}
                            className="w-12 h-12 flex items-center justify-center rounded-xl border border-red-100 bg-red-50/50 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {approverRequired && (
                      <button type="button" onClick={() => setApprovers([...approvers, ""])}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#03C3A6] hover:underline">
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add approver
                      </button>
                    )}
                  </div>
                )}

                {/* ══ STEP 5 — Preview ════════════════════════ */}
                {step === 5 && (
                  <PreviewCard
                    policyName={policyName}
                    expenseTypes={expenseTypes}
                    applyTo={applyTo}
                    selectedRoles={selectedRoles}
                    roleOptions={roleOptions}
                    deptScope={deptScope}
                    selectedDepts={selectedDepts}
                    locations={locations}
                    dailyLimit={dailyLimit}
                    limitWarn={limitWarn}
                    receiptAbove={receiptAbove}
                    receiptWarn={receiptWarn}
                    approvers={approvers}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="h-px bg-gray-100 shrink-0" />
              <div className="px-8 py-5 shrink-0 flex items-center justify-between gap-3">
                <button type="button" onClick={handleBack}
                  className="h-11 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="button" onClick={handleForward} disabled={continueDisabled}
                  className="h-11 px-8 rounded-xl bg-[#03C3A6] text-white text-sm font-semibold hover:bg-[#03C3A6]/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:scale-100 transition-all shadow-sm shadow-[#03C3A6]/20 flex items-center gap-2">
                  {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : step === 5 ? "Activate policy" : "Continue"
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <AddCategoryModal open={isAddCatOpen} onOpenChange={setIsAddCatOpen}
        onSkip={() => setIsAddCatOpen(false)} onSuccess={() => setIsAddCatOpen(false)} />
    </>
  );
}