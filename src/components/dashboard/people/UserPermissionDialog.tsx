import { useState } from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserPermissionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

interface Permission {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export function UserPermissionsDialog({
    open,
    onOpenChange,
    userId,
}: UserPermissionsDialogProps) {
    const [permissions, setPermissions] = useState<Permission[]>([
        {
            id: "view_expenses",
            name: "View Expenses",
            description: "Access and review all submitted expense reports.",
            enabled: true,
        },
        {
            id: "approve_expenses",
            name: "Approve Expenses",
            description: "Authorize valid expense submissions for payment.",
            enabled: false,
        },
        {
            id: "reject_expenses",
            name: "Reject Expenses",
            description: "Decline expense requests that don't meet policy requirements.",
            enabled: true,
        },
        {
            id: "edit_expenses",
            name: "Edit Expenses",
            description: "Modify submitted expense details when corrections are needed.",
            enabled: true,
        },
        {
            id: "create_expense",
            name: "Create Expense",
            description: "Add new expense entries for projects or activities.",
            enabled: false,
        },
        {
            id: "manage_roles",
            name: "Manage Roles & Users",
            description: "Assign roles, set permissions, and manage user accounts.",
            enabled: false,
        },
        {
            id: "edit_policy",
            name: "Edit Expense Policy",
            description: "Update rules and guidelines governing expense submissions.",
            enabled: true,
        },
        {
            id: "audit_logs",
            name: "Access Audit Logs",
            description: "View a record of all user actions for transparency and accountability.",
            enabled: true,
        },
    ]);

    const togglePermission = (id: string) => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>User Permissions</DialogTitle>

                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage what each role can view, create, edit, and approve across Villeto.
                    </p>
                </DialogHeader>

                <div className="gap-4 grid h-full overflow-y-auto">
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-medium">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">Sarahchen@gmail.com</p>
                            <p className="text-sm text-muted-foreground">Finance Manager</p>
                        </div>
                        <Badge className="bg-green-50 text-green-700">Active</Badge>
                    </div>

                    <div className="space-y-4">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-medium">{permission.name}</p>
                                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                                </div>
                                <Switch
                                    checked={permission.enabled}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                />
                            </div>
                        ))}
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                        Save Permissions
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}