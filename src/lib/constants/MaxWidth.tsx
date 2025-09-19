import React, { ReactNode } from 'react'
import { cn } from '../utils'

const MaxWidth = ({ children, className }: { children: ReactNode, className: String }) => {
    return (
        <div className={cn("w-full h-full", className)}>
            <div className='max-w-[1560px]  mx-auto h-full'>
                {children}
            </div>

        </div>
    )
}

export default MaxWidth