import { z } from "zod";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
import { useOnboardingStore } from "@/stores/useVilletoStore";
import { onboardingBusinessSchema } from "@/lib/schemas/schemas";


interface Response {
    data: {
        [key: string]: string | number | boolean;
    };
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


type payload = {
    spendLimit: {
        lower: number,
        upper: number
    },
    additionalInfo?: string | null
}

export const useUpdateOnboardingFinancialPulseApi = (): UseMutationResult<Response, Error, payload> => {
    const axiosInstance = useAxios();
    const { onboardingId } = useOnboardingStore()
    console.log({ onboardingId })

    return useMutation<Response, Error, payload>({
        retry: false,
        mutationFn: async (payload: payload) => {

            const res = await axiosInstance.patch(API_KEYS.ONBOARDING.ONBOARDING_FINANCIAL(onboardingId), payload,);
            return res.data;
        },
    });
};
