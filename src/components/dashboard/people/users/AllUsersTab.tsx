import { useState } from "react";
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
import { useGetAllUsersApi } from "@/actions/users/get-all-users";
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

    const usersApi = useGetAllUsersApi();
    const depts = useGetAllDepartmentsApi();
    const roles = useGetAllRolesApi();

    const tableprops = tableData(usersApi?.data?.data ?? []);

    const handleViewProfile = (userId: string) => {
        setSelectedUser(userId);
        setProfileModalOpen(true);
    };

    return (
        <div className="space-y-4">
            <DataTable
                data={usersApi?.data?.data ?? []}
                isLoading={usersApi.isLoading || depts.isLoading || roles.isLoading}
                columns={columns(handleViewProfile)}
                paginationProps={{ ...tableprops.paginationProps, total: usersApi?.data?.meta.totalCount ?? 0 }}
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
                        ],
                        onFilter: (filters) => {
                            console.log("Filters:", filters);
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