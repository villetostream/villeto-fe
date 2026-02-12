"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";

interface FlagExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFlag: (reason: string) => void;
  expenseTitle: string;
  expenseAmount: string;
}

export function FlagExpenseModal({
  open,
  onOpenChange,
  onFlag,
  expenseTitle,
  expenseAmount,
}: FlagExpenseModalProps) {
  const [flagReason, setFlagReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for flagging");
      return;
    }
    setIsLoading(true);
    // Simulate API call with short delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onFlag(flagReason);

    // Show success toast
    setShowSuccessToast(true);

    // Auto-hide modal and reset after showing toast
    setTimeout(() => {
      handleClose();
    }, 4000);
  };

  const handleClose = () => {
    setFlagReason("");
    setShowSuccessToast(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showSuccessToast} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <>
            <DialogHeader>
              <DialogTitle>Flag Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Expense Summary */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-sm text-muted-foreground mb-1">
                  Expense Title
                </p>
                <p className="text-base font-semibold text-foreground mb-4">
                  {expenseTitle}
                </p>
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="text-2xl font-bold text-orange-600">
                  {expenseAmount}
                </p>
              </div>

              {/* Flag Message */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Flag className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-foreground">
                    You are ensuring this expense needs further attention. Please provide a reason.
                  </p>
                </div>
              </div>

              {/* Flag Reason */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Reason for Flagging
                </label>
                <Textarea
                  placeholder="Explain why this expense is being flagged..."
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="min-h-[120px] resize-none focus-visible:ring-orange-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFlag}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Flag Issue"}
                </Button>
              </div>
            </div>
          </>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full">
                  <Flag className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Expense Flagged
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The expense has been flagged for further review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
