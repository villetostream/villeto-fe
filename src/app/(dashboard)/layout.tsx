import DashboardLayoutContent from "@/components/dashboard/layout/DashboardLayoutContent";
import QueryProvider from "@/providers/queryClientProvider";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    // In a real app, you would get user data from your auth system (session, JWT, etc.)


    return (
        <DashboardLayoutContent
            defaultOpen={defaultOpen}
        >
            <QueryProvider>

                {children}
            </QueryProvider>
        </DashboardLayoutContent>
    );
}