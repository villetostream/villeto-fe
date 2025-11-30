
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Edit2 } from "iconsax-reactjs";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dateFormatter } from "@/lib/utils";
import Link from "next/link";
import { STATE_KEYS } from "@/lib/constants/state_key";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDepartmentHook } from "@/hooks/people/dept/dept-hook";
import SuccessModal from "@/components/modals/SuccessModal";
import { Role } from "@/actions/role/get-all-roles";
import { useRoleHook } from "@/hooks/people/role/role-hook";
import PermissionGuard from "@/components/permissions/permission-protected-components";

const columnHelper = createColumnHelper<Role>();

export const columns: ColumnDef<Role, any>[] = [
    columnHelper.accessor("name", {
        header: "ROLE",
        cell: (info) => <p className="capitalize">{`${info.getValue() || "-"}`}</p>,
    }),


    columnHelper.accessor("description", {
        header: "DESCRIPTION",
        cell: (info) => {
            return <p className=" max-w-48 text-ellipsis line-clamp-1">{`${info.getValue() || "-"}`}</p>;
        },
    }),
    columnHelper.accessor("totalAssignedUsers", {
        header: "USER ASSIGNED",
        cell: (info) => <p className="capitalize">{`${info.getValue() || "0"}`}</p>,
    }),
    columnHelper.accessor("createdBy", {
        header: "CREATED BY",
        cell: (info) => <p className="capitalize">{`${info.getValue()?.firstName || ""} ${info.getValue()?.lastName || "DEFAULT"}`}</p>,
    }),
    columnHelper.accessor("createdAt", {
        header: "Date ",
        cell: (info) => {
            return <p className="capitalize">{`${dateFormatter(info.getValue()) || "-"}`}</p>;
        },
    }),
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
                <PermissionGuard requiredPermissions={["update:roles"]}>

                    < Button variant="ghost" size="icon" className="h-8 w-8" >
                        <Link href={`/people/create-role?id=${data.row.original.roleId}`}>
                            <Edit2 className="w-4 h-4" />
                        </Link>
                    </Button >
                </PermissionGuard>
                <PermissionGuard requiredPermissions={["delete:roles"]} >

                    <Button variant="ghost" disabled={data.row.original.createdBy == null} size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => {
                        setSelected(data.row.original);
                        setState(STATE_KEYS.DELETE);
                    }}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </PermissionGuard>
            </div >);
        },
    }),
];