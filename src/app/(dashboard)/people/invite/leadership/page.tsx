
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, UserPlus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllDepartmentsApi } from "@/actions/departments/get-all-departments";
import { useGetAllRolesApi } from "@/actions/role/get-all-roles";
import { EditInvitedUserModal } from "@/components/dashboard/people/modals/EditInvitedUserModal";

interface LeadershipInviteForm {
    id: string;
    email: string;
    name: string;
    role: string;
    department: string;
    issueCard: boolean;
    ownershipPercentage?: number;
}

export default function InviteLeadershipPage() {
    const router = useRouter();
    const [invitedUsers, setInvitedUsers] = useState<LeadershipInviteForm[]>([]);
    const { register, handleSubmit, reset, control, watch, setValue } = useForm<LeadershipInviteForm>();
    const { data: departments } = useGetAllDepartmentsApi();
    const rolesApi = useGetAllRolesApi();

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<LeadershipInviteForm | null>(null);

    // Watch dynamic fields
    const selectedRole = watch("role", "");
    const ownershipValue = watch("ownershipPercentage", 0);
    const issueCard = watch("issueCard", false);

    const isOrganizationOwner = selectedRole === "Organization Owner";
    const isControllingOfficer = selectedRole === "Controlling Officer";
    const maxOwnership = 25;

    const onSubmit = (data: LeadershipInviteForm) => {
        const newUser: LeadershipInviteForm = {
            ...data,
            id: Date.now().toString(), // Simple ID generation
            role: selectedRole,
            // Ensure ownership is handled
            ownershipPercentage: isOrganizationOwner ? data.ownershipPercentage : undefined,
        };
        
        setInvitedUsers((prev) => [...prev, newUser]);
        
        // Reset form but keep some defaults if needed, or clear all
        reset({
            email: "",
            name: "",
            role: "", // Reset role to force re-selection or keep? Usually reset.
            department: "",
            issueCard: false,
            ownershipPercentage: 0
        });
    };

    const handleEditUser = (user: LeadershipInviteForm) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = (updatedUser: LeadershipInviteForm) => {
        setInvitedUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (userId: string) => {
        setInvitedUsers((prev) => prev.filter((u) => u.id !== userId));
    };


    return (
        <div className="p-6 max-w-7xl mx-auto flex gap-6">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Leadership & Admin Invite</h1>
                    <p className="text-gray-500 mt-1">
                        These are for managers, finance admin, Organization owner and auditors.
                    </p>
                    <Link href="#" className="text-sm text-[#00BFA5] hover:underline block mt-1">View Permissions</Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold mb-6">User Information</h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address<span className="text-red-500">*</span>
                            </Label>
                            <Input 
                                id="email" 
                                placeholder="Emma@company.com" 
                                {...register("email", { required: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Name<span className="text-red-500">*</span>
                            </Label>
                            <Input 
                                id="name" 
                                placeholder="Emmanuel John" 
                                {...register("name", { required: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-medium">
                                User Type/Role<span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="role"
                                rules={{ required: true }}
                                render={({ field }) => (
                                        <Select 
                                            onValueChange={(val) => {
                                                if (val === "__create_custom") {
                                                    router.push("/people/create-role");
                                                } else {
                                                    field.onChange(val);
                                                }
                                            }} 
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={rolesApi.isLoading ? "Loading roles…" : "Select Role"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rolesApi.isLoading ? (
                                                    <SelectItem value="__loading" disabled>Loading…</SelectItem>
                                                ) : (rolesApi.data?.data ?? []).length === 0 ? (
                                                    <SelectItem value="__empty" disabled>No roles available</SelectItem>
                                                ) : (
                                                    (rolesApi.data?.data ?? []).map((role: any) => (
                                                        <SelectItem key={role.roleId ?? role.id ?? role.name} value={role.name}>
                                                            {role.name?.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                                                        </SelectItem>
                                                    ))
                                                )}
                                                <SelectItem value="__create_custom" className="text-primary font-medium border-t mt-1 cursor-pointer">
                                                    + Create custom role
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                            
                        </div>

                         {/* Department - Hidden for Org Owner */}
                         {!isOrganizationOwner && (
                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-sm font-medium">
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
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Percentage Ownership<span className="text-red-500">*</span>
                                    </Label>
                                    <span className={`font-semibold text-[#00BFA5]`}>
                                        {ownershipValue || 0}%
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
                                <div className="flex items-start space-x-3 p-4 bg-[#E0F2F1] rounded-lg mt-2">
                                    <div className="flex items-center h-5">
                                        {/* Visual Checkbox - Logic handled by validation usually */}
                                        <div className="h-4 w-4 rounded border-gray-300 bg-[#00BFA5] text-white flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-900">
                                            No Single Owner holds 25% or more
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                            We ask for this to stay compliant with financial regulations
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div className="pt-4 border-t">
                            <h3 className="text-base font-medium mb-4">Corporate Card</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Issue Corporate Card</p>
                                    <p className="text-xs text-gray-500">Automatically issue a corporate card upon account creation</p>
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

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" className="bg-[#00BFA5] hover:bg-[#00BFA5]/90 w-full sm:w-auto min-w-[120px]">
                                Add User
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Users Added List */}
            <div className="hidden lg:block w-1/2">
                <div className="bg-white rounded-lg shadow-sm border min-h-[600px] flex flex-col">
                    <div className="p-4 border-b flex items-center gap-2">
                        <h3 className="font-semibold">Users Added</h3>
                         <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600">
                            {invitedUsers.length}
                        </span>
                    </div>
                    
                    {invitedUsers.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="bg-gray-50 p-4 rounded-xl mb-4">
                                <UserPlus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No users added yet</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Use the entry form to start adding users that you want to invite.
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[600px]">
                            {/* Table Header like */}
                            <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 pb-2 px-2 border-b">
                                <div className="col-span-4">Full name</div>
                                <div className="col-span-4">Email</div>
                                <div className="col-span-3">Role</div>
                                <div className="col-span-1"></div>
                            </div>
                            
                            {invitedUsers.map((user) => (
                                <div key={user.id} className="grid grid-cols-12 items-center text-sm py-3 px-2 hover:bg-gray-50 border-b last:border-0 transition-colors">
                                    <div className="col-span-4 font-medium text-gray-900 truncate pr-2" title={user.name}>{user.name}</div>
                                    <div className="col-span-4 text-gray-500 truncate pr-2" title={user.email}>{user.email}</div>
                                    <div className="col-span-3 text-gray-900 truncate">{user.role}</div>
                                    <div className="col-span-1 flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleEditUser(user)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="p-4 border-t mt-auto">
                         <Button 
                            className="w-full bg-[#00BFA5] hover:bg-[#00BFA5]/90"
                            disabled={invitedUsers.length === 0}
                         >
                            Invite User(s)
                        </Button>
                    </div>
                </div>
            </div>

            <EditInvitedUserModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={editingUser}
                onSave={handleUpdateUser}
            />
        </div>
    );
}
