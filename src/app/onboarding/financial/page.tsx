"use client"
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpendingSlider } from "@/components/onboarding/financial/SpendingSlider";
import { BankConnection } from "@/components/onboarding/financial/BankConnection";
import { ConnectBankModal } from "@/components/onboarding/financial/ConnectBankModal";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { HugeiconsIcon } from '@hugeicons/react';
import { Invoice02Icon } from '@hugeicons/core-free-icons';
import OnboardingTitle from "@/components/onboarding/_shared/OnboardingTitle";
import { useRouter } from "next/navigation";

export default function FinancialPulse() {
    const { bankConnected, connectedAccounts } = useOnboardingStore();
    const router = useRouter()

    const canContinue = bankConnected || connectedAccounts.length > 0;

    return (
        <div className="h-full bg-background flex">
            <div className="flex-1 flex flex-col justify-center">

                {/* Header */}
                <div className="text-left mb-12">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-10">
                        <HugeiconsIcon icon={Invoice02Icon} className="size-16 text-primary" />
                    </div>
                    <OnboardingTitle title={"Company Expenditure"} subtitle={"Manage how much your company spends over a period of time"} />

                </div>

                {/* Form Content */}
                <div className="space-y-12">
                    <SpendingSlider />
                    <BankConnection />
                </div>

                {/* Continue Button */}
                <div className="mt-12 flex justify-end">
                    <Button
                        size="lg"
                        disabled={!canContinue}
                        onClick={() => router.push("/onboarding/products")}
                        className={`px-8 py-3 bg-primary hover:bg-villeto-primary-light text-white`}
                    >
                        Continue
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                </div>

            </div>

            <ConnectBankModal />
        </div>
    );
};