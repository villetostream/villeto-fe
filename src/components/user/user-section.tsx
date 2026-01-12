"use client";

import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Bell,
  Bot,
  Calendar as CalendarIcon,
  ChevronDown,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import Notification from "../ui/notification";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { navigationItems } from "@/components/dashboard/sidebar/sidebar-constants";
import { useDateFilterStore } from "@/stores/useDateFilterStore";

// Get current section info based on pathname
function getCurrentSection(pathname: string): {
  label: string;
  icon: React.ReactNode;
} {
  // Check for exact matches first (especially for dashboard)
  const exactMatch = navigationItems.find((item) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return item.href === pathname;
  });

  if (exactMatch) {
    return {
      label: exactMatch.label,
      icon: exactMatch.icon,
    };
  }

  // Check for settings sub-items first (before general prefix matching)
  const settingsItem = navigationItems.find(
    (item) => item.href === "/settings/data-integration"
  );
  if (settingsItem?.subItems && pathname.startsWith("/settings/")) {
    const settingsSubItem = settingsItem.subItems.find((sub) =>
      pathname.startsWith(sub.href)
    );
    if (settingsSubItem) {
      return {
        label: settingsSubItem.label,
        icon: settingsItem.icon,
      };
    }
    // If it's a settings route but not a sub-item, return Settings
    if (pathname.startsWith("/settings")) {
      return {
        label: settingsItem.label,
        icon: settingsItem.icon,
      };
    }
  }

  // Check for pathname starts with (for nested routes)
  const prefixMatch = navigationItems
    .filter((item) => item.href !== "/dashboard") // Exclude dashboard from prefix matching
    .find((item) => pathname.startsWith(item.href));

  if (prefixMatch) {
    return {
      label: prefixMatch.label,
      icon: prefixMatch.icon,
    };
  }

  // Default to Dashboard
  return {
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
  };
}

