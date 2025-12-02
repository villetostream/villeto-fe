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

    return (
        <div className="space-y-4">
            <UsersTable />

            {selectedUser && (
                <UserPermissionsDialog
                    open={permissionsDialogOpen}
                    onOpenChange={setPermissionsDialogOpen}
                    userId={selectedUser}
                />
            )}
        </div>
    );
}