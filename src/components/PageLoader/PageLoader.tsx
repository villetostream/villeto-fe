"use client";

import React, { Suspense } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export async function PageLoader({ children, fallback }: PageLoaderProps) {
    return (
        <Suspense
            fallback={
                <ViewTransition>
                    {fallback ?? <DefaultSkeleton />}
                </ViewTransition>
            }
        >
            <ViewTransition>
                {children}
            </ViewTransition>
        </Suspense>
    );
}

function DefaultSkeleton() {
    return (
        <div className="flex  items-center justify-center h-full space-y-4">
            <Loader2 className="h-20 w-20 mr-2 animate-spin" />
            <span className="text-black dark:text-white md:text-2xl">Please wait</span>
        </div>
    );
}
