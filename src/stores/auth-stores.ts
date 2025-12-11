import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { Permission } from '@/actions/auth/auth-permissions';
import { Role } from '@/actions/role/get-all-roles';
import { Department } from '@/actions/departments/get-all-departments';

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
    department?: Department,
    departmentId?: string | null,
    position: string,
    role: Role
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
}


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            userPermissions: [],
            accessToken: null,

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
                const { userPermissions } = get();
                const permissions = Array.isArray(permission) ? permission : [permission];

                return permissions.every(perm =>
                    userPermissions.some(userPerm =>
                        userPerm.name.includes(perm)
                    )
                );
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
    return useAuthStore(state => state.user?.role);
};
