import React, { ReactNode, forwardRef } from 'react';
import { cn } from '../utils';

interface MaxWidthProps {
    children: ReactNode;
    className?: string;
    'data-bg-color'?: string; // For explicit color fallbacks
}

// Use forwardRef to pass ref to the outer div
const MaxWidth = forwardRef<HTMLDivElement, MaxWidthProps>(
    ({ children, className, 'data-bg-color': dataBgColor }, ref) => {
        return (
            <div ref={ref} className={cn('w-full h-full', className)} data-bg-color={dataBgColor}>
                <div className="max-w-[1560px] mx-auto h-full">
                    {children}
                </div>
            </div>
        );
    }
);

MaxWidth.displayName = 'MaxWidth'; // For React DevTools

export default MaxWidth;