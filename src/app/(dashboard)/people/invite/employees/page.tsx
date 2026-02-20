
"use client";

import React, { useState } from "react";
import EmployeeInviteFileUpload from "@/components/dashboard/people/invite/EmployeeInviteFileUpload";
import EmployeePreviewTable, { EmployeeData } from "@/components/dashboard/people/invite/EmployeePreviewTable";
import { OrganizationDirectoryPage } from "@/components/dashboard/people/directory/OrganizationDirectoryPage";
import { useRouter, useSearchParams } from "next/navigation";
import { useBulkImportApi } from "@/actions/users/bulk-import";
import { useDeleteUserApi } from "@/actions/users/delete-user";
import { useGetAllUsersApi } from "@/actions/users/get-all-users";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Step = "directory" | "upload" | "preview";

export default function InviteEmployeesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStep = (searchParams.get("step") as Step) || "directory";

    const [step, setStep] = useState<Step>(initialStep);
    const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

    const bulkImportMutation = useBulkImportApi();
    const deleteUserMutation = useDeleteUserApi();
    const usersApi = useGetAllUsersApi();

    const directoryUsers = usersApi?.data?.data ?? [];
    const directoryTotalCount = usersApi?.data?.meta?.totalCount ?? 0;
    const hasDirectoryData = directoryTotalCount > 5;

    const handleFileSelect = async (file: File) => {
        try {
            await bulkImportMutation.mutateAsync(file);
            // After successful upload, refetch users and go to preview
            const refreshed = await usersApi.refetch();
            const users = refreshed.data?.data ?? [];

            const mapped: EmployeeData[] = users.map((u: any, i: number) => ({
                id: u.userId || `emp-${i}`,
                fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
                email: u.email || "",
                role: u.position || u.jobTitle || "Employee",
                department:
                    typeof u.department === "string"
                        ? u.department
                        : u.department?.name || "",
                manager: u.manager || "",
                corporateCard: u.corporateCard ?? false,
            }));

            setEmployeeData(mapped);
            setStep("preview");
            toast.success("File uploaded successfully!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to upload file. Please try again.");
        }
    };

    const handleDataChange = (newData: EmployeeData[]) => {
        setEmployeeData(newData);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUserMutation.mutateAsync(id);
            setEmployeeData((prev) => prev.filter((item) => item.id !== id));
            toast.success("Employee removed successfully.");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete employee.");
        }
    };

    const handleUploadDifferent = () => {
        setEmployeeData([]);
        setStep("upload");
    };

    const handleSaveToDirectory = () => {
        router.push("/people?tab=directory");
    };

    const handleSaveAndInviteAll = () => {
        // Navigate back to directory step which shows the OrganizationDirectoryPage
        setStep("directory");
    };

    // Directory step: show loading while deciding, then directory page or empty state
    if (step === "directory") {
        // Show loading state while API data is being fetched to avoid flashing empty state
        if (usersApi.isLoading) {
            return (
                <div className="p-4 max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg border p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-60" />
                            <Skeleton className="h-4 w-80" />
                            <div className="mt-6 space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-14 w-full rounded-md" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (hasDirectoryData) {
            return (
                <div className="p-4 max-w-7xl mx-auto h-full overflow-hidden">
                    <OrganizationDirectoryPage
                        onBack={() => router.push("/people?tab=directory")}
                    />
                </div>
            );
        }

        // No data in directory — show empty directory page with Upload Directory button
        return (
            <div className="p-4 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg border">
                    <div className="flex items-center justify-between p-6 pb-2">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Organization Directory</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Select people to invite to Villeto as users.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-24 px-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13l-3-3m0 0l-3 3m3-3v6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Organization Directory is Empty</h3>
                        <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
                            You haven&apos;t upload your directory, do that and invite you employees from it.
                        </p>
                        <button
                            onClick={() => setStep("upload")}
                            className="inline-flex items-center gap-2 bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Directory
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-7xl mx-auto overflow-hidden" style={{ maxHeight: "100%" }}>
            <div className={`bg-white rounded-lg shadow-sm border p-4 ${step === "preview" ? "h-[calc(100vh_-_140px)]" : "min-h-[350px]"}`}>
                {step === "upload" ? (
                    <div className="max-w-6xl mx-auto mt-2">
                        <EmployeeInviteFileUpload onFileSelect={handleFileSelect} />

                        <h3 className="font-semibold mt-4 border-t border-gray-200 pt-4">Required Fields</h3>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="font-semibold mb-1">Full Name</h3>
                                <p className="text-xs text-gray-500">User&apos;s first &amp; last name</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Email Address</h3>
                                <p className="text-xs text-gray-500">User&apos;s corporate email address</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Manager</h3>
                                <p className="text-xs text-gray-500">User&apos;s assigned manager/team lead</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Department</h3>
                                <p className="text-xs text-gray-500">User&apos;s department or team</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmployeePreviewTable
                        data={employeeData}
                        onDataChange={handleDataChange}
                        onDelete={handleDelete}
                        onUploadDifferent={handleUploadDifferent}
                        onSaveToDirectory={handleSaveToDirectory}
                        onSaveAndInviteAll={handleSaveAndInviteAll}
                        isDeleting={deleteUserMutation.isPending}
                    />
                )}
            </div>
        </div>
    );
}
