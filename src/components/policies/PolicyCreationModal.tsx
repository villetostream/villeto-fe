"use client";

import { useState, useMemo, useRef, useLayoutEffect } from "react";
import {
  X, Plus, ChevronDown, ChevronUp, Loader2, UserCircle, Check, Trash2,
  MapPin, Users, Building2, Tag, ShieldCheck,
} from "lucide-react";
import { useGetAllRolesApi } from "@/actions/role/get-all-roles";
import { useGetDirectoryUsersApi } from "@/actions/users/get-all-users";
import { useGetAllDepartmentsApi } from "@/actions/departments/get-all-departments";
import AddCategoryModal from "@/components/auth/AddCategoryModal";

/* ─── Types ───────────────────────────────────────────────── */
export interface CreatedPolicyData {
  name: string;
  categories: string[];
  /**
   * "all"      → every employee
   * "specific" → filtered by selectedDepts and/or selectedRoles
   */
  scope: "all" | "specific";
  selectedRoles: string[];
  selectedDepts: string[];
  locations: string[];
  rules: PolicyRule[];
  approvers: string[];
}

export interface PolicyRule {
  id: string;
  type: RuleType;
  amount: string;
  enforcement: string;
}

type RuleType = "spend_limit" | "receipt_requirement";

interface DropdownOption {
  label: string;
  subLabel?: string;
  value: string;
}

/*
  STEPS
  1 = Name
  2 = Scope
  3 = Rules
  4 = Approvers
  5 = Preview
*/

const RULE_TYPE_LABELS: Record<RuleType, { label: string; amountLabel: string }> = {
  spend_limit:         { label: "Spend Limit",         amountLabel: "Daily limit" },
  receipt_requirement: { label: "Receipt Requirement",  amountLabel: "Required above" },
};

