import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { X, User, Briefcase, Mail, Plus, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface AddBeneficialOwnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (owner: {
        name: string;
        role: string;
        email: string;
        ownership: number;
    }) => void;
    mode?: "beneficial" | "officer";
    editingPerson?: any;
    isOwner?: boolean;
}

interface FormData {
    name: string;
    role: string;
    email: string;
    ownership: number;
    position?: string;
}

export const AddBeneficialOwnerModal = ({
    isOpen,
    onClose,
    onAdd,
    mode = "beneficial",
    editingPerson,
    isOwner
}: AddBeneficialOwnerModalProps) => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset, trigger } = useForm<FormData>({
        defaultValues: {
            name: "",
            role: "",
            email: "",
            ownership: 0,
            position: ""
        }
    });

    const [complianceChecked, setComplianceChecked] = useState(true);
    const ownershipValue = watch("ownership", 0);

    useEffect(() => {
        if (editingPerson) {
            reset({
                name: editingPerson.name || "",
                role: editingPerson.role || "",
                email: editingPerson.email || "",
                ownership: editingPerson.ownership || 0,
                position: editingPerson.position || ""
            });
        } else {
            reset({
                name: "",
                role: "",
                email: "",
                ownership: 0,
                position: ""
            });
        }
    }, [editingPerson, reset, isOpen]);

    const onSubmit = (data: FormData) => {
        if (mode === "beneficial" && data.ownership > 25) {
            return;
        }

        onAdd({
            name: data.name,
            role: mode === "beneficial" ? data.role : data.position || data.role,
            email: data.email,
            ownership: data.ownership
        });
        reset();
    };

    const handleCancel = () => {
        onClose();
        reset();
    };

    const handleOwnershipChange = (value: number[]) => {
        setValue("ownership", value[0], { shouldValidate: true });
    };

    const isEditing = !!editingPerson;
    const isBeneficialOwner = mode === "beneficial" || isOwner;
    const maxOwnership = 25;
    console.log({ isBeneficialOwner })

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <DialogTitle className="text-lg font-semibold">
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Name of User<span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                placeholder={`Enter name of ${isBeneficialOwner ? 'beneficial owner' : 'officer'}`}
                                className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    }
                                })}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-destructive text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Role/Position Field */}
                    <div className="space-y-2">
                        <Label htmlFor={isBeneficialOwner ? "role" : "position"} className="text-sm font-medium">
                            {isBeneficialOwner ? "Role" : "Position"}<span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id={isBeneficialOwner ? "role" : "position"}
                                placeholder={`Enter ${isBeneficialOwner ? 'role' : 'position'}`}
                                className={`pl-10 ${errors.role ? 'border-destructive' : ''}`}
                                {...register(isBeneficialOwner ? "role" : "position", {
                                    required: `${isBeneficialOwner ? "Role" : "Position"} is required`,
                                    minLength: {
                                        value: 2,
                                        message: `${isBeneficialOwner ? "Role" : "Position"} must be at least 2 characters`
                                    }
                                })}
                            />
                        </div>
                        {errors.role && (
                            <p className="text-destructive text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address<span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-destructive text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Ownership Percentage - Only for Beneficial Owners */}
                    {isBeneficialOwner && (
                        <>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Percentage Ownership<span className="text-destructive">*</span>
                                    </Label>
                                    <span className={`font-semibold ${ownershipValue > maxOwnership ? 'text-destructive' : 'text-primary'}`}>
                                        {ownershipValue}%
                                        {ownershipValue > maxOwnership && ` (Max ${maxOwnership}%)`}
                                    </span>
                                </div>

                                <Slider
                                    value={[ownershipValue]}
                                    onValueChange={handleOwnershipChange}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />

                                {ownershipValue > maxOwnership && (
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
                            disabled={isBeneficialOwner && ownershipValue > maxOwnership}
                            className="flex items-center gap-2 flex-1"
                        >
                            {isEditing ? 'Update' : 'Add'} {isBeneficialOwner ? 'Owner' : 'Officer'}
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};