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
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useAuthStore } from "@/stores/auth-stores";
import { Menu, Cards, Moneys, Profile2User, WalletMoney, Shop, LampOn, StatusUp, Messages, Setting2, Logout } from 'iconsax-reactjs';
import { Permission } from "@/actions/auth/auth-permissions";

interface NavItem {
    icon: any;
    label: string;
    href: string;
    permission: string[];
    subItems?: SubItem[];
    badge?: string;
    section: string
}

interface SubItem {
    label: string;
    href: string;
    permission: string[];
}

const navigationItems: NavItem[] = [
    { icon: Menu, label: "Dashboard", href: "/dashboard", permission: [], section: "MAIN MENU" },
    {
        icon: Moneys,
        label: "Expenses",
        permission: [],
        href: "/expenses",
        section: "MAIN MENU",
        // subItems: [
        //     { label: "Card transactions", href: "/dashboard/expenses/card-transactions", permission: PERMISSIONS.VIEW_CARD_TRANSACTIONS },
        //     { label: "Reimbursements", href: "/dashboard/expenses/reimbursements", permission: PERMISSIONS.VIEW_REIMBURSEMENTS },
        //     { label: "Travel", href: "/dashboard/expenses/travel", permission: PERMISSIONS.VIEW_TRAVEL_EXPENSES },
        // ],
    },
    { icon: Cards, label: "Cards", href: "/cards", permission: [""], section: "MAIN MENU" },
    { icon: WalletMoney, label: "Accounting", href: "/accounting", permission: [""], section: "MANAGEMENT" },
    { icon: Profile2User, label: "People", href: "/people", permission: ["read:users", "read:roles", "read:departments"], section: "MANAGEMENT" },
    { icon: Shop, label: "Vendors", href: "/vendors", permission: [""], section: "MANAGEMENT" },
    { icon: LampOn, label: "Insights", href: "/insights", permission: [], section: "ANALYTICS" },
    { icon: StatusUp, label: "Analytics", href: "/insights", permission: [], section: "ANALYTICS" },
    // { icon: Users, label: "Spend programs", href: "/dashboard/spend-programs", permission: PERMISSIONS.VIEW_SPEND_PROGRAMS },
    // { icon: Building, label: "Procurement", href: "/dashboard/procurement", permission: PERMISSIONS.VIEW_PROCUREMENT },
    // { icon: FileText, label: "Bill Pay", href: "/dashboard/bill-pay", permission: PERMISSIONS.VIEW_BILL_PAY },
    { icon: Messages, label: "Inbox", href: "/inbox", permission: [], section: "OTHERS" },
    {
        icon: Setting2,
        label: "Settings",
        href: "/settings",
        permission: [],
        section: "OTHERS",
        subItems: [
            { label: "Expense Policy", href: "/settings/expense-policy", permission: [""] },
            { label: "Company Settings", href: "/settings/company-settings", permission: [""] },
            { label: "Entities", href: "/settings/entities", permission: [""] },
            { label: "Apps", href: "/settings/apps", permission: [""] },
            { label: "Personal Settings", href: "/settings/personal-settings", permission: [""] },
        ],
    },
    // { icon: Building, label: "Business Account", href: "/dashboard/business-account", permission: PERMISSIONS.VIEW_BUSINESS_ACCOUNT, badge: "New" },
];

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

    const isActive = (href: string) => location === href;
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
            <SidebarHeader className="border-b border-sidebar-border py-4">
                <div className="flex items-center  justify-end gap-2 px-2">

                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                {Object.entries(groupedItems).map(([section, items]) => (
                    <SidebarGroup key={section}>
                        <SidebarGroupLabel className="text-[#7F7F7F] font-medium text-base mb-1">{section}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => {
                                    const isActive = location === item.href;

                                    return <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className="font-normal text-sm text-[#7F7F7F]"
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
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