import { PersonalExpenseStatus } from "@/components/expenses/table/personalColumns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// API Response types
export interface PersonalExpenseReport {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  reportId: string;
  reportTitle: string;
  status: PersonalExpenseStatus;
  costCenter: string;
  reportedBy: string;
  totalAmount: number; // Updated to number based on new API response
}

export interface CompanyExpenseReport {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  reportId: string;
  reportTitle: string;
  status: "draft" | "pending" | "approved" | "declined" | "paid";
  costCenter: string;
  reportedBy: string;
  totalAmount: number;
}

export interface ExpenseItem {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  expenseId: string;
  amount: string;
  title: string | null;
  description: string;
  merchantName: string;
  categoryName: string | null;
  receiptUrl: string;
  receiptMimeType: string;
  status: "draft" | "pending" | "approved" | "declined" | "rejected" | "paid";
}

export interface PersonalExpenseDetailResponse {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  reportId: string;
  reportTitle: string;
  status?: PersonalExpenseStatus;
  expenses: ExpenseItem[];
}

export interface PersonalExpenseDetailApiResponse {
  message: string;
  status: number;
  data: PersonalExpenseDetailResponse;
}

export interface PersonalExpensesApiResponse {
  message: string;
  status: number;
  data: PersonalExpenseReport[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface PersonalExpensesResponse {
  reports: PersonalExpenseReport[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface CompanyExpensesApiResponse {
  message: string;
  status: number;
  data: CompanyExpenseReport[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface CompanyExpensesResponse {
  reports: CompanyExpenseReport[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Query for fetching personal expenses
export const usePersonalExpenses = (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) => {
  const axios = useAxios();

  return useQuery({
    queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const response = await axios.get<PersonalExpensesApiResponse>(
        `${API_KEYS.EXPENSE.PERSONAL_EXPENSES}?${params.toString()}`
      );
      // Map to the expected PersonalExpensesResponse shape to avoid breaking downstream code
      return {
        reports: response.data.data,
        meta: response.data.meta,
      } as PersonalExpensesResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Query for fetching company expenses
export const useCompanyExpenses = (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) => {
  const axios = useAxios();

  return useQuery({
    queryKey: [API_KEYS.EXPENSE.COMPANY_REPORTS, page, limit, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const response = await axios.get<CompanyExpensesApiResponse>(
        `${API_KEYS.EXPENSE.COMPANY_REPORTS}?${params.toString()}`
      );
      
      return {
        reports: response.data.data,
        meta: response.data.meta,
      } as CompanyExpensesResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Query for fetching a single personal expense detail
export const usePersonalExpenseDetail = (reportId: string) => {
  const axios = useAxios();

  return useQuery({
    queryKey: [API_KEYS.EXPENSE.PERSONAL_EXPENSES, reportId],
    queryFn: async () => {
      const response = await axios.get<PersonalExpenseDetailApiResponse>(
        `${API_KEYS.EXPENSE.PERSONAL_EXPENSES}/${reportId}`
      );
      // Extract the data property from the API response
      return response.data.data;
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

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