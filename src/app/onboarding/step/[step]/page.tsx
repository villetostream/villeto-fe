"use client";

import { useRouter, useParams } from "next/navigation";
import { steps } from "@/components/onboarding/stepsConfig";

export default function OnboardingStepPage() {
    const router = useRouter();
    const { step } = useParams();
    const stepIndex = parseInt(step as string, 10) - 1;

    if (isNaN(stepIndex) || stepIndex < 0 || stepIndex >= steps.length) {
        return <div>Invalid step</div>;
    }

    const StepComponent = steps[stepIndex].component;

    return (
        <StepComponent
            onNext={() => {
                if (stepIndex + 1 < steps.length) {
                    router.push(`/onboarding/step/${stepIndex + 2}`);
                }
            }}
            onBack={() => {
                if (stepIndex > 0) {
                    router.push(`/onboarding/step/${stepIndex}`);
                }
            }}
        />
    );
}
