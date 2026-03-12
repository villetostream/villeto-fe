"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PlusCircle, ShieldCheck, MoreHorizontal, Pencil, Shield, Trash2,
  Search, SlidersHorizontal, RefreshCcw, ChevronDown,
  Eye, Archive, X, UserCircle, FileText, Clock, Tag,
} from "lucide-react";
import PolicyCreationModal, { type CreatedPolicyData } from "@/components/policies/PolicyCreationModal";
import AddCategoryModal from "@/components/auth/AddCategoryModal";
import { DataTable } from "@/components/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { StatsCard } from "@/components/dashboard/landing/StatCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useHeaderActionStore } from "@/stores/useHeaderActionStore";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type PolicyStatus = "active" | "pending" | "draft";

interface Policy {
  id: string;
  name: string;
  version: number;
  category: string;
  appliedTo: string;
  createdBy: string;
  date: string;
  status: PolicyStatus;
  approvers: string[];
  dailyLimit: string;
  receiptRequired: boolean;
  archivedOn?: string;
}

type ExpenseCategory = {
  id: number;
  category: string;
  description: string;
  createdBy: string;
  date: string;
  policyStatus: string;
};

const expenseCategories: ExpenseCategory[] = [
  { id: 1, category: "Employee Meals",  description: "Food related expenses",                createdBy: "Andy James",  date: "26-09-2025", policyStatus: "Pending" },
  { id: 2, category: "Transportation",  description: "Taxi or fuel",                          createdBy: "James Idris", date: "26-09-2025", policyStatus: "Pending" },
  { id: 3, category: "Vacation",        description: "This covers everything on vacations",   createdBy: "James Idris", date: "26-09-2025", policyStatus: "Pending" },
  { id: 4, category: "Accommodation",   description: "This covers everything on vacations",   createdBy: "James Idris", date: "26-09-2025", policyStatus: "Pending" },
];

const CURRENT_USER = "Israel Chen (You)";
const IS_APPROVER  = true;

function todayStr() {
  const d = new Date();
  return [String(d.getDate()).padStart(2,"0"), String(d.getMonth()+1).padStart(2,"0"), d.getFullYear()].join("-");
}

/* ─── Status Badge ───────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:  "bg-success/10 text-success",
    pending: "bg-pending/10 text-pending",
    draft:   "bg-draft/10 text-draft",
  };
  return (
    <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold capitalize ${map[status.toLowerCase()] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

/* ─── Expense Category Action Menu ───────────────────────────────────────────── */

function ActionMenu({ onCreatePolicy }: { onCreatePolicy: () => void }) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/60 transition-colors cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[210px] bg-white rounded-[20px] border border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-1.5 overflow-hidden">
          <DropdownMenuItem className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors border-b border-border/50 cursor-pointer">
            <Pencil className="w-[17px] h-[17px] text-muted-foreground shrink-0" strokeWidth={1.5} /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCreatePolicy} className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors border-b border-border/50 cursor-pointer">
            <Shield className="w-[17px] h-[17px] text-muted-foreground shrink-0" strokeWidth={1.5} /> Create policy
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors cursor-pointer text-destructive">
            <Trash2 className="w-[17px] h-[17px] text-destructive shrink-0" strokeWidth={1.5} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ─── Policy Details Modal ───────────────────────────────────────────────────── */

