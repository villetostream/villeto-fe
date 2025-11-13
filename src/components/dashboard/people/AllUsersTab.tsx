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
import { UserPermissionsDialog } from "./UserPermissionDialog";

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
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox />
                            </TableHead>
                            <TableHead>ID NO</TableHead>
                            <TableHead>USER NAME</TableHead>
                            <TableHead>DEPARTMENT</TableHead>
                            <TableHead>CARD TYPE</TableHead>
                            <TableHead>ROLE</TableHead>
                            <TableHead>LOCATION</TableHead>
                            <TableHead>MANAGER</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead className="text-right">ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>{user.cardType}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.location}</TableCell>
                                <TableCell>{user.manager}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "active" ? "default" : "secondary"} className="bg-green-50 text-green-700">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedUser(user.id);
                                                setPermissionsDialogOpen(true);
                                            }}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Manage Permissions
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 1-11 of 170 entries</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="default" size="sm" className="bg-primary">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>

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