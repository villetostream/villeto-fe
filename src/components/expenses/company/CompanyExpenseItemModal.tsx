"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { CompanyReceiptViewModal } from "./CompanyReceiptViewModal";

interface CompanyExpenseItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    title: string;
    amount: string;
    merchantName: string;
    categoryName: string;
    description?: string;
    receiptUrl?: string;
  } | null;
}

export function CompanyExpenseItemModal({
  isOpen,
  onClose,
  expense,
}: CompanyExpenseItemModalProps) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  if (!expense) return null;

  // Extract filename from URL if available
  const getReceiptFileName = (url?: string) => {
    if (!url) return "No receipt uploaded";
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      // Decode URL-encoded filename
      return decodeURIComponent(filename) || "Receipt.jpeg";
    } catch {
      return "Receipt.jpeg";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Expense Name and Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Expenses name
                </label>
                <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground font-medium">
                  {expense.title}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Amount
                </label>
                <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground font-medium">
                  ${parseFloat(expense.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* Merchant and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Merchant
                </label>
                <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground font-medium">
                  {expense.merchantName || "Vendor"}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Expense Category
                </label>
                <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground font-medium">
                  {expense.categoryName}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Description
              </label>
              <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground min-h-[80px]">
                {expense.description || "This is for my journey to the airport"}
              </div>
            </div>

            {/* Upload Receipt */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Upload Receipt
              </label>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-foreground font-medium">
                    {getReceiptFileName(expense.receiptUrl)}
                  </span>
                </div>
                {expense.receiptUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="text-primary border-primary hover:bg-primary/10 font-medium"
                  >
                    View
                  </Button>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={onClose}
                className="bg-primary text-white hover:bg-primary/90 px-12 h-11 rounded-lg font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Preview Modal */}
      <CompanyReceiptViewModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptUrl={expense.receiptUrl || ""}
      />
    </>
  );
}