function PolicyDetailsModal({ policy, onClose, onEdit, onArchive }: {
  policy: Policy | null; onClose: () => void;
  onEdit: (p: Policy) => void; onArchive: (p: Policy) => void;
}) {
  if (!policy) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[560px] overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Policy details</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/80 flex items-center justify-center transition-all border border-border/50">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="h-px bg-border w-full my-6 opacity-60" />
          <div className="rounded-[1.5rem] border border-border/60 bg-muted/10 p-7 space-y-6">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Policy Name</p>
                <p className="text-base font-semibold text-foreground">{policy.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Expense Category</p>
                <p className="text-base font-semibold text-foreground capitalize">{policy.category}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Applied To</p>
                <p className="text-base font-semibold text-foreground capitalize">{policy.appliedTo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Rules</p>
                <p className="text-base font-semibold text-foreground">Daily Limit: ${policy.dailyLimit || "0"}</p>
                {policy.receiptRequired && <p className="text-base font-semibold text-foreground">Receipt required</p>}
              </div>
            </div>
            <div className="h-px bg-border/60" />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Created by</p>
              <p className="text-base font-semibold text-foreground">{policy.createdBy}</p>
              <p className="text-sm text-muted-foreground">{policy.date}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Approved by</p>
              <div className="flex flex-wrap gap-2">
                {policy.approvers.length > 0 ? policy.approvers.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-primary/10 text-sm font-medium text-foreground">
                    <UserCircle className="w-4 h-4 text-primary opacity-60" />{a}
                  </div>
                )) : <p className="text-sm text-muted-foreground italic">None assigned</p>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{policy.date}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => { onArchive(policy); onClose(); }}
              className="h-12 px-8 rounded-[18px] border-[1.5px] border-pending text-pending font-bold text-sm hover:bg-pending/5 transition-colors">
              Move to Archive
            </button>
            <button onClick={() => { onEdit(policy); onClose(); }}
              className="h-12 px-10 rounded-[18px] bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Review Policy Modal ────────────────────────────────────────────────────── */

function ReviewPolicyModal({ policy, onClose, onApprove, onReject }: {
  policy: Policy | null; onClose: () => void;
  onApprove: (p: Policy) => void; onReject: (p: Policy) => void;
}) {
  if (!policy) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[540px] overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-foreground">Review Policy</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/80 flex items-center justify-center transition-all border border-border/50">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="h-px bg-border w-full my-6 opacity-60" />
          <div className="rounded-[1.5rem] border border-border/60 bg-muted/10 p-7 space-y-6">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Policy Name</p>
                <p className="text-base font-semibold text-foreground">{policy.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Expense Category</p>
                <p className="text-base font-semibold text-foreground capitalize">{policy.category}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Applied To</p>
                <p className="text-base font-semibold text-foreground capitalize">{policy.appliedTo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Rules</p>
                <p className="text-base font-semibold text-foreground">Daily Limit: ${policy.dailyLimit || "0"}</p>
                {policy.receiptRequired && <p className="text-base font-semibold text-foreground">Receipt required</p>}
              </div>
            </div>
            <div className="h-px bg-border/60" />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Approver(s)</p>
              <div className="flex flex-wrap gap-2">
                {policy.approvers.length > 0 ? policy.approvers.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-primary/10 text-sm font-medium text-foreground">
                    <UserCircle className="w-4 h-4 text-primary opacity-60" />{a}
                  </div>
                )) : <p className="text-sm text-muted-foreground italic">None assigned</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => { onReject(policy); onClose(); }}
              className="h-12 px-10 rounded-[18px] border-[1.5px] border-destructive text-destructive font-bold text-sm hover:bg-destructive/5 transition-colors">
              Reject
            </button>
            <button onClick={() => { onApprove(policy); onClose(); }}
              className="h-12 px-10 rounded-[18px] bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function PoliciesPage() {
  const [activeTab, setActiveTab]           = useState<"policies" | "expense" | "archived">("policies");
  const [isCreatePolicyOpen, setIsCreatePolicyOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen]   = useState(false);
  const [policies, setPolicies]             = useState<Policy[]>([]);
  const [detailPolicy, setDetailPolicy]     = useState<Policy | null>(null);
  const [reviewPolicy, setReviewPolicy]     = useState<Policy | null>(null);
  const [search, setSearch]                 = useState("");

  // Register dynamic header CTA button
  const { setAction, clearAction } = useHeaderActionStore();

  useEffect(() => {
    if (activeTab === "policies") {
      setAction({ label: "New Policy", onClick: () => setIsCreatePolicyOpen(true) });
    } else if (activeTab === "expense") {
      setAction({ label: "New Expense Category", onClick: () => setIsAddCategoryOpen(true) });
    } else {
      // Archived tab — no button
      clearAction();
    }
    // Cleanup on unmount
    return () => clearAction();
  }, [activeTab, setAction, clearAction]);

  /* derived */
  const activePolicies   = useMemo(() => policies.filter(p => !p.archivedOn), [policies]);
  const archivedPolicies = useMemo(() => policies.filter(p =>  p.archivedOn), [policies]);
  const approvedCount    = useMemo(() => activePolicies.filter(p => p.status === "active").length,  [activePolicies]);
  const draftedCount     = useMemo(() => activePolicies.filter(p => p.status === "draft").length,   [activePolicies]);
  const pendingCount     = useMemo(() => activePolicies.filter(p => p.status === "pending").length, [activePolicies]);

  const filteredPolicies = useMemo(() => {
    const q = search.toLowerCase();
    return activePolicies.filter(p =>
      !q || p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.createdBy.toLowerCase().includes(q)
    );
  }, [activePolicies, search]);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase();
    return expenseCategories.filter(c =>
      !q || c.category.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.createdBy.toLowerCase().includes(q)
    );
  }, [search]);

  /* handlers */
  const handleCreated = (data: CreatedPolicyData) => {
    setPolicies(prev => [{
      id: `p-${Date.now()}`,
      name: data.name,
      version: 1,
      category: data.category,
      appliedTo: data.appliedTo,
      createdBy: CURRENT_USER,
      date: todayStr(),
      status: "pending",
      approvers: data.approvers,
      dailyLimit: data.dailyLimit,
      receiptRequired: !!data.receiptAbove,
    }, ...prev]);
    setActiveTab("policies");
  };

  const handleEdit    = (policy: Policy) => {
    setPolicies(prev => [{
      ...policy,
      id: `p-${Date.now()}`,
      version: policy.version + 1,
      status: "draft",
      archivedOn: undefined,
    }, ...prev]);
  };
  const handleArchive = (p: Policy) => setPolicies(prev => prev.map(x => x.id === p.id ? { ...x, archivedOn: todayStr() } : x));
  const handleApprove = (p: Policy) => setPolicies(prev => prev.map(x => x.id === p.id ? { ...x, status: "active" } : x));
  const handleReject  = (p: Policy) => setPolicies(prev => prev.filter(x => x.id !== p.id));

  const lastUpdated = `Last updated: ${new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}`;
  const statCards = [
    { title: "Approved Policies", value: approvedCount,            icon: ShieldCheck, bg: "#418341" },
    { title: "Drafted Policies",  value: draftedCount,             icon: FileText,    bg: "#384A57" },
    { title: "Pending Policies",  value: pendingCount,             icon: Clock,       bg: "#D97706" },
    { title: "Expense Category",  value: expenseCategories.length, icon: Tag,         bg: "#38B2AC" },
  ];

  /* DataTable columns for Policy tab */
  const policyColumns = useMemo<ColumnDef<Policy>[]>(() => [
    {
      accessorKey: "name",
      header: "Policy Name",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-bold text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">v{row.original.version}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="capitalize">{row.original.category}</span>,
    },
    { accessorKey: "appliedTo", header: "Applied To" },
    { accessorKey: "createdBy", header: "Created By" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="tabular-nums">{row.original.date}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: () => <div className="text-right w-full">Action</div>,
      cell: ({ row }) => {
        const policy = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            {policy.status === "pending" && IS_APPROVER && (
              <button
                onClick={() => setReviewPolicy(policy)}
                className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Review
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[210px] bg-white rounded-[20px] border border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-1.5 overflow-hidden">
                <DropdownMenuItem onClick={() => setDetailPolicy(policy)} className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/50">
                  <Eye className="w-[17px] h-[17px] text-muted-foreground shrink-0" strokeWidth={1.5} /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(policy)} className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/50">
                  <Pencil className="w-[17px] h-[17px] text-muted-foreground shrink-0" strokeWidth={1.5} /> Edit Policy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleArchive(policy)} className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors cursor-pointer">
                  <Archive className="w-[17px] h-[17px] text-muted-foreground shrink-0" strokeWidth={1.5} /> Archive Policy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], []);

  /* DataTable columns for Archived tab */
  const archivedColumns = useMemo<ColumnDef<Policy>[]>(() => [
    {
      accessorKey: "name",
      header: "Policy Name",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-bold text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">v{row.original.version}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="capitalize">{row.original.category}</span>,
    },
    { accessorKey: "appliedTo", header: "Applied To" },
    { accessorKey: "createdBy", header: "Created By" },
    {
      accessorKey: "date",
      header: "Created On",
      cell: ({ row }) => <span className="tabular-nums">{row.original.date}</span>,
    },
    {
      accessorKey: "archivedOn",
      header: "Archived On",
      cell: ({ row }) => <span className="tabular-nums">{row.original.archivedOn}</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-right w-full">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button
            onClick={() => setDetailPolicy(row.original)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors ml-auto cursor-pointer"
          >
            <Eye className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      ),
    },
  ], []);

  /* DataTable columns for Expense Category tab */
  const columns = useMemo<ColumnDef<ExpenseCategory>[]>(() => [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="font-bold text-foreground">{row.original.category}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => <span className="text-foreground/75">{row.original.createdBy}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="text-foreground/75 tabular-nums">{row.original.date}</span>,
    },
    {
      accessorKey: "policyStatus",
      header: "Policy",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-pending/10 text-pending">
          {row.original.policyStatus}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right w-full">Action</div>,
      cell: () => (
        <div className="text-right">
          <ActionMenu onCreatePolicy={() => setIsCreatePolicyOpen(true)} />
        </div>
      ),
    },
  ], []);

  return (
    <div className="bg-background min-h-screen p-6 space-y-6">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1.5">
        {statCards.map((s) => (
          <StatsCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={
              <div className="p-2 mr-3 flex items-center justify-center rounded-full text-white shrink-0"
                style={{ backgroundColor: s.bg }}>
                <s.icon className="w-5 h-5" />
              </div>
            }
            subtitle={<span className="text-xs leading-[125%]">{lastUpdated}</span>}
          />
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="bg-card rounded-[1.25rem] border border-border shadow-sm overflow-hidden flex flex-col">

        {/* Tab row */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0 flex-wrap gap-3">
          {/* Pill tabs */}
          <div className="flex bg-muted rounded-xl p-1">
            {(["policies", "expense", "archived"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(""); }}
                className={`py-1.5 px-4 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "policies" ? "Policies" : tab === "expense" ? "Expense Category" : "Archived"}
              </button>
            ))}
          </div>

          {/* Search + Filter + Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 pr-4 rounded-xl border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors w-[200px]"
              />
            </div>
            <button className="h-10 px-4 rounded-xl border border-border bg-white text-sm text-muted-foreground flex items-center gap-1.5 hover:bg-muted/30 transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filter <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="h-10 w-10 rounded-xl border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted/30 transition-colors">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ════ POLICIES TAB ════ */}
        {activeTab === "policies" && (
          <>
            {activePolicies.length === 0 ? (
              <div className="border-t border-border flex justify-center items-center py-10 px-6">
                <div className="w-full max-w-[660px] rounded-[1.5rem] border border-dashed border-border bg-primary/[0.02] py-10 px-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/[0.06] flex items-center justify-center mb-7">
                    <ShieldCheck className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No policies created yet</h2>
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-9">
                    Policies help you automate expense approvals and enforce spending limits.
                  </p>
                  <button
                    onClick={() => setIsCreatePolicyOpen(true)}
                    className="h-12 px-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <PlusCircle className="w-4 h-4" strokeWidth={2} />
                    Create First Policy
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 border-t border-border overflow-hidden flex flex-col">
                <DataTable data={filteredPolicies} columns={policyColumns} height="auto" />
              </div>
            )}
          </>
        )}

        {/* ════ EXPENSE CATEGORY TAB ════ */}
        {activeTab === "expense" && (
          <div className="flex-1 border-t border-border overflow-hidden flex flex-col">
            <DataTable data={filteredCategories} columns={columns} height="auto" />
          </div>
        )}

        {/* ════ ARCHIVED TAB ════ */}
        {activeTab === "archived" && (
          <div className="flex-1 border-t border-border overflow-hidden flex flex-col">
            <DataTable data={archivedPolicies} columns={archivedColumns} height="auto" />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <PolicyCreationModal
        open={isCreatePolicyOpen}
        onOpenChange={setIsCreatePolicyOpen}
        onSuccess={handleCreated}
      />
      <AddCategoryModal
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSkip={() => setIsAddCategoryOpen(false)}
        onSuccess={() => setIsAddCategoryOpen(false)}
      />
      <PolicyDetailsModal
        policy={detailPolicy}
        onClose={() => setDetailPolicy(null)}
        onEdit={(p) => { handleEdit(p); setDetailPolicy(null); }}
        onArchive={(p) => { handleArchive(p); setDetailPolicy(null); }}
      />
      <ReviewPolicyModal
        policy={reviewPolicy}
        onClose={() => setReviewPolicy(null)}
        onApprove={(p) => { handleApprove(p); setReviewPolicy(null); }}
        onReject={(p) => { handleReject(p); setReviewPolicy(null); }}
      />
    </div>
  );
}