import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
import { QUERY_KEYS } from "@/lib/constants/api-query-key";

export interface ExpenseCategory {
    id: string | number;
    name: string;
    description: string;
}

interface Response {
    data: ExpenseCategory[];
    error: {
        error: string;
        message?: string;
        success: boolean;
    };
    message: string;
    status: number;
    statusCode: number;
    statusText: string;
}

export const useGetExpenseCategoriesApi = (
    options?: Omit<UseQueryOptions<Response, Error>, "queryKey" | "queryFn">
): UseQueryResult<Response, Error> => {
    const axiosInstance = useAxios();

    return useQuery<Response, Error>({
        queryKey: [QUERY_KEYS.EXPENSE_CATEGORIES],
        queryFn: async () => {
            const response = await axiosInstance.get(API_KEYS.EXPENSE.CATEGORIES);
            return response.data;
        },
        staleTime: 0,
        ...options,
    });
};
