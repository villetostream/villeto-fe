import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCurrencyConfig } from "@/lib/utils/currency";
import { clearTokenRefresh } from "@/lib/tokenRefreshService";

import type { User, CompanyPermission, AuthorizationSnapshot, CapabilityScopeType, AuthorizationCapabilityGrant } from '@/features/auth/types';
import {
    buildAuthorizationIndexes,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    toPermissionName,
    uniqueCapabilityScopes
} from '@/features/auth/authorization';

export type { User, CompanyPermission, AuthorizationSnapshot, CapabilityScopeType, AuthorizationCapabilityGrant };

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    
    authorization: AuthorizationSnapshot | null;

    /** The flat list of company-level permissions for this user. */
    companyPermissions: CompanyPermission[];

    /**
     * O(1) lookup structures built whenever companyPermissions changes.
     * - _permissionSet: Set of "resource.action" strings for exact matches.
     * - _managedResources: Set of resource strings where action === "manage".
     * Not persisted — rebuilt on rehydration.
     */
    _permissionSet: Set<string>;
    _managedResources: Set<string>;
    
    /**
     * Timestamp of the last time authorization was hydrated or fetched.
     */
    _authorizationHydratedAt: number;

    // ─ Setters ─
    setAccessToken: (token: string) => void;
    login: (data: User) => void;
    logout: () => void;
    hydrate: () => void;

    /**
     * Store companyRole.permissions from the API response.
     * Called after login AND after /users/me refresh.
     */
    setCompanyPermissions: (permissions: CompanyPermission[]) => void;

    /**
     * PRIMARY permission check — the only method you should call for UI gating.
     *
     * @param resource  e.g. "vendor", "expense.report", "procurement.purchase_request"
     * @param action    e.g. "approve", "create", "read_company"
     * @returns true if the user has the given permission; false in all other cases (defensive)
     *
     * @example
     *   const { can } = useAuthStore();
     *   return can('vendor', 'approve'); // true only if user has vendor.approve
     */
    can: (resource: string, action: string) => boolean;
    canAny: (permissions: string[]) => boolean;
    canAll: (permissions: string[]) => boolean;

    /**
     * Checks if the current authorization snapshot is stale based on maxAgeMs.
     */
    isAuthorizationStale: (maxAgeMs: number) => boolean;

    // ─ Utilities ─
    getCurrencySymbol: () => string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

