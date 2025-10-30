"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageSquare, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import OnboardingTitle from "@/components/onboarding/_shared/OnboardingTitle";
import CircleProgress from "@/components/HalfProgressCircle";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    companyName: z.string().min(1, "Company name is required").max(200),
    accountType: z.enum(["demo", "apply"], {
        message: "Please select an account type",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function GetStarted() {
    const router = useRouter();
    const [accountType, setAccountType] = useState<"demo" | "apply" | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            companyName: "",
        },
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
        // Store email for next steps
        localStorage.setItem("userEmail", `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}@xyztechnologies.com`);
        localStorage.setItem("userName", data.firstName);
        router.push("/onboarding");
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className='absolute top-0 left-0 mb-auto p-10 flex w-full items-center justify-between'>
                <div>
                    <img src="/images/logo.png" className='h-14 w-32 object-cover' />
                </div>
                <CircleProgress currentStep={2} />
            </div>

            <div className="">
                <div className="mb-8">
                    <img
                        src={"/images/svgs/chart-rose.svg"}
                        alt="Welcome celebration"
                        className="size-16 mb-6"
                    />
                </div>

                <div className="space-y-3.5 pr-10">
                    <OnboardingTitle title="Get started with Villeto"
                        subtitle="Fill in your details to access a live demo or apply for a Villeto account."
                    />
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="firstName"
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
                                name="lastName"
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div
                                            onClick={() => {
                                                setAccountType("demo");
                                                field.onChange("demo");
                                            }}
                                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${accountType === "demo"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <Checkbox
                                                checked={accountType === "demo"}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setAccountType("demo");
                                                        field.onChange("demo");
                                                    }
                                                }}
                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <span className="font-medium">I want a Demo account</span>
                                        </div>

                                        <div
                                            onClick={() => {
                                                setAccountType("apply");
                                                field.onChange("apply");
                                            }}
                                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${accountType === "apply"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <Checkbox
                                                checked={accountType === "apply"}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setAccountType("apply");
                                                        field.onChange("apply");
                                                    }
                                                }}
                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <span className="font-medium">I want to apply for Villeto</span>
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 h-14 text-base font-semibold bg-gray-200"
                                onClick={() => window.open("mailto:sales@villeto.com")}
                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Talk to Sales
                            </Button>
                            <Button
                                variant={"hero"}
                                type="submit"
                                className="flex-1 h-14 text-base font-semibold"
                            >
                                Continue
                                <svg
                                    className="ml-2 h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

