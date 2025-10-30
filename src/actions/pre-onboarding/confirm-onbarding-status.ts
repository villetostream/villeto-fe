import type { z } from "zod";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { emailSchema } from "@/app/pre-onboarding/page";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";


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

type payload = z.infer<typeof emailSchema>

export const useConfirmationOnboardingApi = (): UseMutationResult<Response, Error, payload> => {
    const axiosInstance = useAxios();

    return useMutation<Response, Error, payload>({
        retry: false,
        mutationFn: async (payload: payload) => {
            const res = await axiosInstance.post(API_KEYS.ONBOARDING.ACCOUNT_CONFIRMATION, payload,);
            return res.data;
        },
    });
};
