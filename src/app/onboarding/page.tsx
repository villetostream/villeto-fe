"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();

    const handleStart = () => {
        router.push("/onboarding/business");
    };

    return (
        <div className=" flex flex-col items-start justify-center h-full ">
            <div className="mb-8">
                <img
                    src={"/images/welcome.png"}
                    alt="Welcome celebration"
                    className="w-32 h-32 mx-auto mb-6"
                />
            </div>

            <div className="space-y-3.5 pr-10">
                <h1 className="text-3xl leading-11 font-bold text-black ">
                    Welcome to Villeto <span className="inline-block">🖐</span> - let us setup your company account.
                </h1>

                <p className="text-base font-normal text-muted-foreground">
                    It takes just 5 minutes to get started
                </p>
            </div>

            <div className="pt-8 flex w-full items-center  justify-end gap-4">

                <Button
                    onClick={handleStart}
                    variant={"hero"}
                    className="px-8 py-6 text-lg font-medium min-w-[250px]"
                >
                    Let's Begin
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};