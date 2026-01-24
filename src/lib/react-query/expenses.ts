import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_KEYS } from "@/lib/constants/apis";
import { useAxios } from "@/hooks/useAxios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the payload type for submitting/saving expenses
interface ExpenseItemPayload {
  title: string;
  merchantName: string;
  description: string;
  expenseCategoryId: string;
  amount: number;
  receiptImage?: string;
}

interface ExpenseSubmissionPayload {
  reportTitle: string;
  expenses: ExpenseItemPayload[];
  status: "pending" | "draft"; // Add status to the payload
}

// Mutation for submitting an expense
export const useSubmitExpense = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ExpenseSubmissionPayload) => {
      // Ensure status is 'pending' for submission
      const submissionPayload = { ...payload, status: "pending" };
      const response = await axios.post(
        API_KEYS.EXPENSE.REPORTS,
        submissionPayload,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        `Your ${variables.expenses.length} expense(s) have been submitted successfully.`,
      );
      // Invalidate relevant queries to refetch data, e.g., personal expenses list
      queryClient.invalidateQueries({ queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES] });
      router.push("/expenses?tab=personal-expenses");
    },
    onError: (error: any) => {
      console.error("Error submitting expenses:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to submit expenses. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// Mutation for saving an expense as a draft
export const useSaveExpenseAsDraft = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: ExpenseSubmissionPayload) => {
      // Ensure status is 'draft' for saving as draft
      const draftPayload = { ...payload, status: "draft" };
      // Assuming drafts also go to the same reports endpoint
      const response = await axios.post(
        API_KEYS.EXPENSE.REPORTS,
        draftPayload,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Expense saved as draft.");
      // Invalidate relevant queries to refetch data, e.g., personal expenses list
      queryClient.invalidateQueries({ queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES] });
      router.push("/expenses?tab=personal-expenses");
    },
    onError: (error: any) => {
      console.error("Error saving draft:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save draft. Please try again.";
      toast.error(errorMessage);
    },
  });
};
