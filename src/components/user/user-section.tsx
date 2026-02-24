"use client";

import { useState, useMemo, useEffect } from "react";
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
    (item) => item.href === "/settings/data-integration",
  );
  if (settingsItem?.subItems && pathname.startsWith("/settings/")) {
    const settingsSubItem = settingsItem.subItems.find((sub) =>
      pathname.startsWith(sub.href),
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

  // Default to Overview
  return {
    label: "Overview",
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
  const [unreadCount, setUnreadCount] = useState(0);

  // Use the date filter store
  const { fromDate, toDate, setFromDate, setToDate, resetDates } =
    useDateFilterStore();

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

  // Reset date UI when route changes away and back to sections
  useEffect(() => {
    // Close any open dropdowns/popovers and reset months
    setIsDropdownOpen(false);
    setIsFromOpen(false);
    setIsToOpen(false);
    setFromMonth(new Date());
    setToMonth(new Date());

    // Do not reset values while on the expenses list to allow user filtering across tabs
    // For all non-expenses routes, reset stored dates so returning shows defaults
    const isExpensesListPageNow = pathname === "/expenses";
    if (!isExpensesListPageNow) {
      resetDates();
    }
  }, [pathname, resetDates]);

  // Get current section info
  const currentSection = useMemo(() => getCurrentSection(pathname), [pathname]);

  // Check if we're on an expense detail page or audit trail page
  const isExpenseDetailPage = pathname.match(/^\/expenses\/\d+$/);
  const isAuditTrailPage = pathname.match(/^\/expenses\/\d+\/audit-trail$/);
  const isSplitExpensePage = pathname.match(/^\/expenses\/\d+\/split-expense$/);
  // Personal expense detail page uses UUID format (reportId), not numeric ID
  const isPersonalExpenseDetailPage = pathname.match(
    /^\/expenses\/personal\/[a-f0-9\-]+$/i,
  );
  // Personal expense edit page
  const isPersonalExpenseEditPage = pathname.match(
    /^\/expenses\/personal\/[a-f0-9\-]+\/edit$/i,
  );
  // Personal expense delete page
  const isPersonalExpenseDeletePage = pathname.match(
    /^\/expenses\/personal\/[a-f0-9\-]+\/delete$/i,
  );
  // Company expense detail page
  const isCompanyExpenseDetailPage = pathname.match(
    /^\/expenses\/company\/[a-f0-9\-]+$/i,
  );
  const isBatchExpensePage = pathname.match(/^\/expenses\/batch\/[^/]+$/);
  const expenseIdFromPath = pathname.match(/\/expenses\/(\d+)/)?.[1];
  // Extract reportId from personal expense detail page (UUID format)
  const reportIdFromPath = pathname.match(
    /\/expenses\/personal\/([a-f0-9\-]+)$/i,
  )?.[1];
  // Extract reportId from company expense detail page (UUID format)
  const companyReportIdFromPath = pathname.match(
    /\/expenses\/company\/([a-f0-9\-]+)$/i,
  )?.[1];
  const isExpensesListPage = pathname === "/expenses";
  const isUploadReceiptPage = pathname === "/expenses/new-expense/upload";
  const isNewExpensePage = pathname === "/expenses/new-expense";
  const isNewReportPage = pathname === "/expenses/new-report";
  const isViewRolePage = pathname.startsWith("/people/view-role/");

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        {isExpenseDetailPage ||
        isAuditTrailPage ||
        isSplitExpensePage ||
        isPersonalExpenseDeletePage ||
        isPersonalExpenseDetailPage ||
        isPersonalExpenseEditPage ||
        isCompanyExpenseDetailPage ||
        isUploadReceiptPage ||
        isNewExpensePage ||
        isNewReportPage ||
        isBatchExpensePage ||
        isViewRolePage ||
        pathname === "/people/invite/leadership" ||
        pathname === "/people/invite/employees" ||
        pathname === "/people/create-role" ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-0 text-xl hover:bg-transparent hover:text-primary  h-auto! py-1! has-[>svg]:px-0!" // Adjust hover styles as needed
            onClick={() => {
              if (isUploadReceiptPage) {
                // Get report name and date from URL params
                const urlParams = new URLSearchParams(window.location.search);
                const reportName = urlParams.get("name") || "";
                const reportDate = urlParams.get("date") || "";

                // Store in sessionStorage to restore in modal
                if (reportName && reportDate) {
                  sessionStorage.setItem("pendingReportName", reportName);
                  sessionStorage.setItem("pendingReportDate", reportDate);
                }

                // Navigate back to expenses page with personal expenses tab active and trigger modal open
                router.push(
                  "/expenses?tab=personal-expenses&openAddReport=true",
                );
                return;
              }
              if (isNewExpensePage) {
                // Get report name and date from URL params
                const urlParams = new URLSearchParams(window.location.search);
                const reportName = urlParams.get("name") || "";
                const reportDate = urlParams.get("date") || "";

                // Navigate back to upload page with same query params to preserve uploaded file
                const params = new URLSearchParams();
                if (reportName) params.set("name", reportName);
                if (reportDate) params.set("date", reportDate);
                router.push(
                  `/expenses/new-expense/upload?${params.toString()}`,
                );
                return;
              }
              if (
                isPersonalExpenseDetailPage ||
                isPersonalExpenseEditPage ||
                isPersonalExpenseDeletePage
              ) {
                const returnTab =
                  sessionStorage.getItem("expensesReturnTab") ||
                  "personal-expenses";
                const returnPage =
                  sessionStorage.getItem("expensesReturnPage") || "1";
                router.push(`/expenses?tab=${returnTab}&page=${returnPage}`);
                return;
              }
              if (isCompanyExpenseDetailPage) {
                // Return to company expenses tab
                const returnTab = "company-expenses";
                router.push(`/expenses?tab=${returnTab}`);
                return;
              }
              if (isBatchExpensePage) {
                // Get preserved state from sessionStorage
                const preservedTab =
                  sessionStorage.getItem("expensesTab") || "company-expenses";
                const preservedFilters =
                  sessionStorage.getItem("expensesFilters");

                // Build URL with preserved state
                const params = new URLSearchParams();
                params.set("tab", preservedTab);
                if (preservedFilters) {
                  try {
                    const filters = JSON.parse(preservedFilters);
                    Object.entries(filters).forEach(([key, value]) => {
                      if (value) params.set(key, String(value));
                    });
                  } catch (e) {
                    // Ignore parse errors
                  }
                }

                router.push(`/expenses?${params.toString()}`);
                return;
              }
              if (isAuditTrailPage || isSplitExpensePage) {
                // Check if we came from batch page or regular detail page
                const previousPage = sessionStorage.getItem(
                  "expensePreviousPage",
                );

                if (previousPage === "batch" && expenseIdFromPath) {
                  // Get the employee slug from the batch page
                  const batchEmployeeSlug =
                    sessionStorage.getItem("batchEmployeeSlug");
                  if (batchEmployeeSlug) {
                    router.push(`/expenses/batch/${batchEmployeeSlug}`);
                    return;
                  }
                }

                // Default: go back to regular detail page
                if (expenseIdFromPath) {
                  router.push(`/expenses/${expenseIdFromPath}`);
                } else {
                  router.push("/expenses");
                }
                return;
              }

              if (isNewReportPage) {
                // Return to expenses list
                const returnTab =
                  sessionStorage.getItem("expensesReturnTab") ||
                  "personal-expenses";
                const returnPage =
                  sessionStorage.getItem("expensesReturnPage") || "1";
                router.push(`/expenses?tab=${returnTab}&page=${returnPage}`);
                return;
              }
              
              // Helper to check if we are on specific invite pages
              if (pathname === "/people/invite/leadership") {
                  router.push("/people");
                  return;
              }
              
              if (pathname === "/people/create-role" || isViewRolePage) {
                  router.push("/people?tab=roles");
                  return;
              }
              
              if (pathname === "/people/invite/employees") {
                  // Check if we have the step param
                  const urlParams = new URLSearchParams(window.location.search);
                  const step = urlParams.get("step");
                  
                  if (step === "preview") {
                      // Go back to upload step (EmployeeInviteFileUpload)
                      router.push("/people/invite/employees?step=upload");
                  } else if (step === "upload") {
                      // Check where the user came from (set by DirectoryTab when clicking Upload Directory)
                      const referrer = sessionStorage.getItem("uploadDirReferrer");
                      sessionStorage.removeItem("uploadDirReferrer");
                      if (referrer === "directory") {
                          router.push("/people?tab=directory");
                      } else {
                          router.push("/people");
                      }
                  } else if (step === "directory") {
                      // Go back to people directory tab
                      router.push("/people?tab=directory");
                  } else {
                      // Default: go back to people page
                      router.push("/people");
                  }
                  return;
              }

              // Default for expense detail page
              router.push("/expenses");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-base">Back</span>{" "}
            {/* Use <span> instead of <p> for inline text */}
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

      <div className="flex items-center gap-5">
        {isExpensesListPage && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "w-60 justify-start text-left font-normal",
                !displayFromDate && !displayToDate && "text-muted-foreground",
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
                              !displayFromDate && "text-muted-foreground",
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
                                      {new Date(2000, i).toLocaleString(
                                        "default",
                                        { month: "short" },
                                      )}
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
                                    const year =
                                      new Date().getFullYear() - 5 + i;
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
                            onSelect={(date: Date | undefined) => {
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
                              !displayToDate && "text-muted-foreground",
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
                                      {new Date(2000, i).toLocaleString(
                                        "default",
                                        { month: "short" },
                                      )}
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
                                    const year =
                                      new Date().getFullYear() - 5 + i;
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
                            onSelect={(date: Date | undefined) => {
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

        <Button variant="ghost" size="icon" className="relative h-4 w-4">
          <Bot className="h-5 w-5" />
          <div className="absolute -top-1 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-4 h-4"
          onClick={() => setIsNotifOpen(true)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-0.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>

        <Dialog open={isNotifOpen} onOpenChange={setIsNotifOpen}>
          <DialogContent className="w-full max-w-120! p-0 rounded-lg">
            <Notification
              onClose={() => setIsNotifOpen(false)}
              onUnreadChange={setUnreadCount}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
