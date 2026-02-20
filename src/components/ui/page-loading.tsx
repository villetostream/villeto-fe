import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PageLoading() {
    return (
        <div className="flex items-center justify-center h-full max-h-screen space-y-4">
            <Loader2 className="h-20 w-20 mr-2 animate-spin text-primary" />
            <span className="text-primary dark:text-white md:text-2xl">Please wait</span>
        </div>
    );
}