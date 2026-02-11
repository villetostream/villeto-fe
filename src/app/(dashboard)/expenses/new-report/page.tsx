"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ReceiptUploadSection } from "@/components/expenses/new-report/ReceiptUploadSection";
import { ExpensePreviewList, type ExpenseItem } from "@/components/expenses/new-report/ExpensePreviewList";
import { ExpenseDetailModal } from "@/components/expenses/new-report/ExpenseDetailModal";
import { ReceiptPreviewModal } from "@/components/expenses/new-report/ReceiptPreviewModal";
import { type ExpenseDetailFormData } from "@/components/expenses/new-report/ExpenseForm";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseCategory {
  categoryId: string;
  name: string;
}

// Simulated OCR function (replace with actual backend OCR endpoint)
const simulateOCR = async (receiptBase64: string): Promise<{
  merchantName: string;
  amount: number;
  category: string;
  transactionDate: string;
}> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return simulated extracted data - Default empty as requested
  return {
    merchantName: "", 
    amount: 0, 
    category: "", 
    transactionDate: new Date().toISOString(),
  };
};

export default function NewReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const axios = useAxios();
  const queryClient = useQueryClient();

  const reportTitle = searchParams.get("name") || "New Report";

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await axios.get<{
          message: string;
          status: number;
          data: ExpenseCategory[];
        }>(API_KEYS.EXPENSE.CATEGORIES);
        
        if (response.data?.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load expense categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [axios]);

  // Handle receipt upload
  const handleReceiptsUpload = async (receipts: { base64: string; name: string }[]) => {
    setIsProcessing(true);
    try {
      // Process each receipt through OCR
      const ocrResults = await Promise.all(
        receipts.map((receipt) => simulateOCR(receipt.base64))
      );

      // Create expense items from OCR results
      const newExpenses: ExpenseItem[] = ocrResults.map((result, index) => ({
        id: `expense-${Date.now()}-${index}`,
        name: result.merchantName || `Expense ${expenses.length + index + 1}`,
        category: result.category || "", // Empty by default
        amount: 0, // Explicitly 0
        receiptImage: receipts[index].base64,
        merchantName: result.merchantName,
        transactionDate: new Date(result.transactionDate),
        fileName: receipts[index].name, // Preserve original filename
      }));

      setExpenses((prev) => [...prev, ...newExpenses]);
      toast.success(`${receipts.length} receipt(s) scanned successfully`);
    } catch (error) {
      console.error("Error processing receipts:", error);
      toast.error("Failed to process receipts");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle remove receipt/expense logic for the scan section
  const handleRemoveExpense = (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Handle manual expense addition (from inline form)
  const handleAddExpense = (data: ExpenseDetailFormData, receiptImage?: string) => {
    const newExpense: ExpenseItem = {
      id: `expense-${Date.now()}`,
      name: data.name,
      amount: data.amount,
      category: data.category,
      merchantName: data.merchantName,
      description: data.description,
      receiptImage: receiptImage || "",
      transactionDate: new Date(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    toast.success("Expense added");
  };

  // Handle expense name edit
  const handleEditName = (id: string, newName: string) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, name: newName } : exp))
    );
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    setSelectedExpenseId(id);
    setIsDetailModalOpen(true);
  };

  // Handle view receipt
  const handleViewReceipt = (id: string) => {
    setSelectedReceiptId(id);
    setIsReceiptModalOpen(true);
  };

  // Handle delete expense
  const handleDelete = (id: string) => {
    // Immediate deletion when clicking X / Trash
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    // toast.success("Expense deleted"); // Optional?
  };

  // Handle save from expense detail modal
  const handleSaveExpense = (
    expenseId: string,
    data: ExpenseDetailFormData,
    newReceipt?: string
  ) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId
          ? {
              ...exp,
              name: data.name,
              amount: data.amount,
              merchantName: data.merchantName,
              category: data.category,
              description: data.description,
              ...(newReceipt !== undefined && { receiptImage: newReceipt }),
            }
          : exp
      )
    );
    toast.success("Expense updated");
  };

  // Handle receipt change from preview modal
  const handleChangeReceipt = (newReceipt: string) => {
    if (selectedReceiptId) {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === selectedReceiptId
            ? { ...exp, receiptImage: newReceipt }
            : exp
        )
      );
      toast.success("Receipt updated");
    }
  };

  // Calculate total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Helper to extract base64 from data URL
  const extractBase64 = (dataUrl: string): string => {
    if (!dataUrl || typeof dataUrl !== "string") return "";
    if (!dataUrl.startsWith("data:")) return dataUrl.trim();
    
    const base64Match = dataUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
    if (base64Match && base64Match[1]) {
      return base64Match[1].trim();
    }
    
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex !== -1) {
      return dataUrl.substring(commaIndex + 1).trim();
    }
    
    return "";
  };

  // Handle submit (save as draft or submit)
  const handleSubmit = async (status: "draft" | "pending") => {
    if (expenses.length === 0) {
      toast.error("Please add at least one expense");
      return;
    }

    // Check for missing receipts if submitting
    if (status === "pending") {
      const missingReceipts = expenses.filter((exp) => !exp.receiptImage);
      if (missingReceipts.length > 0) {
        toast.error("All expenses must have receipts before submitting");
        return;
      }
    }

    // Check for missing required fields
    const invalidExpenses = expenses.filter(
      (exp) => !exp.name || exp.amount < 0 || !exp.category // Allow 0 amount? User sets default 0. Usually amount > 0 is required for submit.
      // But user requested default 0. I'll require name and category.
    );
    if (invalidExpenses.length > 0) {
      toast.error("Please complete all required fields for each expense");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build payload
      const expensesPayload = expenses.map((expense) => {
        const category = categories.find((cat) => cat.name === expense.category);
        if (!category) {
          throw new Error(`Category not found: ${expense.category}`);
        }

        const payload: any = {
          title: expense.name,
          merchantName: expense.merchantName || "",
          description: expense.description || "",
          expenseCategoryId: category.categoryId,
          amount: expense.amount,
          transactionDate: expense.transactionDate
            ? new Date(expense.transactionDate).toISOString()
            : new Date().toISOString(),
        };

        // Add receipt if available
        if (expense.receiptImage && expense.receiptImage.startsWith("data:")) {
          const receiptBase64 = extractBase64(expense.receiptImage);
          if (receiptBase64) {
            payload.receiptImage = receiptBase64;
          }
        }

        return payload;
      });

      const requestPayload = {
        reportTitle: reportTitle,
        status,
        expenses: expensesPayload,
      };

      await axios.post(API_KEYS.EXPENSE.REPORTS, requestPayload);

      toast.success(
        status === "draft"
          ? "Report saved as draft"
          : "Report submitted successfully"
      );

      // Invalidate React Query cache
      queryClient.invalidateQueries({
        queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES],
      });

      // Navigate back to expenses page
      setTimeout(() => {
        const returnTab =
          sessionStorage.getItem("expensesReturnTab") || "personal-expenses";
        const returnPage = sessionStorage.getItem("expensesReturnPage") || "1";
        router.push(`/expenses?tab=${returnTab}&page=${returnPage}`);
      }, 500);
    } catch (error) {
      console.error("Error submitting report:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit report";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedExpense = expenses.find((exp) => exp.id === selectedExpenseId);
  const selectedReceipt = expenses.find((exp) => exp.id === selectedReceiptId);

  if (isLoadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const isEmpty = expenses.length === 0;

  const saveDraftClass = isEmpty
    ? "bg-white text-white rounded-lg h-12 px-8 text-base font-medium"
    : "bg-white border-2 border-primary  text-primary hover:bg-primary/10 rounded-lg h-12 px-8 text-base font-medium";

  const submitClass = isEmpty
    ? "bg-primary text-white rounded-lg h-12 px-8 text-base font-medium"
    : "bg-primary border-2 border-primary text-white hover:bg-primary/90 rounded-lg h-12 px-8 text-base font-medium";

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-block border rounded-md px-3 py-1 text-sm font-semibold text-foreground bg-white">
            {reportTitle}
        </span>
      </div>

      {/* Main Content - Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left: Upload Section */}
        <div>
          <ReceiptUploadSection
            categories={categories}
            onReceiptsUpload={handleReceiptsUpload}
            onAddExpense={handleAddExpense}
          />
        </div>

        {/* Right: Preview List */}
        <div>
          <ExpensePreviewList
            expenses={expenses}
            total={total}
            onEditName={handleEditName}
            onViewDetails={handleViewDetails}
            onViewReceipt={handleViewReceipt}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 mt-8">
        <Button
          onClick={() => handleSubmit("draft")}
          disabled={isSubmitting || expenses.length === 0}
          className={saveDraftClass}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          onClick={() => handleSubmit("pending")}
          disabled={isSubmitting || expenses.length === 0}
          className={submitClass}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </div>

      {/* Modals */}
      <ExpenseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedExpenseId(null);
        }}
        expense={selectedExpense || null}
        categories={categories}
        onSave={handleSaveExpense}
      />

      <ReceiptPreviewModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceiptId(null);
        }}
        receiptImage={selectedReceipt?.receiptImage || ""}
        onChangeReceipt={handleChangeReceipt}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Processing receipts...</span>
          </div>
        </div>
      )}
    </div>
  );
}