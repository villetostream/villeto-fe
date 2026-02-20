
"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

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
    onSaveToDirectory: () => void;
    onSaveAndInviteAll: () => void;
    isDeleting?: boolean;
}

const PAGE_SIZE = 10;

export default function EmployeePreviewTable({
    data,
    onDataChange,
    onDelete,
    onUploadDifferent,
    onSaveToDirectory,
    onSaveAndInviteAll,
    isDeleting = false,
}: EmployeePreviewTableProps) {
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({
        open: false,
        id: "",
        name: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
    const paginatedData = data.slice(startIndex, endIndex);

    const handleToggleCard = (id: string, checked: boolean) => {
        const newData = data.map(item =>
            item.id === id ? { ...item, corporateCard: checked } : item
        );
        onDataChange(newData);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteModal({ open: true, id, name });
    };

    const handleConfirmDelete = () => {
        onDelete(deleteModal.id);
        setDeleteModal({ open: false, id: "", name: "" });
        // Reset to page 1 if current page would be empty after deletion
        if (paginatedData.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisible = 7;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            if (start > 2) pages.push(-1); // ellipsis
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push(-1); // ellipsis
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <>
            <div className="flex flex-col h-full space-y-4">
                <div className="flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold">Preview</h2>
                        <p className="text-sm text-gray-500">Below are the details extracted from the file</p>
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
                                    <TableHead className="w-[150px] font-semibold">DEPARTMENT</TableHead>
                                    <TableHead className="w-[150px] font-semibold">ROLE</TableHead>
                                    <TableHead className="w-[150px] font-semibold">MANAGER</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">{employee.fullName}</TableCell>
                                        <TableCell className="text-gray-500">{employee.email}</TableCell>
                                        <TableCell>{employee.department}</TableCell>
                                        <TableCell>{employee.role}</TableCell>
                                        <TableCell>{employee.manager}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteClick(employee.id, employee.fullName)}
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

                {/* Pagination */}
                {totalItems > 0 && (
                    <div className="flex items-center justify-between flex-shrink-0">
                        <span className="text-sm text-gray-500">
                            Showing {startIndex + 1}-{endIndex} of {totalItems} entries
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>
                            {getPageNumbers().map((page, i) =>
                                page === -1 ? (
                                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "default" : "ghost"}
                                        size="sm"
                                        className={`w-8 h-8 p-0 text-sm ${page === currentPage ? "bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white" : ""}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        className="border-[#00BFA5] text-[#00BFA5] hover:bg-[#00BFA5]/5 hover:text-[#00BFA5] min-w-[160px]"
                        onClick={onSaveToDirectory}
                    >
                        Save to Directory
                    </Button>
                    <Button
                        className="bg-[#00BFA5] hover:bg-[#00BFA5]/90 min-w-[160px]"
                        onClick={onSaveAndInviteAll}
                    >
                        Save and Invite All
                    </Button>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <Dialog open={deleteModal.open} onOpenChange={(open) => !open && setDeleteModal({ open: false, id: "", name: "" })}>
                <DialogContent className="sm:max-w-[400px] p-6 bg-white rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">Delete Employee</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-2">
                            Are you sure you want to remove <span className="font-medium text-gray-700">{deleteModal.name}</span> from the directory? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ open: false, id: "", name: "" })}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="flex-1"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