function buildPermissionSets(permissions: CompanyPermission[], authorization: AuthorizationSnapshot | null) {
    const { permissionSet: authSnapshotPermissionSet } = buildAuthorizationIndexes(authorization);
    
    const permissionSet = new Set<string>();
    const managedResources = new Set<string>();
    for (const p of permissions) {
        if (p.action === "manage") {
            managedResources.add(p.resource);
        } else {
            permissionSet.add(`${p.resource}.${p.action}`);
        }
    }
    
    // Add all snapshot permissions
    for (const p of authSnapshotPermissionSet) {
        permissionSet.add(p);
    }
    
    return { _permissionSet: permissionSet, _managedResources: managedResources };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            authorization: null,
            companyPermissions: [],
            _permissionSet: new Set<string>(),
            _managedResources: new Set<string>(),
            _authorizationHydratedAt: 0,
            accessToken: null,

            getCurrencySymbol: () => {
                const countryCode = get().user?.company?.countryOfRegistration ?? "";
                return getCurrencyConfig(countryCode).symbol;
            },

            setAccessToken: (data: string) => {
                set({ accessToken: data });
            },

            setCompanyPermissions: (permissions: CompanyPermission[]) => {
                const list = Array.isArray(permissions) ? permissions : [];
                set({ companyPermissions: list, ...buildPermissionSets(list, get().authorization) });
            },

            login: (data: User) => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("villeto_lastActivityTime", Date.now().toString());
                }
                const authorization = data.authorization ?? null;
                set({ 
                    user: data, 
                    authorization,
                    _authorizationHydratedAt: Date.now(),
                    ...buildPermissionSets(get().companyPermissions, authorization)
                });
            },

            logout: () => {
                clearTokenRefresh(); // cancel any pending proactive refresh
                
                if (typeof window !== "undefined") {
                    try {
                        localStorage.removeItem("villeto_lastActivityTime");
                        for (let i = 0; i < localStorage.length; i++) {
                            const key = localStorage.key(i);
                            if (key && (key.startsWith("line_item_staging:") || key.startsWith("bill_line_item_staging:"))) {
                                localStorage.removeItem(key);
                                i--; // Adjust index since we removed an item
                            }
                        }
                    } catch { /* ignore */ }
                }

                set({
                    user: null,
                    authorization: null,
                    companyPermissions: [],
                    _permissionSet: new Set(),
                    _managedResources: new Set(),
                    _authorizationHydratedAt: 0,
                    accessToken: null,
                });
                sessionStorage.removeItem("auth-storage");
            },

            /**
             * ─── PRIMARY GATE ──────────────────────────────────────────────
             * O(1) lookup via pre-built Sets. Falls back to linear scan only
             * when Sets are empty (e.g. immediately after hydration before
             * setCompanyPermissions is called).
             */
            can: (resource: string, action: string): boolean => {
                const { _permissionSet, _managedResources, companyPermissions } = get();
                // Fast path — O(1)
                if (_permissionSet.size > 0 || _managedResources.size > 0) {
                    return _managedResources.has(resource) || _permissionSet.has(`${resource}.${action}`);
                }
                // Fallback for the brief window before Sets are built (e.g. fresh hydration)
                if (!companyPermissions || companyPermissions.length === 0) return false;
                return companyPermissions.some(
                    p => p.resource === resource && (p.action === action || p.action === "manage")
                );
            },
            
            canAny: (permissions: string[]): boolean => {
                const { _permissionSet } = get();
                return hasAnyPermission(_permissionSet, permissions);
            },
            
            canAll: (permissions: string[]): boolean => {
                const { _permissionSet } = get();
                return hasAllPermissions(_permissionSet, permissions);
            },

            isAuthorizationStale: (maxAgeMs: number): boolean => {
                const { _authorizationHydratedAt } = get();
                if (!_authorizationHydratedAt) return true;
                return Date.now() - _authorizationHydratedAt > maxAgeMs;
            },

            hydrate: () => {
                // Rebuild Sets from persisted companyPermissions after rehydration
                const { companyPermissions, authorization } = get();
                set({ 
                    isLoading: false, 
                    _authorizationHydratedAt: Date.now(),
                    ...buildPermissionSets(companyPermissions ?? [], authorization) 
                });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            // Only persist serialisable fields — Sets are not JSON-serialisable
            partialize: (state) => ({
                user: state.user,
                companyPermissions: state.companyPermissions,
                authorization: state.authorization,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.hydrate();
                }
            },
        }
    )
);

// ─── Selector Hooks ───────────────────────────────────────────────────────────

/**
 * Primary permission hook.
 * @example const canApprove = useCan('vendor', 'approve');
 */
export const useCan = (resource: string, action: string): boolean => {
    return useAuthStore(state => state.can(resource, action));
};

export const useCanPermission = (permission: string): boolean => {
    return useAuthStore(state => state._permissionSet.has(permission));
};

export const useCapabilityScopes = (capabilityKey: string): CapabilityScopeType[] => {
    const authorization = useAuthStore(state => state.authorization);
    if (!authorization) return [];
    const grants = authorization.capabilityGrants.filter(g => g.key === capabilityKey);
    return uniqueCapabilityScopes(grants);
};

/** Returns the user's display role (for labels/badges only — not for logic). */
export const useUserRole = () => {
    return useAuthStore(state => state.user?.companyRole || state.user?.villetoRole);
};
