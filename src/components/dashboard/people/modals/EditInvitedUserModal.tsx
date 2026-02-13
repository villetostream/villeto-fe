"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface LeadershipInviteForm {
    id: string; // Added ID for editing
    email: string;
    name: string;
    role: string;
    department: string;
    issueCard: boolean;
    ownershipPercentage?: number;
}

interface EditInvitedUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: LeadershipInviteForm | null;
    onSave: (updatedUser: LeadershipInviteForm) => void;
}

export function EditInvitedUserModal({
    isOpen,
    onClose,
    user,
    onSave,
}: EditInvitedUserModalProps) {
    const { register, handleSubmit, reset, control, watch, setValue } = useForm<LeadershipInviteForm>();
    const [complianceChecked, setComplianceChecked] = useState(true);

    // Watch values for conditional rendering
    const selectedRole = watch("role");
    const ownershipValue = watch("ownershipPercentage");

    useEffect(() => {
        if (user) {
            reset({
                ...user,
                // Ensure defaults to avoid uncontrolled inputs
                department: user.department || "",
                ownershipPercentage: user.ownershipPercentage || 0,
            });
            setComplianceChecked(true); // Reset compliance check on open/user change logic could be better but sufficient for demo
        }
    }, [user, reset, isOpen]);

    const onSubmit = (data: LeadershipInviteForm) => {
        if (selectedRole === "Organization Owner" && (data.ownershipPercentage ?? 0) > 25 && !complianceChecked) {
             // Ideally show error, but preventing submit is basic safeguard
            return;
        }
        onSave(data);
        onClose();
    };

    const isOrganizationOwner = selectedRole === "Organization Owner";
    const isControllingOfficer = selectedRole === "Controlling Officer";
    const maxOwnership = 25;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit User Details</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-email" className="text-sm font-medium">
                            Email Address<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit-email"
                            placeholder="Emma@company.com"
                            {...register("email", { required: true })}
                        />
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-sm font-medium">
                            Name<span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit-name"
                            placeholder="Emmanuel John"
                            {...register("name", { required: true })}
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-role" className="text-sm font-medium">
                            User Type/Role<span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            control={control}
                            name="role"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Organization Owner">Organization Owner</SelectItem>
                                        <SelectItem value="Controlling Officer">Controlling Officer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                     {/* Department - Hidden for Org Owner */}
                     {!isOrganizationOwner && (
                        <div className="space-y-2">
                            <Label htmlFor="edit-department" className="text-sm font-medium">
                                Department
                                {isControllingOfficer ? (
                                    <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                                ) : (
                                    <span className="text-red-500">*</span>
                                )}
                            </Label>
                            <Controller
                                control={control}
                                name="department"
                                rules={{ required: !isControllingOfficer }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Product">Product</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    )}

                    {/* Percentage Ownership - Only for Org Owner */}
                    {isOrganizationOwner && (
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Percentage Ownership<span className="text-red-500">*</span>
                                </Label>
                                <span className={`font-semibold ${(ownershipValue ?? 0) > maxOwnership ? 'text-[#00BFA5]' : 'text-[#00BFA5]'}`}>
                                    {ownershipValue}%
                                </span>
                            </div>

                            <Controller
                                control={control}
                                name="ownershipPercentage"
                                render={({ field }) => (
                                    <Slider
                                        value={[field.value || 0]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                )}
                            />

                            {/* Compliance Checkbox */}
                             <div className="flex items-start space-x-3 p-3 bg-[#E0F2F1] rounded-lg mt-2">
                                    <Checkbox
                                        id="edit-compliance"
                                        checked={true} // Visual only for now as per design in onboarding
                                        className="mt-0.5 data-[state=checked]:bg-[#00BFA5] border-gray-300"
                                        disabled
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-compliance" className="text-sm font-medium text-gray-900">
                                            No Single Owner holds 25% or more
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                            We ask for this to stay compliant with financial regulations
                                        </p>
                                    </div>
                                </div>
                        </div>
                    )}

                    {/* Corporate Card */}
                    <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-sm font-medium">Issue Corporate Card</p>
                                <p className="text-xs text-gray-500">Automatically issue a corporate card</p>
                            </div>
                            <Controller
                                control={control}
                                name="issueCard"
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#00BFA5] hover:bg-[#00BFA5]/90">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
