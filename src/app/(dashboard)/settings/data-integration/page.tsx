"use client"

import { IntegrationMethodCard } from '@/components/dashboard/settings/IntegrationMethodCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const DataIntegration = () => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const router = useRouter()

    const handleMethodSelect = (method: string) => {
        setSelectedMethod(method);
    }
    const handleContinue = () => {
        if (selectedMethod === "csv") {
            router.push("/settings/data-integration/csv-uploader")
        }
    };
    return (
        <div className=" space-y-10">

            <>
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <IntegrationMethodCard
                        type="integration"
                        selected={selectedMethod === "integration"}
                        onClick={() => handleMethodSelect("integration")}
                    />
                    <IntegrationMethodCard
                        type="csv"
                        selected={selectedMethod === "csv"}
                        onClick={() => handleMethodSelect("csv")}
                    />
                </div>

                <div className="flex justify-end mt-30">
                    <Button
                        onClick={handleContinue}
                        disabled={!selectedMethod}
                        size={"md"}

                        className="gap-2 px-12!"
                    >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </>
        </div>
    )
}

export default DataIntegration