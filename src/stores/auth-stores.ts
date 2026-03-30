import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { Permission } from '@/actions/auth/auth-permissions';
import { Role } from '@/actions/role/get-all-roles';
import { Department } from '@/actions/departments/get-all-departments';
import { getCurrencyConfig } from "@/lib/utils/currency";
import { Roles } from "@/core/permissions/roles";

export interface User {
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
    userId: string,
    firstName: string,
    lastName: number,
    email: string,
    loginCount: number,
    isActive: boolean,
    phone?: string | number,
    ownershipPercentage?: number,
    companyId?: string,
    company?: {
        countryOfRegistration?: string;
        [key: string]: any;
    },
    department?: Department,
    departmentId?: string | null,
    position: string,
    villetoRole?: Role
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    setAccessToken: (token: string) => void;
    setUserPermissions: (token: Permission[]) => void;
    login: (data: User) => void;
    logout: () => void;
    hasPermission: (permission: string | string[]) => boolean;
    hydrate: () => void;
    userPermissions: Permission[];
    getUserPermissions: () => Permission[];
    getCurrencySymbol: () => string;
}


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            userPermissions: [],
            accessToken: null,

            getCurrencySymbol: () => {
                const countryCode = get().user?.company?.countryOfRegistration ?? "";
                return getCurrencyConfig(countryCode).symbol;
            },

            getUserPermissions: () => {
                const state = get();
                return state.userPermissions; // Now returns cached array
            },
            setAccessToken: (data: string) => {
                set({ accessToken: data });
            },
            setUserPermissions: (data: Permission[]) => {
                set({ userPermissions: data });
            },
            login: (data: User) => {

                set({ user: data });
            },

            logout: () => {
                set({ user: null, userPermissions: [], accessToken: null });
                Cookies.remove('auth-storage');
            },

            hasPermission: (permission: string | string[]): boolean => {
                const { userPermissions, user } = get();
                const roleName = user?.villetoRole?.name?.toUpperCase() || user?.position?.toUpperCase() || "";
                
                // Allow bypass for super roles
                if ([Roles.ORGANIZATION_OWNER, Roles.CONTROLLING_OFFICER, "ADMIN", "OWNER"].includes(roleName as any)) {
                    return true;
                }

                const permissions = Array.isArray(permission) ? permission : [permission];

                return permissions.every(perm => {
                    if (!perm || perm.trim() === "") return true;
                    return userPermissions.some(userPerm =>
                        userPerm.name.includes(perm)
                    );
                });
            },

            hydrate: () => {
                set({ isLoading: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.hydrate();
                    // // Recalculate permissions on rehydration
                    // if (state.user) {
                    //     state.userPermissions = [];
                    // }
                }
            },
        }
    )
);

// Optional helpers
export const useHasPermission = (permission: string) => {
    return useAuthStore(state => state.hasPermission(permission));
};

export const useUserRole = () => {
    return useAuthStore(state => state.user?.villetoRole);
};
