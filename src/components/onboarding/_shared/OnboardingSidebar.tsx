"use client"

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/useVilletoStore";

import { ONBOARDING_STEPS as steps } from "@/lib/constants/onboarding-steps";

export const OnboardingSidebar = () => {
    const pathName = usePathname();
    const router = useRouter();
    const { stoppedAtStep } = useOnboardingStore();

    console.log("Current Pathname:", pathName);

    // Function to handle step click
    const handleStepClick = (stepKey: string, stepId: number, currentStep: number) => {
        // Only navigate if the step is completed (stepId < currentStep)
        if (stepId < currentStep) {
            if (stepId == 1) {
                router.push(`/onboarding`);
                return;
            }
            router.push(`/onboarding/${stepKey}`);
        }
    };

    return (
        <div className="flex-1 max-w-[660px] h-full bg-contain bg-no-repeat rounded-[30px] relative overflow-hidden" style={{ backgroundImage: "url('/onboarding-layout.webp')" }}>

            <img src="/onboarding-layout.webp" className="h-full w-full rounded-[30px]" />
            {/* Logo */}
            <div className="bg-navy/80 absolute  p-8  top-0 bottom-0 left-0 right-0 w-full h-full flex flex-col rounded-[30px]">

                <div className="mb-8">
                    <div>
                        <img src="/images/logo.png" className='h-16 w-40 object-cover' />
                    </div>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-1.5 flex-1">
                    {steps.map((step, index) => {
                        const pathSegment = pathName?.split("/").pop();
                        const isVerifyOtp = pathName?.includes('verify-otp');
                        
                        const isCurrent = step.key === pathSegment || (step.id === 1 && isVerifyOtp);
                        const currentStepObj = steps.find(s => s.key === pathSegment);
                        let currentStep = currentStepObj?.id || 0;
                        
                        // If we are on verify-otp, use stoppedAtStep if available, otherwise default to 1
                        if (currentStep === 0 && isVerifyOtp) {
                            currentStep = stoppedAtStep || 1; 
                        }

                        const isCompleted = step.id < currentStep && !isVerifyOtp; // Don't mark as completed if we are on it
                        const isUpcoming = currentStep + 1;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-start gap-5",
                                    {
                                        "cursor-pointer hover:opacity-80 transition-opacity": isCompleted,
                                        "cursor-default": !isCompleted
                                    }
                                )}
                                onClick={() => handleStepClick(step.key, step.id, currentStep)}
                            >
                                {/* Step indicator */}
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className={cn(
                                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors border border-gray-600",
                                            {
                                                "bg-primary text-white border-0": isCompleted,
                                                "bg-transparent text-white border border-primary": isUpcoming === step.id || currentStep === step.id,
                                            }
                                        )}
                                    >
                                        <div className={cn("w-5 h-5 rounded-full bg-gray-600 border border-gray-600", {
                                            "bg-navy text-white": isCompleted,
                                            "bg-primary text-white border-primary border": (isUpcoming != step.id) && isCurrent,
                                        })} />
                                    </div>
                                    {/* Connector line */}
                                    {index < steps.length - 1 && (
                                        <div className="w-px h-9 bg-gray-500 mt-2" />
                                    )}
                                </div>

                                {/* Step content */}
                                <div className="flex-1 ">
                                    <div className="text-sm leading-[100%] text-white mb-2.5">
                                        STEP {step.id}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-lg leading-[100%] font-semibold ",
                                            "text-white"
                                        )}
                                    >
                                        {step.title}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};