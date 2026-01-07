"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { useAuthStore } from "@/stores/auth-stores";
import { Logout } from "iconsax-reactjs";
import { NavItem, navigationItems } from "./sidebar-constants";
import { useAxios } from "@/hooks/useAxios";

// const bottomItems: NavItem[] = [
//     { icon: HelpCircle, label: "Chat for help", href: "/dashboard/help", permission: PERMISSIONS.VIEW_HELP },
// ];

export function DashboardSidebar() {
  const location = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const axios = useAxios();
  const { state } = useSidebar();

  useEffect(() => {
    // Fetch company logo and name if companyId is available
    const fetchCompanyData = async () => {
      if (user?.companyId) {
        try {
          const response = await axios.get(`/companies/${user.companyId}`);
          // Try different response structures
          const companyData = response?.data?.data || response?.data;

          console.log("Company data response:", { response, companyData });

          if (companyData?.logo) {
            setBusinessLogo(companyData.logo);
          }
          if (companyData?.companyName || companyData?.businessName) {
            setBusinessName(
              companyData.companyName || companyData.businessName
            );
          }
        } catch (error) {
          console.error("Error fetching company data:", error);
          // Try to get company data from user endpoint as fallback
          try {
            const userResponse = await axios.get("/users/me");
            const userData = userResponse?.data?.data || userResponse?.data;
            if (userData?.company) {
              const company = userData.company;
              if (company?.logo) setBusinessLogo(company.logo);
              if (company?.companyName || company?.businessName) {
                setBusinessName(company.companyName || company.businessName);
              }
            }
          } catch (userError) {
            console.error("Error fetching user company data:", userError);
          }
        }
      }
    };
    fetchCompanyData();
  }, [user?.companyId, axios]);

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

  const groupedItems = filteredNavigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const renderMenuItem = (item: NavItem) => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <SidebarMenuItem key={item.label}>
          <Collapsible
            open={expandedMenus.includes(item.label)}
            onOpenChange={() => toggleMenu(item.label)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={isActive(item.href)}
                className="font-normal text-sm text-[#7F7F7F] data-[active=true]:text-dashboard-accent data-[active=true]:bg-sidebar-accent cursor-pointer"
              >
                <span className="[&>svg]:size-5 [&>svg]:shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200",
                    expandedMenus.includes(item.label) && "rotate-90"
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-1 pl-8 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              {item.subItems.map((sub) => (
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
          className="font-normal text-sm text-[#7F7F7F] data-[active=true]:text-dashboard-accent data-[active=true]:bg-sidebar-accent"
        >
          <Link href={item.href}>
            <span className="[&>svg]:size-5 [&>svg]:shrink-0">{item.icon}</span>
            <span>{item.label}</span>
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border  py-5">
        <div className="flex flex-col gap-3">
          {/* Villeto Logo Section */}
          <div
            className={cn(
              "flex items-center gap-2",
              state === "expanded" ? "justify-between" : "justify-center"
            )}
          >
            {state === "expanded" ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-start cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/images/villeto-logo.png"
                    alt="Villeto Logo"
                    width={90}
                    height={28}
                    className="w-full h-auto max-w-[90px] max-h-[28px] object-contain transition-all duration-200"
                    priority
                  />
                </Link>
                <SidebarTrigger className="shrink-0 cursor-pointer" />
              </>
            ) : (
              <SidebarTrigger className="shrink-0 cursor-pointer" />
            )}
          </div>

          {/* Business Logo Section - Circular with business name */}
          <div
            className={cn(
              "flex items-center transition-all duration-200",
              state === "expanded"
                ? "pt-2 border-t border-sidebar-border gap-1 justify-start"
                : "justify-center"
            )}
          >
            {state === "expanded" ? (
              <>
                {/* Circular logo container */}
                <div className="rounded-full bg-white p-1.5 flex items-center justify-center shrink-0 w-12 h-12 aspect-square">
                  {businessLogo ? (
                    <Image
                      src={businessLogo}
                      alt="Business Logo"
                      width={36}
                      height={36}
                      className="w-9 h-9 object-cover rounded-full"
                      unoptimized={
                        businessLogo.startsWith("data:") ||
                        businessLogo.startsWith("http")
                      }
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-dashboard-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-dashboard-accent">
                        {businessName?.charAt(0).toUpperCase() || "B"}
                      </span>
                    </div>
                  )}
                </div>
                {/* Business name */}
                <span className="flex-1 text-sm font-medium text-dashboard-text-primary truncate">
                  {businessName || "Business Name"}
                </span>
                {/* Chevron icon */}
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </>
            ) : (
              /* Collapsed state - just circular logo */
              <div className="rounded-full bg-white p-1.5 flex items-center justify-center shrink-0 w-12 h-12 aspect-square">
                {businessLogo ? (
                  <Image
                    src={businessLogo}
                    alt="Business Logo"
                    width={36}
                    height={36}
                    className="w-9 h-9 object-cover rounded-full"
                    unoptimized={
                      businessLogo.startsWith("data:") ||
                      businessLogo.startsWith("http")
                    }
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-dashboard-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-dashboard-accent">
                      {businessName?.charAt(0).toUpperCase() || "B"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 gap-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <SidebarGroup key={section} className="space-y-1">
            <SidebarGroupLabel className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider px-2">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {items.map((item) => renderMenuItem(item))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
