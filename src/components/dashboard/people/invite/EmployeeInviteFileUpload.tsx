
"use client";

import { UploadCloud } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface EmployeeInviteFileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
}

export default function EmployeeInviteFileUpload({
    onFileSelect,
    accept = {
        "text/csv": [".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-excel": [".xls"]
    },
    maxSize = 5 * 1024 * 1024 // 5MB default
}: EmployeeInviteFileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setError(null);
        
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            if (rejection.errors[0].code === "file-too-large") {
                setError(`File too large. Maximum ${Math.round(maxSize / 1024 / 1024)} MB.`);
            } else {
                setError("File type not supported. Please upload CSV or Excel.");
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [maxSize, onFileSelect]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
        noClick: true // We'll handle click with a button
    });

    return (
        <div className="w-full">
            <div className="mb-6 border-b border-gray-200 pb-4">
                            <h1 className="text-2xl font-bold text-gray-900">Employees Invite</h1>
                            <p className="text-gray-500 mt-1">
                                You can choose to upload a CSV with the right details or provide an api
                            </p>
                        </div>
                        
            <div className="flex justify-end mb-4">
                            <Button variant="ghost" className="text-[#00BFA5]">
                                <span className="mr-2">⬇</span> Download a Template
                            </Button>
                        </div>
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ease-in-out
                    flex flex-col items-center justify-center gap-4
                    ${isDragActive ? "border-primary bg-primary/10" : "border-gray-200 bg-white"}
                `}
            >
                <input {...getInputProps()} />
                
                <div className="bg-gray-100 p-4 rounded-full mb-2">
                    <UploadCloud className="w-8 h-8 text-gray-500" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Upload CSV or Excel File</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                    Upload a file with user information to invite multiple users at once
                </p>
                
                <Button 
                    variant="outline" 
                    className="mt-4 border-primary text-primary hover:bg-primary/10 min-w-[140px]"
                    onClick={open}
                >
                    Browse File
                </Button>

                {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
            </div>
            
          
        </div>
    );
}
