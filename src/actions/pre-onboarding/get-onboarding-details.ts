import {
    useQuery,
    UseQueryOptions,
    type UseQueryResult,
} from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { QUERY_KEYS } from "@/lib/constants/api-query-key";
import { API_KEYS } from "@/lib/constants/apis";

interface Company {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    companyId: string;
    contactEmail: string;
    contactPhone: string;
    contactFirstName: string;
    contactLastName: string;
    companyName: string;
    businessName: string | null;
    taxId: string | null;
    registrationId: string | null;
    websiteUrl: string | null;
    address: string | null;
    accountType: string;
    description: string | null;
}

export interface Onboarding {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    onboardingId: string;
    status: boolean;
    step: number;
    company: Company;
}

type Response = { data: Onboarding };



type Payload = string
export const useGetOnboardingDetailsApi = (
    payload: Payload,
    options?: Omit<UseQueryOptions<Response, Error>, "queryKey" | "queryFn">
): UseQueryResult<Response, Error> => {
    const axiosInstance = useAxios(); // 

    return useQuery<Response, Error>({
        queryKey: [QUERY_KEYS.ONBOARDINGDETAILS, payload],
        queryFn: async () => {
            const apiUrl = `${API_KEYS.ONBOARDING.ONBOARDING}/${payload}`;
            const response = await axiosInstance.get(apiUrl);
            return response.data;
        },
        staleTime: 0,
        ...options,
    });
};

