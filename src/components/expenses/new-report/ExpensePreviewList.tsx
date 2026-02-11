"use client";

import { useState } from "react";
import { Eye, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ExpenseItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  receiptImage: string;
  merchantName?: string;
  description?: string;
  transactionDate?: Date;
  fileName?: string;
}

interface ExpensePreviewListProps {
  expenses: ExpenseItem[];
  total: number;
  onEditName: (id: string, newName: string) => void;
  onViewDetails: (id: string) => void;
  onViewReceipt: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpensePreviewList({
  expenses,
  total,
  onEditName,
  onViewDetails,
  onViewReceipt,
  onDelete,
}: ExpensePreviewListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onEditName(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(id);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="border border-border rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">
          Preview Items{" "}
          <span className="text-muted-foreground">{expenses.length}</span>
        </h3>
        <div className="text-base font-semibold text-foreground">
          Total: ${total.toFixed(2)}
        </div>
      </div>

      {/* Table or Empty State */}
      {expenses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            No expenses added yet
          </h4>
          <p className="text-sm text-muted-foreground">
            Use the entry form to start adding items to this expense report.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Expenses Details
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Receipt
                </th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  {/* Actions column */}
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-t border-border">
                  {/* Expense Name */}
                  <td className="p-3">
                    {editingId === expense.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, expense.id)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleSaveEdit(expense.id)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {expense.name}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            handleStartEdit(expense.id, expense.name)
                          }
                        >
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground">
                      {expense.category}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="p-3">
                    <span className="text-sm font-medium text-foreground">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </td>

                  {/* Receipt */}
                  <td className="p-3">
                    <button
                      onClick={() => onViewReceipt(expense.id)}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      View
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => onViewDetails(expense.id)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => onDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
