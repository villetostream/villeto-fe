
import { Menu, Cards, MoneySend, Profile2User, WalletMoney, Shop, LampOn, StatusUp, Messages, Setting2, Logout, DocumentText } from 'iconsax-reactjs';
import { Permission } from "@/actions/auth/auth-permissions";
import { Home09Icon, InvoiceIcon, MoneySendSquareFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export interface NavItem {
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

export const navigationItems: NavItem[] = [
    { icon: <HugeiconsIcon icon={Home09Icon} />, label: "Dashboard", href: "/dashboard", permission: [], section: "MAIN MENU" },
    {
        icon: <HugeiconsIcon icon={MoneySendSquareFreeIcons} />,
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
    { icon: <Cards />, label: "Cards", href: "/cards", permission: [""], section: "MAIN MENU" },
    // { icon: <WalletMoney />, label: "Accounting", href: "/accounting", permission: [""], section: "MANAGEMENT" },
    { icon: <Profile2User />, label: "People", href: "/people", permission: ["read:users", "read:roles", "read:departments"], section: "MANAGEMENT" },
    { icon: <DocumentText />, label: "Policies", href: "/spend-programs", permission: [""], section: "MANAGEMENT" },
    // { icon: Building, label: "Procurement", href: "/dashboard/procurement", permission: PERMISSIONS.VIEW_PROCUREMENT },
    { icon: <HugeiconsIcon icon={InvoiceIcon} />, label: "Bill Pay", href: "/bill-pay", permission: [""], section: "MANAGEMENT" },
    { icon: <Shop />, label: "Vendors", href: "/vendors", permission: [""], section: "MANAGEMENT" },
    { icon: <LampOn />, label: "Insights", href: "/insights", permission: [], section: "ANALYTICS" },
    { icon: <StatusUp />, label: "Analytics", href: "/insights", permission: [], section: "ANALYTICS" },
    { icon: <Messages />, label: "Inbox", href: "/inbox", permission: [], section: "OTHERS" },
    {
        icon: <Setting2 />,
        label: "Settings",
        href: "/settings/data-integration",
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