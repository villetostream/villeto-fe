
"use client";

import React, { useState, useEffect } from "react";
import EmployeeInviteFileUpload from "@/components/dashboard/people/invite/EmployeeInviteFileUpload";
import EmployeePreviewTable, { EmployeeData } from "@/components/dashboard/people/invite/EmployeePreviewTable";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function InviteEmployeesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const step = searchParams.get("step") === "preview" ? "preview" : "upload";
    
    const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

    // If we're in preview mode but have no data, redirect to upload
    useEffect(() => {
        if (step === "preview" && employeeData.length === 0) {
           // check if we have data in session storage or similar? 
           // For now, let's just allow it for the flow, or maybe redirect
           // straightforward, the user might reload. For demo, we keep state in component so reload loses data.
           // Ideally we'd persist this but for now let's just redirect if empty
           // actually, for the demo flow, let's just redirect back to upload
           router.replace("/people/invite/employees");
        }
    }, [step, employeeData.length, router]);


    const handleFileSelect = async (file: File) => {
        // Mock parsing logic
        const mockData: EmployeeData[] = Array(20).fill(null).map((_, i) => ({
            id: `emp-${i}`,
            fullName: "Sarah Chen",
            email: "Sarahchen@company.com",
            role: "Employee",
            department: i % 2 === 0 ? "Product" : "Design",
            manager: i % 2 === 0 ? "Andy James" : "James Idris",
            corporateCard: false
        }));
        
        setEmployeeData(mockData);
        // Navigate to preview step
        router.push("/people/invite/employees?step=preview");
    };

    const handleDataChange = (newData: EmployeeData[]) => {
        setEmployeeData(newData);
    };

    const handleDelete = (id: string) => {
        setEmployeeData(prev => prev.filter(item => item.id !== id));
    };

    const handleUploadDifferent = () => {
        setEmployeeData([]);
        router.push("/people/invite/employees");
    };

    const handleInvite = () => {
        console.log("Inviting employees:", employeeData);
        // Implement API call here
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            

            <div className={`bg-white rounded-lg shadow-sm border p-4 ${step === "preview" ? "h-[calc(100vh_-_140px)]" : "min-h-[350px]"}`}>
                
                {step === "upload" ? (
                    <div className="max-w-6xl mx-auto mt-2">
                        <EmployeeInviteFileUpload onFileSelect={handleFileSelect} />
                        
                        
                         <h3 className="font-semibold mt-4 border-t border-gray-200 pt-4">Required Fields</h3>
                         
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                           
                            
                            <div>
                                <h3 className="font-semibold mb-1">Full Name</h3>
                                <p className="text-xs text-gray-500">User's first & last name</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Email Address</h3>
                                <p className="text-xs text-gray-500">User's corporate email address</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Manager</h3>
                                <p className="text-xs text-gray-500">User's assigned manager/team lead</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmployeePreviewTable 
                        data={employeeData}
                        onDataChange={handleDataChange}
                        onDelete={handleDelete}
                        onUploadDifferent={handleUploadDifferent}
                        onInvite={handleInvite}
                    />
                )}
            </div>
        </div>
    );
}
