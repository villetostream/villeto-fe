"use client"

import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth-stores";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const BASEURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAxios(): AxiosInstance {
  const user = useAuthStore.getState().user;
  // const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  return useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // if (user?.access_token) {
    //   headers["Authorization"] = `Bearer ${user.access_token}`;
    // }

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
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // const refreshRes = await axios.post(
            //   `${BASE_URL}auth/refresh-token`,
            //   { refreshToken: user?.refresh_token }
            // );
            // const newToken = refreshRes.data.data.access_token;
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
        }
        else {
          toast.error(error.message || "Invalid login credentials.");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [user]);
}
