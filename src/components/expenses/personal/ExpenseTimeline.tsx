"use client";

import type { PersonalExpenseStatus } from "@/components/expenses/table/personalColumns";

interface TimelineEntry {
  stage: string;
  user: string;
  timestamp: string;
  color: string;
  isActive: boolean;
}

interface ExpenseTimelineProps {
  status: PersonalExpenseStatus;
}

const getTimelineEntries = (status: PersonalExpenseStatus): TimelineEntry[] => {
  const baseEntries: TimelineEntry[] = [
    {
      stage: "Created",
      user: "By Goodness Swift",
      timestamp: "09-10-2025 07:07 PM",
      color: "bg-gray-300",
      isActive: true,
    },
  ];

  switch (status) {
    case "draft":
      return baseEntries;

    case "pending":
      return [
        ...baseEntries,
        {
          stage: "Submitted for Approval",
          user: "By Goodness Swift",
          timestamp: "09-10-2025 07:30 PM",
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "By Larry Ola (Manager)",
          timestamp: "10-10-2025 07:00 AM",
          color: "bg-yellow-500",
          isActive: true,
        },
      ];

    case "approved":
      return [
        ...baseEntries,
        {
          stage: "Submitted for Approval",
          user: "By Goodness Swift",
          timestamp: "09-10-2025 07:30 PM",
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "By Larry Ola (Manager)",
          timestamp: "10-10-2025 07:00 AM",
          color: "bg-yellow-500",
          isActive: true,
        },
        {
          stage: "Expense Approved",
          user: "By Pelumi Yemi (CO)",
          timestamp: "12-10-2025 05:00 PM",
          color: "bg-green-600",
          isActive: true,
        },
      ];

    case "paid":
      return [
        ...baseEntries,
        {
          stage: "Submitted for Approval",
          user: "By Goodness Swift",
          timestamp: "09-10-2025 07:30 PM",
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "By Larry Ola (Manager)",
          timestamp: "10-10-2025 07:00 AM",
          color: "bg-yellow-500",
          isActive: true,
        },
        {
          stage: "Expense Approved",
          user: "By Pelumi Yemi (CO)",
          timestamp: "12-10-2025 05:00 PM",
          color: "bg-green-600",
          isActive: true,
        },
        {
          stage: "Reimbursement Processing",
          user: "By Elizabeth Ola (Finance Head)",
          timestamp: "12-10-2025 07:00 PM",
          color: "bg-indigo-500",
          isActive: true,
        },
        {
          stage: "Paid",
          user: "By Finance",
          timestamp: "13-10-2025 07:20 AM",
          color: "bg-[#38B2AC]",
          isActive: true,
        },
      ];

    case "rejected":
    case "declined":
      return [
        ...baseEntries,
        {
          stage: "Submitted for Approval",
          user: "By Goodness Swift",
          timestamp: "09-10-2025 07:30 PM",
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "By Larry Ola (Manager)",
          timestamp: "10-10-2025 07:00 AM",
          color: "bg-yellow-500",
          isActive: true,
        },
        {
          stage: "Expense Rejected",
          user: "By Pelumi Yemi (CO)",
          timestamp: "12-10-2025 05:00 PM",
          color: "bg-red-500",
          isActive: true,
        },
      ];

    default:
      return baseEntries;
  }
};

export function ExpenseTimeline({ status }: ExpenseTimelineProps) {
  const entries = getTimelineEntries(status);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Expense Timeline</h2>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline Entries */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full ${entry.color} flex items-center justify-center shrink-0`}
              >
                {entry.isActive && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.stage}
                </p>
                <p className="text-sm text-muted-foreground">{entry.user}</p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {entry.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
