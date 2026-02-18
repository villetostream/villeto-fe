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

type payload = z.infer<typeof onboardingBusinessSchema>;

export const useUpdateOnboardingCompanyDetailsApi = (): UseMutationResult<
  Response,
  Error,
  payload
> => {
  const axiosInstance = useAxios();

  return useMutation<Response, Error, payload>({
    retry: false,
    mutationFn: async (payload: payload) => {
      const { onboardingId } = useOnboardingStore.getState();
      const latestPayload = { ...payload };
      delete latestPayload.business_name;

      // Helper function to extract pure base64 string from data URL
      const extractBase64 = (dataUrl: string): string => {
        // Remove data:image/...;base64, prefix if present
        const base64Match = dataUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
        return base64Match ? base64Match[1] : dataUrl;
      };

      // Convert logo File to Base64 only if user uploaded a new file.
      // If the logo is an existing URL (e.g. Cloudinary), skip it — the API
      // only accepts base64 and the logo hasn't changed.
      let logoBase64: string | undefined = undefined;
      if (latestPayload.businessLogo instanceof File) {
        logoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const pureBase64 = extractBase64(result);
            resolve(pureBase64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(latestPayload.businessLogo as File);
        });
      } else if (
        typeof latestPayload.businessLogo === "string" &&
        latestPayload.businessLogo.startsWith("data:")
      ) {
        // Only send if it's a base64 data URL (newly selected), not a remote URL
        logoBase64 = extractBase64(latestPayload.businessLogo);
      }
      // If businessLogo is a remote URL (e.g. https://res.cloudinary.com/...),
      // we intentionally skip it — logo hasn't changed.

      // Prepare the payload for API
      const apiPayload: Record<string, any> = {};
      
      // Add all fields except businessLogo
      Object.keys(latestPayload).forEach((key) => {
        if (
          key !== "businessLogo" &&
          latestPayload[key as keyof typeof latestPayload] !== undefined
        ) {
          const value = latestPayload[key as keyof typeof latestPayload];
          if (value !== null && value !== undefined) {
            apiPayload[key] = value;
          }
        }
      });

      // Add logo as pure base64 string (API expects field name "logo", not "businessLogo")
      if (logoBase64) {
        apiPayload.logo = logoBase64;
      }

      const res = await axiosInstance.patch(
        API_KEYS.ONBOARDING.ONBOARDING_COMPANY_DETAILS(onboardingId),
        apiPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
  });
};
