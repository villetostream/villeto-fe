"use client"

import { useState } from "react";
import { ArrowLeft, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BulkInvite() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        // Handle bulk invite
        console.log("File:", file);
        router.push("/people");
    };

    const requiredFields = [
        { name: "Email Address", description: "User's corporate email address" },
        { name: "First Name", description: "User's first name" },
        { name: "Last Name", description: "User's last name" },
        { name: "Department", description: "User's department" },
        { name: "Location", description: "User's official location" },
        { name: "Role", description: "User's role in the company" },
        { name: "Manager", description: "User's assigned manager/team lead" },
        { name: "Phone Number", description: "User's phone number (optional)" },
    ];

    return (
        <div className="flex min-h-screen flex-col">


            <main className="flex-1 p-8">
                <div className=" space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/people")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">Bulk Invite Users</h1>
                            <p className="text-sm text-muted-foreground">
                                Choose an option to invite multiple users to Villeto
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Bulk User Import</h3>
                                <Button variant="link" className="gap-2 text-primary">
                                    <Download className="h-4 w-4" />
                                    Download a Template
                                </Button>
                            </div>

                            <div className="rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
                                <div className="mx-auto flex max-w-md flex-col items-center gap-4">
                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-medium">Upload CSV or Excel File</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Upload a file with user information to invite multiple users at once
                                        </p>
                                    </div>
                                    <Button onClick={() => document.getElementById("file-upload")?.click()}>
                                        Browse File
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {file && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected: {file.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border p-6">
                            <h3 className="mb-4 text-lg font-semibold">Required Fields</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {requiredFields.map((field) => (
                                    <div key={field.name}>
                                        <div className="flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
                                            <div>
                                                <p className="font-medium">{field.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {field.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                            <p className="text-muted-foreground">
                                Upload a file to see the preview of users to be invited
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => router.push("/people")}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!file}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Next →
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}