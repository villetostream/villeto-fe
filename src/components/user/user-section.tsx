"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Notification from "../ui/notification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { navigationItems } from "@/components/dashboard/sidebar/sidebar-constants";

type TimeFrame = "this-week" | "this-month" | "this-year" | "custom";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrame | undefined>(undefined);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(2025, 8, 26)
  ); // Sep 26, 2025
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2025, 9, 13)); // Oct 13, 2025

  // Get current section info
  const currentSection = useMemo(() => getCurrentSection(pathname), [pathname]);

  // Check if we're on an expense detail page
  const isExpenseDetailPage = pathname.match(/^\/expenses\/\d+$/);

  // Auto-open dropdown when modal opens
  useEffect(() => {
    if (isModalOpen && !timeFrame) {
      setIsSelectOpen(true);
    }
  }, [isModalOpen, timeFrame]);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        {isExpenseDetailPage ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-0 text-xl hover:bg-transparent hover:text-primary" // Adjust hover styles as needed
            onClick={() => router.push("/expenses")}
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
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !fromDate && !toDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {fromDate && toDate ? (
            <>
              {format(fromDate, "LLL dd, yyyy")} -{" "}
              {format(toDate, "LLL dd, yyyy")}
            </>
          ) : fromDate ? (
            format(fromDate, "LLL dd, yyyy")
          ) : (
            <span>Pick a date range</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button> */}

        {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-[30%] h-full max-w-none translate-x-0! translate-y-0! top-0! right-0! left-auto! p-6 shadow-lg">
            <DialogHeader className="text-left pb-8 border-b">
              <DialogTitle className="text-xl font-semibold">
                Set Timing
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Adjust your timing to show your entries over a period of time
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="time-frame" className="text-sm font-medium">
                  Time Frame
                </Label>
                <Select
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                  value={timeFrame}
                  onValueChange={(value) => {
                    setTimeFrame(value as TimeFrame);
                    setIsSelectOpen(false);
                  }}
                >
                  <SelectTrigger
                    id="time-frame"
                    className="w-full h-10 text-sm"
                  >
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {timeFrame === "custom" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">From:</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10",
                              !fromDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? (
                              format(fromDate, "LLL dd, yyyy")
                            ) : (
                              <span>Select Date</span>
                            )}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">To:</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10",
                              !toDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? (
                              format(toDate, "LLL dd, yyyy")
                            ) : (
                              <span>Select Date</span>
                            )}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Calendar
                      initialFocus
                      mode="single"
                      defaultMonth={fromDate || new Date()}
                      selected={fromDate}
                      onSelect={setFromDate}
                      className="rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
}
