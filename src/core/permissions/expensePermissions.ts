import { User } from "@/stores/auth-stores";
import { Roles } from "./roles";

/**
 * Checks if a user is authorized to approve a specific expense report.
 * 
 * @param currentUser The currently authenticated user object
 * @param hasPermission A function that checks granular string permissions (e.g. from auth store)
 * @param reportOwnerManagerId The manager ID assigned to the employee who created the report
 * @returns boolean true if authorized, false otherwise
 */
export const canApproveReport = (
  currentUser: User | null,
  hasPermission: (perm: string | string[]) => boolean,
  reportOwnerManagerId?: string
): boolean => {
  if (!currentUser) return false;

  const roleName = currentUser.villetoRole?.name?.toUpperCase() || currentUser.position?.toUpperCase() || "";

  // 1. Super Admins always have bypass rights across the entire system
  if ([Roles.ORGANIZATION_OWNER, Roles.CONTROLLING_OFFICER].includes(roleName as any)) {
    return true;
  }

  // 2. Direct managers with explicit permissions
  // If the user has "company_expenses:write" (or "company_expenses:read" plus some functional equivalent)
  // AND they are the direct manager of the report owner.
  const hasWritePerm = hasPermission("company_expenses:write");
  
  if (hasWritePerm && reportOwnerManagerId && reportOwnerManagerId === currentUser.userId) {
    return true;
  }

  // 3. Finance Admins might also have rights to approve unassigned ones?
  // If required, we can add:
  // if (roleName === Roles.FINANCE_ADMIN && hasWritePerm) return true;

  return false;
};
