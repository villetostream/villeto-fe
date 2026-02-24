import { useState, useMemo } from "react";
import { Search, Filter, RefreshCw, Edit, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPermissionsDialog } from "../UserPermissionDialog";
import UsersTable from "./UserTable";
import { UserProfileModal } from "../modals/UserProfileModal";
import { columns } from "./column";
import { AppUser } from "@/actions/departments/get-all-departments";
import { DataTable } from "@/components/datatable";
import { useGetInvitedUsersApi } from "@/actions/users/get-all-users";
import { useGetAllDepartmentsApi } from "@/actions/departments/get-all-departments";
import { useGetAllRolesApi } from "@/actions/role/get-all-roles";
import { tableData } from "./UserTable";

// Mock data
const mockUsers = [
    {
        id: "01",
        name: "Sarah Chen",
        department: "Marketing",
        cardType: "Virtual",
        role: "Finance Manager",
        location: "New York City",
        manager: "Andy James",
        status: "active",
    },
    // Add more mock data as needed
];

export function AllUsersTab() {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const usersApi = useGetInvitedUsersApi();
    const depts = useGetAllDepartmentsApi();
    const roles = useGetAllRolesApi();

    const tableprops = tableData(usersApi?.data?.data ?? []);

    const handleViewProfile = (userId: string) => {
        setSelectedUser(userId);
        setProfileModalOpen(true);
    };

    const users: AppUser[] = usersApi?.data?.data ?? [];

    const filteredUsers = useMemo(() => {
        let result = users;

        // Apply search
        if (tableprops.globalSearch) {
            const searchLower = tableprops.globalSearch.toLowerCase();
            result = result.filter(u => {
                const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
                const email = (u.email || "").toLowerCase();
                return fullName.includes(searchLower) || email.includes(searchLower);
            });
        }

        // Apply filters
        const filters = tableprops.filterBy || {};
        if (filters.status && filters.status !== "all") {
            const filterStat = filters.status.toLowerCase();
            result = result.filter(u => {
                const statusStr = (u.status || "").toLowerCase();
                const isActiveStr = u.isActive ? "active" : "inactive";
                return statusStr === filterStat || isActiveStr === filterStat;
            });
        }
        if (filters.roleId && filters.roleId !== "all") {
            result = result.filter(u => {
                const uRoleId = (u as any).roleId || u.role?.roleId || (u.role as any)?.id;
                return uRoleId === filters.roleId;
            });
        }
        if (filters.departmentId && filters.departmentId !== "all") {
            result = result.filter(u => {
                const uDeptId = typeof u.department === "object" ? ((u.department as any)?.departmentId || (u.department as any)?.id) : (u.departmentId || u.department);
                return uDeptId === filters.departmentId;
            });
        }
        if (filters.manager && filters.manager !== "all") {
            result = result.filter(u => {
                const managerName = (u as any).manager 
                    ? typeof (u as any).manager === "string" 
                        ? (u as any).manager.toLowerCase() 
                        : `${(u as any).manager.firstName || ""} ${(u as any).manager.lastName || ""}`.toLowerCase()
                    : "";
                return managerName.includes(filters.manager.toLowerCase());
            });
        }

        return result;
    }, [users, tableprops.globalSearch, tableprops.filterBy]);

    return (
        <div className="space-y-4">
            <DataTable
                data={filteredUsers}
                isLoading={usersApi.isLoading || depts.isLoading || roles.isLoading}
                columns={columns(handleViewProfile)}
                paginationProps={{ ...tableprops.paginationProps, total: filteredUsers.length }}
                enableRowSelection={true}
                enableColumnVisibility={true}
                selectedDataIds={tableprops.selectedDataIds}
                setSelectedDataIds={tableprops.setSelectedDataIds}
                tableHeader={{
                    actionButton: <></>,
                    isSearchable: true,
                    isExportable: false,
                    isFilter: true,
                    enableColumnVisibility: true,
                    search: tableprops.globalSearch,
                    searchQuery: tableprops.setGlobalSearch,
                    filterProps: {
                        title: "Filter Users",
                        filterData: [
                            {
                                name: "status",
                                label: "Status",
                                type: "select",
                                options: [
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                ],
                            },
                            {
                                name: "roleId",
                                label: "Role",
                                type: "select",
                                options: roles?.data?.data?.map((r: any) => ({
                                    label: r.name ? r.name.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()) : 'Unknown',
                                    value: r.roleId,
                                })) || [],
                            },
                            {
                                name: "departmentId",
                                label: "Department",
                                type: "select",
                                options: depts?.data?.data?.map((d: any) => ({
                                    label: d.departmentName || d.name,
                                    value: d.departmentId || d.id,
                                })) || [],
                            }
                        ],
                        onFilter: (filters: Record<string, any>) => {
                            const unwrapped: Record<string, any> = {};
                            Object.entries(filters).forEach(([key, value]) => {
                                const match = key.match(/filters\[(.*?)\]/);
                                if (match) unwrapped[match[1]] = value;
                                else unwrapped[key] = value;
                            });
                            tableprops.setFilterBy(unwrapped);
                            tableprops.setPage(1); // Reset page on filter
                        },
                    },
                    bulkActions: [],
                }}
            />

            {selectedUser && (
                <>
                    <UserPermissionsDialog
                        open={permissionsDialogOpen}
                        onOpenChange={setPermissionsDialogOpen}
                        userId={selectedUser}
                    />
                    <UserProfileModal 
                        isOpen={profileModalOpen}
                        onClose={() => setProfileModalOpen(false)}
                        userId={selectedUser}
                    />
                </>
            )}
        </div>
    );
}