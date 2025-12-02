
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATE_KEYS } from "@/lib/constants/state_key";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import SuccessModal from "@/components/modals/SuccessModal";
import { useRoleHook } from "@/hooks/people/role/role-hook";
import { AppUser } from "@/actions/departments/get-all-departments";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import PermissionGuard from "@/components/permissions/permission-protected-components";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<AppUser>();

export const columns: ColumnDef<AppUser, any>[] = [
    columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => <p className="capitalize">{`${info.getValue() || "-"}`}</p>,
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => <p className="capitalize">{`${info.getValue() || "-"}`}</p>,
    }),
    columnHelper.accessor("jobTitle", {
        header: "Job Title",
        cell: (info) => <p className="capitalize">{`${info.getValue() || "-"}`}</p>,
    }),
    columnHelper.accessor("position", {
        header: "Position",
        cell: (info) => <p className="capitalize">{`${info.getValue() ?? "-"}`}</p>,
    }),
    // columnHelper.accessor("createdAt", {
    //     header: "Date ",
    //     cell: (info) => {
    //         return <p className="capitalize">{`${dateFormatter(info.getValue()) || "-"}`}</p>;
    //     },
    // }),
    columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => {
            return <Badge variant={info.row.original.isActive ? "active" : "inactive"}>

                <span className="ml-1 capitalize">{info.row.original.isActive ? "active" : "inactive"}</span>
            </Badge>;
        },
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: (data) => {

            const hook = useRoleHook();
            const router = useRouter()
            const { selected, setSelected, state, setState, handleDeleteAction, actionIsLoading
            } = hook
            return (<div className="flex justify-end gap-2" >
                {
                    STATE_KEYS.DELETE == state && (
                        <ConfirmDialog
                            title={"Delete Role"}
                            description={`Do you want to delete role ${selected?.name}?`}
                            confirmText={"Delete"}
                            cancelText="Cancel"
                            loading={actionIsLoading}
                            onOpenChange={() => {
                                if (state) {
                                    setState(null);
                                } else {
                                    setState(STATE_KEYS.DELETE);
                                }
                            }}
                            isOpen={state == STATE_KEYS.DELETE}
                            onConfirm={async () => {
                                //console.log("i am running")
                                try {
                                    await handleDeleteAction();

                                    // setIsOpen(false); // close after success
                                } catch (e) { }
                            }}
                            buttonText={"Delete Product"}
                        />
                    )
                }

                <SuccessModal
                    isOpen={STATE_KEYS.SUCCESS == state}
                    onClose={() => {
                        setState(null)
                    }}
                    title={`Role deleted Successfully`}
                    description={""}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <PermissionGuard requiredPermissions={["read:user"]}>

                            <DropdownMenuItem onClick={() => {
                            }}>
                                View Profile
                            </DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard requiredPermissions={["update:users"]}>

                            <DropdownMenuItem disabled={data.row.original.jobTitle == null} onSelect={() => {
                                router.push(`/people/add-user?id=${data.row.original.userId}`)

                            }}>Edit User</DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard requiredPermissions={["delete:users"]}>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </PermissionGuard>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div >);
        },
    }),
];