export function UserSection() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromMonth, setFromMonth] = useState<Date>(new Date());
  const [toMonth, setToMonth] = useState<Date>(new Date());

  // Use the date filter store
  const { fromDate, toDate, setFromDate, setToDate } = useDateFilterStore();

  // Initialize with 30-day default range if not already set
  const getInitialDates = () => {
    if (!fromDate && !toDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return { from: thirtyDaysAgo, to: today };
    }
    return { from: fromDate, to: toDate };
  };

  const { from: displayFromDate, to: displayToDate } = getInitialDates();

  // Get current section info
  const currentSection = useMemo(() => getCurrentSection(pathname), [pathname]);

  // Check if we're on an expense detail page or audit trail page
  const isExpenseDetailPage = pathname.match(/^\/expenses\/\d+$/);
  const isAuditTrailPage = pathname.match(/^\/expenses\/\d+\/audit-trail$/);
  const expenseIdFromPath = pathname.match(/\/expenses\/(\d+)/)?.[1];
  const isExpensesListPage = pathname === "/expenses";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        {isExpenseDetailPage || isAuditTrailPage ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-0 text-xl hover:bg-transparent hover:text-primary" // Adjust hover styles as needed
            onClick={() => {
              if (isAuditTrailPage && expenseIdFromPath) {
                router.push(`/expenses/${expenseIdFromPath}`);
              } else {
                router.push("/expenses");
              }
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span> {/* Use <span> instead of <p> for inline text */}
          </Button>
        ) : (
          <>
            <div className="text-muted-foreground [&>svg]:w-5 [&>svg]:h-5">
              {currentSection.icon}
            </div>
            <h1 className="text-2xl font-bold">{currentSection.label}</h1>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isExpensesListPage && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "w-60 justify-start text-left font-normal",
                !displayFromDate && !displayToDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayFromDate && displayToDate ? (
                <>
                  {format(displayFromDate, "MMM dd, yyyy")} -{" "}
                  {format(displayToDate, "MMM dd, yyyy")}
                </>
              ) : displayFromDate ? (
                format(displayFromDate, "MMM dd, yyyy")
              ) : (
                <span>Pick a date range</span>
              )}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>

            {/* Modern Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Filter by Date Range
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* From Date */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">From</Label>
                      <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10 text-sm",
                              !displayFromDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {displayFromDate ? (
                              format(displayFromDate, "MMM dd, yyyy")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="space-y-2 p-3">
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-between mb-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const prev = new Date(fromMonth);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setFromMonth(prev);
                                }}
                              >
                                ←
                              </Button>
                              <div className="flex gap-2">
                                <select
                                  aria-label="Select month"
                                  value={fromMonth.getMonth()}
                                  onChange={(e) => {
                                    const newDate = new Date(fromMonth);
                                    newDate.setMonth(Number(e.target.value));
                                    setFromMonth(newDate);
                                  }}
                                  className="border rounded px-2 py-1 text-sm"
                                >
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>
                                      {new Date(2000, i).toLocaleString("default", { month: "short" })}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  aria-label="Select year"
                                  value={fromMonth.getFullYear()}
                                  onChange={(e) => {
                                    const newDate = new Date(fromMonth);
                                    newDate.setFullYear(Number(e.target.value));
                                    setFromMonth(newDate);
                                  }}
                                  className="border rounded px-2 py-1 text-sm"
                                >
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - 5 + i;
                                    return (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const next = new Date(fromMonth);
                                  next.setMonth(next.getMonth() + 1);
                                  setFromMonth(next);
                                }}
                              >
                                →
                              </Button>
                            </div>
                          </div>
                          <Calendar
                            mode="single"
                            selected={displayFromDate}
                            onSelect={(date) => {
                              if (date) {
                                setFromDate(date);
                                setIsFromOpen(false);
                              }
                            }}
                            month={fromMonth}
                            onMonthChange={setFromMonth}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* To Date */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">To</Label>
                      <Popover open={isToOpen} onOpenChange={setIsToOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10 text-sm",
                              !displayToDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {displayToDate ? (
                              format(displayToDate, "MMM dd, yyyy")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="space-y-2 p-3">
                            {/* Month/Year Navigation */}
                            <div className="flex items-center justify-between mb-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const prev = new Date(toMonth);
                                  prev.setMonth(prev.getMonth() - 1);
                                  setToMonth(prev);
                                }}
                              >
                                ←
                              </Button>
                              <div className="flex gap-2">
                                <select
                                  aria-label="Select month"
                                  value={toMonth.getMonth()}
                                  onChange={(e) => {
                                    const newDate = new Date(toMonth);
                                    newDate.setMonth(Number(e.target.value));
                                    setToMonth(newDate);
                                  }}
                                  className="border rounded px-2 py-1 text-sm"
                                >
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>
                                      {new Date(2000, i).toLocaleString("default", { month: "short" })}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  aria-label="Select year"
                                  value={toMonth.getFullYear()}
                                  onChange={(e) => {
                                    const newDate = new Date(toMonth);
                                    newDate.setFullYear(Number(e.target.value));
                                    setToMonth(newDate);
                                  }}
                                  className="border rounded px-2 py-1 text-sm"
                                >
                                  {Array.from({ length: 10 }, (_, i) => {
                                    const year = new Date().getFullYear() - 5 + i;
                                    return (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const next = new Date(toMonth);
                                  next.setMonth(next.getMonth() + 1);
                                  setToMonth(next);
                                }}
                              >
                                →
                              </Button>
                            </div>
                          </div>
                          <Calendar
                            mode="single"
                            selected={displayToDate}
                            onSelect={(date) => {
                              if (date) {
                                setToDate(date);
                                setIsToOpen(false);
                              }
                            }}
                            month={toMonth}
                            onMonthChange={setToMonth}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setFromDate(undefined);
                        setToDate(undefined);
                        setIsDropdownOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bot className="w-5 h-5 text-purple-600" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsNotifOpen(true)}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
          <DialogContent className="w-full max-w-120! p-0 rounded-lg">
            <Notification onClose={() => setIsNotifOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
