import { Permission } from "@/actions/auth/auth-permissions";
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function dateFormatter(date: Date | string | undefined): string {
  if (!date) {
    return "-";
  }

  // For anything else
  return `${format(date, "do MMM, yyyy")}`;
}
// Alternative: Return as array of groups
export type PermissionsGroup = {
  resource: string;
  permissions: Permission[];
};

export function groupPermissionsByResource(permissions: Permission[]): PermissionsGroup[] {
  const groupsMap: Record<string, Permission[]> = {};

  permissions.forEach(permission => {
    const resource = permission.resource;

    if (!groupsMap[resource]) {
      groupsMap[resource] = [];
    }

    groupsMap[resource].push({
      ...permission,
      enabled: permission.enabled || false
    });
  });

  return Object.entries(groupsMap).map(([resource, permissions]) => ({
    resource,
    permissions
  }));
}