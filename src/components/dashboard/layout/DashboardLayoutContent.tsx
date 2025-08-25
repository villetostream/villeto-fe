'use client';

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { PageLoader } from "@/components/PageLoader/PageLoader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSection } from "@/components/user/user-section";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import { UserRole } from "@/lib/permissions";

interface DashboardLayoutProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
    initialUserRole?: UserRole;
}

export default function DashboardLayoutContent({
    children,
    defaultOpen = false,
    initialUserRole = "employee"
}: DashboardLayoutProps) {
    const [isMounted, setIsMounted] = useState(false);
    const userRole = useAuthStore(state => state.user?.role) || initialUserRole;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex h-screen bg-dashboard-background">

                <div className="flex-1 flex flex-col overflow-hidden" />

            </div>
        );
    }

    return (
        <div className="flex h-screen bg-dashboard-background">
            <SidebarProvider defaultOpen={defaultOpen}>
                <DashboardSidebar userRole={userRole} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="flex items-center justify-between px-6 py-4 border-b border-dashboard-border-shade">
                        <SidebarTrigger />
                        <div className="flex items-center space-x-4">
                            <UserSection />
                        </div>
                    </header>


                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}