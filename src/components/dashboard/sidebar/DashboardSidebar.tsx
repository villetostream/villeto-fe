"use client";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { useAuthStore } from "@/stores/auth-stores";
import { Logout } from "iconsax-reactjs";
import { NavItem, navigationItems } from "./sidebar-constants";
import { useAxios } from "@/hooks/useAxios";
import { Skeleton } from "@/components/ui/skeleton";
export function DashboardSidebar() {
  const location = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const axios = useAxios();
  const { state } = useSidebar();
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      let fetched = false;
      if (user.companyId) {
        try {
          const response = await axios.get(`/companies/${user.companyId}`);
          const companyData = response?.data?.data || response?.data;
          if (companyData) {
            setBusinessLogo(companyData.logoUrl ?? null);
            setBusinessName(
              companyData.companyName || companyData.businessName || null
            );
            fetched = true;
          }
        } catch (error) {
          console.error("Primary company fetch failed:", error);
        }
      }
      if (!fetched) {
        try {
          const userResponse = await axios.get("/users/me");
          const userData = userResponse?.data?.data || userResponse?.data;
          const company = userData?.company;
          if (company) {
            setBusinessLogo(company.logoUrl ?? null);
            setBusinessName(
              company.companyName || company.businessName || null
            );
          }
        } catch (userError) {
          console.error("Fallback /users/me fetch failed:", userError);
        }
      }
      setLoading(false);
    };
    fetchCompanyData();
  }, [user?.userId, user?.companyId, axios]);
  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location === href;
    }
    return location.startsWith(href);
  };
  const filterItems = (items: NavItem[]): NavItem[] => {
    return items
      .map((item) => {
        if (item.subItems) {
          const filteredSubs = item.subItems.filter((sub) =>
            hasPermission(sub.permission)
          );
          if (!hasPermission(item.permission) && filteredSubs.length === 0)
            return null;
          return { ...item, subItems: filteredSubs };
        } else {
          if (!hasPermission(item.permission)) return null;
          return item;
        }
      })
      .filter(Boolean) as NavItem[];
  };
  const filteredNavigationItems = filterItems(navigationItems);
  const renderLogo = () => {
    if (loading) return <Skeleton className="w-full h-full rounded-full" />;
    if (businessLogo)
      return (
        <Image
          src={businessLogo}
          alt="Business Logo"
          width={36}
          height={36}
          className="w-full h-full object-contain"
          unoptimized={
            businessLogo.startsWith("data:") || businessLogo.startsWith("http")
          }
        />
      );
    return (
      <div className="w-full h-full rounded-full bg-dashboard-accent/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-dashboard-accent">
          {businessName?.charAt(0).toUpperCase() || "B"}
        </span>
      </div>
    );
  };
  const renderCollapsedLogo = () => {
    if (loading) return <Skeleton className="w-10 h-10 rounded-full" />;
    if (businessLogo)
      return (
        <Image
          src={businessLogo}
          alt={businessName || "Business Logo"}
          width={40}
          height={40}
          className="w-10 h-10 object-contain rounded-full"
          unoptimized={
            businessLogo.startsWith("data:") || businessLogo.startsWith("http")
          }
        />
      );
    return (
      <div className="w-10 h-10 rounded-full bg-dashboard-accent/10 flex items-center justify-center shrink-0">
        <span className="text-lg font-semibold text-dashboard-accent">
          {businessName?.charAt(0).toUpperCase() || "B"}
        </span>
      </div>
    );
  };
  const renderMenuItem = (item: NavItem) => {
    const hasExpandable =
      item.label === "Expenses" || (item.subItems && item.subItems.length > 0);
    if (hasExpandable) {
      const isOpen = expandedMenus.includes(item.label);
      return (
        <SidebarMenuItem key={item.label}>
          <Collapsible
            open={isOpen}
            onOpenChange={() => toggleMenu(item.label)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={isActive(item.href)}
                className="font-normal text-sm text-[#7F7F7F] data-[active=true]:text-dashboard-accent data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
                onClick={() => item.href && router.push(item.href)}
              >
                <span className="[&>svg]:size-5 [&>svg]:shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200",
                    isOpen && "rotate-90"
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-1 pl-8">
              {item.subItems?.map((sub) => (
                <SidebarMenuSubButton
                  key={sub.label}
                  asChild
                  isActive={isActive(sub.href!)}
                  className={cn(
                    "text-xs",
                    isActive(sub.href!) &&
                      "bg-sidebar-accent/20 font-medium text-dashboard-accent"
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
          asChild
          isActive={isActive(item.href)}
          tooltip={item.label}
          className="font-normal text-sm text-[#7F7F7F] data-[active=true]:text-dashboard-accent data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
        >
          <Link href={item.href}>
            <span className="[&>svg]:size-5 [&>svg]:shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="w-full border-b border-sidebar-border px-0! pt-4 pb-0!">
        <div className="flex flex-col gap-4">
          {/* Villeto Logo + Toggle */}
          <div
            className={cn(
              "flex items-center",
              state === "expanded" ? "justify-between px-4" : "justify-center"
            )}
          >
            {state === "expanded" ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/images/villeto-logo.png"
                    alt="Villeto Logo"
                    width={90}
                    height={28}
                    className="h-auto max-h-7 object-contain"
                    priority
                  />
                </Link>
                <SidebarTrigger className="shrink-0 cursor-pointer" />
              </>
            ) : (
              <SidebarTrigger className="shrink-0 cursor-pointer" />
            )}
          </div>
          {/* Company Selector */}
          <div
            className={cn(
              "flex items-center transition-all duration-300 border-t border-sidebar-border",
              state === "expanded"
                ? " border-t border-sidebar-border"
                : "justify-center"
            )}
          >
            {state === "expanded" ? (
              <div className="w-full flex items-center bg-muted rounded-lg px-3 my-1 gap-3 h-12">
                <div className=" flex items-center justify-center shrink-0 w-6 h-6 overflow-hidden">
                  {renderLogo()}
                </div>
                <span className="flex-1 text-sm font-medium text-dashboard-text-primary truncate">
                  {loading ? (
                    <Skeleton className="h-5 w-40" />
                  ) : (
                    businessName || "Business Name"
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-6 h-6 my-2">
                {renderCollapsedLogo()}
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu className="space-y-1 px-3">
          {filteredNavigationItems.map((item) => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                logout();
                router.push("/login");
              }}
              tooltip="Log Out"
              className="font-normal text-sm text-[#7F7F7F] hover:text-destructive hover:bg-sidebar-accent"
            >
              <Logout className="size-5" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
