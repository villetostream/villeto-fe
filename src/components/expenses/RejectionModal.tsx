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
import { AlertCircle } from "lucide-react";

interface RejectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => void;
  expenseTitle: string;
  expenseAmount: string;
}

export function RejectionModal({
  open,
  onOpenChange,
  onReject,
  expenseTitle,
  expenseAmount,
}: RejectionModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    setIsLoading(true);
    // Simulate API call with short delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onReject(rejectionReason);

    // Show success toast
    setShowSuccessToast(true);

    // Auto-hide modal and reset after showing toast
    setTimeout(() => {
      handleClose();
    }, 12000);
  };

  const handleClose = () => {
    setRejectionReason("");
    setShowSuccessToast(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showSuccessToast} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <>
            <DialogHeader>
              <DialogTitle>Reject Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Expense Summary */}
              <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/10">
                <p className="text-sm text-muted-foreground mb-1">
                  Expense Title
                </p>
                <p className="text-base font-semibold text-foreground mb-4">
                  {expenseTitle}
                </p>
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="text-2xl font-bold text-destructive">
                  {expenseAmount}
                </p>
              </div>

              {/* Rejection Message */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-foreground">
                    Please provide a reason for rejection. The requester will be
                    notified.
                  </p>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Reason for Rejection
                </label>
                <Textarea
                  placeholder="Explain why this expense is being rejected...."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
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
                  onClick={handleReject}
                  className="flex-1 bg-destructive hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Reject"}
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
                <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-destructive rounded-full">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Expense Rejected Successfully
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The expense has been rejected and the requester has been
                  notified with the reason. You can view this rejection in the
                  expense audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
