"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { apiPost } from "../_shared/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

const schema = z.object({
    company_name: z.string().min(1, "Company name is required").min(2, "Must be at least 2 characters").max(100),
    admin_name: z.string().min(1, "Admin name is required").min(2, "Must be at least 2 characters").max(100).regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    admin_email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(12, "Password must be at least 12 characters"),
    country: z.string().min(1, "Please select a country"),
    currency: z.string().min(1, "Please select a currency"),
    estimated_monthly_spend: z.string().optional(),
});

export default function Step1QuickSignup() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(schema), mode: 'onChange',
        defaultValues: {
            company_name: "",
            admin_name: "",
            admin_email: "",
            password: "",
            country: "",
            currency: "",
            estimated_monthly_spend: ""
        }
    });

    async function onSubmit(data: any) {
        try {

            // const res = await apiPost("/api/onboard/start", {
            //     company_name: data.company_name,
            //     admin_name: data.admin_name,
            //     admin_email: data.admin_email,
            //     country_of_operation: data.country,
            //     preferred_currency: data.currency,
            //     estimated_monthly_spend: data.estimated_monthly_spend,
            // });
            // if (res?.onboarding_id) Cookies.set("onboarding_id", res.onboarding_id);
            router.push("/onboarding/step/2");
        }
        catch (e) {
            console.warn(e)
        }
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-lg font-semibold">Create your admin account</h2>
                <p className="text-sm text-gray-600">
                    Start with a quick account so you can explore. If you want to go live, we’ll ask for legal & bank details.
                </p>

                <FormField control={form.control} name="company_name"
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>Company name</FormLabel>
                            <FormControl>

                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />


                <FormField control={form.control} name="admin_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin full name</FormLabel>
                            <FormControl>

                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField control={form.control} name="admin_email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin email</FormLabel>
                            <FormControl>

                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField control={form.control} name="password"
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
                    <FormField control={form.control} name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a currency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="KYA">Kenya</SelectItem>
                                        <SelectItem value="GHN">Ghana</SelectItem>
                                        <SelectItem value="NGA">Nigeria</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
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
                </div>

                <FormField control={form.control} name="estimated_monthly_spend"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estimated spend</FormLabel>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col"
                            >

                                <FormItem className="flex items-center gap-3">
                                    <FormControl>
                                        <RadioGroupItem value="<5k" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Less than $5k
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-3">
                                    <FormControl>
                                        <RadioGroupItem value="5k-25K" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        $5k-$25k
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            <FormMessage />
                        </FormItem>
                    )} />

                <Button type="submit">Continue</Button>
            </form>
        </Form>
    );
}
