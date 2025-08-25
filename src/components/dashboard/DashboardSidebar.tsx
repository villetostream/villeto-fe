"use client";

import { cn } from "@/lib/utils";
import {
    Home,
    CreditCard,
    Receipt,
    Settings,
    Users,
    FileText,
    Building,
    HelpCircle,
    Inbox,
    LucideLightbulb,
    Store,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Permission, PERMISSIONS, UserRole } from "@/lib/permissions";

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
    SidebarSeparator
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useAuthStore } from "@/stores/auth-stores";

interface NavItem {
    icon: any;
    label: string;
    href?: string;
    permission?: string;
    subItems?: SubItem[];
    badge?: string;
}

interface SubItem {
    label: string;
    href: string;
    permission: string;
}

const navigationItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/dashboard", permission: PERMISSIONS.VIEW_DASHBOARD },
    { icon: Inbox, label: "Inbox", href: "/dashboard/inbox", permission: PERMISSIONS.VIEW_INBOX },
    { icon: LucideLightbulb, label: "Insights", href: "/dashboard/insights", permission: PERMISSIONS.VIEW_INSIGHTS },
    {
        icon: CreditCard,
        label: "Expenses",
        permission: PERMISSIONS.VIEW_EXPENSES,
        subItems: [
            { label: "Card transactions", href: "/dashboard/expenses/card-transactions", permission: PERMISSIONS.VIEW_CARD_TRANSACTIONS },
            { label: "Reimbursements", href: "/dashboard/expenses/reimbursements", permission: PERMISSIONS.VIEW_REIMBURSEMENTS },
            { label: "Travel", href: "/dashboard/expenses/travel", permission: PERMISSIONS.VIEW_TRAVEL_EXPENSES },
        ],
    },
    { icon: Receipt, label: "Cards", href: "/dashboard/cards", permission: PERMISSIONS.VIEW_CARDS },
    { icon: Users, label: "Spend programs", href: "/dashboard/spend-programs", permission: PERMISSIONS.VIEW_SPEND_PROGRAMS },
    { icon: Building, label: "Procurement", href: "/dashboard/procurement", permission: PERMISSIONS.VIEW_PROCUREMENT },
    { icon: FileText, label: "Bill Pay", href: "/dashboard/bill-pay", permission: PERMISSIONS.VIEW_BILL_PAY },
    { icon: Settings, label: "Accounting", href: "/dashboard/accounting", permission: PERMISSIONS.VIEW_ACCOUNTING },
    { icon: Building, label: "Business Account", href: "/dashboard/business-account", permission: PERMISSIONS.VIEW_BUSINESS_ACCOUNT, badge: "New" },
    { icon: Users, label: "People", href: "/dashboard/people", permission: PERMISSIONS.VIEW_PEOPLE },
    { icon: Store, label: "Vendors", href: "/dashboard/vendors", permission: PERMISSIONS.VIEW_VENDORS },
];

const bottomItems: NavItem[] = [
    {
        icon: Settings,
        label: "Settings",
        permission: PERMISSIONS.VIEW_SETTINGS,
        subItems: [
            { label: "Expense Policy", href: "/dashboard/settings/expense-policy", permission: PERMISSIONS.MANAGE_EXPENSE_POLICY },
            { label: "Company Settings", href: "/dashboard/settings/company-settings", permission: PERMISSIONS.MANAGE_COMPANY_SETTINGS },
            { label: "Entities", href: "/dashboard/settings/entities", permission: PERMISSIONS.MANAGE_ENTITIES },
            { label: "Apps", href: "/dashboard/settings/apps", permission: PERMISSIONS.MANAGE_APPS },
            { label: "Personal Settings", href: "/dashboard/settings/personal-settings", permission: PERMISSIONS.MANAGE_PERSONAL_SETTINGS },
        ],
    },
    { icon: HelpCircle, label: "Chat for help", href: "/dashboard/help", permission: PERMISSIONS.VIEW_HELP },
];

interface DashboardSidebarProps {
    userRole: UserRole;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
    const location = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const user = useAuthStore((state) => state.user);
    const hasPermission = useAuthStore((state) => state.hasPermission);

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (href: string) => location === href;

    const filterItems = (items: NavItem[]): NavItem[] => {
        return items
            .map((item) => {
                if (item.subItems) {
                    const filteredSubs = item.subItems.filter((sub) => hasPermission(sub.permission as Permission));
                    if (!hasPermission(item.permission as Permission) && filteredSubs.length === 0) return null;
                    return { ...item, subItems: filteredSubs };
                } else {
                    if (item.permission && !hasPermission(item.permission as Permission)) return null;
                    return item;
                }
            })
            .filter(Boolean) as NavItem[];
    };

    const filteredNavigationItems = filterItems(navigationItems);
    const filteredBottomItems = filterItems(bottomItems);
    const renderItem = (item: NavItem) => {


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

        return (
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
        );
    };


    return (
        <Sidebar
            collapsible="icon"
            className="py-5"
        >



            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="flex items-center space-x-2 p-4">
                            <CreditCard className="text-dashboard-accent" />
                            <span className="text-xl font-bold">ExpenseFlow</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <Separator />
                <SidebarMenu className="space-y-1">


                    {filteredNavigationItems.map(renderItem)}

                </SidebarMenu>

                <SidebarMenu className="space-y-1 mt-auto">

                    {filteredBottomItems.map(renderItem)}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}