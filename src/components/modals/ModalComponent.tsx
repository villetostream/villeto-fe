import React, { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button, type ButtonProps as UIButtonProps } from '../ui/button'
import { LucideIcon } from 'lucide-react' // or your icon library
import { ArrowDown2, Filter } from 'iconsax-reactjs'

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
                <Button variant={variant} size="md" className="flex items-center gap-2">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    <ArrowDown2 />
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