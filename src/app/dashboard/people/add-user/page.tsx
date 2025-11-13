"use client"

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function AddSingleUser() {
    const router = useRouter();
    const [issueCorporateCard, setIssueCorporateCard] = useState(false);
    const [formData, setFormData] = useState({
        userType: "",
        email: "",
        name: "",
        phoneNumber: "",
        department: "",
        location: "",
        jobTitle: "",
    });

    const handleSubmit = () => {
        // Handle user creation
        console.log({ ...formData, issueCorporateCard });
        router.push("/people");
    };

    return (
        <div className="flex min-h-screen flex-col">


            <main className="flex-1 p-8">
                <div className="mx-auto max-w-3xl space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/people")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">Add Single User</h1>
                            <p className="text-sm text-muted-foreground">
                                Choose an option to invite a new user to Villeto
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 rounded-lg border p-6">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold">User Information</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="userType">User Type/Role*</Label>
                                    <Select
                                        value={formData.userType}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, userType: value }))
                                        }
                                    >
                                        <SelectTrigger id="userType">
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="employee">Employee</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address*</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Type email address"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name*</Label>
                                    <Input
                                        id="name"
                                        placeholder="Type full name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        placeholder="Type phone number"
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Work Information</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department*</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, department: value }))
                                        }
                                    >
                                        <SelectTrigger id="department">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="finance">Finance</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="engineering">Engineering</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location*</Label>
                                    <Select
                                        value={formData.location}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, location: value }))
                                        }
                                    >
                                        <SelectTrigger id="location">
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ny">New York City</SelectItem>
                                            <SelectItem value="sf">San Francisco</SelectItem>
                                            <SelectItem value="chi">Chicago</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="jobTitle">Job Title*</Label>
                                    <Input
                                        id="jobTitle"
                                        placeholder="e.g Software Engineer"
                                        value={formData.jobTitle}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-lg font-semibold">Corporate Card</h3>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="font-medium">Issue Corporate Card</p>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically issue a corporate card upon account creation
                                    </p>
                                </div>
                                <Switch
                                    checked={issueCorporateCard}
                                    onCheckedChange={setIssueCorporateCard}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => router.push("/people")}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                                Next →
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}