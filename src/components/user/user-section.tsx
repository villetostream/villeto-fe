"use client";

import { useAuthStore } from "@/stores/auth-stores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function UserSection() {
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // prevents SSR/client mismatch

    return user ? (
        <>
            <span className="text-sm text-dashboard-text-secondary hidden sm:block">
                {user.name}
            </span>
            <div className="px-3 py-1 bg-muted rounded-full text-sm capitalize">
                {user.role}
            </div>
            <button onClick={() => { logout(); router.refresh() }}>Logout</button>
        </>
    ) : null;
}
