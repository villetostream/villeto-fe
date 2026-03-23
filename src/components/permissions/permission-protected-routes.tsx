"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, useHasPermission } from "@/stores/auth-stores";

// Higher-Order Component
const withPermissions = (
  WrappedComponent: React.ComponentType,
  requiredPermissions: string[]
) => {
  return function PermissionWrapper(props: any) {
    const router = useRouter();
    const pathName = usePathname();

    const userPermissions = useAuthStore(state => state.getUserPermissions());
    const user = useAuthStore(state => state.user);

    // Helper function to check for permission matches
    const hasPermissionForRoute = (permissions: string[]) => {
      const roleName = user?.villetoRole?.name?.toUpperCase() || user?.position?.toUpperCase() || "";
      if (["OWNER", "CONTROLLING_OFFICER", "ADMIN"].includes(roleName)) {
          return true;
      }

      return permissions?.some((permission) =>
        userPermissions?.some((userPermission) =>
          userPermission.name.includes(permission)
        )
      );
    };

    useEffect(() => {
      if (!hasPermissionForRoute(requiredPermissions)) {
        // router.back();
        router.push(pathName && pathName);
        router.push(`/dashboard`);
      }
    }, [router, pathName, userPermissions, requiredPermissions]);

    if (!hasPermissionForRoute(requiredPermissions)) {
      return null; // Optionally show loading spinner or fallback content here
    }

    return <WrappedComponent {...props} />;
  };
};

export default withPermissions;
