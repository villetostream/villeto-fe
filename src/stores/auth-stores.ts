import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

import { UserRole, Permission, ROLE_PERMISSIONS } from '@/lib/permissions';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
    hydrate: () => void;
}

// Mock users for demonstration
const MOCK_USERS: User[] = [
    { id: '1', name: 'John Owner', email: 'owner@example.com', role: 'owner' },
    { id: '2', name: 'Alice Admin', email: 'admin@example.com', role: 'admin' },
    { id: '3', name: 'Bob Manager', email: 'manager@example.com', role: 'manager' },
    { id: '4', name: 'Eva Auditor', email: 'auditor@example.com', role: 'auditor' },
    { id: '5', name: 'Mike Employee', email: 'employee@example.com', role: 'employee' },
];

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,

            login: async (email: string, password: string): Promise<boolean> => {
                set({ isLoading: true });
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

                    const foundUser = MOCK_USERS.find(u => u.email === email);
                    if (foundUser && password === 'password') {
                        set({ user: foundUser, isLoading: false });
                        return true;
                    }

                    set({ isLoading: false });
                    return false;
                } catch (error) {
                    set({ isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ user: null });
                Cookies.remove('auth-storage'); // ensure middleware won't see stale data
            },

            hasPermission: (permission: Permission): boolean => {
                const { user } = get();
                if (!user) return false;
                return ROLE_PERMISSIONS[user.role].includes(permission);
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
