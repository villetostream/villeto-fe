import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { X, User, Briefcase, Mail, Plus, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormFieldInput from "../form fields/formFieldInput";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFormSchema, LeadershipFormData } from "@/lib/schemas/schemas";
import z from "zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, MailAtSign01Icon, User03FreeIcons, UserAdd01FreeIcons } from "@hugeicons/core-free-icons";

interface AddBeneficialOwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (owner: {
        firstName: string;
        lastName: string;
        role: string;
        email: string;
        ownershipPercentage?: number;
    }) => void;
    mode?: "beneficial" | "officer";
    editingPerson?: any;
    isOwner?: boolean;
}



export const AddBeneficialOwnerModal = ({
    isOpen,
    onClose,
    onAdd,
    mode = "beneficial",
    editingPerson,
    isOwner
}: AddBeneficialOwnerModalProps) => {
    const schema = getFormSchema(mode, isOwner)
    console.log({ schema }, { isOwner }, { mode })
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            role: "",
            email: "",
            ownershipPercentage: undefined,
        }
    });
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger, control } = form
    const [complianceChecked, setComplianceChecked] = useState(true);
    const ownershipValue = watch("ownershipPercentage", undefined);
    console.log({ errors })
    useEffect(() => {
        if (editingPerson) {
            reset({
                firstName: editingPerson.firstName || "",
                lastName: editingPerson.lastName || "",
                role: editingPerson.role || "",
                email: editingPerson.email || "",
                ownershipPercentage: editingPerson.ownershipPercentage || undefined,
                position: editingPerson.position || ""
            });
        } else {
            reset({
                firstName: "",
                lastName: "",
                role: "",
                email: "",
                ownershipPercentage: undefined,
                position: ""
            });
        }
    }, [editingPerson, reset, isOpen]);

    const onSubmit = (data: z.infer<typeof schema>) => {
        if (mode === "beneficial" && (data.ownershipPercentage ?? 0) > 25) {
            return;
        }

        onAdd({
            firstName: data.firstName,
            lastName: data.lastName,
            role: mode === "beneficial" ? data.role : data.role || data.role,
            email: data.email,
            ownershipPercentage: data.ownershipPercentage
        });
        reset();
    };

    const handleCancel = () => {
        onClose();
        reset();
    };

    const handleOwnershipChange = (value: number[]) => {
        setValue("ownershipPercentage", value[0], { shouldValidate: true });
    };

    const isEditing = !!editingPerson;
    const isBeneficialOwner = mode === "beneficial" || isOwner;
    const maxOwnership = 25;
    console.log({ isBeneficialOwner })

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="!sm:min-w-[600px] p-0">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-10 pb-7 border-b border-b-muted">
                    <div className="flex items-center gap-2.5">
                        <div className="w-14 h-14 bg-muted/80 rounded-full flex items-center justify-center">
                            <HugeiconsIcon icon={UserAdd01FreeIcons} className="size-8 text-foreground" />

                        </div>
                        <div>
                            <DialogTitle className="text-xl leading-[100%] font-semibold">
                                {isEditing ? 'Edit' : 'Add'} {isBeneficialOwner ? 'Beneficial Owner' : 'Officer'}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                {isBeneficialOwner
                                    ? "Add beneficial owner by email address and assign role"
                                    : "Add company officer by email address and assign position"
                                }
                            </p>
                        </div>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-10 pt-7">
                        {/* Name Field */}
                        <div className="grid md:grid-cols-2 gap-6">

                            <FormFieldInput
                                name="firstName"
                                control={control}
                                placeholder={`Enter name of ${isBeneficialOwner ? 'beneficial owner' : 'officer'}`}
                                label="First Name of user"
                                prefixIcon={
                                    <HugeiconsIcon icon={User03FreeIcons} className="size-4 text-muted-foreground" />

                                }
                            />
                            <FormFieldInput
                                name="lastName"
                                control={control}
                                placeholder={`Enter name of ${isBeneficialOwner ? 'beneficial owner' : 'officer'}`}
                                label="Last Name of user"
                                prefixIcon={
                                    <HugeiconsIcon icon={User03FreeIcons} className="size-4 text-muted-foreground" />

                                }
                            />
                        </div>

                        {/* Role/Position Field */}

                        <FormFieldInput
                            control={control}
                            label={"Role"}
                            placeholder={`Enter ${isBeneficialOwner ? 'role' : 'position'}`}
                            name={"role"}
                            prefixIcon={
                                <HugeiconsIcon icon={Briefcase01Icon} className="size-4 text-muted-foreground" />

                            }
                        />




                        {/* Email Field */}
                        <FormFieldInput
                            name="email"
                            control={control}
                            type="email"
                            placeholder="Enter email address"
                            label="Email Address"
                            prefixIcon={
                                <HugeiconsIcon icon={MailAtSign01Icon} className="size-4 text-muted-foreground" />

                            }
                        />


                        {/* Ownership Percentage - Only for Beneficial Owners */}
                        {isBeneficialOwner && (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">
                                            Percentage Ownership<span className="text-destructive">*</span>
                                        </Label>
                                        <span className={`font-semibold ${(ownershipValue ?? 0) > maxOwnership ? 'text-destructive' : 'text-primary'}`}>
                                            {ownershipValue}%
                                            {(ownershipValue ?? 0) > maxOwnership && ` (Max ${maxOwnership}%)`}
                                        </span>
                                    </div>

                                    <Slider
                                        value={[(ownershipValue ?? 0)]}
                                        onValueChange={handleOwnershipChange}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />

                                    {(ownershipValue ?? 0) > maxOwnership && (
                                        <p className="text-destructive text-xs flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            Ownership cannot exceed {maxOwnership}% to maintain compliance
                                        </p>
                                    )}
                                </div>

                                {/* Compliance Checkbox */}
                                <div className="flex items-start space-x-3 p-4 bg-primary-light/20 rounded-lg">
                                    <Checkbox
                                        id="compliance"
                                        checked={complianceChecked}
                                        onCheckedChange={(checked) => setComplianceChecked(checked as boolean)}
                                        className="mt-0.5"
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="compliance" className="text-sm font-medium text-black">
                                            No Single Owner holds 25% or more
                                        </Label>
                                        <p className="text-xs text-black">
                                            We ask for this to stay compliant with financial regulations
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between pt-6 gap-5">
                            <Button
                                type="button"
                                variant="ghostNavy"
                                onClick={handleCancel}
                                className="flex items-center gap-2 flex-1"
                            >
                                Cancel
                                <X className="h-4 w-4" />
                            </Button>

                            <Button
                                type="submit"
                                disabled={isBeneficialOwner && (ownershipValue ?? 0) > maxOwnership}
                                className="flex items-center gap-2 flex-1"
                            >
                                {isEditing ? 'Update' : 'Add'} {isBeneficialOwner ? 'Owner' : 'Officer'}
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};