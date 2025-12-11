"use client";

import { cn } from "@/lib/utils";
import {
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// Shadcn components
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { useAuthStore } from "@/stores/auth-stores";
import { Logout } from "iconsax-reactjs";
import { NavItem, navigationItems } from "./sidebar-constants";



// const bottomItems: NavItem[] = [
//     { icon: HelpCircle, label: "Chat for help", href: "/dashboard/help", permission: PERMISSIONS.VIEW_HELP },
// ];





export function DashboardSidebar() {
    const location = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const logout = useAuthStore((state) => state.logout);
    const hasPermission = useAuthStore((state) => state.hasPermission);
    const router = useRouter()

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (href: string) => location === href || location.startsWith(href);
    console.log({ location })
    let currentSection = "";

    const filterItems = (items: NavItem[]): NavItem[] => {
        return items
            .map((item) => {
                if (item.subItems) {
                    const filteredSubs = item.subItems.filter((sub) => hasPermission(sub.permission));
                    if (!hasPermission(item.permission) && filteredSubs.length === 0) return null;
                    return { ...item, subItems: filteredSubs };
                } else {
                    if (!hasPermission(item.permission)) return null;
                    return item;
                }
            })
            .filter(Boolean) as NavItem[];
    };

    const filteredNavigationItems = filterItems(navigationItems);
    // const filteredBottomItems = filterItems(bottomItems);
    const renderItem = (item: NavItem) => {
        const showSection = currentSection !== item.section;
        if (showSection) currentSection = item.section;

        if (item.subItems) {


            return (
                <SidebarMenuItem key={item.label}>
                    <Collapsible
                        open={expandedMenus.includes(item.label)}
                        onOpenChange={() => toggleMenu(item.label)}
                    >
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                tooltip={item.label}
                                className="py-3"
                            >
                                <item.icon className="text-dashboard-ac" />
                                {item.label}
                                <ChevronRight className={cn(
                                    "ml-auto h-4 w-4 transition-transform duration-200",
                                    expandedMenus.includes(item.label) && "rotate-90",
                                )} />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-1 space-y-1 pl-8">
                            {item.subItems.map(sub => (
                                <SidebarMenuSubButton
                                    key={sub.label}
                                    asChild
                                    className={cn(
                                        isActive(sub.href!) ? "bg-accent/20 font-medium" : "hover:bg-muted",
                                    )}
                                >
                                    <Link href={sub.href!}>{sub.label}</Link>
                                </SidebarMenuSubButton>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarMenuItem>
            );
        }

        if (!item.href) return null;

        return (<>
            {showSection && (
                <div className="text-xs font-semibold text-muted-foreground mb-3 px-3">
                    {item.section}
                </div>
            )}
            <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    isActive={isActive(item.href)}
                    asChild
                    tooltip={item.label}

                >
                    <Link href={item.href} className="p-2">
                        <item.icon className="text-dashboard-accent" />
                        {item.label}
                        {item.badge && (
                            <Badge variant="default" className="ml-auto">
                                {item.badge}
                            </Badge>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </>
        );
    };
    const groupedItems = filteredNavigationItems.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, typeof navigationItems>);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border py-1.5">
                <div className="flex items-center  justify-between gap-2 px-2">
                    <div>
                        <img src="/images/logo.png" className='h-12 aspect-video object-cover' />
                    </div>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2.5 gap-0">
                {Object.entries(groupedItems).map(([section, items]) => (

                    <SidebarMenu className="gap-1">
                        {items.map((item) => {


                            return <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.href)}
                                    tooltip={item.label}
                                    className="font-normal text-sm text-[#7F7F7F]"
                                >
                                    <Link href={item.href}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        })}
                    </SidebarMenu>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => {
                            logout()
                            router.push("/login")
                        }} tooltip="Log Out">
                            <Logout />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}