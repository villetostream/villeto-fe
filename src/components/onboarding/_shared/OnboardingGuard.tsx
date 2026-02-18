"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/useVilletoStore";

/**
 * Protects onboarding routes by checking for a valid onboardingId.
 * Redirects to /pre-onboarding if no onboardingId is found in the store.
 */
export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { onboardingId } = useOnboardingStore();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!onboardingId) {
            router.replace("/pre-onboarding");
        } else {
            setIsAuthorized(true);
        }
    }, [onboardingId, router]);

    // Don't render children until we've confirmed authorization
    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
