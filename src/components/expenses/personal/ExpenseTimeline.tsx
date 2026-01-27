"use client";

import React, { useEffect, useState } from "react";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
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
  submissionDate: string;
}

interface User {
  firstName: string;
  lastName: string;
}

const getTimelineEntries = (
  status: PersonalExpenseStatus,
  user: User | null,
  submissionDate: string,
): TimelineEntry[] => {
  const userName = user ? `${user.firstName} ${user.lastName}` : "...";

  switch (status) {
    case "draft":
      // Draft timeline - only shows creation
      return [
        {
          stage: "Created",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-gray-300",
          isActive: true,
        },
      ];

    case "pending":
      // Pending timeline - created and submitted
      return [
        {
          stage: "Created",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-gray-300",
          isActive: true,
        },
        {
          stage: "Submitted for Approval",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "Awaiting Manager Review",
          timestamp: "Pending",
          color: "bg-yellow-500",
          isActive: false,
        },
      ];

    case "approved":
      // Approved timeline - full approval chain
      return [
        {
          stage: "Created",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-gray-300",
          isActive: true,
        },
        {
          stage: "Submitted for Approval",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "Manager Review Completed",
          timestamp: "Pending",
          color: "bg-yellow-500",
          isActive: true,
        },
        {
          stage: "Expense Approved",
          user: "By Controlling Officer",
          timestamp: "Pending",
          color: "bg-green-600",
          isActive: true,
        },
      ];

    case "paid":
      // Paid timeline - complete workflow
      return [
        {
          stage: "Created",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-gray-300",
          isActive: true,
        },
        {
          stage: "Submitted for Approval",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "Manager Review Completed",
          timestamp: "Pending",
          color: "bg-yellow-500",
          isActive: true,
        },
        {
          stage: "Expense Approved",
          user: "By Controlling Officer",
          timestamp: "Pending",
          color: "bg-green-600",
          isActive: true,
        },
        {
          stage: "Reimbursement Processing",
          user: "By Finance Department",
          timestamp: "Pending",
          color: "bg-indigo-500",
          isActive: true,
        },
        {
          stage: "Paid",
          user: "Payment Completed",
          timestamp: "Pending",
          color: "bg-[#38B2AC]",
          isActive: true,
        },
      ];

    case "rejected":
    case "declined":
      // Rejected/Declined timeline - stops at rejection
      return [
        {
          stage: "Created",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-gray-300",
          isActive: true,
        },
        {
          stage: "Submitted for Approval",
          user: `By ${userName}`,
          timestamp: submissionDate,
          color: "bg-orange-500",
          isActive: true,
        },
        {
          stage: "Under Review",
          user: "Manager Review Completed",
          timestamp: "Pending",
          color: "bg-yellow-500",
          isActive: true,
        },
        {
          stage: "Expense Rejected",
          user: "By Controlling Officer",
          timestamp: "Pending",
          color: "bg-red-500",
          isActive: true,
        },
      ];
  }
};

export function ExpenseTimeline({
  status,
  submissionDate,
}: ExpenseTimelineProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          data: User;
        }>(API_KEYS.USER.ME);
        setUser(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [axios]);

  const entries = getTimelineEntries(status, user, submissionDate);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Expense Timeline
      </h2>
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
