"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm, type ExpenseDetailFormData } from "./ExpenseForm";

interface ExpenseCategory {
  categoryId: string;
  name: string;
}

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    id: string;
    name: string;
    amount: number;
    merchantName?: string;
    category: string;
    description?: string;
    receiptImage?: string;
  } | null;
  categories: ExpenseCategory[];
  onSave: (expenseId: string, data: ExpenseDetailFormData, newReceipt?: string) => void;
}

export function ExpenseDetailModal({
  isOpen,
  onClose,
  expense,
  categories,
  onSave,
}: ExpenseDetailModalProps) {
  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Expense</DialogTitle>
        </DialogHeader>

        <ExpenseForm
          initialData={expense}
          categories={categories}
          onSave={(data, newReceipt) => {
            onSave(expense.id, data, newReceipt);
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
