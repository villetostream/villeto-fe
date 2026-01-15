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
import { CheckCircle } from "lucide-react";

interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (note: string) => void;
  expenseTitle: string;
  expenseAmount: string;
}

export function ApprovalModal({
  open,
  onOpenChange,
  onApprove,
  expenseTitle,
  expenseAmount,
}: ApprovalModalProps) {
  const [approvalNote, setApprovalNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    // Simulate API call with short delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onApprove(approvalNote);

    // Show success toast
    setShowSuccessToast(true);

    // Auto-hide modal and reset after showing toast
    setTimeout(() => {
      handleClose();
    }, 12000);
  };

  const handleClose = () => {
    setApprovalNote("");
    setShowSuccessToast(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showSuccessToast} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <>
            <DialogHeader>
              <DialogTitle>Approve Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Expense Summary */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1">
                  Expense Title
                </p>
                <p className="text-base font-semibold text-foreground mb-4">
                  {expenseTitle}
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Amount to Approve
                </p>
                <p className="text-2xl font-bold text-primary">
                  {expenseAmount}
                </p>
              </div>

              {/* Approval Message */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  You are about to approve this expense. Once approved, it will
                  move to the next stage of processing or payment.
                </p>
              </div>

              {/* Approval Note */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Add Approval Note
                  </label>
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </div>
                <Textarea
                  placeholder="Write your approval note here...."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="min-h-[120px] resize-none"
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
                  onClick={handleApprove}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Approve"}
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
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Expense Approved Successfully
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The expense has been approved and the requester has been
                  notified. You can view this approval in the expense audit
                  trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
