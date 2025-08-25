import DashboardLayoutContent from "@/components/dashboard/layout/DashboardLayoutContent";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    // In a real app, you would get user data from your auth system (session, JWT, etc.)
    const userRole = "employee"; // This would come from your authentication system

    return (
        <DashboardLayoutContent
            defaultOpen={defaultOpen}
            initialUserRole={userRole}
        >
            {children}
        </DashboardLayoutContent>
    );
}