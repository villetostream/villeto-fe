
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";
import { QUERY_KEYS } from "@/lib/constants/api-query-key";
import { Permission } from "../auth/auth-permissions";
import { AppUser } from "../departments/get-all-departments";
import { Meta } from "../users/get-all-users";


export interface Role {
    roleId: string,
    name: string,
    description?: string,
    isActive: boolean,
    permissions: Permission[],
    createdAt: Date,
    updatedAt: Date,
    totalAssignedUsers?: number,
    createdBy?: AppUser

}
interface Response {
    data: Role[]
    meta: Meta
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


export const useGetAllRolesApi = (

    options?: Omit<UseQueryOptions<Response, Error>, "queryKey" | "queryFn">
): UseQueryResult<Response, Error> => {
    const axiosInstance = useAxios(); // 

    return useQuery<Response, Error>({
        queryKey: [QUERY_KEYS.ROLES],
        queryFn: async () => {
            const apiUrl = `${API_KEYS.ROLE.ROLES}`;
            const response = await axiosInstance.get(apiUrl);
            return response.data;
        },
        staleTime: 0,
        ...options,
    });
};