// components/role-badge.tsx
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/permissions";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleColors: Record<UserRole, string> = {
  owner: "bg-purple-100 text-purple-800 border-purple-200",
  admin: "bg-red-100 text-red-800 border-red-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  auditor: "bg-orange-100 text-orange-800 border-orange-200",
  employee: "bg-green-100 text-green-800 border-green-200",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full border",
        roleColors[role],
        className
      )}
    >
      {role}
    </span>
  );
}