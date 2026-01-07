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


type payload = z.infer<typeof onboardingBusinessSchema>

export const useUpdateOnboardingCompanyDetailsApi = (): UseMutationResult<Response, Error, payload> => {
    const axiosInstance = useAxios();
    const { onboardingId } = useOnboardingStore()
    console.log({ onboardingId })

    return useMutation<Response, Error, payload>({
        retry: false,
        mutationFn: async (payload: payload) => {
            const latestPayload = { ...payload }
            delete latestPayload.business_name;
            
            // Check if there's a logo file to upload
            const hasLogoFile = latestPayload.businessLogo instanceof File;
            
            if (hasLogoFile) {
                // Create FormData for file upload
                const formData = new FormData();
                
                // Append all fields except the logo
                Object.keys(latestPayload).forEach((key) => {
                    if (key !== 'businessLogo' && latestPayload[key as keyof typeof latestPayload] !== undefined) {
                        const value = latestPayload[key as keyof typeof latestPayload];
                        if (value !== null && value !== undefined) {
                            formData.append(key, String(value));
                        }
                    }
                });
                
                // Append the logo file
                if (latestPayload.businessLogo instanceof File) {
                    formData.append('businessLogo', latestPayload.businessLogo);
                }
                
                const res = await axiosInstance.patch(
                    API_KEYS.ONBOARDING.ONBOARDING_COMPANY_DETAILS(onboardingId),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                return res.data;
            } else {
                // Remove logo from payload if it's not a File (could be undefined or string)
                const { businessLogo, ...payloadWithoutLogo } = latestPayload;
                const res = await axiosInstance.patch(
                    API_KEYS.ONBOARDING.ONBOARDING_COMPANY_DETAILS(onboardingId),
                    payloadWithoutLogo
                );
                return res.data;
            }
        },
    });
};
