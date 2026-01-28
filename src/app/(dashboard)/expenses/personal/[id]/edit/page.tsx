"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
import { ManualExpenseForm } from "@/components/expenses/ManualExpenseForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useModal from "@/hooks/useModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

interface ReportDetail {
  reportId: string;
  reportTitle: string;
  status: string;
  expenses: Array<{
    expenseId: string;
    title: string;
    merchantName: string;
    amount: string;
    transactionDate: string;
    categoryName: string;
    description?: string;
    receiptUrl?: string;
  }>;
}

export default function EditExpenseReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const axios = useAxios();
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expenseToDelete, setExpenseToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
  } = useModal();

  const fetchReportDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`reports/${reportId}`);
      setReportDetail(response.data.data);
    } catch (err: any) {
      console.error("Error fetching report detail:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load report details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [reportId, axios]);

  useEffect(() => {
    if (reportId) {
      fetchReportDetail();
    }
  }, [reportId, fetchReportDetail]);

  const handleDeleteInitiation = (expenseId: string, title: string) => {
    setExpenseToDelete({ id: expenseId, title: title });
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await axios.delete(`reports/${reportId}/expenses/${expenseToDelete.id}`);
      toast.success(`Expense "${expenseToDelete.title}" deleted successfully.`);
      fetchReportDetail(); // Refetch data
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to delete expense. Please try again.";
      toast.error(errorMessage);
    } finally {
      closeDeleteModal();
      setExpenseToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading report...</span>
      </div>
    );
  }

  if (error || !reportDetail) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Error Loading Report
          </h1>
          <p className="text-muted-foreground mb-4">
            {error ||
              "The report you're trying to edit doesn't exist or failed to load."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete the expense: "${expenseToDelete?.title}"?`}
      />
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Edit Expense Report
          </h1>
          <p className="text-muted-foreground">
            Update your expense report details below
          </p>
        </div>

        {/* Use ManualExpenseForm for editing */}
        <ManualExpenseForm
          isEditMode={true}
          reportDetail={reportDetail}
          reportId={reportId}
          onDeleteExpense={handleDeleteInitiation}
        />
      </div>
    </>
  );
}
