import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

import { UserRole, Permission, ROLE_PERMISSIONS } from '@/lib/permissions';

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
    role: string
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    setAccessToken: (token: string) => void;
    login: (data: User) => void;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
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
            login: (data: User) => {
                set({ user: data });
            },

            logout: () => {
                set({ user: null, userPermissions: [], accessToken: null });
                Cookies.remove('auth-storage');
            },

            hasPermission: (permission: Permission): boolean => {
                const { userPermissions } = get();
                return userPermissions.includes(permission);
            },

            hydrate: () => {
                set({ isLoading: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => ({
                getItem: (name) => {
                    if (typeof window === 'undefined') return null;
                    return Cookies.get(name) ?? null;
                },
                setItem: (name, value) => {
                    if (typeof window === 'undefined') return;
                    Cookies.set(name, value, { path: '/' });
                },
                removeItem: (name) => {
                    if (typeof window === 'undefined') return;
                    Cookies.remove(name);
                },
            })),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isLoading = false;
                    // Recalculate permissions on rehydration
                    if (state.user) {
                        state.userPermissions = ROLE_PERMISSIONS[state.user.role as UserRole] || [];
                    }
                }
            },
        }
    )
);

// Optional helpers
export const useHasPermission = (permission: Permission) => {
    return useAuthStore(state => state.hasPermission(permission));
};

export const useUserRole = () => {
    return useAuthStore(state => state.user?.role);
};
