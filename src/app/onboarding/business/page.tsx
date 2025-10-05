"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import OnboardingTitle from "@/components/onboarding/_shared/OnboardingTitle";
import { useOnboardingStore } from "@/stores/useVilletoStore";

const schema = z.object({
    business_name: z.string().min(1, "Company name is required").min(2, "Must be at least 2 characters").max(100),
    // admin_name: z.string().min(1, "Admin name is required").min(2, "Must be at least 2 characters").max(100).regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    // admin_email: z.string().min(1, "Email is required").email("Invalid email address"),
    // password: z.string().min(1, "Password is required").min(12, "Password must be at least 12 characters"),
    contact_number: z.string().min(1, "Contact number is required").min(12, "Contact number must be at least 12 characters"),
    country: z.string().min(1, "Please select a country"),
    // currency: z.string().min(1, "Please select a currency"),
    business_website: z.httpUrl().optional(),
});

export default function Business() {
    const router = useRouter();
    const { businessSnapshot, updateBusinessSnapshot } = useOnboardingStore();

    const form = useForm({
        resolver: zodResolver(schema), mode: 'onChange',
        defaultValues: {
            business_name: businessSnapshot.businessName || "",
            contact_number: businessSnapshot.contactNumber || "",
            country: businessSnapshot.countryOfRegistration || "",
            business_website: businessSnapshot.website || "",
        }
    });

    async function onSubmit(data: any) {
        try {
            // Update the store with form data
            updateBusinessSnapshot({
                businessName: data.business_name,
                contactNumber: data.contact_number,
                countryOfRegistration: data.country,
                website: data.business_website,
            });

            router.push("/onboarding/leadership");
        }
        catch (e) {
            console.warn(e)
        }
    }

    return (
        <div className="space-y-8 flex flex-col  justify-center h-full">
            <div className="text-left ">
                <div className="w-16 h-16 bg-primary-light rounded-full flex ">
                    <Building2 className="h-8 w-8 text-primary" />
                </div>

                <OnboardingTitle title="Tell us more about your Business"
                    subtitle="
                    Tell us about your business"
                />
            </div>
            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">


                    <FormField control={form.control} name="business_name"
                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>Business Naame</FormLabel>
                                <FormControl>

                                    <Input  {...field} placeholder="Enter your business name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField control={form.control} name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country of Registration</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}  >
                                    <FormControl>
                                        <SelectTrigger className="!w-full">
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="!w-full">
                                        <SelectItem value="KYA">Kenya</SelectItem>
                                        <SelectItem value="GHN">Ghana</SelectItem>
                                        <SelectItem value="NGA">Nigeria</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField control={form.control} name="contact_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>

                                    <Input {...field} placeholder="Enter contact number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField control={form.control} name="business_website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>

                                    <Input {...field} placeholder="Enter website link" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* <FormField control={form.control} name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>

                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <div className="grid grid-cols-2 gap-3">

                    <FormField control={form.control} name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                    </FormControl>           <SelectContent>

                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="NGN">NGN</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                </div> */}

                    <div className="w-full flex mt-10">


                        <Button type="submit" className="!ml-auto min-w-[250px] max-w-[250px] self-end">Continue <ArrowRight className="h-4 w-4" /></Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};