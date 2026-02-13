
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppUser } from "@/actions/departments/get-all-departments";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import PermissionGuard from "@/components/permissions/permission-protected-components";


const columnHelper = createColumnHelper<AppUser>();

export const columns: ColumnDef<AppUser, any>[] = [
    columnHelper.display({
        id: "idNo",
        header: "ID NO",
        cell: (info) => {
            const rowNum = String(info.row.index + 1).padStart(2, '0');
            return <p className="text-sm">{rowNum}</p>;
        },
    }),
    columnHelper.accessor("firstName", {
        header: "USER NAME",
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
    columnHelper.accessor("cardIssued", {
        header: "CARD TYPE",
        cell: (info) => {
            const cardIssued = info.getValue();
            const cardType = cardIssued ? "Virtual" : "-";
            return <p className="capitalize">{cardType}</p>;
        },
    }),
    columnHelper.accessor("position", {
        header: "ROLE",
        cell: (info) => {
            const position = info.getValue();
            // Convert position to readable format (e.g., "CONTROLLING_OFFICER" -> "Controlling Officer")
            const formattedPosition = position 
                ? position.replace(/_/g, ' ').toLowerCase() 
                : "-";
            return <p className="capitalize">{formattedPosition}</p>;
        },
    }),
    columnHelper.accessor("department", {
        header: "DEPARTMENT",
        cell: (info) => {
            const dept = info.getValue() as any;
            // Department might be an empty object {}, an object with departmentName, or null
            const deptName = (dept && typeof dept === 'object' && Object.keys(dept).length > 0) 
                ? dept.departmentName 
                : null;
            return <p className="capitalize">{deptName || "-"}</p>;
        },
    }),
    columnHelper.display({
        id: "manager",
        header: "MANAGER",
        cell: (info) => {
            const manager = (info.row.original as any).manager;
            // Manager is an object with firstName and lastName, or null
            const managerName = manager 
                ? `${manager.firstName || ''} ${manager.lastName || ''}`.trim()
                : null;
            return <p className="capitalize">{managerName || "-"}</p>;
        },
    }),
    columnHelper.accessor("status", {
        header: "STATUS",
        cell: (info) => {
            const status = info.getValue() as string;
            // Status is a string: "Active" or "Inactive"
            const isActive = status?.toLowerCase() === "active";
            const statusText = status?.toLowerCase() || "inactive";
            return (
                <Badge variant={isActive ? "active" : "inactive"}>
                    <span className="ml-1 capitalize">{statusText}</span>
                </Badge>
            );
        },
    }),
    columnHelper.display({
        id: "actions",
        header: "ACTION",
        enableHiding: false,
        cell: (data) => {
            const status = (data.row.original as any).status as string;
            const isActive = status?.toLowerCase() === "active";
            
            return (
                <div className="flex justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <PermissionGuard requiredPermissions={["read:user"]}>
                                <DropdownMenuItem onClick={() => {
                                    console.log("View profile:", data.row.original.userId);
                                }}>
                                    View Profile
                                </DropdownMenuItem>
                            </PermissionGuard>
                            
                            {isActive ? (
                                <PermissionGuard requiredPermissions={["update:users"]}>
                                    <DropdownMenuItem onClick={() => {
                                        console.log("Deactivate user:", data.row.original.userId);
                                    }}>
                                        Deactivate User
                                    </DropdownMenuItem>
                                </PermissionGuard>
                            ) : (
                                <PermissionGuard requiredPermissions={["update:users"]}>
                                    <DropdownMenuItem onClick={() => {
                                        console.log("Activate user:", data.row.original.userId);
                                    }}>
                                        Activate User
                                    </DropdownMenuItem>
                                </PermissionGuard>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    }),
];