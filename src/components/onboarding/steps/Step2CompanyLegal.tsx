"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPost } from "../_shared/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import React, { useState } from "react";
import FileUpload from "../_shared/FileUpload";

const schema = z.object({
    legal_name: z.string().min(1, "Legal name is required").min(2, "Must be at least 2 characters").max(100),
    entity_type: z.string().optional(),
    jurisdiction: z.string().optional(),
    certificate_of_incorporation: z.string(),
    registration_number: z.string().optional(),
    tax_identifier: z.string().optional().optional(),
    // address_line1: z.string().min(2).optional(),
    // city: z.string().min(2).optional(),
    // state: z.string().min(1).optional(),
    // postal_code: z.string().min(2).optional(),
});

export default function Step2CompanyLegal() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(schema), defaultValues: {
            legal_name: "",
            entity_type: "",
            jurisdiction: "",
            registration_number: "",
            tax_identifier: "",
            certificate_of_incorporation: "         "
            // address_line1: "",
            // estimated_monthly_spend: ""
        }
    });
    const [docs, setDocs] = useState<any[]>([]);

    async function onSubmit(values: any) {
        // await apiPost("/api/onboard/legal", {
        //     onboarding_id: document.cookie.split("onboarding_id=")[1]?.split(";")[0],
        //     ...values,
        //     documents: docs,
        // });
        router.push("/onboarding/step/3");
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-lg font-semibold">Tell us about your company</h2>

                <FormField name="legal_name" control={form.control} render={({ field }) => (
                    <FormItem>

                        <FormLabel>Legal name</FormLabel>
                        <FormControl>
                            <Input  {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-3">
                    <FormField name="entity_type" control={form.control} render={(field) => (
                        <FormItem>
                            <FormLabel>Entity type</FormLabel>
                            <Select>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a entity type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="corp">Corporation</SelectItem>
                                    <SelectItem value="llc">LLC</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />

                        </FormItem>
                    )} />
                    <FormField name="jurisdiction" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Jurisdiction</FormLabel>
                            <FormControl>

                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField name="certificate_of_incorporation" control={form.control} render={(field) => (
                    <FormItem>
                        <FormLabel>Documents</FormLabel>
                        <FormControl>

                            <FileUpload
                                label="Certificate of Incorporation"
                                onUploaded={(m) => setDocs((p: any[]) => [...p, { type: "certificate_of_incorporation", s3_key: "" }])}
                            />
                        </FormControl>
                        <FormMessage />

                    </FormItem>
                )} />

                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={() => router.push("/onboarding/step/1")}>Back</Button>
                    <Button type="submit">Continue</Button>
                </div>
            </form>
        </Form>
    );
}
