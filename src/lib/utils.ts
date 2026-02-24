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

/**
 * Converts a technical permission name like "read:users" or "create:roles"
 * into a plain English label like "View Users" or "Create Roles".
 */
const ACTION_LABELS: Record<string, string> = {
  read: "View",
  create: "Create",
  update: "Edit",
  edit: "Edit",
  delete: "Delete",
  manage: "Manage",
  invite: "Invite",
  export: "Export",
  import: "Import",
  approve: "Approve",
  reject: "Reject",
  archive: "Archive",
  restore: "Restore",
  view: "View",
  send: "Send",
};

export function formatPermissionName(name: string): string {
  if (!name) return name;
  // Handle "action:resource" pattern (e.g. "read:users" → "View Users")
  if (name.includes(":")) {
    const [action, resource] = name.split(":", 2);
    const actionLabel = ACTION_LABELS[action.toLowerCase()] ?? capitalize(action);
    const resourceLabel = capitalize(resource.replace(/[_-]/g, " "));
    return `${actionLabel} ${resourceLabel}`;
  }
  // Handle snake_case or kebab-case permission names
  return name.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}