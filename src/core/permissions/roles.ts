/**
 * Centralised role name constants — import from here instead of using raw strings.
 * Replaces all scattered "CONTROLLING_OFFICER", "EMPLOYEE", etc. literals.
 */
export const Roles = {
  EMPLOYEE: "EMPLOYEE",
  MANAGER: "MANAGER",
  FINANCE_ADMIN: "FINANCE_ADMIN",
  ORGANIZATION_OWNER: "ORGANIZATION_OWNER",
  CONTROLLING_OFFICER: "CONTROLLING_OFFICER",
} as const;

export type RoleName = (typeof Roles)[keyof typeof Roles];
