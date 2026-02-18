
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface EmployeeData {
    id: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
    manager: string;
    corporateCard: boolean;
}

interface EmployeePreviewTableProps {
    data: EmployeeData[];
    onDataChange: (data: EmployeeData[]) => void;
    onDelete: (id: string) => void;
    onUploadDifferent: () => void;
    onInvite: () => void;
}

export default function EmployeePreviewTable({
    data,
    onDataChange,
    onDelete,
    onUploadDifferent,
    onInvite
}: EmployeePreviewTableProps) {

    const handleToggleCard = (id: string, checked: boolean) => {
        const newData = data.map(item => 
            item.id === id ? { ...item, corporateCard: checked } : item
        );
        onDataChange(newData);
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h2 className="text-xl font-semibold">Employee(s) Preview</h2>
                    <p className="text-sm text-gray-500">Below are the employee details extracted from the file</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={onUploadDifferent}
                >
                    Upload a different file
                </Button>
            </div>

            <div className="border rounded-lg flex-1 overflow-hidden relative">
                <div className="absolute inset-0 overflow-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <TableRow>
                                <TableHead className="w-[200px] font-semibold">Full NAME</TableHead>
                                <TableHead className="w-[250px] font-semibold">EMAIL ADDRESS</TableHead>
                                <TableHead className="w-[150px] font-semibold">ROLE</TableHead>
                                <TableHead className="w-[150px] font-semibold">DEPARTMENT</TableHead>
                                <TableHead className="w-[150px] font-semibold">MANAGER</TableHead>
                                <TableHead className="w-[150px] font-semibold text-center">CORPORATE CARD</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                                    <TableCell className="text-gray-500">{employee.email}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                    <TableCell>{employee.department}</TableCell>
                                    <TableCell>{employee.manager}</TableCell>
                                    <TableCell className="text-center">
                                        <Switch 
                                            checked={employee.corporateCard}
                                            onCheckedChange={(checked) => handleToggleCard(employee.id, checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => onDelete(employee.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-end pt-2 flex-shrink-0">
                <Button 
                    className="bg-[#00BFA5] hover:bg-[#00BFA5]/90 min-w-[160px]"
                    onClick={onInvite}
                >
                    Invite Employees
                </Button>
            </div>
        </div>
    );
}
