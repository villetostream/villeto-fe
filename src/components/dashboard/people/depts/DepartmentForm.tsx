"use client"

import { useState, useEffect, useMemo } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessModal from "@/components/modals/SuccessModal";
import { useRouter } from "next/navigation";
import { useGetADepartmentApi } from "@/actions/departments/get-a-department";
import { Form } from "@/components/ui/form";
import FormFieldInput from "@/components/form fields/formFieldInput";
import FormFieldSelect from "@/components/form fields/formFieldSelect";
import FormFieldTextArea from "@/components/form fields/formFieldTextArea";
import MembersDropdown from "./AddMembersModal";
import { CreateDepartmentPayload, useCreateDepartmentApi } from "@/actions/departments/create-department";
import { useUpdateDepartmentApi } from "@/actions/departments/update-department";
import { AppUser, useGetAllDepartmentsApi } from "@/actions/departments/get-all-departments";
import z from "zod";
import { useGetAllUsersApi } from "@/actions/users/get-all-users";

const createDepartmentSchema = z.object({
    departmentName: z.string().min(1, "Department name is required"),
    departmentCode: z.string().optional(),
    departmentManager: z.string().optional(),
    reportsTo: z.string().optional(),
    isActive: z.boolean(),
    description: z.string().min(1, "Description is required"),
    id: z.string().optional().nullable()
});
type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;

const DepartmentForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const departmentId = searchParams.get('departmentId');

    const createDepartment = useCreateDepartmentApi();
    const updateDepartment = useUpdateDepartmentApi()
    const isSubmitting = updateDepartment.isPending || createDepartment.isPending
    const { data: departmentData, isLoading: isDepartmentLoading } = useGetADepartmentApi(
        departmentId as string,
        {
            enabled: !!departmentId,
            refetchOnWindowFocus: false
        }
    );
    const isEdit = !!departmentId

    const [selectedMembers, setSelectedMembers] = useState<AppUser[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const allDepts = useGetAllDepartmentsApi()
    const allUsers = useGetAllUsersApi()

    const usersOptions = useMemo(() => {
        return (
            allUsers?.data?.data
                ?.filter((user: AppUser) => user.position?.toLocaleLowerCase() != "owner")
                .map((user: AppUser) => ({
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.userId.toString(),
                })) || []
        );
    }, [allUsers?.data?.data]);


    // In your component
    const form = useForm<z.infer<typeof createDepartmentSchema>>({
        resolver: zodResolver(createDepartmentSchema),
        defaultValues: {
            departmentName: "",
            isActive: true,
            description: "",
            id: undefined,
        },
    });

    const {
        handleSubmit,
        watch,
        control,
        reset
    } = form;

    const formValues = watch();

    // Set form values when department data is loaded
    useEffect(() => {
        if (departmentData?.data && departmentId) {
            const department = departmentData.data;


            reset({
                departmentName: department.name || "",
                departmentCode: department.code || "",
                departmentManager: department.head?.userId || undefined,
                reportsTo: department.manager?.userId || undefined,
                isActive: department.isActive ?? true,
                description: department.description || "",
                id: department.departmentId,
            });

            // Set selected members if available
            if (department.members) {
                setSelectedMembers(department.members ?? []);
            }
        }
    }, [departmentData, departmentId, reset]);

    const handleRemoveMember = (memberId: string) => {
        setSelectedMembers((prev) => prev.filter((m) => m.userId !== memberId));
    };

    const onSubmit = async (data: CreateDepartmentFormData) => {
        try {
            // Transform form data to match API payload
            console.log({ selectedMembers })
            const payload: CreateDepartmentPayload = {
                id: data.id ?? undefined,
                name: data.departmentName,
                description: data.description,
                departmentCode: data.departmentCode || undefined,
                membersIds: selectedMembers.map(member => member.userId),
                departmentHeadId: data.departmentManager,
                managerId: data.departmentManager,
                isActive: data.isActive,
            };
            if (selectedMembers.length == 0) {
                delete payload.membersIds;
            }
            const mutation = !!departmentId ? updateDepartment : createDepartment
            await mutation.mutateAsync(payload);
            reset({})
            allDepts.refetch()
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to save department:", error);
            // Handle error (show toast, etc.)
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        reset({})
        router.push("/people?tab=department");
    };

    if (isDepartmentLoading && departmentId) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading department data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-screen bg-background border p-10 mr-10 rounded-[14px]">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">
                    {isEdit ? 'Edit Department' : 'Create New Department'}
                </h1>
                <p className="text-muted-foreground">
                    {isEdit
                        ? 'Update the department details below'
                        : 'Fill out the details below to create a new department'
                    }
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className="space-y-6">
                    <h2 className="text-lg font-semibold mb-4">Department Information</h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <FormFieldInput
                            label="Department Name"
                            name="departmentName"
                            placeholder="Enter department name"
                            control={control}
                        />

                        <FormFieldInput
                            name="departmentCode"
                            label="Department Code"
                            placeholder="Enter department code"
                            control={control}
                        />

                        <FormFieldSelect
                            name="departmentManager"
                            label="Department Manager"
                            values={usersOptions}
                            placeholder="Select department manager"
                            control={control}
                        />

                        <FormFieldSelect
                            name="reportsTo"
                            label="Reports To"
                            values={usersOptions}
                            placeholder="Select reporting department"
                            control={control}
                        />

                        {isEdit && (<div>
                            <Label htmlFor="addMembers">
                                Add Members
                                <span className="text-muted-foreground text-sm">(optional)</span>
                            </Label>
                            <MembersDropdown
                                selectedMembers={selectedMembers}
                                onMembersSelected={setSelectedMembers}
                                onRemoveMember={handleRemoveMember}
                            />
                        </div>)}

                        <FormFieldSelect
                            name="isActive"
                            label="Status"
                            values={[
                                { value: true, label: "Active" },
                                { value: false, label: "Inactive" },
                            ]}
                            placeholder="Select status"
                            control={control}
                        />

                        <div className="col-span-2">
                            <FormFieldTextArea
                                name="description"
                                label="Description"
                                control={control}
                                placeholder="Describe department"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (isEdit ? "Updating..." : "Creating...")
                                : (isEdit ? "Update Department" : "Create Department")
                            }
                        </Button>
                    </div>
                </form>
            </Form>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                title={`Department ${isEdit ? 'Updated' : 'Created'} Successfully`}
                description={formValues.departmentName || "Department"}
            />
        </div>
    );
};

export default DepartmentForm;