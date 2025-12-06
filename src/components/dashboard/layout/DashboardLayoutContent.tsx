'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar/DashboardSidebar";
import { PageLoader } from "@/components/PageLoader/PageLoader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSection } from "@/components/user/user-section";
import { useEffect, useState } from "react";
import { useAuthStore, User } from "@/stores/auth-stores";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
    children: React.ReactNode;
    defaultOpen?: boolean;

}

export default function DashboardLayoutContent({
    children,
    defaultOpen = false,
}: DashboardLayoutProps) {
    const [isMounted, setIsMounted] = useState(false);
    const axios = useAxios()
    const { setUserPermissions, login, user, isLoading } = useAuthStore()
    const router = useRouter()
    console.log({ user }, { isLoading })

    useEffect(() => {
        setIsMounted(true);
    }, []);
    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        (async () => {
            try {
                const me = await axios.get("/users/me");
                console.log({ me })
                const { role, ...userData } = me?.data?.data || {};
                //console.log({ me }, { userData })
                if (userData) {


                    // Check if password change is required BEFORE updating the store
                    if (userData.shouldChangePassword) {
                        router.replace("/reset-password");
                        return; // Stop execution here to prevent updating store
                    }

                    login({ ...user, ...userData } as User);
                }

                if (role) {


                    //console.log({ permissions })
                    setUserPermissions(role.permissions);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                // Optionally handle error (e.g., logout, show error)
            }
        })();
    }, [isLoading]);

    if (!isMounted) {
        return (
            <div className="flex h-screen bg-dashboard-background">

                <div className="flex-1 flex flex-col overflow-hidden" />

            </div>
        );
    }

    return (
        <div className="flex bg-dashboard-background h-screen overflow-hidden ">
            <SidebarProvider defaultOpen={defaultOpen}>
                <DashboardSidebar />
                <div className="overflow-hidden flex-1 h-full">
                    <header className="flex items-center  px-6 py-3 border-b border-dashboard-border-shade w-full">


                        <UserSection />

                    </header>


                    <main className="  p-5 overflow-auto h-[calc(100vh-4rem)]">
                        {children}
                    </main>

                </div>
            </SidebarProvider>
        </div>
    );
}