// providers/auth-provider.tsx
"use client";

import { useAuthStore, type User } from '@/stores/auth-stores';
import { parseAuthorizationSnapshot } from '@/features/auth/authorization';
import { ReactNode, useEffect } from 'react';

interface AuthProviderProps {
    children: ReactNode;
    initialUser?: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
    useEffect(() => {
        if (initialUser) {
            initialUser.authorization = initialUser.authorization 
                ? parseAuthorizationSnapshot(initialUser.authorization) 
                : undefined;
            useAuthStore.getState().login(initialUser);
        }
        
        useAuthStore.setState({
            isLoading: false,
        });
    }, [initialUser]);

    return <>{children}</>;
}