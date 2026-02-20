
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AppUser } from "@/actions/departments/get-all-departments";
import { Switch } from "@/components/ui/switch";

/** Formats a string like "CONTROLLING_OFFICER" or "senior-manager" to "Controlling Officer" or "Senior Manager" */
function formatName(value: string | null | undefined): string {
    if (!value) return "—";
    return value
        .replace(/[_-]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function getDepartmentName(dept: any): string {
    if (!dept) return "—";
    if (typeof dept === "string") return dept || "—";
    if (typeof dept === "object" && Object.keys(dept).length > 0) {
        return dept.departmentName || dept.name || "—";
    }
    return "—";
}

const columnHelper = createColumnHelper<AppUser>();

export const directoryColumns: ColumnDef<AppUser, any>[] = [
    columnHelper.display({
        id: "idNo",
        header: "S/N",
        cell: (info) => {
            const rowNum = String(info.row.index + 1).padStart(2, '0');
            return <p className="text-sm">{rowNum}</p>;
        },
    }),
    columnHelper.accessor("firstName", {
        header: "DETAILS",
        cell: (info) => {
            const firstName = info.getValue() || "";
            const lastName = info.row.original.lastName || "";
            const email = info.row.original.email || "";
            const fullName = `${firstName} ${lastName}`.trim() || "-";
            
            return (
                <div className="flex flex-col">
                    <p className="capitalize font-medium">{fullName}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </div>
            );
        },
    }),
    columnHelper.accessor("department", {
        header: "DEPARTMENT",
        cell: (info) => {
            const dept = info.getValue() as any;
            return <p className="capitalize">{getDepartmentName(dept)}</p>;
        },
    }),
    columnHelper.accessor("position", {
        header: "JOB TITLE",
        cell: (info) => {
            const position = info.getValue();
            const jobTitle = (info.row.original as any).jobTitle;
            const value = jobTitle || position;
            return <p className="text-sm">{formatName(value)}</p>;
        },
    }),
    columnHelper.display({
        id: "manager",
        header: "REPORTS TO",
        cell: (info) => {
            const manager = (info.row.original as any).manager;
            let managerName = "—";
            if (manager && typeof manager === "object") {
                const first = formatName(manager.firstName);
                const last = formatName(manager.lastName);
                managerName = `${first} ${last}`.trim() || "—";
            } else if (typeof manager === "string" && manager) {
                managerName = formatName(manager);
            }
            return <p className="font-medium">{managerName}</p>;
        },
    }),
    columnHelper.accessor("updatedAt" as any, {
        header: "LAST UPDATED",
        cell: (info) => {
            const date = info.getValue() as string;
            if (!date) return <p className="text-sm text-gray-500">—</p>;
            const formatted = new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
            return <p className="text-sm text-gray-600">{formatted}</p>;
        },
    }),
    columnHelper.accessor("status", {
        header: "STATUS",
        cell: (info) => {
            const status = info.getValue() as string;
            const isActive = status?.toLowerCase() === "active";
            const statusText = status?.toLowerCase() || "inactive";
            return (
                <Badge variant={isActive ? "active" : "inactive"}>
                    <span className="ml-1 capitalize">{statusText}</span>
                </Badge>
            );
        },
    }),
];
