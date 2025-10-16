"use client"

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const steps = [
    { id: 1, title: "Welcome to Villeto", key: "onboarding" },
    { id: 2, title: "Business Snapshot", key: "business" },
    { id: 3, title: "Leadership & Ownership", key: "leadership" },
    { id: 4, title: "Financial Pulse", key: "financial" },
    { id: 5, title: "Choose your Villeto Products", key: "products" },
    { id: 6, title: "Review & Confirmation", key: "review" },
];



export const OnboardingSidebar = () => {
    const pathName = usePathname();
    console.log("Current Pathname:", pathName);
    return (
        <div className="flex-1 bg-navy h-full p-8 flex flex-col rounded-[30px]">
            {/* Logo */}
            <div className="mb-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <span className="text-white font-bold text-lg">V</span>
                    </div>
                    <span className="text-villeto-sidebar-text text-xl font-semibold">Villeto</span>
                </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-1.5 flex-1">
                {steps.map((step, index) => {
                    const isCurrent = step.key === pathName?.split("/").pop();
                    const currentStep = steps.find(s => s.key === pathName?.split("/").pop())?.id || 0;
                    const isCompleted = step.id < currentStep;
                    console.log(pathName?.split("/").pop(), step.key, { currentStep }, { isCurrent }, { isCompleted });
                    const isUpcoming = currentStep + 1;

                    return (
                        <div key={step.id} className="flex items-start gap-5 ">
                            {/* Step indicator */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={cn(
                                        "w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium transition-colors border border-gray-600",
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
    );
};