import React, { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button, type ButtonProps as UIButtonProps } from '../ui/button'
import { LucideIcon } from 'lucide-react' // or your icon library

interface ModalComponentInterface {
    buttonText: String
    isOpen: boolean
    onOpen: () => void;
    title: String
    description?: String
    children: ReactNode
    variant?: UIButtonProps['variant']
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
}

const ModalComponent = ({
    title,
    description,
    buttonText,
    children,
    isOpen,
    onOpen,
    variant = "outline",
    icon: Icon,
    iconPosition = 'left'
}: ModalComponentInterface) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} className="flex items-center gap-2">
                    {Icon && iconPosition === 'left' && <Icon size={16} />}
                    {buttonText}
                    {Icon && iconPosition === 'right' && <Icon size={16} />}
                </Button>
            </DialogTrigger>
            <DialogContent className='!p-6 max-h-[80%] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default ModalComponent