"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, MessageSquare, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import OnboardingTitle from "@/components/onboarding/_shared/OnboardingTitle";
import CircleProgress from "@/components/HalfProgressCircle";
import { useOnboardingStore } from "@/stores/useVilletoStore";
import { useStartOnboardingApi } from "@/actions/pre-onboarding/get-started";
import { toast } from "sonner";
import { registrationSchema } from "@/lib/schemas/schemas";


type FormData = z.infer<typeof registrationSchema>;

export default function GetStarted() {
    const router = useRouter();
    const onboarding = useOnboardingStore()
    const startOnboarding = useStartOnboardingApi();
    const loading = startOnboarding.isPending;

    console.log(onboarding.preOnboarding)

    const form = useForm<FormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            contactFirstName: onboarding.preOnboarding?.contactFirstName ?? "",
            contactLastName: onboarding.preOnboarding?.contactLastName ?? "",
            companyName: onboarding.preOnboarding?.companyName ?? "",
            accountType: onboarding.preOnboarding?.accountType ?? undefined, // Explicitly undefined to ensure selection
            contactEmail: onboarding.contactEmail
        },
    });
    useEffect(() => {
        if (onboarding.preOnboarding) {
            form.reset({
                contactFirstName: onboarding.preOnboarding.contactFirstName || "",
                contactLastName: onboarding.preOnboarding.contactLastName || "",
                companyName: onboarding.preOnboarding.companyName || "",
                accountType: onboarding.preOnboarding.accountType || undefined,
                contactEmail: onboarding.contactEmail || "",
            });
        }
    }, [onboarding.preOnboarding, onboarding.contactEmail]);

    const onSubmit = async (data: FormData) => {
        console.log(data);
        try {
            const response = await startOnboarding.mutateAsync(data);
            console.log({ response })
            onboarding.setPreOnboarding(data);
            onboarding.setOnboardingId(response.data.onboardingId as string);
            router.push("/onboarding");
        } catch (error: any) {
            toast.error(error.message);
        }
        // Store email for next steps
    };

    const accountType = form.watch("accountType");

    return (
        <div className="h-full flex flex-col lg:justify-center pb-10">
            <div className=' p-10 flex w-full items-center justify-between'>
                <div>
                    <img src="/images/logo.png" className='h-14 w-32 object-cover' />
                </div>
                <CircleProgress currentStep={2} />
            </div>

            <div className=" px-[6.43777%] flex flex-col">
                <div className="mb-8">
                    <img
                        src={"/images/svgs/chart-rose.svg"}
                        alt="Welcome celebration"
                        className="size-16"
                    />
                </div>

                <div className="space-y-3.5 pr-10">
                    <OnboardingTitle
                        title="Get started with Villeto"
                        subtitle="Fill in your details to access a live demo or apply for a Villeto account."
                    />
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="contactFirstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            First Name<span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter first name" {...field} className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactLastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Last Name<span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter last name" {...field} className="h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Company Name<span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your official company name" {...field} className="h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        How would you like to use Villeto?<span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                                        >
                                            {/* DEMO OPTION */}
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5">
                                                    <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "demo"
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50"
                                                        }`}>
                                                        <FormControl>
                                                            <RadioGroupItem value="demo" className="sr-only" />
                                                        </FormControl>
                                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${field.value === "demo"
                                                            ? "border-primary bg-primary"
                                                            : "border-gray-400"
                                                            }`}>
                                                            {field.value === "demo" && (
                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium">I want a Demo account</span>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>

                                            {/* ENTERPRISE OPTION */}
                                            <FormItem>
                                                <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/5">
                                                    <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "enterprise"
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50"
                                                        }`}>
                                                        <FormControl>
                                                            <RadioGroupItem value="enterprise" className="sr-only" />
                                                        </FormControl>
                                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${field.value === "enterprise"
                                                            ? "border-primary bg-primary"
                                                            : "border-gray-400"
                                                            }`}>
                                                            {field.value === "enterprise" && (
                                                                <div className="h-2 w-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium">I want to apply for Villeto</span>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"

                                variant="ghost"
                                className="flex-1 text-base font-semibold bg-gray-200"
                                onClick={() => window.open("mailto:sales@villeto.com")}
                                disabled={loading}

                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Talk to Sales
                            </Button>
                            <Button
                                variant={"hero"}
                                type="submit"

                                className="flex-1 text-base font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Continue"}
                                {loading ? <Loader2 className="animate-spin size-6" /> : <svg
                                    className="ml-2 h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};