/* ─────────────────────────────────────────────────────────────
   PortalDropdown — fixed positioning, escapes overflow parents
───────────────────────────────────────────────────────────── */
function PortalDropdown({
  triggerRef, open, onClose, children,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState<{
    top?: number; bottom?: number; left: number; width: number; maxHeight: number;
  }>({ left: 0, width: 0, maxHeight: 360 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const GAP = 6;
    const MARGIN = 12;
    const spaceBelow = window.innerHeight - r.bottom - GAP - MARGIN;
    const spaceAbove = r.top - GAP - MARGIN;
    if (spaceBelow >= spaceAbove) {
      setPos({ top: r.bottom + GAP, left: r.left, width: r.width, maxHeight: Math.max(120, spaceBelow) });
    } else {
      setPos({ bottom: window.innerHeight - r.top + GAP, left: r.left, width: r.width, maxHeight: Math.max(120, spaceAbove) });
    }
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div
        className="fixed z-[61] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
        style={{ top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width, maxHeight: pos.maxHeight, overflowY: "auto" }}
      >
        {children}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   DropdownList — searchable optional filter input
───────────────────────────────────────────────────────────── */
function DropdownList({
  options, selectedValues, multiSelect, onSelect, footer, isLoading, searchable = false,
}: {
  options: DropdownOption[];
  selectedValues: string[];
  multiSelect: boolean;
  onSelect: (v: string) => void;
  footer?: React.ReactNode;
  isLoading?: boolean;
  searchable?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query,  setQuery]  = useState("");
  const [faded,  setFaded]  = useState(false);

  useLayoutEffect(() => {
    setQuery("");
    if (searchable) setTimeout(() => searchRef.current?.focus(), 0);
  }, []);

  const checkFade = () => {
    const el = scrollRef.current;
    if (el) setFaded(el.scrollHeight - el.scrollTop > el.clientHeight + 2);
  };

  const filtered = query.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          (o.subLabel?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : options;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-5 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div>
      {searchable && (
        <div className="px-2 pt-2 pb-1">
          <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#03C3A6] focus-within:bg-white transition-colors">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <circle cx="6.5" cy="6.5" r="4.5"/><path strokeLinecap="round" d="M10.5 10.5l3 3"/>
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setTimeout(checkFade, 0); }}
              placeholder="Search…"
              className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-800"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkFade}
          style={{
            maxHeight: 264,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#03C3A6 #f0fdf9",
          } as React.CSSProperties}
        >
          <style>{`.dp-i::-webkit-scrollbar{width:5px}.dp-i::-webkit-scrollbar-track{background:#f0fdf9;border-radius:99px}.dp-i::-webkit-scrollbar-thumb{background:#03C3A6;border-radius:99px}`}</style>
          <div className="dp-i p-1.5">
            {filtered.length > 0 ? filtered.map((opt) => {
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
              <div className="py-5 text-sm text-center text-muted-foreground italic">
                {query ? `No results for "${query}"` : "No options available"}
              </div>
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

/* ─── Single select dropdown ──────────────────────────────── */
function SimpleDropdown({ placeholder, value, onChange, options, footer, isLoading = false, searchable = false }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  options: DropdownOption[]; footer?: React.ReactNode; isLoading?: boolean; searchable?: boolean;
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
          onSelect={(v) => { onChange(v); setOpen(false); }} footer={footer} isLoading={isLoading} searchable={searchable} />
      </PortalDropdown>
    </div>
  );
}

/* ─── Multi select dropdown ───────────────────────────────── */
function MultiDropdown({ placeholder, values, onToggle, options, footer, isLoading = false, searchable = false }: {
  placeholder: string; values: string[]; onToggle: (v: string) => void;
  options: DropdownOption[]; footer?: React.ReactNode; isLoading?: boolean; searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const triggerLabel = (() => {
    if (isLoading) return "Loading…";
    if (values.length === 0) return null;
    if (values.length === 1) return options.find((o) => o.value === values[0])?.label ?? values[0];
    return `${values.length} selected`;
  })();

  return (
    <div className="relative">
      <button ref={ref} type="button" onClick={() => setOpen((p) => !p)} disabled={isLoading}
        className="w-full h-12 rounded-xl border border-border bg-white px-4 flex items-center justify-between gap-3 text-sm transition-colors hover:border-[#03C3A6]/50 focus:outline-none focus:border-[#03C3A6] disabled:opacity-50">
        <span className={`text-left truncate ${triggerLabel ? "text-gray-900 font-medium" : "text-muted-foreground"}`}>
          {triggerLabel ?? placeholder}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {values.length > 1 && (
            <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#03C3A6] text-white text-[11px] font-bold flex items-center justify-center">
              {values.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <PortalDropdown triggerRef={ref} open={open} onClose={() => setOpen(false)}>
        <DropdownList options={options} selectedValues={values} multiSelect={true}
          onSelect={onToggle} footer={footer} isLoading={isLoading} searchable={searchable} />
      </PortalDropdown>
    </div>
  );
}

/* ─── Small reusables ─────────────────────────────────────── */

/** Chip with teal outlined style matching the designer's screenshot */
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full border border-[#03C3A6]/40 bg-[#03C3A6]/5 text-xs font-medium text-[#03C3A6]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="w-4 h-4 rounded-full border border-[#03C3A6]/30 hover:bg-[#03C3A6]/15 flex items-center justify-center transition-colors"
      >
        <X className="w-2 h-2" strokeWidth={3} />
      </button>
    </span>
  );
}

function RadioRow({ value, label, subLabel, checked, onChange }: {
  value: string; label: string; subLabel?: string; checked: boolean; onChange: (v: string) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(value)}
      className="flex items-start gap-3 py-1 w-full text-left group">
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
  return <p className="text-sm font-medium text-gray-700 mb-1.5">{children}</p>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-gray-700 mb-1.5">{children}</p>;
}

function NumberInput({ value, onChange, placeholder = "0.00" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
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

/* ─────────────────────────────────────────────────────────────
   RuleCard
───────────────────────────────────────────────────────────── */
function RuleCard({
  rule, onChange, onDelete, canDelete,
}: {
  rule: PolicyRule;
  onChange: (updated: PolicyRule) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const meta = RULE_TYPE_LABELS[rule.type];
  return (
    <div className="rounded-2xl border border-border p-5 space-y-4 relative">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">{meta.label}</p>
        {canDelete && (
          <button type="button" onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>{meta.amountLabel}</FieldLabel>
          <NumberInput value={rule.amount} onChange={(v) => onChange({ ...rule, amount: v })} />
        </div>
        <div>
          <FieldLabel>Enforcement</FieldLabel>
          <SimpleDropdown placeholder="Select" value={rule.enforcement}
            onChange={(v) => onChange({ ...rule, enforcement: v })}
            options={WARNING_OPTIONS} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Preview
───────────────────────────────────────────────────────────── */
function Preview({
  policyName, categories, scope, selectedRoles, roleOptions,
  selectedDepts, departmentOptions,
  locations, rules, approvers,
}: {
  policyName: string; categories: string[]; scope: "all" | "specific";
  selectedRoles: string[]; roleOptions: DropdownOption[];
  selectedDepts: string[]; departmentOptions: DropdownOption[];
  locations: string[]; rules: PolicyRule[]; approvers: string[];
}) {
  const scopeSummary = (() => {
    if (scope === "all") return "All employees, all departments";
    const deptNames = selectedDepts.map((d) => departmentOptions.find((o) => o.value === d)?.label ?? d);
    const roleNames = selectedRoles.map((r) => roleOptions.find((o) => o.value === r)?.label ?? r);
    const listFmt = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
    const deptPart = deptNames.length > 0 ? listFmt.format(deptNames) : "All departments";
    const rolePart = roleNames.length > 0 ? listFmt.format(roleNames) : "All employees";
    return `${rolePart} in ${deptPart}`;
  })();

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#03C3A6]/25 bg-gradient-to-br from-[#03C3A6]/[0.06] to-white p-5">
        <p className="text-[11px] font-semibold text-[#03C3A6] uppercase tracking-widest mb-1">Policy name</p>
        <p className="text-base font-bold text-gray-900 mb-4">{policyName}</p>

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Expense categories</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {categories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#03C3A6]/10 text-[#03C3A6] text-[11px] font-semibold">
              <Tag className="w-2.5 h-2.5" /> {c}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3 h-3 text-gray-400" />
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Scope</p>
            </div>
            <p className="text-xs font-medium text-gray-700 leading-snug">{scopeSummary}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</p>
            </div>
            <p className="text-xs font-medium text-gray-700 leading-snug">{locations.join(", ")}</p>
          </div>
        </div>
      </div>

      {rules.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2 bg-gray-50 border-b border-border">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rule</p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Enforcement</p>
          </div>
          {rules.map((rule, i) => (
            <div key={rule.id}
              className={`grid grid-cols-3 px-4 py-3 items-center ${i < rules.length - 1 ? "border-b border-border" : ""}`}>
              <p className="text-sm font-medium text-gray-800">{RULE_TYPE_LABELS[rule.type].label}</p>
              <p className="text-sm text-gray-700 tabular-nums">
                {rule.amount ? `$${rule.amount}` : <span className="text-gray-300">—</span>}
              </p>
              <div>
                {rule.enforcement ? (
                  <span className={`inline-flex h-5 px-2 rounded-full text-[10px] font-semibold items-center ${
                    rule.enforcement === "Hard block" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
                  }`}>
                    {rule.enforcement}
                  </span>
                ) : <span className="text-gray-300 text-sm">—</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {approvers.filter(Boolean).length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Approvers</p>
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

const WARNING_OPTIONS: DropdownOption[] = [
  { value: "Hard block",   label: "Hard block",   subLabel: "Transaction is declined" },
  { value: "Soft warning", label: "Soft warning", subLabel: "User sees a caution prompt" },
];

const ADDABLE_RULE_TYPES: DropdownOption[] = [
  { value: "spend_limit",         label: "Spend Limit",        subLabel: "Cap daily spending" },
  { value: "receipt_requirement", label: "Receipt Requirement", subLabel: "Require receipts above a threshold" },
];

const mkRule = (type: RuleType = "spend_limit"): PolicyRule => ({
  id: Math.random().toString(36).slice(2),
  type,
  amount: "",
  enforcement: "",
});

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

  // Step 1
  const [policyName, setPolicyName] = useState("");

  // Step 2 — Scope
  // Two radio choices: "all" | "specific"
  const [scope,         setScope]         = useState<"all" | "specific">("all");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [categories,    setCategories]    = useState<string[]>([]);
  const [locations,     setLocations]     = useState<string[]>(["Global"]);
  const [addingLoc,     setAddingLoc]     = useState(false);
  const [newLoc,        setNewLoc]        = useState("");
  const [isAddCatOpen,  setIsAddCatOpen]  = useState(false);

  // Step 3 — Rules
  const [rules, setRules] = useState<PolicyRule[]>([
    mkRule("spend_limit"),
    mkRule("receipt_requirement"),
  ]);
  const [showAddRule, setShowAddRule] = useState(false);
  const addRuleRef = useRef<HTMLButtonElement>(null);

  // Step 4 — Approvers
  const [approvers, setApprovers] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);

  const rolesApi       = useGetAllRolesApi({ enabled: open });
  const directoryApi   = useGetDirectoryUsersApi({ enabled: open });
  const departmentsApi = useGetAllDepartmentsApi({ enabled: open });

  const roleOptions = useMemo<DropdownOption[]>(() =>
    (rolesApi.data?.data ?? []).map((r: any) => {
      const n = (r.name ?? "").replace(/_/g, " ");
      return { label: n.charAt(0).toUpperCase() + n.slice(1).toLowerCase(), value: r.name };
    }), [rolesApi.data?.data]);

  const adminOptions = useMemo<DropdownOption[]>(() =>
    (directoryApi.data?.data ?? [])
      .filter((u: any) => !u.villetoRole?.name?.toLowerCase().includes("employee"))
      .map((u: any) => ({
        label: `${u.firstName} ${u.lastName}`,
        value: `${u.firstName} ${u.lastName} (${u.villetoRole?.name || "Admin"})`,
        subLabel: u.villetoRole?.name || "Administrator",
      })), [directoryApi.data?.data]);

  const departmentOptions = useMemo<DropdownOption[]>(() =>
    (departmentsApi.data?.data ?? []).map((d: any) => ({
      label: d.departmentName,
      value: String(d.departmentId),
    })), [departmentsApi.data?.data]);

  const approverRequired = adminOptions.length > 0;
  const approverFilled   = approvers.filter(Boolean).length > 0;

  const togCat  = (v: string) => setCategories((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const togDept = (v: string) => setSelectedDepts((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);
  const togRole = (v: string) => setSelectedRoles((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const addLocation = () => {
    if (newLoc.trim()) { setLocations((l) => [...l, newLoc.trim()]); setNewLoc(""); setAddingLoc(false); }
  };

  const updateRule = (id: string, updated: PolicyRule) => setRules((r) => r.map((x) => x.id === id ? updated : x));
  const deleteRule = (id: string) => setRules((r) => r.filter((x) => x.id !== id));
  const addRule    = (type: RuleType) => { setRules((r) => [...r, mkRule(type)]); setShowAddRule(false); };

  /**
   * Human-readable "Applies to:" summary shown beneath the scope selectors.
   * Only shown when scope === "specific" and at least one dept or role is chosen.
   */
  const appliesTo = useMemo(() => {
    if (scope !== "specific") return "";
    const deptNames = selectedDepts.map((d) => departmentOptions.find((o) => o.value === d)?.label ?? d);
    const roleNames = selectedRoles.map((r) => roleOptions.find((o) => o.value === r)?.label ?? r);
    if (deptNames.length === 0 && roleNames.length === 0) return "";
    const listFmt = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
    const rolePart = roleNames.length > 0 ? listFmt.format(roleNames) : "All employees";
    const deptPart = deptNames.length > 0
      ? `the ${listFmt.format(deptNames)} department${deptNames.length > 1 ? "s" : ""}`
      : "all departments";
    return `${rolePart} in ${deptPart}`;
  }, [scope, selectedDepts, selectedRoles, departmentOptions, roleOptions]);

  const reset = () => {
    setStep(1); setPolicyName(""); setScope("all");
    setSelectedRoles([]); setSelectedDepts([]);
    setCategories([]); setLocations(["Global"]); setAddingLoc(false); setNewLoc("");
    setRules([mkRule("spend_limit"), mkRule("receipt_requirement")]);
    setApprovers([""]);
  };

  const handleClose   = () => { onOpenChange(false); reset(); };
  const handleBack    = () => setStep((s) => (s > 1 ? (s - 1) as 1|2|3|4|5 : s));
  const handleForward = () => {
    if (step < 5) setStep((s) => (s + 1) as 1|2|3|4|5);
    else handleConfirm();
  };

  const handleSaveDraft = () => { handleClose(); };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      onSuccess?.({
        name: policyName, categories, scope,
        selectedRoles, selectedDepts,
        locations, rules, approvers: approvers.filter(Boolean),
      });
      handleClose();
    } finally { setIsLoading(false); }
  };

  const scopeValid =
    categories.length > 0 &&
    (scope === "all" || (scope === "specific" && (selectedDepts.length > 0 || selectedRoles.length > 0)));

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
              <h2 className="text-[22px] font-semibold text-gray-900 mb-7">Policy Name</h2>
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
                  <div className="mt-5">
                    <ThreeStepBar current={step === 2 ? 1 : step === 3 ? 2 : 3} />
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 shrink-0" />

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 min-h-0" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
                <style>{`.modal-scroll::-webkit-scrollbar{display:none}`}</style>

                {/* ══ STEP 2 — Scope ══════════════════════════ */}
                {step === 2 && (
                  <>
                    {/* Expense category */}
                    <div>
                      <FieldLabel>Which type of expense should this policy apply to?</FieldLabel>
                      <MultiDropdown
                        placeholder="Select expense"
                        values={categories}
                        onToggle={togCat}
                        options={EXPENSE_OPTIONS}
                        searchable
                        footer={
                          <button type="button" onClick={() => setIsAddCatOpen(true)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#03C3A6] hover:bg-gray-50 transition-colors text-left">
                            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add category
                          </button>
                        }
                      />
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {categories.map((c) => (
                            <Chip key={c} label={EXPENSE_OPTIONS.find((o) => o.value === c)?.label ?? c}
                              onRemove={() => togCat(c)} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Who */}
                    <div>
                      <FieldLabel>Who should this policy apply to?</FieldLabel>
                      <div className="space-y-3">

                        {/* Option 1 — All Employees */}
                        <RadioRow
                          value="all"
                          label="All Employees"
                          checked={scope === "all"}
                          onChange={(v) => setScope(v as "all" | "specific")}
                        />

                        {/* Option 2 — Employees by department or role */}
                        <RadioRow
                          value="specific"
                          label="Employees by department or role"
                          subLabel="Narrow down by department, role, or both"
                          checked={scope === "specific"}
                          onChange={(v) => setScope(v as "all" | "specific")}
                        />

                        {/* Expanded sub-fields — only shown when specific is chosen */}
                        {scope === "specific" && (
                          <div className="ml-7 space-y-4 pt-1">

                            {/* Department selector */}
                            <div>
                              <SectionLabel>Select department(s)</SectionLabel>
                              <MultiDropdown
                                placeholder="Select department(s)"
                                values={selectedDepts}
                                onToggle={togDept}
                                options={departmentOptions}
                                isLoading={departmentsApi.isLoading}
                                searchable
                              />
                              {selectedDepts.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {selectedDepts.map((d) => (
                                    <Chip
                                      key={d}
                                      label={departmentOptions.find((o) => o.value === d)?.label ?? d}
                                      onRemove={() => togDept(d)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Role selector */}
                            <div>
                              <SectionLabel>Select role(s)</SectionLabel>
                              <MultiDropdown
                                placeholder="Select role(s)"
                                values={selectedRoles}
                                onToggle={togRole}
                                options={roleOptions}
                                isLoading={rolesApi.isLoading}
                                searchable
                              />
                              {selectedRoles.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {selectedRoles.map((r) => (
                                    <Chip
                                      key={r}
                                      label={roleOptions.find((o) => o.value === r)?.label ?? r}
                                      onRemove={() => togRole(r)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/*
                              Nudge — only visible when neither field has a selection yet.
                              Tells the user exactly what's needed without blocking them.
                              Disappears the moment they pick anything.
                            */}
                            {selectedDepts.length === 0 && selectedRoles.length === 0 && (
                              <p className="text-xs text-amber-600 flex items-center gap-1.5 mt-1">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2.5L1.5 13.5h13L8 2.5zM8 7v3M8 11.5v.5"/>
                                </svg>
                                <span>
                                  Please select at least one department or role to narrow down the policy scope.
                                </span>
                              </p>
                            )}

                            {/* "Applies to:" summary — appears once something is selected */}
                            {appliesTo && (
                              <p className="text-sm text-gray-500 leading-snug">
                                Applies to:{" "}
                                <span className="font-medium text-gray-700">{appliesTo}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <FieldLabel>
                        Location Filter{" "}
                        <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                      </FieldLabel>
                      {locations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {locations.map((loc, i) => (
                            <Chip key={i} label={loc}
                              onRemove={() => setLocations(locations.filter((_, j) => j !== i))} />
                          ))}
                        </div>
                      )}
                      {addingLoc ? (
                        <div className="flex gap-2">
                          <input autoFocus value={newLoc} onChange={(e) => setNewLoc(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addLocation()} placeholder="Office name…"
                            className="flex-1 h-10 px-3 rounded-xl border border-border text-sm focus:outline-none focus:border-[#03C3A6]" />
                          <button onClick={addLocation} className="h-10 px-4 rounded-xl bg-[#03C3A6] text-white text-sm font-medium hover:bg-[#03C3A6]/90 transition-colors">Add</button>
                          <button onClick={() => { setAddingLoc(false); setNewLoc(""); }}
                            className="h-10 px-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-gray-50 transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setAddingLoc(true)}
                          className="flex items-center gap-1.5 text-sm font-medium text-[#03C3A6] hover:underline">
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Locations
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* ══ STEP 3 — Rules ══════════════════════════ */}
                {step === 3 && (
                  <>
                    <p className="text-sm text-gray-500 leading-relaxed -mt-2">
                      Stack multiple rules to create complex enforcement logic.
                    </p>
                    <div className="space-y-4">
                      {rules.map((rule) => (
                        <RuleCard
                          key={rule.id}
                          rule={rule}
                          onChange={(updated) => updateRule(rule.id, updated)}
                          onDelete={() => deleteRule(rule.id)}
                          canDelete={rules.length > 1}
                        />
                      ))}
                    </div>
                    <div className="relative">
                      <button ref={addRuleRef} type="button" onClick={() => setShowAddRule((p) => !p)}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#03C3A6] hover:underline">
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> Add Another Rule
                      </button>
                      <PortalDropdown triggerRef={addRuleRef} open={showAddRule} onClose={() => setShowAddRule(false)}>
                        <DropdownList options={ADDABLE_RULE_TYPES} selectedValues={[]} multiSelect={false}
                          onSelect={(v) => addRule(v as RuleType)} />
                      </PortalDropdown>
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
                            options={adminOptions} isLoading={directoryApi.isLoading} searchable />
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
                  <Preview
                    policyName={policyName}
                    categories={categories}
                    scope={scope}
                    selectedRoles={selectedRoles}
                    roleOptions={roleOptions}
                    selectedDepts={selectedDepts}
                    departmentOptions={departmentOptions}
                    locations={locations}
                    rules={rules}
                    approvers={approvers}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="h-px bg-gray-100 shrink-0" />
              <div className="px-8 py-5 shrink-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleBack}
                    className="h-11 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                    Back
                  </button>
                  {step < 5 && (
                    <button type="button" onClick={handleSaveDraft}
                      className="h-11 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                      Save as Draft
                    </button>
                  )}
                </div>
                <button type="button" onClick={handleForward} disabled={continueDisabled}
                  className="h-11 px-8 rounded-xl bg-[#03C3A6] text-white text-sm font-semibold hover:bg-[#03C3A6]/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:scale-100 transition-all shadow-sm shadow-[#03C3A6]/20 flex items-center gap-2">
                  {isLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : step === 5 ? "Submit for approval" : "Continue"
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