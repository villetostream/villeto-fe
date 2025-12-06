"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const pathname = usePathname();

    const tabs = [
        { name: "My Profile", href: "/settings/my-profile" },
        { name: "Policy Violations", href: "/settings/policy-violations" },
        { name: "Notifications", href: "/settings/notifications" },
        { name: "Data Integration", href: "/settings/data-integration" },
    ];

    // Find the active tab by checking which tab's href matches the beginning of the current path
    const activeTab = tabs.find(tab => pathname === tab.href || pathname.startsWith(`${tab.href}/`));

    return (
        <div className="bg-dashboard-bg">
            <div className="p-6 space-y-6">

                <Tabs value={activeTab?.href || ""}>
                    <TabsList>
                        {tabs.map((tab) => (
                            <Link key={tab.href} href={tab.href}>
                                <TabsTrigger
                                    value={tab.href}
                                    className="data-[state=active]:bg-background rounded-md px-6"
                                >
                                    {tab.name}
                                </TabsTrigger>
                            </Link>
                        ))}
                    </TabsList>

                    {/* You can keep your tab contents if necessary */}
                    {/* <TabsContent value="/settings/my-profile">...</TabsContent> */}

                </Tabs>

                {children}

            </div>
        </div>
    );
}