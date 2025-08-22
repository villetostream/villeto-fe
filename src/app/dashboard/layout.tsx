
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ReactNode, unstable_ViewTransition as ViewTransition } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {


    return (
        <div className="flex h-screen bg-dashboard">
            <DashboardSidebar
            />
            <ViewTransition>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </ViewTransition>
        </div>
    );
}