
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {


    return (
        <div className="flex h-screen bg-dashboard">
            <DashboardSidebar
            />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}