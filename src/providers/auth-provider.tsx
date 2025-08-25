// providers/auth-provider.tsx
"use client";

import { useAuthStore } from '@/stores/auth-stores';
import { ReactNode, useEffect } from 'react';

interface AuthProviderProps {
    children: ReactNode;
    initialUser?: any;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
    const hydrate = useAuthStore(state => state.hydrate);

    useEffect(() => {
        useAuthStore.setState({
            user: initialUser ?? null,
            isLoading: false,
        });
    }, [initialUser]);

    return <>{children}</>;
}