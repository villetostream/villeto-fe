"use client";

import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BASEURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAxios(): AxiosInstance {
  const accessToken = useAuthStore.getState().accessToken;
  const setUser = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const instance = axios.create({
      baseURL: BASEURL,
      headers,
      withCredentials: true,
    });

    // Refresh token interceptor
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("auth")
        ) {
          originalRequest._retry = true;
          try {
            const refreshRes = await axios.post(`${BASEURL}auth/refresh`);
            const newToken = refreshRes.data.data.access_token;
            // update store
            // setUser({ ...(user || {}), access_token: newToken } as AuthUser);
            // update header and retry
            // originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            // logout on refresh failure
            // setUser(null);
            router.replace("/login");
            return Promise.reject(refreshError);
          }
        } else {
        }
        if (!originalRequest.url.includes("account-confirmation")) {
          toast.error(
            error.response.data.message ||
              error.message ||
              "Invalid login credentials."
          );
        } else {
          toast.info("onboarding required!, redirecting to Onboarding ");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken]);
}
