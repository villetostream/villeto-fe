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
    ChevronLeft,
    Inbox,
    LucideLightbulb,
    Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
    {
        icon: Home,
        label: "Dashboard",
        href: "/dashboard",
    },
    { icon: Inbox, label: "Inbox", href: "/dashboard/cards" },
    { icon: LucideLightbulb, label: "Insights", href: "/dashboard/cards" },
    {
        icon: CreditCard,
        label: "Expenses",
        href: "/expenses",
        subItems: [
            { label: "Card transactions", href: "/dashboard/expenses/card-transactions" },
            { label: "Reimbursements", href: "/dashboard/expenses/reimbursements" },
            { label: "Travel", href: "/dashboard/expenses/travel" },
        ],
    },
    { icon: Receipt, label: "Cards", href: "/dashboard/cards" },
    { icon: Users, label: "Spend programs", href: "/dashboard/spend-programs" },
    { icon: Building, label: "Procurement", href: "/dashboard/procurement" },
    { icon: FileText, label: "Bill Pay", href: "/dashboard/bill-pay" },
    { icon: Settings, label: "Accounting", href: "/dashboard/accounting" },
    { icon: Building, label: "Business Account", href: "/dashboard/business-account", badge: "New" },
    { icon: Users, label: "People", href: "/dashboard/people" },
    { icon: Store, label: "Vendors", href: "/dashboard/cards" },
];

const bottomItems = [
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Chat for help", href: "/dashboard/help" },
];

interface DashboardSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function DashboardSidebar({
    isCollapsed = false,
    onToggle,
}: DashboardSidebarProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "bg-dashboard-sidebar border-r border-dashboard-border flex flex-col transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header with toggle */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-dashboard-accent rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-dashboard-text-primary">
                            ExpenseFlow
                        </span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        console.log('Toggling sidebar collapse state from', isSidebarCollapsed, 'to', !isSidebarCollapsed);
                        setIsSidebarCollapsed(!isSidebarCollapsed)
                    }}
                    className="text-dashboard-text-secondary hover:text-dashboard-text-primary"
                >
                    <ChevronLeft
                        className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            isCollapsed && "rotate-180"
                        )}
                    />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navigationItems.map((item, index) => {
                    const isActive =
                        pathname === item.href ||
                        item.subItems?.some((sub) => pathname.startsWith(sub.href));

                    return (
                        <div key={index}>
                            <Link href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-left font-normal group relative",
                                        isActive
                                            ? "bg-dashboard-accent/10 text-dashboard-accent border-l-2 border-dashboard-accent"
                                            : "text-dashboard-text-secondary hover:bg-dashboard-hover hover:text-dashboard-text-primary",
                                        isCollapsed && "justify-center"
                                    )}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <item.icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
                                    {!isCollapsed && item.label}
                                    {item.badge && (
                                        <span className="ml-auto px-2 py-1 text-xs bg-dashboard-accent text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {item.subItems && !isCollapsed && (
                                <div className="ml-7 mt-1 space-y-1">
                                    {item.subItems.map((subItem, subIndex) => {
                                        const subActive = pathname === subItem.href;

                                        return (
                                            <Link href={subItem.href} key={subIndex}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal relative",
                                                        subActive
                                                            ? "bg-dashboard-accent/5 text-dashboard-accent font-medium border-l-2 border-dashboard-accent/50 pl-4"
                                                            : "text-dashboard-text-secondary hover:bg-dashboard-hover hover:text-dashboard-text-primary"
                                                    )}
                                                >
                                                    {subItem.label}

                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 space-y-1 border-t border-dashboard-border">
                {bottomItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link href={item.href} key={index}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full text-left font-normal text-dashboard-text-secondary hover:bg-dashboard-hover hover:text-dashboard-text-primary",
                                    isCollapsed ? "justify-center" : "justify-start",
                                    isActive && "bg-dashboard-accent/10 text-dashboard-accent"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
                                {!isCollapsed && (
                                    <>
                                        {item.label}

                                    </>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
