"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button, type ButtonProps as UIButtonProps } from "@/components/ui/button"

interface ConfirmDialogProps {
    title: string
    description: string
    confirmText: string
    cancelText: string
    isOpen: boolean
    loading: boolean
    onOpenChange?: (open: boolean) => void;
    onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>
    buttonText: String
    variant?: UIButtonProps['variant']

}

export function ConfirmDialog({
    title,
    description,
    isOpen,
    loading,
    onOpenChange,
    confirmText,
    cancelText,
    onConfirm,
    variant = "default",
}: ConfirmDialogProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}  >

            <DialogContent>

                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter >
                    <Button
                        variant="outline"
                        disabled={loading}
                        onClick={() => onOpenChange?.(true)}
                    >
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm} disabled={loading} variant={variant}>
                        {loading ? "Loading..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog >
    )
}